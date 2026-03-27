import { NavLink } from 'react-router-dom';
import { LayoutGrid, Sparkles, Zap, BarChart2, TrendingUp, Stethoscope } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Sidebar — Editorial Precision Design System
 *
 * Background: white — clean, professional surface
 * Text: #1A2138 (Deep Navy) — brand authority
 * Active: Deep Rust (#BF3003) highlight — brand color
 * Border radius: 8px (DEFAULT)
 */
const navItems = [
  {
    to: '/insight/settings',
    label: 'Cài đặt Insight',
    icon: LayoutGrid,
    exact: true,
  },
  {
    to: '/insight/insight-dashboard',
    label: 'Dashboard Insight',
    icon: BarChart2,
    badge: 'AI',
  },
  {
    to: '/insight/medical-checkup',
    label: 'Khám Bệnh',
    icon: Stethoscope,
  },
  {
    to: '/insight/dashboard',
    label: 'Tổng quan Ads',
    icon: Sparkles,
  },
  {
    to: '/insight/ads-optimization',
    label: 'Gợi ý tối ưu Ads',
    icon: TrendingUp,
    badge: 'AI',
  },
];

export function Sidebar() {
  return (
    <aside className="w-60 bg-white h-screen sticky top-0 flex flex-col border-r border-[#e4dfe5]">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[--radius-md] bg-[#1A2138] flex items-center justify-center shadow-[--shadow-md]">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-[#1A2138] leading-tight">AI Insight</div>
            <div className="text-[10px] text-[#1A2138] leading-tight opacity-50">Multi-Channel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        <div className="text-[10px] font-semibold text-[#1A2138] uppercase tracking-widest px-3 py-3 opacity-40">
          Menu
        </div>
        {navItems.map(({ to, label, icon: Icon, exact, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[--radius-md] text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-red-50 text-[#BF3003] shadow-[--shadow-sm]'
                  : 'text-[#1A2138] opacity-70 hover:opacity-100 hover:bg-gray-50'
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#BF3003] text-white">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-6 py-5 border-t border-[#e4dfe5]">
        <div className="text-[11px] text-[#1A2138] opacity-40 leading-relaxed">
          Module Insight Ads
          <br />
          v1.0 — Demo
        </div>
      </div>
    </aside>
  );
}
