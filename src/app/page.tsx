'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, ArrowLeft, Clock, CheckCircle2, ChevronRight,
  Wallet, QrCode, Building2, Store, Tag, History, Home,
  Shield, Star, Zap, Gift, Gamepad2, X, Copy, AlertCircle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = 'home' | 'game' | 'payment' | 'processing' | 'success' | 'history';

interface GamePackage {
  id: string;
  label: string;
  price: number;
  badge?: string;
}

interface Game {
  id: string;
  name: string;
  emoji: string;
  category: string;
  gradient: string;
  desc: string;
  hasServer: boolean;
  servers?: string[];
  zones?: string[];
  packages: GamePackage[];
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  fee: number;
  group: 'ewallet' | 'qris' | 'bank' | 'retail';
}

interface Order {
  id: string;
  gameId: string;
  gameName: string;
  gameEmoji: string;
  packageName: string;
  userId: string;
  server?: string;
  zone?: string;
  paymentMethod: string;
  total: number;
  status: 'processing' | 'success' | 'failed';
  createdAt: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const GAMES: Game[] = [
  {
    id: 'ml', name: 'Mobile Legends', emoji: '⚔️', category: 'MOBA',
    gradient: 'from-blue-600 to-indigo-800',
    desc: 'Top up Diamond Mobile Legends cepat & murah',
    hasServer: true,
    servers: ['Indonesia', 'Malaysia', 'Singapore', 'Philippines'],
    zones: ['Zona 1', 'Zona 2', 'Zona 3', 'Zona 4'],
    packages: [
      { id: 'ml1', label: '86 ⬥', price: 19000 },
      { id: 'ml2', label: '172 ⬥', price: 38000 },
      { id: 'ml3', label: '257 ⬥', price: 57000 },
      { id: 'ml4', label: '344 ⬥', price: 76000, badge: 'Populer' },
      { id: 'ml5', label: '514 ⬥', price: 114000, badge: 'Hemat' },
      { id: 'ml6', label: '706 ⬥', price: 152000, badge: 'Hemat' },
    ],
  },
  {
    id: 'pubg', name: 'PUBG Mobile', emoji: '🔫', category: 'Battle Royale',
    gradient: 'from-amber-600 to-yellow-700',
    desc: 'Beli UC PUBG Mobile instan',
    hasServer: false,
    packages: [
      { id: 'pubg1', label: '60 UC', price: 15000 },
      { id: 'pubg2', label: '325 UC', price: 75000, badge: 'Populer' },
      { id: 'pubg3', label: '660 UC', price: 150000 },
      { id: 'pubg4', label: '1800 UC', price: 375000, badge: 'Hemat' },
      { id: 'pubg5', label: '3850 UC', price: 750000, badge: 'Hemat' },
    ],
  },
  {
    id: 'ff', name: 'Free Fire', emoji: '🔥', category: 'Battle Royale',
    gradient: 'from-orange-600 to-red-700',
    desc: 'Top up Diamond Free Fire termurah',
    hasServer: false,
    packages: [
      { id: 'ff1', label: '100 ⬥', price: 15000 },
      { id: 'ff2', label: '310 ⬥', price: 46000, badge: 'Populer' },
      { id: 'ff3', label: '520 ⬥', price: 76000 },
      { id: 'ff4', label: '1060 ⬥', price: 152000, badge: 'Hemat' },
      { id: 'ff5', label: '2180 ⬥', price: 304000, badge: 'Hemat' },
    ],
  },
  {
    id: 'roblox', name: 'Roblox', emoji: '🧱', category: 'Sandbox',
    gradient: 'from-red-500 to-pink-600',
    desc: 'Beli Robux Roblox murah',
    hasServer: false,
    packages: [
      { id: 'rbx1', label: '80 R$', price: 15000 },
      { id: 'rbx2', label: '200 R$', price: 38000, badge: 'Populer' },
      { id: 'rbx3', label: '400 R$', price: 76000 },
      { id: 'rbx4', label: '800 R$', price: 152000, badge: 'Hemat' },
      { id: 'rbx5', label: '1700 R$', price: 304000, badge: 'Hemat' },
    ],
  },
  {
    id: 'efootball', name: 'eFootball 2024', emoji: '⚽', category: 'Sports',
    gradient: 'from-green-600 to-emerald-700',
    desc: 'Top up eFootball Coins terpercaya',
    hasServer: false,
    packages: [
      { id: 'ef1', label: '100 ⚽', price: 15000 },
      { id: 'ef2', label: '300 ⚽', price: 46000, badge: 'Populer' },
      { id: 'ef3', label: '600 ⚽', price: 84000 },
      { id: 'ef4', label: '1200 ⚽', price: 152000, badge: 'Hemat' },
      { id: 'ef5', label: '3000 ⚽', price: 380000, badge: 'Hemat' },
    ],
  },
  {
    id: 'eafc', name: 'EA FC 25', emoji: '🏅', category: 'Sports',
    gradient: 'from-sky-600 to-cyan-700',
    desc: 'Beli FC Points EA FC 25',
    hasServer: false,
    packages: [
      { id: 'eafc1', label: '500 FP', price: 46000 },
      { id: 'eafc2', label: '1050 FP', price: 84000, badge: 'Populer' },
      { id: 'eafc3', label: '2200 FP', price: 152000 },
      { id: 'eafc4', label: '4600 FP', price: 304000, badge: 'Hemat' },
      { id: 'eafc5', label: '12000 FP', price: 760000, badge: 'Hemat' },
    ],
  },
  {
    id: 'cod', name: 'Call of Duty Mobile', emoji: '🎖️', category: 'FPS',
    gradient: 'from-zinc-600 to-stone-700',
    desc: 'Top up CP COD Mobile tercepat',
    hasServer: false,
    packages: [
      { id: 'cod1', label: '80 CP', price: 15000 },
      { id: 'cod2', label: '400 CP', price: 76000, badge: 'Populer' },
      { id: 'cod3', label: '800 CP', price: 152000 },
      { id: 'cod4', label: '2000 CP', price: 380000, badge: 'Hemat' },
      { id: 'cod5', label: '4000 CP', price: 760000, badge: 'Hemat' },
    ],
  },
  {
    id: 'hok', name: 'Honor of Kings', emoji: '🏆', category: 'MOBA',
    gradient: 'from-violet-600 to-purple-800',
    desc: 'Beli Token HoK aman & murah',
    hasServer: false,
    packages: [
      { id: 'hok1', label: '50 🏆', price: 15000 },
      { id: 'hok2', label: '100 🏆', price: 30000, badge: 'Populer' },
      { id: 'hok3', label: '300 🏆', price: 84000 },
      { id: 'hok4', label: '600 🏆', price: 152000, badge: 'Hemat' },
      { id: 'hok5', label: '1200 🏆', price: 304000, badge: 'Hemat' },
    ],
  },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'gopay', name: 'GoPay', icon: '💚', fee: 0, group: 'ewallet' },
  { id: 'ovo', name: 'OVO', icon: '💜', fee: 1000, group: 'ewallet' },
  { id: 'dana', name: 'DANA', icon: '💙', fee: 0, group: 'ewallet' },
  { id: 'shopeepay', name: 'ShopeePay', icon: '🧡', fee: 500, group: 'ewallet' },
  { id: 'qris', name: 'QRIS', icon: '🔲', fee: 0, group: 'qris' },
  { id: 'bca', name: 'BCA', icon: '🏦', fee: 2500, group: 'bank' },
  { id: 'bni', name: 'BNI', icon: '🏦', fee: 2500, group: 'bank' },
  { id: 'bri', name: 'BRI', icon: '🏦', fee: 2500, group: 'bank' },
  { id: 'mandiri', name: 'Mandiri', icon: '🏦', fee: 2500, group: 'bank' },
  { id: 'alfamart', name: 'Alfamart', icon: '🏪', fee: 1500, group: 'retail' },
  { id: 'indomaret', name: 'Indomaret', icon: '🏪', fee: 1500, group: 'retail' },
];

