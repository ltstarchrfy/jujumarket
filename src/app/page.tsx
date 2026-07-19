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
  Info,
  ExternalLink,
  Volume2,
  VolumeX,
  Crown,
  MessageCircle,
  Smartphone,
} from "lucide-react";
import { db, isFirebaseEnabled } from "@/lib/firebase";
import { ref as dbRef, onValue, runTransaction, get, set } from "firebase/database";

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
  | "changelog"
  | "vip"
  | "qris";

// ─── WhatsApp Icon ────────────────────────────────────────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// ─── Telegram Icon ────────────────────────────────────────────────────────────

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

// ─── Custom VIP Feature Icons (SVG) ──────────────────────────────────────────

function IconDeviceSecurity({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="3" />
      <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2.5" />
      <path d="M9 8.5L10.5 10L15 5.5" strokeWidth="2" />
      <path d="M3 7L5 6" strokeWidth="1.5" opacity="0.5" />
      <path d="M3 12L5 11.5" strokeWidth="1.5" opacity="0.5" />
      <path d="M19 7L21 6" strokeWidth="1.5" opacity="0.5" />
      <path d="M19 12L21 11.5" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

function IconAccountProfile({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1C4 16.582 7.582 14 12 14s8 2.582 8 6v1" />
      <path d="M16 6L18 4L20 6" strokeWidth="1.5" opacity="0.6" />
      <circle cx="19" cy="4.5" r="1" fill="currentColor" opacity="0.5" stroke="none" />
    </svg>
  );
}

function IconShopItem({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
      <circle cx="17" cy="3" r="1.2" fill="currentColor" stroke="none" opacity="0.5" />
      <path d="M10 2L12 4L14 2" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

function IconCharacterSkin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L14.5 9H22L16 13.5L18 21L12 17L6 21L8 13.5L2 9H9.5L12 2Z" />
      <path d="M12 6L13.2 9.5H17L14 11.8L15.2 15.5L12 13.2L8.8 15.5L10 11.8L7 9.5H10.8L12 6Z" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function IconEmoteInteract({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
      <path d="M17 3L19 1L21 3" strokeWidth="1.3" opacity="0.5" />
      <path d="M3 17L5 19L3 21" strokeWidth="1.3" opacity="0.5" />
    </svg>
  );
}

function IconCombatSpecial({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
      <path d="M13 7L17 3L21 3L21 7L17 11" />
      <path d="M16 13L19 16L21 21L16 19L13 16" />
      <path d="M7.5 10.5L3 15V18H6L10.5 13.5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.3" />
    </svg>
  );
}

function IconVipCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L14.09 8.26L20.18 8.63L15.54 12.54L17.12 18.84L12 15.4L6.88 18.84L8.46 12.54L3.82 8.63L9.91 8.26L12 2Z" strokeWidth="1.2" />
      <path d="M8 12.5L10.5 15L16 9" strokeWidth="2.5" />
    </svg>
  );
}

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

// ─── Download Progress Bar (WhatsApp Style) ──────────────────────────────────

function DownloadBar({ count, max }: { count: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (count / max) * 100) : 100;
  return (
    <div className="rounded-2xl border overflow-hidden" style={{
      background: "var(--ast-bar-bg)",
      borderColor: "var(--ast-border)",
    }}>
      {/* Channel-style header */}
      <div className="flex items-center justify-center gap-3 py-3 px-4" style={{
        borderBottom: "1px solid var(--ast-border)",
        background: "linear-gradient(180deg, rgba(34,197,94,0.04) 0%, transparent 100%)",
      }}>
        <div className="flex items-center gap-2">
          <span className="w-[8px] h-[8px] rounded-full shrink-0 animate-[dot-blink_1.5s_ease-in-out_infinite]" style={{
            background: "var(--ast-green)", boxShadow: "0 0 8px rgba(34,197,94,0.5)",
          }} />
          <span className="text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: "var(--ast-gray)" }}>STATUS</span>
        </div>
        <span className="text-[11px] font-bold" style={{ color: "var(--ast-green)" }}>ONLINE</span>
        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.12)" }}>│</span>
        <div className="flex items-center gap-2">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ast-green)" }}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: "var(--ast-gray)" }}>BERHASIL DOWNLOAD</span>
        </div>
        <span className="font-mono text-[15px] font-bold tracking-wide" style={{
          color: "#ffffff",
          textShadow: "none",
        }}>{count.toLocaleString("en-US")}</span>
      </div>
      {/* Animated progress bar — full width pulse when unlimited */}
      <div className="h-[5px] w-full" style={{ background: "rgba(34,197,94,0.08)" }}>
        {max > 0 ? (
          <div className="h-full" style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
            boxShadow: "0 0 8px rgba(34,197,94,0.4)",
            transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
          }} />
        ) : (
          <div className="h-full" style={{
            width: "100%",
            background: "linear-gradient(90deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd, #60a5fa, #1d4ed8)",
            backgroundSize: "200% 100%",
            animation: "shimmer-bar 2s linear infinite",
          }} />
        )}
      </div>
    </div>
  );
}

// ─── Channel Bar (WhatsApp Channel style) ────────────────────────────────────

function ChannelBar({
  icon,
  title,
  subtitle,
  value,
  valueLabel,
  count,
  max,
  barColor,
  barGradient,
  dotColor,
  accentColor,
  channelUrl,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value?: string;
  valueLabel?: string;
  count?: number;
  max?: number;
  barColor: string;
  barGradient: string;
  dotColor: string;
  accentColor: string;
  channelUrl?: string;
}) {
  const pct = max && count ? Math.min(100, (count / max) * 100) : 0;
  const displayValue = value || (count ? count.toLocaleString("en-US") : "");

  const inner = (
    <>
      {/* WhatsApp channel card body */}
      <div className="flex items-center gap-3.5 py-3.5 px-4">
        {/* Channel profile icon — like WA channel avatar */}
        <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 relative" style={{
          background: barGradient,
          boxShadow: `0 3px 12px ${barColor}50`,
        }}>
          {icon}
          {/* Online indicator dot — like WA profile online dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[2.5px]" style={{
            background: barColor,
            borderColor: "var(--ast-bar-bg)",
            boxShadow: `0 0 6px ${barColor}88`,
          }} />
        </div>

        {/* Channel info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold tracking-wide" style={{ color: "var(--ast-white)" }}>{title}</span>
            {/* Verified badge — like WA channel checkmark */}
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill={accentColor}>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          <div className="flex items-center gap-1.5 mt-[2px]">
            <span className="w-[5px] h-[5px] rounded-full shrink-0 animate-[dot-blink_1.5s_ease-in-out_infinite]" style={{
              background: dotColor,
              boxShadow: `0 0 4px ${barColor}66`,
            }} />
            <span className="text-[10px] font-medium" style={{ color: "var(--ast-gray)" }}>{subtitle}</span>
          </div>
        </div>

        {/* Value / Counter — like WA channel follower count */}
        <div className="flex flex-col items-end shrink-0">
          <span className="font-mono text-[18px] font-bold tracking-wide leading-none" style={{
            color: "#ffffff",
            textShadow: "none",
          }}>{displayValue}</span>
          {valueLabel && (
            <span className="text-[8px] font-semibold tracking-[0.1em] uppercase mt-[2px]" style={{ color: accentColor }}>{valueLabel}</span>
          )}
        </div>
      </div>

      {/* Progress bar — like WA channel activity bar */}
      {(max && count) && (
        <div className="h-[3px] w-full" style={{ background: `${barColor}18` }}>
          <div className="h-full" style={{
            width: `${pct}%`,
            background: barGradient,
            boxShadow: `0 0 6px ${barColor}55`,
            transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
          }} />
        </div>
      )}
    </>
  );

  const wrapperStyle: React.CSSProperties = {
    background: "var(--ast-bar-bg)",
    borderColor: "var(--ast-border)",
    textDecoration: "none",
    transition: "border-color 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1)",
  };

  const hoverIn = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = `${barColor}30`;
    e.currentTarget.style.boxShadow = `0 4px 20px ${barColor}15`;
  };
  const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = "var(--ast-border)";
    e.currentTarget.style.boxShadow = "none";
  };

  if (channelUrl) {
    return (
      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl border overflow-hidden cursor-pointer"
        style={wrapperStyle}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={wrapperStyle}
      onMouseEnter={hoverIn}
      onMouseLeave={hoverOut}
    >
      {inner}
    </div>
  );
}

// ─── Status Bar ──────────────────────────────────────────────────────────────

