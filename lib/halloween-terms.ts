export const HALLOWEEN_TERMS_PATH = '/events/halloween/terms'

// Shared wording for registration, the public terms page, and email receipts.
export const HALLOWEEN_TERMS = [
  {
    title: 'Acceptance and family participation',
    text: 'By registering for or attending the Returning NRIs Halloween Party on 31 October 2026 at The Quantium School, Mokila, Hyderabad, you confirm that you have read and agree to these terms. The registering adult must share these terms with all adults in the booking. Each adult is responsible for their own participation and for the children in their care.',
  },
  {
    title: 'Registration, payment and entry',
    text: 'Registration is confirmed only after the organiser verifies your payment. One family QR ticket covers the registered adults and children; please arrive together and keep your private ticket link secure. Follow the designated entrances, check-in process and reasonable safety instructions from the organisers and school staff.',
  },
  {
    title: 'Children and activity safety',
    text: 'Children must remain under the supervision of a parent or responsible adult throughout the party. Choose games and activities suitable for your family, use safe costumes and footwear, and avoid sharp props or costumes that obstruct vision or movement. Participation is voluntary; tell the organisers promptly about an injury or unsafe condition.',
  },
  {
    title: 'Assumption of risk and release of liability',
    text: 'You understand that attending the party, moving around the venue, and participating in games, dancing and trick-or-treat activities may involve risks of falls, collisions, injury or loss. You voluntarily accept these risks. To the fullest extent permitted by applicable law, the Returning NRIs organisers and The Quantium School, including their staff and volunteers, are not liable for injuries at the venue or loss of or damage to personal property arising from attendance or participation. To that same extent, you release them from related claims and liability on your own behalf and, only where legally permitted, on behalf of children in your care. This does not exclude liability for negligence or any other liability where exclusion is prohibited by law, or waive any rights that cannot lawfully be waived.',
  },
  {
    title: 'Safe and respectful conduct',
    text: 'Treat other families, staff and school property with respect. Illegal drugs, weapons, fireworks and hazardous items are prohibited. The organisers may refuse entry or ask an attendee to leave for dangerous behaviour, harassment, intoxication or failure to follow reasonable safety instructions, subject to applicable law.',
  },
  {
    title: 'Food and personal belongings',
    text: 'Food is available for purchase separately from registration. Check ingredients and allergens with the food provider before buying or consuming food, and supervise children while eating. Keep valuables and personal belongings with you.',
  },
  {
    title: 'Event changes and questions',
    text: 'Activities or timings may change for safety, weather or operational reasons. If the event is cancelled or materially rescheduled, the organisers will communicate the arrangements and any applicable refund options by email. Contact the organisers with your booking reference for payment, cancellation or other questions. These terms are subject to applicable Indian law and do not limit statutory consumer rights.',
  },
] as const

export function halloweenTermsText() {
  return `Terms & Conditions\n${HALLOWEEN_TERMS.map((term, index) => `${index + 1}. ${term.title}\n${term.text}`).join('\n\n')}`
}
