import { useEffect, useRef } from 'react';

interface Props {
  onScrollWork: () => void;
  onScrollContact: () => void;
}

export default function Hero({ onScrollWork, onScrollContact }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [kickerRef.current, titleRef.current, subtitleRef.current, btnsRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      setTimeout(() => {
        if (!el) return;
        el.style.transition = 'opacity 0.75s var(--ease), transform 0.75s var(--ease)';
        el.style.opacity = '1';
        el.style.transform = 'none';
      }, 120 + i * 150);
    });
  }, []);

  return (
    <header
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        textAlign: 'center',
        padding: '120px 20px 80px',
        position: 'relative', zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 740 }}>
        {/* Kicker */}
        <p
          ref={kickerRef}
          style={{
            fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
            marginBottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          <span style={{ width: 28, height: 1, background: 'var(--line)', display: 'inline-block' }} />
          Roblox Developer
          <span style={{ width: 28, height: 1, background: 'var(--line)', display: 'inline-block' }} />
        </p>

        {/* Title */}
        <h1
          ref={titleRef}
          style={{
            fontSize: 'clamp(3rem, 10vw, 5.6rem)',
            fontWeight: 700, lineHeight: 1.0, marginBottom: 22,
            background: 'linear-gradient(160deg, #ffffff 35%, #c4b0fb 75%, #ec4899 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}
        >
          Rool-Studio
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontSize: '1.15rem', maxWidth: 560, margin: '0 auto 14px',
            color: 'var(--text-muted)', lineHeight: 1.7,
          }}
        >
          A pretty talented Roblox developer — I make cool stuff:
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 38 }}>
          {['Scripting', 'Animating', 'UI', 'Graphics'].map((tag) => (
            <span
              key={tag}
              style={{
                background: 'rgba(139,92,246,0.14)', color: '#c4b0fb',
                border: '1px solid rgba(139,92,246,0.25)',
                padding: '5px 14px', borderRadius: 999,
                fontSize: '0.82rem', fontWeight: 700,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div ref={btnsRef} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <HeroBtn primary onClick={onScrollWork}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            View our work
          </HeroBtn>
          <HeroBtn onClick={onScrollContact}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Get in touch
          </HeroBtn>
        </div>
      </div>

      <div className="scroll-cue">
        <span className="scroll-cue-inner" />
      </div>
    </header>
  );
}

function HeroBtn({ children, onClick, primary }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '13px 26px', borderRadius: 12,
        fontWeight: 700, fontSize: '0.97rem', cursor: 'pointer',
        border: primary ? 'none' : '1px solid var(--line)',
        background: primary ? 'var(--grad)' : 'rgba(255,255,255,0.05)',
        color: '#fff',
        boxShadow: primary ? '0 8px 28px -8px rgba(139,92,246,0.55)' : 'none',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'transform 0.22s var(--ease), box-shadow 0.22s, background 0.22s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        if (primary) e.currentTarget.style.boxShadow = '0 14px 32px -8px rgba(139,92,246,0.72)';
        else e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        if (primary) e.currentTarget.style.boxShadow = '0 8px 28px -8px rgba(139,92,246,0.55)';
        else e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      }}
    >
      {children}
    </button>
  );
}
