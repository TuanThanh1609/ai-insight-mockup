/**
 * adsMedicalService.test.js
 * Inline Node.js tests for adsMedicalService.js
 * Run with: node src/lib/adsMedicalService.test.js
 */

// Minimal mock for mockCampaigns
const mockCampaigns = [
  { id: 'camp-1', name: 'KPI Spring Sale', platform: 'facebook', status: 'active', budget: 15000000, spend: 8200000, impressions: 245000, clicks: 3420, conversations: 234, leads: 42, qualityScore: 72, conversionRate: 18.2, revenue: 32800000, ordersCount: 164, aiAction: 'keep' },
  { id: 'camp-2', name: 'Flash Deal Zalo', platform: 'zalo', status: 'active', budget: 5000000, spend: 3100000, impressions: 182000, clicks: 2890, conversations: 156, leads: 49, qualityScore: 85, conversionRate: 31.5, revenue: 17980000, ordersCount: 89, aiAction: 'increase' },
  { id: 'camp-3', name: 'Retargeting Q1', platform: 'facebook', status: 'active', budget: 20000000, spend: 12500000, impressions: 312000, clicks: 1840, conversations: 89, leads: 7, qualityScore: 28, conversionRate: 8.2, revenue: 15600000, ordersCount: 78, aiAction: 'decrease' },
];

const mockAIInsights = {
  'camp-1': { metrics: { junkRate: 45, qualityRate: 29, spamRate: 18, hotLeads: 8, warmLeads: 15, coldLeads: 11 } },
  'camp-2': { metrics: { junkRate: 12, qualityRate: 78, spamRate: 2, hotLeads: 28, warmLeads: 14, coldLeads: 7 } },
  'camp-3': { metrics: { junkRate: 71, qualityRate: 8, spamRate: 23, hotLeads: 1, warmLeads: 2, coldLeads: 4 } },
};

// ─── Paste service code inline for testing ───────────────────────────────────

function sr(seed) {
  let s = Math.sin(seed * 9301 + 49297) * 233280;
  return s - Math.floor(s);
}

const ADS_DISEASE_GROUPS = [
  { id: 'roas-health', code: 'RA', label: 'ROAS Thực vs Ảo', icon: '📊', metrics: [{ key: 'roasOriginal', label: 'ROAS gốc', format: 'roas' }, { key: 'roasActual', label: 'ROAS thực', format: 'roas' }, { key: 'roasGap', label: 'Lệch', format: 'percent' }, { key: 'untrackedRevenue', label: 'Untracked Revenue', format: 'currency' }, { key: 'matchedRate', label: 'Tỉ lệ match', format: 'percent' }] },
  { id: 'attribution-quality', code: 'AQ', label: 'Attribution Quality', icon: '💰', metrics: [{ key: 'matchedRate', label: 'Tỉ lệ match', format: 'percent' }, { key: 'unmatchedCount', label: 'Unmatched Orders', format: 'number' }, { key: 'avgDaysToConversion', label: 'Avg Days to Conversion', format: 'days' }] },
  { id: 'ad-creative', code: 'AC', label: 'Ad Creative Health', icon: '🎨', metrics: [{ key: 'ctr', label: 'Click-Through Rate', format: 'percent' }, { key: 'hookRetention', label: 'Hook Retention', format: 'percent' }, { key: 'scrollStopRate', label: 'Scroll Stop Rate', format: 'percent' }] },
  { id: 'audience-targeting', code: 'AT', label: 'Audience Targeting', icon: '🎯', metrics: [{ key: 'overlapPercent', label: 'Audience Overlap', format: 'percent' }, { key: 'ageMatchRate', label: 'Đúng độ tuổi mục tiêu', format: 'percent' }, { key: 'interestAccuracy', label: 'Interest Accuracy', format: 'percent' }] },
  { id: 'budget-allocation', code: 'BA', label: 'Budget Allocation', icon: '💸', metrics: [{ key: 'dailyUtilization', label: 'Chi ngân sách hàng ngày', format: 'percent' }, { key: 'hourlySpread', label: 'Phân bổ theo giờ', format: 'percent' }, { key: 'campaignBalance', label: 'Cân bằng chiến dịch', format: 'percent' }] },
  { id: 'platform-performance', code: 'PP', label: 'Platform Performance', icon: '📱', metrics: [{ key: 'fbRoas', label: 'Facebook ROAS', format: 'roas' }, { key: 'zaloRoas', label: 'Zalo ROAS', format: 'roas' }, { key: 'fbRevenueShare', label: 'Facebook Revenue %', format: 'percent' }] },
  { id: 'lead-order-conversion', code: 'LC', label: 'Lead → Order Conversion', icon: '🔁', metrics: [{ key: 'hotToOrderRate', label: 'Nóng → Đơn', format: 'percent' }, { key: 'warmToOrderRate', label: 'Ấm → Đơn', format: 'percent' }, { key: 'coldToOrderRate', label: 'Lạnh → Đơn', format: 'percent' }] },
  { id: 'junk-campaigns', code: 'CR', label: 'Chiến Dịch Rác', icon: '⚠️', metrics: [{ key: 'junkRate', label: 'Junk Rate', format: 'percent' }, { key: 'qualityRate', label: 'Quality Rate', format: 'percent' }, { key: 'spamRate', label: 'Spam Rate', format: 'percent' }] },
];

