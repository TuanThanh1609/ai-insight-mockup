/**
 * adsMedicalService.js
 *
 * Logic chẩn đoán "Khám Bệnh Ads" — Chuyên gia Smax
 *
 * 8 nhóm bệnh được phân tích từ attribution data + campaign performance metrics.
 *
 * Luồng:
 *   1. loadAttributionData(campaignIds, dateRange)  → attribution rows
 *   2. computeAdsDiagnosis(attributionData, campaigns, savedActionIds)
 *      → 8 disease groups với metrics + Smax recommendations
 *   3. getAdsHealthScore(diseases)                   → điểm tổng 0-10
 *   4. saveAdsMedicalRecord(record)                   → localStorage
 *   5. getAdsMedicalHistory()                         → lịch sử khám
 *   6. generateAdsInterpretation(disease, ...)        → prose tiếng Việt
 */

import { mockCampaigns } from '../data/mockCampaigns';
import { mockAIInsights } from '../data/mockAIInsights';

// ─── Disease Group Definitions ─────────────────────────────────────────────

export const ADS_DISEASE_GROUPS = [
  {
    id: 'roas-health',
    code: 'RA',
    label: 'ROAS Thực vs Ảo',
    icon: '📊',
    metrics: [
      { key: 'roasOriginal',       label: 'ROAS gốc',             format: 'roas' },
      { key: 'roasActual',         label: 'ROAS thực',              format: 'roas' },
      { key: 'roasGap',            label: 'Lệch',                   format: 'percent' },
      { key: 'untrackedRevenue',   label: 'Untracked Revenue',      format: 'currency' },
      { key: 'matchedRate',        label: 'Tỉ lệ match',            format: 'percent' },
    ],
  },
  {
    id: 'attribution-quality',
    code: 'AQ',
    label: 'Attribution Quality',
    icon: '💰',
    metrics: [
      { key: 'matchedRate',          label: 'Tỉ lệ match',           format: 'percent' },
      { key: 'unmatchedCount',       label: 'Unmatched Orders',       format: 'number' },
      { key: 'avgDaysToConversion',  label: 'Avg Days to Conversion', format: 'days' },
    ],
  },
  {
    id: 'ad-creative',
    code: 'AC',
    label: 'Ad Creative Health',
    icon: '🎨',
    metrics: [
      { key: 'ctr',            label: 'Click-Through Rate',   format: 'percent' },
      { key: 'hookRetention',   label: 'Hook Retention',       format: 'percent' },
      { key: 'scrollStopRate',  label: 'Scroll Stop Rate',    format: 'percent' },
    ],
  },
  {
    id: 'audience-targeting',
    code: 'AT',
    label: 'Audience Targeting',
    icon: '🎯',
    metrics: [
      { key: 'overlapPercent',    label: 'Audience Overlap',       format: 'percent' },
      { key: 'ageMatchRate',     label: 'Đúng độ tuổi mục tiêu', format: 'percent' },
      { key: 'interestAccuracy', label: 'Interest Accuracy',      format: 'percent' },
    ],
  },
  {
    id: 'budget-allocation',
    code: 'BA',
    label: 'Budget Allocation',
    icon: '💸',
    metrics: [
      { key: 'dailyUtilization', label: 'Chi ngân sách hàng ngày', format: 'percent' },
      { key: 'hourlySpread',     label: 'Phân bổ theo giờ',        format: 'percent' },
      { key: 'campaignBalance',  label: 'Cân bằng chiến dịch',     format: 'percent' },
    ],
  },
  {
    id: 'platform-performance',
    code: 'PP',
    label: 'Platform Performance',
    icon: '📱',
    metrics: [
      { key: 'fbRoas',          label: 'Facebook ROAS',      format: 'roas' },
      { key: 'zaloRoas',        label: 'Zalo ROAS',          format: 'roas' },
      { key: 'fbRevenueShare',  label: 'Facebook Revenue %', format: 'percent' },
    ],
  },
  {
    id: 'lead-order-conversion',
    code: 'LC',
    label: 'Lead → Order Conversion',
    icon: '🔁',
    metrics: [
      { key: 'hotToOrderRate',  label: 'Nóng → Đơn',  format: 'percent' },
      { key: 'warmToOrderRate', label: 'Ấm → Đơn',   format: 'percent' },
      { key: 'coldToOrderRate', label: 'Lạnh → Đơn', format: 'percent' },
    ],
  },
  {
    id: 'junk-campaigns',
    code: 'CR',
    label: 'Chiến Dịch Rác',
    icon: '⚠️',
    metrics: [
      { key: 'junkRate',   label: 'Junk Rate',    format: 'percent' },
      { key: 'qualityRate', label: 'Quality Rate', format: 'percent' },
      { key: 'spamRate',  label: 'Spam Rate',   format: 'percent' },
    ],
  },
];

// ─── Chuyên gia Smax — Rule-based Recommendations ────────────────────────

