import { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Slide-in panel từ bên phải
 * - Open: translateX(0), backdrop visible
 * - Close: translateX(100%), backdrop hidden
 * - transition: transform 300ms ease
 */
export function InsightSlidePanel({ isOpen, onClose, title, children }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll when open — track previous overflow to avoid race conditions
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      // Only restore if we own the lock (no other component overwrote it)
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = prev
      }
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Slide panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="insight-panel-title"
        className={`fixed top-0 right-0 h-full w-full max-w-[560px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c2c6d6]/15 shrink-0">
          <h2 id="insight-panel-title" className="text-lg font-semibold text-[#191c1e]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Đóng panel"
            className="p-1.5 hover:bg-[#f2f4f6] rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-[#424754]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </>
  )
}