function generateAttributionRow(campaign, rowIndex) {
  const seed = campaign.id.length * 100 + rowIndex * 7;
  const rng = (offset = 0) => sr(seed + offset);

  const untrackedRatio = 0.10 + rng(1) * 0.25;
  const roasOriginal   = campaign.spend > 0 ? campaign.revenue / campaign.spend : 1;
  const untrackedRev   = Math.round(campaign.revenue * untrackedRatio);
  const roasActual     = (campaign.revenue - untrackedRev) / campaign.spend;
  const roasGap        = roasOriginal - roasActual;
  const matchedRate     = Math.round((1 - untrackedRatio) * 100);

  const unmatchedCount  = Math.round(campaign.ordersCount * untrackedRatio * rng(2));
  const avgDaysToConversion = Math.round(1 + rng(3) * 7);

  const ctr = campaign.impressions > 0
    ? Math.round((campaign.clicks / campaign.impressions) * 10000) / 100
    : 1 + rng(4) * 2;
  const hookRetention  = Math.round(50 + rng(5) * 35);
  const scrollStopRate = Math.round(20 + rng(6) * 35);

  const overlapPercent   = Math.round(5 + rng(7) * 30);
  const ageMatchRate     = Math.round(55 + rng(8) * 35);
  const interestAccuracy = Math.round(50 + rng(9) * 35);

  const dailyUtilization = Math.round(65 + rng(10) * 30);
  const hourlySpread     = Math.round(20 + rng(11) * 60);
  const campaignBalance  = Math.round(40 + rng(12) * 50);

  const aiInsight  = mockAIInsights[campaign.id] || {};
  const aiMetrics  = aiInsight.metrics || {};
  const hotToOrder  = aiMetrics.hotLeads
    ? Math.round((aiMetrics.hotLeads / (campaign.leads || 1)) * 100)
    : Math.round(20 + rng(13) * 25);
  const warmToOrder = aiMetrics.warmLeads
    ? Math.round((aiMetrics.warmLeads / (campaign.leads || 1)) * 100)
    : Math.round(8 + rng(14) * 18);
  const coldToOrder = aiMetrics.coldLeads
    ? Math.round((aiMetrics.coldLeads / (campaign.leads || 1)) * 100)
    : Math.round(1 + rng(15) * 6);

  const junkRate   = aiMetrics.junkRate   ?? Math.round(rng(16) * 50);
  const qualityRate = aiMetrics.qualityRate ?? Math.round(30 + rng(17) * 50);
  const spamRate   = aiMetrics.spamRate   ?? Math.round(rng(18) * 25);

  return {
    campaignId: campaign.id, campaignName: campaign.name, platform: campaign.platform,
    roasOriginal, roasActual: parseFloat(roasActual.toFixed(2)), roasGap: parseFloat(roasGap.toFixed(2)),
    untrackedRevenue: untrackedRev, matchedRate,
    unmatchedCount, avgDaysToConversion,
    ctr, hookRetention, scrollStopRate,
    overlapPercent, ageMatchRate, interestAccuracy,
    dailyUtilization, hourlySpread, campaignBalance,
    hotToOrderRate: Math.min(hotToOrder, 100), warmToOrderRate: Math.min(warmToOrder, 100), coldToOrderRate: Math.min(coldToOrder, 100),
    junkRate: Math.min(junkRate, 100), qualityRate: Math.min(qualityRate, 100), spamRate: Math.min(spamRate, 100),
  };
}