export const ADS_SMAX_RECOMMENDATIONS = {
  'roas-health': [
    {
      id: 'rq-ra-1',
      priority: 'HIGH',
      title: 'Thêm UTM parameter vào tất cả ads',
      impact: '↑ match rate 40%',
      description:
        'Gắn UTM source/medium/campaign vào mọi đường link trong ads. Điều này giúp platform nhận diện nguồn chuyển đổi chính xác, tăng tỉ lệ match lên đến 40%.',
    },
    {
      id: 'rq-ra-2',
      priority: 'MEDIUM',
      title: 'Cài đặt Pixel events cho Add to Cart',
      impact: '↑ attribution 25%',
      description:
        'Khi khách click "Thêm vào giỏ" — fire Pixel event add_to_cart. Điều này giúp Facebook/Zalo hiểu hành vi khách sâu hơn và ghi nhận conversion chính xác hơn.',
    },
    {
      id: 'rq-ra-3',
      priority: 'MEDIUM',
      title: 'Script Zalo OA tracking cho offline conversions',
      impact: '↑ Zalo match 60%',
      description:
        'Cài Zalo OA conversation tracking kết hợp với customer hash để match khách từ Zalo ads với đơn hàng thực tế — đặc biệt quan trọng với chiến dịch Zalo.',
    },
  ],
  'attribution-quality': [
    {
      id: 'rq-aq-1',
      priority: 'HIGH',
      title: 'Cài Server-Side Conversions API',
      impact: '↑ match rate 35%',
      description:
        'Conversions API gửi event trực tiếp từ server, không phụ thuộc browser pixel. Giảm event loss do trình duyệt chặn, đặc biệt trên iOS 14.5+.',
    },
    {
      id: 'rq-aq-2',
      priority: 'MEDIUM',
      title: 'Deduplicate Pixel + CAPI events',
      impact: '↓ event mismatch 20%',
      description:
        'Cấu hình deduplication rule giữa Pixel (client) và CAPI (server) để mỗi conversion chỉ được tính một lần — tránh inflated ROAS và improved optimization.',
    },
    {
      id: 'rq-aq-3',
      priority: 'MEDIUM',
      title: 'Upload offline conversions file hàng tuần',
      impact: '↑ ROAS reporting accuracy 30%',
      description:
        'Export đơn hàng từ POS/ERP → upload file offline conversions lên Meta. Đặc biệt cần thiết cho các đơn hàng qua điện thoại hoặc offline store.',
    },
  ],
  'ad-creative': [
    {
      id: 'rq-ac-1',
      priority: 'HIGH',
      title: 'A/B test creative mới mỗi tuần',
      impact: '↑ CTR 25%',
      description:
        'Creative fatigue là kẻ thù của ROAS. Thay creative mới (hình, video, copy) mỗi tuần để duy trì freshness và giảm cost per result.',
    },
    {
      id: 'rq-ac-2',
      priority: 'MEDIUM',
      title: 'Tập trung vào video ngắn 15-30s cho Hook Retention',
      impact: '↑ hook retention 40%',
      description:
        'Video 15-30s giữ chân người xem hiệu quả hơn long-form. Thiết kế hook trong 3 giây đầu: problem → solution → CTA.',
    },
    {
      id: 'rq-ac-3',
      priority: 'MEDIUM',
      title: 'Scroll Stop Rate — thiết kế frame đầu tiên gây tò mò',
      impact: '↑ scroll stop 30%',
      description:
        'Frame đầu tiên quyết định 80% scroll stop rate. Dùng contrast cao, text overlay rõ ràng, và hook question trong 1.5 giây đầu.',
    },
  ],
  'audience-targeting': [
    {
      id: 'rq-at-1',
      priority: 'HIGH',
      title: 'Tách audience camp-1 và camp-2 bằng Lookalike vs Retargeting',
      impact: '↓ overlap 30%',
      description:
        'Nếu 2 chiến dịch cùng targeting — khách nhìn thấy ads 2 lần gây wasted impression. Tách: campaign mới = Lookalike, campaign retargeting = website visitors 30-day.',
    },
    {
      id: 'rq-at-2',
      priority: 'MEDIUM',
      title: 'Narrow audience bằng stacked targeting (interest + behavior)',
      impact: '↑ quality rate 35%',
      description:
        'Thay vì 1 interest rộng, stack 2-3 interest có liên quan + demographic filter. Audience nhỏ hơn nhưng quality cao hơn đáng kể.',
    },
    {
      id: 'rq-at-3',
      priority: 'MEDIUM',
      title: 'Age/gender performance audit hàng tuần',
      impact: '↓ wasted spend 20%',
      description:
        'Kiểm tra breakdown theo tuổi và giới tính. Loại bỏ age group có ROAS < breakeven, tập trung budget vào nhóm có hiệu quả cao nhất.',
    },
  ],
  'budget-allocation': [
    {
      id: 'rq-ba-1',
      priority: 'HIGH',
      title: 'Rule-based auto bid cho giờ cao điểm',
      impact: '↑ daily utilization 20%',
      description:
        'Cài bid strategy tăng bid 20-30% trong khung 19h-22h (giờ khách online nhiều nhất). Giảm bid 50% lúc 2h-6h khi audience size thấp.',
    },
    {
      id: 'rq-ba-2',
      priority: 'MEDIUM',
      title: 'Căn chỉnh lại budget giữa chiến dịch theo ROAS contribution',
      impact: '↑ portfolio ROAS 15%',
      description:
        'Tính ROAS contribution (revenue × ROAS) của mỗi campaign. Shift 20% budget từ campaign ROAS thấp sang campaign ROAS cao hàng tuần.',
    },
    {
      id: 'rq-ba-3',
      priority: 'MEDIUM',
      title: 'Dayparting — chạy ads theo giờ cố định trong ngày',
      impact: '↓ cost per result 18%',
      description:
        'Phân tích conversion log → xác định 3-4 khung giờ có CPA thấp nhất → chạy ads tập trung vào các khung này, tắt giờ còn lại.',
    },
  ],
  'platform-performance': [
    {
      id: 'rq-pp-1',
      priority: 'HIGH',
      title: 'Tăng budget cho nền tảng có ROAS cao hơn',
      impact: '↑ portfolio ROAS 20%',
      description:
        'So sánh FB vs Zalo ROAS trong 30 ngày. Nếu Zalo ROAS > FB 50%, shift 30% budget sang Zalo và ngược lại.',
    },
    {
      id: 'rq-pp-2',
      priority: 'MEDIUM',
      title: 'Cross-platform remarketing giữa FB và Zalo',
      impact: '↑ revenue 15%',
      description:
        'Dùng Zalo OA audience để create FB Lookalike, và ngược lại. Khách đã tương tác trên 1 nền tảng có likelihood cao hơn convert trên nền tảng khác.',
    },
    {
      id: 'rq-pp-3',
      priority: 'MEDIUM',
      title: 'FB Advantage+ Shopping campaigns cho catalog selling',
      impact: '↑ FB ROAS 25%',
      description:
        'Nếu đang bán sản phẩm cụ thể — chuyển sang Advantage+ catalog ads. Algorithm tự động find best audience cho từng sản phẩm.',
    },
  ],
  'lead-order-conversion': [
    {
      id: 'rq-lc-1',
      priority: 'HIGH',
      title: 'Retargeting "Hot Lead" trong 24h bằng Zalo Message',
      impact: '↑ hot→order 30%',
      description:
        'Khách có temperature = "Nóng" (hỏi giá, hỏi còn hàng) mà chưa đặt → gửi Zalo Message cá nhân trong 24h. Momentum còn "nóng" — conversion rate cao gấp 3 lần.',
    },
    {
      id: 'rq-lc-2',
      priority: 'MEDIUM',
      title: 'Nurture sequence cho "Warm Lead" — 3 tin nhắn trong 7 ngày',
      impact: '↑ warm→order 25%',
      description:
        'Warm lead (đang tư vấn nhưng chưa chốt) cần nurture. Gửi 3 tin: day-1 (ưu đãi), day-3 (social proof), day-7 (urgency/scarcity).',
    },
    {
      id: 'rq-lc-3',
      priority: 'MEDIUM',
      title: 'Re-engagement campaign cho "Cold Lead" sau 30 ngày',
      impact: '↑ cold→order 10%',
      description:
        'Cold lead không mua trong 7 ngày đầu → cho vào re-engagement sequence. Sau 30 ngày gửi "special offer" hoặc new product launch để reignite interest.',
    },
  ],
  'junk-campaigns': [
    {
      id: 'rq-cr-1',
      priority: 'HIGH',
      title: 'Tạm dừng chiến dịch có junk rate > 50%',
      impact: '↓ wasted spend 40%',
      description:
        'Junk rate > 50% nghĩa là hơn 1/2 ngân sách bị lãng phí. Tạm dừng ngay, audit targeting và creative trước khi restart với audience mới.',
    },
    {
      id: 'rq-cr-2',
      priority: 'MEDIUM',
      title: 'Thêm pre-screening question trong ad creative',
      impact: '↓ junk rate 25%',
      description:
        'Đặt câu hỏi trong ad copy như "Bạn đang quan tâm đến [sản phẩm X]?" — khách tự sàng lọc trước khi click, giảm junk click từ đầu.',
    },
    {
      id: 'rq-cr-3',
      priority: 'MEDIUM',
      title: 'Exclude engagement_customizers trong audience',
      impact: '↓ spam rate 30%',
      description:
        'Trong audience settings, exclude people who engaged with your Page/content but didn\'t convert. Nhóm này có spam-like behavior và ROAS thấp bất thường.',
    },
  ],
};

