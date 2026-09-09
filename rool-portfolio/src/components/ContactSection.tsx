import { useState } from 'react';
import { SectionHead } from './WorkSection';

interface Props {
  onAdminOpen: () => void;
}

export default function ContactSection({ onAdminOpen }: Props) {
  return (
    <section
      id="contact-section"
      style={{ padding: '0 32px 40px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}
    >
      <SectionHead
        title="Get In Touch"
        sub="Open for commissions — reach out however's easiest."
      />

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
        <ContactCard
          href="https://discord.com/invite/TpBRMN48Vv"
          label="Discord"
          value="Join the server"
          color="#5865f2"
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.009c.12.098.245.195.372.288a.077.077 0 0 1-.006.128 12.299 12.299 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z"/>
            </svg>
          }
        />
        <ContactCard
          href="mailto:belfzak2@gmail.com"
          label="Email"
          value="belfzak2@gmail.com"
          color="var(--amber)"
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          }
        />
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', paddingBottom: 48 }}>
        <div style={{
          width: 48, height: 1,
          background: 'var(--line)', margin: '0 auto 20px',
        }} />
        <p style={{ color: 'var(--text-faint)', fontSize: '0.8rem', marginBottom: 18 }}>
          © 2025 Rool-Studio — All rights reserved
        </p>
        <button
          onClick={onAdminOpen}
          style={{
            background: 'none', border: 'none',
            color: 'var(--text-faint)', fontSize: '0.72rem',
            cursor: 'pointer', opacity: 0.35,
            transition: 'opacity 0.2s',
            padding: '4px 8px',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.35')}
          title="Studio management"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Studio
        </button>
      </div>
    </section>
  );
}

function ContactCard({ href, label, value, color, icon }: {
  href: string; label: string; value: string;
  color: string; icon: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target={href.startsWith('mailto') ? undefined : '_blank'}
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '20px 28px',
        background: 'var(--bg-panel)',
        border: `1px solid ${hovered ? `${color}44` : 'var(--line)'}`,
        borderRadius: 'var(--radius-lg)',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? `0 12px 30px -10px ${color}30` : 'none',
        minWidth: 240,
        textDecoration: 'none',
      }}
    >
      <div style={{ color }}>{icon}</div>
      <div>
        <span style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-faint)', fontWeight: 700, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </span>
        <span style={{ display: 'block', fontWeight: 700, color: 'var(--text)', fontSize: '0.97rem' }}>
          {value}
        </span>
      </div>
    </a>
  );
}
