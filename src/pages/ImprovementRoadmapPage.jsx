import { useEffect, useState } from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ImprovementRoadmapContent } from '../components/medical/ImprovementRoadmapContent';

const ROADMAP_STATE_KEY = 'roadmap-state';

export default function ImprovementRoadmapPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ROADMAP_STATE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData(parsed);
      }
    } catch {
      // ignore parse errors
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-body-md text-on-surface-variant">Đang tải...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
        <span className="text-5xl">🗺️</span>
        <h2 className="text-heading-sm text-on-surface font-semibold">Không có dữ liệu</h2>
        <p className="text-body-md text-on-surface-variant text-center max-w-sm">
          Vui lòng vào <strong>Khám Bệnh Hội Thoại</strong> và nhấn "Lộ Trình Cải Thiện" để tạo lộ trình của bạn.
        </p>
        <Button variant="primary" onClick={() => window.location.href = '/insight/medical-checkup'}>
          Đi đến Khám Bệnh
        </Button>
      </div>
    );
  }

  const { diseases, conversations, config } = data;

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* ── Page Header ── */}
      <div className="sticky top-0 z-10 bg-surface border-b border-outline-variant px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="gap-1.5"
          >
            <ArrowLeft size={14} />
            Quay lại
          </Button>
          <div className="w-px h-4 bg-[var(--color-outline-variant)]" />
          <div>
            <h1 className="text-heading-xs font-semibold text-on-surface">
              Lộ Trình Cải Thiện Sức Khỏe Hội Thoại
            </h1>
            <p className="text-label-sm text-on-surface-variant">
              Danh sách checklist chi tiết để cải thiện các chỉ số
            </p>
          </div>
        </div>
        <Button variant="tertiary" size="sm" onClick={handleExportPDF} className="gap-1.5">
          <Download size={14} />
          Xuất PDF
        </Button>
      </div>

      {/* ── Content ── */}
      <div className="p-6">
        <ImprovementRoadmapContent
          diseases={diseases}
          conversations={conversations}
          config={config}
        />
      </div>

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #root > div { visibility: visible; }
          #root > div > div:last-child { visibility: visible; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