function StatusBar({ dotColor, label, value, valueColor, valueGradient = false, live = false, bigDot = false }: {
  dotColor: string; label: string; value: string; valueColor: string; valueGradient?: boolean; live?: boolean; bigDot?: boolean;
}) {
  const dotStyles: Record<string, React.CSSProperties> = {
    green: { background: "var(--ast-green)", boxShadow: "0 0 8px rgba(34,197,94,0.5)" },
    blue: { background: "var(--ast-blue)", boxShadow: "0 0 8px rgba(37,99,235,0.45)" },
    cyan: { background: "var(--ast-cyan)", boxShadow: "0 0 8px rgba(34,211,238,0.35)" },
    amber: { background: "var(--ast-amber)", boxShadow: "0 0 8px rgba(245,158,11,0.5)" },
  };
  const valStyles: Record<string, React.CSSProperties> = {
    green: { color: "var(--ast-green)" },
    blue: { color: "var(--ast-blue-l)" },
    cyan: { color: "var(--ast-cyan)" },
    amber: { color: "var(--ast-amber)" },
  };

  const gradientStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    filter: "drop-shadow(0 0 6px rgba(37,99,235,0.3))",
  };

  return (
    <div
      className="flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl border"
      style={{
        background: "var(--ast-bar-bg)",
        borderColor: live ? "rgba(34,197,94,0.1)" : "var(--ast-border)",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <span className={`${bigDot ? "w-[10px] h-[10px]" : "w-[8px] h-[8px]"} rounded-full shrink-0 animate-[dot-blink_1.5s_ease-in-out_infinite]`} style={dotStyles[dotColor]} />
      <span className="text-[12px] font-semibold tracking-wider" style={{ color: "var(--ast-gray)" }}>{label}</span>
      <span className="text-[11px]" style={{ color: "var(--ast-gray2)" }}>·</span>
      <span className="font-mono text-[13px] font-bold tracking-wide" style={valueGradient ? gradientStyle : valStyles[valueColor]}>{value}</span>
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
      className={`flex items-center gap-3 py-4 px-6 rounded-2xl border w-full group ${
        highlight ? "bg-[rgba(37,99,235,0.04)] border-[rgba(37,99,235,0.1)]" : ""
      }`}
      style={{
        background: highlight ? undefined : "var(--ast-bar-bg)",
        borderColor: highlight ? undefined : "var(--ast-border)",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <span className="shrink-0 flex items-center justify-center w-[24px] [&_svg]:opacity-80 [&_svg]:text-white group-hover:scale-110" style={{ transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
        {icon}
      </span>
      <span className={`text-[13px] font-bold tracking-wide ${highlight ? "text-[var(--ast-blue-b)]" : ""}`}
        style={highlight ? undefined : { color: "var(--ast-gray)" }}>
        {text}
        {newBadge && (
          <span className="font-mono text-[7px] font-bold bg-gradient-to-br from-[#1d4ed8] to-[#2563eb] text-white px-1.5 py-[1px] rounded-[3px] ml-1 tracking-wider shadow-[0_0_8px_rgba(37,99,235,0.2)]">
            NEW
          </span>
        )}
      </span>
      <span className="flex-1" />
      <span className="text-[11px] font-medium" style={{ color: "var(--ast-gray)" }}>{desc}</span>
    </button>
  );
}

// ─── Link Box ────────────────────────────────────────────────────────────────

function LinkBox({ title, url, desc, icon, onLinkClick }: {
  title: string; url: string; desc: string; icon: React.ReactNode; onLinkClick?: () => void;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onLinkClick}
      className="flex items-center gap-4 py-4 px-5 rounded-2xl border group cursor-pointer"
      style={{
        background: "var(--ast-bg2)",
        borderColor: "var(--ast-border)",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        textDecoration: "none",
        marginBottom: "10px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(37,99,235,0.15)";
        e.currentTarget.style.background = "rgba(37,99,235,0.03)";
        e.currentTarget.style.transform = "translateX(3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--ast-border)";
        e.currentTarget.style.background = "var(--ast-bg2)";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      <div className="w-[40px] h-[40px] rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
          boxShadow: "0 2px 12px rgba(37,99,235,0.25)",
          transition: "box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold tracking-wide" style={{ color: "var(--ast-white)" }}>{title}</div>
        <div className="text-[11px] mt-[2px] truncate" style={{ color: "var(--ast-gray)" }}>{desc}</div>
      </div>
      <ExternalLink className="w-4 h-4 shrink-0 opacity-40 group-hover:opacity-80" style={{ color: "var(--ast-blue-l)", transition: "opacity 0.3s" }} />
    </a>
  );
}

// ─── Download Button ─────────────────────────────────────────────────────────

function DownloadButton({ theme, icon, text, onClick, style }: {
  theme: "blue" | "cyan" | "green" | "purple" | "amber" | "red" | "seller";
  icon: React.ReactNode; text: string; onClick: () => void; style?: React.CSSProperties;
}) {
  const gradients: Record<string, React.CSSProperties> = {
    blue: { background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", boxShadow: "0 6px 24px rgba(37,99,235,0.25)" },
    cyan: { background: "linear-gradient(135deg,#0e7490,#22d3ee)", boxShadow: "0 6px 24px rgba(34,211,238,0.2)" },
    green: { background: "linear-gradient(135deg,#15803d,#22c55e)", boxShadow: "0 6px 24px rgba(34,197,94,0.2)" },
    purple: { background: "linear-gradient(135deg,#7c3aed,#a855f7)", boxShadow: "0 6px 24px rgba(168,85,247,0.2)" },
    amber: { background: "linear-gradient(135deg,#92400e,#f59e0b)", boxShadow: "0 6px 24px rgba(245,158,11,0.2)" },
    red: { background: "linear-gradient(135deg,#991b1b,#ef4444)", boxShadow: "0 6px 24px rgba(239,68,68,0.2)" },
    seller: { background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)", boxShadow: "0 6px 24px rgba(37,99,235,0.45)" },
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

function FeatureItem({ num, theme, title, desc, dark }: {
  num: string; theme: string; title: string; desc: string; dark?: boolean;
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
      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold shrink-0" style={{ background: dark ? "rgba(107,123,168,0.06)" : c.bg, color: dark ? "#4a5568" : c.color, fontSize: num.length > 2 ? "13px" : undefined }}>
        {num}
      </div>
      <div className="text-xs leading-relaxed" style={{ color: dark ? "#6b7280" : "var(--ast-gray)" }}>
        <strong className={dark ? "" : "text-white"} style={dark ? { color: "#6b7280", fontWeight: 600 } : { fontWeight: 600 }}>{title}</strong>{dark ? " — " : " — "}{desc}
      </div>
    </div>
  );
}

// ─── VIP Feature Box (like Cara Install & Setup style) ───────────────────────

function VipFeatureBox({ theme = "blue" }: { theme?: string }) {
  const accentColor = theme === "amber" ? "var(--ast-amber)" : "var(--ast-blue-l)";
  const gradientLine = theme === "amber"
    ? "linear-gradient(90deg, #92400e, #f59e0b, #fbbf24)"
    : "linear-gradient(90deg, var(--ast-blue-d), var(--ast-blue), var(--ast-cyan))";

  const categories = [
    { icon: <IconDeviceSecurity className="w-4 h-4" />, title: "Perangkat & Keamanan",
      features: ["Bisa digunakan di Android maupun iPhone", "Proteksi anti-ban yang kuat dan aman"] },
    { icon: <IconAccountProfile className="w-4 h-4" />, title: "Akun & Profil",
      features: ["Bisa klaim mail seperti akun asli", "Setting nama karakter", "Setting region sesuai kebutuhan", "Badge terlihat di lobby", "Prime level 8 bisa diubah sesuai keinginan", "Setting pertemanan"] },
    { icon: <IconShopItem className="w-4 h-4" />, title: "Shop & Item",
      features: ["Nambahin item di shop & dibeli", "Kebebasan mengatur shop sesuai selera", "Setting vault ghoib"] },
    { icon: <IconCharacterSkin className="w-4 h-4" />, title: "Karakter & Skin",
      features: ["Semua karakter terbuka dan bisa digunakan", "Main skin terbawa semua (tidak bisa damage)", "Skill karakter kebawa di ingame (tidak untuk di room)"] },
    { icon: <IconEmoteInteract className="w-4 h-4" />, title: "Emote & Interaksi",
      features: ["Emote tembus ke akun original", "Emote berubah dan tembus ke akun original", "Terlihat sesama pengguna ASTUTE", "Bisa melakukan spin wheel"] },
    { icon: <IconCombatSpecial className="w-4 h-4" />, title: "Combat & Spesial",
      features: ["Glowall & terlihat di lu & sesama FF ASTUTE", "Damage & ga kerasa seperti skin aslinya (no skin)", "Skills pet kebawa di ingame"] },
  ];

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden border" style={{
      background: "var(--ast-bg2)",
      borderColor: "var(--ast-border)",
    }}>
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: gradientLine, opacity: 0.35 }} />
      <div className="flex flex-col gap-4">
        {categories.map((cat, i) => (
          <div key={i}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{
                background: theme === "amber"
                  ? "linear-gradient(135deg, #92400e, #f59e0b, #fbbf24)"
                  : "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                boxShadow: `0 2px 8px ${theme === "amber" ? "rgba(245,158,11,0.25)" : "rgba(37,99,235,0.25)"}`,
              }}>
                {cat.icon}
              </div>
              <span className="text-[13px] font-bold" style={{ color: accentColor }}>{cat.title}</span>
            </div>
            <div className="flex flex-col gap-1 pl-9">
              {cat.features.map((feat, fi) => (
                <div key={fi} className="flex items-start gap-2">
                  <IconVipCheck className="w-3 h-3 mt-[3px] shrink-0" style={{ color: accentColor }} />
                  <span className="text-[12px] leading-snug" style={{ color: "var(--ast-gray)" }}>{feat}</span>
                </div>
              ))}
            </div>
            {i < categories.length - 1 && (
              <div className="mt-4 h-px" style={{ background: "var(--ast-border)", opacity: 0.5 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Swipeable Feature Carousel (Box + Sound on swipe, Smooth) ──────────────

function FeatureCarousel({ items, theme = "blue" }: {
  items: { num: React.ReactNode; title: string; desc: string; features?: string[] }[];
  theme?: string;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastIdxRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  // Color theme
  const themeStyles: Record<string, {
    boxGradient: string;
    boxShadow: string;
    chipGradient: string;
    chipShadow: string;
    accent: string;
    indicatorActive: string;
    labelColor: string;
  }> = {
    blue: {
      boxGradient: "linear-gradient(135deg, rgba(37,99,235,0.10) 0%, rgba(37,99,235,0.02) 60%, var(--ast-bg2) 100%)",
      boxShadow: "0 4px 24px rgba(37,99,235,0.12), 0 1px 3px rgba(0,0,0,0.3)",
      chipGradient: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
      chipShadow: "0 2px 10px rgba(37,99,235,0.30)",
      accent: "var(--ast-blue-l)",
      indicatorActive: "var(--ast-blue-l)",
      labelColor: "var(--ast-blue-l)",
    },
    amber: {
      boxGradient: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.02) 60%, var(--ast-bg2) 100%)",
      boxShadow: "0 4px 24px rgba(245,158,11,0.14), 0 1px 3px rgba(0,0,0,0.3)",
      chipGradient: "linear-gradient(135deg, #92400e, #f59e0b, #fbbf24)",
      chipShadow: "0 2px 10px rgba(245,158,11,0.32)",
      accent: "var(--ast-amber)",
      indicatorActive: "var(--ast-amber)",
      labelColor: "var(--ast-amber)",
    },
  };
  const ts = themeStyles[theme] || themeStyles.blue;

  // Play swipe sound
  const playSwipeSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        const a = new Audio("/flip.mp3");
        a.volume = 0.3;
        a.preload = "auto";
        audioRef.current = a;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {}
  }, []);

  // Compute current visible index based on scroll position
  const computeIdx = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    const firstChild = el.firstElementChild as HTMLElement | null;
    if (!firstChild) return 0;
    const step = firstChild.offsetWidth + 12;
    const idx = Math.round(el.scrollLeft / step);
    return Math.max(0, Math.min(items.length - 1, idx));
  }, [items.length]);

  // Throttled scroll handler using rAF
  const handleScroll = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const idx = computeIdx();
      if (idx !== lastIdxRef.current) {
        lastIdxRef.current = idx;
        setActiveIdx(idx);
        playSwipeSound();
      }
    });
  }, [computeIdx, playSwipeSound]);

  // Smooth scroll to a specific box index
  const scrollToIdx = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstChild = el.firstElementChild as HTMLElement | null;
    if (!firstChild) return;
    const step = firstChild.offsetWidth + 12;
    const target = Math.max(0, Math.min(items.length - 1, idx));
    const targetLeft = target * step;
    el.scrollTo({ left: targetLeft, behavior: "smooth" });
    if (lastIdxRef.current !== target) {
      lastIdxRef.current = target;
      setActiveIdx(target);
      playSwipeSound();
    }
  }, [items.length, playSwipeSound]);

  const scrollByBox = useCallback((dir: 1 | -1) => {
    scrollToIdx(lastIdxRef.current + dir);
  }, [scrollToIdx]);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Arrows (desktop) */}
      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollByBox(-1)}
        className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full items-center justify-center cursor-pointer border"
        style={{
          background: "var(--ast-bg2)",
          borderColor: "var(--ast-border)",
          color: "var(--ast-gray)",
        }}
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollByBox(1)}
        className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full items-center justify-center cursor-pointer border"
        style={{
          background: "var(--ast-bg2)",
          borderColor: "var(--ast-border)",
          color: "var(--ast-gray)",
        }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="feature-carousel-scroll flex gap-3 overflow-x-auto pb-3 -mx-1 px-1"
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          willChange: "scroll-position",
          transform: "translateZ(0)",
          scrollPaddingLeft: "4px",
          scrollPaddingRight: "4px",
        } as React.CSSProperties}
      >
        {items.map((it, i) => (
          <div
            key={i}
            className="shrink-0 snap-start"
            style={{
              flexBasis: it.features ? "90%" : "82%",
              maxWidth: it.features ? "90%" : "82%",
              transform: "translateZ(0)",
              willChange: "transform",
            }}
          >
            {/* Feature box */}
            <div
              className="rounded-2xl p-5 border relative overflow-hidden"
              style={{
                background: ts.boxGradient,
                borderColor: "var(--ast-border)",
                boxShadow: ts.boxShadow,
                transition: "border-color 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)",
                minHeight: it.features ? "200px" : "auto",
              }}
            >
              {/* Top row: gradient chip + label */}
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-[14px] font-bold shrink-0"
                  style={{
                    background: ts.chipGradient,
                    boxShadow: ts.chipShadow,
                    color: "#fff",
                  }}
                >
                  {typeof it.num === "string" ? it.num : it.num}
                </div>
                <div className="flex flex-col">
                  <div className="font-mono text-[8px] tracking-[0.18em] uppercase font-bold" style={{ color: ts.labelColor }}>
                    {it.features ? "KATEGORI" : "FEATURE"} {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-[15px] font-extrabold leading-tight" style={{ color: "var(--ast-white)" }}>
                    {it.title}
                  </div>
                </div>
              </div>

              {/* Grouped feature list or single desc */}
              {it.features ? (
                <div className="flex flex-col gap-1.5 mt-1">
                  {it.features.map((feat, fi) => (
                    <div key={fi} className="flex items-start gap-2">
                      <IconVipCheck className="w-3.5 h-3.5 mt-[1px] shrink-0" style={{ color: ts.accent }} />
                      <span className="text-[12px] leading-snug" style={{ color: "var(--ast-gray)" }}>{feat}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="text-[14.5px] font-extrabold mb-1.5 leading-tight" style={{ color: "var(--ast-white)" }}>
                    {it.title}
                  </div>
                  <div className="text-[11.5px] leading-relaxed" style={{ color: "var(--ast-gray)" }}>
                    {it.desc}
                  </div>
                </>
              )}

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-80 pointer-events-none"
                style={{ background: `linear-gradient(90deg, transparent, ${ts.accent}, transparent)` }}
              />
              {/* Decorative corner accent */}
              <div
                className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-25 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${ts.accent}, transparent 70%)` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Page indicator dots + hint */}
      <div className="flex flex-col items-center gap-2 mt-2.5">
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to feature ${i + 1}`}
              onClick={() => scrollToIdx(i)}
              className="rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: i === activeIdx ? 16 : 5,
                height: 5,
                background: i === activeIdx ? ts.indicatorActive : "rgba(255,255,255,0.15)",
                border: "none",
                padding: 0,
              }}
            />
          ))}
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ast-gray2)" }}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="font-mono text-[9px] tracking-[0.16em] uppercase font-bold" style={{ color: "var(--ast-gray2)" }}>
            Geser untuk lihat semua
          </span>
        </div>
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
  const isHome = pageName === "home";

  if (!active) return null;

  return (
    <div
      className="max-w-[480px] mx-auto px-4 pb-24"
      style={{
        paddingTop: isHome ? "80px" : "20px",
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
  const [downloadCount, setDownloadCount] = useState(2000);
  const [clock, setClock] = useState("00:00:00");
  const [scrolled, setScrolled] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const musicAutoStartedRef = useRef(false);
  const panelSwipeRef = useRef<{ startX: number; currentX: number; swiping: boolean }>({ startX: 0, currentX: 0, swiping: false });
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);

  // ─── Firebase Realtime Download Counter ─────────────────────────────────
  // Shared across ALL devices — never resets on any phone
  const firebaseCountRef = useRef(db ? dbRef(db, "downloadCount") : null);
  
  useEffect(() => {
    if (isFirebaseEnabled && db && firebaseCountRef.current) {
      // Firebase mode: real-time sync across all devices
      get(firebaseCountRef.current).then((snapshot) => {
        if (!snapshot.exists()) {
          set(firebaseCountRef.current!, 2000);
        }
      }).catch(() => {});

      const unsubscribe = onValue(firebaseCountRef.current, (snapshot) => {
        const val = snapshot.val();
        if (typeof val === "number" && val >= 2000) {
          setDownloadCount(val);
        }
      });

      return () => unsubscribe();
    } else {
      // API fallback mode: poll server every 6 seconds
      let intervalId: ReturnType<typeof setInterval>;
      async function fetchCount() {
        try {
          const res = await fetch('/api/count');
          if (res.ok) {
            const data = await res.json();
            if (typeof data.count === 'number' && data.count > 0) {
              setDownloadCount(data.count);
            }
          }
        } catch {}
      }
      fetchCount();
      intervalId = setInterval(fetchCount, 6000);
      return () => clearInterval(intervalId);
    }
  }, []);

  // ─── Click Sound (MP3 file) ────────────────────────────────────────────────
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const playClickSound = useCallback(() => {
    try {
      if (!clickAudioRef.current) {
        clickAudioRef.current = new Audio("/click.mp3");
        clickAudioRef.current.volume = 0.4;
      }
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    } catch {}
  }, []);

  // ─── Background Music (MP3) ─────────────────────────────────────────────────
  const startMusic = useCallback(() => {
    try {
      if (!musicAudioRef.current) {
        const audio = new Audio("/music.mp3");
        audio.volume = 0.35;
        audio.loop = true;
        audio.preload = "auto";
        musicAudioRef.current = audio;
      }
      const audio = musicAudioRef.current;
      audio.play().then(() => {
        setMusicPlaying(true);
      }).catch(() => {
        setMusicPlaying(false);
      });
    } catch {
      setMusicPlaying(false);
    }
  }, []);

  const stopMusic = useCallback(() => {
    try {
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
      }
      setMusicPlaying(false);
    } catch {}
  }, []);

  const toggleMusic = useCallback(() => {
    if (musicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [musicPlaying, startMusic, stopMusic]);

  // Auto-start background music on first user interaction
  useEffect(() => {
    function onFirstInteraction() {
      if (musicAutoStartedRef.current) return;
      musicAutoStartedRef.current = true;
      startMusic();
      ["click", "touchstart", "keydown"].forEach(evt =>
        document.removeEventListener(evt, onFirstInteraction)
      );
    }
    ["click", "touchstart", "keydown"].forEach(evt =>
      document.addEventListener(evt, onFirstInteraction, { once: false })
    );
    return () => {
      ["click", "touchstart", "keydown"].forEach(evt =>
        document.removeEventListener(evt, onFirstInteraction)
      );
    };
  }, [startMusic]);

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

  // Download counter — Firebase handles real-time sync automatically

  // Firebase atomic increment helper (with API fallback)
  const firebaseIncrement = useCallback((add: number) => {
    if (isFirebaseEnabled && db && firebaseCountRef.current) {
      runTransaction(firebaseCountRef.current, (current) => {
        if (current === null) return 2000 + add;
        return (current as number) + add;
      }).catch(() => {});
    } else {
      // API fallback
      fetch('/api/count', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ add }) }).catch(() => {});
      setDownloadCount((c) => c + add);
    }
  }, []);

  // Page navigation - smooth, +1 counter via Firebase when visiting ASTUTE OB54 download page
  const goPage = useCallback((name: PageName) => {
    playClickSound();
    setCurrentPage(name);
    // Auto +1 via Firebase when someone enters the download/ASTUTE OB54 page
    if (name === "download") {
      firebaseIncrement(1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [playClickSound]);

  // Toast
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2400);
  }, []);

  const handleDownload = useCallback((name: string) => {
    showToast(`Preparing: ${name}...`);
    firebaseIncrement(3);
  }, [showToast, firebaseIncrement]);

  const togglePanel = useCallback(() => {
    playClickSound();
    setPanelOpen((p) => !p);
  }, [playClickSound]);

  // Clear inline swipe transform when panel re-opens
  useEffect(() => {
    if (panelOpen) {
      const nav = document.querySelector('[data-panel-nav]') as HTMLElement;
      if (nav) {
        nav.style.transform = "";
        nav.style.transition = "";
      }
    }
  }, [panelOpen]);

  const formattedCount = downloadCount.toLocaleString("en-US");

  // Increment download count via Firebase when any download link is clicked
  const bumpDownload = useCallback(() => {
    firebaseIncrement(1);
  }, [firebaseIncrement]);

  const panelLinks: { name: PageName; icon: React.ReactNode; title: string; desc: string }[] = [
    { name: "download", icon: <Flame className="w-6 h-6" />, title: "ASTUTE OB54", desc: "Download main APK" },
    { name: "panel", icon: <Settings className="w-6 h-6" />, title: "PANEL ASTUTE", desc: "Control panel & config" },
    { name: "verif", icon: <ShieldCheck className="w-6 h-6" />, title: "VERIF MANUAL", desc: "Bypass verification" },
    { name: "discord", icon: <DiscordIcon className="w-6 h-6" />, title: "DISCORD SERVER", desc: "Community & support" },
    { name: "tutorial", icon: <PlayCircle className="w-6 h-6" />, title: "VIDEO TUTORIAL", desc: "Step by step guide" },
    { name: "changelog", icon: <FileText className="w-6 h-6" />, title: "FITUR VIP ACCESS", desc: "VIP features list" },
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
        @keyframes profile-float {
          0%, 100% { transform: scale(1) translateY(0); }
          25% { transform: scale(1.12) translateY(-6px); }
          50% { transform: scale(0.92) translateY(4px); }
          75% { transform: scale(1.08) translateY(-3px); }
        }
        @keyframes profile-glow {
          0%, 100% { box-shadow: 0 8px 30px rgba(0,0,0,0.4), 0 0 0 0 rgba(37,99,235,0); }
          50% { box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 25px rgba(37,99,235,0.4), 0 0 50px rgba(37,99,235,0.15); }
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes music-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(37,99,235,0); }
        }
        @keyframes shimmer-bar {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        * {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overscroll-behavior: none;
        }
        ::selection { background: var(--ast-blue); color: #fff; }
        /* Smooth scrollbar */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: var(--ast-bg); }
        ::-webkit-scrollbar-thumb { background: var(--ast-bg4); border-radius: 2px; }
        /* Sidebar smooth scroll */
        .side-panel-scroll {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          overscroll-behavior: contain;
        }
        .side-panel-scroll::-webkit-scrollbar { width: 2px; }
        .side-panel-scroll::-webkit-scrollbar-track { background: transparent; }
        .side-panel-scroll::-webkit-scrollbar-thumb { background: rgba(37,99,235,0.1); border-radius: 2px; }
      `}</style>

      {/* ─── Background Effects ──────────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(37,99,235,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.05) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }} />
        <div className="absolute rounded-full" style={{
          width: 500, height: 500,
          background: "radial-gradient(circle,rgba(29,78,216,0.18),transparent 65%)",
          top: "-25%", left: "50%", transform: "translateX(-50%)",
          filter: "blur(140px)", opacity: 0.4,
          animation: "orb-float 28s ease-in-out infinite",
        }} />
        <div className="absolute rounded-full" style={{
          width: 300, height: 300,
          background: "radial-gradient(circle,rgba(34,211,238,0.08),transparent 65%)",
          bottom: "5%", right: "-5%",
          filter: "blur(140px)", opacity: 0.4,
          animation: "orb-float 22s ease-in-out infinite reverse",
        }} />
      </div>

      <ParticleCanvas />

      {/* ═══ TOPBAR — Fixed Header (only on home page) ══════════════════════════ */}
      {currentPage === "home" && <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(10,14,28,0.92)",
          backdropFilter: "blur(40px) saturate(1.8)",
          WebkitBackdropFilter: "blur(40px) saturate(1.8)",
          borderBottom: "1px solid var(--ast-border)",
          boxShadow: "none",
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="flex items-center gap-2.5 relative z-[1]">
          <div className="w-[38px] h-[38px] rounded-[11px] overflow-hidden"
            style={{ border: "2px solid rgba(37,99,235,0.15)", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
            <img src="/avatar.jpg" alt="JUJU SELLER" className="w-full h-full object-cover block" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "var(--ast-gray)", lineHeight: 1.2 }}>JUJU</span>
            <span className="text-[16px] font-extrabold tracking-wide" style={{
              background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              filter: "drop-shadow(0 0 12px rgba(37,99,235,0.6))",
              lineHeight: 1.2,
            }}>SELLER</span>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-[1]">
          <a href="https://whatsapp.com/channel/0029VbBxPsuDeONChEGz5D1Q" target="_blank" rel="noopener noreferrer"
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
            <span>CHANNEL</span>
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
                background: "#9ca3af",
                transform: panelOpen ? "translateY(6px) rotate(45deg)" : "none",
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), background 0.35s",
              }}
            />
            <span className="block w-[17px] h-[1.5px] rounded-[2px] origin-center"
              style={{
                background: "#9ca3af",
                opacity: panelOpen ? 0 : 1,
                transform: panelOpen ? "scaleX(0)" : "none",
                transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
            <span className="block w-[17px] h-[1.5px] rounded-[2px] origin-center"
              style={{
                background: "#9ca3af",
                transform: panelOpen ? "translateY(-6px) rotate(-45deg)" : "none",
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), background 0.35s",
              }}
            />
          </button>
        </div>
      </header>}

      {/* ═══ PANEL OVERLAY — Ultra Smooth (only on home page) ═══════════════════════════ */}
      {currentPage === "home" && <div
        className="fixed inset-0 z-[90]"
        style={{
          background: panelOpen ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
          backdropFilter: panelOpen ? "blur(28px)" : "blur(0px)",
          WebkitBackdropFilter: panelOpen ? "blur(28px)" : "blur(0px)",
          visibility: panelOpen ? "visible" : "hidden",
          transition: "background 0.5s cubic-bezier(0.32,0.72,0,1), backdrop-filter 0.5s cubic-bezier(0.32,0.72,0,1), -webkit-backdrop-filter 0.5s cubic-bezier(0.32,0.72,0,1), visibility 0s linear " + (panelOpen ? "0s" : "0.5s"),
          pointerEvents: panelOpen ? "auto" : "none",
        }}
        onClick={togglePanel}
      />}

      {/* ═══ SIDE PANEL — Ultra Smooth + Swipe/Drag to Close (only on home page) ═════════════════════════════ */}
      {currentPage === "home" && <nav
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          if (!panelOpen) return;
          panelSwipeRef.current = { startX: e.touches[0].clientX, currentX: e.touches[0].clientX, swiping: true };
        }}
        onTouchMove={(e) => {
          if (!panelSwipeRef.current.swiping) return;
          panelSwipeRef.current.currentX = e.touches[0].clientX;
          const diff = panelSwipeRef.current.currentX - panelSwipeRef.current.startX;
          if (diff > 0) {
            e.preventDefault();
            const nav = e.currentTarget;
            nav.style.transition = "none";
            nav.style.transform = `translateX(${diff}px)`;
          }
        }}
        onTouchEnd={() => {
          if (!panelSwipeRef.current.swiping) return;
          panelSwipeRef.current.swiping = false;
          const diff = panelSwipeRef.current.currentX - panelSwipeRef.current.startX;
          const nav = document.querySelector('[data-panel-nav]') as HTMLElement;
          if (nav) nav.style.transition = "";
          if (diff > 80) {
            setPanelOpen(false);
          } else {
            if (nav) nav.style.transform = "";
          }
        }}
        onMouseDown={(e) => {
          if (!panelOpen) return;
          panelSwipeRef.current = { startX: e.clientX, currentX: e.clientX, swiping: true };
        }}
        onMouseMove={(e) => {
          if (!panelSwipeRef.current.swiping) return;
          panelSwipeRef.current.currentX = e.clientX;
          const diff = panelSwipeRef.current.currentX - panelSwipeRef.current.startX;
          if (diff > 0) {
            const nav = e.currentTarget;
            nav.style.transition = "none";
            nav.style.transform = `translateX(${diff}px)`;
          }
        }}
        onMouseUp={() => {
          if (!panelSwipeRef.current.swiping) return;
          panelSwipeRef.current.swiping = false;
          const diff = panelSwipeRef.current.currentX - panelSwipeRef.current.startX;
          const nav = document.querySelector('[data-panel-nav]') as HTMLElement;
          if (nav) nav.style.transition = "";
          if (diff > 80) {
            setPanelOpen(false);
          } else {
            if (nav) nav.style.transform = "";
          }
        }}
        onMouseLeave={() => {
          if (!panelSwipeRef.current.swiping) return;
          panelSwipeRef.current.swiping = false;
          const nav = document.querySelector('[data-panel-nav]') as HTMLElement;
          if (nav) { nav.style.transition = ""; nav.style.transform = ""; }
        }}
        data-panel-nav
        className="fixed top-0 right-0 z-[100] w-[78%] max-w-[320px] h-full flex flex-col side-panel-scroll"
        style={{
          background: "rgba(10,15,28,0.65)",
          backdropFilter: "blur(60px) saturate(2.2)",
          WebkitBackdropFilter: "blur(60px) saturate(2.2)",
          borderLeft: "1px solid rgba(37,99,235,0.05)",
          boxShadow: panelOpen ? "-16px 0 60px rgba(0,0,0,0.5)" : "-16px 0 0px rgba(0,0,0,0)",
          transform: panelOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.5s cubic-bezier(0.32,0.72,0,1), box-shadow 0.5s cubic-bezier(0.32,0.72,0,1), opacity 0.5s cubic-bezier(0.32,0.72,0,1)",
          willChange: "transform, opacity",
          overflowY: "auto",
          touchAction: "pan-y",
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
                transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
                transitionDelay: panelOpen ? `${i * 55}ms` : "0ms",
                transform: panelOpen ? "translateX(0)" : "translateX(30px)",
                opacity: panelOpen ? 1 : 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(37,99,235,0.05)"; e.currentTarget.style.paddingLeft = "6px"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.paddingLeft = "4px"; }}
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
            JUJU v54.0 · BUILD 2026
          </div>
          <div className="inline-flex items-center gap-1.5 mt-2.5 px-3.5 py-[5px] rounded-full border font-mono text-[9px] font-bold tracking-[0.1em]"
            style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.12)", color: "var(--ast-green)" }}>
            <span className="w-[5px] h-[5px] rounded-full animate-[dot-blink_1.5s_ease-in-out_infinite]"
              style={{ background: "var(--ast-green)", boxShadow: "0 0 4px var(--ast-green)" }} />
            ALL SYSTEMS ONLINE
          </div>
        </div>
      </nav>}

      {/* ═══ PAGE CONTENT ═══════════════════════════════════════════ */}
      <main className="relative z-[2] min-h-screen" style={{ WebkitOverflowScrolling: "touch" }}>

        {/* ═══ HOME PAGE ═══ */}
        <PageWrapper pageName="home" currentPage={currentPage}>
          <Reveal>
            <div className="text-center pt-4">
              <div className="relative inline-block mb-5">
                <div className="w-[92px] h-[92px] rounded-[20px] overflow-hidden relative"
                  style={{
                    border: "3px solid rgba(37,99,235,0.2)",
                    animation: "3.5s ease-in-out infinite profile-float",
                  }}>
                  <img src="/avatar.jpg" alt="JUJU SELLER" className="w-full h-full object-cover block" />
                </div>
              </div>
              <h1 className="text-[26px] font-extrabold tracking-tight mb-1">
                <span style={{
                  background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 14px rgba(37,99,235,0.6))",
                }}>JUJU SELLER</span>
              </h1>
              <div className="font-mono text-xs font-bold tracking-wider inline-block mb-2" style={{
                background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 12px rgba(37,99,235,0.5))",
              }}>ASTUTE OB54</div>
              <p className="text-[13px] leading-relaxed max-w-[320px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Cara download, install, dan setup proxy server free terbaru — work 100%
              </p>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <div className="flex flex-col items-center gap-[14px] my-7">
              {/* STATUS ONLINE pill bar — matches jujumarketv2 exactly */}
              <div className="flex items-center gap-2.5 py-[10px] px-[16px] mx-auto" style={{
                background: "rgba(30,36,50,0.65)",
                border: "1px solid rgba(55,65,90,0.25)",
                borderRadius: "22px",
                width: "76%",
                maxWidth: "295px",
                transition: "0.3s cubic-bezier(0.16,1,0.3,1)",
                minHeight: "40px",
              }}>
                <span className="w-[7px] h-[7px] rounded-full shrink-0 animate-[dot-blink_2s_ease-in-out_infinite]" style={{ background: "rgb(34,197,94)" }} />
                <span className="text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: "rgb(122,133,153)" }}>Status</span>
                <span className="flex-1" />
                <span className="font-mono text-[11.5px] font-bold tracking-wide" style={{ color: "rgb(34,197,94)" }}>ONLINE</span>
              </div>

              {/* BERHASIL DOWNLOAD pill bar */}
              <div className="flex items-center gap-2.5 py-[10px] px-[16px] mx-auto" style={{
                background: "rgba(30,36,50,0.65)",
                border: "1px solid rgba(55,65,90,0.25)",
                borderRadius: "22px",
                width: "76%",
                maxWidth: "295px",
                transition: "0.3s cubic-bezier(0.16,1,0.3,1)",
                minHeight: "40px",
              }}>
                <span className="w-[7px] h-[7px] rounded-full shrink-0 animate-[dot-blink_2s_ease-in-out_infinite]" style={{ background: "rgb(96,165,250)" }} />
                <span className="text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: "rgb(122,133,153)" }}>Berhasil Download</span>
                <span className="flex-1" />
                <span className="font-mono text-[11.5px] font-bold tracking-wide" style={{
                  background: "linear-gradient(135deg, rgb(30,58,95), rgb(29,78,216), rgb(96,165,250))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>{downloadCount.toLocaleString("en-US")}</span>
              </div>

              {/* SERVER REGION pill bar */}
              <div className="flex items-center gap-2.5 py-[10px] px-[16px] mx-auto" style={{
                background: "rgba(30,36,50,0.65)",
                border: "1px solid rgba(55,65,90,0.25)",
                borderRadius: "22px",
                width: "76%",
                maxWidth: "295px",
                transition: "0.3s cubic-bezier(0.16,1,0.3,1)",
                minHeight: "40px",
              }}>
                <span className="w-[7px] h-[7px] rounded-full shrink-0 animate-[dot-blink_2s_ease-in-out_infinite]" style={{ background: "rgb(34,211,238)" }} />
                <span className="text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: "rgb(122,133,153)" }}>Server Region</span>
                <span className="flex-1" />
                <span className="font-mono text-[11.5px] font-bold tracking-wide" style={{
                  background: "linear-gradient(135deg, rgb(30,58,95), rgb(29,78,216), rgb(96,165,250))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>INDONESIA</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="flex items-center gap-1.5 font-mono text-[11px] justify-center mb-4" style={{ color: "var(--ast-gray)" }}>
              <span className="w-1 h-1 rounded-full animate-[dot-blink_2s_ease-in-out_infinite]"
                style={{ background: "var(--ast-blue)", boxShadow: "0 0 5px var(--ast-blue)" }} />
              {clock}
            </div>
          </Reveal>

          <div className="h-px my-5" style={{ background: "linear-gradient(90deg,transparent,var(--ast-gray3),transparent)" }} />

          <Reveal delay={210}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Download className="w-3 h-3" style={{ color: "var(--ast-blue)" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase text-center" style={{ color: "var(--ast-gray)" }}>Download</span>
            </div>
            <div className="flex flex-col gap-3.5 mb-5">
              <AppBar icon={<Flame className="w-[18px] h-[18px]" />} text="ASTUTE OB54" desc="Main APK" newBadge onClick={() => { bumpDownload(); goPage("download"); }} />
              <AppBar icon={<Settings className="w-[18px] h-[18px]" />} text="PANEL ASTUTE" desc="Control panel" onClick={() => goPage("panel")} />
              <AppBar icon={<ShieldCheck className="w-[18px] h-[18px]" />} text="VERIF MANUAL" desc="Bypass verif" onClick={() => goPage("verif")} />
            </div>
          </Reveal>

          <Reveal delay={350}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <DiscordIcon className="w-3 h-3" style={{ color: "var(--ast-blue)" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase text-center" style={{ color: "var(--ast-gray)" }}>Community</span>
            </div>
            <div className="flex flex-col gap-3.5">
              <AppBar icon={<DiscordIcon className="w-[18px] h-[18px]" />} text="DISCORD SERVER" desc="Community" onClick={() => goPage("discord")} />
              <AppBar icon={<PlayCircle className="w-[18px] h-[18px]" />} text="VIDEO TUTORIAL" desc="Step by step" onClick={() => goPage("tutorial")} />
              <AppBar icon={<FileText className="w-[18px] h-[18px]" />} text="CHANGELOG" desc="VIP features" onClick={() => goPage("changelog")} />
            </div>
          </Reveal>

          {/* ─── VIP Purchase Box ─── */}
          <Reveal delay={400}>
            <div className="mt-6 relative overflow-hidden rounded-2xl border cursor-pointer active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, rgba(30,58,95,0.25), rgba(29,78,216,0.1))",
                borderColor: "rgba(37,99,235,0.2)",
                transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
              }}
              onClick={() => goPage("vip")}>
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)" }} />
              
              <div className="p-5 relative z-[1]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #0c2d5a, #1d4ed8)", boxShadow: "0 4px 16px rgba(37,99,235,0.3)" }}>
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-extrabold" style={{
                      background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 6px rgba(37,99,235,0.5))",
                    }}>UPGRADE TO VIP</div>
                    <div className="text-[10px]" style={{ color: "var(--ast-gray)" }}>Buka semua fitur premium sekarang</div>
                  </div>
                  <div className="px-2 py-1 rounded-full text-[8px] font-bold tracking-wider" style={{ background: "linear-gradient(135deg, #1d4ed8, #60a5fa)", color: "#fff" }}>NEW</div>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {["All Skin", "Anti-Ban", "Glowall", "Shop Edit", "24/7 Support"].map(f => (
                    <span key={f} className="px-2 py-[2px] rounded-full text-[8px] font-semibold" style={{ background: "rgba(96,165,250,0.08)", color: "#60a5fa", border: "1px solid rgba(37,99,235,0.15)" }}>{f}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] line-through" style={{ color: "var(--ast-gray)" }}>500K</span>
                    <span className="text-[18px] font-black" style={{
                      background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 6px rgba(37,99,235,0.4))",
                    }}>300K</span>
                    <span className="text-[9px] font-bold font-mono" style={{ color: "var(--ast-gray)" }}>IDR</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold" style={{
                    background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    Mulai <Crown className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="h-px my-5" style={{ background: "linear-gradient(90deg,transparent,var(--ast-gray3),transparent)" }} />

          <Reveal delay={350}>
            <div className="mb-6">
              <div className="relative overflow-hidden rounded-2xl border select-none" style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)", touchAction: "pan-y" }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: "linear-gradient(90deg,var(--ast-blue-d),var(--ast-blue),var(--ast-cyan))", opacity: 0.35, zIndex: 10 }} />
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <div className="p-5">
                    <h3 className="text-[13px] font-bold mb-3 flex items-center gap-[7px]" style={{ color: "var(--ast-blue-l)" }}>
                      <Info className="w-4 h-4" /> Cara Setup ASTUTE Method Terbaru
                    </h3>
                    <div className="overflow-y-auto pl-1 pr-1" style={{ maxHeight: "180px", scrollBehavior: "smooth", scrollbarWidth: "thin", scrollbarColor: "rgba(37,99,235,0.15) transparent" }}>
                      <ol className="pl-4 text-xs leading-[2.4] list-decimal" style={{ color: "var(--ast-gray)" }}>
                        <li>Download file yang berada di <strong className="text-white font-semibold">ASTUTE OB54</strong> di atas</li>
                        <li>Yang perlu kalian download itu <strong className="text-white font-semibold">FF 64 bit atau 32 bit</strong> yang mana kalian enak pake itu</li>
                        <li>Download <strong className="text-white font-semibold">JSON ASTUTE</strong> juga lalu kalian tempel di files FF nya</li>
                        <li>Verify akun kalian dengan link di atas yang bertulisan <strong className="text-white font-semibold">Verif Manual</strong></li>
                        <li>Login <span style={{ background: "linear-gradient(135deg, rgb(21,128,61), rgb(34,197,94), rgb(74,222,128))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>donee!!</span></li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={420}>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full py-2 px-4 overflow-hidden inline-flex items-center"
                style={{
                  background: "rgba(120,130,160,0.1)",
                  border: "1px solid rgba(120,130,160,0.1)",
                  minWidth: "200px",
                }}>
                <div className="whitespace-nowrap inline-flex items-center" style={{
                  animation: "marquee-scroll 8s linear infinite",
                  willChange: "transform",
                }}>
                  <span className="font-['Plus_Jakarta_Sans'] text-[12px] font-extrabold tracking-wide" style={{ color: "#ffffff", paddingRight: "40px" }}>
                    SETUP NYA MUDAH KALO KALIAN NONTON TUTORIALNYA SAMPE HABIS🔥
                  </span>
                  <span className="font-['Plus_Jakarta_Sans'] text-[12px] font-extrabold tracking-wide" style={{ color: "#ffffff", paddingRight: "40px" }}>
                    SETUP NYA MUDAH KALO KALIAN NONTON TUTORIALNYA SAMPE HABIS🔥
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center pt-2">
              <div className="text-[10px]" style={{ color: "var(--ast-gray2)" }}>
                © 2026 <span style={{
                  background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 700,
                  filter: "drop-shadow(0 0 4px rgba(37,99,235,0.4))",
                }}>JUJU.MY.ID</span>
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
              <h2 className="text-[22px] font-extrabold mb-1.5" style={{
                background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 14px rgba(37,99,235,0.6))",
              }}>ASTUTE OB54</h2>
              <p className="text-[13px] leading-relaxed max-w-[340px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Private server Free Fire terbaru dengan fitur lengkap dan anti-ban protection
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col gap-4 mb-8">
              <DownloadBar count={downloadCount} max={0} />
              <StatusBar dotColor="cyan" label="FILE SIZE" value="284 MB" valueColor="cyan" />
            </div>
          </Reveal>
          <Reveal delay={210}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px]">
              <Download className="w-3 h-3" style={{ color: "var(--ast-blue)" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Download</span>
            </div>
            <LinkBox
              title="FF MAX ORIGINAL NEW"
              url="https://play.google.com/store/apps/details?id=com.dts.freefiremax"
              desc="Download Free Fire MAX Original dari Google Play Store"
              icon={<Download className="w-5 h-5 text-white" />}
              onLinkClick={bumpDownload}
            />
            <LinkBox
              title="FF BIASA ORIGINAL NEW"
              url="https://play.google.com/store/apps/details?id=com.dts.freefireth"
              desc="Download Free Fire Original dari Google Play Store"
              icon={<Download className="w-5 h-5 text-white" />}
              onLinkClick={bumpDownload}
            />
            <LinkBox
              title="JSON ASTUTE"
              url="https://www.mediafire.com/file/hc10an4kknul0ex/localconfig.json/file"
              desc="Download file config JSON"
              icon={<FileArchive className="w-5 h-5 text-white" />}
              onLinkClick={bumpDownload}
            />
            <LinkBox
              title="SCRIPT iOS"
              url="https://www.mediafire.com/file/crl6iuhbn5saqli/FFASTUTECH_FREE-VIP.json/file"
              desc="Download script iOS (iPhone 11 - baru)"
              icon={<Smartphone className="w-5 h-5 text-white" />}
              onLinkClick={bumpDownload}
            />
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
              <h2 className="text-[22px] font-extrabold mb-1.5"><span style={{
                background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 12px rgba(37,99,235,0.5))",
              }}>PANEL ASTUTE</span></h2>
              <p className="text-[13px] leading-relaxed max-w-[340px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Control panel untuk konfigurasi server, proxy, dan manage fitur mod
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col gap-4 mb-8">
              <StatusBar dotColor="green" label="PANEL STATUS" value="ACTIVE" valueColor="green" live />
              <StatusBar dotColor="blue" label="VERSION" value="v2.4.1" valueColor="blue" />
            </div>
          </Reveal>
          <Reveal delay={210}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px]">
              <ExternalLink className="w-3 h-3" style={{ color: "var(--ast-blue)" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Link Panel</span>
            </div>
            <LinkBox
              title="DASHBOARD ASTUTE"
              url="https://dash.unlockffbeta.com/"
              desc="Buka dashboard control panel"
              icon={<Settings className="w-5 h-5 text-white" />}
            />
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
              <h2 className="text-[22px] font-extrabold mb-1.5"><span style={{
                background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 12px rgba(37,99,235,0.5))",
              }}>VERIF MANUAL</span></h2>
              <p className="text-[13px] leading-relaxed max-w-[340px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Tool bypass verifikasi untuk mengaktifkan fitur premium tanpa limit
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col gap-4 mb-8">
              <StatusBar dotColor="green" label="VERIF STATUS" value="READY" valueColor="green" live />
              <StatusBar dotColor="blue" label="SUCCESS RATE" value="99.2%" valueColor="blue" />
            </div>
          </Reveal>
          <Reveal delay={210}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px]">
              <ExternalLink className="w-3 h-3" style={{ color: "var(--ast-blue)" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Link Verifikasi</span>
            </div>
            <LinkBox
              title="UNLOCK ASTUTE"
              url="https://www.unlockffbeta.com"
              desc="Unlock fitur premium ASTUTE"
              icon={<ShieldCheck className="w-5 h-5 text-white" />}
            />
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
              <h2 className="text-[22px] font-extrabold mb-1.5"><span style={{
                background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 12px rgba(37,99,235,0.5))",
              }}>DISCORD SERVER</span></h2>
              <p className="text-[13px] leading-relaxed max-w-[340px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Join komunitas ASTUTE — dapatkan bantuan, info update, dan diskusi sesama player
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col gap-4 mb-8">
              <StatusBar dotColor="green" label="SERVER STATUS" value="ONLINE" valueColor="green" live />
              <StatusBar dotColor="blue" label="MEMBERS" value="1,247" valueColor="blue" />
            </div>
          </Reveal>
          <Reveal delay={210}>
            <LinkBox
              title="JOIN DISCORD SERVER"
              url="https://discord.gg/astutetech"
              desc="Gabung komunitas ASTUTE di Discord"
              icon={<DiscordIcon className="w-5 h-5 text-white" />}
            />
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
              <h2 className="text-[22px] font-extrabold mb-1.5"><span style={{
                background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 12px rgba(37,99,235,0.5))",
              }}>VIDEO TUTORIAL</span></h2>
              <p className="text-[13px] leading-relaxed max-w-[340px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Panduan lengkap dari install sampai main — ikutin aja step by step
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col gap-4 mb-8">
              <StatusBar dotColor="green" label="GUIDE STATUS" value="UPDATED" valueColor="green" live />
              <StatusBar dotColor="blue" label="DURATION" value="1 : 52 minute" valueColor="blue" />
            </div>
          </Reveal>
          <Reveal delay={210}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px]">
              <ExternalLink className="w-3 h-3" style={{ color: "var(--ast-blue)" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Video Tutorial</span>
            </div>
            <LinkBox
              title="TUTORIAL FULL SETUP PROXY"
              url="https://vt.tiktok.com/ZSXHW1BSL/"
              desc="Panduan setup proxy dari awal sampai connect"
              icon={<PlayCircle className="w-5 h-5 text-white" />}
            />
            <LinkBox
              title="CARA SETTING VAULT DI ASTUTE"
              url="https://vt.tiktok.com/ZSXHWHGKN/"
              desc="Tutorial setting vault di ASTUTE"
              icon={<PlayCircle className="w-5 h-5 text-white" />}
            />
            <LinkBox
              title="TUTORIAL VERIF EASY"
              url="https://vt.tiktok.com/ZSXHWHSHN/"
              desc="Tutorial verifikasi easy yang work"
              icon={<PlayCircle className="w-5 h-5 text-white" />}
            />
            <LinkBox
              title="CARA MAIN RANK DI FF ASTUTE"
              url="https://vt.tiktok.com/ZSXHW57jY/"
              desc="Panduan main rank di FF ASTUTE"
              icon={<PlayCircle className="w-5 h-5 text-white" />}
            />
            <LinkBox
              title="CARA NGEDAMAGE DI FF ASTUTE"
              url="https://vt.tiktok.com/ZSXHWYqHy/"
              desc="Tutorial damage di FF ASTUTE"
              icon={<PlayCircle className="w-5 h-5 text-white" />}
            />
            <LinkBox
              title="CARA PAKE SKILL FF ASTUTE"
              url="https://vt.tiktok.com/ZSXHWodF8/"
              desc="Cara menggunakan skill di FF ASTUTE"
              icon={<PlayCircle className="w-5 h-5 text-white" />}
            />
            <LinkBox
              title="CARA MATIIN SAFE MODE"
              url="https://vt.tiktok.com/ZSXH7JpoL/"
              desc="Tutorial mematikan safe mode"
              icon={<PlayCircle className="w-5 h-5 text-white" />}
            />
            <LinkBox
              title="TUTORIAL GUNAKAN DASHBOARD"
              url="https://vt.tiktok.com/ZSx8GpjvY/"
              desc="Cara pakai dashboard panel ASTUTE"
              icon={<PlayCircle className="w-5 h-5 text-white" />}
            />
            <LinkBox
              title="TUTORIAL iOS (iPhone 11 - Baru)"
              url="https://youtube.com/shorts/QbZsXjfisFQ"
              desc="Panduan setup ASTUTE di iPhone 11 dan model terbaru"
              icon={<Smartphone className="w-5 h-5 text-white" />}
            />
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

        {/* ═══ CHANGELOG / FITUR VIP ACCESS PAGE ═══ */}
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
                <ShieldCheck className="w-[60px] h-[60px] text-white opacity-90" />
              </div>
              <h2 className="text-[22px] font-extrabold mb-1.5"><span style={{
                background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 12px rgba(37,99,235,0.5))",
              }}>FITUR VIP ACCESS ASTUTE</span></h2>
              <p className="text-[13px] leading-relaxed max-w-[340px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Semua fitur premium yang kamu dapatkan sebagai VIP ACCESS di ASTUTE
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col gap-4 mb-8">
              <StatusBar dotColor="green" label="VIP STATUS" value="ACTIVE" valueColor="green" live />
              <StatusBar dotColor="blue" label="ACCESS LEVEL" value="VIP" valueColor="blue" valueGradient />
            </div>
          </Reveal>
          <Reveal delay={210}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px]">
              <ShieldCheck className="w-3 h-3" style={{ color: "var(--ast-blue-l)" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>VIP Features</span>
            </div>
            <VipFeatureBox theme="blue" />
          </Reveal>
        </PageWrapper>

        {/* ═══ PEMBELIAN VIP PAGE ═══ */}
        <PageWrapper pageName="vip" currentPage={currentPage}>
          <Reveal>
            <button onClick={() => goPage("home")} type="button"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-white text-[13px] font-semibold cursor-pointer mb-7 border"
              style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
          </Reveal>

          {/* ─── VIP Hero Section ─── */}
          <Reveal delay={70}>
            <div className="text-center mb-6 relative">
              <div className="relative inline-flex items-center justify-center mb-5 w-[80px] h-[80px] rounded-full"
                style={{
                  background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                  boxShadow: "none",
                }}>
                <Crown className="w-[44px] h-[44px] text-white" />
              </div>
              <h2 className="text-[24px] font-extrabold mb-2" style={{
                background: "linear-gradient(135deg, #93c5fd, #60a5fa, #1d4ed8, #0c2d5a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 14px rgba(37,99,235,0.6))",
              }}>PEMBELIAN VIP</h2>
              <p className="text-[13px] leading-relaxed max-w-[340px] mx-auto" style={{ color: "var(--ast-gray)" }}>
                Upgrade akun kamu ke VIP dan buka semua fitur premium ASTUTE. Pengalaman bermain yang lebih seru dan lengkap!
              </p>
            </div>
          </Reveal>

          {/* ─── Status Bars ─── */}
          <Reveal delay={100}>
            <div className="flex flex-col gap-3 mb-6">
              <StatusBar dotColor="seller" label="VIP ACCESS" value="PREMIUM" valueColor="seller" live />
              <StatusBar dotColor="green" label="SERVER STATUS" value="ONLINE" valueColor="green" />
            </div>
          </Reveal>

          {/* ─── Pricing Cards ─── */}
          <Reveal delay={140}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px]">
              <Crown className="w-3 h-3" style={{ color: "#60a5fa" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Pilih Paket VIP</span>
            </div>

            {/* ═══ VIP BIASA ═══ */}
            <div className="rounded-2xl p-4 border mb-3 relative overflow-hidden"
              style={{ background: "var(--ast-bg2)", borderColor: "rgba(37,99,235,0.18)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)", opacity: 0.8 }} />
              <div className="text-[15px] font-black mb-1" style={{
                background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 8px rgba(37,99,235,0.5))",
              }}>VIP BIASA</div>
              <div className="text-[10px] mb-3" style={{ color: "var(--ast-gray)" }}>NO FITUR GIFT</div>

              <div className="flex flex-col gap-2">
                {/* PERHARI */}
                <div className="rounded-xl p-3 flex items-center justify-between cursor-pointer active:scale-[0.98]"
                  onClick={() => goPage("qris")}
                  style={{ background: "rgba(37,99,235,0.08)", transition: "all 0.3s" }}>
                  <div>
                    <div className="text-[12px] font-bold" style={{ color: "#93c5fd" }}>PERHARI</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] font-black" style={{
                      background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 6px rgba(37,99,235,0.4))",
                    }}>20K</div>
                    <div className="text-[9px] font-bold font-mono" style={{ color: "var(--ast-gray)" }}>IDR</div>
                  </div>
                </div>

                {/* PERMINGGU */}
                <div className="rounded-xl p-3 flex items-center justify-between cursor-pointer active:scale-[0.98] relative"
                  onClick={() => goPage("qris")}
                  style={{ background: "rgba(37,99,235,0.12)", transition: "all 0.3s" }}>
                  <div className="absolute top-1 right-1 px-1.5 py-[1px] rounded-full text-[7px] font-bold tracking-wider" style={{ background: "linear-gradient(135deg, #0c2d5a, #1d4ed8)", color: "#fff" }}>POPULER</div>
                  <div>
                    <div className="text-[12px] font-bold" style={{ color: "#93c5fd" }}>PERMINGGU</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] font-black" style={{
                      background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 6px rgba(37,99,235,0.4))",
                    }}>95K</div>
                    <div className="text-[9px] font-bold font-mono" style={{ color: "var(--ast-gray)" }}>IDR</div>
                  </div>
                </div>

                {/* PERBULAN */}
                <div className="rounded-xl p-3 flex items-center justify-between cursor-pointer active:scale-[0.98]"
                  onClick={() => goPage("qris")}
                  style={{ background: "rgba(37,99,235,0.08)", transition: "all 0.3s" }}>
                  <div>
                    <div className="text-[12px] font-bold" style={{ color: "#93c5fd" }}>PERBULAN</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] font-black" style={{
                      background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 6px rgba(37,99,235,0.4))",
                    }}>305K</div>
                    <div className="text-[9px] font-bold font-mono" style={{ color: "var(--ast-gray)" }}>IDR</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ VIP HIGH ═══ */}
            <div className="rounded-2xl p-4 border mb-3 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(30,58,95,0.12), rgba(29,78,216,0.06))", borderColor: "rgba(37,99,235,0.25)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #1d4ed8, #60a5fa, #a78bfa)" }} />
              <div className="absolute top-2 right-2 px-2 py-[2px] rounded-full text-[8px] font-bold tracking-wider" style={{ background: "linear-gradient(135deg, #1d4ed8, #60a5fa)", color: "#fff" }}>BEST VALUE</div>
              <div className="text-[15px] font-black mb-1" style={{
                background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 8px rgba(37,99,235,0.5))",
              }}>VIP HIGH</div>
              <div className="text-[10px] mb-3" style={{ color: "var(--ast-gray)" }}>AKSES GIFT BUNDLE BEST VALUE</div>

              <div className="flex flex-col gap-2">
                {/* PERMINGGU */}
                <div className="rounded-xl p-3 flex items-center justify-between cursor-pointer active:scale-[0.98]"
                  onClick={() => goPage("qris")}
                  style={{ background: "rgba(37,99,235,0.08)", transition: "all 0.3s" }}>
                  <div>
                    <div className="text-[12px] font-bold" style={{ color: "#93c5fd" }}>PERMINGGU</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] font-black" style={{
                      background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 6px rgba(37,99,235,0.4))",
                    }}>150K</div>
                    <div className="text-[9px] font-bold font-mono" style={{ color: "var(--ast-gray)" }}>IDR</div>
                  </div>
                </div>

                {/* PERBULAN */}
                <div className="rounded-xl p-3 flex items-center justify-between cursor-pointer active:scale-[0.98]"
                  onClick={() => goPage("qris")}
                  style={{ background: "rgba(37,99,235,0.12)", transition: "all 0.3s" }}>
                  <div>
                    <div className="text-[12px] font-bold" style={{ color: "#93c5fd" }}>PERBULAN</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] font-black" style={{
                      background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 6px rgba(37,99,235,0.4))",
                    }}>500K</div>
                    <div className="text-[9px] font-bold font-mono" style={{ color: "var(--ast-gray)" }}>IDR</div>
                  </div>
                </div>

                {/* DOBBLE BULAN */}
                <div className="rounded-xl p-3 flex items-center justify-between cursor-pointer active:scale-[0.98]"
                  onClick={() => goPage("qris")}
                  style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.12), rgba(96,165,250,0.06))", transition: "all 0.3s" }}>
                  <div>
                    <div className="text-[12px] font-bold" style={{ color: "#c4b5fd" }}>DOBBLE BULAN</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] font-black" style={{
                      background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 6px rgba(37,99,235,0.4))",
                    }}>900K</div>
                    <div className="text-[9px] font-bold font-mono" style={{ color: "var(--ast-gray)" }}>IDR</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ ONLY AKTIF GIFT ═══ */}
            <div className="rounded-2xl p-4 border relative overflow-hidden"
              style={{ background: "var(--ast-bg2)", borderColor: "rgba(139,92,246,0.2)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #7c3aed, #a78bfa, #c4b5fd)" }} />
              <div className="text-[15px] font-black mb-1" style={{
                background: "linear-gradient(135deg, #5b21b6, #7c3aed, #a78bfa, #c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 8px rgba(139,92,246,0.5))",
              }}>ONLY AKTIF GIFT</div>
              <div className="text-[10px] mb-3" style={{ color: "var(--ast-gray)" }}>Akses gift tanpa VIP lainnya</div>

              <div className="flex flex-col gap-2">
                {/* 7 HARI */}
                <div className="rounded-xl p-3 flex items-center justify-between cursor-pointer active:scale-[0.98]"
                  onClick={() => goPage("qris")}
                  style={{ background: "rgba(139,92,246,0.08)", transition: "all 0.3s" }}>
                  <div>
                    <div className="text-[12px] font-bold" style={{ color: "#c4b5fd" }}>7 HARI</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] font-black" style={{
                      background: "linear-gradient(135deg, #5b21b6, #7c3aed, #a78bfa, #c4b5fd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 6px rgba(139,92,246,0.4))",
                    }}>85K</div>
                    <div className="text-[9px] font-bold font-mono" style={{ color: "var(--ast-gray)" }}>IDR</div>
                  </div>
                </div>

                {/* 30 HARI */}
                <div className="rounded-xl p-3 flex items-center justify-between cursor-pointer active:scale-[0.98]"
                  onClick={() => goPage("qris")}
                  style={{ background: "rgba(139,92,246,0.12)", transition: "all 0.3s" }}>
                  <div>
                    <div className="text-[12px] font-bold" style={{ color: "#c4b5fd" }}>30 HARI</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] font-black" style={{
                      background: "linear-gradient(135deg, #5b21b6, #7c3aed, #a78bfa, #c4b5fd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 6px rgba(139,92,246,0.4))",
                    }}>400K</div>
                    <div className="text-[9px] font-bold font-mono" style={{ color: "var(--ast-gray)" }}>IDR</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ─── Keuntungan VIP ─── */}
          <Reveal delay={210}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px] mt-8">
              <Crown className="w-3 h-3" style={{ color: "#60a5fa" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Keuntungan VIP</span>
            </div>
            <button
              onClick={() => goPage("changelog")}
              className="w-full rounded-2xl p-5 border relative overflow-hidden cursor-pointer active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, rgba(30,58,95,0.12), rgba(29,78,216,0.06))", borderColor: "rgba(37,99,235,0.25)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)" }} />
              <div className="flex items-center justify-center gap-3">
                <Crown className="w-5 h-5" style={{ color: "#60a5fa" }} />
                <span className="text-[16px] font-black" style={{
                  background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 8px rgba(37,99,235,0.5))",
                }}>LIHAT KEUNTUNGAN VIP</span>
                <span className="text-[14px] font-bold" style={{
                  background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>→</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-[11px]" style={{ color: "var(--ast-gray)" }}>Klik untuk melihat semua fitur & keuntungan VIP</span>
              </div>
            </button>
          </Reveal>

          {/* ─── Testimonial / Stats ─── */}
          <Reveal delay={240}>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl p-3 text-center border" style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)" }}>
                <div className="text-[18px] font-extrabold" style={{
                  background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 6px rgba(37,99,235,0.5))",
                }}>2K+</div>
                <div className="text-[9px] font-semibold mt-0.5" style={{ color: "var(--ast-gray)" }}>VIP User</div>
              </div>
              <div className="rounded-xl p-3 text-center border" style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)" }}>
                <div className="text-[18px] font-extrabold" style={{
                  background: "linear-gradient(135deg, #15803d, #22c55e, #4ade80)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>99.9%</div>
                <div className="text-[9px] font-semibold mt-0.5" style={{ color: "var(--ast-gray)" }}>Uptime</div>
              </div>
              <div className="rounded-xl p-3 text-center border" style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)" }}>
                <div className="text-[18px] font-extrabold" style={{
                  background: "linear-gradient(135deg, #0e7490, #22d3ee, #67e8f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>24/7</div>
                <div className="text-[9px] font-semibold mt-0.5" style={{ color: "var(--ast-gray)" }}>Support</div>
              </div>
            </div>
          </Reveal>

          {/* ─── Cara Pembelian ─── */}
          <Reveal delay={270}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px] mt-8">
              <Info className="w-3 h-3" style={{ color: "#60a5fa" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Cara Pembelian</span>
            </div>
            <div className="rounded-2xl p-5 border relative overflow-hidden" style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)", opacity: 0.5 }} />
              <div className="flex flex-col gap-4">
                {[
                  { step: "01", text: "Pilih paket VIP yang kamu inginkan di atas" },
                  { step: "02", text: "Hubungi admin atau helper via WhatsApp / Telegram" },
                  { step: "03", text: "Lakukan pembayaran sesuai harga paket" },
                  { step: "04", text: "Tunggu konfirmasi, VIP langsung aktif!" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-extrabold" style={{
                      background: "linear-gradient(135deg, #0c2d5a, #1d4ed8)",
                      color: "#fff",
                      boxShadow: "none",
                    }}>{s.step}</div>
                    <span className="text-[12px] leading-relaxed pt-1" style={{ color: "var(--ast-gray)" }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ─── Metode Pembayaran ─── */}
          <Reveal delay={300}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px] mt-8">
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Metode Pembayaran</span>
            </div>
            <button
              onClick={() => goPage("qris")}
              className="w-full rounded-2xl p-4 border relative overflow-hidden cursor-pointer active:scale-[0.98] flex items-center gap-4"
              style={{ background: "var(--ast-bg2)", borderColor: "rgba(37,99,235,0.2)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)", opacity: 0.5 }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #0c2d5a, #1d4ed8)" }}>
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="3" height="3" />
                  <line x1="21" y1="14" x2="21" y2="14.01" />
                  <line x1="21" y1="21" x2="21" y2="21.01" />
                  <line x1="17" y1="18" x2="17.01" y2="18" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="text-[14px] font-bold" style={{
                  background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>QRIS</div>
                <div className="text-[10px] mt-0.5" style={{ color: "var(--ast-gray)" }}>Scan QR code untuk pembayaran</div>
              </div>
              <span className="text-[12px] font-bold" style={{
                background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>→</span>
            </button>
          </Reveal>

          {/* ─── Chat Untuk Pembelian ─── */}
          <Reveal delay={330}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px] mt-8">
              <MessageCircle className="w-3 h-3" style={{ color: "#60a5fa" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Chat Untuk Pembelian</span>
            </div>
            <LinkBox
              title="admin (Telegram)"
              url="https://t.me/ftrjna"
              desc="Chat admin via Telegram untuk pembelian VIP"
              icon={<TelegramIcon className="w-5 h-5 text-white" />}
              item="vip-tele-admin"
            />
            <LinkBox
              title="DEV/ADMIN JUJU (WhatsApp)"
              url="https://wa.me/6283119880784"
              desc="Chat DEV/ADMIN JUJU via WhatsApp untuk pembelian VIP"
              icon={<WhatsAppIcon className="w-5 h-5 text-white" />}
              item="vip-wa-admin2"
            />
            <LinkBox
              title="ADMIN RASYA (WhatsApp)"
              url="https://wa.me/628812882145"
              desc="Chat ADMIN RASYA via WhatsApp untuk pembelian VIP"
              icon={<WhatsAppIcon className="w-5 h-5 text-white" />}
              item="vip-wa-admin1"
            />
            <LinkBox
              title="HELPER EJAA (WhatsApp)"
              url="https://wa.me/628812882145"
              desc="Chat HELPER EJAA via WhatsApp untuk pembelian VIP"
              icon={<WhatsAppIcon className="w-5 h-5 text-white" />}
              item="vip-wa-admin4"
            />
          </Reveal>

          {/* ─── Disclaimer ─── */}
          <Reveal delay={360}>
            <div className="mt-8 rounded-2xl p-4 border" style={{ background: "rgba(37,99,235,0.04)", borderColor: "rgba(37,99,235,0.1)" }}>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 mt-[2px] shrink-0" style={{ color: "#60a5fa" }} />
                <div className="text-[11px] leading-relaxed" style={{ color: "var(--ast-gray)" }}>
                  <strong style={{ color: "var(--ast-white)" }}>Garansi aman!</strong> VIP dilindungi anti-ban system. Jika ada masalah, hubungi admin untuk bantuan. Pembayaran hanya melalui kontak resmi di atas.
                </div>
              </div>
            </div>
          </Reveal>
        </PageWrapper>

        {/* ═══ QRIS PAYMENT PAGE ═══ */}
        <PageWrapper pageName="qris" currentPage={currentPage}>
          <Reveal>
            <button onClick={() => goPage("vip")} type="button"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-white text-[13px] font-semibold cursor-pointer mb-7 border"
              style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
          </Reveal>

          {/* ─── QRIS Hero ─── */}
          <Reveal delay={70}>
            <div className="text-center mb-6 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)", filter: "blur(12px)" }} />
              <div className="relative inline-flex items-center justify-center mb-4 w-[72px] h-[72px] rounded-full"
                style={{
                  background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                  boxShadow: "0 0 30px rgba(37,99,235,0.3), 0 0 60px rgba(37,99,235,0.1)",
                }}>
                <svg className="w-[38px] h-[38px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="3" height="3" />
                  <line x1="21" y1="14" x2="21" y2="14.01" />
                  <line x1="21" y1="21" x2="21" y2="21.01" />
                  <line x1="17" y1="18" x2="17.01" y2="18" />
                </svg>
              </div>
              <h2 className="text-[22px] font-black" style={{
                background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 14px rgba(37,99,235,0.6))",
              }}>PEMBAYARAN QRIS</h2>
              <p className="text-[12px] mt-2 leading-relaxed" style={{ color: "var(--ast-gray)" }}>
                Scan QR code di bawah menggunakan aplikasi e-wallet<br />atau mobile banking untuk melakukan pembayaran
              </p>
            </div>
          </Reveal>

          {/* ─── QRIS Image Card ─── */}
          <Reveal delay={140}>
            <div className="rounded-2xl border relative overflow-hidden" style={{ background: "var(--ast-bg2)", borderColor: "rgba(37,99,235,0.2)" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)" }} />
              
              {/* QRIS Badge */}
              <div className="flex items-center justify-center gap-2 pt-5 pb-3">
                <div className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider" style={{ background: "linear-gradient(135deg, #0c2d5a, #1d4ed8)", color: "#fff" }}>
                  QRIS
                </div>
                <div className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider" style={{ background: "rgba(37,99,235,0.1)", color: "#60a5fa", border: "1px solid rgba(37,99,235,0.2)" }}>
                  ACCEPTED
                </div>
              </div>

              {/* QR Code Image */}
              <div className="flex items-center justify-center px-6 pb-4">
                <div className="rounded-xl p-3 border" style={{ background: "#ffffff", borderColor: "rgba(37,99,235,0.15)" }}>
                  <img 
                    src="/QRIS.png" 
                    alt="QRIS Payment Code" 
                    className="w-full max-w-[260px] h-auto block"
                    style={{ imageRendering: "crisp-edges" }}
                  />
                </div>
              </div>

              {/* Download Button */}
              <div className="px-6 pb-5">
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = "/QRIS.png";
                    link.download = "QRIS_JUJU_SELLER.png";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full py-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)",
                    color: "#fff",
                    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                    boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
                  }}>
                  <Download className="w-4 h-4" />
                  DOWNLOAD QRIS
                </button>
              </div>
            </div>
          </Reveal>

          {/* ─── Supported Apps ─── */}
          <Reveal delay={210}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px] mt-6">
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Supported Apps</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["Dana", "OVO", "GoPay", "ShopeePay", "LinkAja", "Bank App"].map(app => (
                <div key={app} className="rounded-xl py-2.5 px-2 text-center text-[10px] font-semibold border" style={{
                  background: "var(--ast-bg2)",
                  borderColor: "var(--ast-border2)",
                  color: "var(--ast-white)",
                }}>{app}</div>
              ))}
            </div>
          </Reveal>

          {/* ─── Payment Steps ─── */}
          <Reveal delay={280}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px] mt-6">
              <Info className="w-3 h-3" style={{ color: "#60a5fa" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Cara Bayar via QRIS</span>
            </div>
            <div className="rounded-2xl p-4 border" style={{ background: "var(--ast-bg2)", borderColor: "var(--ast-border)" }}>
              <div className="flex flex-col gap-3">
                {[
                  { step: "1", text: "Buka aplikasi e-wallet atau mobile banking" },
                  { step: "2", text: "Pilih menu Scan / Scan QR" },
                  { step: "3", text: "Arahkan kamera ke QR code di atas" },
                  { step: "4", text: "Masukkan nominal sesuai paket VIP" },
                  { step: "5", text: "Konfirmasi pembayaran & screenshot bukti" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-extrabold" style={{
                      background: "linear-gradient(135deg, #0c2d5a, #1d4ed8)",
                      color: "#fff",
                    }}>{s.step}</div>
                    <span className="text-[11px] leading-relaxed pt-0.5" style={{ color: "var(--ast-gray)" }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ─── Important Notice ─── */}
          <Reveal delay={350}>
            <div className="mt-6 rounded-2xl p-4 border" style={{ background: "rgba(37,99,235,0.04)", borderColor: "rgba(37,99,235,0.1)" }}>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 mt-[2px] shrink-0" style={{ color: "#60a5fa" }} />
                <div className="text-[11px] leading-relaxed" style={{ color: "var(--ast-gray)" }}>
                  <strong style={{ color: "var(--ast-white)" }}>Penting!</strong> Setelah pembayaran berhasil, kirim bukti screenshot ke admin via WhatsApp atau Telegram untuk konfirmasi aktivasi VIP.
                </div>
              </div>
            </div>
          </Reveal>

          {/* ─── Contact Admin ─── */}
          <Reveal delay={420}>
            <div className="flex items-center gap-[7px] mb-3 px-[2px] mt-6">
              <MessageCircle className="w-3 h-3" style={{ color: "#60a5fa" }} />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--ast-gray)" }}>Kirim Bukti ke Admin</span>
            </div>
            <LinkBox
              title="DEV/ADMIN JUJU (WhatsApp)"
              url="https://wa.me/6283119880784"
              desc="Kirim bukti pembayaran QRIS ke DEV/ADMIN JUJU"
              icon={<WhatsAppIcon className="w-5 h-5 text-white" />}
              item="qris-wa-admin2"
            />
            <LinkBox
              title="ADMIN RASYA (WhatsApp)"
              url="https://wa.me/628812882145"
              desc="Kirim bukti pembayaran QRIS ke ADMIN RASYA"
              icon={<WhatsAppIcon className="w-5 h-5 text-white" />}
              item="qris-wa-admin1"
            />
            <LinkBox
              title="HELPER EJAA (WhatsApp)"
              url="https://wa.me/628812882145"
              desc="Kirim bukti pembayaran QRIS ke HELPER EJAA"
              icon={<WhatsAppIcon className="w-5 h-5 text-white" />}
              item="qris-wa-admin4"
            />
            <LinkBox
              title="admin (Telegram)"
              url="https://t.me/ftrjna"
              desc="Kirim bukti pembayaran QRIS via Telegram"
              icon={<TelegramIcon className="w-5 h-5 text-white" />}
              item="qris-tele-admin"
            />
          </Reveal>
        </PageWrapper>
      </main>

      <Toast message={toastMsg} visible={toastVisible} />

      {/* ═══ VOICE CONTROL — Fixed Bottom Right ═══════════════════════════ */}
      <button
        onClick={toggleMusic}
        style={{
          position: "fixed",
          bottom: "80px",
          right: "20px",
          zIndex: 9999,
          width: "46px",
          height: "46px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          background: musicPlaying
            ? "linear-gradient(135deg, #0c2d5a, #1d4ed8, #60a5fa, #93c5fd)"
            : "#0e1428",
          border: "1px solid " + (musicPlaying ? "rgba(37,99,235,0.3)" : "rgba(37,99,235,0.08)"),
          boxShadow: musicPlaying
            ? "0 0 20px rgba(37,99,235,0.35), 0 4px 16px rgba(0,0,0,0.5)"
            : "0 4px 16px rgba(0,0,0,0.4)",
          animation: musicPlaying ? "music-pulse 2s ease-in-out infinite" : "none",
          transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
        aria-label={musicPlaying ? "Matikan sound" : "Hidupkan sound"}
        title={musicPlaying ? "Klik untuk matikan sound" : "Klik untuk hidupkan sound"}
      >
        {musicPlaying
          ? <Volume2 style={{ width: 20, height: 20, color: "#fff" }} />
          : <VolumeX style={{ width: 20, height: 20, color: "#6b7ba8" }} />
        }
      </button>
    </div>
  );
}

