import { cn } from '../../lib/utils';

/**
 * Input — Editorial Precision Design System
 *
 * Track: surface_container_high (no border)
 * Focus:  surface_container_highest + 2px tertiary bottom-border only
 *         (No outline ring — use bottom-border for editorial feel)
 * Ghost border fallback for accessibility needs.
 */
export function Input({
  label,
  error,
  className,
  containerClassName,
  ...props
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-label-sm text-on-surface-variant">
          {label}
        </label>
      )}
      <input
        className={cn(
          // Editorial: no borders, tonal track
          'w-full px-4 py-2.5 text-sm bg-surface-container-high rounded-[--radius-md]',
          // Ghost border fallback
          'border border-transparent',
          // Text
          'text-on-surface placeholder:text-on-surface-variant/50',
          // Focus: bottom-border only (2px tertiary, no ring)
          'focus:outline-none',
          'focus:bg-surface-container-highest',
          'focus:border-b-2 focus:border-tertiary',
          // Transition
          'transition-colors duration-150',
          // Error
          error && 'bg-error-container focus:bg-error-container focus:border-b-2 focus:border-error',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-label-sm text-error">{error}</p>
      )}
    </div>
  );
}

export function Select({
  label,
  error,
  children,
  className,
  containerClassName,
  ...props
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-label-sm text-on-surface-variant">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full px-4 py-2.5 text-sm bg-surface-container-high rounded-[--radius-md]',
          'border border-transparent',
          'text-on-surface',
          // Focus: bottom-border only
          'focus:outline-none',
          'focus:bg-surface-container-highest',
          'focus:border-b-2 focus:border-tertiary',
          'transition-colors duration-150 cursor-pointer',
          error && 'bg-error-container focus:bg-error-container focus:border-b-2 focus:border-error',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-label-sm text-error">{error}</p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  error,
  className,
  containerClassName,
  ...props
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-label-sm text-on-surface-variant">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-4 py-3 text-sm bg-surface-container-high rounded-[--radius-md]',
          'border border-transparent',
          'text-on-surface placeholder:text-on-surface-variant/50',
          'focus:outline-none',
          'focus:bg-surface-container-highest',
          'focus:border-b-2 focus:border-tertiary',
          'transition-colors duration-150 resize-none',
          'min-h-[80px]',
          error && 'bg-error-container focus:bg-error-container focus:border-b-2 focus:border-error',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-label-sm text-error">{error}</p>
      )}
    </div>
  );
}
