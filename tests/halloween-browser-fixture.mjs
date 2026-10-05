// LOCAL UI QA ONLY. Binds to loopback, uses an in-memory database and fake auth.
// Never connects to Supabase, sends email or stores actual event/payment details.
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const runtime = process.env.HALLOWEEN_SQL_TEST_RUNTIME || join(process.env.TEMP || '/tmp', 'returningnris-halloween-sql-check')
const require = createRequire(join(runtime, 'package.json'))
const { PGlite } = require('@electric-sql/pglite')
const pg = new PGlite()
const userId = 'c6e187c0-dbf1-416c-8c3c-00ed3f5683b5'
await pg.exec(`create role anon; create role authenticated; create role service_role bypassrls;
  create schema auth; create table auth.users(id uuid primary key, created_at timestamptz default now());
  insert into auth.users(id) values('${userId}');`)
for (const file of ['202610050001_halloween_event.sql', '202610050002_halloween_delivery_payload.sql', '202610050003_halloween_family_tickets.sql', '202610050005_halloween_payment_pending_email.sql']) {
  await pg.exec(readFileSync(join(root, 'supabase/migrations', file), 'utf8'))
}
await pg.exec(`update public.halloween_events set venue='Local UI test venue',timings='Local UI test timings',
  upi_id='ui-fixture@invalid',payment_recipient_name='Local UI test recipient',
  payment_qr_image_url='http://127.0.0.1:54399/payment-test.svg',registration_open=false;
  insert into public.halloween_organisers(user_id) values('${userId}');`)
// Temporary local QR asset; it contains a TEST URL, never a payable UPI address.
const qrPath = join(root, 'public', 'halloween-ui-test-only-qr.png')
writeFileSync(qrPath, await QRCode.toBuffer('https://example.invalid/local-ui-test-only', { width:640, margin:4 }))
process.on('exit', () => { try { unlinkSync(qrPath) } catch { /* Already removed. */ } })
process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))
await pg.exec("update public.halloween_events set payment_qr_image_url='/halloween-ui-test-only-qr.png',registration_open=true")
const user = { id: userId, aud: 'authenticated', role: 'authenticated', email: 'organiser@example.invalid',
  email_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), user_metadata: { first_name: 'Test', last_name: 'Organiser' }, app_metadata: { provider: 'email', providers: ['email'] } }
