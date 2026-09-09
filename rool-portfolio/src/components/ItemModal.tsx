import { useEffect, useRef } from 'react';
import type { WorkItem } from '../types';

interface Props {
  item: WorkItem;
  onClose: () => void;
}

const CATEGORY_COLOR: Record<string, string> = {
  Scripting: '#6366f1',
  Animations: '#ec4899',
  Ui: '#0ea5e9',
  Grafics: '#f59e0b',
  game: '#22c55e',
};

export default function ItemModal({ item, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const catColor = CATEGORY_COLOR[item.category] ?? 'var(--violet)';

  return (
    <div
      className="overlay-enter"
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(4,4,8,0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 260, padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal-enter"
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--line)',
          borderRadius: 22,
          maxWidth: 740, width: '100%',
          maxHeight: '90vh', overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(255,255,255,0.08)', border: 'none',
            color: '#fff', fontSize: '1.4rem', width: 36, height: 36,
            borderRadius: '50%', cursor: 'pointer', zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1, transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          ×
        </button>

        {/* Media */}
        <div style={{ background: '#000', borderRadius: '22px 22px 0 0', overflow: 'hidden', position: 'relative' }}>
          {item.videoUrl ? (
            <video
              ref={videoRef}
              src={item.videoUrl}
              style={{ width: '100%', maxHeight: 380, objectFit: 'cover', display: 'block' }}
              autoPlay muted loop playsInline
            />
          ) : (
            <img
              src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=740&h=380&fit=crop&auto=format'}
              alt={item.title}
              style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }}
            />
          )}
          {/* Gradient overlay on image */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(15,15,26,0.85) 0%, transparent 50%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Details */}
        <div style={{ padding: '22px 26px 28px' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <span
              style={{
                padding: '4px 12px', borderRadius: 999,
                fontSize: '0.76rem', fontWeight: 700,
                background: `${catColor}22`, color: catColor,
                border: `1px solid ${catColor}44`,
              }}
            >
              {item.category === 'game' ? 'Made Game' : item.category}
            </span>
            {item.role && (
              <span
                style={{
                  padding: '4px 12px', borderRadius: 999,
                  fontSize: '0.76rem', fontWeight: 600,
                  background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)',
                  border: '1px solid var(--line)',
                }}
              >
                {item.role}
              </span>
            )}
          </div>

          <h2 style={{ fontSize: '1.55rem', fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>
            {item.title}
          </h2>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20 }}>
            {item.description || 'No description provided.'}
          </p>

          {item.gameLink && (
            <a
              href={item.gameLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 12,
                background: '#12b76a', color: '#fff',
                fontWeight: 700, fontSize: '0.95rem',
                transition: 'background 0.2s, transform 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0f9d5b'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#12b76a'; e.currentTarget.style.transform = ''; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Play on Roblox
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