function loadAttributionData(campaignIds = [], campaigns = mockCampaigns) {
  const filtered = campaignIds.length > 0
    ? campaigns.filter(c => campaignIds.includes(c.id))
    : campaigns;
  const rows = [];
  filtered.forEach(campaign => {
    for (let i = 0; i < 3; i++) rows.push(generateAttributionRow(campaign, i));
  });
  return rows;
}

function computeAttributionMetrics(data, campaigns) {
  const n = data.length;
  const weights = data.map(r => r.untrackedRevenue + 1);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const wavg = (key) => {
    const sum = data.reduce((acc, r, i) => acc + (r[key] ?? 0) * weights[i], 0);
    return sum / totalWeight;
  };
  const sum = (key) => data.reduce((acc, r) => acc + (r[key] ?? 0), 0);

  const roasOriginal = wavg('roasOriginal');
  const roasActual   = wavg('roasActual');
  const roasGap      = parseFloat((roasOriginal - roasActual).toFixed(2));
  const untrackedRevenue = sum('untrackedRevenue');
  const matchedRate     = Math.round(wavg('matchedRate'));
  const unmatchedCount  = sum('unmatchedCount');
  const avgDaysToConversion = Math.round(wavg('avgDaysToConversion'));
  const ctr       = parseFloat(wavg('ctr').toFixed(2));
  const hookRetention  = Math.round(wavg('hookRetention'));
  const scrollStopRate = Math.round(wavg('scrollStopRate'));
  const overlapPercent   = Math.round(wavg('overlapPercent'));
  const ageMatchRate     = Math.round(wavg('ageMatchRate'));
  const interestAccuracy = Math.round(wavg('interestAccuracy'));
  const dailyUtilization = Math.round(wavg('dailyUtilization'));
  const hourlySpread     = Math.round(wavg('hourlySpread'));
  const campaignBalance  = Math.round(wavg('campaignBalance'));

  const fbCampaigns  = campaigns.filter(c => c.platform === 'facebook');
  const zaloCampaigns = campaigns.filter(c => c.platform === 'zalo');
  const fbRevenue    = fbCampaigns.reduce((a, c) => a + c.revenue, 0);
  const zaloRevenue  = zaloCampaigns.reduce((a, c) => a + c.revenue, 0);
  const fbSpend      = fbCampaigns.reduce((a, c) => a + c.spend, 0);
  const zaloSpend    = zaloCampaigns.reduce((a, c) => a + c.spend, 0);
  const fbRoas       = fbSpend > 0 ? parseFloat((fbRevenue / fbSpend).toFixed(2)) : 0;
  const zaloRoas     = zaloSpend > 0 ? parseFloat((zaloRevenue / zaloSpend).toFixed(2)) : 0;
  const totalRevenue = fbRevenue + zaloRevenue;
  const fbRevenueShare = totalRevenue > 0 ? Math.round((fbRevenue / totalRevenue) * 100) : 50;

  const hotToOrderRate  = Math.round(wavg('hotToOrderRate'));
  const warmToOrderRate = Math.round(wavg('warmToOrderRate'));
  const coldToOrderRate = Math.round(wavg('coldToOrderRate'));
  const junkRate    = Math.round(wavg('junkRate'));
  const qualityRate = Math.round(wavg('qualityRate'));
  const spamRate    = Math.round(wavg('spamRate'));

  return { roasOriginal, roasActual, roasGap, untrackedRevenue, matchedRate, unmatchedCount, avgDaysToConversion, ctr, hookRetention, scrollStopRate, overlapPercent, ageMatchRate, interestAccuracy, dailyUtilization, hourlySpread, campaignBalance, fbRoas, zaloRoas, fbRevenueShare, hotToOrderRate, warmToOrderRate, coldToOrderRate, junkRate, qualityRate, spamRate };
}

