import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'What NRIs Should Actually Bring From the USA to India Before Moving | ReturningNRIs',
  description:
    'A practical 2026 packing guide for NRIs returning from the USA: what is worth bringing, what to leave behind, voltage checks, and Transfer of Residence pointers.',
  alternates: { canonical: 'https://www.returningnris.com/resources/things-nris-should-bring-from-usa-to-india' },
  openGraph: {
    title: 'What NRIs Should Actually Bring From the USA to India Before Moving',
    description: 'A useful, realistic packing guide for NRIs relocating from the USA to India.',
    url: 'https://www.returningnris.com/resources/things-nris-should-bring-from-usa-to-india',
    type: 'article',
  },
}

const sections = [
  {
    title: 'Kitchen essentials',
    items: [
      ['Everyday cookware and utensils', 'Highly recommended', 'Rebuilding a complete kitchen takes more time and small purchases than most families expect.'],
      ['High-quality knife set', 'Highly recommended', 'Compact, durable and usually worth keeping.'],
      ['Corelle, Lenox or quality dinnerware', 'Recommended', 'Bring sets you already use and like; resale value in the US is often poor.'],
      ['Storage containers and kitchen tools', 'Recommended', 'Pack only durable, regularly used pieces. Skip worn or low-value items.'],
    ],
  },
  {
    title: 'Appliances and electronics',
    items: [
      ['Premium TV or projector', 'Highly recommended', 'Worth bringing when relatively new and expensive. Check the voltage label and ship with protective packaging.'],
      ['Vitamix, Instant Pot or stand mixer', 'Highly recommended', 'Keep premium appliances you use often, but plan for the right transformer if they are US-voltage only.'],
      ['Home theatre or premium sound system', 'Highly recommended', 'Replacement cost can be high and resale value weak; check powered components carefully.'],
      ['Laptops, phones, tablets, headphones, cameras and storage', 'Highly recommended', 'Compact, valuable and easy to carry. Back up important data before the move.'],
      ['Air fryer, gaming console and premium hair tools', 'Recommended', 'Bring only if you will genuinely use them and the voltage setup is practical.'],
    ],
  },
  {
    title: 'Kids, hobbies and useful items',
    items: [
      ['LEGO, STEM kits and board games', 'Recommended', 'Bring favourites and higher-value sets rather than everything.'],
      ['Kids’ books', 'Recommended', 'Favourite books and collections are easy to miss after a move.'],
      ['Musical instruments and hobby gear', 'Recommended', 'Quality instruments, golf gear and tennis equipment can be expensive to replace.'],
      ['Foldable utility wagon', 'Recommended', 'Often useful for groceries, packages, children’s activities and apartment communities.'],
    ],
  },
  {
    title: 'Clothing, medicines and Costco essentials',
    items: [
      ['Branded clothing, shoes and bags', 'Recommended', 'Prioritize brands and styles you already know and use. Outlet or seasonal-sale purchases can make sense.'],
      ['Vitamins and supplements', 'Recommended', 'Bring a reasonable supply of products your family already uses.'],
      ['Prescription and OTC medicines', 'Recommended', 'Keep original packaging and prescriptions where applicable; transition to India-sourced medication with your doctor.'],
      ['Foil, parchment, larger Ziplocs and dry fruits', 'Optional', 'Useful only if you prefer the format and have shipping space. Do not turn the final Costco run into a stock-up mission.'],
    ],
  },
]

const relatedLinks = [
  { href: '/resources/nri-returning-to-india-checklist', icon: '✅', label: 'Move-back checklist', sub: 'Plan the return in the right sequence' },
  { href: '/resources/sell-your-us-home-before-moving-back-to-india', icon: '🏠', label: 'Sell your US home', sub: 'A practical seller playbook' },
  { href: '/resources/rnor-status-nri-returning-to-india', icon: '📊', label: 'RNOR status', sub: 'Plan your tax transition' },
]

