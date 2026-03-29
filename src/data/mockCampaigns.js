// ─── Seeded PRNG (sine-based, deterministic) ────────────────────────────────

function sr(seed) {
  let s = Math.sin(seed * 9301 + 49297) * 233280;
  return s - Math.floor(s);
}

// ─── Deterministic AdIds per Campaign ────────────────────────────────────────
// adIds[] is used by mockAttributionData.js to distribute attribution across
// multiple ads within the same campaign (needed for "Chi Tiết" ad-level tab).

const LETTERS = ['', 'a', 'b', 'c'];

function buildAdIds(campIdx, platform) {
  const prefix = platform === 'facebook' ? 'FB' : 'ZL';
  const baseNum = String(campIdx + 1).padStart(2, '0');
  // 2–4 ads deterministically: 2 + floor(sr(campIdx * 7) * 3)
  const count = 2 + Math.floor(sr(campIdx * 7) * 3);
  return Array.from({ length: count }, (_, i) => `${prefix}-Ads-${baseNum}${LETTERS[i]}`);
}

export const mockCampaigns = [
  {
    id: 'camp-1',
    name: 'KPI Spring Sale 2026',
    platform: 'facebook',
    status: 'active',
    adId: 'FB-AD-001',
    adIds: buildAdIds(0, 'facebook'),   // [FB-Ads-01, FB-Ads-01a, FB-Ads-01b]
    budget: 15000000,
    spend: 8200000,
    impressions: 245000,
    clicks: 3420,
    conversations: 234,
    leads: 42,
    qualityScore: 72,
    conversionRate: 18.2,
    revenue: 32800000,
    ordersCount: 164,
    aiAction: 'keep',
    lastUpdated: '2026-03-22T08:00:00Z',
  },
  {
    id: 'camp-2',
    name: 'Flash Deal Zalo — Tháng 3',
    platform: 'zalo',
    status: 'active',
    adId: 'ZL-AD-001',
    adIds: buildAdIds(1, 'zalo'),       // [ZL-Ads-02, ZL-Ads-02a]
    budget: 5000000,
    spend: 3100000,
    impressions: 182000,
    clicks: 2890,
    conversations: 156,
    leads: 49,
    qualityScore: 85,
    conversionRate: 31.5,
    revenue: 17980000,
    ordersCount: 89,
    aiAction: 'increase',
    lastUpdated: '2026-03-22T08:00:00Z',
  },
  {
    id: 'camp-3',
    name: 'Retargeting 2026 — Q1',
    platform: 'facebook',
    status: 'active',
    adId: 'FB-AD-002',
    adIds: buildAdIds(2, 'facebook'),   // [FB-Ads-03, FB-Ads-03a, FB-Ads-03b, FB-Ads-03c]
    budget: 20000000,
    spend: 12500000,
    impressions: 312000,
    clicks: 1840,
    conversations: 89,
    leads: 7,
    qualityScore: 28,
    conversionRate: 8.2,
    revenue: 15600000,
    ordersCount: 78,
    aiAction: 'decrease',
    lastUpdated: '2026-03-22T08:00:00Z',
  },
  {
    id: 'camp-4',
    name: 'Brand Awareness Zalo',
    platform: 'zalo',
    status: 'paused',
    adId: 'ZL-AD-002',
    adIds: buildAdIds(3, 'zalo'),       // [ZL-Ads-04, ZL-Ads-04a]
    budget: 8000000,
    spend: 6400000,
    impressions: 410000,
    clicks: 1230,
    conversations: 67,
    leads: 8,
    qualityScore: 41,
    conversionRate: 12.1,
    revenue: 7700000,
    ordersCount: 38,
    aiAction: 'pause',
    lastUpdated: '2026-03-22T08:00:00Z',
  },
  {
    id: 'camp-5',
    name: 'Product Launch — Serum Dưỡng',
    platform: 'facebook',
    status: 'active',
    adId: 'FB-AD-003',
    adIds: buildAdIds(4, 'facebook'),   // [FB-Ads-05, FB-Ads-05a, FB-Ads-05b]
    budget: 12000000,
    spend: 5900000,
    impressions: 198000,
    clicks: 4120,
    conversations: 312,
    leads: 78,
    qualityScore: 81,
    conversionRate: 25.0,
    revenue: 26500000,
    ordersCount: 133,
    aiAction: 'increase',
    lastUpdated: '2026-03-22T08:00:00Z',
  },
  {
    id: 'camp-6',
    name: 'Summer Collection Zalo',
    platform: 'zalo',
    status: 'active',
    adId: 'ZL-AD-003',
    adIds: buildAdIds(5, 'zalo'),       // [ZL-Ads-06, ZL-Ads-06a]
    budget: 6000000,
    spend: 2200000,
    impressions: 95000,
    clicks: 1680,
    conversations: 98,
    leads: 31,
    qualityScore: 76,
    conversionRate: 31.6,
    revenue: 6600000,
    ordersCount: 33,
    aiAction: 'keep',
    lastUpdated: '2026-03-22T08:00:00Z',
  },
  {
    id: 'camp-7',
    name: 'Retargeting High Intent',
    platform: 'facebook',
    status: 'paused',
    adId: 'FB-AD-004',
    adIds: buildAdIds(6, 'facebook'),   // [FB-Ads-07, FB-Ads-07a, FB-Ads-07b]
    budget: 10000000,
    spend: 9800000,
    impressions: 275000,
    clicks: 890,
    conversations: 43,
    leads: 2,
    qualityScore: 15,
    conversionRate: 4.7,
    revenue: 12700000,
    ordersCount: 64,
    aiAction: 'pause',
    lastUpdated: '2026-03-22T08:00:00Z',
  },
  {
    id: 'camp-8',
    name: 'Zalo OA — Khách hàng cũ',
    platform: 'zalo',
    status: 'active',
    adId: 'ZL-AD-004',
    adIds: buildAdIds(7, 'zalo'),       // [ZL-Ads-08, ZL-Ads-08a]
    budget: 3000000,
    spend: 1400000,
    impressions: 62000,
    clicks: 2340,
    conversations: 189,
    leads: 67,
    qualityScore: 89,
    conversionRate: 35.4,
    revenue: 8100000,
    ordersCount: 40,
    aiAction: 'increase',
    lastUpdated: '2026-03-22T08:00:00Z',
  },
];

