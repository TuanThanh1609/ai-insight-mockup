import { useState, useEffect, useCallback } from 'react';
import { DISEASE_GROUPS } from '../../lib/medicalService';
import { getSelectedDiseases, saveSelectedDiseases } from '../../lib/diseaseMenuService';
import { cn } from '../../lib/utils';

// ─── Severity config ─────────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
  NẶNG: { color: '#dc2626', bg: 'rgba(220,38,38,0.10)', label: 'NẶNG', dot: '🔴' },
  'TRUNG BÌNH': { color: '#0052FF', bg: 'rgba(0,82,255,0.10)', label: 'TRUNG BÌNH', dot: '🔵' },
  NHẸ: { color: '#059669', bg: 'rgba(5,150,105,0.10)', label: 'NHẸ', dot: '🟢' },
};

function getSeverityLabel(score) {
  if (score <= 3) return 'NẶNG';
  if (score <= 6) return 'TRUNG BÌNH';
  return 'NHẸ';
}

// ─── 9 disease descriptions (static, Vietnamese) ─────────────────────────────
// Maps disease ID → { causes[], methodItems[], metrics[] }
const DISEASE_META = {
  'lead-quality': {
    causes: [
      'Ads targeting quá rộng → click không đúng KH mục tiêu',
      'Không sàng lọc khách trước khi tư vấn → sale tốn thời gian vào junk',
      'Landing page không đúng kỳ vọng → khách rời ngay sau khi click',
    ],
    methodItems: [
      'Đếm tỉ lệ khách spam / tự động nhắn từ ads',
      'Kiểm tra khách có để lại SĐT thật hay không',
      'Đánh giá khách có hành vi mua thật hay chỉ hỏi giá',
    ],
    metrics: ['Junk Lead %', 'Tỉ lệ thu thập SĐT', 'Tỉ lệ chốt đơn'],
  },
  'response-speed': {
    causes: [
      'Sale phản hồi thủ công, không có auto-reply → khách chờ lâu rồi bỏ',
      'Ngoài giờ làm việc → tin nhắn không được trả lời',
      'Khối lượng tin nhắn lớn → sale không kịp rep hết',
    ],
    methodItems: [
      'Đo thời gian phản hồi TB từ lúc khách nhắn đến lúc sale rep',
      'Đếm tỉ lệ khách được nhắc nhở (remind) khi chưa được rep',
      'Kiểm tra khách có được gửi ưu đãi cá nhân hóa hay không',
    ],
    metrics: ['Thời gian phản hồi TB', 'Tỉ lệ Remind KH', 'Tỉ lệ ưu đãi cá nhân'],
  },
  'staff-performance': {
    causes: [
      'Sale chưa được đào tạo bài bản → tư vấn sai sản phẩm, sai giá',
      'Thiếu script chuẩn → mỗi sale một cách trả lời, không nhất quán',
      'Áp lực doanh số → sale vội vàng, bỏ qua bước hiểu nhu cầu khách',
    ],
    methodItems: [
      'Đánh giá thái độ tư vấn của từng sale (chu đáo vs vội vàng)',
      'Kiểm tra lỗi mất khách do tư vấn sai / bỏ qua khách',
      'So sánh tỉ lệ tư vấn đúng giữa các sale',
    ],
    metrics: ['Tỉ lệ thái độ tốt', 'Tỉ lệ lỗi mất khách', 'Tỉ lệ tư vấn đúng'],
  },
  'competitor': {
    causes: [
      'Đối thủ chạy quảng cáo hiệu quả hơn → khách bị cuốn đi',
      'Shop không có USPs rõ ràng → khách dễ so sánh và rời bỏ',
      'Giá cao hơn thị trường mà không có giá trị cộng thêm rõ ràng',
    ],
    methodItems: [
      'Đếm tần suất khách nhắc đến tên đối thủ trong hội thoại',
      'Kiểm tra khách có so sánh giá / chất lượng với đối thủ hay không',
      'Đánh giá mức độ shop phản hồi khi khách nhắc đến đối thủ',
    ],
    metrics: ['Tỉ lệ nhắc đến đối thủ', 'Tỉ lệ so sánh giá', 'Cách phản hồi đối thủ'],
  },
  'post-purchase': {
    causes: [
      'Khách mua xong không được chăm sóc → quên shop, mua chỗ khác cho lần sau',
      'Không có chương trình giữ chân khách cũ → tỉ lệ quay lại thấp',
      'Sản phẩm có vấn đề nhưng không được phát hiện → khách bực rồi đăng review',
    ],
    methodItems: [
      'Kiểm tra khách có được CSKH sau mua (tặng quà, hỏi thăm, hướng dẫn)',
      'Đếm tỉ lệ khách có dấu hiệu sẽ đăng review xấu (khiếu nại, đòi hoàn tiền)',
      'Đánh giá urgency trong tin nhắn hậu mua (bán thêm hay chỉ thank you)',
    ],
    metrics: ['Tỉ lệ CSKH sau mua', 'Rủi ro review xấu', 'Urgency trong hậu mua'],
  },
  'objection-handling': {
    causes: [
      'Sale không được training objection handling → không biết cách phản hồi',
      'Shop không có kịch bản chuẩn → mỗi người một cách xử lý, không hiệu quả',
      'Khách hỏi về giá / so sánh → sale không biết tạo giá trị thay vì giảm giá',
    ],
    methodItems: [
      'Đếm tần suất objection xuất hiện (giá đắt, hàng fake, hỏi chồng…)',
      'Kiểm tra sale có follow script kịch bản chuẩn khi gặp objection',
      'Đếm tỉ lệ khách "bốc hơi" ngay sau khi đưa ra objection',
    ],
    metrics: ['Tỉ lệ objection gặp', 'Tỉ lệ follow script', 'Tỉ lệ khách "bốc hơi"'],
  },
  'abandoned-chat': {
    causes: [
      'Sale rep quá chậm → khách nhắn nhiều nơi, quên mất là đã nhắn shop này',
      'Khách chỉ hỏi nhanh rồi mua chỗ khác (price shopping)',
      'Không có "closing" rõ ràng → hội thoại kết thúc mà không có kết quả',
    ],
    methodItems: [
      'Đếm tỉ lệ hội thoại khách bỏ giữa chừng (không rep lại)',
      'Kiểm tra hội thoại có kết thúc rõ ràng (xin số, chốt đơn) hay không',
      'Đếm hội thoại không có tin nhắn cuối từ phía shop',
    ],
    metrics: ['Tỉ lệ bỏ giữa chừng', 'Tỉ lệ không kết thúc', 'Tin nhắn cuối của shop'],
  },
  'tone-language': {
    causes: [
      'Sale dùng từ ngữ không chuyên nghiệp → khách mất tin tưởng',
      'Quá nhiều emoji / icon → nhìn không nghiêm túc, giảm giá trị sản phẩm',
      'Tin nhắn quá dài / quá ngắn → khách không hiểu hoặc cảm giác bị spam',
    ],
    methodItems: [
      'Kiểm tra giọng điệu có phù hợp với thương hiệu và nhóm KH mục tiêu',
      'Đếm tỉ lệ tin nhắn over-emoji (quá 3 emoji / tin)',
      'Đánh giá độ dài tin nhắn TB (quá dài > 200 chữ / quá ngắn < 5 chữ)',
    ],
    metrics: ['Tỉ lệ giọng không phù hợp', 'Over-emoji', 'Tin quá dài/ngắn'],
  },
  'upsell': {
    causes: [
      'Sale chỉ tập trung bán 1 sản phẩm chính → bỏ lỡ cơ hội tăng AOV',
      'Không có script upsell → sale không biết gợi ý sản phẩm đi kèm nào',
      'Khách chưa sẵn sàng mua thêm → gợi ý quá sớm, gây phiền',
    ],
    methodItems: [
      'Kiểm tra sale có gợi ý sản phẩm đi kèm / phiên bản cao cấp hơn không',
      'Đếm tỉ lệ upsell thành công (khách đồng ý mua thêm)',
      'Đếm tỉ lệ khách bỏ qua gợi ý upsell (im lặng hoặc từ chối)',
    ],
    metrics: ['Tỉ lệ gợi ý sản phẩm', 'Tỉ lệ upsell thành công', 'Tỉ lệ bỏ qua gợi ý'],
  },
};

