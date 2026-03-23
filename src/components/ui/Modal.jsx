import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Modal({ isOpen, onClose, children, className, maxWidth = 'lg' }) {
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-surface/20 glass"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className={cn(
          'relative w-full bg-surface-container-lowest/95 glass rounded-[--radius-md] shadow-modal max-h-[90vh] flex flex-col',
          widths[maxWidth],
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
