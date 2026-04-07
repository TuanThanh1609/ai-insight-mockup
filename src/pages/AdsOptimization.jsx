import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Tabs } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CampaignOptimizationTable } from '../components/insight/CampaignOptimizationTable';
import { AIInsightPanel } from '../components/insight/AIInsightPanel';
import { ExecutiveSummaryCard } from '../components/insight/ExecutiveSummaryCard';
import { mockCampaigns, mockOverviewStats } from '../data/mockCampaigns';
import { mockAIInsights } from '../data/mockAIInsights';
import { mockExecutiveSummary } from '../data/mockExecutiveSummary';

const filterTabs = [
  { value: 'all', label: 'Tất cả' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'zalo', label: 'Zalo' },
  { value: 'active', label: 'Đang chạy' },
  { value: 'paused', label: 'Đã dừng' },
];

export default function AdsOptimization() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const filtered = mockCampaigns.filter((camp) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'facebook') return camp.platform === 'facebook';
    if (activeFilter === 'zalo') return camp.platform === 'zalo';
    if (activeFilter === 'active') return camp.status === 'active';
    if (activeFilter === 'paused') return camp.status === 'paused';
    return true;
  });

  const junkCount = mockCampaigns.filter(
    (c) => c.aiAction === 'decrease' || c.aiAction === 'pause'
  ).length;

  const selectedInsight = selectedCampaign ? mockAIInsights[selectedCampaign.id] : null;

  return (
    <>
      <Header
        title="Gợi ý Tối ưu Ads"
        subtitle="AI phân tích và đề xuất hành động cho từng chiến dịch"
      />

      <PageContainer className="pt-0">
        {/* Junk alert banner */}
        {junkCount > 0 && (
          <div className="flex items-center gap-3 p-4 bg-warning-container rounded-md mb-6">
            <div className="p-1.5 rounded-full bg-on-warning-container/10">
              <AlertTriangle size={16} className="text-on-warning-container" />
            </div>
            <p className="text-sm font-medium text-on-warning-container flex-1">
              <span className="font-bold">{junkCount} chiến dịch rác</span> được AI phát hiện và đề xuất tắt/giảm ngân sách.
            </p>
            <Button variant="ghost" size="sm" className="text-on-warning-container hover:bg-on-warning-container/10 shrink-0">
              Xem chi tiết
            </Button>
          </div>
        )}

        {/* Executive Summary — AI action items */}
        <div className="mt-4">
          <ExecutiveSummaryCard summary={mockExecutiveSummary} />
        </div>

        {/* Campaign optimization table */}
        <div className="mt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="font-display font-bold text-base text-on-surface">Gợi ý tối ưu</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {filtered.length} chiến dịch — sắp xếp theo mức ưu tiên
              </p>
            </div>
            <Tabs
              tabs={filterTabs}
              activeTab={activeFilter}
              onChange={setActiveFilter}
              className="w-auto"
            />
          </div>

          {/* Table */}
          <Card className="p-4">
            <CampaignOptimizationTable
              campaigns={filtered}
              onSelectCampaign={setSelectedCampaign}
            />
          </Card>
        </div>
      </PageContainer>

      {/* AI Insight Panel */}
      <AIInsightPanel
        campaign={selectedCampaign}
        insight={selectedInsight}
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
      />
    </>
  );
}
