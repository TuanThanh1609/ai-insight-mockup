import { ArrowLeftRight } from 'lucide-react';
import PillarCard from './PillarCard';

/**
 * Pillar C — Chăm sóc Sau mua
 *
 * Xem có đang chăm lại khách cũ không:
 * - Tỉ lệ khách quay lại (is_returning_customer)
 * - Active care rate (gửi ưu đãi, hỏi han, feedback)
 */

const THRESHOLDS = {
  returnRate: 0.20,  // >20% quay lại = tốt
  warnReturnRate: 0.10, // >10% = cải thiện
};

function computeStatus(returnRate) {
  if (returnRate >= THRESHOLDS.returnRate)
    return { status: 'tot', label: 'Tốt', cls: 'text-[#059669]', dot: 'bg-[#059669]' };
  if (returnRate >= THRESHOLDS.warnReturnRate)
    return { status: 'can-cai-thien', label: 'Cần cải thiện', cls: 'text-[#d97706]', dot: 'bg-[#d97706]' };
  return { status: 'nguy-co', label: 'Nguy cơ', cls: 'text-[#dc2626]', dot: 'bg-[#dc2626]' };
}

// Simple donut using SVG
function DonutChart({ returning, notReturning }) {
  const total = returning + notReturning;
  const returningPct = total > 0 ? (returning / total) * 100 : 0;
  const notPct = total > 0 ? (notReturning / total) * 100 : 0;

  // SVG donut: stroke-dasharray trick
  const R = 30;
  const C = 2 * Math.PI * R;
  const returningDash = (returningPct / 100) * C;
  const notDash = (notPct / 100) * C;

  return (
    <div className="flex items-center gap-4">
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Background ring */}
        <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(26,33,56,0.08)" strokeWidth="10" />
        {/* Returning arc */}
        <circle
          cx="40"
          cy="40"
          r={R}
          fill="none"
          stroke="#059669"
          strokeWidth="10"
          strokeDasharray={`${returningDash} ${C - returningDash}`}
          strokeDashoffset={C * 0.25} // start from top
          strokeLinecap="butt"
        />
        {/* Center text */}
        <text x="40" y="44" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1A2138">
          {returningPct.toFixed(0)}%
        </text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {[
          { label: 'Quay lại', value: returning, color: '#059669' },
          { label: 'Không quay lại', value: notReturning, color: 'rgba(26,33,56,0.2)' },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
            <span className="text-[11px] text-primary opacity-60">{r.label}</span>
            <span className="text-[11px] font-semibold text-primary">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PillarPostPurchase({ conversations = [] }) {
  const data = conversations;
  const total = data.length;
  // satisfaction: available in data_json. Map: happy/positive → returning
  // satisfaction values: 'very_satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very_dissatisfied'
  const satisfactionReturning = data.filter(
    (c) =>
      c.satisfaction === 'very_satisfied' ||
      c.satisfaction === 'satisfied' ||
      c.satisfaction === 'happy' ||
      c.satisfaction === 'positive'
  ).length;

  // Returning customers — actual repeat buyers
  const returningCustomers = data.filter(
    (c) =>
      c.is_returning_customer === true ||
      c.is_returning_customer === 'true' ||
      c.is_returning === true
  ).length;
  const notReturning = total - returningCustomers;
  const returnRate = total > 0 ? returningCustomers / total : 0;
  const statusInfo = computeStatus(returnRate);

  // Satisfaction breakdown
  const satHaiLong = conversations.filter(
    (c) =>
      c.satisfaction === 'Hài lòng' ||
      c.satisfaction === 'Rất hài lòng' ||
      c.satisfaction === 'very_satisfied' ||
      c.satisfaction === 'satisfied'
  ).length;
  const satTrungBinh = conversations.filter(
    (c) =>
      c.satisfaction === 'Trung bình' ||
      c.satisfaction === 'average' ||
      c.satisfaction === 'neutral'
  ).length;
  const satKhongHaiLong = conversations.filter(
    (c) =>
      c.satisfaction === 'Không hài lòng' ||
      c.satisfaction === 'Rất không hài lòng' ||
      c.satisfaction === 'dissatisfied' ||
      c.satisfaction === 'very_dissatisfied'
  ).length;

  // Can refer — positive word-of-mouth
  const canRefer = conversations.filter(
    (c) => c.can_refer === true || c.can_refer === 'true' || c.refer_possible === true
  ).length;
  const referRate = total > 0 ? canRefer / total : 0;

  // Urgency signal — frustration flags
  const urgencyCases = conversations.filter(
    (c) =>
      c.frustration === true ||
      c.frustration === 'true' ||
      c.urgency === true ||
      c.urgency === 'urgent'
  ).length;

  return (
    <PillarCard
      icon={ArrowLeftRight}
      title="Chăm sóc Sau mua"
      iconBg="bg-[#059669]/10"
      iconTextColor="text-[#059669]"
      chart={
        <div className="flex flex-col gap-3">
          {total === 0 ? (
            <p className="text-[11px] text-primary opacity-40 italic">Chưa có dữ liệu.</p>
          ) : (
            <>
              <DonutChart returning={returningCustomers} notReturning={notReturning} />
              <div className="flex items-center justify-between py-2 border-t border-[rgba(26,33,56,0.06)]">
                <span className="text-[11px] text-primary opacity-50">Khách quay lại</span>
                <span className="text-[13px] font-bold text-[#059669]">
                  {returningCustomers}/{total}
                </span>
              </div>

              {/* Satisfaction breakdown */}
              {(satHaiLong + satTrungBinh + satKhongHaiLong) > 0 && (
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-primary opacity-50">Mức độ hài lòng</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#059669]">✓ Hài lòng</span>
                      <span className="text-[11px] font-semibold text-[#059669]">{satHaiLong}</span>
                    </div>
                    {satTrungBinh > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#d97706]">◯ Trung bình</span>
                        <span className="text-[11px] font-semibold text-[#d97706]">{satTrungBinh}</span>
                      </div>
                    )}
                    {satKhongHaiLong > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#dc2626]">✗ Không hài lòng</span>
                        <span className="text-[11px] font-semibold text-[#dc2626]">{satKhongHaiLong}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Refer / Giới thiệu */}
              {referRate > 0 && (
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-primary opacity-50">Có thể giới thiệu</span>
                  </div>
                  <div className="bg-[rgba(26,33,56,0.06)] rounded-full h-2">
                    <div
                      className="h-full rounded-full bg-[#059669]"
                      style={{ width: `${Math.min(referRate * 100 * 5, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-primary opacity-50">{canRefer} khách có thể giới thiệu</span>
                </div>
              )}

              {/* Urgency / Bức xúc cases */}
              {urgencyCases > 0 && (
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-[#dc2626]/5">
                  <span className="text-[11px] text-[#dc2626] font-semibold">⚠️ {urgencyCases} tín hiệu bức xúc</span>
                  <span className="text-[11px] text-primary opacity-50">— cần CSKH xử lý ngay</span>
                </div>
              )}
            </>
          )}
        </div>
      }
      commentary={
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${statusInfo.dot}`} />
          <span className={`text-[11px] font-semibold ${statusInfo.cls}`}>{statusInfo.label}</span>
          <span className="text-[11px] text-primary opacity-50 truncate">
            · {total > 0 ? `${(returnRate * 100).toFixed(0)}% quay lại` : 'Chưa có dữ liệu'}
          </span>
        </div>
      }
    />
  );
}
