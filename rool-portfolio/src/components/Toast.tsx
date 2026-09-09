import { useEffect } from 'react';
import type { ToastMsg } from '../types';

interface Props {
  toasts: ToastMsg[];
  remove: (id: string) => void;
}

const borderColor: Record<string, string> = {
  success: 'var(--green)',
  error: 'var(--red)',
  info: 'var(--violet)',
};

export default function Toast({ toasts, remove }: Props) {
  return (
    <div
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 500,
        display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={remove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMsg; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3800);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={toast.leaving ? 'toast-leave' : 'toast-enter'}
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--line)',
        borderLeft: `3px solid ${borderColor[toast.type] ?? 'var(--violet)'}`,
        color: 'var(--text)',
        padding: '13px 18px',
        borderRadius: 12,
        fontSize: '0.9rem',
        fontWeight: 500,
        boxShadow: '0 10px 30px -8px rgba(0,0,0,0.5)',
        maxWidth: 320,
        pointerEvents: 'auto',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={() => onRemove(toast.id)}
    >
      {toast.message}
    </div>
  );
}
