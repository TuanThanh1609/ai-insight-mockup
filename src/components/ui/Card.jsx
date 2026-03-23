import { cn } from '../../lib/utils';

export function Card({
  children,
  className,
  hover = false,
  onClick,
  ...props
}) {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-[--radius-md] transition-colors duration-150',
        hover && 'cursor-pointer hover:bg-surface-container-low',
        onClick && 'cursor-pointer',
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
    <div className={cn('px-5 pt-5 pb-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className, ...props }) {
  return (
    <div className={cn('px-5 py-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn('px-5 pb-5 pt-0', className)} {...props}>
      {children}
    </div>
  );
}
