import { useState, useCallback } from 'react';
import { Lock } from 'lucide-react';
import { FanpageConnectStep } from '../components/medical/FanpageConnectStep';
import { IndustryFormStep } from '../components/medical/IndustryFormStep';
import { QuantitySelectStep } from '../components/medical/QuantitySelectStep';
import { CrawlProgressStep } from '../components/medical/CrawlProgressStep';
import { MedicalResultStep } from '../components/medical/MedicalResultStep';
import { crawlConversations, loadConversations, computeDiagnosis, saveMedicalRecord, getHealthScore, INDUSTRIES } from '../lib/medicalService';
import {
  AdsWizardSteps,
  AdsConnectStep,
  AdsCampaignSelectStep,
  AdsDateRangeStep,
  AdsCrawlProgressStep,
  AdsMedicalDashboard,
} from '../components/ads';
import {
  loadAttributionData,
  computeAdsDiagnosis,
  getAdsSavedActions,
  getAdsMedicalHistory,
} from '../lib/adsMedicalService';
import { mockCampaigns } from '../data/mockCampaigns';

const STEPS = [
  { id: 'fanpage',    label: 'Kết nối Fanpage' },
  { id: 'industry',   label: 'Ngành hàng' },
  { id: 'quantity',   label: 'Số lượng' },
  { id: 'crawl',      label: 'Thu thập dữ liệu' },
  { id: 'result',     label: 'Kết quả' },
];

