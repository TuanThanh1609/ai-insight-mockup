import { NavLink } from 'react-router-dom';
import { LayoutGrid, Sparkles, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  {
    to: '/insight/settings',
    label: 'Cài đặt Insight',
    icon: LayoutGrid,
    exact: true,
  },
  {
    to: '/insight/dashboard',
    label: 'Dashboard Ads',
    icon: Sparkles,
    badge: 'AI',
  },
];

export function Sidebar() {
  return (
    <aside className="w-60 bg-surface-container-low h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[--radius-sm] bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center shadow-[0_2px_8px_rgba(0,72,226,0.3)]">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-on-surface leading-tight">AI Insight</div>
            <div className="text-[10px] text-on-surface-variant leading-tight">Multi-Channel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        <div className="text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-wider px-3 py-2">
          Menu
        </div>
        {navItems.map(({ to, label, icon: Icon, exact, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[--radius-md] text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-surface-container-lowest text-on-surface shadow-[0_1px_3px_rgba(44,52,55,0.06)]'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-6 py-5">
        <div className="text-[11px] text-on-surface-variant/60 leading-relaxed">
          Module Insight Ads
          <br />
          v1.0 — Demo
        </div>
      </div>
    </aside>
  );
}
