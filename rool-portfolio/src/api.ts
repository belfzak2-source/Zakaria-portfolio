import type { WorkItem, Stats, Payment } from './types';

const BASE = (import.meta as any).env?.VITE_API_URL ?? '';

const MOCK_ITEMS: WorkItem[] = [
  {
    _id: 'm1', title: 'Combat System', category: 'Scripting',
    description: 'Advanced melee & ranged combat with combos, knockback, and smooth animations.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=480&h=280&fit=crop&auto=format',
    role: 'Solo', createdAt: '',
  },
  {
    _id: 'm2', title: 'Character Rig & Anims', category: 'Animations',
    description: 'Full R15 rig with idle, walk, run, jump, and attack animations blended seamlessly.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=480&h=280&fit=crop&auto=format',
    role: 'Solo', createdAt: '',
  },
  {
    _id: 'm3', title: 'RPG Inventory UI', category: 'Ui',
    description: 'Drag-and-drop inventory with hotbar, item tooltips, and animated transitions.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=480&h=280&fit=crop&auto=format',
    role: 'Solo', createdAt: '',
  },
  {
    _id: 'm4', title: 'Game Logo Pack', category: 'Grafics',
    description: 'Complete brand identity — icon, banner, thumbnail, and social assets.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=480&h=280&fit=crop&auto=format',
    role: 'Solo', createdAt: '',
  },
  {
    _id: 'm5', title: 'NPC AI System', category: 'Scripting',
    description: 'Pathfinding NPCs with patrol, detect, chase, and flee states.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=480&h=280&fit=crop&auto=format',
    role: '80% Scripter', createdAt: '',
  },
  {
    _id: 'm6', title: 'Void Odyssey', category: 'game',
    description: 'Space exploration adventure — mine asteroids, build ships, fight pirates.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=480&h=280&fit=crop&auto=format',
    role: 'Solo Dev', createdAt: '', gameLink: 'https://www.roblox.com/games',
  },
];

const MOCK_STATS: Stats = { gamesMade: '12', visitCount: '4.2K', experienceYears: '3+ Yrs' };
const MOCK_PAYMENT: Payment = { paypal: 'belfzak2@gmail.com', robux: 'Group Funds / Gamepass', bank: 'DM for wire details' };

async function tryFetch<T>(url: string, opts?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${BASE}${url}`, opts);
    if (!res.ok) throw new Error(String(res.status));
    return res.json() as Promise<T>;
  } catch {
    if (fallback !== undefined) return fallback;
    throw new Error('API unavailable');
  }
}

export const api = {
  views: () => tryFetch<{ views: number }>('/api/views', { method: 'POST' }, { views: 0 }),
  stats: () => tryFetch<Stats>('/api/stats', undefined, MOCK_STATS),
  work: () => tryFetch<WorkItem[]>('/api/work', undefined, MOCK_ITEMS),
  payment: () => tryFetch<Payment>('/api/payment', undefined, MOCK_PAYMENT),

  updateStats: (data: Record<string, string>) =>
    fetch(`${BASE}/api/stats`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),

  publishWork: (data: Record<string, string>) =>
    fetch(`${BASE}/api/work`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),

  deleteWork: (id: string, password: string) =>
    fetch(`${BASE}/api/work/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }),

  updatePayment: (data: Record<string, string>) =>
    fetch(`${BASE}/api/payment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
};
