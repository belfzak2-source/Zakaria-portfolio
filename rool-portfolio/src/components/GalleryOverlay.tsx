import { useEffect, useRef, useState, useCallback } from 'react';
import type { WorkItem } from '../types';

interface Props {
  items: WorkItem[];
  category: string;
  onClose: () => void;
  onOpenItem: (item: WorkItem) => void;
}

export default function GalleryOverlay({ items, category, onClose, onOpenItem }: Props) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const touchStartX = useRef(0);
  const filtered = items.filter(i => i.category === category);
  const current = filtered[index];

  const go = useCallback((d: 'next' | 'prev') => {
    setDir(d);
    setIndex(i => {
      if (d === 'next') return (i + 1) % filtered.length;
      return (i - 1 + filtered.length) % filtered.length;
    });
  }, [filtered.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go('next');
      if (e.key === 'ArrowLeft') go('prev');
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, go]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) go(delta > 0 ? 'next' : 'prev');
  };

  if (!current) return null;

  return (
    <div
      className="overlay-enter"
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(4,4,8,0.97)',
        backdropFilter: 'blur(8px)',
        zIndex: 300,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {category} — {index + 1} / {filtered.length}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid var(--line)',
            color: '#fff', fontSize: '1.5rem', width: 40, height: 40,
            borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          ×
        </button>
      </div>

      {/* Stage */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', maxWidth: 1000, gap: 20, padding: '0 20px',
      }}>
        {/* Prev */}
        <NavArrow dir="prev" onClick={() => go('prev')} disabled={filtered.length <= 1} />

        {/* Card */}
        <div
          key={`${index}-${dir}`}
          style={{
            flex: 1, maxWidth: 760,
            background: 'var(--bg-panel)', border: '1px solid var(--line)',
            borderRadius: 22, overflow: 'hidden',
            animation: 'scaleIn 0.3s var(--ease) forwards',
          }}
        >
          {current.videoUrl ? (
            <video
              src={current.videoUrl} autoPlay muted loop playsInline
              style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <img
              src={current.thumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=760&h=420&fit=crop&auto=format'}
              alt={current.title}
              style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }}
            />
          )}
          <div style={{ padding: '18px 22px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 6 }}>{current.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 500, lineHeight: 1.6 }}>
                {current.description || ''}
              </p>
            </div>
            <button
              onClick={() => { onClose(); setTimeout(() => onOpenItem(current), 150); }}
              style={{
                padding: '10px 20px', borderRadius: 10, border: 'none',
                background: 'var(--grad)', color: '#fff', fontWeight: 700,
                cursor: 'pointer', fontSize: '0.88rem', whiteSpace: 'nowrap',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = '')}
            >
              View details
            </button>
          </div>
        </div>

        {/* Next */}
        <NavArrow dir="next" onClick={() => go('next')} disabled={filtered.length <= 1} />
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
        {filtered.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? 22 : 8, height: 8,
              borderRadius: 99,
              background: i === index ? 'var(--violet)' : 'var(--line)',
              border: 'none', cursor: 'pointer',
              transition: 'width 0.3s var(--ease), background 0.2s',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function NavArrow({ dir, onClick, disabled }: { dir: 'prev' | 'next'; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
        background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
        border: '1px solid var(--line)',
        color: disabled ? 'var(--text-faint)' : '#fff',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        {dir === 'prev'
          ? <path d="M15 18l-6-6 6-6"/>
          : <path d="M9 18l6-6-6-6"/>
        }
      </svg>
    </button>
  );
}
