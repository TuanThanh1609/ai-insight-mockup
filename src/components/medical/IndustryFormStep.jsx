import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { INDUSTRIES } from '../../lib/medicalService';

/**
 * Step 2 — Khai báo ngành hàng + Nhóm KH
 */
export function IndustryFormStep({ config, onIndustrySelect, onCustomerGroup, onNext, onBack }) {
  const [selectedIndustry, setSelectedIndustry] = useState(config.industry || '');
  const [customerGroup, setCustomerGroup] = useState(config.customerGroup || '');
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedLabel = INDUSTRIES.find(i => i.value === selectedIndustry);

  const handleNext = () => {
    onIndustrySelect(selectedIndustry);
    onCustomerGroup(customerGroup);
    onNext();
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="space-y-6">

        {/* Industry Selector */}
        <div>
          <label className="block text-label-sm text-on-surface-variant mb-2">
            Ngành hàng của bạn <span className="text-secondary">*</span>
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-surface-container-high rounded-[--radius-md]
                hover:bg-surface-container-highest transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                {selectedLabel ? (
                  <>
                    <span className="text-xl">{selectedLabel.icon}</span>
                    <span className="text-body-md text-on-surface">{selectedLabel.label}</span>
                  </>
                ) : (
                  <span className="text-body-md text-on-surface-variant">Chọn ngành hàng...</span>
                )}
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-on-surface-variant transition-transform ${showDropdown ? 'rotate-180' : ''}`}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-surface-container-lowest rounded-[--radius-md] shadow-[--shadow-lg] border border-[var(--color-outline-variant)] overflow-hidden">
                {INDUSTRIES.map(ind => (
                  <button
                    key={ind.value}
                    onClick={() => {
                      setSelectedIndustry(ind.value);
                      setShowDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-container-low transition-colors cursor-pointer
                      ${selectedIndustry === ind.value ? 'bg-surface-container-low' : ''}`}
                  >
                    <span className="text-xl">{ind.icon}</span>
                    <span className="text-body-md text-on-surface">{ind.label}</span>
                    {selectedIndustry === ind.value && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-auto text-secondary">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Customer Group */}
        <div>
          <label className="block text-label-sm text-on-surface-variant mb-2">
            Nhóm đối tượng khách hàng
          </label>
          <textarea
            value={customerGroup}
            onChange={e => setCustomerGroup(e.target.value)}
            placeholder="Mô tả ngắn về nhóm khách hàng mà shop đang hướng đến..."
            rows={3}
            className="w-full px-4 py-3 bg-surface-container-high rounded-[--radius-md] text-body-md text-on-surface
              placeholder:text-on-surface-variant/50 resize-none
              focus:outline-none focus:bg-surface-container-highest focus:border-b-2 focus:border-tertiary
              transition-colors"
          />
          <p className="mt-1.5 text-body-sm text-on-surface-variant/60">
            Thông tin này giúp Chuyên gia Smax đưa ra gợi ý phù hợp hơn với đặc thù KH của bạn.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" size="md" onClick={onBack} className="gap-1">
            <ChevronLeft size={16} />
            Quay lại
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            disabled={!selectedIndustry}
            className="gap-2"
          >
            Tiếp tục
            <ChevronRight size={16} />
          </Button>
        </div>

      </div>
    </div>
  );
}
