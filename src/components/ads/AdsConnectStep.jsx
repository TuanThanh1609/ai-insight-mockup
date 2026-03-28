import { useState } from 'react';
import { Button } from '../ui/Button';

/**
 * Step 1 — Kết nối Ads Account (Mockup UI)
 * Props: onNext — called after 2-3s loading animation
 */
export function AdsConnectStep({ onNext }) {
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      onNext?.();
    }, 2400);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-headline-md text-on-surface font-bold mb-2">
          Kết nối tài khoản Quảng cáo
        </h2>
        <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
          Chọn nền tảng quảng cáo bạn đang sử dụng để bắt đầu phân tích chiến dịch.
        </p>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Meta Ads — Facebook + Instagram */}
        <div className="
          bg-surface-container-lowest rounded-[--radius-lg] p-6
          shadow-[--shadow-sm] flex flex-col items-center text-center gap-4
        ">
          {/* Meta logo */}
          <div className="w-14 h-14 rounded-full bg-[#1877f2]/10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#1877f2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <div>
            <div className="text-title-sm font-semibold text-on-surface mb-1">Meta Ads</div>
            <div className="text-body-sm text-on-surface-variant">Facebook + Instagram</div>
          </div>
          <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-[#1877f2]" />
            <span>Facebook</span>
            <span className="text-[var(--color-outline-variant)]">·</span>
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />
            <span>Instagram</span>
          </div>
        </div>

        {/* Google Ads — Search + Display */}
        <div className="
          bg-surface-container-lowest rounded-[--radius-lg] p-6
          shadow-[--shadow-sm] flex flex-col items-center text-center gap-4
        ">
          {/* Google logo */}
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
            <svg width="32" height="32" viewBox="0 0 48 48" className="shrink-0">
              <path fill="#4285F4" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 35.7 24 35.7c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 8.1 29 5.7 24 5.7 11.3 5.7 0.7 16.3 0.7 29s10.6 23.3 23.3 23.3c12.6 0 23.3-10.6 23.3-23.3 0-1.5-.1-3-.4-4.4z"/>
              <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.1 7.9 3l6-6C35.4 7.3 30 5.7 24 5.7c-9.9 0-18.2 7-20.6 16.4z"/>
              <path fill="#FBBC05" d="M24 45.3c5 0 9.4-1.7 12.6-4.5l-6-5.3C28.8 37.6 26.5 38.5 24 38.5c-5.2 0-9.6-3.5-11.2-8.4l-6.5 5C9.4 40.3 16.2 45.3 24 45.3z"/>
              <path fill="#EA4335" d="M43.6 6.6H42V20H24v8h11.3c-.9 2.4-3.1 4.4-5.7 5.4l6 5.3C38.4 39.9 46.3 34.7 46.3 24c0-1.5-.1-3-.4-4.4h-2.3z"/>
            </svg>
          </div>
          <div>
            <div className="text-title-sm font-semibold text-on-surface mb-1">Google Ads</div>
            <div className="text-body-sm text-on-surface-variant">Search + Display</div>
          </div>
          <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span>Search</span>
            <span className="text-[var(--color-outline-variant)]">·</span>
            <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
            <span>Display</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-tertiary/20 border-t-tertiary rounded-full animate-spin" />
          <p className="text-body-sm text-on-surface-variant">Đang kết nối tài khoản...</p>
        </div>
      ) : (
        <Button
          variant="primary"
          size="lg"
          onClick={handleConnect}
          className="w-full gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          Kết nối Tài khoản Ads
        </Button>
      )}

      {/* Disclaimer */}
      <div className="mt-4 flex items-start gap-2 text-body-sm text-on-surface-variant/60">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 mt-0.5">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-.75 4.25v4.5h1.5v-4.5H11.25zm0 8v-2.25h1.5V14.25H11.25z"/>
        </svg>
        <span>Mockup — chưa kết nối thật với Meta hoặc Google. Dữ liệu chiến dịch sử dụng dữ liệu mẫu.</span>
      </div>
    </div>
  );
}
