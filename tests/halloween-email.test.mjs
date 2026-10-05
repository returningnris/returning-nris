import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const compiled = ts.transpileModule(readFileSync(new URL('../lib/halloween-email.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText
const mod = { exports: {} }
const termsMod = { exports: {} }
vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../lib/halloween-terms.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { module: termsMod, exports: termsMod.exports })
vm.runInNewContext(compiled, { module: mod, exports: mod.exports, require: name => {
  assert.equal(name, './halloween-terms')
  return termsMod.exports
} })
const { halloweenEmailHtml } = mod.exports
const booking = {booking_reference:'HW26-00000001',amount_inr:1000,adult_count:2,child_count:1}
const event = {name:'Halloween <script>bad()</script>',venue:'School & grounds',timings:'5 PM – 9 PM'}

test('pending HTML is themed, escapes event content and has no ticket access button', () => {
  const html = halloweenEmailHtml(booking,event,'https://example.com')
  assert.match(html,/Payment pending verification/)
  assert.match(html,/email a private link/)
  assert.match(html,/email-artwork.png/)
  assert.match(html,/School &amp; grounds/)
  assert.ok(!html.includes('<script>'))
  assert.ok(!html.includes('View your family ticket'))
  assert.ok(!html.includes('<svg'))
})

test('confirmed HTML includes counts, verified amount and a private ticket button', () => {
  const link='https://example.com/events/halloween/booking#'+'a'.repeat(64)
  const html=halloweenEmailHtml(booking,event,'https://example.com',link)
  assert.match(html,/View your family ticket/)
  assert.ok(html.includes(`href="${link}"`))
  assert.match(html,/Payment verified/)
  assert.match(html,/2 adult\(s\) · 1 child\(ren\)/)
  assert.match(html,/₹1,000/)
  assert.match(html,/Keep your ticket link private/)
  assert.ok(!html.includes('Save your private link'))
})

test('pending and confirmed emails include every shared term and the liability limitations', () => {
  for (const link of [undefined, 'https://example.com/events/halloween/booking#' + 'a'.repeat(64)]) {
    const html = halloweenEmailHtml(booking, event, 'https://example.com', link)
    for (const term of termsMod.exports.HALLOWEEN_TERMS) {
      assert.ok(html.includes(term.title))
      assert.ok(html.includes(term.text))
    }
    assert.match(html, /The Quantium School/)
    assert.match(html, /release them from related claims and liability/)
    assert.match(html, /does not exclude liability for negligence/)
    assert.ok(html.includes('href="https://example.com/events/halloween/terms"'))
  }
  const text = termsMod.exports.halloweenTermsText()
  for (const term of termsMod.exports.HALLOWEEN_TERMS) assert.ok(text.includes(term.text))
})