const prose: React.CSSProperties = { maxWidth: '720px', margin: '0 auto', fontFamily: 'DM Sans, sans-serif', color: '#1A1208', lineHeight: 1.8 }
const h2: React.CSSProperties = { fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.4rem, 3vw, 1.75rem)', color: '#1A1208', margin: '2.5rem 0 0.75rem', lineHeight: 1.25 }
const paragraph: React.CSSProperties = { fontSize: '1rem', color: '#3D3229', lineHeight: 1.85, marginBottom: '1rem' }

export default function ThingsNrisShouldBringPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Before You Move Back: What NRIs Should Actually Bring From the USA to India',
    description: 'A practical 2026 guide to the items worth bringing from the USA before relocating to India.',
    datePublished: '2026-08-30',
    dateModified: '2026-08-30',
    author: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com/our-story' },
    publisher: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
    mainEntityOfPage: 'https://www.returningnris.com/resources/things-nris-should-bring-from-usa-to-india',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <section style={{ background: '#fff', backgroundImage: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%)', padding: '4rem 2rem 3rem' }}>
        <div style={prose}>
          <nav style={{ fontSize: '12px', color: '#B5A898', marginBottom: '1.5rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}><Link href="/" style={{ color: '#B5A898', textDecoration: 'none' }}>Home</Link><span>›</span><Link href="/resources" style={{ color: '#B5A898', textDecoration: 'none' }}>Resource Guide</Link><span>›</span><span style={{ color: '#6B5E50' }}>What to bring from the USA</span></nav>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}><span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: '#FFF3E6', color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Planning</span><span style={{ fontSize: '12px', color: '#B5A898' }}>9 min read · Updated August 2026</span></div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.9rem, 5vw, 2.9rem)', color: '#1A1208', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.1rem' }}>Before You Move Back: What NRIs Should Actually Bring From the USA to India</h1>
          <p style={{ fontSize: '1.1rem', color: '#6B5E50', lineHeight: 1.75, marginBottom: 0 }}>You can buy almost everything in India today. Bring what is expensive to replace, gets poor resale value in the US, or saves real setup effort in your first months back.</p>
        </div>
      </section>

      <article style={{ background: '#fff', padding: '2.5rem 2rem 3rem' }}>
        <div style={prose}>
          <div style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: '16px', background: '#F8F5F0', margin: '0 0 2rem' }}><Image src="/resources/things-nris-should-bring-from-usa-to-india.webp" alt="Things NRIs may bring from the USA before relocating to India" fill sizes="(max-width: 760px) 100vw, 720px" quality={72} loading="lazy" decoding="async" style={{ objectFit: 'cover' }} /></div>
          <div style={{ background: '#FFF3E6', border: '1.5px solid rgba(255,153,51,0.28)', borderRadius: '16px', padding: '1.5rem 1.75rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>The simple rule</div>
            <p style={{ ...paragraph, marginBottom: 0 }}>Bring it if you use it regularly, would get little by selling it in the US, and replacing it in India would cost significantly more or take meaningful effort. If you are paying for shipping yourself, start with compact, high-value items.</p>
          </div>
          <p style={paragraph}>This is not a US shopping list. The best things to bring are usually things you already own and use. Be stricter with bulky items, especially when you are self-funding a container or paying excess-baggage charges.</p>

          <h2 style={h2}>First, check voltage before packing appliances</h2>
          <p style={paragraph}>India uses 230V electricity. Appliances labelled 100-240V / 50-60Hz usually do not need a transformer. US-only 110-120V appliances need an appropriately rated 230V-to-110/120V step-down transformer. A plug adapter changes the plug shape; it does not convert voltage.</p>
          <p style={paragraph}>Choose a transformer based on the appliance&apos;s rated wattage and leave comfortable headroom. For large TVs, kitchen appliances and powered audio equipment, check the label and speak with your mover or a qualified electrician before shipping.</p>

          {sections.map((section) => (
            <section key={section.title}>
              <h2 style={h2}>{section.title}</h2>
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                {section.items.map(([name, rating, note]) => (
                  <div key={name} style={{ border: '1px solid #E5E1DA', borderRadius: '14px', padding: '1rem 1.1rem', background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}><strong style={{ color: '#1A1208', fontSize: '0.98rem' }}>{name}</strong><span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: rating === 'Highly recommended' ? '#E8F5E8' : rating === 'Optional' ? '#F8F5F0' : '#FFF3E6', color: rating === 'Highly recommended' ? '#138808' : rating === 'Optional' ? '#6B5E50' : '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{rating}</span></div>
                    <p style={{ ...paragraph, marginBottom: 0, fontSize: '0.93rem' }}>{note}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <h2 style={h2}>What we would usually leave behind</h2>
          <ul style={{ paddingLeft: '1.25rem', color: '#3D3229', lineHeight: 1.85, marginBottom: '1rem' }}>
            {['Cheap or old furniture', 'Basic microwaves and low-cost appliances', 'Old vacuum cleaners', 'Cheap plates and glassware', 'Bulky storage bins and home organizers', 'Excess toiletries', 'Appliances you rarely use', 'Anything you were already planning to replace'].map((item) => <li key={item} style={{ marginBottom: '0.35rem' }}>{item}</li>)}
          </ul>

          <h2 style={h2}>A note on customs and Transfer of Residence</h2>
          <p style={paragraph}>India&apos;s Baggage Rules, 2026 set allowances and Transfer of Residence benefits based on your eligibility and time abroad. The rules include a rationalised duty-free list with an overall value cap, so do not assume every item will qualify or that a specific item is automatically duty-free. Confirm your situation and declarations before shipping or flying.</p>
          <p style={paragraph}>The 2026 rules also include a separate duty-free concession for one laptop for eligible adult passengers. Keep invoices, packing lists and relevant documents handy, and use official guidance for current details.</p>

          <div style={{ marginTop: '2.25rem', padding: '1.35rem 1.5rem', background: '#F8F5F0', border: '1px solid #E5E1DA', borderRadius: '14px' }}><div style={{ fontSize: '11px', fontWeight: 700, color: '#6B5E50', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.7rem' }}>Important disclaimer</div><p style={{ ...paragraph, marginBottom: 0, fontSize: '0.9rem' }}>This guide is for general educational purposes, not customs, tax, legal, medical or electrical-safety advice. Rules, eligibility, duty treatment and product suitability can change. Verify current requirements with Indian Customs and seek professional advice where needed.</p></div>

          <div style={{ marginTop: '2.5rem', borderTop: '1px solid #E5E1DA', paddingTop: '1.5rem' }}><div style={{ fontSize: '11px', fontWeight: 700, color: '#6B5E50', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Official resources</div><ul style={{ paddingLeft: '1.2rem', margin: 0 }}><li><a href="https://www.cbic.gov.in/resources/htdocs-cbec/Not_No_14_2026_Cus_n_t.pdf" target="_blank" rel="noreferrer" style={{ color: '#CC7A00' }}>CBIC: Baggage Rules, 2026</a></li><li><a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2222384" target="_blank" rel="noreferrer" style={{ color: '#CC7A00' }}>PIB: Overview of the Baggage Rules, 2026</a></li><li><a href="https://www.cbic.gov.in/entities/internationalTravellers" target="_blank" rel="noreferrer" style={{ color: '#CC7A00' }}>CBIC: International travellers guidance</a></li></ul></div>

          <div style={{ borderTop: '1px solid #E5E1DA', paddingTop: '1.75rem', marginTop: '1.75rem' }}><div style={{ fontSize: '11px', fontWeight: 600, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Related resources</div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>{relatedLinks.map((item) => <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8F5F0', border: '1px solid #E5E1DA', borderRadius: '12px', padding: '0.875rem 1rem', textDecoration: 'none' }}><span style={{ fontSize: '1.25rem' }}>{item.icon}</span><span><span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1208' }}>{item.label}</span><span style={{ display: 'block', fontSize: '11px', color: '#B5A898' }}>{item.sub}</span></span></Link>)}</div></div>
        </div>
      </article>
    </>
  )
}
