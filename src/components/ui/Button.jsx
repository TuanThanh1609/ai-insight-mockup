import { cn } from '../../lib/utils';

/**
 * Button — Ultra Soft Identity
 *
 * Border radius: 10px (--radius-md) — soft but not bubbly
 * Hover: scale(1.02) + brightness(1.05) + shadow lift — alive feel
 * Active: scale(0.97) — gentle press
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  onClick,
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-body font-medium cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed hover-btn';

  const variants = {
    /**
     * Primary: Deep Rust — The "Ultimate Action"
     * Hover: soft glow (rust) + scale + brightness
     */
    primary:
      'bg-[#BF3003] text-white rounded-md shadow-[--shadow-sm]',

    /**
     * Tertiary: Vibrant Blue — Functional actions
     * Run Report, Apply Filters, Export Data
     */
    tertiary:
      'bg-[#0052FF] text-white rounded-md shadow-[--shadow-sm]',

    /**
     * Secondary: Deep Navy — High-authority navigation
     */
    secondary:
      'bg-[#1A2138] text-white rounded-md shadow-[--shadow-sm]',

    /**
     * Ghost: No background, outline text
     */
    ghost:
      'bg-transparent text-on-surface-variant hover:bg-surface-container-low rounded-md border border-transparent',

    /**
     * Ghost-Outline: Ghost with ghost-border (accessibility)
     */
    'ghost-outline':
      'bg-transparent text-on-surface-variant hover:bg-surface-container-low rounded-md border border-[var(--color-outline-variant)]',

    /**
     * Danger: Error container
     */
    danger:
      'bg-[#ffdad6] text-[#ba1a1a] rounded-md',

    /**
     * AI Action: Vibrant Blue gradient
     */
    'ai-action':
      'bg-[#0052FF] text-white rounded-md shadow-[--shadow-sm] gap-1.5',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 gap-1.5 rounded-md',
    md: 'text-sm px-5 py-2.5 gap-2 rounded-md',
    lg: 'text-base px-7 py-3.5 gap-2 rounded-md',
    icon: 'p-2.5 rounded-md',
  };

  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
