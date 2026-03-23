import { useState, useEffect, createContext, useContext } from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

function Toast({ message, type, onClose }) {
  const icons = {
    success: <CheckCircle2 size={18} className="text-on-tertiary-container shrink-0" />,
    error: <AlertCircle size={18} className="text-on-error-container shrink-0" />,
    info: <Info size={18} className="text-primary shrink-0" />,
  };

  const bgColors = {
    success: 'bg-tertiary-container',
    error: 'bg-error-container',
    info: 'bg-primary/10',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-[--radius-md] shadow-[0_4px_20px_rgba(44,52,55,0.12)] pointer-events-auto max-w-sm',
        bgColors[type]
      )}
    >
      {icons[type]}
      <span className="text-sm font-medium text-on-surface flex-1">{message}</span>
      <button
        onClick={onClose}
        className="p-0.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
      >
        <X size={14} className="text-on-surface-variant" />
      </button>
    </div>
  );
}
