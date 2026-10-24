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
  await pg.exec(readFileSync(join(root, 'supabase/migrations/202610120001_halloween_quantium_discount.sql'), 'utf8'))
  await pg.exec(readFileSync(join(root, 'supabase/migrations/202610120002_halloween_organiser_review.sql'), 'utf8'))
  await pg.exec(`insert into public.halloween_bookings(event_id, idempotency_key, contact_name, email, whatsapp_number, adult_count, child_count, coupon_code)
    values ('halloween-2026', '20000000-0000-4000-8000-000000000001', 'Legacy family', 'legacy@example.com', '+919876543210', 3, 2, 'QUANTIUM50')`)
  await pg.exec(readFileSync(join(root, 'supabase/migrations/202610230001_halloween_quantium250_limit.sql'), 'utf8'))
  await pg.exec(readFileSync(join(root, 'supabase/migrations/202610230002_halloween_sponsor_booking_limits.sql'), 'utf8'))
  for (const oldCode of ['AIRADENTAL200', 'DRIPBAR200']) {
    await pg.query(`insert into public.halloween_bookings(event_id,idempotency_key,contact_name,email,whatsapp_number,adult_count,child_count,coupon_code)
      select 'halloween-2026',gen_random_uuid(),'Legacy sponsor','legacy@example.com','+919876543210',1,1,$1 from generate_series(1,10)`, [oldCode])
  }
  await pg.exec(readFileSync(join(root, 'supabase/migrations/202610230003_halloween_sponsor250.sql'), 'utf8'))
  await pg.exec(readFileSync(join(root, 'supabase/migrations/202610240001_halloween_special_invite.sql'), 'utf8'))
  for (const [oldCode, newCode] of [['AIRADENTAL200', 'AIRADENTAL250'], ['DRIPBAR200', 'DRIPBAR250']]) {
    assert.equal((await pg.query('select amount_inr from public.halloween_bookings where coupon_code=$1', [oldCode])).rows[0].amount_inr, 300)
    await assert.rejects(pg.query(`insert into public.halloween_bookings(event_id,idempotency_key,contact_name,email,whatsapp_number,adult_count,child_count,coupon_code)
      values ('halloween-2026',gen_random_uuid(),'New sponsor','new@example.com','+919876543210',1,1,$1)`, [newCode]), /Coupon limit exceeded/)
  }
  for (const code of ['QUANTIUM50', 'AIRADENTAL200', 'DRIPBAR200']) {
    await assert.rejects(pg.query(`insert into public.halloween_bookings(event_id,idempotency_key,contact_name,email,whatsapp_number,adult_count,child_count,coupon_code)
      values ('halloween-2026',gen_random_uuid(),'Retired code','old@example.com','+919876543210',1,1,$1)`, [code]), /Invalid coupon code/)
  }
  await pg.exec("delete from public.halloween_bookings where coupon_code in ('AIRADENTAL200','DRIPBAR200')")
  assert.equal((await pg.query("select amount_inr from public.halloween_bookings where coupon_code='QUANTIUM50'")).rows[0].amount_inr, 1350)
  await pg.exec("delete from public.halloween_bookings where coupon_code='QUANTIUM50'")
  await pg.exec(`update public.halloween_events set venue='Isolated Test Venue',timings='Test only',upi_id='test@example',
    payment_recipient_name='Test only',payment_qr_image_url='/test-qr.png',registration_open=true;
    insert into public.halloween_organisers(user_id) values('${organiserId}');`)

  await t.test('special invitation confirms a free family ticket without payment and retries safely', async () => {
    await pg.exec('begin')
    try {
      const args = "'84663ac2-a250-41e0-bf7c-27bd6cd329f1','Invited family','vip@example.com','+919876543210',4,2,' spookyvip2026 '"
      const { rows: [booking] } = await pg.query(`select * from public.halloween_register(${args})`)
      assert.equal(booking.amount_inr, 0)
      assert.equal(booking.payment_verified, true)
      assert.equal(booking.transaction_reference, null)
      assert.equal((await pg.query('select * from public.halloween_tickets where booking_id=$1', [booking.id])).rows.length, 1)
      assert.equal((await pg.query('select * from public.halloween_notification_outbox where booking_id=$1', [booking.id])).rows.length, 1)
      assert.equal((await pg.query(`select * from public.halloween_register(${args})`)).rows[0].id, booking.id)
      await pg.query('update public.halloween_bookings set payment_verified=false where id=$1', [booking.id])
      assert.equal((await pg.query(`select * from public.halloween_register(${args})`)).rows[0].payment_verified, false)
    } finally { await pg.exec('rollback') }
  })

  await t.test('Quantium SQL pricing, retries, invalid codes and existing totals', async () => {
    await pg.exec('begin')
    try {
      const key = '9c03013a-b784-43d5-a43c-41982d65b4a1'
      const args = `'${key}', 'Quantium family', 'quantium@example.com', '+919876543210', 3, 2`
      const { rows } = await pg.query(`select * from public.halloween_register(${args}, ' quantium250 ')`)
      assert.equal(rows[0].amount_inr, 750)
      assert.equal(rows[0].coupon_code, 'QUANTIUM250')
      const retry = await pg.query(`select * from public.halloween_register(${args}, 'QUANTIUM250')`)
      assert.equal(retry.rows[0].id, rows[0].id)
      await pg.exec('savepoint invalid_coupon')
      await assert.rejects(pg.query(`select * from public.halloween_register(${args}, 'INVALID')`), /Invalid coupon/)
      await pg.exec('rollback to savepoint invalid_coupon')
      await assert.rejects(pg.query(`select * from public.halloween_register(${args}, '')`), /Idempotency key/)
      await pg.exec('rollback to savepoint invalid_coupon')
      const fullPrice = await pg.query(`select * from public.halloween_register('a1ea805d-844f-4991-97e2-7a1b010f2d23', 'Regular family', 'regular@example.com', '+919876543210', 3, 2)`)
      assert.equal(fullPrice.rows[0].amount_inr, 1500)
    } finally { await pg.exec('rollback') }
  })

  // Minimal Supabase query adapter, backed by real PostgreSQL constraints and functions.
  class Query {
    constructor(table) { this.table = table; this.columns = '*'; this.filters = []; this.values = []; this.orders = []; this.operation = 'select' }
    select(columns = '*', options = {}) { this.columns = columns; this.options = options; return this }
    update(values) { this.operation = 'update'; this.patch = values; return this }
    delete() { this.operation = 'delete'; return this }
    filter(column, operator, value) { this.values.push(value); this.filters.push(`${column} ${operator} $${this.values.length}`); return this }
    in(c,values) { this.filters.push(`${c} in (${values.map(value => { this.values.push(value); return '$' + this.values.length }).join(',')})`); return this }
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
    halloween_register: ['p_idempotency_key','p_contact_name','p_email','p_whatsapp_number','p_adult_count','p_child_count','p_coupon_code'],
    halloween_submit_payment: ['p_private_token','p_reference'],
    halloween_approve_payment: ['p_review_token','p_reference','p_amount'],
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

  await t.test('coupon preview needs no contact details and creates no booking', async () => {
    const before = await pg.query('select count(*) from public.halloween_bookings')
    const valid = await api.POST(request({ action: 'coupon', couponCode: ' quantium250 ' }))
    assert.equal(valid.status, 200)
    assert.equal((await valid.json()).applied, true)
    const invalid = await api.POST(request({ action: 'coupon', couponCode: 'INVALID' }))
    assert.equal(invalid.status, 400)
    assert.equal((await invalid.json()).code, 'INVALID_COUPON')
    const empty = await api.POST(request({ action: 'coupon', couponCode: '' }))
    assert.equal((await empty.json()).applied, false)
    assert.equal((await api.POST(request({ action: 'coupon', couponCode: 'QUANTIUM250' }, false, 'https://evil.example'))).status, 403)
    const after = await pg.query('select count(*) from public.halloween_bookings')
    assert.equal(after.rows[0].count, before.rows[0].count)
  })

  await t.test('coupon is applied only by the server after submission, and invalid codes remain correctable', async () => {
    await pg.exec('begin')
    try {
      const draft = { ...registration, idempotencyKey: 'b32f2390-9362-46b4-8edb-a69ef220c590', challenge: challenge(), couponCode: 'INVALID' }
      const invalid = await api.POST(request(draft))
      assert.equal(invalid.status, 400)
      assert.equal((await invalid.json()).code, 'INVALID_COUPON')
      const valid = await api.POST(request({ ...draft, couponCode: ' quantium250 ' }))
      assert.equal(valid.status, 201)
      const { token } = await valid.json()
      const result = await api.POST(request({ action: 'booking', token }))
      const data = await result.json()
      assert.equal(data.booking.amount_inr, 750)
      assert.equal(data.booking.coupon_applied, true)
      assert.equal(data.booking.coupon_code, undefined)
      assert.doesNotMatch(JSON.stringify(data), /QUANTIUM250/)
    } finally { await pg.exec('rollback') }
  })

  for (const [code, limit, unitPrice] of [['QUANTIUM250', 30, 250], ['AIRADENTAL250', 10, 250], ['DRIPBAR250', 10, 250]]) {
    await t.test(`${code} counts bookings, preserves attribution and rejects stale coupon use at ${limit}`, async () => {
      await pg.exec('begin')
      try {
        // Every family has 50 paid tickets, but each consumes only one booking.
        await pg.query(`select public.halloween_register(gen_random_uuid(), 'Limit family', 'limit@example.com', '+919876543210', 50, 50, $1) from generate_series(1, $2::integer)`, [code, limit - 1])
        const preview = await api.POST(request({ action: 'coupon', couponCode: code, adults: 50, children: 50 }))
        assert.equal(preview.status, 200)
        const offer = (await preview.json()).offer
        assert.equal(offer.discountPerTicket, 500 - unitPrice)
        assert.equal(offer.bookingLimit, limit)
        const draft = { ...registration, adults: 50, children: 50, couponCode: code, challenge: challenge() }
        const last = await api.POST(request(draft))
        assert.equal(last.status, 201)
        const { token } = await last.json()
        const stored = (await pg.query('select * from public.halloween_bookings where private_access_token=$1', [token])).rows[0]
        assert.equal(stored.coupon_code, code)
        assert.equal(stored.amount_inr, 50 * unitPrice)
        const lookup = await api.POST(request({ action: 'confirmation', reference: stored.booking_reference }, true))
        assert.equal(lookup.status, 200)
        assert.equal((await lookup.json()).booking.coupon_code, code)
        const denied = await api.POST(request({ action: 'confirmation', reference: stored.booking_reference }))
        assert.notEqual(denied.status, 200)
        const retry = await api.POST(request(draft))
        assert.equal(retry.status, 201)
        assert.equal((await retry.json()).token, token)
        const exhausted = await api.POST(request({ action: 'coupon', couponCode: code }))
        assert.equal(exhausted.status, 409)
        assert.equal((await exhausted.json()).code, 'COUPON_LIMIT_EXCEEDED')
        await pg.exec('savepoint full_capacity')
        const stale = await api.POST(request({ ...draft, idempotencyKey: '10000000-0000-4000-8000-000000000002' }))
        assert.equal(stale.status, 409)
        assert.equal((await stale.json()).code, 'COUPON_LIMIT_EXCEEDED')
        await pg.exec('rollback to savepoint full_capacity')
        const regular = await api.POST(request({ ...draft, couponCode: '', idempotencyKey: '10000000-0000-4000-8000-000000000003' }))
        assert.equal(regular.status, 201)
        const otherCode = code === 'DRIPBAR250' ? 'AIRADENTAL250' : 'DRIPBAR250'
        const other = await api.POST(request({ ...draft, couponCode: otherCode, idempotencyKey: '10000000-0000-4000-8000-000000000004' }))
        assert.equal(other.status, 201)
        await pg.exec(readFileSync(join(root, 'supabase/halloween-coupon-analytics.sql'), 'utf8'))
        await pg.exec('savepoint direct_insert')
        await assert.rejects(pg.query(`insert into public.halloween_bookings(event_id, idempotency_key, contact_name, email, whatsapp_number, adult_count, child_count, coupon_code) values ('halloween-2026', gen_random_uuid(), 'Direct booking', 'limit@example.com', '+919876543210', 1, 1, $1)`, [code]), /Coupon limit exceeded/)
        await pg.exec('rollback to savepoint direct_insert')
      } finally { await pg.exec('rollback') }
    })
  }

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
    assert.equal((await (await worker.GET(workerRequest())).json()).accepted, 2)
    const familyEmail = provider.calls.find(call => call.payload.includes('Payment pending verification'))
    const organiserEmail = provider.calls.find(call => call.payload.includes('returningnris@gmail.com'))
    assert.ok(organiserEmail); assert.match(organiserEmail.payload, /payment-review#/); assert.match(organiserEmail.payload, /TEST123456789/)
    assert.match(familyEmail.payload, /Payment pending verification/)
    assert.match(familyEmail.payload, /Once your payment is confirmed/)
    assert.ok(!provider.calls[0].payload.includes(privateToken))
    await api.POST(request({action:'payment',token:privateToken,reference:'TEST123456789'}))
    await worker.GET(workerRequest())
    assert.equal(provider.calls.length,2)
    provider.calls=[]
  })
  await t.test('email review link previews only, approves once, and cannot use family tokens', async () => {
    await pg.exec('begin')
    try {
      const token = (await pg.query('select payment_review_token from public.halloween_bookings where id=$1', [bookingId])).rows[0].payment_review_token
      const preview = await api.POST(request({ action: 'payment-review', token }))
      assert.equal(preview.status, 200)
      assert.equal((await preview.json()).booking.payment_verified, false)
      assert.equal((await api.POST(request({ action: 'payment-review', token: privateToken }))).status, 404)
      assert.equal((await api.POST(request({ action: 'approve-payment', token, reference: 'TEST123456789', amount: 1500 }))).status, 400)
      await pg.exec('savepoint wrong_reference')
      assert.equal((await api.POST(request({ action: 'approve-payment', token, confirmReceived: true, reference: 'WRONG12345', amount: 1500 }))).status, 409)
      await pg.exec('rollback to savepoint wrong_reference')
      const body = { action: 'approve-payment', token, confirmReceived: true, reference: 'TEST123456789', amount: 1500 }
      assert.equal((await api.POST(request(body))).status, 200)
      assert.equal((await api.POST(request(body))).status, 200)
      assert.equal((await pg.query('select count(*)::int as n from public.halloween_tickets where booking_id=$1', [bookingId])).rows[0].n, 1)
      assert.equal((await pg.query("select count(*)::int as n from public.halloween_notification_outbox where booking_id=$1 and kind='booking_confirmation'", [bookingId])).rows[0].n, 1)
      await pg.query('update public.halloween_bookings set payment_verified=false where id=$1', [bookingId])
      assert.equal((await api.POST(request(body))).status, 410)
    } finally { await pg.exec('rollback') }
  })
  await t.test('review approval rejects reused references and expired links', async () => {
    await pg.exec('begin')
    try {
      const token = (await pg.query('select payment_review_token from public.halloween_bookings where id=$1', [bookingId])).rows[0].payment_review_token
      const { data: duplicate } = await db.rpc('halloween_register', {
        p_idempotency_key: '322b5421-a4ac-4a6c-9065-e46d3c9e32be', p_contact_name: 'Duplicate reference',
        p_email: 'duplicate@example.invalid', p_whatsapp_number: '+919876543210', p_adult_count: 1, p_child_count: 1,
      })
      await db.rpc('halloween_submit_payment', { p_private_token: duplicate.private_access_token, p_reference: 'TEST123456789' })
      const body = { action: 'approve-payment', token, confirmReceived: true, reference: 'TEST123456789', amount: 1500 }
      const preview = await api.POST(request({ action: 'payment-review', token }))
      assert.equal((await preview.json()).reference_reused, true)
      await pg.exec('savepoint duplicate_reference')
      assert.equal((await api.POST(request(body))).status, 409)
      await pg.exec('rollback to savepoint duplicate_reference')
      await pg.query("update public.halloween_bookings set payment_submitted_at=now()-interval '8 days' where id=$1", [bookingId])
      assert.equal((await api.POST(request({ action: 'payment-review', token }))).status, 410)
      assert.equal((await api.POST(request(body))).status, 410)
    } finally { await pg.exec('rollback') }
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
    assert.equal((await (await worker.GET(workerRequest())).json()).failed, 2)
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
