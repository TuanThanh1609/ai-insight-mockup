"use client";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import React from "react";
import {
  MessageSquare,
  TrendingUp,
  Users,
  ShieldCheck,
  Zap,
  BarChart3,
  Phone,
  Star,
} from "lucide-react";

/**
 * RadarEffect — Animated radar scan visualization
 * Adapted from shadcn radar-effect for AI Insight project
 * Design System: Editorial Precision (Stitch "Smax Insight Blue v2")
 * - Primary: #1A2138 Deep Navy
 * - Secondary: #BF3003 Deep Rust
 * - Tertiary: #0052FF Vibrant Blue
 */

// Radar icon items — adapted from react-icons to lucide-react
export const RADAR_ITEMS = [
  {
    icon: MessageSquare,
    label: "Lead Nóng",
    delay: 0.2,
    position: "top-left",
    color: "#BF3003",
  },
  {
    icon: TrendingUp,
    label: "ROAS tăng",
    delay: 0.4,
    position: "top-right",
    color: "#059669",
  },
  {
    icon: Users,
    label: "Nhân viên",
    delay: 0.3,
    position: "mid-left",
    color: "#0052FF",
  },
  {
    icon: ShieldCheck,
    label: "Junk Alert",
    delay: 0.5,
    position: "bottom-left",
    color: "#d97706",
  },
  {
    icon: Zap,
    label: "AI Insights",
    delay: 0.6,
    position: "mid-right",
    color: "#BF3003",
  },
  {
    icon: BarChart3,
    label: "Chiến dịch",
    delay: 0.7,
    position: "bottom-right",
    color: "#0052FF",
  },
  {
    icon: Phone,
    label: "Thu SĐT",
    delay: 0.8,
    position: "far-left",
    color: "#059669",
  },
  {
    icon: Star,
    label: "CSKH",
    delay: 0.9,
    position: "far-right",
    color: "#059669",
  },
];

// Position helpers
const POSITION_STYLES = {
  "top-left":    { top: "8%",  left: "6%" },
  "top-right":   { top: "8%",  right: "6%" },
  "mid-left":    { top: "40%", left: "2%" },
  "mid-right":   { top: "40%", right: "2%" },
  "bottom-left": { bottom: "12%", left: "6%" },
  "bottom-right":{ bottom: "12%", right: "6%" },
  "far-left":    { top: "50%", left: "-4%" },
  "far-right":   { top: "50%", right: "-4%" },
};

/** Concentric animated circles */
export const RadarCircles = ({ count = 8, color = "#475569" }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {Array.from({ length: count }).map((_, idx) => {
        const size = (idx + 1) * 1.25; // rem
        const opacity = Math.max(0.08, 0.8 - idx * 0.09);
        return (
          <div
            key={idx}
            className="absolute rounded-full border"
            style={{
              width: `${size}rem`,
              height: `${size}rem`,
              borderColor: color,
              opacity,
              transition: "opacity 0.3s ease",
            }}
          />
        );
      })}
    </div>
  );
};

/** Rotating radar sweep line */
export const RadarSweep = ({ color = "#0052FF" }) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <style>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-radar-sweep {
          animation: radar-sweep 8s linear infinite;
          transform-origin: right center;
        }
      `}</style>
      <div
        className="animate-radar-sweep absolute right-1/2 top-1/2 flex items-end justify-center"
        style={{
          height: "400px",
          width: "1px",
          transformOrigin: "right center",
        }}
      >
        {/* Gradient sweep */}
        <div
          className="h-[400px] w-[2px]"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${color} 30%, transparent 100%)`,
            opacity: 0.5,
          }}
        />
      </div>
    </div>
  );
};

/** Single icon container on radar */
export const RadarItem = ({
  icon: Icon,
  label,
  delay = 0,
  position = "mid-right",
  color = "#0052FF",
}) => {
  const posStyle = POSITION_STYLES[position] || {};
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="absolute z-50 flex flex-col items-center justify-center space-y-1"
      style={{ ...posStyle }}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-lg border shadow-inner"
        style={{
          borderColor: `${color}40`,
          backgroundColor: `${color}10`,
          backdropFilter: "blur(8px)",
        }}
      >
        <Icon size={20} color={color} strokeWidth={1.8} />
      </div>
      <div
        className="hidden rounded-md px-2 py-0.5 text-center text-[10px] font-semibold leading-tight whitespace-nowrap md:block"
        style={{ color, backgroundColor: `${color}10` }}
      >
        {label}
      </div>
    </motion.div>
  );
};

/** Full Radar Effect component */
export const RadarEffect = ({ className, itemColor = "#0052FF" }) => {
  return (
    <div
      className={twMerge(
        "relative flex h-52 w-52 items-center justify-center rounded-full",
        className
      )}
    >
      <RadarCircles count={6} color={itemColor} />
      <RadarSweep color={itemColor} />
      {RADAR_ITEMS.map((item) => (
        <RadarItem key={item.label} {...item} color={itemColor} />
      ))}
    </div>
  );
};
