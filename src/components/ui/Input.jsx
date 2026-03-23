import { cn } from '../../lib/utils';

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
        <label className="text-sm font-medium text-on-surface-variant">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest rounded-[--radius-md]',
          'border border-[var(--color-outline-variant)]',
          'text-on-surface placeholder:text-on-surface-variant/50',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
          'transition-colors duration-150',
          error && 'border-error-container focus:border-on-error-container focus:ring-error-container/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-on-error-container">{error}</p>
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
        <label className="text-sm font-medium text-on-surface-variant">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest rounded-[--radius-md]',
          'border border-[var(--color-outline-variant)]',
          'text-on-surface',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
          'transition-colors duration-150 cursor-pointer',
          error && 'border-error-container',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-xs text-on-error-container">{error}</p>
      )}
    </div>
  );
}