// ─── Seeded PRNG — deterministic mock data ────────────────────────────────

function sr(seed) {
  let s = Math.sin(seed * 9301 + 49297) * 233280;
  return s - Math.floor(s);
}

// ─── Attribution Data Generation ─────────────────────────────────────────

/**
 * Generate attribution rows from campaigns.
 * In production this would come from analytics integrations (Meta, Zalo, Google).
 * For now: deterministic mock derived from campaign data.
 */
function generateAttributionRow(campaign, rowIndex) {
  const seed = campaign.id.length * 100 + rowIndex * 7;
  const rng  = (offset = 0) => sr(seed + offset);

  // ROAS gap: 10-35% of revenue is untracked
  const untrackedRatio  = 0.10 + rng(1) * 0.25;
  const roasOriginal     = campaign.spend > 0 ? campaign.revenue / campaign.spend : 1;
  const untrackedRev    = Math.round(campaign.revenue * untrackedRatio);
  const roasActual      = (campaign.revenue - untrackedRev) / campaign.spend;
  const roasGap         = roasOriginal - roasActual;
  const matchedRate     = Math.round((1 - untrackedRatio) * 100);

  // Attribution quality
  const unmatchedCount  = Math.round(campaign.ordersCount * untrackedRatio * rng(2));
  const avgDaysToConversion = Math.round(1 + rng(3) * 7);

  // Ad creative (derived from CTR proxy = clicks/impressions)
  const ctr             = campaign.impressions > 0
    ? Math.round((campaign.clicks / campaign.impressions) * 10000) / 100
    : 1 + rng(4) * 2;
  const hookRetention   = Math.round(50 + rng(5) * 35); // 50-85%
  const scrollStopRate  = Math.round(20 + rng(6) * 35); // 20-55%

  // Audience targeting
  const overlapPercent  = Math.round(5 + rng(7) * 30);   // 5-35%
  const ageMatchRate    = Math.round(55 + rng(8) * 35);  // 55-90%
  const interestAccuracy = Math.round(50 + rng(9) * 35);  // 50-85%

  // Budget allocation
  const dailyUtilization = Math.round(65 + rng(10) * 30); // 65-95%
  const hourlySpread     = Math.round(20 + rng(11) * 60); // 20-80% spread
  const campaignBalance  = Math.round(40 + rng(12) * 50); // 40-90%

  // Lead → Order conversion (from AI insights)
  const aiInsight = mockAIInsights[campaign.id] || {};
  const { metrics: aiMetrics = {} } = aiInsight;
  const hotToOrder  = aiMetrics.hotLeads
    ? Math.round((aiMetrics.hotLeads / (campaign.leads || 1)) * 100)
    : Math.round(20 + rng(13) * 25);
  const warmToOrder = aiMetrics.warmLeads
    ? Math.round((aiMetrics.warmLeads / (campaign.leads || 1)) * 100)
    : Math.round(8 + rng(14) * 18);
  const coldToOrder = aiMetrics.coldLeads
    ? Math.round((aiMetrics.coldLeads / (campaign.leads || 1)) * 100)
    : Math.round(1 + rng(15) * 6);

  // Junk campaigns (from AI insights)
  const junkRate   = aiMetrics.junkRate   ?? Math.round(rng(16) * 50);
  const qualityRate = aiMetrics.qualityRate ?? Math.round(30 + rng(17) * 50);
  const spamRate   = aiMetrics.spamRate   ?? Math.round(rng(18) * 25);

  return {
    campaignId: campaign.id,
    campaignName: campaign.name,
    platform: campaign.platform,
    // ROAS Health
    roasOriginal,
    roasActual: parseFloat(roasActual.toFixed(2)),
    roasGap: parseFloat(roasGap.toFixed(2)),
    untrackedRevenue: untrackedRev,
    matchedRate,
    // Attribution Quality
    unmatchedCount,
    avgDaysToConversion,
    // Ad Creative
    ctr,
    hookRetention,
    scrollStopRate,
    // Audience
    overlapPercent,
    ageMatchRate,
    interestAccuracy,
    // Budget
    dailyUtilization,
    hourlySpread,
    campaignBalance,
    // Lead Order
    hotToOrderRate: Math.min(hotToOrder, 100),
    warmToOrderRate: Math.min(warmToOrder, 100),
    coldToOrderRate: Math.min(coldToOrder, 100),
    // Junk
    junkRate: Math.min(junkRate, 100),
    qualityRate: Math.min(qualityRate, 100),
    spamRate: Math.min(spamRate, 100),
  };
}

