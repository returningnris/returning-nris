import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash, createHmac } from 'node:crypto'
import vm from 'node:vm'
import ts from 'typescript'

// Temporary test-only PostgreSQL engine; never connects to real Supabase or Resend.
// See docs/halloween-website.md for the optional runtime install command.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const runtime = process.env.HALLOWEEN_SQL_TEST_RUNTIME || join(process.env.TEMP || '/tmp', 'returningnris-halloween-sql-check')
const runtimeRequire = createRequire(join(runtime, 'package.json'))
const { PGlite } = runtimeRequire('@electric-sql/pglite')
const nativeRequire = createRequire(import.meta.url)
const organiserId = '5b2451eb-e113-43b7-9c7c-d1dbd5441af1'

test('real SQL + website endpoints + outbox worker in an isolated PostgreSQL database', async t => {
  const pg = new PGlite()
  await pg.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create table auth.users(id uuid primary key, created_at timestamptz default now());
    insert into auth.users(id) values('${organiserId}');`)
  for (const file of ['202610050001_halloween_event.sql', '202610050002_halloween_delivery_payload.sql', '202610050003_halloween_family_tickets.sql']) {
    await pg.exec(readFileSync(join(root, 'supabase/migrations', file), 'utf8'))
  }
  await pg.exec(readFileSync(join(root, 'supabase/migrations/202610050005_halloween_payment_pending_email.sql'), 'utf8'))
  await pg.exec(readFileSync(join(root, 'supabase/migrations/202610050005_halloween_payment_pending_email.sql'), 'utf8'))
  await pg.exec(readFileSync(join(root, 'supabase/tests/halloween-event.sql'), 'utf8'))
  await pg.exec(`update public.halloween_events set venue='Isolated Test Venue',timings='Test only',upi_id='test@example',
    payment_recipient_name='Test only',payment_qr_image_url='/test-qr.png',registration_open=true;
    insert into public.halloween_organisers(user_id) values('${organiserId}');`)

  // Minimal Supabase query adapter, backed by real PostgreSQL constraints and functions.
  class Query {
    constructor(table) { this.table = table; this.columns = '*'; this.filters = []; this.values = []; this.orders = []; this.operation = 'select' }
    select(columns = '*', options = {}) { this.columns = columns; this.options = options; return this }
    update(values) { this.operation = 'update'; this.patch = values; return this }
    delete() { this.operation = 'delete'; return this }
    filter(column, operator, value) { this.values.push(value); this.filters.push(`${column} ${operator} $${this.values.length}`); return this }
    eq(c,v) { return this.filter(c,'=',v) }
    gt(c,v) { return this.filter(c,'>',v) }
    gte(c,v) { return this.filter(c,'>=',v) }
    lt(c,v) { return this.filter(c,'<',v) }
    order(column) { this.orders.push(column); return this }
    or(value) {
      assert.match(value, /^status\.eq\.failed,and\(status\.eq\.processing,locked_until\.lt\./)
      this.filters.push("(status='failed' or (status='processing' and locked_until < now()))")
      return this
    }
    maybeSingle() { return this.execute(true) }
    single() { return this.execute(true) }
    then(yes,no) { return this.execute(false).then(yes,no) }
    async execute(single) {
      try {
        const where = this.filters.length ? ` where ${this.filters.join(' and ')}` : ''
        let sql
        if (this.operation === 'update') {
          const assignments = Object.entries(this.patch).map(([field, value]) => {
            this.values.push(value); return `${field}=$${this.values.length}`
          })
          sql = `update public.${this.table} set ${assignments.join(',')}${where} returning ${this.columns}`
        } else if (this.operation === 'delete') sql = `delete from public.${this.table}${where} returning *`
        else sql = `select ${this.options?.count ? 'count(*)::integer as count' : this.columns} from public.${this.table}${where}`
        if (this.orders.length) sql += ` order by ${this.orders.join(',')}`
        const result = await pg.query(sql, this.values)
        return { data: this.options?.head ? null : single ? result.rows[0] || null : result.rows,
          count: this.options?.count ? result.rows[0].count : null, error: null }
      } catch (error) { return { data: null, error: { message: error.message, code: error.code } } }
    }
  }
  const rpcLists = new Set(['halloween_register', 'halloween_claim_notifications'])
  const rpcParameters = {
    halloween_register: ['p_idempotency_key','p_contact_name','p_email','p_whatsapp_number','p_adult_count','p_child_count'],
    halloween_submit_payment: ['p_private_token','p_reference'],
    halloween_check_ticket: ['p_organiser_id','p_ticket','p_admit'],
    halloween_claim_notifications: ['p_limit'],
    halloween_finish_notification: ['p_id','p_lease_token','p_status','p_provider_message_id','p_error'],
    halloween_consume_rate_limit: ['p_bucket','p_limit','p_window_seconds'],
  }
  const db = {
    from: table => new Query(table),
    async rpc(name, params) {
      const values = rpcParameters[name].map(key=>params[key])
      const call = `public.${name}(${values.map((_,i) => `$${i+1}`).join(',')})`
      try {
        const result = await pg.query(rpcLists.has(name) ? `select * from ${call}` : `select ${call} as value`, values)
        return { data: rpcLists.has(name) ? name === 'halloween_register' ? result.rows[0] : result.rows : result.rows[0].value, error: null }
      } catch (error) { return { data: null, error: { message: error.message, code: error.code } } }
    },
  }
  const fakeEnv = { HALLOWEEN_SECURITY_SECRET: 'isolated-test-secret', SITE_URL: 'https://test.example',
    RESEND_API_KEY: 'fake-key-no-real-send', RESEND_FROM_EMAIL: 'test@example.invalid', CRON_SECRET: 'test-worker-secret' }
  const provider = { calls: [], accepted: new Map(), fail: false }
  class FakeResend {
    emails = { send: async (payload, options) => {
      provider.calls.push({ payload: JSON.stringify(payload), key: options.idempotencyKey })
      if (provider.fail) return { data: null, error: { name: 'test_failure' } }
      if (!provider.accepted.has(options.idempotencyKey)) provider.accepted.set(options.idempotencyKey, 'test-provider-' + provider.accepted.size)
      return { data: { id: provider.accepted.get(options.idempotencyKey) }, error: null }
    } }
  }
  const modules = new Map()
  function load(file) {
    const path = resolve(root, file)
    if (modules.has(path)) return modules.get(path)
    const exports = {}
    modules.set(path, exports)
    const compiled = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
    } }).outputText
    const require = spec => {
      if (spec === 'server-only') return {}
      if (spec === 'resend') return { Resend: FakeResend }
      if (spec.endsWith('supabase-admin')) return { getSupabaseAdmin: () => db }
      if (spec.endsWith('supabase-server')) return { requireAuthenticatedUser: async request =>
        request.headers.get('authorization') === 'Bearer test-organiser' ? { user: { id: organiserId } } : { errorResponse: true } }
      if (spec.startsWith('@/')) return load(spec.slice(2) + '.ts')
      if (spec.startsWith('.')) return load(resolve(dirname(path), spec) + '.ts')
      return nativeRequire(spec)
    }
    vm.runInNewContext(compiled, { exports, require, process: { env: fakeEnv }, Buffer, URL, Request, Response,
      Uint8Array, Date, Error, setTimeout, clearTimeout }, { filename: path })
    return exports
  }
  const server = load('lib/halloween-server.ts')
  const api = load('app/api/halloween/route.ts')
  const worker = load('app/api/halloween/notifications/route.ts')
  function request(body, authorised = false, origin = 'https://test.example') {
    return new Request('https://test.example/api/halloween', { method: 'POST', headers: {
      origin, 'content-type': 'application/json', ...(authorised ? { authorization: 'Bearer test-organiser' } : {}),
    }, body: JSON.stringify(body) })
  }
  function challenge() {
    const timestamp = Date.now() - 3000
    const nonce = '1'.repeat(32)
    const ip = createHmac('sha256', fakeEnv.HALLOWEEN_SECURITY_SECRET).update('local').digest('hex')
    const signature = createHmac('sha256', fakeEnv.HALLOWEEN_SECURITY_SECRET).update(`${timestamp}.${nonce}:${ip}`).digest('hex')
    return `${timestamp}.${nonce}.${signature}`
  }
  const registration = { action: 'register', contactName: 'Test Family', email: 'test@example.invalid',
    whatsapp: '+919999999999', adults: 3, children: 2,
    idempotencyKey: '9c8e918c-d7e0-4e7f-bd59-d0e3515b5d05', amount: 1 }
  let privateToken
  let bookingId
  let ticket

  await t.test('registration rejects cross-origin, forged and honeypot requests', async () => {
    assert.equal((await api.POST(request({ ...registration, challenge: challenge() }, false, 'https://evil.example'))).status, 403)
    assert.equal((await api.POST(request({ ...registration, challenge: 'forged' }))).status, 400)
    assert.equal((await api.POST(request({ ...registration, challenge: challenge(), website: 'spam' }))).status, 400)
  })
  await t.test('registration is server priced and repeated clicks reuse one booking', async () => {
    const response = await api.POST(request({ ...registration, challenge: challenge() }))
    assert.equal(response.status, 201)
    privateToken = (await response.json()).token
    const repeated = await api.POST(request({ ...registration, challenge: challenge() }))
    assert.equal((await repeated.json()).token, privateToken)
    const rows = (await pg.query('select * from public.halloween_bookings')).rows
    assert.equal(rows.length, 1); assert.equal(rows[0].amount_inr, 1500)
    assert.equal(rows[0].payment_verified, false); bookingId = rows[0].id
  })
  await t.test('private access rejects references and other tokens; responses are not cached', async () => {
    for (const token of ['HW26-00000001', 'f'.repeat(64)]) {
      assert.equal((await api.POST(request({ action: 'booking', token }))).status, 404)
    }
    const response = await api.POST(request({ action: 'booking', token: privateToken }))
    assert.equal(response.headers.get('cache-control'), 'private, no-store')
    const data = await response.json()
    assert.equal(data.booking.amount_inr, 1500); assert.equal(data.tickets.length, 0)
    assert.equal(data.booking.email, undefined); assert.equal(data.booking.private_access_token, undefined)
  })
  await t.test('payment reference submission is pending and repeat-safe', async () => {
    const body = { action: 'payment', token: privateToken, reference: 'TEST123456789' }
    assert.equal((await api.POST(request(body))).status, 200)
    const data = await (await api.POST(request(body))).json()
    assert.equal(data.booking.payment_verified, false); assert.ok(data.booking.payment_submitted_at)
    assert.equal((await api.POST(request({ ...body, reference: 'OTHER123456' }))).status, 409)
  })
  await t.test('payment submission queues one pending email without a ticket link; repeat submission does not resend', async () => {
    assert.equal((await pg.query("select count(*)::integer as n from public.halloween_notification_outbox where kind='payment_pending'")).rows[0].n, 1)
    assert.equal((await (await worker.GET(workerRequest())).json()).accepted, 1)
    assert.match(provider.calls[0].payload, /Payment pending verification/)
    assert.match(provider.calls[0].payload, /Once your payment is confirmed/)
    assert.ok(!provider.calls[0].payload.includes(privateToken))
    await api.POST(request({action:'payment',token:privateToken,reference:'TEST123456789'}))
    await worker.GET(workerRequest())
    assert.equal(provider.calls.length,1)
    provider.calls=[]
  })
  await t.test('direct SQL Boolean edit creates ONE family ticket and queues only one notification', async () => {
    await pg.query('update public.halloween_bookings set payment_verified=true where id=$1', [bookingId])
    await pg.query('update public.halloween_bookings set payment_verified=true where id=$1', [bookingId])
    const data = await (await api.POST(request({ action: 'booking', token: privateToken }))).json()
    assert.equal(data.tickets.length, 1)
    assert.equal(data.tickets[0].category, 'family')
    assert.equal(data.booking.adult_count, 3); assert.equal(data.booking.child_count, 2)
    ticket = data.tickets[0].ticket_identifier
    assert.equal((await pg.query('select count(*)::integer as n from public.halloween_notification_outbox where kind=$$booking_confirmation$$')).rows[0].n, 1)
  })
  await t.test('unauthenticated lookup denied; explicit admission cannot be repeated', async () => {
    assert.equal((await api.POST(request({ action: 'checkin', ticket, admit: false }))).status, 401)
    let data = await (await api.POST(request({ action: 'checkin', ticket, admit: false }, true))).json()
    assert.equal(data.status, 'Ready for admission')
    assert.equal(data.adult_count, 3); assert.equal(data.child_count, 2)
    data = await (await api.POST(request({ action: 'checkin', ticket, admit: true }, true))).json()
    assert.equal(data.status, 'Checked in')
    data = await (await api.POST(request({ action: 'checkin', ticket, admit: true }, true))).json()
    assert.equal(data.status, 'Already checked in')
  })
  function workerRequest(secret = 'test-worker-secret') {
    return new Request('https://test.example/api/halloween/notifications', { headers: { authorization: `Bearer ${secret}` } })
  }
  await t.test('worker is protected, retries preserve payload, sent requires provider acceptance', async () => {
    assert.equal((await worker.GET(workerRequest('wrong'))).status, 401)
    provider.fail = true
    assert.equal((await (await worker.GET(workerRequest())).json()).failed, 1)
    let row = (await pg.query('select * from public.halloween_notification_outbox where kind=$$booking_confirmation$$')).rows[0]
    assert.equal(row.status, 'failed'); assert.equal(row.sent_at, null)
    assert.match(row.delivery_payload.text, /₹1,500/)
    await pg.exec("update public.halloween_events set name='Changed after first attempt'")
    await pg.exec('update public.halloween_notification_outbox set next_attempt_at=now() where kind=$$booking_confirmation$$')
    provider.fail = false
    assert.equal((await (await worker.GET(workerRequest())).json()).accepted, 1)
    assert.equal(createHash('sha256').update(provider.calls[0].payload).digest('hex'),
      createHash('sha256').update(provider.calls[1].payload).digest('hex'))
    assert.equal(provider.calls[0].key, provider.calls[1].key)
    row = (await pg.query('select * from public.halloween_notification_outbox where kind=$$booking_confirmation$$')).rows[0]
    assert.equal(row.status, 'sent'); assert.ok(row.provider_message_id); assert.ok(row.sent_at)
    assert.match(row.delivery_payload.subject, /Payment confirmed/)
    assert.ok(row.delivery_payload.text.includes(`/booking#${privateToken}`))
    await worker.GET(workerRequest())
    assert.equal(provider.calls.length, 2)
  })
  await t.test('revocation blocks admission, reconfirmation reuses tickets and WhatsApp is manual', async () => {
    const tokens = (await pg.query('select validation_token from public.halloween_tickets order by validation_token')).rows
    const ref = (await pg.query('select booking_reference from public.halloween_bookings')).rows[0].booking_reference
    let response = await api.POST(request({ action: 'confirmation', reference: ref }, true))
    assert.match((await response.json()).whatsapp_url, /^https:\/\/wa.me\//)
    await pg.query('update public.halloween_bookings set payment_verified=false where id=$1', [bookingId])
    const data = await (await api.POST(request({ action: 'checkin', ticket, admit: true }, true))).json()
    assert.equal(data.status, 'Payment not verified')
    response = await api.POST(request({ action: 'confirmation', reference: ref }, true))
    assert.equal((await response.json()).whatsapp_url, null)
    await pg.query('update public.halloween_bookings set payment_verified=true where id=$1', [bookingId])
    assert.deepEqual((await pg.query('select validation_token from public.halloween_tickets order by validation_token')).rows, tokens)
    assert.equal((await (await api.POST(request({ action: 'checkin', ticket, admit: true }, true))).json()).status, 'Already checked in')
  })
  await t.test('missing email preserves confirmed tickets and produces manual-required status', async () => {
    delete fakeEnv.RESEND_API_KEY
    await pg.exec("update public.halloween_notification_outbox set status='pending',next_attempt_at=now() where kind='booking_confirmation'")
    assert.equal((await (await worker.GET(workerRequest())).json()).manual, 1)
    assert.equal((await pg.query('select status from public.halloween_notification_outbox where kind=$$booking_confirmation$$')).rows[0].status, 'manual_required')
    assert.equal((await pg.query('select payment_verified from public.halloween_bookings')).rows[0].payment_verified, true)
    assert.equal((await pg.query('select count(*)::integer as n from public.halloween_tickets')).rows[0].n, 1)
    fakeEnv.RESEND_API_KEY = 'fake-key-no-real-send'
    await pg.exec("update public.halloween_notification_outbox set status='pending',next_attempt_at=now(),first_attempt_at=now()-interval '25 hours' where kind='booking_confirmation'")
    const callCount = provider.calls.length
    assert.equal((await (await worker.GET(workerRequest())).json()).manual, 1)
    assert.equal(provider.calls.length, callCount)
  })
  await t.test('persistent rate limits fail closed and malicious bodies are bounded', async () => {
    const req = request({ action: 'booking' })
    await server.halloweenRateLimit(req, 'isolated-limit', 1, 60)
    await assert.rejects(() => server.halloweenRateLimit(req, 'isolated-limit', 1, 60), /Too many requests/)
    const response = await api.POST(request({ action: 'booking', padding: 'x'.repeat(9000) }))
    assert.equal(response.status, 413)
  })
  await t.test('approval cancels a failed pending notice and sends only the current confirmation', async () => {
    const { data: second } = await db.rpc('halloween_register', {
      p_idempotency_key: '8957a4cc-26ac-4ec9-872b-6081600cb45b', p_contact_name: 'Test Family',
      p_email: 'second@example.invalid', p_whatsapp_number: '+919876543210', p_adult_count: 2, p_child_count: 1,
    })
    assert.ok(second)
    await db.rpc('halloween_submit_payment', {p_private_token: second.private_access_token, p_reference: 'TEST987654321'})
    provider.fail = true
    assert.equal((await (await worker.GET(workerRequest())).json()).failed, 1)
    provider.fail = false
    await pg.query('update public.halloween_bookings set payment_verified=true where private_access_token=$1', [second.private_access_token])
    const notices = (await pg.query('select kind,status from public.halloween_notification_outbox where booking_id=(select id from public.halloween_bookings where private_access_token=$1)', [second.private_access_token])).rows
    assert.equal(notices.find(row=>row.kind==='payment_pending').status,'cancelled')
    assert.equal((await (await worker.GET(workerRequest())).json()).accepted, 1)
    assert.match(provider.calls.at(-1).payload, /Payment confirmed/)
  })
  await pg.close()
})

