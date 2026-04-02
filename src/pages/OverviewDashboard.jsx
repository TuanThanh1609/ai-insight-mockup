import { useMemo } from 'react';
import KpiStrip from '../components/overview/KpiStrip';
import ChartsSection from '../components/overview/ChartsSection';
import AlertsPanel from '../components/overview/AlertsPanel';
import PillarConversation from '../components/overview/PillarConversation';
import PillarStaffEval from '../components/overview/PillarStaffEval';
import PillarPostPurchase from '../components/overview/PillarPostPurchase';
import PillarFeedback from '../components/overview/PillarFeedback';
import { loadConversations, computeDiagnosis } from '../lib/medicalService';

export default function OverviewDashboard() {
  // Load data once — shared across all child components
  const allConversations = loadConversations();

  // 7-day filter
  const now = new Date();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const convs7d = allConversations.filter((c) => {
    if (!c.created_at) return true;
    const d = new Date(c.created_at);
    return d >= sevenDaysAgo && d <= now;
  });
  const conversations = convs7d.length > 0 ? convs7d : allConversations;

  // Diseases for CriticalAlertsPanel
  const diseases = useMemo(
    () => computeDiagnosis(conversations, 'thoi-trang', []),
    [conversations]
  );

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg font-bold text-primary">Tổng Quan</h1>
          <p className="text-body-sm text-[#1A2138] opacity-50 mt-0.5">
            Tổng hợp toàn bộ dữ liệu Hội Thoại · Quảng cáo · Doanh thu
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[#1A2138] opacity-40 uppercase tracking-wider">
          7 ngày gần nhất
        </span>
      </div>

      {/* Hàng 1: KPI Strip */}
      <KpiStrip conversations={conversations} />

      {/* Hàng 2: Charts (80%) + Alerts (20%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-4">
          <ChartsSection conversations={conversations} />
        </div>
        <div className="lg:col-span-1">
          <AlertsPanel conversations={conversations} diseases={diseases} industry="thoi-trang" />
        </div>
      </div>

      {/* Hàng 3: 4 Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <PillarConversation conversations={conversations} />
        <PillarStaffEval conversations={conversations} />
        <PillarPostPurchase conversations={conversations} />
        <PillarFeedback conversations={conversations} />
      </div>
    </div>
  );
}