const CATEGORIES = ['Semua', 'MOBA', 'Battle Royale', 'FPS', 'Sports', 'Sandbox'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function genOrderId() {
  return 'TU-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="animate-[fadeIn_0.3s_ease-out]">{children}</div>;
}

// ─── Toast Component ──────────────────────────────────────────────────────────

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[200] px-5 py-3 rounded-xl border pointer-events-none will-change-transform text-sm font-semibold
        ${visible ? 'translate-x-[-50%] translate-y-0 opacity-100' : 'translate-x-[-50%] translate-y-20 opacity-0'}`}
      style={{
        background: '#1e1e2e',
        borderColor: 'rgba(245,158,11,0.3)',
        color: '#f59e0b',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {message}
    </div>
  );
}

// ─── QR Code Placeholder ──────────────────────────────────────────────────────

function QRPlaceholder() {
  const cells = Array.from({ length: 121 }, (_, i) => {
    const row = Math.floor(i / 11);
    const col = i % 11;
    const isCorner = (row < 3 && col < 3) || (row < 3 && col > 7) || (row > 7 && col < 3);
    const isFilled = isCorner || Math.random() > 0.5;
    return isFilled;
  });

  return (
    <div className="inline-grid grid-cols-11 gap-[2px] p-4 bg-white rounded-xl">
      {cells.map((filled, i) => (
        <div
          key={i}
          className="w-4 h-4 sm:w-5 sm:h-5 rounded-[2px]"
          style={{ background: filled ? '#1a1a2e' : '#f0f0f0' }}
        />
      ))}
    </div>
  );
}

// ─── Animated Checkmark ───────────────────────────────────────────────────────

function AnimatedCheckmark() {
  return (
    <div className="animate-[checkPop_0.6s_ease-out] w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
      <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
    </div>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────

function CountdownTimer({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [onExpire]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="text-center">
      <div className="text-3xl font-bold font-mono text-amber-400">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
      <p className="text-xs text-gray-400 mt-1">Sisa waktu pembayaran</p>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function TopUpApp() {
  const [page, setPage] = useState<Page>('home');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<GamePackage | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [paymentTab, setPaymentTab] = useState<'ewallet' | 'qris' | 'bank' | 'retail'>('ewallet');
  const [userId, setUserId] = useState('');
  const [serverId, setServerId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load order history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('topupku_history');
      if (saved) setOrderHistory(JSON.parse(saved));
    } catch {}
  }, []);

  // Scroll detection
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 10); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Toast helper
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  }, []);

  // Save order history
  const saveHistory = useCallback((orders: Order[]) => {
    setOrderHistory(orders);
    try { localStorage.setItem('topupku_history', JSON.stringify(orders)); } catch {}
  }, []);

  // Navigate to game detail
  const goToGame = useCallback((game: Game) => {
    setSelectedGame(game);
    setSelectedPackage(null);
    setSelectedPayment(null);
    setUserId('');
    setServerId('');
    setZoneId('');
    setPromoCode('');
    setPage('game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Navigate to payment
  const goToPayment = useCallback(() => {
    if (!userId.trim()) { showToast('Masukkan User ID terlebih dahulu!'); return; }
    if (selectedGame?.hasServer && !serverId) { showToast('Pilih server terlebih dahulu!'); return; }
    if (selectedGame?.hasServer && !zoneId) { showToast('Pilih zona terlebih dahulu!'); return; }
    if (!selectedPackage) { showToast('Pilih paket terlebih dahulu!'); return; }
    setPage('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [userId, serverId, zoneId, selectedPackage, selectedGame, showToast]);

  // Process payment
  const processPayment = useCallback(() => {
    if (!selectedPayment) { showToast('Pilih metode pembayaran!'); return; }
    if (!selectedGame || !selectedPackage) return;

    const fee = selectedPayment.fee;
    const total = selectedPackage.price + fee;

    const order: Order = {
      id: genOrderId(),
      gameId: selectedGame.id,
      gameName: selectedGame.name,
      gameEmoji: selectedGame.emoji,
      packageName: selectedPackage.label,
      userId: userId.trim(),
      server: selectedGame.hasServer ? serverId : undefined,
      zone: selectedGame.hasServer ? zoneId : undefined,
      paymentMethod: selectedPayment.name,
      total,
      status: 'processing',
      createdAt: new Date().toISOString(),
    };

    setCurrentOrder(order);
    setPage('processing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedPayment, selectedGame, selectedPackage, userId, serverId, zoneId, showToast]);

  // Confirm payment
  const confirmPayment = useCallback(() => {
    if (!currentOrder) return;
    const updated: Order = { ...currentOrder, status: 'success' };
    setCurrentOrder(updated);
    const newHistory = [updated, ...orderHistory];
    saveHistory(newHistory);
    setPage('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentOrder, orderHistory, saveHistory]);

  // Go home
  const goHome = useCallback(() => {
    setPage('home');
    setSelectedGame(null);
    setSelectedPackage(null);
    setSelectedPayment(null);
    setCurrentOrder(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Go to history
  const goHistory = useCallback(() => {
    setPage('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter games
  const filteredGames = GAMES.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'Semua' || g.category === selectedCategory;
    return matchSearch && matchCat;
  });

  // Filter payment methods by tab
  const filteredPayments = PAYMENT_METHODS.filter((p) => p.group === paymentTab);

  // Calculate total
  const totalPrice = (selectedPackage?.price || 0) + (selectedPayment?.fee || 0);

  // Generate virtual account number
  const vaNumber = currentOrder ? `${currentOrder.id.replace('TU-', '')}${Date.now().toString().slice(-6)}` : '';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0f0f13 0%, #1a1a2e 100%)' }}>
      {/* ─── CSS Animations ──────────────────────────────────────── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; }
        ::selection { background: #f59e0b; color: #000; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f0f13; }
        ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 4px; }
      `}</style>

      {/* ─── Header ──────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: scrolled ? 'rgba(15,15,19,0.8)' : 'rgba(15,15,19,0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(245,158,11,0.15)' : '1px solid rgba(255,255,255,0.05)',
          transition: 'all 0.3s ease',
        }}
      >
        <button
          onClick={page === 'home' ? undefined : goHome}
          className="flex items-center gap-2 cursor-default"
        >
          {page !== 'home' && page !== 'history' && (
            <button onClick={goHome} className="p-1 cursor-pointer hover:text-amber-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-lg font-black text-black">
              T
            </div>
            <span className="text-lg font-bold text-white">
              Top<span className="text-amber-400">Up</span>Ku
            </span>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={goHome}
            className={`p-2 rounded-lg transition-all ${page === 'home' ? 'text-amber-400 bg-amber-400/10' : 'text-gray-400 hover:text-amber-400'}`}
          >
            <Home className="w-5 h-5" />
          </button>
          <button
            onClick={goHistory}
            className={`p-2 rounded-lg transition-all ${page === 'history' ? 'text-amber-400 bg-amber-400/10' : 'text-gray-400 hover:text-amber-400'}`}
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ─── Main Content ────────────────────────────────────────── */}
      <main className="pt-16 pb-8 min-h-screen">

        {/* ═══ HOME PAGE ═══════════════════════════════════════════ */}
        {page === 'home' && (
          <PageTransition>
            <div className="max-w-5xl mx-auto px-4">
              {/* Hero Banner */}
              <div
                className="mt-4 rounded-2xl p-6 sm:p-8 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
                }}
              >
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                  backgroundSize: '40px 40px, 60px 60px',
                }} />
                <div className="relative z-10">
                  <h1 className="text-2xl sm:text-3xl font-black text-black leading-tight">
                    Top Up Game<br />Tercepat & Terpercaya
                  </h1>
                  <p className="text-sm sm:text-base text-black/70 mt-2 max-w-md">
                    Proses instan, harga termurah, dan layanan 24 jam. Top up game favoritmu sekarang!
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/20 text-xs font-semibold text-black">
                      <Zap className="w-3 h-3" /> Proses Instan
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/20 text-xs font-semibold text-black">
                      <Shield className="w-3 h-3" /> Aman 100%
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/20 text-xs font-semibold text-black">
                      <Star className="w-3 h-3" /> Termurah
                    </span>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-5 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari game..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                  style={{ background: '#1e1e2e', borderColor: 'rgba(255,255,255,0.1)' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-black'
                        : 'bg-[#1e1e2e] text-gray-400 border border-white/10 hover:border-amber-500/30 hover:text-amber-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Game Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredGames.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => goToGame(game)}
                    className="rounded-xl overflow-hidden border border-white/10 hover:border-amber-500/40 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer text-left group"
                    style={{ background: '#1e1e2e' }}
                  >
                    <div className={`h-20 sm:h-24 bg-gradient-to-br ${game.gradient} flex items-center justify-center text-3xl sm:text-4xl relative`}>
                      <span className="drop-shadow-lg">{game.emoji}</span>
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                          {game.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                        {game.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">Mulai {formatPrice(game.packages[0].price)}</p>
                    </div>
                  </button>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-16">
                  <Gamepad2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Game tidak ditemukan</p>
                </div>
              )}

              {/* Promo Banner */}
              <div
                className="mt-6 rounded-xl p-4 border border-amber-500/20 flex items-center gap-3 cursor-pointer hover:border-amber-500/40 transition-colors"
                style={{ background: 'rgba(245,158,11,0.05)' }}
                onClick={() => showToast('Promo aktif: TOPUP10 untuk diskon 10%!')}
              >
                <Gift className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-400">Promo Spesial!</p>
                  <p className="text-xs text-gray-400">Gunakan kode TOPUP10 untuk diskon 10%</p>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400/50 ml-auto shrink-0" />
              </div>
            </div>
          </PageTransition>
        )}

        {/* ═══ GAME DETAIL PAGE ═══════════════════════════════════ */}
        {page === 'game' && selectedGame && (
          <PageTransition>
            <div className="max-w-3xl mx-auto px-4">
              {/* Game Header */}
              <div className={`mt-4 rounded-2xl p-6 bg-gradient-to-br ${selectedGame.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }} />
                <div className="relative z-10 flex items-center gap-4">
                  <span className="text-5xl drop-shadow-lg">{selectedGame.emoji}</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">{selectedGame.name}</h2>
                    <p className="text-sm text-white/70 mt-1">{selectedGame.desc}</p>
                  </div>
                </div>
              </div>

              {/* User ID Form */}
              <div className="mt-5 rounded-xl p-5 border border-white/10" style={{ background: '#1e1e2e' }}>
                <h3 className="text-sm font-bold text-white mb-3">Masukkan Data Akun</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">User ID</label>
                    <input
                      type="text"
                      placeholder="Masukkan User ID"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                      style={{ background: '#14141f', borderColor: 'rgba(255,255,255,0.1)' }}
                    />
                  </div>
                  {selectedGame.hasServer && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Server</label>
                        <select
                          value={serverId}
                          onChange={(e) => setServerId(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
                          style={{ background: '#14141f', borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                          <option value="" className="bg-[#14141f]">Pilih Server</option>
                          {selectedGame.servers?.map((s) => (
                            <option key={s} value={s} className="bg-[#14141f]">{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Zona</label>
                        <select
                          value={zoneId}
                          onChange={(e) => setZoneId(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
                          style={{ background: '#14141f', borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                          <option value="" className="bg-[#14141f]">Pilih Zona</option>
                          {selectedGame.zones?.map((z) => (
                            <option key={z} value={z} className="bg-[#14141f]">{z}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)' }}>
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-400/80">Pastikan User ID dan Server/Zona sudah benar sebelum melakukan pembayaran</p>
                  </div>
                </div>
              </div>

              {/* Package Grid */}
              <div className="mt-5 rounded-xl p-5 border border-white/10" style={{ background: '#1e1e2e' }}>
                <h3 className="text-sm font-bold text-white mb-3">Pilih Paket</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedGame.packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative p-4 rounded-xl border text-center cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        selectedPackage?.id === pkg.id
                          ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                          : 'border-white/10 bg-[#14141f] hover:border-white/20'
                      }`}
                    >
                      {pkg.badge && (
                        <span className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pkg.badge === 'Populer' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                          {pkg.badge}
                        </span>
                      )}
                      <div className="text-lg font-bold text-white">{pkg.label}</div>
                      <div className="text-sm font-semibold text-amber-400 mt-1">{formatPrice(pkg.price)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={goToPayment}
                disabled={!selectedPackage}
                className={`mt-5 w-full py-4 rounded-xl font-bold text-base transition-all duration-200 cursor-pointer ${
                  selectedPackage
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Beli Sekarang
              </button>
            </div>
          </PageTransition>
        )}

        {/* ═══ PAYMENT PAGE ═══════════════════════════════════════ */}
        {page === 'payment' && selectedGame && selectedPackage && (
          <PageTransition>
            <div className="max-w-3xl mx-auto px-4">
              {/* Order Summary */}
              <div className="mt-4 rounded-xl p-5 border border-white/10" style={{ background: '#1e1e2e' }}>
                <h3 className="text-sm font-bold text-white mb-4">Ringkasan Pesanan</h3>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#14141f' }}>
                  <span className="text-3xl">{selectedGame.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{selectedGame.name}</p>
                    <p className="text-xs text-gray-400">{selectedPackage.label}</p>
                  </div>
                  <p className="text-sm font-bold text-amber-400">{formatPrice(selectedPackage.price)}</p>
                </div>
                <div className="mt-3 space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>User ID</span>
                    <span className="text-white">{userId}</span>
                  </div>
                  {selectedGame.hasServer && serverId && (
                    <div className="flex justify-between">
                      <span>Server</span>
                      <span className="text-white">{serverId}</span>
                    </div>
                  )}
                  {selectedGame.hasServer && zoneId && (
                    <div className="flex justify-between">
                      <span>Zona</span>
                      <span className="text-white">{zoneId}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-300">Harga</span>
                  <span className="text-sm font-bold text-white">{formatPrice(selectedPackage.price)}</span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="mt-5 rounded-xl border border-white/10 overflow-hidden" style={{ background: '#1e1e2e' }}>
                <div className="flex border-b border-white/10">
                  {([
                    { key: 'ewallet' as const, label: 'E-Wallet', icon: <Wallet className="w-4 h-4" /> },
                    { key: 'qris' as const, label: 'QRIS', icon: <QrCode className="w-4 h-4" /> },
                    { key: 'bank' as const, label: 'Bank', icon: <Building2 className="w-4 h-4" /> },
                    { key: 'retail' as const, label: 'Retail', icon: <Store className="w-4 h-4" /> },
                  ]).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => { setPaymentTab(tab.key); setSelectedPayment(null); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-all cursor-pointer ${
                        paymentTab === tab.key
                          ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Payment Methods List */}
                <div className="p-3 space-y-2">
                  {filteredPayments.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setSelectedPayment(pm)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedPayment?.id === pm.id
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-white/5 bg-[#14141f] hover:border-white/10'
                      }`}
                    >
                      <span className="text-2xl">{pm.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-white">{pm.name}</p>
                        {pm.fee > 0 && (
                          <p className="text-xs text-gray-500">Biaya: {formatPrice(pm.fee)}</p>
                        )}
                        {pm.fee === 0 && (
                          <p className="text-xs text-green-400">Tanpa biaya</p>
                        )}
                      </div>
                      {selectedPayment?.id === pm.id && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Input */}
              <div className="mt-4 rounded-xl p-4 border border-white/10" style={{ background: '#1e1e2e' }}>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-white">Kode Promo</span>
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan kode promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-2.5 rounded-lg border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                    style={{ background: '#14141f', borderColor: 'rgba(255,255,255,0.1)' }}
                  />
                  <button
                    onClick={() => {
                      if (promoCode === 'TOPUP10') showToast('Kode promo berhasil diterapkan!');
                      else if (promoCode) showToast('Kode promo tidak valid');
                    }}
                    className="px-4 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-semibold border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
                  >
                    Pakai
                  </button>
                </div>
              </div>

              {/* Total & Pay Button */}
              <div className="mt-5 rounded-xl p-5 border border-white/10" style={{ background: '#1e1e2e' }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Harga paket</span>
                  <span className="text-sm text-white">{formatPrice(selectedPackage.price)}</span>
                </div>
                {selectedPayment && selectedPayment.fee > 0 && (
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-400">Biaya {selectedPayment.name}</span>
                    <span className="text-sm text-white">{formatPrice(selectedPayment.fee)}</span>
                  </div>
                )}
                {promoCode === 'TOPUP10' && (
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-green-400">Diskon 10%</span>
                    <span className="text-sm text-green-400">-{formatPrice(Math.round(selectedPackage.price * 0.1))}</span>
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-base font-bold text-white">Total Bayar</span>
                  <span className="text-lg font-black text-amber-400">
                    {formatPrice(promoCode === 'TOPUP10' ? totalPrice - Math.round(selectedPackage.price * 0.1) : totalPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={processPayment}
                disabled={!selectedPayment}
                className={`mt-5 w-full py-4 rounded-xl font-bold text-base transition-all duration-200 cursor-pointer ${
                  selectedPayment
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Bayar Sekarang
              </button>
            </div>
          </PageTransition>
        )}

        {/* ═══ PROCESSING PAGE ═══════════════════════════════════ */}
        {page === 'processing' && currentOrder && (
          <PageTransition>
            <div className="max-w-3xl mx-auto px-4">
              <div className="mt-4 rounded-xl p-6 border border-white/10 text-center" style={{ background: '#1e1e2e' }}>
                <h2 className="text-lg font-bold text-white mb-2">Selesaikan Pembayaran</h2>
                <p className="text-sm text-gray-400 mb-5">
                  Metode: <span className="text-amber-400 font-semibold">{currentOrder.paymentMethod}</span>
                </p>

                {/* Countdown */}
                <CountdownTimer
                  seconds={900}
                  onExpire={() => showToast('Waktu pembayaran habis!')}
                />

                {/* Payment Details based on method */}
                <div className="mt-6">
                  {currentOrder.paymentMethod === 'QRIS' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-400">Scan QR code di bawah untuk membayar</p>
                      <div className="flex justify-center">
                        <QRPlaceholder />
                      </div>
                    </div>
                  ) : currentOrder.paymentMethod === 'BCA' || currentOrder.paymentMethod === 'BNI' || currentOrder.paymentMethod === 'BRI' || currentOrder.paymentMethod === 'Mandiri' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-400">Transfer ke Virtual Account berikut</p>
                      <div className="p-4 rounded-lg bg-[#14141f] border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Virtual Account {currentOrder.paymentMethod}</p>
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-xl font-mono font-bold text-amber-400 tracking-wider">
                            {vaNumber.slice(0, 4)} {vaNumber.slice(4, 8)} {vaNumber.slice(8, 12)} {vaNumber.slice(12)}
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(vaNumber).catch(() => {});
                              showToast('Nomor VA disalin!');
                            }}
                            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : currentOrder.paymentMethod === 'Alfamart' || currentOrder.paymentMethod === 'Indomaret' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-400">Bayar di kasir {currentOrder.paymentMethod} dengan kode berikut</p>
                      <div className="p-4 rounded-lg bg-[#14141f] border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Kode Pembayaran</p>
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-xl font-mono font-bold text-amber-400 tracking-wider">
                            {currentOrder.id.replace('TU-', '')}
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(currentOrder.id.replace('TU-', '')).catch(() => {});
                              showToast('Kode pembayaran disalin!');
                            }}
                            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* E-Wallet */
                    <div className="space-y-4">
                      <p className="text-sm text-gray-400">Pembayaran via {currentOrder.paymentMethod}</p>
                      <div className="p-4 rounded-lg bg-[#14141f] border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Total Pembayaran</p>
                        <p className="text-2xl font-black text-amber-400">{formatPrice(currentOrder.total)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="mt-6 p-4 rounded-lg text-left space-y-2" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)' }}>
                  <h4 className="text-xs font-bold text-amber-400">Petunjuk Pembayaran:</h4>
                  <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                    <li>Buka aplikasi {currentOrder.paymentMethod}</li>
                    <li>Pilih bayar / scan / transfer sesuai metode</li>
                    <li>Masukkan nominal yang tertera</li>
                    <li>Selesaikan pembayaran</li>
                    <li>Klik &quot;Saya Sudah Bayar&quot; di bawah</li>
                  </ol>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={confirmPayment}
                className="mt-5 w-full py-4 rounded-xl font-bold text-base bg-gradient-to-r from-amber-500 to-orange-600 text-black hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                Saya Sudah Bayar
              </button>
            </div>
          </PageTransition>
        )}

        {/* ═══ SUCCESS PAGE ═══════════════════════════════════════ */}
        {page === 'success' && currentOrder && (
          <PageTransition>
            <div className="max-w-3xl mx-auto px-4">
              <div className="mt-8 rounded-xl p-8 border border-white/10 text-center" style={{ background: '#1e1e2e' }}>
                <AnimatedCheckmark />
                <h2 className="text-xl font-black text-white mt-6">Pembayaran Berhasil!</h2>
                <p className="text-sm text-gray-400 mt-2">Top up akan diproses dalam beberapa menit</p>

                {/* Order Details */}
                <div className="mt-6 p-4 rounded-lg bg-[#14141f] border border-white/10 text-left space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Order ID</span>
                    <span className="text-xs font-mono text-white">{currentOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Game</span>
                    <span className="text-xs text-white">{currentOrder.gameEmoji} {currentOrder.gameName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Paket</span>
                    <span className="text-xs text-white">{currentOrder.packageName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">User ID</span>
                    <span className="text-xs text-white">{currentOrder.userId}</span>
                  </div>
                  {currentOrder.server && (
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Server</span>
                      <span className="text-xs text-white">{currentOrder.server}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Pembayaran</span>
                    <span className="text-xs text-white">{currentOrder.paymentMethod}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between">
                    <span className="text-sm font-bold text-gray-300">Total</span>
                    <span className="text-sm font-bold text-amber-400">{formatPrice(currentOrder.total)}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-[pulse_2s_ease-in-out_infinite]" />
                  <span className="text-xs font-semibold text-green-400">Sedang Diproses</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-3">
                <button
                  onClick={goHome}
                  className="w-full py-4 rounded-xl font-bold text-base bg-gradient-to-r from-amber-500 to-orange-600 text-black hover:shadow-lg hover:shadow-amber-500/30 transition-all cursor-pointer"
                >
                  Top Up Lagi
                </button>
                <button
                  onClick={goHistory}
                  className="w-full py-3 rounded-xl font-semibold text-sm border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                  style={{ background: '#1e1e2e' }}
                >
                  Lihat Riwayat
                </button>
              </div>
            </div>
          </PageTransition>
        )}

        {/* ═══ HISTORY PAGE ═══════════════════════════════════════ */}
        {page === 'history' && (
          <PageTransition>
            <div className="max-w-3xl mx-auto px-4">
              <div className="mt-4 flex items-center gap-3">
                <History className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-black text-white">Riwayat Pesanan</h2>
              </div>

              {orderHistory.length === 0 ? (
                <div className="mt-8 text-center py-16">
                  <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Belum ada pesanan</p>
                  <button
                    onClick={goHome}
                    className="mt-4 px-6 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-semibold border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
                  >
                    Mulai Top Up
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
                  {orderHistory.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl border border-white/10 hover:border-white/15 transition-colors"
                      style={{ background: '#1e1e2e' }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{order.gameEmoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-white truncate">{order.gameName}</p>
                            <span className={`shrink-0 ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              order.status === 'processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {order.status === 'success' ? 'Berhasil' : order.status === 'processing' ? 'Proses' : 'Gagal'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{order.packageName} • {order.userId}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500 font-mono">{order.id}</p>
                            <p className="text-sm font-bold text-amber-400">{formatPrice(order.total)}</p>
                          </div>
                          <p className="text-[10px] text-gray-600 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PageTransition>
        )}

      </main>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-6 px-4 mt-8" style={{ background: 'rgba(15,15,19,0.8)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-xs font-black text-black">
              T
            </div>
            <span className="text-sm font-bold text-white">
              Top<span className="text-amber-400">Up</span>Ku
            </span>
          </div>
          <p className="text-xs text-gray-600">
            © 2024 TopUpKu. Semua hak cipta dilindungi.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Pembayaran Aman
            </span>
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Proses Cepat
            </span>
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Layanan 24 Jam
            </span>
          </div>
        </div>
      </footer>

      {/* ─── Toast ───────────────────────────────────────────────── */}
      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}
