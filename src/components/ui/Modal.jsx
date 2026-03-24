import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Modal — Editorial Precision Design System
 *
 * Glassmorphism Formula:
 *   surface_container_lowest at 80% opacity + backdrop-blur: 12px
 *
 * Shadow: Ambient shadow (tinted, not black)
 * Border radius: 8px (DEFAULT)
 *
 * Ghost border: use when accessibility demands a boundary.
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
        className="absolute inset-0 bg-on-surface/20 glass"
        onClick={onClose}
      />
      {/* Modal — glass + ambient shadow */}
      <div
        className={cn(
          // Glassmorphism formula
          'relative w-full bg-surface-container-lowest/80 glass',
          // Border radius
          'rounded-[--radius-md]',
          // Ambient shadow
          'shadow-[--shadow-xl]',
          // Size
          'max-h-[90vh] flex flex-col',
          widths[maxWidth],
          // Ghost border fallback
          ghostBorder && 'border border-[var(--color-outline-variant)]',
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-[--radius-md] text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer z-10"
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