/**
 * Load attribution data filtered by campaign IDs and date range.
 * @param {string[]} campaignIds - filter by campaign IDs (empty = all)
 * @param {{ start: string, end: string }} dateRange
 * @returns {Array} attribution rows
 */
export function loadAttributionData(campaignIds = [], dateRange = null) {
  const campaigns = campaignIds.length > 0
    ? mockCampaigns.filter(c => campaignIds.includes(c.id))
    : mockCampaigns;

  const rows = [];
  campaigns.forEach(campaign => {
    // Each campaign contributes 3 attribution rows (to have multi-row data)
    for (let i = 0; i < 3; i++) {
      rows.push(generateAttributionRow(campaign, i));
    }
  });

  // Apply date range filter if provided (mock: just return all for now)
  if (dateRange) {
    // In production: filter rows by dateField inside each row
    // Mock data doesn't have dates so we skip
  }

  return rows;
}

// ─── Aggregate Attribution Metrics ────────────────────────────────────────

/**
 * Compute attribution metrics across all rows and campaigns.
 * @param {Array} data - attribution rows from loadAttributionData
 * @param {Array} campaigns - campaign objects
 * @returns {Object} aggregated metrics per disease group
 */
export function computeAttributionMetrics(data, campaigns) {
  const n = data.length;

  // Weighted averages across rows (weight by revenue proxy)
  const weights = data.map(r => r.untrackedRevenue + 1);
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const wavg = (key) => {
    const sum = data.reduce((acc, r, i) => acc + (r[key] ?? 0) * weights[i], 0);
    return sum / totalWeight;
  };

  const sum = (key) => data.reduce((acc, r) => acc + (r[key] ?? 0), 0);

  // ROAS Health
  const roasOriginal     = wavg('roasOriginal');
  const roasActual       = wavg('roasActual');
  const roasGap          = parseFloat((roasOriginal - roasActual).toFixed(2));
  const untrackedRevenue = sum('untrackedRevenue');
  const matchedRate      = Math.round(wavg('matchedRate'));

  // Attribution Quality
  const unmatchedCount     = sum('unmatchedCount');
  const avgDaysToConversion = Math.round(wavg('avgDaysToConversion'));

  // Ad Creative
  const ctr            = parseFloat(wavg('ctr').toFixed(2));
  const hookRetention   = Math.round(wavg('hookRetention'));
  const scrollStopRate  = Math.round(wavg('scrollStopRate'));

  // Audience
  const overlapPercent   = Math.round(wavg('overlapPercent'));
  const ageMatchRate    = Math.round(wavg('ageMatchRate'));
  const interestAccuracy = Math.round(wavg('interestAccuracy'));

  // Budget
  const dailyUtilization = Math.round(wavg('dailyUtilization'));
  const hourlySpread      = Math.round(wavg('hourlySpread'));
  const campaignBalance   = Math.round(wavg('campaignBalance'));

  // Platform
  const fbCampaigns  = campaigns.filter(c => c.platform === 'facebook');
  const zaloCampaigns = campaigns.filter(c => c.platform === 'zalo');
  const fbRevenue     = fbCampaigns.reduce((a, c) => a + c.revenue, 0);
  const zaloRevenue   = zaloCampaigns.reduce((a, c) => a + c.revenue, 0);
  const fbSpend       = fbCampaigns.reduce((a, c) => a + c.spend, 0);
  const zaloSpend     = zaloCampaigns.reduce((a, c) => a + c.spend, 0);
  const fbRoas        = fbSpend > 0 ? parseFloat((fbRevenue / fbSpend).toFixed(2)) : 0;
  const zaloRoas      = zaloSpend > 0 ? parseFloat((zaloRevenue / zaloSpend).toFixed(2)) : 0;
  const totalRevenue  = fbRevenue + zaloRevenue;
  const fbRevenueShare = totalRevenue > 0 ? Math.round((fbRevenue / totalRevenue) * 100) : 50;

  // Lead Order
  const hotToOrderRate  = Math.round(wavg('hotToOrderRate'));
  const warmToOrderRate = Math.round(wavg('warmToOrderRate'));
  const coldToOrderRate = Math.round(wavg('coldToOrderRate'));

  // Junk Campaigns
  const junkRate    = Math.round(wavg('junkRate'));
  const qualityRate = Math.round(wavg('qualityRate'));
  const spamRate    = Math.round(wavg('spamRate'));

  return {
    // ROAS Health
    roasOriginal, roasActual, roasGap, untrackedRevenue, matchedRate,
    // Attribution Quality
    matchedRate, unmatchedCount, avgDaysToConversion,
    // Ad Creative
    ctr, hookRetention, scrollStopRate,
    // Audience
    overlapPercent, ageMatchRate, interestAccuracy,
    // Budget
    dailyUtilization, hourlySpread, campaignBalance,
    // Platform
    fbRoas, zaloRoas, fbRevenueShare,
    // Lead Order
    hotToOrderRate, warmToOrderRate, coldToOrderRate,
    // Junk
    junkRate, qualityRate, spamRate,
  };
}

