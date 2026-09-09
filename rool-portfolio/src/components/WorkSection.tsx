import { useState } from 'react';
import type { WorkItem } from '../types';

interface Props {
  items: WorkItem[];
  onOpenItem: (item: WorkItem) => void;
  onOpenGallery: (category: string) => void;
}

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Scripting', value: 'Scripting' },
  { label: 'Animations', value: 'Animations' },
  { label: 'UI', value: 'Ui' },
  { label: 'Graphics', value: 'Grafics' },
];

export default function WorkSection({ items, onOpenItem, onOpenGallery }: Props) {
  const [activeTab, setActiveTab] = useState('all');

  const commissions = items.filter(i => i.category !== 'game');
  const filtered = activeTab === 'all'
    ? commissions
    : commissions.filter(i => i.category === activeTab);

  const handleTab = (val: string) => {
    if (val !== 'all') {
      const hasItems = commissions.some(i => i.category === val);
      if (hasItems) { onOpenGallery(val); return; }
    }
    setActiveTab(val);
  };

  return (
    <section
      id="work-section"
      style={{ padding: '80px 32px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}
    >
      <SectionHead
        title="Commissions"
        sub="Work crafted for clients — scripting, animation, UI, and graphics."
      />

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
        {TABS.map(t => {
          const isActive = activeTab === t.value;
          const hasItems = t.value === 'all' || commissions.some(i => i.category === t.value);
          return (
            <button
              key={t.value}
              onClick={() => handleTab(t.value)}
              style={{
                padding: '8px 20px', borderRadius: 999,
                background: isActive ? 'var(--grad)' : 'var(--bg-panel)',
                border: `1px solid ${isActive ? 'transparent' : 'var(--line)'}`,
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s',
                opacity: hasItems ? 1 : 0.4,
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--line)'; } }}
            >
              {t.value !== 'all' && (
                <span style={{
                  display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                  background: hasItems ? 'currentColor' : 'var(--text-faint)',
                  marginRight: 7, verticalAlign: 'middle', opacity: 0.7,
                }} />
              )}
              {t.label}
              {t.value !== 'all' && hasItems && (
                <span style={{
                  marginLeft: 6, fontSize: '0.7rem', opacity: 0.6,
                  fontStyle: 'italic', fontWeight: 400,
                }}>gallery</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '50px 0' }}>
          Nothing published in this category yet.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {filtered.map((item, i) => (
            <WorkCard key={item._id} item={item} delay={i * 60} onClick={() => onOpenItem(item)} />
          ))}
        </div>
      )}
    </section>
  );
}

function WorkCard({ item, delay, onClick }: { item: WorkItem; delay: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      className="reveal"
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden', cursor: 'pointer',
        transition: 'border-color 0.25s, transform 0.25s var(--ease), box-shadow 0.25s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        borderColor: hovered ? 'rgba(139,92,246,0.45)' : 'var(--line)',
        boxShadow: hovered ? '0 16px 40px -12px rgba(139,92,246,0.3)' : 'none',
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden', background: '#1a1a26' }}>
        <img
          src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=240&fit=crop&auto=format'}
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s var(--ease)', transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15,15,26,0.88), transparent 45%)',
        }} />
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(15,15,26,0.85)', border: '1px solid var(--line)',
          borderRadius: 999, padding: '3px 10px',
          fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)',
          backdropFilter: 'blur(6px)',
        }}>
          {item.category}
        </div>
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{ fontSize: '1.06rem', fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-display)' }}>
          {item.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            background: 'rgba(139,92,246,0.15)', color: '#c4b0fb',
            fontSize: '0.76rem', fontWeight: 700, padding: '4px 10px', borderRadius: 999,
          }}>
            {item.role || item.category}
          </span>
          <span style={{
            color: 'var(--text-faint)', fontSize: '0.8rem',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            View
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="reveal" style={{ textAlign: 'center', marginBottom: 36 }}>
      <h2 style={{
        fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
        fontWeight: 700, marginBottom: 10, lineHeight: 1.1,
      }}>
        {title}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
        {sub}
      </p>
    </div>
  );
}
