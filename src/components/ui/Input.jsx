import { cn } from '../../lib/utils';

/**
 * Input — Ultra Soft Identity
 *
 * Track: gradient fill (warm white) — no border
 * Focus:  soft blue glow border (no bottom-border-only)
 * Radius: 10px (--radius-md)
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
          // Ultra soft: gradient track + soft border
          'w-full px-4 py-2.5 text-sm',
          'bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5]',
          'rounded-md',
          'border border-[rgba(26,33,56,0.08)]',
          // Text
          'text-on-surface placeholder:text-on-surface-variant/40',
          // Focus: soft blue glow ring
          'focus:outline-none',
          'focus:border-[rgba(0,82,255,0.35)]',
          'focus:shadow-[0_0_0_3px_rgba(0,82,255,0.12)]',
          // Transition
          'transition-all duration-150',
          // Error
          error && 'border-[rgba(186,26,26,0.35)] focus:border-[rgba(186,26,26,0.5)] focus:shadow-[0_0_0_3px_rgba(186,26,26,0.10)]',
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
          'w-full px-4 py-2.5 text-sm',
          'bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5]',
          'rounded-md',
          'border border-[rgba(26,33,56,0.08)]',
          'text-on-surface',
          // Focus: soft blue glow
          'focus:outline-none',
          'focus:border-[rgba(0,82,255,0.35)]',
          'focus:shadow-[0_0_0_3px_rgba(0,82,255,0.12)]',
          'transition-all duration-150',
          'cursor-pointer',
          error && 'border-[rgba(186,26,26,0.35)]',
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
          'w-full px-4 py-3 text-sm',
          'bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5]',
          'rounded-md',
          'border border-[rgba(26,33,56,0.08)]',
          'text-on-surface placeholder:text-on-surface-variant/40',
          'focus:outline-none',
          'focus:border-[rgba(0,82,255,0.35)]',
          'focus:shadow-[0_0_0_3px_rgba(0,82,255,0.12)]',
          'transition-all duration-150',
          'resize-none min-h-[80px]',
          error && 'border-[rgba(186,26,26,0.35)]',
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
