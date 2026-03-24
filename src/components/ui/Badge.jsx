import { cn } from '../../lib/utils';

/**
 * Badge — Editorial Precision Design System
 *
 * primary-fixed variant: "Dark Mode" chip within a light layout.
 * Labels should be on_primary_fixed.
 *
 * Border radius: full (pill) — Premium, architectural look
 */
export function Badge({
  children,
  variant = 'default',
  platform,
  size = 'md',
  className,
  ...props
}) {
  const base = 'inline-flex items-center font-body font-medium rounded-[--radius-full]';

  const platformColors = {
    facebook: 'bg-facebook/10 text-facebook',
    zalo: 'bg-zalo/10 text-zalo',
  };

  const statusColors = {
    /** Good — scale được */
    success: 'bg-success-container text-on-success-container',
    /** Cải thiện — theo dõi */
    warning: 'bg-warning-container text-on-warning-container',
    /** Thấp — cần xem xét */
    danger: 'bg-error-container text-on-error-container',
    /** Info / Vibrant Blue — Digital Pulse */
    info: 'bg-tertiary-container text-on-tertiary-container',
    /** Vibrant Blue accent */
    tertiary: 'bg-tertiary-container text-on-tertiary-container',
    /** Deep Rust — Human Element (sparingly) */
    secondary: 'bg-secondary-container text-on-secondary-container',
    /** Default neutral */
    default: 'bg-surface-container-high text-on-surface-variant',
    /** Dark Mode chip within light layout */
    'primary-fixed': 'bg-primary-fixed text-on-primary-fixed',
  };

  const colors = platform ? platformColors[platform] : statusColors[variant];

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  return (
    <span className={cn(base, colors, sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
