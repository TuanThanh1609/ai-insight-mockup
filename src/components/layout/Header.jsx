import { Bell, User } from 'lucide-react';
import { Button } from '../ui/Button';

export function Header({ userName = 'Tuấn', title, subtitle, actions }) {
  return (
    <header className="flex items-center justify-between px-10 py-6">
      <div>
        {subtitle && (
          <p className="text-xs font-medium text-on-surface-variant mb-0.5">{subtitle}</p>
        )}
        <h1 className="font-display font-bold text-2xl text-on-surface">
          {title || 'Dashboard'}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <Button variant="ghost" size="icon" aria-label="Thông báo">
          <Bell size={18} />
        </Button>
        <button className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center text-white text-sm font-bold shadow-[0_2px_8px_rgba(0,72,226,0.25)]">
          {userName[0]}
        </button>
      </div>
    </header>
  );
}
