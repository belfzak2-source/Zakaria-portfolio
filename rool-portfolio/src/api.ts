import type { WorkItem, Stats, Payment } from './types';

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

const STORAGE_KEY = 'rool_work_items';

const getStoredWork = (): WorkItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ITEMS));
      return MOCK_ITEMS;
    }
    return JSON.parse(data);
  } catch {
    return MOCK_ITEMS;
  }
};

const saveStoredWork = (items: WorkItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const api = {
  views: async () => ({ views: 0 }),

  stats: async () => {
    const raw = localStorage.getItem('rool_stats');
    return raw ? JSON.parse(raw) : { gamesMade: '12', visitCount: '4.2K', experienceYears: '3+ Yrs' };
  },

  work: async () => {
    return getStoredWork();
  },

  payment: async () => {
    const raw = localStorage.getItem('rool_payment');
    return raw ? JSON.parse(raw) : { paypal: 'belfzak2@gmail.com', robux: 'Group Funds / Gamepass', bank: 'DM for wire details' };
  },

  publishWork: async (data: any) => {
    if (data.password !== 'zak56belf') return { ok: false };
    const current = getStoredWork();
    const newItem: WorkItem = {
      _id: Date.now().toString(),
      title: data.title,
      category: data.category,
      role: data.role,
      thumbnailUrl: data.thumbnailUrl,
      videoUrl: data.videoUrl,
      gameLink: data.gameLink,
      description: data.description,
      createdAt: new Date().toISOString(),
    };
    saveStoredWork([newItem, ...current]);
    return { ok: true };
  },

  deleteWork: async (id: string, password: string) => {
    if (password !== 'zak56belf') return { ok: false };
    const current = getStoredWork();
    const updated = current.filter(item => item._id !== id);
    saveStoredWork(updated);
    return { ok: true };
  },

  updateStats: async (data: any) => {
    if (data.password !== 'zak56belf') return { ok: false };
    localStorage.setItem('rool_stats', JSON.stringify(data));
    return { ok: true };
  },

  updatePayment: async (data: any) => {
    if (data.password !== 'zak56belf') return { ok: false };
    localStorage.setItem('rool_payment', JSON.stringify(data));
    return { ok: true };
  }
};
