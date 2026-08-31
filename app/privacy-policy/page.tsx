import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | ReturningNRIs',
  description: 'Learn how ReturningNRIs collects, uses, stores and protects personal information.',
  alternates: { canonical: 'https://www.returningnris.com/privacy-policy' },
  robots: { index: true, follow: true },
}

const prose: React.CSSProperties = {
  maxWidth: '760px',
  margin: '0 auto',
  fontFamily: 'DM Sans, sans-serif',
  color: '#1A1208',
  lineHeight: 1.8,
}

const heading: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: 'clamp(1.35rem, 3vw, 1.7rem)',
  color: '#1A1208',
  margin: '2.3rem 0 0.7rem',
  lineHeight: 1.25,
}

const paragraph: React.CSSProperties = {
  fontSize: '1rem',
  color: '#3D3229',
  lineHeight: 1.85,
  marginBottom: '1rem',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <section
        style={{
          background: '#fff',
          backgroundImage:
            'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(255,153,51,0.1) 0%, transparent 68%), radial-gradient(ellipse 40% 40% at 10% 85%, rgba(19,136,8,0.07) 0%, transparent 62%)',
          padding: '4rem 2rem 3rem',
        }}
      >
        <div style={prose}>
          <nav style={{ fontSize: '12px', color: '#B5A898', marginBottom: '1.4rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#B5A898', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <span style={{ color: '#6B5E50' }}>Privacy Policy</span>
          </nav>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '0.8rem' }}>Privacy Policy</h1>
          <p style={{ fontSize: '1rem', color: '#6B5E50', margin: 0 }}>Last updated: August 31, 2026</p>
        </div>
      </section>

      <article style={{ background: '#fff', padding: '2.25rem 2rem 4rem' }}>
        <div style={prose}>
          <p style={paragraph}>ReturningNRIs helps people plan a move back to India. This Privacy Policy explains what information we collect, how we use it, and the choices available to you when you use <strong>returningnris.com</strong>.</p>

          <h2 style={heading}>Information we collect</h2>
          <p style={paragraph}>We collect information you choose to provide, such as your name, email address, move-planning details, checklist progress, community-request details, and messages you send us. If you create an account, we also collect the information needed to provide and secure that account.</p>
          <p style={paragraph}>When you use our planning tools, we may store the answers and progress you submit so we can provide your results, save your journey, or send a report you request. Some technical information, such as browser type, device information, IP address and pages accessed, may be processed automatically by our hosting and security providers.</p>

          <h2 style={heading}>How we use information</h2>
          <ul style={{ paddingLeft: '1.25rem', color: '#3D3229', lineHeight: 1.85, marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.35rem' }}>To operate, maintain and improve ReturningNRIs and its planning tools.</li>
            <li style={{ marginBottom: '0.35rem' }}>To save account, planner and checklist information when you ask us to do so.</li>
            <li style={{ marginBottom: '0.35rem' }}>To respond to support, feedback and community requests.</li>
            <li style={{ marginBottom: '0.35rem' }}>To send requested reports, account-related messages or updates you have agreed to receive.</li>
            <li style={{ marginBottom: '0.35rem' }}>To protect our site, users and systems from misuse or security issues.</li>
          </ul>

          <h2 style={heading}>How we share information</h2>
          <p style={paragraph}>We do not sell your personal information. We may share information with service providers that help us operate the site, such as hosting, database, authentication, email and form-processing providers. These providers may process information only to provide their services to us and as permitted by their own applicable terms and privacy practices.</p>
          <p style={paragraph}>We may also disclose information when required by law, to protect rights or safety, or as part of a business transfer such as a merger, acquisition or sale of assets.</p>

          <h2 style={heading}>Cookies and similar technologies</h2>
          <p style={paragraph}>We and our service providers may use cookies or similar technologies that are needed for sign-in, security, preferences and core site functionality. Your browser lets you manage cookies, though disabling them may affect features such as account access or saved progress.</p>

          <h2 style={heading}>Third-party links</h2>
          <p style={paragraph}>Our site may link to third-party websites, including community, scheduling, video, shopping and social-media services. Their privacy practices are governed by their own policies, so please review those policies before sharing personal information with them.</p>

          <h2 style={heading}>Data retention and security</h2>
          <p style={paragraph}>We retain personal information only for as long as reasonably necessary for the purposes described in this policy, including providing the services, resolving disputes, meeting legal obligations and maintaining security. We use reasonable administrative, technical and organisational measures to protect information, but no internet-based service can guarantee absolute security.</p>

          <h2 style={heading}>Your choices</h2>
          <p style={paragraph}>You can ask to access, correct or delete personal information we hold about you, subject to applicable law and legitimate operational requirements. You can also unsubscribe from non-essential emails using the link in the message, where available.</p>

          <h2 style={heading}>Children&apos;s privacy</h2>
          <p style={paragraph}>ReturningNRIs is intended for adults planning a move back to India. We do not knowingly collect personal information directly from children. If you believe a child has provided us personal information, please contact us so we can take appropriate action.</p>

          <h2 style={heading}>Changes to this policy</h2>
          <p style={paragraph}>We may update this policy as our services or legal obligations change. We will post the updated version on this page and revise the “Last updated” date above.</p>

          <div style={{ marginTop: '2.5rem', background: '#F8F5F0', border: '1px solid #E5E1DA', borderRadius: '16px', padding: '1.35rem 1.5rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B5E50', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>Contact us</div>
            <p style={{ ...paragraph, marginBottom: 0 }}>For privacy questions or requests, email <a href="mailto:hello@returningnris.com" style={{ color: '#CC7A00', fontWeight: 600 }}>hello@returningnris.com</a>.</p>
          </div>
        </div>
      </article>
    </>
  )
}
