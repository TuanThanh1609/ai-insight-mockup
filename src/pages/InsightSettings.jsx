import { useState, useEffect } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TemplateLibrary } from '../components/insight/TemplateLibrary';
import { InsightTable } from '../components/insight/InsightTable';
import { InsightDetailModal } from '../components/insight/InsightDetailModal';
import { CreateInsightFromScratchModal } from '../components/insight/CreateInsightFromScratchModal';
import { mockUserInsights } from '../data/mockTemplates';
import { useToast } from '../components/ui/Toast';

const STORAGE_KEY = 'aiinsight_user_insights';

function loadInsights() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return mockUserInsights;
}

export default function InsightSettings() {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isScratchModalOpen, setIsScratchModalOpen] = useState(false);
  const [insights, setInsights] = useState(loadInsights);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const { addToast } = useToast();

  // Persist to localStorage whenever insights change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(insights));
    } catch (_) {}
  }, [insights]);

  const handleSaveTemplate = (template, selectedCols) => {
    const newInsight = {
      id: `ins-${Date.now()}`,
      name: template.name,
      templateId: template.id,
      platform: template.platform || 'all',
      columnCount: selectedCols.length,
      status: 'active',
      createdAt: new Date().toISOString(),
      conversationsCount: 0,
    };
    setInsights((prev) => [newInsight, ...prev]);
    addToast(
      `Đã tạo "${template.name}" — AI bắt đầu phân tích hội thoại!`,
      'success'
    );
  };

  return (
    <>
      <Header
        title="Cài đặt Insight"
        subtitle="Quản lý cấu hình phân tích AI"
        actions={
          <>
            <Button
              variant="ai-action"
              size="sm"
              onClick={() => setIsTemplateModalOpen(true)}
            >
              <Sparkles size={15} />
              Thêm mới
            </Button>
          </>
        }
      />

      <PageContainer className="pt-0">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-5">
            <p className="text-xs text-on-surface-variant font-medium mb-1">Tổng Insight</p>
            <p className="font-display font-bold text-2xl text-on-surface">{insights.length}</p>
            <p className="text-xs text-on-surface-variant mt-1">đang hoạt động</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-on-surface-variant font-medium mb-1">Tổng hội thoại đã phân tích</p>
            <p className="font-display font-bold text-2xl text-on-surface">
              {insights.reduce((acc, i) => acc + i.conversationsCount, 0).toLocaleString('vi-VN')}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">hội thoại</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-on-surface-variant font-medium mb-1">Thời gian setup trung bình</p>
            <p className="font-display font-bold text-2xl text-on-surface">~45s</p>
            <p className="text-xs text-tertiary-container font-medium mt-1">↓ 92% so với trước</p>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="font-display font-bold text-base text-on-surface mb-3">
            Bắt đầu nhanh
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="ai-action"
              onClick={() => setIsTemplateModalOpen(true)}
            >
              <Sparkles size={16} />
              Tạo Insight mới từ Template
            </Button>
            <Button variant="secondary" onClick={() => setIsScratchModalOpen(true)}>
              Tạo Insight từ đầu
            </Button>
          </div>
        </div>

        {/* Insights table */}
        <div className="mb-6">
          <h2 className="font-display font-bold text-base text-on-surface mb-4">
            Insight đã tạo
          </h2>
          {insights.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="font-display font-bold text-base text-on-surface mb-2">
                Chưa có Insight nào
              </h3>
              <p className="text-sm text-on-surface-variant mb-6 max-w-sm mx-auto">
                Tạo Insight đầu tiên để bắt đầu phân tích hội thoại khách hàng bằng AI.
              </p>
              <Button variant="ai-action" onClick={() => setIsTemplateModalOpen(true)}>
                <Sparkles size={16} />
                Tạo Insight đầu tiên
              </Button>
            </Card>
          ) : (
            <InsightTable
              insights={insights}
              onView={setSelectedInsight}
              onDelete={(id) => {
                setInsights((prev) => prev.filter((i) => i.id !== id));
                addToast('Đã xóa Insight', 'success');
              }}
            />
          )}
        </div>
      </PageContainer>

      <TemplateLibrary
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={handleSaveTemplate}
      />

      <InsightDetailModal
        insight={selectedInsight}
        isOpen={!!selectedInsight}
        onClose={() => setSelectedInsight(null)}
      />

      <CreateInsightFromScratchModal
        isOpen={isScratchModalOpen}
        onClose={() => setIsScratchModalOpen(false)}
        onSave={(newInsight) => {
          setInsights((prev) => [newInsight, ...prev]);
        }}
      />
    </>
  );
}
