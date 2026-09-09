import type { WorkItem, Stats, Payment } from './types';

const API_URL = 'http://localhost:5000/api';

export const api = {
  views: async () => {
    try {
      const lastViewTime = localStorage.getItem('last_view_time');
      const now = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000; 

      if (!lastViewTime || now - parseInt(lastViewTime, 10) >= ONE_DAY) {
        // 24 hours passed or new user: Tell server to add +1
        const res = await fetch(`${API_URL}/views`, { method: 'POST' });
        const data = await res.json();
        localStorage.setItem('last_view_time', now.toString()); 
        return { views: data.views };
      } else {
        // Cooldown active: Just grab the current count without adding
        const res = await fetch(`${API_URL}/views`);
        const data = await res.json();
        return { views: data.views };
      }
    } catch {
      return { views: 0 };
    }
  },

  stats: async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      return await res.json();
    } catch {
      return { gamesMade: '0', visitCount: '0', experienceYears: '0' };
    }
  },

  work: async () => {
    try {
      const res = await fetch(`${API_URL}/work`);
      return await res.json();
    } catch {
      return []; // Starts empty since Mock items are removed!
    }
  },

  payment: async () => {
    try {
      const res = await fetch(`${API_URL}/payment`);
      return await res.json();
    } catch {
      return { paypal: '', robux: '', bank: '' };
    }
  },

  publishWork: async (data: any) => {
    try {
      const res = await fetch(`${API_URL}/work`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch {
      return { ok: false };
    }
  },

  deleteWork: async (id: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/work/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      return await res.json();
    } catch {
      return { ok: false };
    }
  },

  updateStats: async (data: any) => {
    try {
      const res = await fetch(`${API_URL}/stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch {
      return { ok: false };
    }
  },

  updatePayment: async (data: any) => {
    try {
      const res = await fetch(`${API_URL}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch {
      return { ok: false };
    }
  }
};
