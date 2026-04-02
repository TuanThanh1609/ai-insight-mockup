import { useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { askSmaxForDisease } from '../../lib/smaxAIService';

/**
 * Thresholds — rule-based
 */
const THRESHOLDS = {
  lead: {
    hotRate: 0.25,   // >25% lead Nóng = tốt
    phoneRate: 0.40,  // >40% SĐT thu thập = tốt
  },
  staff: {
    chotRate: 0.30,    // >30% chốt đơn = tốt
    missedRate: 0.10,   // <10% bỏ sót = tốt
    silentRate: 0.15,   // <15% im lặng = tốt
  },
  postPurchase: {
    returnRate: 0.20,  // >20% quay lại = tốt
  },
  feedback: {
    negRate: 0.15,     // <15% tiêu cực = tốt
    posRate: 0.50,    // >50% tích cực = tốt
  },
};

// ─── Rule Engine ───────────────────────────────────────────────────────────────

function computePillarA(data) {
  const total = data.length;
  if (total === 0) return { status: 'unknown', comment: 'Chưa có dữ liệu hội thoại.', hotRate: 0, phoneRate: 0 };

  // Field là 'temperature' (không phải 'lead_temperature')
  const hot = data.filter((c) => c.temperature === 'Nóng').length;
  const warm = data.filter((c) => c.temperature === 'Ấm').length;
  const withTempCount = data.filter(
    (c) => c.temperature === 'Nóng' || c.temperature === 'Ấm' || c.temperature === 'Lạnh'
  ).length;

  const phoneOk = data.filter(
    (c) =>
      c.phone_status === 'Đã thu thập' ||
      c.phone_status === 'Đã thu thập SĐT' ||
      c.phone === true
  ).length;

  // Use rows WITH temperature as denominator
  const hotRate = withTempCount > 0 ? hot / withTempCount : 0;
  const phoneRate = total > 0 ? phoneOk / total : 0;

  const good = hotRate >= THRESHOLDS.lead.hotRate && phoneRate >= THRESHOLDS.lead.phoneRate;
  const warn = hotRate >= THRESHOLDS.lead.hotRate * 0.5 || phoneRate >= THRESHOLDS.lead.phoneRate * 0.5;

  let status = 'nguy-co';
  let comment = '';
  if (good) {
    status = 'tot';
    comment = `Lead chất lượng tốt — ${(hotRate * 100).toFixed(0)}% Nóng, ${(phoneRate * 100).toFixed(0)}% SĐT thu thập.`;
  } else if (warn) {
    status = 'can-cai-thien';
    comment = `Lead ở mức trung bình — cần cải thiện tỉ lệ Nóng và thu thập SĐT.`;
  } else {
    status = 'nguy-co';
    comment = `Tỉ lệ lead Nóng chỉ ${(hotRate * 100).toFixed(0)}% (trong ${withTempCount} hội thoại có nhiệt độ), SĐT ${(phoneRate * 100).toFixed(0)}%.`;
  }

  return { status, comment, hotRate, phoneRate, total, withTempCount };
}

function computePillarB(data) {
  // Staff eval data — templates có chot_don, missed_conv, silent_cust
  const total = data.length;
  if (total === 0) return { status: 'unknown', comment: 'Chưa có dữ liệu đánh giá nhân viên.' };

  const chot = data.filter((r) => r.chot_don === true || r.chot_don === 'true').length;
  const missed = data.filter((r) => r.missed_conv === true || r.missed_conv === 'true').length;
  const silent = data.filter((r) => r.silent_cust === true || r.silent_cust === 'true').length;

  const chotRate = total > 0 ? chot / total : 0;
  const missedRate = total > 0 ? missed / total : 0;
  const silentRate = total > 0 ? silent / total : 0;

  const good = chotRate >= THRESHOLDS.staff.chotRate && missedRate < THRESHOLDS.staff.missedRate;
  const warn = chotRate >= THRESHOLDS.staff.chotRate * 0.5;

  let status = 'nguy-co';
  let comment = '';
  if (good) {
    status = 'tot';
    comment = `NV tư vấn hoạt động tốt — ${(chotRate * 100).toFixed(0)}% chốt đơn, bỏ sót ${(missedRate * 100).toFixed(0)}%.`;
  } else if (warn) {
    status = 'can-cai-thien';
    comment = `Tỉ lệ chốt đơn ${(chotRate * 100).toFixed(0)}% — cần cải thiện kỹ năng tư vấn.`;
  } else {
    status = 'nguy-co';
    comment = `NV chốt đơn thấp ${(chotRate * 100).toFixed(0)}%, bỏ sót cao ${(missedRate * 100).toFixed(0)}%. Cần training.`;
  }

  return { status, comment, chotRate, missedRate, silentRate, total };
}

function computePillarC(data) {
  const total = data.length;
  if (total === 0) return { status: 'unknown', comment: 'Chưa có dữ liệu chăm sóc sau mua.' };

  // satisfaction: 'very_satisfied' or 'satisfied' → positive
  const returning = data.filter(
    (c) =>
      c.satisfaction === 'Hài lòng' ||
      c.satisfaction === 'positive' ||
      c.satisfaction === 'very_satisfied' ||
      c.satisfaction === 'satisfied'
  ).length;
  const returnRate = total > 0 ? returning / total : 0;

  const good = returnRate >= THRESHOLDS.postPurchase.returnRate;
  const warn = returnRate >= THRESHOLDS.postPurchase.returnRate * 0.5;

  let status = 'nguy-co';
  let comment = '';
  if (good) {
    status = 'tot';
    comment = `Khách hài lòng tốt — ${(returnRate * 100).toFixed(0)}% hài lòng.`;
  } else if (warn) {
    status = 'can-cai-thien';
    comment = `Hài lòng ở mức trung bình ${(returnRate * 100).toFixed(0)}%. Cần chương trình chăm sóc tốt hơn.`;
  } else {
    status = 'nguy-co';
    comment = `Chỉ ${(returnRate * 100).toFixed(0)}% hài lòng. Cần cải thiện CSKH sau mua.`;
  }

  return { status, comment, returnRate, total };
}

function computePillarD(data) {
  const total = data.length;
  if (total === 0) return { status: 'unknown', comment: 'Chưa có dữ liệu phản hồi khách hàng.' };

  // Dùng satisfaction (không có sentiment trong data)
  const positive = data.filter(
    (c) =>
      c.satisfaction === 'very_satisfied' ||
      c.satisfaction === 'satisfied' ||
      c.satisfaction === 'positive' ||
      c.satisfaction === 'happy'
  ).length;
  const negative = data.filter(
    (c) =>
      c.satisfaction === 'Không hài lòng' ||
      c.satisfaction === 'negative' ||
      c.satisfaction === 'very_dissatisfied' ||
      c.satisfaction === 'dissatisfied' ||
      c.frustration === true ||
      c.frustration === 'true'
  ).length;
  const neutral = total - positive - negative;
  const withSatisfactionCount = data.filter((c) => c.satisfaction !== undefined).length;

  const negRate = withSatisfactionCount > 0 ? negative / withSatisfactionCount : 0;
  const posRate = withSatisfactionCount > 0 ? positive / withSatisfactionCount : 0;

  const good = negRate < THRESHOLDS.feedback.negRate && posRate >= THRESHOLDS.feedback.posRate * 0.5;
  const warn = negRate < THRESHOLDS.feedback.negRate;

  let status = 'nguy-co';
  let comment = '';
  if (good) {
    status = 'tot';
    comment = `Phản hồi tích cực — ${(posRate * 100).toFixed(0)}% hài lòng, chỉ ${(negRate * 100).toFixed(0)}% không hài lòng.`;
  } else if (warn) {
    status = 'can-cai-thien';
    comment = `Không hài lòng ở mức ${(negRate * 100).toFixed(0)}% — cần theo dõi và cải thiện.`;
  } else {
    status = 'nguy-co';
    comment = `Không hài lòng cao ${(negRate * 100).toFixed(0)}% — cần xem xét ngay phản hồi khách hàng.`;
  }

  return { status, comment, negRate, posRate, total, withSatisfactionCount };
}

// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    tot: {
      label: 'Tốt',
      cls: 'bg-[#059669]/10 text-[#059669]',
    },
    'can-cai-thien': {
      label: 'Cần cải thiện',
      cls: 'bg-[#d97706]/10 text-[#d97706]',
    },
    'nguy-co': {
      label: 'Nguy cơ',
      cls: 'bg-[#dc2626]/10 text-[#dc2626]',
    },
    unknown: {
      label: '—',
      cls: 'bg-[rgba(26,33,56,0.08)] text-[rgba(26,33,56,0.4)]',
    },
  };
  const { label, cls } = map[status] || map.unknown;
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