const accessToken = `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')}.${Buffer.from(JSON.stringify({ sub: userId, exp: Math.floor(Date.now()/1000)+3600, role: 'authenticated' })).toString('base64url')}.fixture`
const tables = new Set(['halloween_events','halloween_bookings','halloween_tickets','halloween_notification_outbox','halloween_organisers','halloween_rate_limits'])
const listFunctions = new Set(['halloween_register','halloween_claim_notifications'])
const rpcParameters = {
  halloween_register: ['p_idempotency_key','p_contact_name','p_email','p_whatsapp_number','p_adult_count','p_child_count'],
  halloween_submit_payment: ['p_private_token','p_reference'],
  halloween_check_ticket: ['p_organiser_id','p_ticket','p_admit'],
  halloween_claim_notifications: ['p_limit'],
  halloween_finish_notification: ['p_id','p_lease_token','p_status','p_provider_message_id','p_error'],
  halloween_consume_rate_limit: ['p_bucket','p_limit','p_window_seconds'],
}
createServer(async (req,res) => {
  function json(value, status=200) { res.writeHead(status, { 'Content-Type':'application/json', 'Access-Control-Allow-Origin':'http://localhost:3001', 'Access-Control-Allow-Headers':req.headers['access-control-request-headers'] || 'authorization,apikey,content-type,x-client-info,x-supabase-api-version', 'Access-Control-Allow-Methods':'GET,POST,PATCH,DELETE,HEAD,OPTIONS', 'Access-Control-Expose-Headers':'content-range' }); res.end(JSON.stringify(value)) }
  if (req.method === 'OPTIONS') { json({}); return }
  const url = new URL(req.url, 'http://127.0.0.1:54399')
  let text = ''
  for await (const chunk of req) text += chunk.toString()
  const body = text ? JSON.parse(text) : {}
  try {
    if (url.pathname === '/__test/approve' && req.method === 'POST') {
      await pg.exec('update public.halloween_bookings set payment_verified=true'); json({ approved:true }); return
    }
    if (url.pathname === '/__test/revoke' && req.method === 'POST') {
      await pg.exec('update public.halloween_bookings set payment_verified=false'); json({ revoked:true }); return
    }
    if (url.pathname === '/auth/v1/token') { json({ access_token:accessToken, refresh_token:'fixture-refresh', expires_in:3600, expires_at:Math.floor(Date.now()/1000)+3600, token_type:'bearer', user }); return }
    if (url.pathname === '/auth/v1/user') { json(user); return }
    if (url.pathname === '/auth/v1/logout') { json({}); return }
    if (url.pathname === '/rest/v1/profiles') { json([{ id:userId,first_name:'Test',last_name:'Organiser',created_at:user.created_at }]); return }
    if (url.pathname.startsWith('/rest/v1/rpc/')) {
      const name = url.pathname.split('/').at(-1)
      if (!/^halloween_[a-z_]+$/.test(name)) { json({ message:'Fixture function not allowed' },400); return }
      const args = rpcParameters[name].map(key=>body[key])
      const call = `public.${name}(${args.map((_,i)=>`$${i+1}`).join(',')})`
      const { rows } = await pg.query(listFunctions.has(name) ? `select * from ${call}` : `select ${call} as value`, args)
      json(listFunctions.has(name) ? name === 'halloween_register' ? rows[0] : rows : rows[0].value); return
    }
    const table = url.pathname.split('/').at(-1)
    if (!tables.has(table)) { json({ message:'Fixture route not found' },404); return }
    const values = []
    const filters = []
    for (const [field, condition] of url.searchParams) {
      if (!/^[a-z_]+$/.test(field) || ['select','order','limit','offset','or'].includes(field)) continue
      const match = /^(eq|gt|gte|lt)\.(.*)$/.exec(condition)
      if (!match) continue
      values.push(match[2]); filters.push(`${field} ${{eq:'=',gt:'>',gte:'>=',lt:'<'}[match[1]]} $${values.length}`)
    }
    const where = filters.length ? ` where ${filters.join(' and ')}` : ''
    const columns = url.searchParams.get('select') || '*'
    if (!/^[a-z_,*]+$/.test(columns)) throw new Error('Bad fixture select')
    let sql
    if (req.method === 'PATCH') {
      const assignments = Object.entries(body).map(([field,value])=>{ if(!/^[a-z_]+$/.test(field)) throw new Error(); values.push(value); return `${field}=$${values.length}` })
      sql = `update public.${table} set ${assignments.join(',')}${where} returning ${columns}`
    } else if (req.method === 'DELETE') sql = `delete from public.${table}${where} returning *`
    else {
      sql = `select ${columns} from public.${table}${where}`
      const order = url.searchParams.get('order')
      if (order && /^[a-z_,.]+$/.test(order)) sql += ` order by ${order.split(',').map(o=>o.replace('.asc',' asc').replace('.desc',' desc')).join(',')}`
    }
    const { rows } = await pg.query(sql, values)
    res.setHeader('content-range', `0-${Math.max(rows.length-1,0)}/${rows.length}`)
    json(req.headers.accept?.includes('application/vnd.pgrst.object+json') ? rows[0] : rows)
  } catch (error) { json({ message:error.message,code:error.code || 'fixture_error' },400) }
}).listen(54399, '127.0.0.1', () => console.log('Isolated Halloween UI fixture listening on 127.0.0.1:54399. No external services used.'))
// Validate the QR dependency in the same fixture runtime.
await QRCode.toDataURL('https://example.invalid/events/halloween/ticket#' + 'a'.repeat(64), { width:640, margin:4 })