test('family migration safely invalidates old attendee codes and preserves admission audit', async () => {
  const pg = new PGlite()
  await pg.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create table auth.users(id uuid primary key,created_at timestamptz default now());
    insert into auth.users(id) values('${organiserId}');`)
  await pg.exec(readFileSync(join(root,'supabase/migrations/202610050001_halloween_event.sql'),'utf8'))
  await pg.exec(`insert into public.halloween_organisers(user_id) values('${organiserId}');
    insert into public.halloween_bookings(event_id,idempotency_key,contact_name,email,whatsapp_number,adult_count,child_count,payment_verified)
    values('halloween-2026',gen_random_uuid(),'Legacy test','legacy@example.invalid','+919999999999',3,2,true)`)
  const legacy = (await pg.query('select validation_token from public.halloween_tickets limit 1')).rows[0].validation_token
  await pg.query('update public.halloween_tickets set checked_in_at=now(),checked_in_by=$1 where validation_token=$2',[organiserId,legacy])
  const migration = readFileSync(join(root,'supabase/migrations/202610050003_halloween_family_tickets.sql'),'utf8')
  await pg.exec(migration)
  await pg.exec(migration)
  const rows = (await pg.query("select * from public.halloween_tickets where category='family'")).rows
  assert.equal(rows.length,1); assert.ok(rows[0].checked_in_at)
  assert.equal((await pg.query("select count(*)::integer as n from public.halloween_tickets where category in ('adult','child')")).rows[0].n,5)
  assert.equal((await pg.query('select public.halloween_check_ticket($1,$2,false) as data',[organiserId,legacy])).rows[0].data.status,'Invalid ticket')
  assert.equal((await pg.query('select public.halloween_check_ticket($1,$2,true) as data',[organiserId,rows[0].validation_token])).rows[0].data.status,'Already checked in')
  await pg.close()
})
