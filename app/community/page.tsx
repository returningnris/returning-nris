import Link from 'next/link'

export const metadata = {
  title: 'Community — ReturningNRIs',
  description: 'Talk to NRIs who already moved back — IT professionals, startup founders, real estate investors, remote workers. Get honest answers from people who have been there.',
}

export default function Community() {
  return (
    <>
      {/* HEADER */}
      <section style={{ background: 'var(--india-white)', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="section-label">Community</div>
          <h1 className="section-title">Talk to NRIs who already made the move</h1>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            No advisors. No scripts. Real people who moved back — staying in IT, pivoting to startups,
            investing in real estate, or working remotely. Ask what no article will answer.
          </p>
        </div>
      </section>

      {/* CAREER PATH FILTERS */}
      <section style={{ background: 'var(--white)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '3rem' }}>
            {[
              { label: 'All paths', active: true },
              { label: 'Stayed in IT', active: false },
              { label: 'Startup founder', active: false },
              { label: 'Real estate', active: false },
              { label: 'Remote work', active: false },
              { label: 'Career pivot', active: false },
            ].map((f) => (
              <span key={f.label} style={{
                fontSize: '12px', fontWeight: 500, padding: '6px 16px',
                borderRadius: '100px', cursor: 'pointer',
                background: f.active ? 'var(--ink)' : 'var(--india-white)',
                color: f.active ? '#fff' : 'var(--ink-muted)',
                border: f.active ? 'none' : '0.5px solid var(--border)',
              }}>
                {f.label}
              </span>
            ))}
          </div>

          {/* PROFILE CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {[
              {
                initials: 'RK', bg: '#000080',
                name: 'Rahul K.',
                role: 'Staff Eng @ Google → TCS Hyderabad',
                tag: 'Stayed in IT', tagBg: 'rgba(0,0,128,0.08)', tagColor: '#000080',
                from: 'Seattle', to: 'Hyderabad', date: 'Jun 2024',
                quote: '"30% pay cut in USD but 3x quality of life. My kids adjusted in 3 months. The school transition was the hardest — but they love it now."',
                badge: 'RNOR saved ₹28L', badgeBg: '#E8E8FF', badgeColor: '#0C447C',
                replies: 14,
              },
              {
                initials: 'VN', bg: '#FF9933',
                name: 'Vikram N.',
                role: 'PM @ Meta → Founded EduTech startup',
                tag: 'Startup founder', tagBg: 'rgba(255,153,51,0.1)', tagColor: '#854F0B',
                from: 'Bay Area', to: 'Bangalore', date: 'Mar 2023',
                quote: '"India is the best place to build right now. My burn rate is 4x lower, the talent pool is incredible, and the market is massive."',
                badge: 'Startup advice', badgeBg: '#FFF3E6', badgeColor: '#854F0B',
                replies: 28,
              },
              {
                initials: 'SR', bg: '#138808',
                name: 'Sridhar R.',
                role: 'Finance @ Citi → Real estate investor',
                tag: 'Real estate', tagBg: 'rgba(19,136,8,0.08)', tagColor: '#27500A',
                from: 'New York', to: 'Hyderabad', date: 'Nov 2022',
                quote: '"I used my US savings to buy 2 flats in Kokapet. 40% appreciation in 18 months. I\'m now building a portfolio full-time."',
                badge: 'Property strategy', badgeBg: '#E8F5E8', badgeColor: '#27500A',
                replies: 41,
              },
              {
                initials: 'PM', bg: '#7C5CBF',
                name: 'Priya M.',
                role: 'SDE @ Amazon → Remote from Pune',
                tag: 'Remote work', tagBg: 'rgba(124,92,191,0.08)', tagColor: '#3C3489',
                from: 'Dallas', to: 'Pune', date: 'Aug 2024',
                quote: '"US salary in India is a cheat code. I save 70% of my income, my kids are near their grandparents, and I work 5:30pm IST calls."',
                badge: 'Remote setup', badgeBg: '#E8E8FF', badgeColor: '#3C3489',
                replies: 19,
              },
              {
                initials: 'AS', bg: '#1D9E75',
                name: 'Ananya S.',
                role: 'FAANG engineer → VC-backed founder',
                tag: 'Career pivot', tagBg: 'rgba(29,158,117,0.08)', tagColor: '#085041',
                from: 'Bay Area', to: 'Hyderabad', date: 'Jan 2024',
                quote: '"I couldn\'t have afforded to take the startup risk in the US. In India, my runway is 3x longer. Raised our seed round in 4 months."',
                badge: 'Funding in India', badgeBg: 'rgba(29,158,117,0.1)', badgeColor: '#085041',
                replies: 33,
              },
              {
                initials: 'DM', bg: '#D4695A',
                name: 'Deepak M.',
                role: 'Infra architect → Consulting practice',
                tag: 'Hard lesson', tagBg: 'rgba(226,75,74,0.08)', tagColor: '#791F1F',
                from: 'Chicago', to: 'Chennai', date: 'Apr 2022',
                quote: '"I missed the RNOR window — nobody told me. Filed as a resident in year 1 and paid ₹32L in tax I didn\'t have to. Don\'t skip this step."',
                badge: 'Tax & RNOR', badgeBg: '#FCEBEB', badgeColor: '#791F1F',
                replies: 47,
              },
            ].map((p) => (
              <div key={p.name} className="card">
                {/* HEADER */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: p.bg, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 500, color: '#fff',
                  }}>{p.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.role}</div>
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 500, padding: '3px 8px',
                    borderRadius: '100px', background: p.tagBg, color: p.tagColor,
                    flexShrink: 0, whiteSpace: 'nowrap',
                  }}>{p.tag}</span>
                </div>

                {/* ROUTE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>{p.from}</span>
                  <span style={{ fontSize: '11px', color: 'var(--saffron)' }}>→</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--saffron)' }}>{p.to}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--ink-soft)' }}>Moved {p.date}</span>
                </div>

                {/* QUOTE */}
                <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '1rem' }}>{p.quote}</p>

                {/* FOOTER */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: '0.75rem', borderTop: '0.5px solid var(--border)',
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 9px', borderRadius: '100px', background: p.badgeBg, color: p.badgeColor }}>{p.badge}</span>
                  <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>{p.replies} replies</span>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM CTA */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              {['#000080','#FF9933','#138808','#7C5CBF','#1D9E75','#D4695A'].map((bg, i) => (
                <div key={i} style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: bg, border: '2px solid #FBF7F2',
                  marginLeft: i === 0 ? 0 : '-8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 500, color: '#fff',
                }}>
                  {['RK','VN','SR','PM','AS','DM'][i]}
                </div>
              ))}
              <span style={{ marginLeft: '12px', fontSize: '13px', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center' }}>
                +47 NRIs who&apos;ve already moved back
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
              IT veterans · startup founders · remote workers · real estate investors
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn-primary">Join the community →</Link>
              <Link href="/contact" className="btn-ghost">Browse conversations</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}