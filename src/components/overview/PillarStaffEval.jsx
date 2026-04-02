import { Users } from 'lucide-react';
import PillarCard from './PillarCard';

/**
 * Pillar B — Nhân viên Tư vấn
 *
 * Đánh giá tình hình tư vấn bán hàng của nhân viên:
 * - Tỉ lệ chốt đơn (chot_don)
 * - Tỉ lệ bỏ sót hội thoại (missed_conv)
 * - Tỉ lệ khách im lặng (silent_cust)
 */

const THRESHOLDS = {
  chotRate: 0.30,    // >30% chốt = tốt
  missedRate: 0.10,   // <10% bỏ sót = tốt
  silentRate: 0.15,   // <15% im lặng = tốt
};

function computeStatus({ chotRate, missedRate, silentRate }) {
  const good = chotRate >= THRESHOLDS.chotRate && missedRate < THRESHOLDS.missedRate;
  if (good) return { status: 'tot', label: 'Tốt', cls: 'text-[#059669]', dot: 'bg-[#059669]' };
  if (chotRate >= THRESHOLDS.chotRate * 0.5) return { status: 'can-cai-thien', label: 'Cần cải thiện', cls: 'text-[#d97706]', dot: 'bg-[#d97706]' };
  return { status: 'nguy-co', label: 'Nguy cơ', cls: 'text-[#dc2626]', dot: 'bg-[#dc2626]' };
}

function MetricBar({ label, value, total, color }) {
  const rate = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-primary opacity-60">{label}</span>
        <span className="text-[11px] font-semibold" style={{ color }}>
          {value} ({rate.toFixed(0)}%)
        </span>
      </div>
      <div className="bg-[rgba(26,33,56,0.06)] rounded-full h-2">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.max(rate, 4)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function PillarStaffEval({ conversations = [] }) {
  const data = conversations;
  const total = data.length;

  // Staff eval fields — boolean hoặc string 'true'
  const chot = data.filter(
    (r) => r.chot_don === true || r.chot_don === 'true'
  ).length;
  const missed = data.filter(
    (r) => r.missed_conv === true || r.missed_conv === 'true'
  ).length;
  const silent = data.filter(
    (r) => r.silent_cust === true || r.silent_cust === 'true'
  ).length;

  const chotRate = total > 0 ? chot / total : 0;
  const missedRate = total > 0 ? missed / total : 0;
  const silentRate = total > 0 ? silent / total : 0;
  const statusInfo = computeStatus({ chotRate, missedRate, silentRate });

  // Attitude breakdown (from attitude field — available in staff-eval templates: fsh-3, mbb-3, spa-3, cos-3...)
  const goodAttitude = data.filter(
    (c) => c.attitude === 'Tốt' || c.attitude === 'good' || c.attitude === 'positive'
  ).length;
  const avgAttitude = data.filter(
    (c) => c.attitude === 'Trung bình' || c.attitude === 'average' || c.attitude === 'avg'
  ).length;
  const poorAttitude = data.filter(
    (c) => c.attitude === 'Kém' || c.attitude === 'poor' || c.attitude === 'negative'
  ).length;
  const withAttitude = goodAttitude + avgAttitude + poorAttitude;
  const goodAttitudeRate = withAttitude > 0 ? goodAttitude / withAttitude : 0;

  // Mistakes (from mistake field)
  const mistakeCount = {};
  data.forEach((c) => {
    const m = c.mistake || c.data_json?.mistake;
    if (m) mistakeCount[m] = (mistakeCount[m] || 0) + 1;
  });
  const topMistakes = Object.entries(mistakeCount).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // Staff scenario performance
  const scenarioCount = {};
  data.forEach((c) => {
    const s = c.scenario || c.data_json?.scenario;
    if (s) scenarioCount[s] = (scenarioCount[s] || 0) + 1;
  });
  const topScenarios = Object.entries(scenarioCount).sort((a, b) => b[1] - a[1]).slice(0, 2);

  return (
    <PillarCard
      icon={Users}
      title="Nhân viên Tư vấn"
      iconBg="bg-[#8b5cf6]/10"
      iconTextColor="text-[#8b5cf6]"
      chart={
        <div className="flex flex-col gap-2.5">
          <MetricBar label="Chốt đơn thành công" value={chot} total={total} color="#059669" />
          <MetricBar label="Bỏ sót hội thoại" value={missed} total={total} color="#dc2626" />
          <MetricBar label="Khách im lặng" value={silent} total={total} color="#d97706" />

          {/* Attitude breakdown */}
          {withAttitude > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-primary opacity-50">Thái độ tư vấn</span>
              </div>
              <div className="flex gap-2 text-[10px]">
                <span className="text-[#059669] font-semibold">✓ Tốt {goodAttitude} ({(goodAttitudeRate * 100).toFixed(0)}%)</span>
                {avgAttitude > 0 && <span className="text-[#d97706]">◯ TB {avgAttitude}</span>}
                {poorAttitude > 0 && <span className="text-[#dc2626]">✗ Kém {poorAttitude}</span>}
              </div>
            </div>
          )}

          {/* Top mistakes */}
          {topMistakes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-primary opacity-50">Lỗi mất khách phổ biến</span>
              </div>
              <div className="flex flex-col gap-1">
                {topMistakes.map(([mistake, count]) => (
                  <div key={mistake} className="flex items-center justify-between">
                    <span className="text-[11px] text-primary opacity-60 truncate max-w-[100px]">{mistake}</span>
                    <span className="text-[11px] font-semibold text-[#dc2626]">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top selling scenarios */}
          {topScenarios.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-primary opacity-50">Kịch bản bán hàng</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {topScenarios.map(([scenario, count]) => (
                  <span key={scenario} className="text-[10px] px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-medium">
                    {scenario} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      }
      commentary={
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${statusInfo.dot}`} />
          <span className={`text-[11px] font-semibold ${statusInfo.cls}`}>{statusInfo.label}</span>
          <span className="text-[11px] text-primary opacity-50 truncate">
            · {total > 0 ? `${chot} chốt / ${missed} bỏ sót` : 'Chưa có dữ liệu'}
          </span>
        </div>
      }
    />
  );
}
