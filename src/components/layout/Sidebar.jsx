import { NavLink } from 'react-router-dom';
import { LayoutGrid, Sparkles, Zap, BarChart2, TrendingUp, Stethoscope, LayoutDashboard } from 'lucide-react';
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
    to: '/insight/overview',
    label: 'Tổng Quan',
    icon: LayoutDashboard,
    badge: 'NEW',
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
  {
    to: '/insight/ai-insight-v3',
    label: 'AI Insight V3',
    icon: Sparkles,
    badge: 'NEW',
  },
];

export function Sidebar() {
  return (
    <aside className="w-52 bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5] flex flex-col border-r border-[rgba(26,33,56,0.08)]">
      {/* Logo */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-sm bg-[#1A2138] flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <div>
            <div className="font-semibold text-sm text-[#1A2138] leading-tight">AI Insight</div>
            <div className="text-[10px] text-[#1A2138] leading-tight opacity-50">Multi-Channel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-4 flex flex-col gap-0.5">
        <div className="text-[10px] font-semibold text-[#1A2138] uppercase tracking-widest px-3 py-2 opacity-40">
          Menu
        </div>
        {navItems.map(({ to, label, icon: Icon, exact, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[rgba(26,33,56,0.06)] text-[#BF3003]'
                  : 'text-[#1A2138] opacity-60 hover:opacity-100 hover:bg-[rgba(26,33,56,0.04)]'
              )
            }
          >
            <Icon size={16} className="shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#BF3003] text-white">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-5 py-4 border-t border-[rgba(26,33,56,0.08)]">
        <div className="text-[10px] text-[#1A2138] opacity-40 leading-relaxed">
          Module Insight Ads
          <br />
          v1.0 — Demo
        </div>
      </div>
    </aside>
  );
}
