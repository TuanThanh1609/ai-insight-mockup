import { cn } from '../../lib/utils';

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
    primary:
      'bg-gradient-to-r from-primary to-primary-dim text-on-primary hover:brightness-110 active:brightness-95 rounded-[--radius-md] shadow-[0_2px_8px_rgba(0,72,226,0.25)] hover:shadow-[0_4px_16px_rgba(0,72,226,0.35)]',
    secondary:
      'bg-surface-container-high text-primary hover:bg-surface-container-low active:bg-surface-container-low rounded-[--radius-md]',
    ghost:
      'text-on-surface-variant hover:bg-surface-container-low active:bg-surface-container-lowest rounded-[--radius-md]',
    danger:
      'bg-error-container text-on-error-container hover:brightness-95 active:brightness-90 rounded-[--radius-md]',
    'ai-action':
      'bg-gradient-to-r from-primary to-primary-container text-on-primary hover:brightness-110 active:brightness-95 rounded-[--radius-md] shadow-[0_2px_8px_rgba(0,72,226,0.25)] hover:shadow-[0_4px_16px_rgba(0,72,226,0.35)] gap-1.5',
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
