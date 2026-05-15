"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Flame,
  Settings,
  ShieldCheck,
  PlayCircle,
  FileText,
  ArrowLeft,
  Download,
  FileArchive,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";

// ─── Discord Icon (Real App Icon) ──────────────────────────────────────────

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

type PageName =
  | "home"
  | "download"
  | "panel"
  | "verif"
  | "discord"
  | "tutorial"
  | "changelog";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  swayAmp: number;
  swaySpeed: number;
  swayOffset: number;
  alpha: number;
  type: number;
  color: string;
}

// ─── Particle Canvas ─────────────────────────────────────────────────────────

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 25 : 55;

    function createParticle(init: boolean): Particle {
      return {
        x: Math.random() * w,
        y: init ? Math.random() * h : -20,
        size: Math.random() * 5 + 2,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: Math.random() * 0.4 - 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        swayAmp: Math.random() * 0.8 + 0.3,
        swaySpeed: Math.random() * 0.015 + 0.005,
        swayOffset: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.25 + 0.05,
        type: Math.floor(Math.random() * 3),
        color:
          Math.random() < 0.5
            ? "37,99,235"
            : Math.random() < 0.8
              ? "96,165,250"
              : "34,211,238",
      };
    }

    const leaves: Particle[] = [];
    for (let i = 0; i < count; i++) leaves.push(createParticle(true));
    particlesRef.current = leaves;

    function drawParticle(p: Particle, t: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;

      if (p.type === 0) {
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
        ctx.fillStyle = `rgba(${p.color},1)`;
        ctx.fill();
      } else if (p.type === 1) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},1)`;
        ctx.fill();
      } else {
        const s = p.size * 0.6;
        ctx.strokeStyle = `rgba(${p.color},1)`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(0, s); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-s * 0.6, -s * 0.6); ctx.lineTo(s * 0.6, s * 0.6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s * 0.6, -s * 0.6); ctx.lineTo(-s * 0.6, s * 0.6); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function loop() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, w, h);
      timeRef.current++;
      const t = timeRef.current;
      for (const p of particlesRef.current) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(t * p.swaySpeed + p.swayOffset) * p.swayAmp * 0.3;
        p.rotation += p.rotSpeed;
        if (p.y > h + 20) Object.assign(p, createParticle(false));
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        drawParticle(p, t);
      }
      animRef.current = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true" />;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[200] font-mono text-xs font-bold px-5 py-2.5 rounded-xl border pointer-events-none will-change-transform ${
        visible
          ? "translate-x-[-50%] translate-y-0 opacity-100"
          : "translate-x-[-50%] translate-y-20 opacity-0"
      }`}
      style={{
        background: "var(--ast-bg3)",
        borderColor: "var(--ast-border2)",
        color: "var(--ast-blue-l)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.55s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      ⬇ {message}
    </div>
  );
}

// ─── Status Bar ──────────────────────────────────────────────────────────────

