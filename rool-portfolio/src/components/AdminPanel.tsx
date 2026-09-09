import { useEffect, useRef, useState } from 'react';
import { api } from '../api';
import type { WorkItem, FeedbackItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDataRefresh: () => void;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const ADMIN_PW = 'zak56belf';

type AdminTab = 'stats' | 'publish' | 'manage' | 'payment' | 'feedback';

export default function AdminPanel({ isOpen, onClose, onDataRefresh, addToast }: Props) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) { setAuthed(false); setPw(''); setPwError(false); }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const tryUnlock = () => {
    if (pw === ADMIN_PW) { setAuthed(true); setPwError(false); }
    else { setPwError(true); setTimeout(() => setPwError(false), 800); }
  };

  if (!isOpen) return null;

  return (
    <div
      className="overlay-enter"
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(4,4,8,0.88)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 400, padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {authed
        ? <PanelContent onClose={onClose} onLogout={() => setAuthed(false)} onDataRefresh={onDataRefresh} addToast={addToast} />
        : (
          <div
            className={`modal-enter${pwError ? ' shake' : ''}`}
            style={{
              background: 'var(--bg-panel)', border: '1px solid var(--line)',
              borderRadius: 22, maxWidth: 380, width: '100%', padding: '36px 30px',
              textAlign: 'center', position: 'relative',
            }}
          >
            <CloseBtn onClick={onClose} />
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 8 }}>Admin Access</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 24 }}>
              This area is for the studio owner only.
            </p>
            <input
              ref={inputRef}
              type="password"
              placeholder="Password"
              value={pw}
              className="admin-input"
              style={{ textAlign: 'center', letterSpacing: '0.15em', marginBottom: 14, borderColor: pwError ? 'var(--red)' : undefined }}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') tryUnlock(); }}
            />
            <button
              onClick={tryUnlock}
              style={{
                width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                background: 'var(--grad)', color: '#fff', fontWeight: 700, cursor: 'pointer',
                fontSize: '1rem', transition: 'opacity 0.2s',
              }}
            >
              Unlock
            </button>
            {pwError && (
              <p style={{ color: 'var(--red)', fontSize: '0.82rem', marginTop: 10 }}>Incorrect password</p>
            )}
          </div>
        )
      }
    </div>
  );
}

function PanelContent({ onClose, onLogout, onDataRefresh, addToast }: {
  onClose: () => void; onLogout: () => void;
  onDataRefresh: () => void; addToast: (m: string, t?: 'success' | 'error' | 'info') => void;
}) {
  const [tab, setTab] = useState<AdminTab>('stats');

  const TABS: { key: AdminTab; label: string }[] = [
    { key: 'stats', label: 'Stats' },
    { key: 'publish', label: 'Publish' },
    { key: 'manage', label: 'Manage' },
    { key: 'payment', label: 'Payment' },
    { key: 'feedback', label: 'Feedback' },
  ];

  return (
    <div
      className="modal-enter"
      style={{
        background: 'var(--bg-panel)', border: '1px solid var(--line)',
        borderRadius: 22, maxWidth: 640, width: '100%',
        maxHeight: '90vh', overflowY: 'auto', position: 'relative',
        padding: '28px 28px 32px',
      }}
    >
      <CloseBtn onClick={onClose} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, paddingRight: 32 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
          <span className="grad-text">Rool-Studio</span> Admin
        </h2>
        <button
          onClick={onLogout}
          style={{ background: 'none', border: 'none', color: 'var(--text-faint)', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Lock
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, margin: '18px 0 22px', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '7px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: tab === t.key ? 'var(--grad)' : 'var(--bg-panel-2)',
              color: tab === t.key ? '#fff' : 'var(--text-muted)',
              fontWeight: 700, fontSize: '0.85rem',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'stats' && <StatsTab addToast={addToast} onDataRefresh={onDataRefresh} />}
      {tab === 'publish' && <PublishTab addToast={addToast} onDataRefresh={onDataRefresh} />}
      {tab === 'manage' && <ManageTab addToast={addToast} onDataRefresh={onDataRefresh} />}
      {tab === 'payment' && <PaymentTab addToast={addToast} onDataRefresh={onDataRefresh} />}
      {tab === 'feedback' && <FeedbackTab />}
    </div>
  );
}

/* ── Stats tab ─────────────────────────── */
function StatsTab({ addToast, onDataRefresh }: { addToast: (m: string, t?: 'success' | 'error' | 'info') => void; onDataRefresh: () => void }) {
  const [gamesMade, setGamesMade] = useState('');
  const [visitCount, setVisitCount] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.updateStats({ password: ADMIN_PW, gamesMade, visitCount, experienceYears });
      if (res.ok) { addToast('Stats updated!', 'success'); onDataRefresh(); }
      else addToast('Failed to save stats.', 'error');
    } catch { addToast('Network error.', 'error'); }
    setSaving(false);
  };

  return (
    <div>
      <SectionLabel>Update public stats</SectionLabel>
      <Field label="Games made" placeholder="e.g. 15" value={gamesMade} onChange={setGamesMade} />
      <Field label="Visit count" placeholder="e.g. 2.4M" value={visitCount} onChange={setVisitCount} />
      <Field label="Experience" placeholder="e.g. 3+ Years" value={experienceYears} onChange={setExperienceYears} />
      <SaveBtn loading={saving} onClick={save} />
    </div>
  );
}

