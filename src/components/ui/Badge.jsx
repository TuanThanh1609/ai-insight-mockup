import { cn } from '../../lib/utils';

/**
 * Badge — Ultra Soft Identity
 *
 * Border radius: pill (9999px) — soft rounded chips
 * Labels: All-caps with letter-spacing for premium look
 */
export function Badge({
  children,
  variant = 'default',
  platform,
  size = 'md',
  className,
  ...props
}) {
  const base = 'inline-flex items-center font-body font-medium rounded-full';

  const platformColors = {
    facebook: 'bg-[rgba(24,119,242,0.10)] text-[#1877f2]',
    zalo: 'bg-[rgba(0,104,255,0.10)] text-[#0068ff]',
  };

  const statusColors = {
    /** Good — scale được */
    success: 'bg-[rgba(5,150,105,0.10)] text-[#059669]',
    /** Cải thiện — theo dõi */
    warning: 'bg-[rgba(217,119,6,0.10)] text-[#d97706]',
    /** Thấp — cần xem xét */
    danger: 'bg-[rgba(220,38,38,0.10)] text-[#dc2626]',
    /** Info / Vibrant Blue */
    info: 'bg-[rgba(0,82,255,0.10)] text-[#0052FF]',
    tertiary: 'bg-[rgba(0,82,255,0.10)] text-[#0052FF]',
    /** Deep Rust */
    secondary: 'bg-[rgba(191,48,3,0.10)] text-[#BF3003]',
    /** Default neutral */
    default: 'bg-[rgba(73,69,79,0.08)] text-[var(--color-on-surface-variant)]',
    /** Dark Mode chip */
    'primary-fixed': 'bg-[#1A2138] text-white',
  };

  const colors = platform ? platformColors[platform] : statusColors[variant];

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5',
    md: 'text-[11px] px-3 py-0.5',
    lg: 'text-[12px] px-3.5 py-1',
  };

  return (
    <span className={cn(base, colors, sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
