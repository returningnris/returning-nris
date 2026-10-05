import type { HalloweenBooking, HalloweenEvent } from './halloween'

function escapeHtml(value: string | number) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!))
}

export function halloweenEmailHtml(booking: Pick<HalloweenBooking, 'booking_reference' | 'amount_inr' | 'adult_count' | 'child_count'>,
  event: HalloweenEvent, origin: string, privateLink?: string) {
  const confirmed = Boolean(privateLink)
  const title = confirmed ? 'Your family is on the guest list!' : 'Payment pending verification'
  const message = confirmed
    ? 'Your payment has been verified. We look forward to celebrating Halloween with your family!'
    : 'We received your payment reference. The organiser is checking the bank receipt. Once payment is confirmed, we’ll email a private link to your family QR ticket.'
  const detail = (label: string, value: string | number) => `<tr><td style="padding:10px 0;border-bottom:1px solid #e8dfed;color:#66536f;font-size:14px;vertical-align:top;width:38%">${escapeHtml(label)}</td><td style="padding:10px 0;border-bottom:1px solid #e8dfed;color:#21132e;font-size:14px;font-weight:bold;vertical-align:top">${escapeHtml(value)}</td></tr>`
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background-color:#f4eff7;font-family:Arial,Helvetica,sans-serif;color:#21132e">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${escapeHtml(confirmed ? 'Payment confirmed. Your private family ticket link is inside.' : 'Payment reference received. Bank verification is pending.')}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4eff7"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e8dfed;border-radius:18px">
<tr><td align="center" bgcolor="#21132e" style="padding:24px 24px 28px;background-color:#21132e;border-radius:18px 18px 0 0">
<p style="margin:0 0 12px;color:#ffd878;font-size:12px;font-weight:bold;letter-spacing:2px">RETURNING NRIs · FAMILY COMMUNITY EVENT</p>
<img src="${escapeHtml(origin)}/events/halloween/email-artwork.png" width="480" height="240" alt="" style="display:block;width:100%;max-width:480px;height:auto;border:0">
<h1 style="margin:12px 0 0;color:#ffae45;font-family:Georgia,serif;font-size:30px;line-height:1.2">${escapeHtml(event.name)}</h1>
</td></tr>
<tr><td style="padding:28px 24px">
<p style="margin:0 0 10px;color:#805326;font-size:12px;font-weight:bold;text-transform:uppercase">${confirmed ? 'Payment confirmed' : 'Payment reference received'}</p>
<h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;line-height:1.3;color:#21132e">${escapeHtml(title)}</h2>
<p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#66536f">${escapeHtml(message)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detail('Booking reference', booking.booking_reference)}${detail(confirmed ? 'Payment verified' : 'Amount to verify', `₹${booking.amount_inr.toLocaleString('en-IN')}`)}${detail('Your family', `${booking.adult_count} adult(s) · ${booking.child_count} child(ren)`)}${detail('When', `31 October 2026 · ${event.timings || 'Timings to be announced'} IST`)}${detail('Where', event.venue || 'Venue to be announced')}</table>
${confirmed ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px"><tr><td bgcolor="#ffae45" style="border-radius:10px;background-color:#ffae45"><a href="${escapeHtml(privateLink!)}" style="display:inline-block;padding:16px 22px;color:#21132e;text-decoration:none;font-size:16px;font-weight:bold">View your family ticket →</a></td></tr></table><p style="font-size:14px;line-height:1.7;color:#66536f;margin:18px 0 0">One QR covers your entire registered family. Please arrive together and show your QR at the entrance. Keep your ticket link private.</p><p style="font-size:13px;line-height:1.6;color:#66536f">Button not working? <a href="${escapeHtml(privateLink!)}" style="color:#744394;text-decoration:underline">Open your family ticket here</a>.</p>` : '<p style="margin:22px 0 0;padding:16px;background-color:#fff3df;border-radius:10px;color:#704600;font-size:14px;line-height:1.7">Please do not pay again. This email acknowledges your reference submission; it does not confirm payment received in the bank.</p>'}
<p style="margin:22px 0 0;font-size:14px;line-height:1.7;color:#66536f">Music to keep the evening lively · Trick or treat · Exciting games for kids<br>Food available for purchase.</p>
</td></tr><tr><td align="center" style="padding:20px 24px;border-top:1px solid #e8dfed;font-size:12px;line-height:1.7;color:#66536f">Returning NRIs<br>Questions? <a href="${escapeHtml(origin)}/contact" style="color:#744394">Contact the organiser</a> with your booking reference.</td></tr>
</table></td></tr></table></body></html>`
}