// ─── Score Computation ──────────────────────────────────────────────────────

/**
 * Compute score for one disease group using the spec formulas.
 * @param {string} groupId
 * @param {Object} metrics - aggregated metrics
 * @param {Array} attributionData
 * @param {Array} campaigns
 * @returns {number} score 0-10
 */
export function computeAdsScore(groupId, metrics, attributionData, campaigns) {
  switch (groupId) {
    case 'roas-health':
      // Spec: Math.max(0, Math.min(10, 10 - Math.abs(metrics.roasGap) * 0.05))
      return Math.max(0, Math.min(10, 10 - Math.abs(metrics.roasGap) * 0.05));

    case 'attribution-quality':
      // Spec: Math.max(0, Math.min(10, metrics.matchedRate * 10))
      return Math.max(0, Math.min(10, metrics.matchedRate * 0.10));

    case 'ad-creative': {
      // Spec: ctr*2 + hookRetention*0.1 - scrollStopRate*0.05
      const raw = metrics.ctr * 2 + metrics.hookRetention * 0.1 - metrics.scrollStopRate * 0.05;
      return Math.max(0, Math.min(10, raw));
    }

    case 'audience-targeting':
      // Spec: 10 - overlapPercent * 0.1
      return Math.max(0, Math.min(10, 10 - metrics.overlapPercent * 0.1));

    case 'budget-allocation': {
      // Mock score 4-8 based on utilization spread
      const seed = Math.floor(Date.now() / 86400000) + groupId.length * 137;
      return parseFloat((4 + sr(seed) * 4).toFixed(1));
    }

    case 'platform-performance': {
      // Spec: (fbRoas / max(zaloRoas, 0.1)) * 5
      const fbRatio  = metrics.fbRoas / Math.max(metrics.zaloRoas, 0.1);
      const zaloRatio = metrics.zaloRoas / Math.max(metrics.fbRoas, 0.1);
      return Math.max(0, Math.min(10, Math.max(fbRatio, zaloRatio) * 5));
    }

    case 'lead-order-conversion': {
      // Spec: hotToOrderRate*5 + warmToOrderRate*3
      return Math.max(0, Math.min(10,
        metrics.hotToOrderRate * 0.05 + metrics.warmToOrderRate * 0.03
      ));
    }

    case 'junk-campaigns': {
      // Spec: qualityRate*10 - junkRate*5
      return Math.max(0, Math.min(10,
        metrics.qualityRate * 0.10 - metrics.junkRate * 0.05
      ));
    }

    default:
      return 5;
  }
}

function getSeverity(score) {
  if (score <= 3)   return 'NẶNG';
  if (score <= 6)   return 'TRUNG BÌNH';
  return 'NHẸ';
}

function getSeverityColor(severity) {
  if (severity === 'NẶNG')        return '#BF3003';
  if (severity === 'TRUNG BÌNH') return '#0052FF';
  return '#059669';
}

// ─── Daily Delta ───────────────────────────────────────────────────────────

function simulateDailyDelta(groupId) {
  const seed = Math.floor(Date.now() / 86400000);
  const delta = (sr(seed + groupId.length * 137) - 0.4) * 1.5;
  const direction = delta >= 0 ? 'up' : 'down';
  return {
    direction,
    value: Math.abs(delta).toFixed(1),
    raw: delta,
  };
}

// ─── Main: computeAdsDiagnosis ─────────────────────────────────────────────

/**
 * Compute all 8 disease scores → sorted worst-first.
 *
 * @param {Array} attributionData - rows from loadAttributionData()
 * @param {Array} campaigns       - campaign objects (defaults to all mockCampaigns)
 * @param {Array}  savedActionIds - actions user previously saved
 * @returns {Array} diseases sorted by score ascending (worst first)
 */
