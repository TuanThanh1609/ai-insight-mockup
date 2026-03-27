import {
  Settings, LayoutGrid, Package, Bell, ChevronDown,
  BarChart2, Newspaper, MessageCircle, Bot, Users, Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * TopNavBar — Fahasa-style top navigation bar
 *
 * Layout: [Brand] | [Main Nav] | [Utility Bar]
 * Background: #1A2138 (Deep Navy)
 * Active nav pill: #2b3354
 */

const mainNavItems = [
  { label: 'Bảng tin', icon: Newspaper },
  { label: 'Nhắn tin', icon: MessageCircle },
  { label: 'Bot-Auto', icon: Bot },
  { label: 'Khách hàng', icon: Users },
  { label: 'Thống kê', icon: BarChart2, active: true },
  { label: 'Zalo ZBS', icon: null },
];

export function TopNavBar() {
  return (
    <header className="h-14 bg-[#1A2138] flex items-center px-4 gap-6 sticky top-0 z-50 shadow-md">
      {/* ── Left: Brand ───────────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* S-mark logo */}
        <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
          <span className="font-display font-bold text-base text-[#1A2138]">S</span>
          <div className="absolute w-2 h-2 bg-[#BF3003] rounded-full -bottom-0.5 -right-0.5" />
        </div>

        {/* Vertical divider */}
        <div className="w-px h-7 bg-white/20" />

        {/* Fahasa avatar */}
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center overflow-hidden">
            {/* Owl-like Fahasa icon */}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <circle cx="12" cy="12" r="11" fill="white" />
              <circle cx="9" cy="11" r="2.5" fill="#1A2138" />
              <circle cx="15" cy="11" r="2.5" fill="#1A2138" />
              <circle cx="9.5" cy="11.5" r="1" fill="white" />
              <circle cx="15.5" cy="11.5" r="1" fill="white" />
              <path d="M8 15.5 Q12 17.5 16 15.5" stroke="#1A2138" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M6 8 Q12 5 18 8" stroke="#BF3003" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-semibold text-sm text-white leading-none">Fahasa</span>
          <ChevronDown size={14} className="text-white/60" />
        </button>
      </div>

      {/* ── Center: Main Nav ──────────────────────────────────── */}
      <nav className="flex-1 flex items-center justify-center gap-1">
        {mainNavItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150',
              active
                ? 'bg-[#2b3354] text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            )}
          >
            {Icon && <Icon size={15} className="shrink-0" />}
            {label}
          </button>
        ))}
      </nav>

      {/* ── Right: Utility Bar ────────────────────────────────── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Settings */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all">
          <Settings size={16} />
        </button>

        {/* Apps — with red dot badge */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all relative">
          <LayoutGrid size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#BF3003]" />
        </button>

        {/* Package */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all">
          <Package size={16} />
        </button>

        {/* Bell — with count badge */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all relative">
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 bg-[#dc2626] text-white text-[10px] font-bold px-1 py-0.5 rounded-full min-w-[18px] text-center">
            2469
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/20" />

        {/* User avatar */}
        <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center">
              <span className="text-white text-xs font-bold">TT</span>
            </div>
            {/* Vietnamese flag badge */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3 rounded-full bg-white shadow-sm overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 16 10" className="w-full h-full">
                <rect width="16" height="10" fill="#da251d" />
                <polygon points="8,1.5 9.2,4.5 12.3,4.8 10,6.8 10.6,9.8 8,8.3 5.4,9.8 6,6.8 3.7,4.8 6.8,4.5" fill="#FFFF00" />
              </svg>
            </div>
          </div>
          <ChevronDown size={14} className="text-white/60" />
        </button>
      </div>
    </header>
  );
}
