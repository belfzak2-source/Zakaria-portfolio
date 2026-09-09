import { useState } from 'react';
import type { Payment } from '../types';
import { SectionHead } from './WorkSection';

interface Props {
  payment: Payment | null;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const METHODS = [
  {
    key: 'paypal' as const,
    label: 'PayPal',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.99l-.094.599a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .921-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.439-4.56z"/>
      </svg>
    ),
    color: '#0070ba',
  },
  {
    key: 'robux' as const,
    label: 'Robux',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    color: '#00b2ff',
  },
  {
    key: 'bank' as const,
    label: 'Bank Transfer',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    color: 'var(--amber)',
  },
];

export default function PaymentSection({ payment, addToast }: Props) {
  return (
    <section
      id="payment-section"
      style={{ padding: '0 32px 80px', maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}
    >
      <SectionHead
        title="Accepted Payment"
        sub="Click any method to copy the details."
      />

      <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
        {METHODS.map((m) => {
          const detail = payment?.[m.key] ?? '—';
          return (
            <PayCard
              key={m.key}
              label={m.label}
              detail={detail}
              icon={m.icon}
              color={m.color}
              onCopy={() => {
                navigator.clipboard.writeText(detail).then(() => {
                  addToast(`${m.label} details copied!`, 'success');
                }).catch(() => {
                  addToast('Copy failed — please copy manually.', 'error');
                });
              }}
            />
          );
        })}
      </div>
    </section>
  );
}

function PayCard({ label, detail, icon, color, onCopy }: {
  label: string; detail: string; icon: React.ReactNode;
  color: string; onCopy: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-panel)',
        border: `1px solid ${hovered ? `${color}55` : 'var(--line)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '28px 24px', minWidth: 220, flex: 1, maxWidth: 260,
        textAlign: 'center', cursor: 'pointer', color: 'var(--text)',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 14px 36px -10px ${color}40` : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 120,
        background: `radial-gradient(circle, ${color}18, transparent 70%)`,
        pointerEvents: 'none', transition: 'opacity 0.3s',
        opacity: hovered ? 1 : 0.5,
      }} />

      <div style={{ color, marginBottom: 14, display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <div style={{
        fontSize: '1.05rem', fontWeight: 700, marginBottom: 8,
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        {label}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', wordBreak: 'break-word', marginBottom: 14 }}>
        {detail}
      </div>
      <span style={{
        display: 'block', fontSize: '0.74rem',
        color: copied ? 'var(--green)' : 'var(--text-faint)',
        transition: 'color 0.3s',
        fontWeight: 600,
      }}>
        {copied ? '✓ Copied!' : 'Tap to copy'}
      </span>
    </button>
  );
}
