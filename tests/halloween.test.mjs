import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'

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

const couponSandbox = { exports: {}, Error, require: spec => spec === 'server-only' ? {} : sandbox.exports }
vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../lib/halloween-coupon-server.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, couponSandbox)
const { halloweenCouponPrice } = couponSandbox.exports

test('Quantium coupon discounts paid tickets only and rejects invalid codes', () => {
  for (const [adults, children, total] of [[1,1,250], [2,1,500], [2,2,500], [3,2,750], [1,3,750], [50,50,12500]]) {
    assert.equal(halloweenCouponPrice(adults, children, ' quantium250 ').total, total)
  }
  assert.equal(halloweenCouponPrice(1, 1, 'QUANTIUM250').discount, 250)
  assert.equal(halloweenCouponPrice(registration.adults, registration.children, 'quantium250').total, 750)
  assert.equal(validateHalloweenRegistration({ ...registration, couponCode: 'quantium250' }).couponCode, 'QUANTIUM250')
  for (const code of ['QUANTIUM50', 'AIRADENTAL200', 'DRIPBAR200', 'INVALID', 50, {}, ['QUANTIUM250']]) assert.throws(() => halloweenCouponPrice(registration.adults, registration.children, code))
})

test('public registration UI and shared module do not reveal coupon or offer', () => {
  for (const file of ['../lib/halloween.ts', '../components/HalloweenRegistration.tsx', '../components/HalloweenShared.tsx', '../components/HalloweenBooking.tsx', '../app/events/halloween/page.tsx']) {
    const contents = readFileSync(new URL(file, import.meta.url), 'utf8')
    assert.doesNotMatch(contents, /QUANTIUM250/)
    if (file.endsWith('page.tsx')) assert.doesNotMatch(contents, /special treat|₹50 off/)
  }
})

test('family price breakdown renders discounted unit charges and stored payment total', () => {
  const nativeRequire = createRequire(import.meta.url)
  const shared = { exports: {}, Error, require: spec => spec === '@/lib/halloween' ? sandbox.exports : spec === 'next/link' ? {} : nativeRequire(spec) }
  const compiled = ts.transpileModule(readFileSync(new URL('../components/HalloweenShared.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText
  vm.runInNewContext(compiled, shared)
  const html = renderToStaticMarkup(createElement(shared.exports.PriceBreakdown, { adults: 1, childCount: 1, discountApplied: true, totalInr: 450 }))
  assert.match(html, /× ₹450/)
  assert.match(html, /You save ₹50/)
  assert.match(html, /<span>Total<\/span><span>₹450<\/span>/)
  assert.doesNotMatch(html, /₹500/)
  const family = renderToStaticMarkup(createElement(shared.exports.PriceBreakdown, { adults: 3, childCount: 2, discountApplied: true, totalInr: 1350 }))
  assert.match(family, /<span>Total<\/span><span>₹1,350<\/span>/)
  assert.match(family, /You save ₹150/)
})


test('new coupon breakdown displays 250 rupees per paid ticket', () => {
  const nativeRequire = createRequire(import.meta.url)
  const shared = { exports: {}, Error, require: spec => spec === '@/lib/halloween' ? sandbox.exports : spec === 'next/link' ? {} : nativeRequire(spec) }
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../components/HalloweenShared.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, shared)
  const html = renderToStaticMarkup(createElement(shared.exports.PriceBreakdown, { adults: 3, childCount: 2, discountApplied: true }))
  assert.match(html, /× ₹250/)
  assert.match(html, /You save ₹750/)
  assert.match(html, /<span>Total<\/span><span>₹750<\/span>/)
})


test('sponsor coupons apply 250 rupees to every paid ticket', () => {
  for (const code of [' airadental250 ', ' dripbar250 ']) {
    assert.equal(halloweenCouponPrice(1, 1, code).total, 250)
    assert.equal(halloweenCouponPrice(3, 2, code).total, 750)
    assert.equal(halloweenCouponPrice(1, 3, code).discount, 750)
    assert.equal(halloweenCouponPrice(50, 50, code).total, 12500)
  }
})
