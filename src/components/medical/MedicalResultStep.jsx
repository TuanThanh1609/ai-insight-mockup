import { useState, useCallback } from 'react';
import { RotateCcw, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { HealthScoreHeader } from './HealthScoreHeader';
import { MedicalFilterTabs } from './MedicalFilterTabs';
import { SavedActionsBar } from './SavedActionsBar';
import { LeadsQualityDashboard } from './LeadsQualityDashboard';
import { ConversationFunnelSection } from './ConversationFunnelSection';
import { DiseaseItemLayout } from './DiseaseItemLayout';
import {
  getSavedActions, saveAction, removeAction,
  getMedicalHistory, DISEASE_GROUPS, INDUSTRIES
} from '../../lib/medicalService';

/**
 * Step 5 — Kết quả Khám Bệnh
 * Layout:
 *   - Leads Quality Dashboard (full width)
 *   - 2/3 Disease Cards | 1/3 Right Panel (Alerts + Recommendations)
 */
export function MedicalResultStep({ diseases, conversations, config, onRestart }) {
  const [activeFilter, setActiveFilter] = useState('all');
  // Mặc định: mọi mục khám bệnh mở rộng (không ở trạng thái thu gọn)
  const [collapsedIds, setCollapsedIds] = useState([]);
  const [savedActions, setSavedActions] = useState(getSavedActions());

  // Disease counts for filter tabs
  const diseaseCounts = {};
  for (const d of diseases) diseaseCounts[d.id] = 1;
  diseaseCounts.all = diseases.length;

  // Filter diseases by tab
  const filteredDiseases = activeFilter === 'all'
    ? diseases
    : diseases.filter(d => d.id === activeFilter);

  // ── Actions ──
  const handleToggleAction = useCallback((diseaseId, actionId, action) => {
    const isCurrentlySaved = savedActions.some(
      a => a.diseaseId === diseaseId && a.actionId === actionId
    );
    if (isCurrentlySaved) {
      removeAction(diseaseId, actionId);
      setSavedActions(prev => prev.filter(
        a => !(a.diseaseId === diseaseId && a.actionId === actionId)
      ));
    } else {
      saveAction({ diseaseId, actionId, title: action.title });
      setSavedActions(prev => [
        ...prev,
        { diseaseId, actionId, title: action.title, savedAt: new Date().toISOString() }
      ]);
    }
  }, [savedActions]);

  const handleRemoveAction = useCallback((diseaseId, actionId) => {
    removeAction(diseaseId, actionId);
    setSavedActions(prev => prev.filter(
      a => !(a.diseaseId === diseaseId && a.actionId === actionId)
    ));
  }, []);

  const handleToggleExpand = useCallback((id) => {
    setCollapsedIds(prev => (
      prev.includes(id)
        ? prev.filter(x => x !== id)   // mở lại
        : [...prev, id]                // thu gọn
    ));
  }, []);

  const handleExportPDF = () => {
    alert('Xuất báo cáo PDF: đang phát triển...');
  };

  // ── Derived ──
  const totalSaved = savedActions.length;
  const savedActionIds = savedActions.map(a => a.actionId);

  return (
    <div>
      {/* ── Top meta bar ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onRestart} className="gap-1.5">
            <RotateCcw size={14} />
            Khám lại
          </Button>
          <div className="w-px h-4 bg-[var(--color-outline-variant)]" />
          <span className="text-body-sm text-on-surface-variant">
            {INDUSTRIES.find(i => i.value === config.industry)?.label || config.industry}
            {config.customerGroup && ` · ${config.customerGroup}`}
          </span>
        </div>
        <Button variant="tertiary" size="sm" onClick={handleExportPDF} className="gap-1.5">
          <Download size={14} />
          Xuất báo cáo PDF
        </Button>
      </div>

      {/* ── Health Score ── */}
      <div className="mb-5">
        <HealthScoreHeader diseases={diseases} />
      </div>

      {/* ── Conversation Funnel ── */}
      <ConversationFunnelSection
        conversations={conversations}
        totalCount={conversations.length}
      />

      {/* ── Leads Quality Dashboard ── */}
      <div className="mb-5">
        <LeadsQualityDashboard
          conversations={conversations}
          totalCount={conversations.length}
        />
      </div>

      {/* ── Filter Tabs + count ── */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <MedicalFilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          diseaseCounts={diseaseCounts}
        />
        <span className="text-label-sm text-on-surface-variant shrink-0">
          {filteredDiseases.length} nhóm bệnh
        </span>
      </div>

      {/* ── Saved Actions summary strip ── */}
      {totalSaved > 0 && (
        <div className="bg-surface-container-low rounded-[--radius-md] px-4 py-2.5 mb-4 flex items-center gap-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          <span className="text-body-sm text-on-surface">
            <span className="font-semibold">{totalSaved} hành động</span> đã lưu
          </span>
        </div>
      )}

      {/* ── Per-item 2/3 + 1/3 layout ── */}
      <div className="space-y-4">
        {filteredDiseases.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="text-4xl mb-3 block">🔍</span>
            <p className="text-body-md">Không có bệnh nào trong nhóm này.</p>
          </div>
        ) : (
          filteredDiseases.map(disease => (
            <DiseaseItemLayout
              key={disease.id}
              disease={disease}
              conversations={conversations}
              isExpanded={!collapsedIds.includes(disease.id)}
              onToggleExpand={() => handleToggleExpand(disease.id)}
              onToggleAction={handleToggleAction}
              savedActionIds={savedActionIds}
            />
          ))
        )}
      </div>

      {/* Bottom spacing for sticky bar */}
      {totalSaved > 0 && <div className="h-20" />}

      {/* ── SavedActionsBar sticky ── */}
      <SavedActionsBar
        savedActions={savedActions}
        diseases={diseases}
        onRemove={handleRemoveAction}
      />
    </div>
  );
}
