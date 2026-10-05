-- Run AFTER all three migrations, on empty Halloween tables before launch.
-- Do not run while live guest registrations or workers are active. All test rows roll back.
-- Sequences can advance; gaps in readable references are expected and harmless.
begin;
do $$
declare
  b public.halloween_bookings;
  again public.halloween_bookings;
  other public.halloween_bookings;
  key uuid := gen_random_uuid();
  original_confirmed timestamptz;
  original_tokens text[];
  organiser uuid;
  ticket text;
  result jsonb;
  claimed public.halloween_notification_outbox;
  rejected boolean;
  adults integer;
  children integer;
  expected integer;
begin
  if exists(select 1 from public.halloween_bookings) then
    raise exception 'Tests require empty Halloween tables; use a fresh staging database';
  end if;
  -- This temporary configuration is rolled back; never used by live guests.
  update public.halloween_events set venue='SQL TEST ONLY', timings='SQL TEST ONLY',
    upi_id='sql-test@example', payment_recipient_name='SQL TEST ONLY',
    payment_qr_image_url='/sql-test-only.png', registration_open=true where id='halloween-2026';
  for adults, children, expected in
    select * from (values (1,1,500), (2,1,1000), (2,2,1000), (3,2,1500)) examples
  loop
    b := public.halloween_register(gen_random_uuid(), 'SQL Test', 'test@example.invalid',
      '+919999999999', adults, children);
    assert b.amount_inr = expected, 'Incorrect pricing example';
  end loop;

  rejected := false;
  begin
    perform public.halloween_register(gen_random_uuid(), 'SQL Test', 'test@example.invalid', '+919999999999', 0, 1);
  exception when check_violation then rejected := true;
  end;
  assert rejected, 'Zero adults accepted';
  rejected := false;
  begin
    perform public.halloween_register(gen_random_uuid(), 'SQL Test', 'test@example.invalid', '+919999999999', 1, 0);
  exception when check_violation then rejected := true;
  end;
  assert rejected, 'Zero children accepted';

  b := public.halloween_register(key, 'SQL Test', 'test@example.invalid', '+919999999999', 3, 2);
  again := public.halloween_register(key, 'SQL Test', 'test@example.invalid', '+919999999999', 3, 2);
  assert b.id = again.id, 'Duplicate registration created a second booking';
  assert length(b.private_access_token) = 64, 'Private token has unexpected length';
  assert b.private_access_token <> b.booking_reference, 'Readable reference used as private token';
  assert not b.payment_verified, 'New booking automatically paid';
  assert not exists(select 1 from public.halloween_tickets where booking_id=b.id), 'Tickets before approval';

  perform public.halloween_submit_payment(b.private_access_token, ' TESTREF123456 ');
  perform public.halloween_submit_payment(b.private_access_token, 'TESTREF123456');
  select * into b from public.halloween_bookings where id=b.id;
  assert b.transaction_reference = 'TESTREF123456' and b.payment_submitted_at is not null;
  assert not b.payment_verified, 'Reference submission confirmed payment';
  rejected := false;
  begin
    perform public.halloween_submit_payment(repeat('0',64), 'TESTREF123456');
  exception when others then rejected := true;
  end;
  assert rejected, 'Invalid private token accepted';

  other := public.halloween_register(gen_random_uuid(), 'SQL Test Two', 'test2@example.invalid', '+919999999998', 1, 1);
  perform public.halloween_submit_payment(other.private_access_token, 'TESTREF123456');
  assert exists(select 1 from public.halloween_payment_reference_review
    where transaction_reference='TESTREF123456' and booking_count >= 2), 'Reference reuse not flagged';

  -- Simulates Table Editor: no website confirmation endpoint involved.
  update public.halloween_bookings set payment_verified=true where id=b.id;
  select confirmed_at into original_confirmed from public.halloween_bookings where id=b.id;
  assert original_confirmed is not null, 'Confirmation timestamp missing';
  assert (select count(*) from public.halloween_tickets where booking_id=b.id and category='family') = 1, 'Expected one family ticket';
  assert (select count(distinct validation_token) from public.halloween_tickets where booking_id=b.id) = 1;
  select array_agg(validation_token order by validation_token) into original_tokens
    from public.halloween_tickets where booking_id=b.id;
  assert (select count(*) from public.halloween_notification_outbox where kind='booking_confirmation' and booking_id=b.id) = 1;
  update public.halloween_bookings set payment_verified=true where id=b.id;
  assert (select count(*) from public.halloween_tickets where booking_id=b.id) = 1, 'Duplicate family tickets';

  -- Only test rows exist in this fresh database; no live queue is claimed.
  update public.halloween_notification_outbox set next_attempt_at=now()-interval '1 day' where booking_id=b.id;
  select * into claimed from public.halloween_claim_notifications(1);
  assert claimed.booking_id = b.id;
  assert not public.halloween_finish_notification(claimed.id, gen_random_uuid(), 'failed', null, 'test'),
    'Wrong worker lease accepted';
  assert public.halloween_finish_notification(claimed.id, claimed.lease_token, 'failed', null, 'sql_test_retry');
  update public.halloween_notification_outbox set next_attempt_at=now()-interval '1 day' where booking_id=b.id;
  select * into claimed from public.halloween_claim_notifications(1);
  assert claimed.attempts = 2, 'Retry counter incorrect';
  assert public.halloween_finish_notification(claimed.id, claimed.lease_token, 'sent', 'sql-test-provider-acceptance');
  assert (select count(*) from public.halloween_tickets where booking_id=b.id) = 1, 'Retry duplicated family tickets';

  -- Use an existing Auth account for the check-in test, entirely inside this rollback.
  select id into organiser from auth.users order by created_at limit 1;
  if organiser is not null then
    insert into public.halloween_organisers(user_id) values(organiser)
      on conflict(user_id) do update set active=true;
    select ticket_identifier into ticket from public.halloween_tickets where booking_id=b.id limit 1;
    result := public.halloween_check_ticket(organiser, ticket, false);
    assert result->>'status' = 'Ready for admission';
    assert (public.halloween_check_ticket(organiser, ticket, true))->>'status' = 'Checked in';
    assert (public.halloween_check_ticket(organiser, ticket, true))->>'status' = 'Already checked in';
    update public.halloween_bookings set payment_verified=false where id=b.id;
    assert (public.halloween_check_ticket(organiser, ticket, false))->>'status' = 'Payment not verified';
    update public.halloween_bookings set payment_verified=true where id=b.id;
    assert (public.halloween_check_ticket(organiser, ticket, true))->>'status' = 'Already checked in';
  else
    raise notice 'No Auth user exists: organiser check-in assertions skipped';
  end if;
  update public.halloween_bookings set payment_verified=false where id=b.id;
  update public.halloween_bookings set payment_verified=true where id=b.id;
  assert (select array_agg(validation_token order by validation_token) from public.halloween_tickets where booking_id=b.id)
    = original_tokens, 'Reconfirmation regenerated tokens';
  assert (select confirmed_at from public.halloween_bookings where id=b.id) = original_confirmed;
  assert (select count(*) from public.halloween_notification_outbox where kind='booking_confirmation' and booking_id=b.id) = 1;

  assert not has_table_privilege('anon','public.halloween_bookings','SELECT');
  assert not has_table_privilege('authenticated','public.halloween_tickets','UPDATE');
  assert not has_function_privilege('anon','public.halloween_register(uuid,text,text,text,integer,integer)','EXECUTE');
  assert not has_function_privilege('authenticated','public.halloween_check_ticket(uuid,text,boolean)','EXECUTE');
  assert public.halloween_consume_rate_limit('sql-test-' || key::text, 1, 60);
  assert not public.halloween_consume_rate_limit('sql-test-' || key::text, 1, 60);
  raise notice 'Halloween SQL assertions passed; test data will be rolled back';
end;
$$;
rollback;
