-- Update the event name for existing installations and future event rows.
alter table public.halloween_events alter column name set default 'Halloween Party';

update public.halloween_events
set name = 'Halloween Party'
where id = 'halloween-2026';