/* ── Publish tab ───────────────────────── */
function PublishTab({ addToast, onDataRefresh }: { addToast: (m: string, t?: 'success' | 'error' | 'info') => void; onDataRefresh: () => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Scripting');
  const [role, setRole] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [gameLink, setGameLink] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const publish = async () => {
    if (!title.trim()) { addToast('Title is required.', 'error'); return; }
    setSaving(true);
    try {
      const res = await api.publishWork({ password: ADMIN_PW, title, category, role, thumbnailUrl, videoUrl, gameLink, description });
      if (res.ok) {
        addToast('Published!', 'success');
        onDataRefresh();
        setTitle(''); setRole(''); setThumbnailUrl(''); setVideoUrl(''); setGameLink(''); setDescription('');
      } else addToast('Failed to publish.', 'error');
    } catch { addToast('Network error.', 'error'); }
    setSaving(false);
  };

  return (
    <div>
      <SectionLabel>Publish new work or game</SectionLabel>
      <Field label="Title *" placeholder="Commission or game title" value={title} onChange={setTitle} />
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category</label>
        <select className="admin-input" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="Scripting">Scripting</option>
          <option value="Animations">Animations</option>
          <option value="Ui">UI</option>
          <option value="Grafics">Graphics</option>
          <option value="game">Made Game</option>
        </select>
      </div>
      <Field label="Role / share" placeholder="e.g. Solo or 60% Scripter" value={role} onChange={setRole} />
      <Field label="Thumbnail URL" placeholder="https://..." value={thumbnailUrl} onChange={setThumbnailUrl} />
      <Field label="Video URL (optional, loops)" placeholder="https://..." value={videoUrl} onChange={setVideoUrl} />
      {category === 'game' && (
        <Field label="Roblox game link" placeholder="https://www.roblox.com/games/..." value={gameLink} onChange={setGameLink} />
      )}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>Description</label>
        <textarea
          className="admin-input"
          placeholder="Describe the work..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      {/* Preview thumbnail */}
      {thumbnailUrl && (
        <div style={{ marginBottom: 18, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--line)' }}>
          <img src={thumbnailUrl} alt="Preview" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} />
        </div>
      )}

      <SaveBtn loading={saving} onClick={publish} label="Publish" />
    </div>
  );
}

/* ── Manage tab ────────────────────────── */
function ManageTab({ addToast, onDataRefresh }: { addToast: (m: string, t?: 'success' | 'error' | 'info') => void; onDataRefresh: () => void }) {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.work().then(setItems).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      const res = await api.deleteWork(id, ADMIN_PW);
      if (res.ok) {
        setItems(prev => prev.filter(i => i._id !== id));
        onDataRefresh();
        addToast('Item deleted.', 'success');
      } else {
        addToast('Delete failed — check your backend for a DELETE endpoint.', 'error');
      }
    } catch { addToast('Network error.', 'error'); }
  };

  if (loading) return <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>Loading…</p>;

  return (
    <div>
      <SectionLabel>Published items ({items.length})</SectionLabel>
      {items.length === 0 && (
        <p style={{ color: 'var(--text-faint)', textAlign: 'center', padding: '30px 0' }}>Nothing published yet.</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 420, overflowY: 'auto' }}>
        {items.map(item => (
          <div
            key={item._id}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--bg-panel-2)', border: '1px solid var(--line)',
              borderRadius: 12, padding: '10px 14px',
            }}
          >
            <img
              src={item.thumbnailUrl || ''}
              alt=""
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', background: '#1a1a26', flexShrink: 0 }}
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: 2 }}>
                {item.category} · {item.role || '—'}
              </div>
            </div>
            <button
              onClick={() => handleDelete(item._id)}
              style={{
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                color: '#f87171', width: 32, height: 32, borderRadius: 8,
                cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.2s',
              }}
              title="Delete"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Payment tab ───────────────────────── */
