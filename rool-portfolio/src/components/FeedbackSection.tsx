import { useState } from 'react';
import { SectionHead } from './WorkSection';

interface Props {
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const LABELS = ['Terrible', 'Bad', 'Okay', 'Good', 'Amazing!'];

export default function FeedbackSection({ addToast }: Props) {
  const [stars, setStars] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const active = hoverStar || stars;

  const handleSubmit = async () => {
    if (!stars) { addToast('Please select a star rating.', 'error'); return; }
    if (!message.trim()) { addToast('Please write a message.', 'error'); return; }
    setLoading(true);

    const item = { id: Date.now().toString(), name: name.trim() || 'Anonymous', message: message.trim(), stars, createdAt: new Date().toISOString() };

    // Store in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('rool_feedback') || '[]');
      localStorage.setItem('rool_feedback', JSON.stringify([item, ...existing]));
    } catch {}

    // Try to POST to backend (optional)
    try {
      await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
    } catch {}

    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
    addToast('Thanks for your feedback! ✨', 'success');
  };

  if (submitted) {
    return (
      <section
        id="feedback-section"
        style={{ padding: '0 32px 80px', maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}
      >
        <div style={{
          background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: 22,
          padding: '52px 32px', textAlign: 'center',
          animation: 'scaleIn 0.4s var(--ease-back) forwards',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 18 }}>🎉</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 10 }}>Feedback received!</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 22 }}>
            Thanks for taking the time — I genuinely read every single one.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 22 }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ fontSize: '1.5rem', filter: s <= stars ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>
            ))}
          </div>
          <button
            onClick={() => { setSubmitted(false); setStars(0); setName(''); setMessage(''); }}
            style={{
              padding: '10px 22px', borderRadius: 10, border: '1px solid var(--line)',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
              transition: 'background 0.2s',
            }}
          >
            Leave another
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="feedback-section"
      style={{ padding: '0 32px 80px', maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}
    >
      <SectionHead
        title="Feedback"
        sub="Worked with me or just browsing? Let me know what you think."
      />

      <div
        className="reveal"
        style={{
          background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: 22,
          padding: '36px 32px',
        }}
      >
        {/* Stars */}
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 14, fontWeight: 600 }}>
            Rate your experience
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
            {[1,2,3,4,5].map(s => (
              <button
                key={s}
                onClick={() => setStars(s)}
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '2rem', padding: '2px',
                  filter: s <= active ? 'none' : 'grayscale(1) opacity(0.25)',
                  transition: 'transform 0.15s var(--ease-back), filter 0.15s',
                  transform: s <= active ? 'scale(1.2)' : 'scale(1)',
                  animation: s === stars ? 'star-pop 0.3s var(--ease-back)' : 'none',
                }}
                aria-label={`${s} stars`}
              >
                ⭐
              </button>
            ))}
          </div>
          {active > 0 && (
            <p style={{ color: 'var(--violet)', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.04em' }}>
              {LABELS[active - 1]}
            </p>
          )}
        </div>

        {/* Name */}
        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Name <span style={{ opacity: 0.5 }}>(optional)</span>
          </span>
          <input
            className="admin-input"
            type="text"
            placeholder="Your name or handle"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>

        {/* Message */}
        <label style={{ display: 'block', marginBottom: 24 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Message <span style={{ color: 'var(--red)', opacity: 0.8 }}>*</span>
          </span>
          <textarea
            className="admin-input"
            placeholder="What do you think? Was everything smooth? Any suggestions?"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
          />
          <span style={{ fontSize: '0.76rem', color: 'var(--text-faint)', marginTop: 4, display: 'block' }}>
            {message.length} chars
          </span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: 'var(--grad)', color: '#fff',
            fontWeight: 700, fontSize: '1rem', cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s, transform 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
        >
          {loading ? (
            <>
              <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }} />
              Sending…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Send Feedback
            </>
          )}
        </button>
      </div>
    </section>
  );
}
