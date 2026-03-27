import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Tabs } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { OverviewCards } from '../components/insight/OverviewCards';
import { RevenueCards } from '../components/insight/RevenueCards';
import { ContributionChart } from '../components/insight/ContributionChart';
import { SourceChart } from '../components/insight/SourceChart';
import { CampaignSummaryTable } from '../components/insight/CampaignSummaryTable';
import { AIInsightPanel } from '../components/insight/AIInsightPanel';
import { DailyDetailChart } from '../components/insight/DailyDetailChart';
import { ExecutiveSummaryCard } from '../components/insight/ExecutiveSummaryCard';
import { PlatformROASCard } from '../components/insight/PlatformROASCard';
import { CostPerQualityLeadCard } from '../components/insight/CostPerQualityLeadCard';
import { RevenueSpendTrendChart } from '../components/insight/RevenueSpendTrendChart';
import { mockCampaigns, mockConversationTrend, mockOverviewStats, mockDailyBreakdown } from '../data/mockCampaigns';
import { mockAIInsights } from '../data/mockAIInsights';
import { mockExecutiveSummary } from '../data/mockExecutiveSummary';

const filterTabs = [
  { value: 'all', label: 'Tất cả' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'zalo', label: 'Zalo' },
  { value: 'active', label: 'Đang chạy' },
  { value: 'paused', label: 'Đã dừng' },
];

export default function AdsDashboard() {
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
        title="Dashboard Quảng Cáo AI"
        subtitle="Phân tích hiệu quả chiến dịch dựa trên chất lượng hội thoại"
      />

      <PageContainer className="pt-0">
        {/* Junk alert banner */}
        {junkCount > 0 && (
          <div className="flex items-center gap-3 p-4 bg-warning-container rounded-[--radius-md] mb-6">
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

        {/* Overview cards */}
        <OverviewCards stats={mockOverviewStats} />

        {/* Executive Summary — CEO 3-second scan */}
        <div className="mt-4">
          <ExecutiveSummaryCard summary={mockExecutiveSummary} />
        </div>

        {/* Revenue + Platform ROAS + Cost-per-Lead (3-column grid) */}
        <div className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RevenueCards stats={mockOverviewStats} />
            <PlatformROASCard campaigns={mockCampaigns} stats={mockOverviewStats} />
            <CostPerQualityLeadCard campaigns={mockCampaigns} stats={mockOverviewStats} />
          </div>
        </div>

        {/* Contribution chart */}
        <div className="mt-6 overflow-x-auto -mx-1 px-1">
          <ContributionChart campaigns={filtered} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-6 mb-6">
          <div className="lg:col-span-3">
            <RevenueSpendTrendChart dailyBreakdown={mockDailyBreakdown} />
          </div>
          <div className="lg:col-span-2">
            <SourceChart
              facebook={mockOverviewStats.facebookConversations}
              zalo={mockOverviewStats.zaloConversations}
            />
          </div>
        </div>

        {/* Campaign table section */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="font-display font-bold text-base text-on-surface">Chiến dịch</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {filtered.length} chiến dịch
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
            <CampaignSummaryTable
              campaigns={filtered}
              onSelectCampaign={setSelectedCampaign}
            />
          </Card>

          {/* Daily detail panel — slides in on row click */}
          {selectedCampaign && mockDailyBreakdown[selectedCampaign.id] && (
            <div className="mt-4 transition-all duration-200">
              <DailyDetailChart
                dailyData={mockDailyBreakdown[selectedCampaign.id]}
                campaignName={selectedCampaign.name}
              />
            </div>
          )}
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
