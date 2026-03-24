import { NavLink } from 'react-router-dom';
import { LayoutGrid, Sparkles, Zap, BarChart2, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Sidebar — Editorial Precision Design System
 *
 * Background: primary (Deep Navy) — high-authority navigation surface
 * Ghost border: No 1px solid dividers; use tonal transitions
 * Border radius: 8px (DEFAULT)
 * Logo: gradient-signature texture
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
    <aside className="w-60 bg-primary h-screen sticky top-0 flex flex-col">
      {/* Logo — gradient-signature texture */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2.5">
          {/* Deep Navy Logo Mark with Vibrant Blue accent */}
          <div className="w-8 h-8 rounded-[--radius-md] gradient-signature flex items-center justify-center shadow-[--shadow-md]">
            <Zap size={16} className="text-tertiary" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-on-primary leading-tight">AI Insight</div>
            <div className="text-[10px] text-on-primary-container leading-tight opacity-70">Multi-Channel</div>
          </div>
        </div>
      </div>

      {/* Nav — ghost borders only where needed */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        <div className="text-[10px] font-semibold text-on-primary-container uppercase tracking-widest px-3 py-3 opacity-60">
          Menu
        </div>
        {navItems.map(({ to, label, icon: Icon, exact, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              cn(
                // Base: 8px radius, tonal shift
                'flex items-center gap-3 px-3 py-2.5 rounded-[--radius-md] text-sm font-medium transition-all duration-150',
                // Active: Deep Navy surface, elevated
                isActive
                  ? 'bg-primary-container text-on-primary-container shadow-[--shadow-md]'
                  // Inactive: ghost — no background, subtle hover
                  : 'text-on-primary opacity-75 hover:opacity-100 hover:bg-primary-fixed-dim'
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-secondary text-on-secondary">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom — ghost border top via tonal shift */}
      <div className="px-6 py-5 border-t border-white/10">
        <div className="text-[11px] text-on-primary opacity-50 leading-relaxed">
          Module Insight Ads
          <br />
          v1.0 — Demo
        </div>
      </div>
    </aside>
  );
}
