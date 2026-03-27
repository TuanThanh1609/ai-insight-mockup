import { useState } from 'react';
import { Button } from '../ui/Button';

/**
 * Step 1 — Kết nối Fanpage (Mockup UI)
 * Behavior: Click button → 2-3s loading → auto-advance
 */
export function FanpageConnectStep({ onNext }) {
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      onNext();
    }, 2200);
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Glass Card — Mockup Fanpage Connect */}
      <div className="glass rounded-[--radius-xl] shadow-[--shadow-glass] p-10 text-center">
        {/* FB Icon */}
        <div className="w-16 h-16 rounded-full bg-[#1877f2]/10 flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#1877f2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>

        <h2 className="text-headline-md text-on-surface font-bold mb-2">
          Kết nối Fanpage của bạn
        </h2>
        <p className="text-body-md text-on-surface-variant mb-8 max-w-sm mx-auto leading-relaxed">
          Nhấn "Kết nối" để bắt đầu phân tích hội thoại từ các trang mạng xã hội. Dữ liệu được bảo mật và chỉ phục vụ mục đích phân tích.
        </p>

        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
            <p className="text-body-sm text-on-surface-variant">Đang kết nối...</p>
          </div>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={handleConnect}
            className="gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 7h7a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-7m0-8H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9m0-18v18"/>
            </svg>
            Kết nối Fanpage
          </Button>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-4 flex items-start gap-2 text-body-sm text-on-surface-variant/60">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 mt-0.5">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.75-4.25v-4.5h1.5v4.5h-1.5zM12 7a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 12 7z"/>
        </svg>
        <span>Hiện tại đây là mockup — chưa kết nối Fanpage thật. Toàn bộ dữ liệu phân tích sử dụng dữ liệu mẫu từ Smax.</span>
      </div>
    </div>
  );
}