export default function MedicalCheckup() {
  // ── Conversation wizard state ──
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState({
    industry: '',
    customerGroup: '',
    quantity: 1000,
  });
  const [crawlProgress, setCrawlProgress] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [conversations, setConversations] = useState([]);

  // ── Ads tab state ──
  const [activeTab, setActiveTab] = useState('conversation');
  const [adsStep, setAdsStep] = useState(1);
  const [adsConfig, setAdsConfig] = useState({
    connected: false,
    selectedCampaignIds: [],   // empty = all campaigns
    days: 7,
  });
  const [adsResult, setAdsResult] = useState(null);

  // Unlock condition: must have at least one conversation medical history record
  const hasMedicalHistory = getAdsMedicalHistory().length > 0;

  const goTo = useCallback((step) => setCurrentStep(step), []);
  const next  = useCallback(() => setCurrentStep(s => Math.min(s + 1, STEPS.length - 1)), []);
  const back  = useCallback(() => setCurrentStep(s => Math.max(s - 1, 0)), []);

  const handleIndustrySelect = (industry) => {
    setConfig(c => ({ ...c, industry }));
  };

  const handleCustomerGroup = (val) => {
    setConfig(c => ({ ...c, customerGroup: val }));
  };

  const handleQuantitySelect = (qty) => {
    setConfig(c => ({ ...c, quantity: qty }));
  };

  const handleStartCrawl = async () => {
    setCurrentStep(3); // go to crawl step

    await crawlConversations({ quantity: config.quantity, industry: config.industry }, (progress) => {
      setCrawlProgress(progress);
    });

    // Compute diagnosis after crawl
    const convos = loadConversations(config.industry, config.quantity);
    const diag = computeDiagnosis(convos, config.industry, []);
    const record = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      industry: config.industry,
      industryLabel: INDUSTRIES.find(i => i.value === config.industry)?.label || config.industry,
      customerGroup: config.customerGroup,
      quantity: config.quantity,
      healthScore: getHealthScore(diag),
      diseases: diag,
    };
    saveMedicalRecord(record);

    setConversations(convos);
    setDiseases(diag);
    setCurrentStep(4); // go to result
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setConfig({ industry: '', customerGroup: '', quantity: 1000 });
    setCrawlProgress(null);
    setDiseases([]);
    setConversations([]);
  };

  // ── Ads helpers ──
  const computeDateRange = (days) => {
    const end   = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    const fmt = (d) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return `${dd}/${mm}`;
    };
    return { start: fmt(start), end: fmt(end) };
  };

  const handleAdsRestart = () => {
    setAdsStep(1);
    setAdsConfig({ connected: false, selectedCampaignIds: [], days: 7 });
    setAdsResult(null);
  };

  const handleAdsCrawlComplete = () => {
    const cids = adsConfig.selectedCampaignIds;
    const campaigns = cids.length
      ? mockCampaigns.filter(c => cids.includes(c.id))
      : mockCampaigns;
    const dateRange = computeDateRange(adsConfig.days);
    const attrData = loadAttributionData(cids, dateRange);
    const savedActionIds = getAdsSavedActions().map(a => ({
      diseaseId: a.diseaseId,
      actionId: a.actionId,
    }));
    const diagnosed = computeAdsDiagnosis(attrData, campaigns, savedActionIds);
    setAdsResult(diagnosed);
  };

  const handleAdsTabSwitch = () => {
    if (hasMedicalHistory) {
      setActiveTab('ads');
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-surface">
      {/* Page Header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-4 mb-1">
          <span className="text-3xl">🏥</span>
          <h1 className="text-headline-lg text-on-surface font-bold">Khám Bệnh</h1>
        </div>
        <p className="text-body-md text-on-surface-variant ml-1">
          Phân tích đa kênh · Chẩn đoán 10 nhóm vấn đề · Gợi ý hành động từ Chuyên gia Smax
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="px-8 mb-4">
        <div className="flex items-center gap-1 bg-surface-container-low rounded-full p-1 w-fit">
          <button
            onClick={() => setActiveTab('conversation')}
            className={`
              px-4 py-2 rounded-full text-label-sm font-semibold transition-all duration-150 cursor-pointer
              ${activeTab === 'conversation'
                ? 'bg-primary text-on-primary shadow-[--shadow-sm]'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}
            `}
          >
            💬 Hội Thoại
          </button>
          <button
            onClick={() => hasMedicalHistory ? setActiveTab('ads') : null}
            disabled={!hasMedicalHistory}
            className={`
              px-4 py-2 rounded-full text-label-sm font-semibold transition-all duration-150
              flex items-center gap-1.5
              ${activeTab === 'ads'
                ? 'bg-primary text-on-primary shadow-[--shadow-sm]'
                : !hasMedicalHistory
                ? 'text-on-surface-variant/40 cursor-not-allowed'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high cursor-pointer'}
            `}
          >
            📣 Quảng Cáo
            {!hasMedicalHistory && <Lock size={10} />}
          </button>
        </div>
      </div>

      {/* ── ADS TAB ── */}
      {activeTab === 'ads' ? (
        <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-8 flex flex-col">
          {/* Not yet unlocked */}
          {!hasMedicalHistory ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="max-w-md w-full bg-surface-container-low rounded-[--radius-lg] p-8 text-center shadow-[--shadow-md]">
                <div className="w-14 h-14 rounded-full bg-surface-container-high mx-auto mb-4 flex items-center justify-center">
                  <Lock size={24} className="text-on-surface-variant/50" />
                </div>
                <h2 className="text-title-lg text-on-surface font-semibold mb-2">
                  Tính năng đang bị khóa
                </h2>
                <p className="text-body-sm text-on-surface-variant mb-6 leading-relaxed">
                  Bạn cần hoàn thành ít nhất một lần <strong>Khám Hội Thoại</strong> trước để mở khóa phần phân tích Ads.
                </p>
                <ul className="text-left text-body-sm text-on-surface-variant mb-6 space-y-2">
                  {[
                    'ROAS thực vs Ảo',
                    'Attribution Quality',
                    'Ad Creative Health',
                    'Audience Targeting',
                    'Budget Allocation',
                    'Chiến Dịch Rác',
                  ].map(benefit => (
                    <li key={benefit} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setActiveTab('conversation')}
                  className="w-full px-4 py-2.5 bg-primary text-on-primary rounded-[--radius-md] text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Bắt đầu Khám Hội Thoại →
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Ads wizard step indicator */}
              <div className="mb-6">
                <AdsWizardSteps
                  currentStep={adsStep}
                  onStepClick={(s) => {
                    if (s < adsStep) setAdsStep(s);
                  }}
                />
              </div>

              {/* Ads wizard steps */}
              <div className="flex-1 min-h-0">
                {adsStep === 1 && (
                  <AdsConnectStep
                    onNext={() => {
                      setAdsConfig(c => ({ ...c, connected: true }));
                      setAdsStep(2);
                    }}
                  />
                )}
                {adsStep === 2 && (
                  <AdsCampaignSelectStep
                    selectedIds={adsConfig.selectedCampaignIds}
                    onChange={(ids) => setAdsConfig(c => ({ ...c, selectedCampaignIds: ids }))}
                    onNext={() => setAdsStep(3)}
                    onBack={() => setAdsStep(1)}
                  />
                )}
                {adsStep === 3 && (
                  <AdsDateRangeStep
                    selectedDays={adsConfig.days}
                    onSelect={(d) => setAdsConfig(c => ({ ...c, days: d }))}
                    onStartCrawl={() => setAdsStep(4)}
                    onBack={() => setAdsStep(2)}
                    campaignCount={adsConfig.selectedCampaignIds.length}
                  />
                )}
                {adsStep === 4 && (
                  <AdsCrawlProgressStep
                    onComplete={() => {
                      handleAdsCrawlComplete();
                    }}
                  />
                )}
              </div>

              {/* Ads medical dashboard — shown once crawl is done */}
              {adsResult && adsStep === 4 && (
                <div className="mt-6">
                  <AdsMedicalDashboard
                    config={{
                      campaignIds: adsConfig.selectedCampaignIds,
                      days: adsConfig.days,
                      dateRange: computeDateRange(adsConfig.days),
                    }}
                    onRestart={handleAdsRestart}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* ── CONVERSATION TAB ── */
        <>
          {/* Step Indicator — hidden on result step */}
          {currentStep < STEPS.length - 1 && (
          <div className="px-8 mb-6">
            <div className="flex items-center gap-3">
              {STEPS.map((step, idx) => {
                const isDone   = idx < currentStep;
                const isActive = idx === currentStep;
                const isPending = idx > currentStep;

                return (
                  <div key={step.id} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`
                        w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                        transition-all duration-300
                        ${isDone   ? 'bg-secondary text-on-secondary' : ''}
                        ${isActive ? 'bg-primary text-on-primary ring-4 ring-primary/10' : ''}
                        ${isPending ? 'bg-surface-container-low text-on-surface-variant border border-[var(--color-outline-variant)]' : ''}
                      `}>
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span className={`
                        text-label-sm whitespace-nowrap hidden sm:block
                        ${isActive ? 'text-primary font-semibold' : isDone ? 'text-on-surface-variant' : 'text-on-surface-variant/50'}
                      `}>
                        {step.label}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`flex-1 h-px min-w-4 transition-all duration-300 ${
                        isDone ? 'bg-secondary/50' : 'bg-[var(--color-outline-variant)]'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          )}

          {/* Step Content */}
          <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-8">
            {currentStep === 0 && (
              <FanpageConnectStep onNext={next} />
            )}
            {currentStep === 1 && (
              <IndustryFormStep
                config={config}
                onIndustrySelect={handleIndustrySelect}
                onCustomerGroup={handleCustomerGroup}
                onNext={next}
                onBack={back}
              />
            )}
            {currentStep === 2 && (
              <QuantitySelectStep
                config={config}
                onQuantitySelect={handleQuantitySelect}
                onStart={handleStartCrawl}
                onBack={back}
              />
            )}
            {currentStep === 3 && (
              <CrawlProgressStep progress={crawlProgress} />
            )}
            {currentStep === 4 && (
              <MedicalResultStep
                diseases={diseases}
                conversations={conversations}
                config={config}
                onRestart={handleRestart}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
