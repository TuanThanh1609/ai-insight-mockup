import { useState, useCallback } from 'react';
import { FanpageConnectStep } from '../components/medical/FanpageConnectStep';
import { IndustryFormStep } from '../components/medical/IndustryFormStep';
import { QuantitySelectStep } from '../components/medical/QuantitySelectStep';
import { CrawlProgressStep } from '../components/medical/CrawlProgressStep';
import { MedicalResultStep } from '../components/medical/MedicalResultStep';
import { crawlConversations, loadConversations, computeDiagnosis, saveMedicalRecord, getHealthScore, INDUSTRIES } from '../lib/medicalService';

const STEPS = [
  { id: 'fanpage',    label: 'Kết nối Fanpage' },
  { id: 'industry',   label: 'Ngành hàng' },
  { id: 'quantity',   label: 'Số lượng' },
  { id: 'crawl',      label: 'Thu thập dữ liệu' },
  { id: 'result',     label: 'Kết quả' },
];

export default function MedicalCheckup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState({
    industry: '',
    customerGroup: '',
    quantity: 1000,
  });
  const [crawlProgress, setCrawlProgress] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [conversations, setConversations] = useState([]);

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

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-surface">
      {/* Page Header */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-1">
          <span className="text-3xl">🏥</span>
          <h1 className="text-headline-lg text-on-surface font-bold">Khám Bệnh Hội Thoại</h1>
        </div>
        <p className="text-body-md text-on-surface-variant ml-1">
          Phân tích đa kênh · Chẩn đoán 10 nhóm vấn đề · Gợi ý hành động từ Chuyên gia Smax
        </p>
      </div>

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
    </div>
  );
}