// ─── Single disease block ────────────────────────────────────────────────────
function DiseaseBlock({ disease, isSelected, onToggle, severityScore }) {
  const meta = DISEASE_META[disease.id];
  const sevLabel = getSeverityLabel(severityScore ?? 5);
  const sev = SEVERITY_CONFIG[sevLabel] || SEVERITY_CONFIG.NHẸ;

  return (
    <div
      onClick={onToggle}
      className={cn(
        'rounded-lg p-4 cursor-pointer transition-all duration-150 border',
        isSelected
          ? 'border-tertiary shadow-[--shadow-md]'
          : 'border-transparent hover:border-[var(--color-outline-variant)] hover:bg-surface-container-low'
      )}
      style={isSelected ? { background: 'var(--color-surface-container-lowest)' } : {}}
    >
      {/* Header row */}
      <div className="flex items-start gap-2.5 mb-3">
        {/* Checkbox */}
        <div className={cn(
          'mt-0.5 w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-all',
          isSelected
            ? 'bg-tertiary border-tertiary'
            : 'border-[var(--color-outline)] bg-transparent'
        )}>
          {isSelected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        {/* Icon + name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg leading-none">{disease.icon}</span>
            <span className="text-[15px] font-bold text-on-surface leading-snug">
              {disease.label}
            </span>
            {/* Severity badge */}
            <span
              className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ color: sev.color, background: sev.bg }}
            >
              {sev.dot} {sev.label}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mb-3" style={{ background: 'var(--color-outline-variant)' }} />

      {/* Nguyên nhân */}
      {meta?.causes && (
        <div className="mb-3">
          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">
            📌 Nguyên nhân
          </div>
          <ul className="space-y-0.5">
            {meta.causes.map((cause, i) => (
              <li key={i} className="text-[13px] text-on-surface-variant leading-snug">
                • {cause}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Phương pháp khám */}
      {meta?.methodItems && (
        <div className="mb-3">
          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">
            🔬 Phương pháp khám
          </div>
          <ul className="space-y-0.5">
            {meta.methodItems.map((item, i) => (
              <li key={i} className="text-[13px] text-on-surface-variant leading-snug">
                □ {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chỉ số */}
      {meta?.metrics && (
        <div className="pt-2 border-t" style={{ borderColor: 'var(--color-outline-variant)' }}>
          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">
            📊 Chỉ số
          </div>
          <div className="flex flex-wrap gap-1.5">
            {meta.metrics.map((m, i) => (
              <span
                key={i}
                className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  background: 'var(--color-surface-container-low)',
                  color: 'var(--color-on-surface-variant)',
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

/**
 * DiseaseMenuSelectStep
 *
 * Props:
 *   onContinue(selectedIds[])  — gọi khi user bấm Tiếp tục
 *   onBack()                   — gọi khi user bấm Quay lại
 *   diseases[]                 — mảng disease objects (từ computeDiagnosis) để lấy score
 */
export function DiseaseMenuSelectStep({ onContinue, onBack, diseases = [] }) {
  // Init selected IDs: load from localStorage, fallback = all IDs
  const [selected, setSelected] = useState(() => {
    const saved = getSelectedDiseases('conversation');
    if (saved && saved.length > 0) return new Set(saved);
    return new Set(DISEASE_GROUPS.map(d => d.id));
  });

  // Sort groups: Nặng → TB → Nhẹ
  const sortedGroups = [...DISEASE_GROUPS].sort((a, b) => {
    const scoreA = diseases.find(d => d.id === a.id)?.score ?? 5;
    const scoreB = diseases.find(d => d.id === b.id)?.score ?? 5;
    return scoreA - scoreB; // worst first
  });

  const toggle = useCallback((id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(DISEASE_GROUPS.map(d => d.id)));
  }, []);

  const deselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  const handleContinue = useCallback(() => {
    const ids = Array.from(selected);
    saveSelectedDiseases('conversation', ids);
    onContinue(ids);
  }, [selected, onContinue]);

  const selectedCount = selected.size;
  const canContinue = selectedCount > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">📋</span>
          <h2 className="text-title-md font-bold text-on-surface">Chọn Hạng Mục Khám Bệnh</h2>
        </div>
        <p className="text-body-sm text-on-surface-variant">
          Bạn đang gặp vấn đề gì? Tích chọn để khám ngay.
        </p>
        <p className="text-[11px] text-on-surface-variant mt-1">
          Mỗi hạng mục = 1 vấn đề cụ thể. Chọn từ 1 → 9 hạng mục.
        </p>
      </div>

      {/* Grid of disease blocks */}
      <div className="flex-1 min-h-0 px-6 pb-4 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedGroups.map(group => (
            <DiseaseBlock
              key={group.id}
              disease={group}
              isSelected={selected.has(group.id)}
              onToggle={() => toggle(group.id)}
              severityScore={diseases.find(d => d.id === group.id)?.score}
            />
          ))}
        </div>
      </div>

      {/* Footer: actions + counter */}
      <div
        className="px-6 py-4 flex flex-col sm:flex-row items-center gap-3 border-t"
        style={{ borderColor: 'var(--color-outline-variant)', background: 'var(--color-surface-container-low)' }}
      >
        {/* Select / Deselect all */}
        <div className="flex items-center gap-2 mr-auto">
          <button
            onClick={selectAll}
            className="text-[11px] font-semibold text-tertiary hover:underline cursor-pointer"
          >
            ☑ Chọn tất cả
          </button>
          <span className="text-[var(--color-outline)]">|</span>
          <button
            onClick={deselectAll}
            className="text-[11px] font-semibold text-on-surface-variant hover:underline cursor-pointer"
          >
            ☐ Bỏ chọn tất cả
          </button>
        </div>

        {/* Counter */}
        <span className="text-[11px] font-semibold text-on-surface-variant">
          {selectedCount}/9 đã chọn
        </span>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-full text-[12px] font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            ← Quay lại
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={cn(
              'px-5 py-2 rounded-full text-[12px] font-bold transition-all cursor-pointer',
              canContinue
                ? 'bg-tertiary text-white shadow-[--shadow-sm] hover:shadow-[--shadow-md] hover:brightness-110'
                : 'bg-surface-container-low text-on-surface-variant opacity-50 cursor-not-allowed'
            )}
          >
            Tiếp tục →
          </button>
        </div>
      </div>
    </div>
  );
}
