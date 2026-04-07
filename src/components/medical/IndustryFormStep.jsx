import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shirt,
  Baby,
  Sparkles,
  Flower2,
  Building2,
  UtensilsCrossed,
  Plane,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { INDUSTRIES } from '../../lib/medicalService';

const AMBIENT_SHADOW = '0 4px 32px 0 rgba(26, 33, 56, 0.08)';

// Map INDUSTRIES value → Lucide icon component
const ICON_MAP = {
  'thoi-trang': Shirt,
  'me-va-be':   Baby,
  'my-pham':    Sparkles,
  spa:          Flower2,
  bds:          Building2,
  fb:           UtensilsCrossed,
  'du-lich':    Plane,
};

// 9 disease groups shown in preview panel (same for all industries)
const DISEASE_GROUPS = [
  {
    index: 1,
    name: 'Chất lượng Lead',
    desc: 'Độ quan tâm và khả năng mua hàng của tệp khách',
  },
  {
    index: 2,
    name: 'Tốc độ phản hồi',
    desc: 'Thời gian trễ từ khi khách nhắn đến khi có phản hồi',
  },
  {
    index: 3,
    name: 'Hiệu suất nhân viên',
    desc: 'Tỷ lệ chốt đơn và quản lý hội thoại của sale',
  },
  {
    index: 4,
    name: 'Đối thủ cạnh tranh',
    desc: 'So sánh giá và độ phủ thương hiệu ngành',
  },
  {
    index: 5,
    name: 'Hậu mua / Chăm sóc',
    desc: 'Quy trình đổi trả và tích điểm khách hàng thân thiết',
  },
  {
    index: 6,
    name: 'Xử lý rào cản',
    desc: 'Giải quyết thắc mắc về size số, chất liệu',
  },
  {
    index: 7,
    name: 'Chat bị bỏ rơi',
    desc: 'Số lượng khách hỏi nhưng không được tư vấn hết',
  },
  {
    index: 8,
    name: 'Giọng điệu / Ngôn ngữ',
    desc: 'Độ phù hợp của văn phong với tệp khách hàng',
  },
  {
    index: 9,
    name: 'Upsell / Cross-sell',
    desc: 'Khả năng gợi ý thêm phụ kiện hoặc combo đồ',
  },
];

/**
 * Step 2 — Chọn ngành hàng (cards grid) + Nhóm KH + Disease Preview
 */
export function IndustryFormStep({ config, onIndustrySelect, onCustomerGroup, onNext, onBack }) {
  const [selectedIndustry, setSelectedIndustry] = useState(config.industry || '');
  const [customerGroup, setCustomerGroup] = useState(config.customerGroup || '');

  const selectedLabel = INDUSTRIES.find(i => i.value === selectedIndustry)?.label ?? '';

  const handleNext = () => {
    onIndustrySelect(selectedIndustry);
    onCustomerGroup(customerGroup);
    onNext();
  };

  const IconComponent = selectedIndustry ? ICON_MAP[selectedIndustry] : null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10 space-y-3">
        <span className="inline-block px-4 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-label-sm font-bold uppercase tracking-widest">
          BƯỚC 2 / 5
        </span>
        <h1 className="text-headline-lg font-bold text-on-surface">
          Chọn ngành hàng của bạn
        </h1>
        <p className="text-body-md text-on-surface-variant max-w-lg">
          Chúng tôi sẽ phân tích 9 nhóm bệnh đặc thù theo ngành để đưa ra phác đồ tối ưu nhất.
        </p>
      </div>

      {/* Industry Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {INDUSTRIES.map((industry) => {
          const Icon = ICON_MAP[industry.value] ?? Shirt;
          const isSelected = selectedIndustry === industry.value;

          return (
            <button
              key={industry.value}
              type="button"
              onClick={() => setSelectedIndustry(industry.value)}
              className={[
                'relative flex flex-col items-center text-center gap-3 p-6 rounded-lg cursor-pointer transition-all shadow-[--shadow-sm]',
                'bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5] hover:bg-[rgba(255,255,255,0.70)] hover:-translate-y-1',
                isSelected
                  ? 'border-l-4 border-secondary shadow-[--shadow-md]'
                  : 'border border-[rgba(26,33,56,0.08)]',
              ].join(' ')}
            >
              {/* Icon circle */}
              <div
                className={[
                  'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
                  isSelected
                    ? 'bg-secondary-fixed text-secondary'
                    : 'bg-gradient-to-br from-[#f5f1f5] to-[#ede9ee] text-on-surface-variant',
                ].join(' ')}
              >
                <Icon size={28} strokeWidth={1.5} />
              </div>

              {/* Label */}
              <span className="text-body-md font-semibold text-on-surface leading-tight">
                {industry.label}
              </span>
            </button>
          );
        })}

        {/* Spacer cards to keep row 2 centred (cols 2 + 3 cards = center-anchor) */}
        {!INDUSTRIES.every((_, i) => i < 4) && (
          <div className="hidden md:block md:col-start-2" />
        )}
      </div>

      {/* Row 2 spacer for 7-card centering */}
      <div className="grid grid-cols-2 md:grid-cols-4 mt-4">
        <div className="hidden md:block md:col-start-2" />
      </div>

      {/* Disease Preview Panel — shows only after industry selected */}
      {selectedIndustry && (
        <div
          className="glass-panel p-8 rounded-xl mt-8 transition-all duration-300 shadow-[--shadow-sm]"
          style={{ boxShadow: AMBIENT_SHADOW }}
        >
          {/* Panel header */}
          <div className="flex items-center gap-3 mb-8">
            {IconComponent && (
              <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
                <IconComponent size={16} strokeWidth={2} />
              </div>
            )}
            <div>
              <p className="text-title-sm font-bold text-on-surface">
                9 Chỉ số khám nghiệm {selectedLabel}
              </p>
              <p className="text-label-sm text-on-surface-variant">Bệnh đặc thù</p>
            </div>
          </div>

          {/* 9 Disease Groups — 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6">
            {DISEASE_GROUPS.map((disease) => (
              <div key={disease.index} className="flex items-start gap-3">
                {/* Index badge */}
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold">{disease.index}</span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-body-sm font-semibold text-on-surface leading-tight">
                    {disease.name}
                  </p>
                  <p className="text-body-xs text-on-surface-variant leading-snug">
                    {disease.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Group Textarea */}
      <div className="mt-8 space-y-2">
        <label className="block text-label-sm font-semibold uppercase tracking-[0.05em] text-on-surface-variant">
          Nhóm đối tượng KH
        </label>
        <textarea
          value={customerGroup}
          onChange={(e) => setCustomerGroup(e.target.value)}
          className="w-full bg-gradient-to-br from-[#f5f1f5] to-[#ede9ee] border-none rounded-xl p-5 text-body-md text-on-surface
            placeholder:text-on-surface-variant/50 resize-none focus:ring-0 transition-all shadow-[--shadow-sm]"
          style={{ boxShadow: AMBIENT_SHADOW }}
          placeholder="VD: Shop bán đầm công sở, 25-35 tuổi, thu nhập khá, quan tâm đến thời trang bền vững..."
          rows={3}
        />
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-8 border-t border-[rgba(26,33,56,0.08)]">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ChevronLeft size={16} />
          Quay lại
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!selectedIndustry}
          className="gap-2"
        >
          Tiếp tục
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
