import { MessageSquare } from 'lucide-react';
import PillarCard from './PillarCard';

/**
 * Pillar D — Feedback Khách hàng
 *
 * Dùng 'satisfaction' thay vì 'sentiment' (sentiment không có trong data).
 * satisfaction: 'very_satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very_dissatisfied'
 * frustration: boolean — báo cáo frustration
 */

const THRESHOLDS = {
  negRate: 0.15,
  warnNegRate: 0.25,
};

function computeStatus(negRate, posRate) {
  if (negRate < THRESHOLDS.negRate && posRate >= 0.4)
    return { status: 'tot', label: 'Tốt', cls: 'text-[#059669]', dot: 'bg-[#059669]' };
  if (negRate < THRESHOLDS.warnNegRate)
    return { status: 'can-cai-thien', label: 'Cần cải thiện', cls: 'text-[#d97706]', dot: 'bg-[#d97706]' };
  return { status: 'nguy-co', label: 'Nguy cơ', cls: 'text-[#dc2626]', dot: 'bg-[#dc2626]' };
}

function SentimentBar({ positive, neutral, negative, total }) {
  const pp = total > 0 ? (positive / total) * 100 : 0;
  const np = total > 0 ? (neutral / total) * 100 : 0;
  const gp = total > 0 ? (negative / total) * 100 : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex rounded-full overflow-hidden h-6 gap-px">
        {pp > 0 && (
          <div
            className="flex items-center justify-center bg-[#059669] text-white text-[10px] font-semibold"
            style={{ width: `${Math.max(pp, 4)}%` }}
          >
            {pp >= 8 ? `${pp.toFixed(0)}%` : ''}
          </div>
        )}
        {np > 0 && (
          <div
            className="flex items-center justify-center bg-[#d97706] text-white text-[10px] font-semibold"
            style={{ width: `${Math.max(np, 4)}%` }}
          >
            {np >= 8 ? `${np.toFixed(0)}%` : ''}
          </div>
        )}
        {gp > 0 && (
          <div
            className="flex items-center justify-center bg-[#dc2626] text-white text-[10px] font-semibold"
            style={{ width: `${Math.max(gp, 4)}%` }}
          >
            {gp >= 8 ? `${gp.toFixed(0)}%` : ''}
          </div>
        )}
        {total === 0 && <div className="flex-1" />}
      </div>
      <div className="flex gap-3">
        {[
          { label: 'Hài lòng', pct: pp.toFixed(0), dot: 'bg-[#059669]' },
          { label: 'Trung lập', pct: np.toFixed(0), dot: 'bg-[#d97706]' },
          { label: 'Không hài lòng', pct: gp.toFixed(0), dot: 'bg-[#dc2626]' },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${r.dot}`} />
            <span className="text-[11px] text-primary opacity-60">{r.label}</span>
            <span className="text-[11px] font-semibold text-primary">{r.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopConcerns({ data }) {
  const objections = {};
  data.forEach((c) => {
    const val = c.objection || c.pain_point;
    if (val) {
      objections[val] = (objections[val] || 0) + 1;
    }
  });
  const top = Object.entries(objections)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  if (top.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {top.map(([label, count]) => (
        <span
          key={label}
          className="text-[10px] font-medium bg-[rgba(26,33,56,0.06)] text-primary px-2 py-1 rounded-full"
        >
          {label} ({count})
        </span>
      ))}
    </div>
  );
}

export default function PillarFeedback({ conversations = [] }) {
  const data = conversations;
  const total = data.length;

  // satisfaction: map to positive / neutral / negative
  const positive = data.filter(
    (c) =>
      c.satisfaction === 'Hài lòng' ||
      c.satisfaction === 'positive' ||
      c.satisfaction === 'very_satisfied' ||
      c.satisfaction === 'satisfied'
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
  const statusInfo = computeStatus(negRate, posRate);

  // Competitor mentions (fsh-5, spa-5, cos-5 templates)
  const competitorMentions = {};
  conversations.forEach((c) => {
    const name =
      c.competitor_name ||
      c.data_json?.competitor_name ||
      c.competitor;
    if (name) competitorMentions[name] = (competitorMentions[name] || 0) + 1;
  });
  const topCompetitors = Object.entries(competitorMentions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const competitorRate = conversations.length > 0
    ? Object.values(competitorMentions).reduce((s, n) => s + n, 0) / conversations.length
    : 0;

  // Criteria so sánh (khi khách nhắc competitor)
  const criteriaCount = {};
  conversations.forEach((c) => {
    const crit = c.criteria || c.data_json?.criteria;
    if (crit) criteriaCount[crit] = (criteriaCount[crit] || 0) + 1;
  });
  const topCriteria = Object.entries(criteriaCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Pain points (fsh-1, mbb-1, spa-1, cos-1...)
  const painPointCount = {};
  conversations.forEach((c) => {
    const pp = c.pain_point || c.data_json?.pain_point || c.painPoint;
    if (pp) painPointCount[pp] = (painPointCount[pp] || 0) + 1;
  });
  const topPainPoints = Object.entries(painPointCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Objections (fsh-2, spa-2, cos-2...)
  const objectionCount = {};
  conversations.forEach((c) => {
    const obj = c.objection || c.data_json?.objection;
    if (obj) objectionCount[obj] = (objectionCount[obj] || 0) + 1;
  });
  const topObjections = Object.entries(objectionCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Customer interest trends — Budget + Location
  const budgetCount = {};
  const locationCount = {};
  conversations.forEach((c) => {
    const budget = c.budget || c.data_json?.budget;
    const location = c.location || c.data_json?.location;
    if (budget) budgetCount[budget] = (budgetCount[budget] || 0) + 1;
    if (location) locationCount[location] = (locationCount[location] || 0) + 1;
  });
  const topBudgets = Object.entries(budgetCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const topLocations = Object.entries(locationCount).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <PillarCard
      icon={MessageSquare}
      title="Feedback Khách hàng"
      iconBg="bg-[#d97706]/10"
      iconTextColor="text-[#d97706]"
      chart={
        <div className="flex flex-col gap-3">
          {withSatisfactionCount === 0 ? (
            <p className="text-[11px] text-primary opacity-40 italic">
              Chưa có dữ liệu satisfaction.
            </p>
          ) : (
            <>
              <SentimentBar
                positive={positive}
                neutral={neutral}
                negative={negative}
                total={withSatisfactionCount}
              />
              <div>
                <span className="text-[11px] text-primary opacity-50 mb-1 block">
                  Phản hồi nổi bật
                </span>
                <TopConcerns data={data} />
              </div>

              {/* Đối thủ cạnh tranh */}
              {topCompetitors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-primary opacity-50">Đối thủ được nhắc đến</span>
                    {competitorRate > 0.1 && (
                      <span className="text-[10px] text-[#dc2626] font-semibold">⚠️ {(competitorRate * 100).toFixed(0)}%</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    {topCompetitors.map(([name, count]) => (
                      <div key={name} className="flex items-center justify-between">
                        <span className="text-[11px] text-primary opacity-70">{name}</span>
                        <span className="text-[11px] font-semibold text-[#dc2626]">{count}x</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tiêu chí so sánh */}
              {topCriteria.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-primary opacity-50">Tiêu chí so sánh</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {topCriteria.map(([crit, count]) => (
                      <span key={crit} className="text-[10px] px-2 py-0.5 rounded-full bg-[#d97706]/10 text-[#d97706] font-medium">
                        {crit} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pain Points + Objections */}
              {(topPainPoints.length > 0 || topObjections.length > 0) && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-primary opacity-50">Thắc mắc phổ biến</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {[...topPainPoints, ...topObjections].slice(0, 4).map(([item, count], i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-[11px] text-primary opacity-60 truncate max-w-[120px]">{item}</span>
                        <span className="text-[11px] font-semibold text-primary shrink-0 ml-2">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Xu hướng quan tâm — Budget + Location */}
              {(topBudgets.length > 0 || topLocations.length > 0) && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-primary opacity-50">Xu hướng quan tâm</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {topBudgets.slice(0, 2).map(([budget, count]) => (
                      <div key={budget} className="flex items-center justify-between">
                        <span className="text-[11px] text-primary opacity-60">💰 {budget}</span>
                        <span className="text-[11px] font-semibold text-primary">{count}</span>
                      </div>
                    ))}
                    {topLocations.slice(0, 2).map(([loc, count]) => (
                      <div key={loc} className="flex items-center justify-between">
                        <span className="text-[11px] text-primary opacity-60">📍 {loc}</span>
                        <span className="text-[11px] font-semibold text-primary">{count}</span>
                      </div>
                    ))}
                  </div>
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
            · {withSatisfactionCount > 0
              ? `${positive} hài lòng / ${negative} không hài lòng`
              : 'Chưa có dữ liệu'}
          </span>
        </div>
      }
    />
  );
}
