import { useState } from 'react';
import type { WorkItem } from '../types';
import { SectionHead } from './WorkSection';

interface Props {
  items: WorkItem[];
  onOpenItem: (item: WorkItem) => void;
}

export default function GamesSection({ items, onOpenItem }: Props) {
  const games = items.filter(i => i.category === 'game');

  return (
    <section
      id="games-section"
      style={{ padding: '0 32px 80px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}
    >
      <SectionHead
        title="Made Games"
        sub="Full titles shipped solo or in collaboration — click to explore."
      />

      {games.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '50px 0' }}>
          No games published yet — check back soon.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 22,
        }}>
          {games.map((game, i) => (
            <GameCard key={game._id} game={game} delay={i * 70} onClick={() => onOpenItem(game)} />
          ))}
        </div>
      )}
    </section>
  );
}

function GameCard({ game, delay, onClick }: { game: WorkItem; delay: number; onClick: () => void }) {
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
        borderColor: hovered ? 'rgba(34,197,94,0.45)' : 'var(--line)',
        boxShadow: hovered ? '0 16px 40px -12px rgba(34,197,94,0.2)' : 'none',
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#1a1a26' }}>
        <img
          src={game.thumbnailUrl || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=225&fit=crop&auto=format'}
          alt={game.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s var(--ease)', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15,15,26,0.92), transparent 50%)',
        }} />

        {/* Play button overlay */}
        {hovered && game.gameLink && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(4,4,8,0.4)',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pulse-ring 1.5s infinite',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
          </div>
        )}

        {/* Role badge */}
        <div style={{
          position: 'absolute', bottom: 12, left: 14,
          background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 999, padding: '4px 12px',
          fontSize: '0.74rem', fontWeight: 700, color: '#4ade80',
        }}>
          {game.role || 'Solo'}
        </div>
      </div>

      <div style={{ padding: '16px 18px 20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6, fontFamily: 'var(--font-display)' }}>
          {game.title}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 14 }}>
          {(game.description || '').slice(0, 100)}{game.description && game.description.length > 100 ? '…' : ''}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>Click to explore</span>
          {game.gameLink && (
            <span style={{
              background: 'rgba(34,197,94,0.12)', color: '#22c55e',
              fontSize: '0.74rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999,
              border: '1px solid rgba(34,197,94,0.2)',
            }}>
              Roblox
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