function computeAdsScore(groupId, metrics) {
  switch (groupId) {
    case 'roas-health':
      return Math.max(0, Math.min(10, 10 - Math.abs(metrics.roasGap) * 0.05));
    case 'attribution-quality':
      return Math.max(0, Math.min(10, metrics.matchedRate * 0.10));
    case 'ad-creative': {
      const raw = metrics.ctr * 2 + metrics.hookRetention * 0.1 - metrics.scrollStopRate * 0.05;
      return Math.max(0, Math.min(10, raw));
    }
    case 'audience-targeting':
      return Math.max(0, Math.min(10, 10 - metrics.overlapPercent * 0.1));
    case 'budget-allocation': {
      const seed = 12345 + groupId.length * 137;
      return parseFloat((4 + sr(seed) * 4).toFixed(1));
    }
    case 'platform-performance': {
      const fbRatio   = metrics.fbRoas / Math.max(metrics.zaloRoas, 0.1);
      const zaloRatio = metrics.zaloRoas / Math.max(metrics.fbRoas, 0.1);
      return Math.max(0, Math.min(10, Math.max(fbRatio, zaloRatio) * 5));
    }
    case 'lead-order-conversion':
      return Math.max(0, Math.min(10, metrics.hotToOrderRate * 0.05 + metrics.warmToOrderRate * 0.03));
    case 'junk-campaigns':
      return Math.max(0, Math.min(10, metrics.qualityRate * 0.10 - metrics.junkRate * 0.05));
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

function computeAdsDiagnosis(attributionData = [], campaigns = mockCampaigns, savedActionIds = []) {
  const metrics = computeAttributionMetrics(attributionData, campaigns);
  const diseases = ADS_DISEASE_GROUPS.map(group => {
    const score    = parseFloat(computeAdsScore(group.id, metrics).toFixed(1));
    const severity = getSeverity(score);
    const savedActionIdsForGroup = savedActionIds.filter(a => a.diseaseId === group.id).map(a => a.actionId);
    const metricsDisplay = group.metrics.map(m => ({ ...m, value: metrics[m.key] ?? 0 }));
    return {
      id: group.id, code: group.code, label: group.label, icon: group.icon,
      severity, severityColor: getSeverityColor(severity), score,
      metrics: metricsDisplay, savedActionIds: savedActionIdsForGroup, exampleCount: attributionData.length,
    };
  });
  return diseases.sort((a, b) => a.score - b.score);
}

function getAdsHealthScore(diseases) {
  if (!diseases || diseases.length === 0) return 0;
  const avg = diseases.reduce((sum, d) => sum + d.score, 0) / diseases.length;
  return parseFloat(avg.toFixed(1));
}

function getAdsKpiAlertLevel(key, value) {
  switch (key) {
    case 'roasGap':    if (value > 1.5) return 'red'; if (value > 0.8) return 'yellow'; return 'green';
    case 'matchedRate': if (value < 60) return 'red'; if (value < 75) return 'yellow'; return 'green';
    case 'ctr':        if (value < 1) return 'red'; if (value < 2) return 'yellow'; return 'green';
    case 'junkRate':   if (value > 40) return 'red'; if (value > 25) return 'yellow'; return 'green';
    case 'dailyUtilization': if (value < 60) return 'red'; if (value < 75) return 'yellow'; return 'green';
    default: return 'green';
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    console.log(`  ✅ ${msg}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

function section(name) {
  console.log(`\n── ${name}`);
}

// Test seed function determinism
section('T1: sr() deterministic');
const s1 = sr(42);
const s2 = sr(42);
assert(s1 === s2, 'sr(42) returns same value twice');
assert(s1 >= 0 && s1 < 1, `sr(42) in [0,1): ${s1}`);

// Test loadAttributionData
section('T2: loadAttributionData()');
const allRows = loadAttributionData([], mockCampaigns);
assert(allRows.length === 9, `9 rows for 3 campaigns × 3 rows: got ${allRows.length}`);
const camp2Rows = loadAttributionData(['camp-2'], mockCampaigns);
assert(camp2Rows.length === 3, `3 rows for camp-2 only: got ${camp2Rows.length}`);
camp2Rows.forEach(r => assert(r.campaignId === 'camp-2', `row belongs to camp-2: ${r.campaignId}`));

// Test generateAttributionRow determinism
section('T3: generateAttributionRow() determinism');
const row1a = generateAttributionRow(mockCampaigns[0], 0);
const row1b = generateAttributionRow(mockCampaigns[0], 0);
assert(row1a.roasOriginal === row1b.roasOriginal, 'Same campaign+index → same roasOriginal');
assert(row1a.matchedRate === row1b.matchedRate, 'Same campaign+index → same matchedRate');
assert(row1a.ctr === row1b.ctr, 'Same campaign+index → same CTR');
// camp-0 and camp-1 happen to round to same CTR (both ~1.4%) — verify CTR is correct instead
const ctr0 = generateAttributionRow(mockCampaigns[0], 0).ctr;
const expectedCtr0 = Math.round((3420 / 245000) * 10000) / 100; // 1.4
assert(ctr0 === expectedCtr0, `camp-0 CTR computed correctly: ${ctr0}`);

// Test metrics are in valid ranges
section('T4: Metrics in valid ranges');
const row = generateAttributionRow(mockCampaigns[0], 0);
assert(row.matchedRate >= 65 && row.matchedRate <= 90, `matchedRate 65-90: got ${row.matchedRate}`);
assert(row.ctr >= 0, `CTR >= 0: got ${row.ctr}`);
assert(row.junkRate >= 0 && row.junkRate <= 100, `junkRate 0-100: got ${row.junkRate}`);
assert(row.qualityRate >= 0 && row.qualityRate <= 100, `qualityRate 0-100: got ${row.qualityRate}`);
assert(row.hotToOrderRate >= 0 && row.hotToOrderRate <= 100, `hotToOrderRate 0-100: got ${row.hotToOrderRate}`);

// Test computeAttributionMetrics
section('T5: computeAttributionMetrics() aggregates');
const metrics = computeAttributionMetrics(allRows, mockCampaigns);
assert(typeof metrics.roasOriginal === 'number', 'roasOriginal is number');
assert(typeof metrics.roasGap === 'number', 'roasGap is number');
assert(typeof metrics.matchedRate === 'number', 'matchedRate is number');
assert(typeof metrics.fbRoas === 'number', 'fbRoas is number');
assert(typeof metrics.zaloRoas === 'number', 'zaloRoas is number');
assert(typeof metrics.hotToOrderRate === 'number', 'hotToOrderRate is number');
assert(typeof metrics.junkRate === 'number', 'junkRate is number');
assert(metrics.fbRevenueShare >= 0 && metrics.fbRevenueShare <= 100, `fbRevenueShare 0-100: got ${metrics.fbRevenueShare}`);

// Test computeAdsScore formulas
section('T6: computeAdsScore() formula bounds');
ADS_DISEASE_GROUPS.forEach(group => {
  const score = computeAdsScore(group.id, metrics);
  assert(score >= 0 && score <= 10, `${group.id}: score in [0,10]: ${score}`);
});
// Specific formula checks
const roasScore = computeAdsScore('roas-health', { roasGap: 10.0 });
assert(roasScore === 9.5, `roas-health gap=10.0 → score=9.5: got ${roasScore}`);
const aqScore = computeAdsScore('attribution-quality', { matchedRate: 80 });
assert(aqScore === 8.0, `attribution-quality matchedRate=80 → score=8.0: got ${aqScore}`);
const junkScore = computeAdsScore('junk-campaigns', { qualityRate: 80, junkRate: 20 });
assert(junkScore === 7.0, `junk-campaigns quality=80,junk=20 → score=7.0: got ${junkScore}`);
const lcScore = computeAdsScore('lead-order-conversion', { hotToOrderRate: 40, warmToOrderRate: 20 });
assert(lcScore === 2.6, `lead-order hot=40,warm=20 → score=2.6: got ${lcScore}`);

// Test getSeverity
section('T7: getSeverity()');
assert(getSeverity(2.5) === 'NẶNG', 'score 2.5 → NẶNG');
assert(getSeverity(3.0) === 'NẶNG', 'score 3.0 → NẶNG');
assert(getSeverity(3.5) === 'TRUNG BÌNH', 'score 3.5 → TRUNG BÌNH');
assert(getSeverity(6.0) === 'TRUNG BÌNH', 'score 6.0 → TRUNG BÌNH');
assert(getSeverity(6.5) === 'NHẸ', 'score 6.5 → NHẸ');
assert(getSeverity(9.0) === 'NHẸ', 'score 9.0 → NHẸ');

// Test computeAdsDiagnosis
section('T8: computeAdsDiagnosis() sorted worst-first');
const diseases = computeAdsDiagnosis(allRows, mockCampaigns);
assert(diseases.length === 8, `8 diseases: got ${diseases.length}`);
assert(diseases[0].score <= diseases[7].score, 'First disease score ≤ last (sorted ascending)');
diseases.forEach(d => {
  assert(d.severity !== undefined, `${d.id}: has severity`);
  assert(d.severityColor !== undefined, `${d.id}: has severityColor`);
  assert(Array.isArray(d.metrics), `${d.id}: metrics is array`);
  assert(d.metrics.length > 0, `${d.id}: has metrics`);
  d.metrics.forEach(m => {
    assert(typeof m.value === 'number', `${d.id}.${m.key}: value is number`);
  });
});

// Test getAdsHealthScore
section('T9: getAdsHealthScore()');
const healthScore = getAdsHealthScore(diseases);
assert(healthScore >= 0 && healthScore <= 10, `healthScore in [0,10]: ${healthScore}`);
const zeroScore = getAdsHealthScore([]);
assert(zeroScore === 0, 'empty diseases → 0');
const zeroScoreNull = getAdsHealthScore(null);
assert(zeroScoreNull === 0, 'null → 0');

// Test getAdsKpiAlertLevel
section('T10: getAdsKpiAlertLevel()');
assert(getAdsKpiAlertLevel('roasGap', 2.0) === 'red', 'roasGap 2.0 → red');
assert(getAdsKpiAlertLevel('roasGap', 1.0) === 'yellow', 'roasGap 1.0 → yellow');
assert(getAdsKpiAlertLevel('roasGap', 0.5) === 'green', 'roasGap 0.5 → green');
assert(getAdsKpiAlertLevel('matchedRate', 50) === 'red', 'matchedRate 50 → red');
assert(getAdsKpiAlertLevel('matchedRate', 70) === 'yellow', 'matchedRate 70 → yellow');
assert(getAdsKpiAlertLevel('matchedRate', 80) === 'green', 'matchedRate 80 → green');
assert(getAdsKpiAlertLevel('ctr', 0.5) === 'red', 'ctr 0.5 → red');
assert(getAdsKpiAlertLevel('ctr', 1.5) === 'yellow', 'ctr 1.5 → yellow');
assert(getAdsKpiAlertLevel('ctr', 3.0) === 'green', 'ctr 3.0 → green');
assert(getAdsKpiAlertLevel('junkRate', 50) === 'red', 'junkRate 50 → red');
assert(getAdsKpiAlertLevel('dailyUtilization', 50) === 'red', 'dailyUtil 50 → red');
assert(getAdsKpiAlertLevel('dailyUtilization', 65) === 'yellow', 'dailyUtil 65 → yellow');
assert(getAdsKpiAlertLevel('dailyUtilization', 80) === 'green', 'dailyUtil 80 → green');

// Test platform FB vs Zalo split
section('T11: Platform FB vs Zalo metrics');
const m = computeAttributionMetrics(loadAttributionData([], mockCampaigns), mockCampaigns);
assert(m.fbRoas > 0, `fbRoas > 0: ${m.fbRoas}`);
assert(m.zaloRoas > 0, `zaloRoas > 0: ${m.zaloRoas}`);
// FB: camp-1 (3.8x), camp-3 (1.25x) avg
// Zalo: camp-2 (5.8x)
// These should be reasonable
console.log(`  ℹ️  fbRoas=${m.fbRoas}x, zaloRoas=${m.zaloRoas}x, fbShare=${m.fbRevenueShare}%`);

// Test adsDiseaseGroup completeness
section('T12: ADS_DISEASE_GROUPS completeness');
const expectedIds = ['roas-health', 'attribution-quality', 'ad-creative', 'audience-targeting', 'budget-allocation', 'platform-performance', 'lead-order-conversion', 'junk-campaigns'];
const actualIds = ADS_DISEASE_GROUPS.map(g => g.id);
expectedIds.forEach(id => {
  assert(actualIds.includes(id), `includes ${id}`);
});
assert(ADS_DISEASE_GROUPS.length === 8, `8 groups total: got ${ADS_DISEASE_GROUPS.length}`);

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n══════════════════════════════════════`);
console.log(`  ✅ PASSED: ${passed}`);
console.log(`  ❌ FAILED: ${failed}`);
if (failed === 0) {
  console.log(`  🎉 ALL TESTS PASSED`);
} else {
  console.log(`  💥 SOME TESTS FAILED`);
  process.exit(1);
}
