import { cn } from '../../lib/utils';

/**
 * Card — Editorial Precision Design System
 *
 * NO BORDERS. Boundaries via background shifts.
 * Lift effect: surface_container_lowest on surface_container
 * Border radius: 8px (DEFAULT)
 *
 * Elevation: Ambient shadows (tinted, not black) for floating effects.
 * Ghost border: use when accessibility demands a boundary.
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
        // Base: lift layer
        'bg-surface-container-lowest rounded-[--radius-md]',
        // Hover: tonal shift
        hover && 'cursor-pointer hover:bg-surface-container-low',
        // Clickable
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
