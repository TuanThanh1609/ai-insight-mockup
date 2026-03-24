import { cn } from '../../lib/utils';

/**
 * Button — Editorial Precision Design System
 *
 * Primary:  Coral (#fa6e5b) — The "Ultimate Action"
 * Tertiary: Vibrant Blue (tertiary) — Functional actions (Run Report)
 * Ghost:    No background, outline text — Secondary navigation
 * Primary-fixed: Dark navy on light bg — "Dark Mode" chip aesthetic
 *
 * Border radius: 8px (DEFAULT) — Curated identity
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
    'inline-flex items-center justify-center font-body font-medium transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    /**
     * Primary: Coral — The "Ultimate Action"
     * Reserved for the single most important CTA on screen.
     */
    primary:
      'bg-[#fa6e5b] text-white hover:brightness-110 active:brightness-95 rounded-[--radius-md] shadow-[--shadow-sm] hover:shadow-[--shadow-md]',

    /**
     * Tertiary: Vibrant Blue — Functional actions
     * Run Report, Apply Filters, Export Data
     */
    tertiary:
      'bg-tertiary text-on-tertiary hover:brightness-110 active:brightness-95 rounded-[--radius-md] shadow-[--shadow-sm] hover:shadow-[--shadow-md]',

    /**
     * Secondary: Deep Navy — High-authority navigation
     * Used for primary navigation elements and persistent CTAs.
     */
    secondary:
      'bg-primary text-on-primary hover:brightness-110 active:brightness-95 rounded-[--radius-md] shadow-[--shadow-sm] hover:shadow-[--shadow-md]',

    /**
     * Ghost: No background, outline text
     * Secondary navigation, dismissible actions.
     */
    ghost:
      'bg-transparent text-on-surface-variant hover:bg-surface-container-low active:bg-surface-container-lowest rounded-[--radius-md] border border-transparent',

    /**
     * Ghost-Outline: Ghost with ghost-border (accessibility)
     * Use when a container boundary is needed.
     */
    'ghost-outline':
      'bg-transparent text-on-surface-variant hover:bg-surface-container-low active:bg-surface-container-lowest rounded-[--radius-md] border border-[var(--color-outline-variant)]',

    /**
     * Danger: Error container for destructive actions
     */
    danger:
      'bg-error-container text-on-error-container hover:brightness-95 active:brightness-90 rounded-[--radius-md]',

    /**
     * AI Action: Vibrant Blue gradient — AI-powered recommendations
     */
    'ai-action':
      'bg-tertiary text-on-tertiary hover:brightness-110 active:brightness-95 rounded-[--radius-md] shadow-[--shadow-sm] hover:shadow-[--shadow-md] gap-1.5',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
    icon: 'p-2 rounded-[--radius-md]',
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