function StatusBar({ dotColor, label, value, valueColor, live = false }: {
  dotColor: string; label: string; value: string; valueColor: string; live?: boolean;
}) {
  const dotStyles: Record<string, React.CSSProperties> = {
    green: { background: "var(--ast-green)", boxShadow: "0 0 8px rgba(34,197,94,0.5)" },
    blue: { background: "var(--ast-blue)", boxShadow: "0 0 6px rgba(37,99,235,0.4)" },
    cyan: { background: "var(--ast-cyan)", boxShadow: "0 0 6px rgba(34,211,238,0.3)" },
  };
  const valStyles: Record<string, React.CSSProperties> = {
    green: { color: "var(--ast-green)" },
    blue: { color: "var(--ast-blue-l)" },
    cyan: { color: "var(--ast-cyan)" },
  };

  return (
    <div
      className={`flex items-center justify-center gap-2.5 py-3 px-5 rounded-2xl border ${
        live ? "animate-[bar-blink_2s_ease-in-out_infinite]" : ""
      }`}
      style={{
        background: "var(--ast-bar-bg)",
        borderColor: live ? "rgba(34,197,94,0.1)" : "var(--ast-border)",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <span className="w-[7px] h-[7px] rounded-full shrink-0 animate-[dot-blink_1.5s_ease-in-out_infinite]" style={dotStyles[dotColor]} />
      <span className="text-[11px] font-semibold tracking-wider" style={{ color: "var(--ast-gray)" }}>{label}</span>
      <span className="text-[10px]" style={{ color: "var(--ast-gray2)" }}>·</span>
      <span className="font-mono text-xs font-bold tracking-wide" style={valStyles[valueColor]}>{value}</span>
    </div>
  );
}

// ─── App Bar ─────────────────────────────────────────────────────────────────

function AppBar({ icon, text, desc, highlight = false, newBadge = false, onClick }: {
  icon: React.ReactNode; text: string; desc: string; highlight?: boolean; newBadge?: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl border text-left w-full group ${
        highlight ? "bg-[rgba(37,99,235,0.04)] border-[rgba(37,99,235,0.1)]" : ""
      }`}
      style={{
        background: highlight ? undefined : "var(--ast-bar-bg)",
        borderColor: highlight ? undefined : "var(--ast-border)",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <span className="shrink-0 flex items-center justify-center w-[22px] [&_svg]:opacity-80 [&_svg]:text-white group-hover:scale-110" style={{ transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
        {icon}
      </span>
      <span className={`text-xs font-bold tracking-wide ${highlight ? "text-[var(--ast-blue-b)]" : "text-white"}`}>
        {text}
        {newBadge && (
          <span className="font-mono text-[7px] font-bold bg-gradient-to-br from-[#1d4ed8] to-[#2563eb] text-white px-1.5 py-[1px] rounded-[3px] ml-1 tracking-wider shadow-[0_0_8px_rgba(37,99,235,0.2)]">
            NEW
          </span>
        )}
      </span>
      <span className="text-[10px]" style={{ color: "var(--ast-gray2)" }}>·</span>
      <span className="text-[10px] font-medium" style={{ color: "var(--ast-gray)" }}>{desc}</span>
    </button>
  );
}

// ─── Download Button ─────────────────────────────────────────────────────────

function DownloadButton({ theme, icon, text, onClick, style }: {
  theme: "blue" | "cyan" | "green" | "purple" | "amber" | "red";
  icon: React.ReactNode; text: string; onClick: () => void; style?: React.CSSProperties;
}) {
  const gradients: Record<string, React.CSSProperties> = {
    blue: { background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", boxShadow: "0 6px 24px rgba(37,99,235,0.25)" },
    cyan: { background: "linear-gradient(135deg,#0e7490,#22d3ee)", boxShadow: "0 6px 24px rgba(34,211,238,0.2)" },
    green: { background: "linear-gradient(135deg,#15803d,#22c55e)", boxShadow: "0 6px 24px rgba(34,197,94,0.2)" },
    purple: { background: "linear-gradient(135deg,#7c3aed,#a855f7)", boxShadow: "0 6px 24px rgba(168,85,247,0.2)" },
    amber: { background: "linear-gradient(135deg,#92400e,#f59e0b)", boxShadow: "0 6px 24px rgba(245,158,11,0.2)" },
    red: { background: "linear-gradient(135deg,#991b1b,#ef4444)", boxShadow: "0 6px 24px rgba(239,68,68,0.2)" },
  };

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center gap-2.5 w-full py-[18px] rounded-2xl border-none text-white cursor-pointer font-['Plus_Jakarta_Sans'] text-[15px] font-extrabold overflow-hidden will-change-transform group"
      style={{
        ...gradients[theme],
        ...style,
        transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s cubic-bezier(0.16,1,0.3,1)",
        marginBottom: "12px",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
      onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0) scale(0.98)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
    >
      <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent" style={{ transition: "left 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
      {icon}
      {text}
    </button>
  );
}

// ─── Feature Item ────────────────────────────────────────────────────────────

function FeatureItem({ num, theme, title, desc }: {
  num: string; theme: string; title: string; desc: string;
}) {
  const colorMap: Record<string, { bg: string; color: string }> = {
    blue: { bg: "rgba(37,99,235,0.08)", color: "var(--ast-blue-l)" },
    cyan: { bg: "rgba(34,211,238,0.08)", color: "var(--ast-cyan)" },
    green: { bg: "rgba(34,197,94,0.08)", color: "var(--ast-green)" },
    purple: { bg: "rgba(168,85,247,0.08)", color: "var(--ast-purple)" },
    amber: { bg: "rgba(245,158,11,0.08)", color: "var(--ast-amber)" },
    red: { bg: "rgba(239,68,68,0.08)", color: "var(--ast-red)" },
  };
  const c = colorMap[theme] || colorMap.blue;

  return (
    <div className="flex items-start gap-3 py-4 border-b border-[var(--ast-border)] last:border-b-0" style={{ transition: "padding-left 0.3s cubic-bezier(0.16,1,0.3,1)" }}
      onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "4px"; }}
      onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0"; }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold shrink-0" style={{ background: c.bg, color: c.color }}>
        {num}
      </div>
      <div className="text-xs leading-relaxed" style={{ color: "var(--ast-gray)" }}>
        <strong className="text-white font-semibold">{title}</strong> — {desc}
      </div>
    </div>
  );
}

// ─── Reveal ──────────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay + 80);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="will-change-transform"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Page Wrapper ────────────────────────────────────────────────────────────

function PageWrapper({ pageName, currentPage, children }: {
  pageName: PageName; currentPage: PageName; children: React.ReactNode;
}) {
  const active = pageName === currentPage;

  if (!active) return null;

  return (
    <div
      className="max-w-[480px] mx-auto px-4 pb-24"
      style={{
        paddingTop: "80px",
        animation: "pageSlideIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
      }}
    >
      {children}
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function AstuteApp() {
  const [currentPage, setCurrentPage] = useState<PageName>("home");
  const [panelOpen, setPanelOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [downloadCount, setDownloadCount] = useState(14827);
  const [clock, setClock] = useState("00:00:00");
  const [scrolled, setScrolled] = useState(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll detection for glass effect
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Clock
  useEffect(() => {
    function updateClock() {
      const n = new Date();
      setClock(`${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}:${String(n.getSeconds()).padStart(2, "0")}`);
    }
    updateClock();
    const iv = setInterval(updateClock, 1000);
    return () => clearInterval(iv);
  }, []);

  // Download counter
  useEffect(() => {
    let mounted = true;
    function tick() {
      if (!mounted) return;
      const delay = Math.floor(Math.random() * 4500) + 1500;
      setTimeout(() => {
        if (!mounted) return;
        setDownloadCount((c) => c + Math.floor(Math.random() * 4) + 1);
        tick();
      }, delay);
    }
    tick();
    return () => { mounted = false; };
  }, []);

  // Page navigation - smooth
  const goPage = useCallback((name: PageName) => {
    setCurrentPage(name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Toast
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2400);
  }, []);

  const handleDownload = useCallback((name: string) => {
    showToast(`Preparing: ${name}...`);
    setDownloadCount((c) => c + Math.floor(Math.random() * 3) + 1);
  }, [showToast]);

  const togglePanel = useCallback(() => {
    setPanelOpen((p) => !p);
  }, []);

  const formattedCount = downloadCount.toLocaleString("en-US");

  const panelLinks: { name: PageName; icon: React.ReactNode; title: string; desc: string }[] = [
    { name: "download", icon: <Flame className="w-6 h-6" />, title: "ASTUTE OB 53", desc: "Download main APK" },
    { name: "panel", icon: <Settings className="w-6 h-6" />, title: "PANEL ASTUTE", desc: "Control panel & config" },
    { name: "verif", icon: <ShieldCheck className="w-6 h-6" />, title: "VERIF MANUAL", desc: "Bypass verification" },
    { name: "discord", icon: <DiscordIcon className="w-6 h-6" />, title: "DISCORD SERVER", desc: "Community & support" },
    { name: "tutorial", icon: <PlayCircle className="w-6 h-6" />, title: "VIDEO TUTORIAL", desc: "Step by step guide" },
    { name: "changelog", icon: <FileText className="w-6 h-6" />, title: "CHANGELOG", desc: "Update history" },
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden antialiased relative"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "var(--ast-bg)",
        color: "var(--ast-white)",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* ─── CSS Variables & Animations ────────────────────────────── */}
      <style>{`
        :root {
          --ast-bg: #050810;
          --ast-bg2: #0a0f1c;
          --ast-bg3: #0e1428;
          --ast-bg4: #131b30;
          --ast-blue: #2563eb;
          --ast-blue-l: #60a5fa;
          --ast-blue-b: #93c5fd;
          --ast-blue-d: #1d4ed8;
          --ast-cyan: #22d3ee;
          --ast-green: #22c55e;
          --ast-purple: #a855f7;
          --ast-amber: #f59e0b;
          --ast-red: #ef4444;
          --ast-wa: #25D366;
          --ast-white: #e8edf5;
          --ast-gray: #6b7ba8;
          --ast-gray2: #3d4c73;
          --ast-gray3: #151d38;
          --ast-bar-bg: #0a1020;
          --ast-border: rgba(37,99,235,0.06);
          --ast-border2: rgba(37,99,235,0.12);
        }
        @keyframes dot-blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.7); }
        }
        @keyframes bar-blink {
          0%, 100% { background: var(--ast-bar-bg); border-color: var(--ast-border); }
          50% { background: rgba(34,197,94,0.03); border-color: rgba(34,197,94,0.1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes orb-float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(20px); }
        }
        @keyframes pageSlideIn {
          0% { opacity: 0; transform: translateX(40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        html {
          scroll-behavior: smooth;
        }
        body { -webkit-font-smoothing: antialiased; }
        ::selection { background: var(--ast-blue); color: #fff; }
        /* Smooth scrollbar */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: var(--ast-bg); }
        ::-webkit-scrollbar-thumb { background: var(--ast-bg4); border-radius: 2px; }
        /* Sidebar smooth scroll */
        .side-panel-scroll {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        .side-panel-scroll::-webkit-scrollbar { width: 2px; }
        .side-panel-scroll::-webkit-scrollbar-track { background: transparent; }
        .side-panel-scroll::-webkit-scrollbar-thumb { background: rgba(37,99,235,0.1); border-radius: 2px; }
      `}</style>

      {/* ─── Background Effects ──────────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(37,99,235,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.02) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }} />
        <div className="absolute rounded-full" style={{
          width: 500, height: 500,
          background: "radial-gradient(circle,rgba(29,78,216,0.1),transparent 65%)",
          top: "-25%", left: "50%", transform: "translateX(-50%)",
          filter: "blur(140px)", opacity: 0.4,
          animation: "orb-float 28s ease-in-out infinite",
        }} />
        <div className="absolute rounded-full" style={{
          width: 300, height: 300,
          background: "radial-gradient(circle,rgba(34,211,238,0.04),transparent 65%)",
          bottom: "5%", right: "-5%",
          filter: "blur(140px)", opacity: 0.4,
          animation: "orb-float 22s ease-in-out infinite reverse",
        }} />
      </div>

      <ParticleCanvas />

      {/* ═══ TOPBAR — Sticky with Glass Blur (iPhone style) ══════════════════════════ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 relative"
        style={{
          background: scrolled
            ? "rgba(5,8,16,0.65)"
            : "linear-gradient(90deg, rgba(8,18,50,0.92) 0%, rgba(10,16,36,0.85) 40%, rgba(5,8,16,0.72) 100%)",
          backdropFilter: scrolled
            ? "blur(50px) saturate(2.2) brightness(0.85)"
            : "blur(40px) saturate(1.8)",
          WebkitBackdropFilter: scrolled
            ? "blur(50px) saturate(2.2) brightness(0.85)"
            : "blur(40px) saturate(1.8)",
          borderBottom: scrolled
            ? "1px solid rgba(37,99,235,0.08)"
            : "1px solid var(--ast-border)",
          boxShadow: scrolled
            ? "0 1px 0 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)"
            : "none",
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Navy gradient glow on left side */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 0% 50%, rgba(29,78,216,0.18) 0%, rgba(13,36,120,0.1) 30%, transparent 70%)",
          zIndex: 0,
        }} />
        <div className="flex items-center gap-2.5 relative z-[1]">
          <div className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#0c1f4a,#1d4ed8,#2563eb)", boxShadow: "0 2px 16px rgba(37,99,235,0.35), inset 0 1px 0 rgba(96,165,250,0.15)" }}>
            <Flame className="w-[20px] h-[20px] text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "var(--ast-gray)", lineHeight: 1.2 }}>JUJU</span>
            <span className="text-[16px] font-extrabold tracking-wide" style={{
              background: "linear-gradient(135deg, #1e3a5f, #1d4ed8, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              filter: "drop-shadow(0 0 8px rgba(37,99,235,0.4))",
              lineHeight: 1.2,
            }}>SELLER</span>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-[1]">
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 py-[5px] px-3 rounded-full"
            style={{
              background: "rgba(120,130,160,0.1)",
              border: "1px solid rgba(120,130,160,0.1)",
              color: "var(--ast-gray)",
              transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
            title="WhatsApp Saluran"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" style={{ color: "var(--ast-wa)" }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="hidden sm:inline">WA</span>
          </a>
          <button
            onClick={togglePanel}
            className="w-[38px] h-[38px] rounded-[11px] flex flex-col items-center justify-center gap-[4.5px] cursor-pointer"
            style={{
              background: "var(--ast-bg3)", border: "1px solid var(--ast-border)",
              transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
            }}
            aria-label="Toggle menu"
          >
            <span className="block w-[17px] h-[1.5px] rounded-[2px] origin-center"
              style={{
                background: "var(--ast-blue-l)",
                transform: panelOpen ? "translateY(6px) rotate(45deg)" : "none",
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
            <span className="block w-[17px] h-[1.5px] rounded-[2px] origin-center"
              style={{
                background: "var(--ast-blue-l)",
                opacity: panelOpen ? 0 : 1,
                transform: panelOpen ? "scaleX(0)" : "none",
                transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
            <span className="block w-[17px] h-[1.5px] rounded-[2px] origin-center"
              style={{
                background: "var(--ast-blue-l)",
                transform: panelOpen ? "translateY(-6px) rotate(-45deg)" : "none",
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </button>
        </div>
      </header>

      {/* ═══ PANEL OVERLAY — Ultra Smooth ═══════════════════════════ */}
      <div
        className="fixed inset-0 z-[90]"
        style={{
          background: panelOpen ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
          backdropFilter: panelOpen ? "blur(24px)" : "blur(0px)",
          WebkitBackdropFilter: panelOpen ? "blur(24px)" : "blur(0px)",
          visibility: panelOpen ? "visible" : "hidden",
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: panelOpen ? "auto" : "none",
        }}
        onClick={togglePanel}
      />

      {/* ═══ SIDE PANEL — Ultra Smooth ═════════════════════════════ */}
      <nav
        onClick={(e) => e.stopPropagation()}
        className="fixed top-0 right-0 z-[100] w-[78%] max-w-[320px] h-full flex flex-col side-panel-scroll"
        style={{
          background: "rgba(10,15,28,0.65)",
          backdropFilter: "blur(60px) saturate(2.2)",
          WebkitBackdropFilter: "blur(60px) saturate(2.2)",
          borderLeft: "1px solid rgba(37,99,235,0.05)",
          boxShadow: panelOpen ? "-16px 0 60px rgba(0,0,0,0.5)" : "-16px 0 0px rgba(0,0,0,0)",
          transform: panelOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.6s cubic-bezier(0.16,1,0.3,1)",
          willChange: "transform",
          overflowY: "auto",
        }}
      >
        <div className="p-6 pb-5 border-b flex items-center justify-between" style={{ borderColor: "var(--ast-border)" }}>
          <h2 className="text-[17px] font-extrabold">
            <span style={{ color: "var(--ast-blue-l)" }}>ASTUTE</span> Menu
          </h2>
          <button onClick={togglePanel}
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: "var(--ast-bg3)", border: "1px solid var(--ast-border)", color: "var(--ast-gray)",
              transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3 flex-1">
          {panelLinks.map((link, i) => (
            <button
              key={link.name}
              onClick={() => { goPage(link.name); togglePanel(); }}
              className="flex items-center gap-3.5 py-[14px] px-4 rounded-2xl text-white text-left w-full mb-1 cursor-pointer"
              style={{
                transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                transitionDelay: panelOpen ? `${i * 40}ms` : "0ms",
                transform: panelOpen ? "translateX(0)" : "translateX(30px)",
                opacity: panelOpen ? 1 : 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(37,99,235,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <span className="shrink-0 flex items-center justify-center w-7 [&_svg]:text-white [&_svg]:opacity-85">
                {link.icon}
              </span>
              <div>
                <div className="text-sm font-bold">{link.title}</div>
                <div className="text-[11px] mt-[1px]" style={{ color: "var(--ast-gray)" }}>{link.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-5 border-t text-center shrink-0" style={{ borderColor: "var(--ast-border)" }}>
          <div className="font-mono text-[10px] tracking-[0.1em]" style={{ color: "var(--ast-gray2)" }}>
            ASTUTE v53.0 · BUILD 2025
          </div>
          <div className="inline-flex items-center gap-1.5 mt-2.5 px-3.5 py-[5px] rounded-full border font-mono text-[9px] font-bold tracking-[0.1em]"
            style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.12)", color: "var(--ast-green)" }}>
            <span className="w-[5px] h-[5px] rounded-full animate-[dot-blink_1.5s_ease-in-out_infinite]"
              style={{ background: "var(--ast-green)", boxShadow: "0 0 4px var(--ast-green)" }} />
            ALL SYSTEMS ONLINE
          </div>
        </div>
      </nav>

      {/* ═══ PAGE CONTENT ═══════════════════════════════════════════ */}
      <main className="relative z-[2] min-h-screen" style={{ WebkitOverflowScrolling: "touch" }}>

        {/* ═══ HOME PAGE ═══ */}
        <PageWrapper pageName="home" currentPage={currentPage}>
          <Reveal>
            <div className="text-center pt-4">
              <div className="relative inline-block mb-5">
                <div className="w-[92px] h-[92px] rounded-full overflow-hidden relative"
                  style={{ border: "3px solid rgba(37,99,235,0.2)", boxShadow: "0 0 0 3px rgba(37,99,235,0.06),0 0 25px rgba(37,99,235,0.1),0 8px 30px rgba(0,0,0,0.4)" }}>
                  <img src="https://picsum.photos/seed/astute-avatar/184/184" alt="JUJU SELLER" className="w-full h-full object-cover block" />
                </div>
                <div className="absolute rounded-full" style={{
                  inset: -7, border: "2px solid transparent", borderTopColor: "var(--ast-blue)", borderRightColor: "var(--ast-cyan)",
                  animation: "spin 5s linear infinite", filter: "drop-shadow(0 0 3px rgba(37,99,235,0.2))",
                }} />
                <div className="absolute bottom-[2px] right-[2px] w-4 h-4 rounded-full z-[2] animate-[dot-blink_1.5s_ease-in-out_infinite]"
                  style={{ background: "var(--ast-green)", border: "3px solid var(--ast-bg)", boxShadow: "0 0 8px rgba(34,197,94,0.5)" }} />
              </div>
              <h1 className="text-[26px] font-extrabold tracking-tight mb-1">
                JUJU <span style={{
                  background: "linear-gradient(135deg, #1e3a5f, #1d4ed8, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 10px rgba(37,99,235,0.4))",
                }}>SELLER</span>
              </h1>
              <div className="font-mono text-xs font-bold tracking-wider inline-block mb-2" style={{ color: "var(--ast-blue-l)" }}>FFASTUTECH OB 53</div>
              <p className="text-[13px] leading-relaxed max-w-[320px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Cara download, install, dan setup proxy server free terbaru — work 100%
              </p>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <div className="flex flex-col gap-2.5 my-6">
              <StatusBar dotColor="green" label="STATUS" value="ONLINE" valueColor="green" live />
              <StatusBar dotColor="blue" label="BERHASIL DOWNLOAD" value={formattedCount} valueColor="blue" />
              <StatusBar dotColor="cyan" label="SERVER REGION" value="ASIA" valueColor="cyan" />
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="flex items-center gap-1.5 font-mono text-[11px] justify-center mb-7" style={{ color: "var(--ast-gray)" }}>
              <span className="w-1 h-1 rounded-full animate-[dot-blink_2s_ease-in-out_infinite]"
                style={{ background: "var(--ast-blue)", boxShadow: "0 0 5px var(--ast-blue)" }} />
              {clock}
            </div>
          </Reveal>

          <div className="h-px my-6" style={{ background: "linear-gradient(90deg,transparent,var(--ast-gray3),transparent)" }} />

          <Reveal delay={210}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px]">
              <Download className="w-3 h-3" style={{ color: "var(--ast-blue)" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Download</span>
            </div>
          </Reveal>
          <Reveal delay={280}>
            <div className="flex flex-col gap-2.5 mb-6">
              <AppBar icon={<Flame className="w-[18px] h-[18px]" />} text="ASTUTE OB 53" desc="Main APK" highlight newBadge onClick={() => goPage("download")} />
              <AppBar icon={<Settings className="w-[18px] h-[18px]" />} text="PANEL ASTUTE" desc="Control panel" onClick={() => goPage("panel")} />
              <AppBar icon={<ShieldCheck className="w-[18px] h-[18px]" />} text="VERIF MANUAL" desc="Bypass verif" onClick={() => goPage("verif")} />
            </div>
          </Reveal>

          <Reveal delay={350}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px]">
              <DiscordIcon className="w-3 h-3" style={{ color: "var(--ast-blue)" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Community</span>
            </div>
          </Reveal>
          <Reveal delay={420}>
            <div className="flex flex-col gap-2.5">
              <AppBar icon={<DiscordIcon className="w-[18px] h-[18px]" />} text="DISCORD SERVER" desc="Community" onClick={() => goPage("discord")} />
              <AppBar icon={<PlayCircle className="w-[18px] h-[18px]" />} text="VIDEO TUTORIAL" desc="Step by step" onClick={() => goPage("tutorial")} />
            </div>
          </Reveal>

          <div className="h-px my-6" style={{ background: "linear-gradient(90deg,transparent,var(--ast-gray3),transparent)" }} />

          <Reveal delay={490}>
            <div className="rounded-2xl p-5 mb-6 relative overflow-hidden border"
              style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg,var(--ast-blue-d),var(--ast-blue),var(--ast-cyan))", opacity: 0.35 }} />
              <h3 className="text-[13px] font-bold mb-3 flex items-center gap-[7px]" style={{ color: "var(--ast-blue-l)" }}>
                <Info className="w-4 h-4" /> Cara Install &amp; Setup
              </h3>
              <ol className="pl-4 text-xs leading-[2.2] list-decimal" style={{ color: "var(--ast-gray)" }}>
                <li>Download file <strong className="text-white font-semibold">ASTUTE OB 53</strong> di atas</li>
                <li>Install <strong className="text-white font-semibold">Panel ASTUTE</strong> terlebih dahulu</li>
                <li>Buka panel, lakukan <strong className="text-white font-semibold">Verif Manual</strong></li>
                <li>Set proxy sesuai tutorial di <strong className="text-white font-semibold">Discord</strong></li>
                <li>Jalankan game — <strong className="text-white font-semibold">done!</strong></li>
              </ol>
            </div>
          </Reveal>

          <Reveal delay={560}>
            <div className="text-center pt-5">
              <div className="font-mono text-[10px] font-bold tracking-wider mb-2 flex items-center justify-center gap-[5px]" style={{ color: "var(--ast-blue-l)" }}>
                <AlertTriangle className="w-[13px] h-[13px]" style={{ color: "var(--ast-cyan)" }} />
                LIHAT TUTOR SAMPAI SELESAI
              </div>
              <div className="text-[10px]" style={{ color: "var(--ast-gray2)" }}>
                © 2025 <span style={{ color: "var(--ast-blue-l)", fontWeight: 600 }}>ASTUTE</span>
              </div>
            </div>
          </Reveal>
        </PageWrapper>

        {/* ═══ DOWNLOAD PAGE ═══ */}
        <PageWrapper pageName="download" currentPage={currentPage}>
          <Reveal>
            <button onClick={() => goPage("home")} type="button"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-white text-[13px] font-semibold cursor-pointer mb-7 border"
              style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
          </Reveal>
          <Reveal delay={70}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-5 w-[72px] h-[72px]">
                <Flame className="w-[60px] h-[60px] text-white opacity-90" />
              </div>
              <h2 className="text-[22px] font-extrabold mb-1.5">ASTUTE <span style={{ color: "var(--ast-blue-l)" }}>OB 53</span></h2>
              <p className="text-[13px] leading-relaxed max-w-[340px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Private server Free Fire terbaru dengan fitur lengkap dan anti-ban protection
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col gap-2.5 mb-6">
              <StatusBar dotColor="green" label="STATUS SERVER" value="ONLINE" valueColor="green" live />
              <StatusBar dotColor="blue" label="TOTAL DOWNLOAD" value={formattedCount} valueColor="blue" />
              <StatusBar dotColor="cyan" label="FILE SIZE" value="284 MB" valueColor="cyan" />
            </div>
          </Reveal>
          <Reveal delay={210}>
            <DownloadButton theme="blue" icon={<Download className="w-5 h-5" />} text="DOWNLOAD APK v53" onClick={() => handleDownload("ASTUTE OB53 APK")} />
            <DownloadButton theme="blue" icon={<FileArchive className="w-5 h-5" />} text="DOWNLOAD OBB DATA" onClick={() => handleDownload("ASTUTE OB53 OBB")}
              style={{ background: "linear-gradient(135deg,#1e3a5f,#2563eb)", boxShadow: "0 6px 24px rgba(37,99,235,0.2)" }} />
          </Reveal>
          <Reveal delay={280}>
            <div className="mt-6">
              <FeatureItem num="01" theme="blue" title="Auto Update" desc="Otomatis update ke versi terbaru tanpa reinstall" />
              <FeatureItem num="02" theme="blue" title="Anti-Ban System" desc="Proteksi 3 layer agar akun tetap aman" />
              <FeatureItem num="03" theme="blue" title="All Skin Unlocked" desc="Semua skin dan bundle tersedia gratis" />
              <FeatureItem num="04" theme="blue" title="Stable Server" desc="99.9% uptime dengan latency rendah" />
            </div>
          </Reveal>
        </PageWrapper>

        {/* ═══ PANEL PAGE ═══ */}
        <PageWrapper pageName="panel" currentPage={currentPage}>
          <Reveal>
            <button onClick={() => goPage("home")} type="button"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-white text-[13px] font-semibold cursor-pointer mb-7 border"
              style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
          </Reveal>
          <Reveal delay={70}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-5 w-[72px] h-[72px]">
                <Settings className="w-[60px] h-[60px] text-white opacity-90" />
              </div>
              <h2 className="text-[22px] font-extrabold mb-1.5">PANEL <span style={{ color: "var(--ast-cyan)" }}>ASTUTE</span></h2>
              <p className="text-[13px] leading-relaxed max-w-[340px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Control panel untuk konfigurasi server, proxy, dan manage fitur mod
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col gap-2.5 mb-6">
              <StatusBar dotColor="green" label="PANEL STATUS" value="ACTIVE" valueColor="green" live />
              <StatusBar dotColor="blue" label="VERSION" value="v2.4.1" valueColor="blue" />
            </div>
          </Reveal>
          <Reveal delay={210}>
            <DownloadButton theme="cyan" icon={<Download className="w-5 h-5" />} text="DOWNLOAD PANEL v2.4" onClick={() => handleDownload("Panel ASTUTE")} />
          </Reveal>
          <Reveal delay={280}>
            <div className="mt-6">
              <FeatureItem num="01" theme="cyan" title="Proxy Manager" desc="Setup dan ganti proxy dalam 1 klik" />
              <FeatureItem num="02" theme="cyan" title="Config Editor" desc="Edit config server langsung dari app" />
              <FeatureItem num="03" theme="cyan" title="Auto Patch" desc="Patch otomatis saat ada update baru" />
              <FeatureItem num="04" theme="cyan" title="Log Monitor" desc="Pantau log koneksi real-time" />
            </div>
          </Reveal>
        </PageWrapper>

        {/* ═══ VERIF PAGE ═══ */}
        <PageWrapper pageName="verif" currentPage={currentPage}>
          <Reveal>
            <button onClick={() => goPage("home")} type="button"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-white text-[13px] font-semibold cursor-pointer mb-7 border"
              style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
          </Reveal>
          <Reveal delay={70}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-5 w-[72px] h-[72px]">
                <ShieldCheck className="w-[60px] h-[60px] text-white opacity-90" />
              </div>
              <h2 className="text-[22px] font-extrabold mb-1.5">VERIF <span style={{ color: "var(--ast-green)" }}>MANUAL</span></h2>
              <p className="text-[13px] leading-relaxed max-w-[340px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Tool bypass verifikasi untuk mengaktifkan fitur premium tanpa limit
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col gap-2.5 mb-6">
              <StatusBar dotColor="green" label="VERIF STATUS" value="READY" valueColor="green" live />
              <StatusBar dotColor="blue" label="SUCCESS RATE" value="99.2%" valueColor="blue" />
            </div>
          </Reveal>
          <Reveal delay={210}>
            <DownloadButton theme="green" icon={<Download className="w-5 h-5" />} text="DOWNLOAD VERIF TOOL" onClick={() => handleDownload("Verif Manual Tool")} />
          </Reveal>
          <Reveal delay={280}>
            <div className="mt-6">
              <FeatureItem num="01" theme="green" title="One-Click Bypass" desc="Verifikasi otomatis tanpa survey" />
              <FeatureItem num="02" theme="green" title="Device Spoofer" desc="Mask device ID agar tidak terdeteksi" />
              <FeatureItem num="03" theme="green" title="Token Generator" desc="Generate token akses premium" />
              <FeatureItem num="04" theme="green" title="Safe Mode" desc="Mode aman untuk pengguna baru" />
            </div>
          </Reveal>
        </PageWrapper>

        {/* ═══ DISCORD PAGE ═══ */}
        <PageWrapper pageName="discord" currentPage={currentPage}>
          <Reveal>
            <button onClick={() => goPage("home")} type="button"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-white text-[13px] font-semibold cursor-pointer mb-7 border"
              style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
          </Reveal>
          <Reveal delay={70}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-5 w-[72px] h-[72px]">
                <DiscordIcon className="w-[60px] h-[60px] text-white opacity-90" />
              </div>
              <h2 className="text-[22px] font-extrabold mb-1.5">DISCORD <span style={{ color: "var(--ast-purple)" }}>SERVER</span></h2>
              <p className="text-[13px] leading-relaxed max-w-[340px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Join komunitas ASTUTE — dapatkan bantuan, info update, dan diskusi sesama player
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col gap-2.5 mb-6">
              <StatusBar dotColor="green" label="SERVER STATUS" value="ONLINE" valueColor="green" live />
              <StatusBar dotColor="blue" label="MEMBERS" value="1,247" valueColor="blue" />
            </div>
          </Reveal>
          <Reveal delay={210}>
            <DownloadButton theme="purple" icon={<DiscordIcon className="w-5 h-5" />} text="JOIN DISCORD" onClick={() => handleDownload("Discord Invite")} />
          </Reveal>
          <Reveal delay={280}>
            <div className="mt-6">
              <FeatureItem num="01" theme="purple" title="24/7 Support" desc="Tim support siap bantu kapan saja" />
              <FeatureItem num="02" theme="purple" title="Announcements" desc="Info update dan event terbaru" />
              <FeatureItem num="03" theme="purple" title="Giveaway" desc="Giveaway akun dan item secara rutin" />
              <FeatureItem num="04" theme="purple" title="1,200+ Members" desc="Komunitas aktif dan ramah" />
            </div>
          </Reveal>
        </PageWrapper>

        {/* ═══ TUTORIAL PAGE ═══ */}
        <PageWrapper pageName="tutorial" currentPage={currentPage}>
          <Reveal>
            <button onClick={() => goPage("home")} type="button"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-white text-[13px] font-semibold cursor-pointer mb-7 border"
              style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
          </Reveal>
          <Reveal delay={70}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-5 w-[72px] h-[72px]">
                <PlayCircle className="w-[60px] h-[60px] text-white opacity-90" />
              </div>
              <h2 className="text-[22px] font-extrabold mb-1.5">VIDEO <span style={{ color: "var(--ast-amber)" }}>TUTORIAL</span></h2>
              <p className="text-[13px] leading-relaxed max-w-[340px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Panduan lengkap dari install sampai main — ikutin aja step by step
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col gap-2.5 mb-6">
              <StatusBar dotColor="green" label="GUIDE STATUS" value="UPDATED" valueColor="green" live />
              <StatusBar dotColor="blue" label="DURATION" value="12:34" valueColor="blue" />
            </div>
          </Reveal>
          <Reveal delay={210}>
            <DownloadButton theme="amber" icon={<PlayCircle className="w-5 h-5" />} text="TONTON TUTORIAL" onClick={() => handleDownload("Video Tutorial")} />
          </Reveal>
          <Reveal delay={280}>
            <div className="mt-6">
              <FeatureItem num="01" theme="amber" title="Install Guide" desc="Cara install APK + OBB dengan benar" />
              <FeatureItem num="02" theme="amber" title="Proxy Setup" desc="Setting proxy agar server bisa connect" />
              <FeatureItem num="03" theme="amber" title="Verif Steps" desc="Tutorial verifikasi manual yang work" />
              <FeatureItem num="04" theme="amber" title="Troubleshoot" desc="Solusi untuk error yang sering muncul" />
            </div>
          </Reveal>
        </PageWrapper>

        {/* ═══ CHANGELOG PAGE ═══ */}
        <PageWrapper pageName="changelog" currentPage={currentPage}>
          <Reveal>
            <button onClick={() => goPage("home")} type="button"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-white text-[13px] font-semibold cursor-pointer mb-7 border"
              style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
          </Reveal>
          <Reveal delay={70}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-5 w-[72px] h-[72px]">
                <FileText className="w-[60px] h-[60px] text-white opacity-90" />
              </div>
              <h2 className="text-[22px] font-extrabold mb-1.5">CHANGE<span style={{ color: "var(--ast-red)" }}>LOG</span></h2>
              <p className="text-[13px] leading-relaxed max-w-[340px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Riwayat update dan patch notes setiap versi ASTUTE
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col gap-2.5 mb-6">
              <StatusBar dotColor="green" label="CURRENT VERSION" value="v53.0" valueColor="green" live />
              <StatusBar dotColor="blue" label="LAST UPDATED" value="JUN 2025" valueColor="blue" />
            </div>
          </Reveal>
          <Reveal delay={210}>
            <div className="mt-6">
              <FeatureItem num="53" theme="red" title="v53.0 — Current" desc="OB 53 support, new anti-ban, skin pack update" />
              <FeatureItem num="52" theme="red" title="v52.1 — Hotfix" desc="Fix crash on Android 14, proxy stability" />
              <FeatureItem num="52" theme="red" title="v52.0 — Major" desc="OB 52 support, new UI panel, faster load" />
              <FeatureItem num="51" theme="red" title="v51.0 — Release" desc="Initial OB 51, auto-update, verif v2" />
              <FeatureItem num="50" theme="red" title="v50.0 — Legacy" desc="First public release, basic mod features" />
            </div>
          </Reveal>
        </PageWrapper>
      </main>

      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}
