export interface WorkItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  videoUrl?: string;
  gameLink?: string;
  role: string;
  createdAt: string;
}

export interface Stats {
  gamesMade: string;
  visitCount: string;
  experienceYears: string;
}

export interface Payment {
  paypal: string;
  robux: string;
  bank: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  message: string;
  stars: number;
  createdAt: string;
}

export interface ToastMsg {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  leaving?: boolean;
}
