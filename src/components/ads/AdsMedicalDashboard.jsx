import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
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
import { AttributionFunnel } from './AttributionFunnel';
import { AdsRoasBreakdown } from './AdsRoasBreakdown';
import { AdsDiseaseItemLayout } from './AdsDiseaseItemLayout';

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
  return {
    impressions: 1245000, clicks: 18420, conversations: 368, orders: 89,
    matchedOrders: Math.round(89 * avgRate('matchedRate') / 100),
    untrackedOrders: Math.round(89 - 89 * avgRate('matchedRate') / 100),
    phoneCollectedRate: 24.2,
    matchedRate: Math.round(avgRate('matchedRate')),
    avgOrderValue: 580000,
  };
}

// ─── ROAS Breakdown data from attribution rows ─────────────────────────────────

function buildRoasBreakdownData(attributionData, campaigns) {
  if (!attributionData?.length) {
    return [
      { id: 'camp-1', name: 'KPI Spring Sale 2026', platform: 'facebook', roasOriginal: 4.0, roasActual: 3.2, gapPercent: -20, orders: 164, matchedOrders: 131, untrackedOrders: 33, revenue: 65600000, untrackedRevenue: 13200000, aiAction: 'keep', status: 'active' },
      { id: 'camp-2', name: 'Retargeting Q1 2026', platform: 'zalo', roasOriginal: 2.8, roasActual: 1.9, gapPercent: -32, orders: 89, matchedOrders: 60, untrackedOrders: 29, revenue: 34200000, untrackedRevenue: 10944000, aiAction: 'increase', status: 'active' },
      { id: 'camp-3', name: 'Brand Awareness Q1', platform: 'facebook', roasOriginal: 1.2, roasActual: 0.9, gapPercent: -25, orders: 41, matchedOrders: 31, untrackedOrders: 10, revenue: 12300000, untrackedRevenue: 3075000, aiAction: 'decrease', status: 'active' },
    ];
  }

  // Group by campaign
  const byCampaign = {};
  for (const row of attributionData) {
    if (!byCampaign[row.campaignId]) {
      byCampaign[row.campaignId] = { id: row.campaignId, name: row.campaignName, platform: row.platform, rows: [] };
    }
    byCampaign[row.campaignId].rows.push(row);
  }

  return Object.values(byCampaign).map(camp => {
    const avgOrig = camp.rows.reduce((s, r) => s + r.roasOriginal, 0) / camp.rows.length;
    const avgActual = camp.rows.reduce((s, r) => s + r.roasActual, 0) / camp.rows.length;
    const gapPct = avgOrig > 0 ? -Math.round((1 - avgActual / avgOrig) * 100) : 0;
    const matchedOrders = Math.round(camp.rows.reduce((s, r) => s + r.matchedRate * 0.01 * 10, 0));
    const untrackedOrders = camp.rows.reduce((s, r) => s + r.unmatchedCount, 0);
    const revenue = camp.rows.reduce((s, r) => s + r.untrackedRevenue, 0) + (avgActual * 100000);
    return {
      id: camp.id, name: camp.name, platform: camp.platform,
      roasOriginal: parseFloat(avgOrig.toFixed(2)),
      roasActual: parseFloat(avgActual.toFixed(2)),
      gapPercent: gapPct,
      orders: matchedOrders + untrackedOrders,
      matchedOrders, untrackedOrders,
      revenue: Math.round(revenue),
      untrackedRevenue: camp.rows.reduce((s, r) => s + r.untrackedRevenue, 0),
      aiAction: avgActual >= 3 ? 'keep' : avgActual >= 1.5 ? 'increase' : 'decrease',
      status: 'active',
    };
  });
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
export function AdsMedicalDashboard({ config, onRestart }) {
  const [activeTab, setActiveTab] = useState('funnel'); // 'funnel' | 'diseases'
  const [activeFilter, setActiveFilter] = useState('all');
  const [collapsedIds, setCollapsedIds] = useState([]);
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

  // ── Health score ──
  const healthScore = getAdsHealthScore(diseases);

  // ── Attribution summary for funnel ──
  const attrSummary = useMemo(() => buildAttributionSummary(attributionData), [attributionData]);
  const roasBreakdownData = useMemo(() => buildRoasBreakdownData(attributionData, mockCampaigns), [attributionData]);

  // ── Filter diseases ──
  const filteredDiseases = activeFilter === 'all'
    ? diseases
    : diseases.filter(d => d.id === activeFilter);

  // ── Handlers ──
  const handleSaveAction = useCallback((action) => {
    const rec = diseases
      .flatMap(d => (d.recommendations || []).map(r => ({ ...r, diseaseId: d.id })))
      .find(r => r.id === action.id || r.title === action.title);
    const diseaseId = rec?.diseaseId || action.diseaseId || 'unknown';
    const actionId = action.id || action.title;
    saveAdsAction({ diseaseId, actionId, title: action.title });
    setSavedActions(prev => [
      ...prev,
      { diseaseId, actionId, title: action.title, savedAt: new Date().toISOString() }
    ]);
  }, [diseases]);

  const handleRemoveAction = useCallback((actionId) => {
    removeAdsAction(null, actionId);
    setSavedActions(prev => prev.filter(a => a.actionId !== actionId));
  }, []);

  const handleToggleExpand = useCallback((id) => {
    setCollapsedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
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

      {/* ── Tab switcher: Funnel | Bệnh Ads ── */}
      <div className="flex items-center gap-1 mb-5 bg-surface-container-low rounded-full p-1 w-fit">
        {[
          { value: 'funnel',   label: '🔗 Phễu Attribution' },
          { value: 'diseases', label: '🔴 Bệnh Ads' },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'px-4 py-2 rounded-full text-label-sm font-semibold transition-all duration-150 cursor-pointer',
              activeTab === tab.value
                ? 'bg-primary text-on-primary shadow-[--shadow-sm]'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Health Score Header ── */}
      <div className="mb-5">
        <AdsHealthScoreHeader
          healthScore={healthScore}
          attributionMetrics={attrSummary}
          campaignCount={config?.campaignIds?.length || mockCampaigns.length}
          dateRange={{ start: config?.dateRange?.start || '07/03', end: config?.dateRange?.end || '28/03' }}
        />
      </div>

      {/* ── Funnel Tab ── */}
      {activeTab === 'funnel' && (
        <div className="space-y-4">
          <AttributionFunnel data={attrSummary} />
          <AdsRoasBreakdown campaigns={roasBreakdownData} />
        </div>
      )}

      {/* ── Diseases Tab ── */}
      {activeTab === 'diseases' && (
        <div>
          {/* Saved actions strip */}
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

          {/* Filter tabs */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <AdsFilterTabs
              diseases={diseases}
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
                  isExpanded={!collapsedIds.includes(disease.id)}
                  onToggleExpand={() => handleToggleExpand(disease.id)}
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
      )}

      {/* ── Sticky Saved Actions Bar ── */}
      <SavedActionsBar savedActions={savedActions} onRemove={handleRemoveAction} />
    </div>
  );
}
