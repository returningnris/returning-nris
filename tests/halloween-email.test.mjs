import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const compiled = ts.transpileModule(readFileSync(new URL('../lib/halloween-email.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText
const mod = { exports: {} }
vm.runInNewContext(compiled, { module: mod, exports: mod.exports })
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
