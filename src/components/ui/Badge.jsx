import { cn } from '../../lib/utils';

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
    success: 'bg-tertiary-container text-on-tertiary-container',
    warning: 'bg-warning-container text-on-warning-container',
    danger: 'bg-error-container text-on-error-container',
    info: 'bg-primary/10 text-primary',
    default: 'bg-surface-container-high text-on-surface-variant',
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