export function computeAdsDiagnosis(attributionData = [], campaigns = mockCampaigns, savedActionIds = []) {
  const metrics = computeAttributionMetrics(attributionData, campaigns);

  const diseases = ADS_DISEASE_GROUPS.map(group => {
    const score = parseFloat(computeAdsScore(group.id, metrics, attributionData, campaigns).toFixed(1));
    const severity = getSeverity(score);
    const recommendations = ADS_SMAX_RECOMMENDATIONS[group.id] || [];
    const delta = simulateDailyDelta(group.id);
    const savedActionIdsForGroup = savedActionIds.filter(a => a.diseaseId === group.id).map(a => a.actionId);

    // Build metrics display values
    const metricsDisplay = group.metrics.map(m => ({
      ...m,
      value: metrics[m.key] ?? 0,
    }));

    // Example count = number of attribution rows
    const exampleCount = Math.min(attributionData.length, 24);

    return {
      id: group.id,
      code: group.code,
      label: group.label,
      icon: group.icon,
      severity,
      severityColor: getSeverityColor(severity),
      score,
      metrics: metricsDisplay,
      recommendations,
      savedActionIds: savedActionIdsForGroup,
      delta,
      exampleCount,
    };
  });

  return diseases.sort((a, b) => a.score - b.score);
}

// ─── Health Score ─────────────────────────────────────────────────────────

/**
 * Overall health score (0-10).
 * @param {Array} diseases
 * @returns {number}
 */
export function getAdsHealthScore(diseases) {
  if (!diseases || diseases.length === 0) return 0;
  const avg = diseases.reduce((sum, d) => sum + d.score, 0) / diseases.length;
  return parseFloat(avg.toFixed(1));
}

export function getAdsHealthLabel(score) {
  if (score <= 3)   return 'NGHIÊM TRỌNG';
  if (score <= 5)   return 'CẢNH BÁO';
  if (score <= 7)   return 'CẦN CẢI THIỆN';
  return 'TỐT';
}

export function getAdsHealthColor(score) {
  if (score <= 3)   return '#BF3003';
  if (score <= 5)   return '#d97706';
  if (score <= 7)   return '#0052FF';
  return '#059669';
}

// ─── localStorage: Ads Medical Records ────────────────────────────────────

const ADS_RECORDS_KEY = 'ads_medical_records';

export function saveAdsMedicalRecord(record) {
  const existing = getAdsMedicalHistory();
  const updated = [record, ...existing].slice(0, 10);
  localStorage.setItem(ADS_RECORDS_KEY, JSON.stringify(updated));
}

