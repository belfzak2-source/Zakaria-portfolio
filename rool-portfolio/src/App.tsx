import { useEffect, useRef, useState, useCallback } from 'react';
import { api } from './api';
import type { WorkItem, Stats, Payment, ToastMsg } from './types';

import Particles from './components/Particles';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import WorkSection from './components/WorkSection';
import GamesSection from './components/GamesSection';
import GalleryOverlay from './components/GalleryOverlay';
import ItemModal from './components/ItemModal';
import PaymentSection from './components/PaymentSection';
import FeedbackSection from './components/FeedbackSection';
import ContactSection from './components/ContactSection';
import AdminPanel from './components/AdminPanel';
import Toast from './components/Toast';

const TRACKS = [
  "https://videotourl.com/audio/1788966590049-a2ac9e4d-1a4d-469f-b9a0-c6a873dfa743.mp3",
  "https://videotourl.com/audio/1788977518911-95c68b5c-35e2-4c8a-8390-d965ea3083fa.mp3",
  "https://videotourl.com/audio/1788977556485-4320f3b0-f87c-4791-8510-ab78e8fc22e9.mp3",
  "https://videotourl.com/audio/1788966579029-953def23-b443-4d2d-9df5-3ff3dcddf4ea.mp3"
];

const WEBSITE_TITLE = "Zakaria | Portfolio"; 

export default function App() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [views, setViews] = useState(0);

  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [galleryCategory, setGalleryCategory] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackIndexRef = useRef<number>(Math.floor(Math.random() * TRACKS.length));
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const [soundHintVisible, setSoundHintVisible] = useState(true);

  // ── Set Website Title ─────────────────────────────────────────
  useEffect(() => {
    document.title = WEBSITE_TITLE;
  }, []);

  // ── Audio init & Playlist Progression ─────────────────────────
  useEffect(() => {
    const initialTrack = TRACKS[currentTrackIndexRef.current];
    const audio = new Audio(initialTrack);
    audio.loop = false;
    audio.volume = volume;
    audioRef.current = audio;

    const handleEnded = () => {
      currentTrackIndexRef.current = (currentTrackIndexRef.current + 1) % TRACKS.length;
      audio.src = TRACKS[currentTrackIndexRef.current];
      audio.play().catch(() => {});
    };

    audio.addEventListener('ended', handleEnded);

    const startOnce = () => {
      audio.play().then(() => {
        setAudioPlaying(true);
        setSoundHintVisible(false);
      }).catch(() => {});
      document.removeEventListener('click', startOnce);
      document.removeEventListener('keydown', startOnce);
    };

    document.addEventListener('click', startOnce, { once: true });
    document.addEventListener('keydown', startOnce, { once: true });

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // ── Admin Toggle Shortcut (Shift + A) ──────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toUpperCase() === 'A') {
        setAdminOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Reveal on scroll ────────────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { 
          e.target.classList.add('visible'); 
          obs.unobserve(e.target); 
        }
      }),
      { threshold: 0.1 }
    );

    const refresh = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
    };

    refresh();
    const timer = setInterval(refresh, 1000);
    return () => { obs.disconnect(); clearInterval(timer); };
  }, [items]);

  // ── Data loading ────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const [viewsData, statsData, workData, payData] = await Promise.all([
        api.views(),
        api.stats(),
        api.work(),
        api.payment(),
      ]);
      
      if (viewsData && typeof viewsData.views === 'number') {
        setViews(viewsData.views);
      }
      if (statsData) setStats(statsData);
      if (workData) setItems(workData);
      if (payData) setPayment(payData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Toasts ──────────────────────────────────────────────────
  const addToast = useCallback((message: string, type: ToastMsg['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Scroll helpers ──────────────────────────────────────────
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Fixed background layers */}
      <div className="bg-image" />
      <div className="bg-grain" />
      <div className="bg-gradient" />
      <Particles />

      {/* Sound hint */}
      {soundHintVisible && (
        <div
          style={{
            position: 'fixed', left: '50%', bottom: 26,
            transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(15,15,26,0.9)', border: '1px solid var(--line)',
            padding: '9px 18px', borderRadius: 999,
            fontSize: '0.84rem', color: 'var(--text-muted)',
            backdropFilter: 'blur(12px)',
            zIndex: 90, pointerEvents: 'none',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--violet)" strokeWidth="2.2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.5 8.5a5 5 0 0 1 0 7"/>
          </svg>
          Click anywhere for music
        </div>
      )}

      {/* Top navigation */}
      <TopBar
        views={views}
        audioRef={audioRef}
        audioPlaying={audioPlaying}
        setAudioPlaying={setAudioPlaying}
        volume={volume}
        setVolume={setVolume}
        showBack={galleryCategory !== null}
        onBack={() => setGalleryCategory(null)}
      />

      {/* Main content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero
          onScrollWork={() => scrollTo('work-section')}
          onScrollContact={() => scrollTo('contact-section')}
        />
        <StatsSection stats={stats} />
        <WorkSection
          items={items}
          onOpenItem={setSelectedItem}
          onOpenGallery={setGalleryCategory}
        />
        <GamesSection
          items={items}
          onOpenItem={setSelectedItem}
        />
        <PaymentSection payment={payment} addToast={addToast} />
        <FeedbackSection addToast={addToast} />
        <ContactSection onAdminOpen={() => setAdminOpen(true)} />
      </main>

      {/* Modals & overlays */}
      {galleryCategory && (
        <GalleryOverlay
          items={items}
          category={galleryCategory}
          onClose={() => setGalleryCategory(null)}
          onOpenItem={item => { setGalleryCategory(null); setTimeout(() => setSelectedItem(item), 150); }}
        />
      )}

      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onDataRefresh={loadData}
        addToast={addToast}
      />

      {/* Toast stack */}
      <Toast toasts={toasts} remove={removeToast} />
    </>
  );
}
