import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

const runtime = process.env.HALLOWEEN_SQL_TEST_RUNTIME || join(process.env.TEMP || '/tmp', 'returningnris-halloween-sql-check')
const { PGlite } = createRequire(join(runtime, 'package.json'))('@electric-sql/pglite')

test('paid ticket fee migration preserves existing bookings and changes only new standard bookings', async () => {
  const pg = new PGlite()
  try {
    await pg.exec(`create schema public_test;
      create table public.halloween_bookings (
        coupon_code text not null default '', adult_count integer, child_count integer,
        amount_inr integer generated always as (greatest(adult_count, child_count) * 500) stored
      );
      insert into public.halloween_bookings(adult_count, child_count) values (3,2);`)
    await pg.exec(readFileSync(new URL('../supabase/migrations/202610300001_halloween_child_price.sql', import.meta.url), 'utf8'))
    assert.equal((await pg.query('select amount_inr from public.halloween_bookings')).rows[0].amount_inr, 1500)
    for (const [adults, children, code, expected] of [
      [1,1,'',750], [2,1,'',1500], [2,2,'',1500], [3,2,'',2250],
      [1,3,'',2250], [3,2,'QUANTIUM250',750], [3,2,'AIRADENTAL250',750],
      [3,2,'DRIPBAR250',750], [3,2,'SPOOKYVIP2026',0],
    ]) {
      const { rows } = await pg.query('insert into public.halloween_bookings(adult_count,child_count,coupon_code) values ($1,$2,$3) returning amount_inr', [adults,children,code])
      assert.equal(rows[0].amount_inr, expected)
    }
    const beforeRerun = (await pg.query('select coupon_code, adult_count, child_count, child_price_inr, amount_inr from public.halloween_bookings order by coupon_code, adult_count, child_count')).rows
    await pg.exec(readFileSync(new URL('../supabase/migrations/202610300001_halloween_child_price.sql', import.meta.url), 'utf8'))
    assert.deepEqual((await pg.query('select coupon_code, adult_count, child_count, child_price_inr, amount_inr from public.halloween_bookings order by coupon_code, adult_count, child_count')).rows, beforeRerun)
    const { rows: newRows } = await pg.query("insert into public.halloween_bookings(adult_count,child_count) values (3,2) returning amount_inr")
    assert.equal(newRows[0].amount_inr, 2250)
  } finally { await pg.close() }
})
