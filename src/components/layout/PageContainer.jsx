import { cn } from '../../lib/utils';

export function PageContainer({ children, className, ...props }) {
  return (
    <main className={cn('flex-1 px-10 pb-10', className)} {...props}>
      {children}
    </main>
  );
}
