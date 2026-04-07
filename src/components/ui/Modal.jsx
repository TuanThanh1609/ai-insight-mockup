import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Modal — Ultra Soft Identity
 *
 * Glassmorphism: surface_container_lowest at 82% opacity + backdrop-blur: 16px
 * Shadow: Ambient soft shadow
 * Border radius: 18px (--radius-xl) — large, soft, premium
 * Close button: soft hover (scale + bg tint)
 */
export function Modal({ isOpen, onClose, children, className, maxWidth = 'lg', ghostBorder = false }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const widths = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassmorphism Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(26,33,56,0.25)] glass"
        onClick={onClose}
      />
      {/* Modal — ultra soft glass + ambient shadow */}
      <div
        className={cn(
          // Glassmorphism formula (slightly more opaque for softness)
          'relative w-full bg-gradient-to-br from-white/90 via-white/85 to-[#faf7fc]/90 glass',
          // Border radius: 18px — ultra soft
          'rounded-xl',
          // Subtle border
          'border border-[rgba(255,255,255,0.5)]',
          // Soft ambient shadow
          'shadow-[--shadow-xl]',
          // Size
          'max-h-[90vh] flex flex-col',
          widths[maxWidth],
          className
        )}
      >
        <button
          onClick={onClose}
          className={cn(
            'absolute top-4 right-4 p-2',
            'text-[var(--color-on-surface-variant)]',
            'hover:bg-[rgba(26,33,56,0.06)]',
            'active:bg-[rgba(26,33,56,0.10)]',
            'rounded-md',
            'transition-all duration-150 cursor-pointer',
            'flex items-center justify-center'
          )}
          aria-label="Đóng"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children, className, ...props }) {
  return (
    <div className={cn('px-8 pt-8 pb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function ModalBody({ children, className, ...props }) {
  return (
    <div className={cn('px-8 pb-6 overflow-y-auto flex-1', className)} {...props}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className, ...props }) {
  return (
    <div className={cn('px-8 pb-6 pt-0 flex items-center justify-end gap-3', className)} {...props}>
      {children}
    </div>
  );
}