function PaymentTab({ addToast, onDataRefresh }: { addToast: (m: string, t?: 'success' | 'error' | 'info') => void; onDataRefresh: () => void }) {
  const [paypal, setPaypal] = useState('');
  const [robux, setRobux] = useState('');
  const [bank, setBank] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.updatePayment({ password: ADMIN_PW, paypal, robux, bank });
      if (res.ok) { addToast('Payment info updated!', 'success'); onDataRefresh(); }
      else addToast('Failed to save.', 'error');
    } catch { addToast('Network error.', 'error'); }
    setSaving(false);
  };

  return (
    <div>
      <SectionLabel>Update payment methods</SectionLabel>
      <Field label="PayPal" placeholder="PayPal email or details" value={paypal} onChange={setPaypal} />
      <Field label="Robux" placeholder="Group funds / gamepass details" value={robux} onChange={setRobux} />
      <Field label="Bank transfer" placeholder="Wire details" value={bank} onChange={setBank} />
      <SaveBtn loading={saving} onClick={save} />
    </div>
  );
}

/* ── Feedback tab ──────────────────────── */
function FeedbackTab() {
  const [items, setItems] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('rool_feedback');
      setItems(raw ? JSON.parse(raw) : []);
    } catch { setItems([]); }
  }, []);

  const clear = () => {
    localStorage.removeItem('rool_feedback');
    setItems([]);
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-faint)' }}>
        No feedback received yet on this device.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <SectionLabel>Feedback ({items.length})</SectionLabel>
        <button onClick={clear} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: '0.8rem', cursor: 'pointer' }}>
          Clear all
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 400, overflowY: 'auto' }}>
        {items.map(fb => (
          <div
            key={fb.id}
            style={{
              background: 'var(--bg-panel-2)', border: '1px solid var(--line)',
              borderRadius: 12, padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{fb.name}</div>
              <div style={{ fontSize: '0.82rem' }}>{'⭐'.repeat(fb.stars)}</div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', lineHeight: 1.6 }}>{fb.message}</p>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: 8 }}>
              {new Date(fb.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Shared sub-components ─────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16 }}>
      {children}
    </h3>
  );
}

function Field({ label, placeholder, value, onChange, type = 'text' }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; type?: string;
}) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="admin-input"
      />
    </label>
  );
}

function SaveBtn({ loading, onClick, label = 'Save' }: { loading: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        padding: '12px 24px', borderRadius: 12, border: 'none',
        background: 'var(--grad)', color: '#fff', fontWeight: 700,
        cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1,
        fontSize: '0.95rem', marginTop: 4,
        display: 'flex', alignItems: 'center', gap: 8,
        transition: 'opacity 0.2s',
      }}
    >
      {loading && (
        <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }} />
      )}
      {loading ? 'Saving…' : label}
    </button>
  );
}

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute', top: 14, right: 14,
        background: 'rgba(255,255,255,0.07)', border: 'none', color: '#fff',
        fontSize: '1.4rem', width: 34, height: 34, borderRadius: '50%',
        cursor: 'pointer', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
    >
      ×
    </button>
  );
}
