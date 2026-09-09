import { useRef, useState } from 'react';

interface Props {
  views: number;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioPlaying: boolean;
  setAudioPlaying: (v: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
  showBack: boolean;
  onBack: () => void;
}

export default function TopBar({ views, audioRef, audioPlaying, setAudioPlaying, volume, setVolume, showBack, onBack }: Props) {
  const [showVolume, setShowVolume] = useState(false);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioPlaying) {
      audio.pause();
      setAudioPlaying(false);
    } else {
      audio.play().catch(() => {});
      setAudioPlaying(true);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <nav
      className="glass"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '14px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderLeft: 'none', borderRight: 'none', borderTop: 'none',
        borderBottom: '1px solid var(--line-soft)',
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {showBack && (
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.08)', border: '1px solid var(--line)',
              color: 'var(--text)', padding: '7px 14px 7px 10px',
              borderRadius: 999, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = '')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
        )}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: '1.05rem',
            background: 'var(--grad)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}
        >
          @Rool-Studio
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Audio toggle */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', position: 'relative' }}
          onMouseEnter={() => setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
        >
          <button
            onClick={toggleAudio}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text)', display: 'flex', alignItems: 'flex-end', gap: 2, height: 24 }}
            aria-label="Toggle music"
          >
            <div className={audioPlaying ? '' : 'eq-muted'} style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 16 }}>
              {[0,1,2,3].map(i => <span key={i} className="eq-bar" />)}
            </div>
          </button>
          <div
            style={{
              width: showVolume ? 76 : 0, opacity: showVolume ? 1 : 0,
              overflow: 'hidden',
              transition: 'width 0.25s var(--ease), opacity 0.25s',
            }}
          >
            <input
              type="range" min={0} max={1} step={0.01} value={volume}
              onChange={handleVolume}
              style={{ width: 76, accentColor: 'var(--violet)' }}
              aria-label="Volume"
            />
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: 'var(--line)' }} />

        {/* Views */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>{views > 0 ? views.toLocaleString() : '—'}</span>
        </div>
      </div>
    </nav>
  );
}
