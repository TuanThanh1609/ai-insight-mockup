import { Header } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { InsightSummaryCards } from '../components/insight/InsightSummaryCards';
import { InsightQualityTrendChart } from '../components/insight/InsightQualityTrendChart';
import { EvaluationResultsTable } from '../components/insight/EvaluationResultsTable';
import {
  mockDashboardStats,
  mockQualityTrend,
  mockEvaluationResults,
  mockRunHistory,
} from '../data/mockInsightDashboard';

export default function InsightDashboard() {
  return (
    <>
      <Header
        title="Dashboard Insight"
        subtitle="Chat Quality Agent — Đánh giá chất lượng tư vấn AI"
      />

      <PageContainer className="pt-0">
        {/* Summary cards */}
        <InsightSummaryCards stats={mockDashboardStats} />

        {/* Quality trend chart */}
        <div className="mt-6">
          <InsightQualityTrendChart data={mockQualityTrend} />
        </div>

        {/* Evaluation results section */}
        <div className="mt-6">
          <div className="mb-4">
            <h2 className="font-display font-bold text-base text-on-surface">
              Kết quả đánh giá
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {mockEvaluationResults.length} hội thoại đã phân tích
            </p>
          </div>

          <EvaluationResultsTable
            results={mockEvaluationResults}
            runHistory={mockRunHistory}
          />
        </div>
      </PageContainer>
    </>
  );
}
