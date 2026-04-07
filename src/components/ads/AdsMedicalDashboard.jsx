import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { mockCampaigns } from '../../data/mockCampaigns';
import {
  loadAttributionData,
  computeAdsDiagnosis,
  getAdsHealthScore,
  getAdsSavedActions,
  saveAdsAction,
  removeAdsAction,
} from '../../lib/adsMedicalService';
import { AdsFilterTabs } from './AdsFilterTabs';
import { AdsHealthScoreHeader } from './AdsHealthScoreHeader';
import { AdsDiseaseItemLayout } from './AdsDiseaseItemLayout';
import { AdsCampaignOverviewTable } from './AdsCampaignOverviewTable';

function AdsKpiCards({ attrSummary, diseases }) {
  const getDiseaseScore = (id) => diseases.find(d => d.id === id)?.score ?? 0;

  const cards = [
    {
      id: 'matched-rate',
      title: 'Tỉ lệ Match',
      value: `${Math.round(attrSummary.matchedRate ?? 0)}%`,
      color: '#0052FF',
      trend: '↑2% hôm nay',
      trendColor: '#059669',
      icon: '🔗',
    },
    {
      id: 'roas-real',
      title: 'ROAS Thực',
      value: `${getDiseaseScore('roas-health').toFixed(1)}/10`,
      color: '#059669',
      trend: '↑0.3 hôm nay',
      trendColor: '#059669',
      icon: '📊',
    },
    {
      id: 'lead-order',
      title: 'Tỉ lệ Lead→Đơn',
      value: `${getDiseaseScore('lead-order-conversion').toFixed(1)}/10`,
      color: '#d97706',
      trend: '↓0.2 hôm nay',
      trendColor: '#dc2626',
      icon: '🔁',
    },
    {
      id: 'junk-rate',
      title: 'Tỉ lệ Campaign Rác',
      value: `${getDiseaseScore('junk-campaigns').toFixed(1)}/10`,
      color: '#dc2626',
      trend: '↑0.1 hôm nay',
      trendColor: '#059669',
      icon: '⚠️',
    },
  ];

  return (
    <div>
      <div className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-3 px-1">
        Chỉ Số Quan Trọng
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(card => (
          <div key={card.id} className="bg-surface-container-low rounded-lg p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <span>{card.icon}</span>
              <span className="text-label-xs font-bold text-on-surface-variant uppercase tracking-wide">{card.title}</span>
            </div>
            <div className="text-headline-md font-bold" style={{ color: card.color }}>{card.value}</div>
            <div className="mt-2 text-label-xs font-semibold" style={{ color: card.trendColor }}>{card.trend}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Saved Actions Bar ────────────────────────────────────────────────────────

function SavedActionsBar({ savedActions = [], onRemove }) {
  if (savedActions.length === 0) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-low border-t border-[var(--color-outline-variant)]/30 px-4 py-3 shadow-[--shadow-lg]">
      <div className="max-w-screen-xl mx-auto flex items-center gap-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span className="text-body-sm text-on-surface">
          <span className="font-semibold">{savedActions.length} hành động</span> đã lưu
        </span>
        <div className="flex flex-wrap gap-1.5 ml-4">
          {savedActions.slice(0, 5).map(a => (
            <span key={`${a.diseaseId}-${a.actionId}`}
              className="text-[10px] px-2 py-1 bg-surface-container-high rounded-full text-on-surface-variant flex items-center gap-1">
              {a.title?.slice(0, 25)}
              <button
                onClick={() => onRemove(a.diseaseId, a.actionId)}
                className="text-on-surface-variant hover:text-error ml-1 cursor-pointer"
              >×</button>
            </span>
          ))}
          {savedActions.length > 5 && (
            <span className="text-[10px] px-2 py-1 text-on-surface-variant">+{savedActions.length - 5} khác</span>
          )}
        </div>
        <Button variant="tertiary" size="sm" className="ml-auto shrink-0 gap-1.5">
          <Download size={12} />
          Xuất hành động
        </Button>
      </div>
    </div>
  );
}

// ─── Attribution Summary (derived from attributionData) ───────────────────────

function buildAttributionSummary(attributionData) {
  if (!attributionData?.length) {
    return {
      impressions: 1245000, clicks: 18420, conversations: 368, orders: 89,
      matchedOrders: 67, untrackedOrders: 22,
      phoneCollectedRate: 24.2, matchedRate: 75.3, avgOrderValue: 580000,
    };
  }
  const n = attributionData.length;
  const avgRate = (key) => attributionData.reduce((s, r) => s + (r[key] || 0), 0) / n;
  const total = (key) => attributionData.reduce((s, r) => s + (r[key] || 0), 0);
  const totalRev = total('untrackedRevenue');
  const matchedRate = Math.round(avgRate('matchedRate'));
  const orders = Math.round(totalRev / 580000); // derive orders from revenue
  const matchedOrders = Math.round(orders * matchedRate / 100);
  const untrackedOrders = orders - matchedOrders;
  const conversations = Math.round(n * 12); // approximate conversations from attribution rows
  return {
    impressions: 1245000, clicks: 18420, conversations,
    orders, matchedOrders, untrackedOrders,
    phoneCollectedRate: 24.2,
    phoneCollected: Math.round(conversations * 0.242),
    matchedRate,
    avgOrderValue: 580000,
  };
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

/**
 * AdsMedicalDashboard
 *
 * Props:
 *   config = {
 *     campaignIds: string[],
 *     dateRange: { start, end },
 *     days: number,
 *   }
 *   onRestart = () => void
 */
export function AdsMedicalDashboard({ config, selectedDiseaseIds = [], onRestart }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedActions, setSavedActions] = useState(getAdsSavedActions());

  // ── Compute on mount / config change ──
  const { attributionData, diseases } = useMemo(() => {
    const cids = config?.campaignIds || [];
    const campaigns = cids.length
      ? mockCampaigns.filter(c => cids.includes(c.id))
      : mockCampaigns;
    const attrData = loadAttributionData(cids, config?.dateRange || null);
    const diagnosed = computeAdsDiagnosis(attrData, campaigns, savedActions.map(a => ({ diseaseId: a.diseaseId, actionId: a.actionId })));
    return { attributionData: attrData, diseases: diagnosed };
  }, [config?.campaignIds, config?.dateRange, savedActions]);

  // ── Filter by selectedDiseaseIds (from menu) ──
  const visibleDiseases = selectedDiseaseIds.length > 0
    ? diseases.filter(d => selectedDiseaseIds.includes(d.id))
    : diseases;

  // ── Health score ──
  const healthScore = getAdsHealthScore(visibleDiseases);

  // ── Attribution summary for funnel ──
  const attrSummary = useMemo(() => buildAttributionSummary(attributionData), [attributionData]);

  // ── Filter diseases by tab (within visible diseases) ──
  const filteredDiseases = activeFilter === 'all'
    ? visibleDiseases
    : visibleDiseases.filter(d => d.id === activeFilter);

  // ── Handlers ──
  const handleSaveAction = useCallback((action) => {
    const rec = visibleDiseases
      .flatMap(d => (d.recommendations || []).map(r => ({ ...r, diseaseId: d.id })))
      .find(r => r.id === action.id || r.title === action.title);
    const diseaseId = rec?.diseaseId || action.diseaseId || 'unknown';
    const actionId = action.id || action.title;
    saveAdsAction({ diseaseId, actionId, title: action.title });
    setSavedActions(prev => [
      ...prev,
      { diseaseId, actionId, title: action.title, savedAt: new Date().toISOString() }
    ]);
  }, [visibleDiseases]);

  const handleRemoveAction = useCallback((actionId) => {
    removeAdsAction(null, actionId);
    setSavedActions(prev => prev.filter(a => a.actionId !== actionId));
  }, []);

  const handleExportPDF = () => { window.print(); };

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
            {config?.campaignIds?.length
              ? `${config.campaignIds.length} chiến dịch`
              : 'Tất cả chiến dịch'}
            {config?.days && ` · ${config.days} ngày`}
          </span>
        </div>
        <Button variant="tertiary" size="sm" onClick={handleExportPDF} className="gap-1.5">
          <Download size={14} />
          Xuất báo cáo PDF
        </Button>
      </div>

      {/* ── Health Score Header ── */}
      <div className="mb-5">
        <AdsHealthScoreHeader
          healthScore={healthScore}
          diseases={visibleDiseases}
          campaignCount={config?.campaignIds?.length || mockCampaigns.length}
          dateRange={{ start: config?.dateRange?.start || '07/03', end: config?.dateRange?.end || '28/03' }}
        />
      </div>

      <div className="mb-5">
        <AdsKpiCards attrSummary={attrSummary} diseases={visibleDiseases} />
      </div>

      {/* ── Campaign Overview Table ── */}
      <div className="mb-6">
        <AdsCampaignOverviewTable
          campaigns={mockCampaigns}
        />
      </div>

      {/* ── Bệnh Ads (single result view) ── */}
      <div>
        {/* Saved actions strip */}
        {totalSaved > 0 && (
          <div className="bg-surface-container-low rounded-md px-4 py-2.5 mb-4 flex items-center gap-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span className="text-body-sm text-on-surface">
              <span className="font-semibold">{totalSaved} hành động</span> đã lưu
            </span>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <AdsFilterTabs
            diseases={visibleDiseases}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <span className="text-label-sm text-on-surface-variant shrink-0">
            {filteredDiseases.length} nhóm bệnh
          </span>
        </div>

        {/* Disease items — sorted worst-first from computeAdsDiagnosis */}
        <div className="space-y-4">
          {filteredDiseases.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="text-4xl mb-3 block">🔍</span>
              <p className="text-body-md">Không có bệnh nào trong nhóm này.</p>
            </div>
          ) : (
            filteredDiseases.map(disease => (
              <AdsDiseaseItemLayout
                key={disease.id}
                disease={disease}
                attributionData={attributionData}
                campaigns={mockCampaigns}
                defaultExpanded={true}
                onSaveAction={handleSaveAction}
                onRemoveAction={handleRemoveAction}
                savedActionIds={savedActionIds}
              />
            ))
          )}
        </div>

        {/* Bottom spacing for sticky bar */}
        {totalSaved > 0 && <div className="h-20" />}
      </div>

      {/* ── Sticky Saved Actions Bar ── */}
      <SavedActionsBar savedActions={savedActions} onRemove={handleRemoveAction} />
    </div>
  );
}