export function getAdsMedicalHistory() {
  try {
    const raw = localStorage.getItem(ADS_RECORDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearAdsMedicalHistory() {
  localStorage.removeItem(ADS_RECORDS_KEY);
}

// ─── localStorage: Ads Saved Actions ─────────────────────────────────────

const ADS_ACTIONS_KEY = 'ads_saved_actions';

export function getAdsSavedActions() {
  try {
    const raw = localStorage.getItem(ADS_ACTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAdsAction(action) {
  const existing = getAdsSavedActions();
  if (existing.some(a => a.diseaseId === action.diseaseId && a.actionId === action.actionId)) return;
  const updated = [...existing, { ...action, savedAt: new Date().toISOString() }];
  localStorage.setItem(ADS_ACTIONS_KEY, JSON.stringify(updated));
}

export function removeAdsAction(diseaseId, actionId) {
  const existing = getAdsSavedActions().filter(
    a => !(a.diseaseId === diseaseId && a.actionId === actionId)
  );
  localStorage.setItem(ADS_ACTIONS_KEY, JSON.stringify(existing));
}

// ─── KPI Thresholds ────────────────────────────────────────────────────────

/**
 * Returns alert level for a metric key.
 * @param {string} key
 * @param {number} value
 * @returns {'red'|'yellow'|'green'}
 */
export function getAdsKpiAlertLevel(key, value) {
  switch (key) {
    case 'roasGap':
      if (value > 1.5) return 'red';
      if (value > 0.8) return 'yellow';
      return 'green';
    case 'matchedRate':
      if (value < 60)  return 'red';
      if (value < 75)  return 'yellow';
      return 'green';
    case 'ctr':
      if (value < 1)   return 'red';
      if (value < 2)   return 'yellow';
      return 'green';
    case 'junkRate':
      if (value > 40)  return 'red';
      if (value > 25)  return 'yellow';
      return 'green';
    case 'dailyUtilization':
      if (value < 60)  return 'red';
      if (value < 75)  return 'yellow';
      return 'green';
    default:
      return 'green';
  }
}

// ─── Interpretation / Diễn Giải ───────────────────────────────────────────

/**
 * Generate Vietnamese prose interpretation for a disease.
 *
 * @param {Object} disease — disease object from computeAdsDiagnosis()
 * @param {Array} attributionData
 * @param {Array} campaigns
 * @returns {{ diagnosis: string, keyConcern: string, bottomLine: string, summary: string }}
 */
export function generateAdsInterpretation(disease, attributionData = [], campaigns = mockCampaigns) {
  const { id, label, score, severity, severityColor, metrics } = disease;
  const m = (key) => metrics.find(m => m.key === key)?.value ?? 0;

  switch (id) {
    case 'roas-health': {
      const orig   = m('roasOriginal');
      const actual = m('roasActual');
      const gap    = m('roasGap');
      const untracked = m('untrackedRevenue');
      const matched   = m('matchedRate');
      return {
        diagnosis: `Nhóm "ROAS Thực vs Ảo" hiện đạt ${score}/10. ` +
          `ROAS gốc được báo là ${orig.toFixed(1)}x, nhưng sau khi điều chỉnh ` +
          `(trừ untracked revenue), ROAS thực chỉ còn ${actual.toFixed(1)}x — ` +
          `lệch ${gap.toFixed(2)}x. Có khoảng ${(untracked / 1000000).toFixed(1)} triệu VNĐ ` +
          `doanh thu không được ghi nhận đúng nguồn.`,
        keyConcern: gap > 1.0
          ? `⚠️ ROAS lệch ${gap.toFixed(2)}x — hơn 1 đơn vị. Điều này có nghĩa bạn có thể đang đánh giá quá cao hiệu quả ads và scale sai chiến dịch.`
          : gap > 0.5
          ? `⚠️ ROAS lệch ${gap.toFixed(2)}x — nên cài UTM + Pixel events để cải thiện attribution.`
          : `✅ ROAS gap chỉ ${gap.toFixed(2)}x — attribution đang khá chính xác.`,
        bottomLine: `Tóm lại: Tỉ lệ match chỉ ${matched}% — nghĩa là ${100 - matched}% đơn hàng không được ghi nhận đúng nguồn ads. ` +
          `Cài Conversions API (CAPI) + UTM parameters là 2 hành động ưu tiên để có bức tranh ROAS chính xác hơn.`,
        summary: `ROAS gốc ${orig.toFixed(1)}x · ROAS thực ${actual.toFixed(1)}x · Match ${matched}%`,
      };
    }

    case 'attribution-quality': {
      const matched    = m('matchedRate');
      const unmatched  = m('unmatchedCount');
      const avgDays    = m('avgDaysToConversion');
      return {
        diagnosis: `Nhóm "Attribution Quality" hiện đạt ${score}/10. ` +
          `Tỉ lệ match chỉ ${matched}% — ${unmatched} đơn hàng không được gắn đúng nguồn ads. ` +
          `Thời gian trung bình từ click đến đơn hàng là ${avgDays} ngày.`,
        keyConcern: matched < 70
          ? `⚠️ Chỉ ${matched}% đơn hàng được gắn đúng nguồn — đây là mức cảnh báo. Nền tảng ads không có đủ data để optimize hiệu quả.`
          : matched < 80
          ? `⚠️ Tỉ lệ match ${matched}% — cần cải thiện thêm.`
          : `✅ Tỉ lệ match ${matched}% — attribution đang hoạt động tốt.`,
        bottomLine: `Tóm lại: ${unmatched} đơn hàng bị "mất" trong attribution funnel. ` +
          `Cài Server-Side Conversions API và deduplicate Pixel events là 2 bước ưu tiên để giảm event loss.`,
        summary: `Match ${matched}% · ${unmatched} đơn không match · TB ${avgDays} ngày/đơn`,
      };
    }

    case 'ad-creative': {
      const ctr    = m('ctr');
      const hook   = m('hookRetention');
      const scroll = m('scrollStopRate');
      return {
        diagnosis: `Nhóm "Ad Creative Health" hiện đạt ${score}/10. ` +
          `CTR trung bình ${ctr}%, Hook Retention ${hook}%, Scroll Stop Rate ${scroll}%.`,
        keyConcern: ctr < 1.5
          ? `⚠️ CTR chỉ ${ctr}% — creative không đủ compelling để khách click.`
          : ctr < 2.5
          ? `⚠️ CTR ${ctr}% — ở mức trung bình, cần A/B test thêm để tìm winning creative.`
          : `✅ CTR ${ctr}% — creative đang có sức hút tốt.`,
        bottomLine: `Tóm lại: Hook Retention ${hook}% cho thấy ${100 - hook}% khách rời đi sau vài giây. ` +
          `Thiết kế hook trong 3 giây đầu và A/B test creative mới mỗi tuần là 2 hành động ưu tiên.`,
        summary: `CTR ${ctr}% · Hook ${hook}% · Scroll Stop ${scroll}%`,
      };
    }

    case 'audience-targeting': {
      const overlap  = m('overlapPercent');
      const ageMatch = m('ageMatchRate');
      const interest  = m('interestAccuracy');
      return {
        diagnosis: `Nhóm "Audience Targeting" hiện đạt ${score}/10. ` +
          `Audience Overlap ${overlap}%, Đúng độ tuổi mục tiêu ${ageMatch}%, Interest Accuracy ${interest}%.`,
        keyConcern: overlap > 25
          ? `⚠️ Overlap ${overlap}% — khách nhìn thấy ads từ nhiều chiến dịch cùng lúc → wasted impressions. Tách audience giữa các chiến dịch.`
          : overlap > 15
          ? `⚠️ Overlap ${overlap}% — có nhóm khách trùng lặp giữa các chiến dịch.`
          : `✅ Audience overlap chỉ ${overlap}% — targeting đang tương đối sạch.`,
        bottomLine: `Tóm lại: Chỉ ${ageMatch}% khách thuộc độ tuổi mục tiêu. ` +
          `${100 - ageMatch}% ngân sách bị lãng phí vào sai audience. ` +
          `Narrow audience bằng stacked targeting (interest + demographic) để cải thiện.`,
        summary: `Overlap ${overlap}% · Đúng tuổi ${ageMatch}% · Interest ${interest}%`,
      };
    }

    case 'budget-allocation': {
      const daily  = m('dailyUtilization');
      const hourly = m('hourlySpread');
      const balance = m('campaignBalance');
      return {
        diagnosis: `Nhóm "Budget Allocation" hiện đạt ${score}/10. ` +
          `Chi ngân sách hàng ngày ${daily}%, Phân bổ theo giờ ${hourly}%, Cân bằng chiến dịch ${balance}%.`,
        keyConcern: daily < 70
          ? `⚠️ Chỉ sử dụng ${daily}% ngân sách mỗi ngày — ngân sách có thể quá cao cho audience size hiện tại, hoặc bidding không hiệu quả.`
          : daily > 95
          ? `⚠️ Utilization ${daily}% — budget có thể bị depleted quá sớm trong ngày, bỏ lỡ conversions buổi tối.`
          : `✅ Daily utilization ${daily}% — ngân sách được sử dụng ổn định.`,
        bottomLine: `Tóm lại: Cân bằng chiến dịch ${balance}% cho thấy phân bổ budget giữa các campaign chưa tối ưu. ` +
          `Thiết lập auto-bid rule cho giờ cao điểm và rebalance hàng tuần theo ROAS contribution.`,
        summary: `Hàng ngày ${daily}% · Theo giờ ${hourly}% · Cân bằng ${balance}%`,
      };
    }

    case 'platform-performance': {
      const fbRoas  = m('fbRoas');
      const zaloRoas = m('zaloRoas');
      const fbShare = m('fbRevenueShare');
      return {
        diagnosis: `Nhóm "Platform Performance" hiện đạt ${score}/10. ` +
          `Facebook ROAS ${fbRoas}x, Zalo ROAS ${zaloRoas}x. ` +
          `Facebook đóng góp ${fbShare}% tổng doanh thu.`,
        keyConcern: Math.abs(fbRoas - zaloRoas) > 2
          ? `⚠️ Chênh lệch ROAS giữa 2 nền tảng lớn (FB ${fbRoas}x vs Zalo ${zaloRoas}x). Nên shift budget sang nền tảng có ROAS cao hơn.`
          : fbRoas < 2 && zaloRoas < 2
          ? `⚠️ Cả 2 nền tảng đều có ROAS dưới 2x — cần xem xét lại toàn bộ chiến lược ads.`
          : `✅ ROAS 2 nền tảng tương đối cân bằng, chiến lược đa nền tảng đang hiệu quả.`,
        bottomLine: `Tóm lại: ${fbShare}% doanh thu đến từ Facebook, ${100 - fbShare}% từ Zalo. ` +
          `Cross-platform remarketing (dùng Zalo audience tạo FB Lookalike và ngược lại) có thể tăng ROAS tổng thể 15-20%.`,
        summary: `FB ROAS ${fbRoas}x · Zalo ROAS ${zaloRoas}x · FB share ${fbShare}%`,
      };
    }

    case 'lead-order-conversion': {
      const hot  = m('hotToOrderRate');
      const warm = m('warmToOrderRate');
      const cold = m('coldToOrderRate');
      return {
        diagnosis: `Nhóm "Lead → Order Conversion" hiện đạt ${score}/10. ` +
          `Tỉ lệ chuyển đổi: Nóng→Đơn ${hot}%, Ấm→Đơn ${warm}%, Lạnh→Đơn ${cold}%.`,
        keyConcern: hot < 20
          ? `⚠️ Chỉ ${hot}% khách NÓNG chuyển thành đơn — đây là vấn đề nghiêm trọng. Khách sẵn sàng mua nhưng không được close.`
          : hot < 30
          ? `⚠️ Tỉ lệ Nóng→Đơn ${hot}% — cần cải thiện.`
          : `✅ ${hot}% khách nóng được chốt — đội ngũ đang close hiệu quả.`,
        bottomLine: `Tóm lại: Khách NÓNG có ${hot}% chuyển đơn nhưng ${100 - hot}% bị bỏ qua. ` +
          `Retargeting khách Nóng trong 24h bằng Zalo Message và nurture sequence 7 ngày cho khách Ấm là 2 hành động ưu tiên.`,
        summary: `Nóng→Đơn ${hot}% · Ấm→Đơn ${warm}% · Lạnh→Đơn ${cold}%`,
      };
    }

    case 'junk-campaigns': {
      const junk   = m('junkRate');
      const quality = m('qualityRate');
      const spam   = m('spamRate');
      return {
        diagnosis: `Nhóm "Chiến Dịch Rác" hiện đạt ${score}/10. ` +
          `Junk Rate ${junk}%, Quality Rate ${quality}%, Spam Rate ${spam}%.`,
        keyConcern: junk > 40
          ? `⚠️ Junk rate ${junk}% — hơn 1/3 ngân sách bị lãng phí vào khách không có giá trị. Tạm dừng chiến dịch và audit targeting ngay.`
          : junk > 25
          ? `⚠️ Junk rate ${junk}% — ngân sách có phần bị lãng phí.`
          : `✅ Junk rate ${junk}% — chất lượng audience đang được kiểm soát.`,
        bottomLine: `Tóm lại: ${quality}% khách là quality lead thật sự. ` +
          `${junk}% junk + ${spam}% spam = ${junk + spam}% ngân sách bị lãng phí. ` +
          `Thêm pre-screening questions trong ad creative và exclude engagement customizers để giảm junk.`,
        summary: `Junk ${junk}% · Quality ${quality}% · Spam ${spam}%`,
      };
    }

    default: {
      return {
        diagnosis: `Nhóm "${label}" hiện đạt ${score}/10 — mức ${severity.toLowerCase()}.`,
        keyConcern: `📊 Điểm ${score}/10 cho thấy nhóm này ${score < 5 ? 'đang gặp vấn đề nghiêm trọng' : score < 7 ? 'cần được cải thiện' : 'đang ở mức chấp nhận được'}.`,
        bottomLine: `Tóm lại: Cần xem xét các chỉ số cụ thể và áp dụng khuyến nghị từ Chuyên gia Smax.`,
        summary: `Điểm ${score}/10 · ${metrics.length} chỉ số được theo dõi`,
      };
    }
  }
}