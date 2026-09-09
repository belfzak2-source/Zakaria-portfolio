import { useEffect, useRef, useState } from 'react';
import type { Stats } from '../types';

interface Props { stats: Stats | null; }

const STAT_DEFS = [
  { key: 'gamesMade' as const, label: 'Games Made', icon: '🎮' },
  { key: 'visitCount' as const, label: 'Total Visits', icon: '👁️' },
  { key: 'experienceYears' as const, label: 'Experience', icon: '⚡' },
];

export default function StatsSection({ stats }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="stats-section"
      style={{
        padding: '20px 20px 80px', position: 'relative', zIndex: 1,
      }}
    >
      <div
        style={{
          display: 'flex', justifyContent: 'center', gap: 18,
          maxWidth: 900, margin: '0 auto', flexWrap: 'wrap',
        }}
      >
        {STAT_DEFS.map((def, i) => {
          const val = stats?.[def.key] ?? '—';
          return (
            <StatCard
              key={def.key}
              icon={def.icon}
              label={def.label}
              value={val}
              visible={visible}
              delay={i * 120}
            />
          );
        })}
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, visible, delay }: {
  icon: string; label: string; value: string;
  visible: boolean; delay: number;
}) {
  const [displayVal, setDisplayVal] = useState('0');
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!visible || animated) return;
    setAnimated(true);

    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    const suffix = value.replace(/[0-9.]/g, '').trim();
    if (isNaN(num)) { setDisplayVal(value); return; }

    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const current = Math.round(num * ease * 10) / 10;
      setDisplayVal(`${Number.isInteger(current) ? current : current.toFixed(1)}${suffix}`);
      if (t < 1) requestAnimationFrame(tick);
    };
    setTimeout(() => requestAnimationFrame(tick), delay);
  }, [visible, animated, value, delay]);

  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        padding: '34px 28px',
        textAlign: 'center', flex: 1, minWidth: 200,
        position: 'relative', overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(24px)',
        transition: `opacity 0.7s var(--ease) ${delay}ms, transform 0.7s var(--ease) ${delay}ms`,
      }}
    >
      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: -40, right: -20,
        width: 130, height: 130,
        background: 'radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{icon}</div>
      <div
        style={{
          fontSize: '2.6rem', fontFamily: 'var(--font-display)', fontWeight: 700,
          background: 'var(--grad)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          marginBottom: 6, fontVariantNumeric: 'tabular-nums', lineHeight: 1,
        }}
      >
        {displayVal}
      </div>
      <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.93rem' }}>{label}</p>
    </div>
  );
}
