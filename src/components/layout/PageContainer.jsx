import { cn } from '../../lib/utils';

export function PageContainer({ children, className, ...props }) {
  return (
    <main className={cn('flex-1 px-10 pb-10 bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5]', className)} {...props}>
      {children}
    </main>
  );
}