// Xu hướng hội thoại 7 ngày gần nhất
export const mockConversationTrend = [
  { date: '15/03', facebook: 98, zalo: 72 },
  { date: '16/03', facebook: 112, zalo: 85 },
  { date: '17/03', facebook: 89, zalo: 91 },
  { date: '18/03', facebook: 134, zalo: 78 },
  { date: '19/03', facebook: 156, zalo: 102 },
  { date: '20/03', facebook: 178, zalo: 124 },
  { date: '21/03', facebook: 145, zalo: 108 },
];

// Tổng quan stats
export const mockOverviewStats = {
  totalConversations: 1247,
  adsConversations: 892,
  facebookConversations: 523,
  zaloConversations: 369,
  conversionRate: 23.4,
  totalSpend: 45200000,
  totalRevenue: 120260000,
  avgRoas: 2.7,
  totalOrders: 639,
  junkCampaignsCount: 3,
};

// 7 ngày chi tiết theo từng campaign
// Tổng: camp-1 32.8M + camp-2 17.98M + camp-3 15.6M + camp-4 7.7M + camp-5 26.5M + camp-6 6.6M + camp-7 12.7M + camp-8 8.1M = 120.26M
export const mockDailyBreakdown = {
  'camp-1': [
    { date: '15/03', revenue: 4100000, spend: 1050000, ordersCount: 21, roas: 3.9 },
    { date: '16/03', revenue: 5200000, spend: 1200000, ordersCount: 26, roas: 4.3 },
    { date: '17/03', revenue: 3800000, spend: 1100000, ordersCount: 19, roas: 3.5 },
    { date: '18/03', revenue: 4800000, spend: 1180000, ordersCount: 24, roas: 4.1 },
    { date: '19/03', revenue: 6100000, spend: 1220000, ordersCount: 30, roas: 5.0 },
    { date: '20/03', revenue: 7300000, spend: 1350000, ordersCount: 37, roas: 5.4 },
    { date: '21/03', revenue: 5000000, spend: 1100000, ordersCount: 25, roas: 4.5 },
  ],
  'camp-2': [
    { date: '15/03', revenue: 2200000, spend: 380000, ordersCount: 11, roas: 5.8 },
    { date: '16/03', revenue: 2400000, spend: 410000, ordersCount: 12, roas: 5.9 },
    { date: '17/03', revenue: 2100000, spend: 390000, ordersCount: 10, roas: 5.4 },
    { date: '18/03', revenue: 2600000, spend: 440000, ordersCount: 13, roas: 5.9 },
    { date: '19/03', revenue: 2800000, spend: 460000, ordersCount: 14, roas: 6.1 },
    { date: '20/03', revenue: 3100000, spend: 480000, ordersCount: 15, roas: 6.5 },
    { date: '21/03', revenue: 2600000, spend: 440000, ordersCount: 13, roas: 5.9 },
  ],
  'camp-3': [
    { date: '15/03', revenue: 2100000, spend: 1780000, ordersCount: 10, roas: 1.2 },
    { date: '16/03', revenue: 2400000, spend: 1800000, ordersCount: 12, roas: 1.3 },
    { date: '17/03', revenue: 1900000, spend: 1780000, ordersCount: 9, roas: 1.1 },
    { date: '18/03', revenue: 2200000, spend: 1800000, ordersCount: 11, roas: 1.2 },
    { date: '19/03', revenue: 2300000, spend: 1790000, ordersCount: 11, roas: 1.3 },
    { date: '20/03', revenue: 2500000, spend: 1800000, ordersCount: 12, roas: 1.4 },
    { date: '21/03', revenue: 2200000, spend: 1790000, ordersCount: 11, roas: 1.2 },
  ],
  'camp-4': [
    { date: '15/03', revenue: 900000, spend: 920000, ordersCount: 4, roas: 1.0 },
    { date: '16/03', revenue: 1100000, spend: 920000, ordersCount: 5, roas: 1.2 },
    { date: '17/03', revenue: 800000, spend: 910000, ordersCount: 4, roas: 0.9 },
    { date: '18/03', revenue: 1000000, spend: 920000, ordersCount: 5, roas: 1.1 },
    { date: '19/03', revenue: 1200000, spend: 920000, ordersCount: 6, roas: 1.3 },
    { date: '20/03', revenue: 1300000, spend: 920000, ordersCount: 6, roas: 1.4 },
    { date: '21/03', revenue: 1400000, spend: 910000, ordersCount: 7, roas: 1.5 },
  ],
  'camp-5': [
    { date: '15/03', revenue: 3200000, spend: 780000, ordersCount: 16, roas: 4.1 },
    { date: '16/03', revenue: 3800000, spend: 820000, ordersCount: 19, roas: 4.6 },
    { date: '17/03', revenue: 3100000, spend: 800000, ordersCount: 15, roas: 3.9 },
    { date: '18/03', revenue: 3900000, spend: 850000, ordersCount: 19, roas: 4.6 },
    { date: '19/03', revenue: 4300000, spend: 870000, ordersCount: 21, roas: 4.9 },
    { date: '20/03', revenue: 4700000, spend: 880000, ordersCount: 23, roas: 5.3 },
    { date: '21/03', revenue: 3500000, spend: 790000, ordersCount: 17, roas: 4.4 },
  ],
  'camp-6': [
    { date: '15/03', revenue: 800000, spend: 280000, ordersCount: 4, roas: 2.9 },
    { date: '16/03', revenue: 900000, spend: 300000, ordersCount: 4, roas: 3.0 },
    { date: '17/03', revenue: 700000, spend: 280000, ordersCount: 3, roas: 2.5 },
    { date: '18/03', revenue: 1000000, spend: 320000, ordersCount: 5, roas: 3.1 },
    { date: '19/03', revenue: 1100000, spend: 340000, ordersCount: 5, roas: 3.2 },
    { date: '20/03', revenue: 1200000, spend: 350000, ordersCount: 6, roas: 3.4 },
    { date: '21/03', revenue: 900000, spend: 330000, ordersCount: 4, roas: 2.7 },
  ],
  'camp-7': [
    { date: '15/03', revenue: 1600000, spend: 1400000, ordersCount: 8, roas: 1.1 },
    { date: '16/03', revenue: 1800000, spend: 1400000, ordersCount: 9, roas: 1.3 },
    { date: '17/03', revenue: 1500000, spend: 1400000, ordersCount: 7, roas: 1.1 },
    { date: '18/03', revenue: 1700000, spend: 1400000, ordersCount: 8, roas: 1.2 },
    { date: '19/03', revenue: 1900000, spend: 1400000, ordersCount: 9, roas: 1.4 },
    { date: '20/03', revenue: 2100000, spend: 1400000, ordersCount: 10, roas: 1.5 },
    { date: '21/03', revenue: 2100000, spend: 1400000, ordersCount: 10, roas: 1.5 },
  ],
  'camp-8': [
    { date: '15/03', revenue: 1000000, spend: 170000, ordersCount: 5, roas: 5.9 },
    { date: '16/03', revenue: 1100000, spend: 180000, ordersCount: 5, roas: 6.1 },
    { date: '17/03', revenue: 900000, spend: 170000, ordersCount: 4, roas: 5.3 },
    { date: '18/03', revenue: 1200000, spend: 190000, ordersCount: 6, roas: 6.3 },
    { date: '19/03', revenue: 1300000, spend: 200000, ordersCount: 6, roas: 6.5 },
    { date: '20/03', revenue: 1400000, spend: 210000, ordersCount: 7, roas: 6.7 },
    { date: '21/03', revenue: 1200000, spend: 200000, ordersCount: 6, roas: 6.0 },
  ],
};
