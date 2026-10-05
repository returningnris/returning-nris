import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import vm from 'node:vm'

// Compile the pure shared module in memory: no new test-runner dependency.
const source = ts.transpileModule(readFileSync(new URL('../lib/halloween.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText
const sandbox = { exports: {}, URL, Error }
vm.runInNewContext(source, sandbox)
const { halloweenPrice, validateHalloweenRegistration, isPrivateToken, parseHalloweenTicket, paymentImageUrl, confirmationText } = sandbox.exports

test('all required family pricing examples and extra children', () => {
  for (const [a, c, expected] of [[1,1,500], [2,1,1000], [2,2,1000], [3,2,1500], [1,3,1500]]) {
    assert.equal(halloweenPrice(a,c).total, expected)
  }
  assert.equal(halloweenPrice(2,3).includedAdults, 2)
  for (const [a,c] of [[0,1],[1,0],[-1,1],[1.5,2],[51,1],[NaN,1]]) assert.throws(() => halloweenPrice(a,c))
})

const registration = { contactName: '  Family Contact  ', email: ' FAMILY@example.com ', whatsapp: '+91 98765 43210',
  adults: 3, children: 2, idempotencyKey: '6ed15079-4b55-4db1-a203-b55025391226', total: 1 }
test('normalises contact fields and ignores an attacker-supplied amount', () => {
  const result = validateHalloweenRegistration(registration)
  assert.equal(result.contactName, 'Family Contact')
  assert.equal(result.email, 'family@example.com')
  assert.equal(result.whatsapp, '+919876543210')
  assert.equal(result.price.total, 1500)
  for (const change of [{ email: 'bad' }, { whatsapp: '9876543210' }, { contactName: 'a' },
    { idempotencyKey: 'guessable' }, { adults: '2' }]) assert.throws(() => validateHalloweenRegistration({ ...registration, ...change }))
})

test('private tokens, QR payloads and organiser-only manual identifiers stay distinct', () => {
  const token = 'a'.repeat(64)
  assert.equal(isPrivateToken(token), true)
  assert.equal(isPrivateToken('HW26-00000001'), false)
  assert.equal(parseHalloweenTicket('HW26-T-00000001', 'https://example.com'), 'HW26-T-00000001')
  assert.equal(parseHalloweenTicket(`https://example.com/events/halloween/ticket#${token}`, 'https://example.com'), token)
  assert.throws(() => parseHalloweenTicket(`https://attacker.example/events/halloween/ticket#${token}`, 'https://example.com'))
  assert.throws(() => parseHalloweenTicket(`https://example.com/events/halloween/booking#${token}`, 'https://example.com'))
})

test('only trusted payment image protocols and complete confirmation details', () => {
  assert.equal(paymentImageUrl('javascript:alert(1)'), null)
  assert.equal(paymentImageUrl('//attacker.example/qr.png'), null)
  assert.equal(paymentImageUrl('http://example.com/qr.png'), null)
  assert.equal(paymentImageUrl('/qr.png'), '/qr.png')
  const text = confirmationText({ booking_reference: 'HW26-00000001', amount_inr: 1500, adult_count: 3, child_count: 2 },
    { name: 'A configurable party name', timings: 'Test timing', venue: 'Test venue' }, 'https://example.com/events/halloween/booking#private')
  assert.match(text, /₹1,500/)
  assert.match(text, /Asia\/Kolkata/)
  assert.match(text, /A configurable party name/)
  assert.match(text, /booking#private/)
})
