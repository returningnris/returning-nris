-- Supplied payment details. Keep registration closed until the live payment flow is tested.
-- UPI phone number 7578827578 is displayed by the website for this UPI ID.
update public.halloween_events
set upi_id = '7578827578@ybl',
    payment_recipient_name = 'Bandla Swathi',
    payment_qr_image_url = '/events/halloween/payment-qr.jpeg',
    registration_open = false
where id = 'halloween-2026';