// ─── AI Commentary Button ──────────────────────────────────────────────────────

function AICallButton({ pillarId, industry, industryLabel }) {
  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState('');

  const handleAI = async () => {
    if (aiText) {
      setAiText('');
      return;
    }
    setLoading(true);
    try {
      await askSmaxForDisease({
        diseaseId: pillarId,
        industry,
        industryLabel,
        onChunk: () => {},
        onDone: (actions) => {
          setAiText(actions?.[0]?.description || 'Đã phân tích xong.');
          setLoading(false);
        },
        onError: () => {
          setAiText('Không thể phân tích AI lúc này.');
          setLoading(false);
        },
      });
    } catch {
      setAiText('Không thể phân tích AI lúc này.');
      setLoading(false);
    }
  };

  if (!aiText && !loading) {
    return (
      <button
        onClick={handleAI}
        className="flex items-center gap-1 text-[10px] text-tertiary font-medium hover:underline"
      >
        <Sparkles size={10} />
        Phân tích chi tiết với AI
      </button>
    );
  }

  if (loading) {
    return (
      <span className="text-[10px] text-tertiary italic flex items-center gap-1">
        <Sparkles size={10} className="animate-pulse" />
        Đang phân tích...
      </span>
    );
  }

  return (
    <div className="mt-2">
      <p className="text-[11px] text-primary opacity-70 italic leading-relaxed">{aiText}</p>
      <button onClick={handleAI} className="text-[10px] text-tertiary font-medium hover:underline mt-1">
        Đóng
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const PILLARS = [
  { id: 'lead-quality', label: 'A. Chất lượng Hội Thoại', compute: computePillarA },
  { id: 'staff-performance', label: 'B. Nhân viên Tư vấn', compute: computePillarB },
  { id: 'post-purchase', label: 'C. Chăm sóc Sau mua', compute: computePillarC },
  { id: 'feedback', label: 'D. Feedback Khách hàng', compute: computePillarD },
];

export default function RuleCommentary({ conversations = [], industry = 'thoi-trang' }) {
  const [expanded, setExpanded] = useState(false);

  // Use conversations from parent (already 7-day filtered)
  const data = conversations;

  const pillars = PILLARS.map((p) => ({
    ...p,
    result: p.compute(data),
  }));

  const visible = expanded ? pillars : pillars.slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-tertiary" />
          <h4 className="text-[13px] font-semibold text-primary">Nhận xét Tổng hợp</h4>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-[11px] text-tertiary font-medium"
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'}
          <ChevronDown
            size={12}
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {visible.map((p) => (
          <div key={p.id} className="flex items-start gap-2 py-2 border-b border-[rgba(26,33,56,0.06)] last:border-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold text-primary">{p.label}</span>
                <StatusBadge status={p.result.status} />
              </div>
              <p className="text-[11px] text-primary opacity-60 leading-relaxed">
                {p.result.comment}
              </p>
              {p.result.status !== 'unknown' && (
                <AICallButton
                  pillarId={p.id}
                  industry="fashion"
                  industryLabel="Thời trang"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
