import { cn } from '../../lib/utils';

/**
 * Card — Ultra Soft Identity
 *
 * NO BORDERS. Gradient fills + ambient soft shadow.
 * Hover: scale(1.015) + card shadow lift — alive feel
 * Active: scale(0.99) — gentle press
 *
 * Radius: 14px (--radius-lg) for cards
 */
export function Card({
  children,
  className,
  hover = false,
  elevated = false,
  ghostBorder = false,
  onClick,
  ...props
}) {
  return (
    <div
      className={cn(
        // Ultra soft base: gradient fill + soft shadow
        'bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5]',
        'rounded-lg',
        'shadow-[--shadow-sm]',
        // Hover: lift + glow
        hover && 'cursor-pointer hover-lift',
        onClick && 'cursor-pointer',
        // Floating elevation (e.g., primary action menus)
        elevated && 'shadow-[--shadow-lg]',
        // Ghost border fallback (accessibility)
        ghostBorder && 'border border-[var(--color-outline-variant)]',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('px-6 pt-6 pb-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn('px-6 pb-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}
