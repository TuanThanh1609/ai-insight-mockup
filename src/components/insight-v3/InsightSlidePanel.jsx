import { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Slide-in panel từ bên phải
 * - Open: translateX(0), backdrop visible
 * - Close: translateX(100%), backdrop hidden
 * - transition: transform 300ms ease
 *
 * Design: Ultra Soft Identity — Editorial Precision
 * - Rounded 18px (--radius-xl) theo DESIGN.md
 * - No-line rule: gradient fill thay vì solid border
 * - Ambient soft shadow: 24-48px blur, 3-6% opacity, tinted
 * - Glass backdrop: backdrop-blur 12px
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
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = prev
      }
    }
  }, [isOpen])

  return (
    <>
      {/* UX: Doherty Threshold — immediate visual feedback on open/close */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{
          backgroundColor: 'rgba(26, 33, 56, 0.18)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* UX: No-line rule — gradient fill + ambient shadow thay border. Rounded 18px. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="insight-panel-title"
        className={`fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          width: '720px',
          maxWidth: '90vw',
          background: 'linear-gradient(180deg, #ffffff 0%, #f5f1f5 100%)',
          boxShadow: '-4px 0 32px rgba(26, 33, 56, 0.08), -2px 0 8px rgba(0, 82, 255, 0.04)',
          borderRadius: '18px 0 0 18px',
        }}
      >
        {/* Header — no border, tonal shift */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f8f4f9 100%)',
            borderBottom: '1px solid rgba(194, 198, 214, 0.12)',
          }}
        >
          <h2
            id="insight-panel-title"
            className="text-base font-semibold"
            style={{ color: '#1A2138', fontFamily: 'Manrope, Inter, sans-serif' }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Đóng panel"
            className="p-1.5 rounded-lg transition-all duration-150 cursor-pointer"
            style={{ color: '#424754', backgroundColor: 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(194, 198, 214, 0.12)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5" style={{ background: 'linear-gradient(180deg, #f5f1f5 0%, #f8f4f9 100%)' }}>
          {children}
        </div>
      </div>
    </>
  )
}
