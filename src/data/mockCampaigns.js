// ─── Seeded PRNG (deterministic) ────────────────────────────────────────────
function sr(seed) {
  let s = Math.sin(seed * 9301 + 49297) * 233280;
  return s - Math.floor(s);
}

// ─── Temperature breakdown helpers ──────────────────────────────────────────
function tempBreakdown(total, hotRatio, warmRatio, seed) {
  const hot   = Math.round(total * hotRatio);
  const warm  = Math.round(total * warmRatio);
  const cold  = total - hot - warm;
  return { hot, warm, cold };
}

// ─── Facebook-only campaigns (5 campaigns, no Zalo) ─────────────────────────
export const mockCampaigns = [
  {
    id: 'camp-1',
    name: 'KPI Spring Sale 2026',
    platform: 'facebook',
    status: 'active',
    adId: 'FB-AD-001',
    budget: 15000000,
    spend: 8200000,
    impressions: 245000,
    clicks: 3420,
    conversations: 78,
    leads: 42,
    qualityScore: 72,
    conversionRate: 18.2,
    revenue: 36800000,
    ordersCount: 36,
    ordersCancelled: 4,
    phoneCollected: 31,
    postContent: '🎉 Spring Sale giảm đến 40% toàn bộ sản phẩm mới nhất! Đặt ngay hôm nay...',
    temperature: tempBreakdown(78, 0.30, 0.44, 1),  // hot 23, warm 34, cold 21
    aiAction: 'keep',
    lastUpdated: '2026-03-22T08:00:00Z',
  },
  {
    id: 'camp-5',
    name: 'Product Launch — Serum Dưỡng',
    platform: 'facebook',
    status: 'active',
    adId: 'FB-AD-002',
    budget: 12000000,
    spend: 5900000,
    impressions: 198000,
    clicks: 4120,
    conversations: 112,
    leads: 78,
    qualityScore: 81,
    conversionRate: 25.0,
    revenue: 26500000,
    ordersCount: 55,
    ordersCancelled: 6,
    phoneCollected: 67,
    postContent: '✨ Giới thiệu Serum Dưỡng 10% Vitamin C — Da sáng bật tông chỉ sau 7 ngày...',
    temperature: tempBreakdown(112, 0.38, 0.43, 5),  // hot 43, warm 48, cold 21
    aiAction: 'increase',
    lastUpdated: '2026-03-22T08:00:00Z',
  },
  {
    id: 'camp-3',
    name: 'Retargeting 2026 — Q1',
    platform: 'facebook',
    status: 'active',
    adId: 'FB-AD-003',
    budget: 20000000,
    spend: 12500000,
    impressions: 312000,
    clicks: 1840,
    conversations: 56,
    leads: 7,
    qualityScore: 28,
    conversionRate: 8.2,
    revenue: 15600000,
    ordersCount: 14,
    ordersCancelled: 2,
    phoneCollected: 19,
    postContent: '🔁 Chào bạn cũ! Q1 Retargeting — Ưu đãi đặc biệt dành riêng cho KH đã từng mua...',
    temperature: tempBreakdown(56, 0.18, 0.34, 3),  // hot 10, warm 19, cold 27
    aiAction: 'decrease',
    lastUpdated: '2026-03-22T08:00:00Z',
  },
  {
    id: 'camp-7',
    name: 'Retargeting High Intent',
    platform: 'facebook',
    status: 'paused',
    adId: 'FB-AD-004',
    budget: 10000000,
    spend: 4200000,
    impressions: 275000,
    clicks: 890,
    conversations: 31,
    leads: 2,
    qualityScore: 15,
    conversionRate: 4.7,
    revenue: 2700000,
    ordersCount: 4,
    ordersCancelled: 8,
    phoneCollected: 5,
    postContent: '🔥 Khách đã xem giỏ hàng — Hoàn tất đơn ngay hôm nay với ưu đãi 20%...',
    temperature: tempBreakdown(31, 0.13, 0.26, 7),  // hot 4, warm 8, cold 19
    aiAction: 'pause',
    lastUpdated: '2026-03-22T08:00:00Z',
  },
  {
    id: 'camp-9',
    name: 'Summer Collection 2026',
    platform: 'facebook',
    status: 'active',
    adId: 'FB-AD-005',
    budget: 8000000,
    spend: 3600000,
    impressions: 162000,
    clicks: 2650,
    conversations: 89,
    leads: 34,
    qualityScore: 67,
    conversionRate: 14.6,
    revenue: 14400000,
    ordersCount: 28,
    ordersCancelled: 3,
    phoneCollected: 42,
    postContent: '☀️ Summer Collection — Thoáng mát, nhẹ nhàng, phong cách. Khám phá ngay...',
    temperature: tempBreakdown(89, 0.25, 0.42, 9),   // hot 22, warm 37, cold 30
    aiAction: 'keep',
    lastUpdated: '2026-03-22T08:00:00Z',
  },
];

// Xu hướng hội thoại 7 ngày (Facebook only)
export const mockConversationTrend = [
  { date: '15/03', facebook: 98,  zalo: 0 },
  { date: '16/03', facebook: 112, zalo: 0 },
  { date: '17/03', facebook: 89,  zalo: 0 },
  { date: '18/03', facebook: 134, zalo: 0 },
  { date: '19/03', facebook: 156, zalo: 0 },
  { date: '20/03', facebook: 178, zalo: 0 },
  { date: '21/03', facebook: 145, zalo: 0 },
];

// Tổng quan stats (Facebook only)
export const mockOverviewStats = {
  totalConversations: 1247,
  adsConversations: 892,
  facebookConversations: 523,
  zaloConversations: 0,
  conversionRate: 23.4,
  totalSpend: 45200000,
  totalRevenue: 120260000,
  avgRoas: 2.7,
  totalOrders: 639,
  junkCampaignsCount: 3,
};

// 7 ngày chi tiết (Facebook campaigns only)
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
  'camp-3': [
    { date: '15/03', revenue: 2100000, spend: 1780000, ordersCount: 10, roas: 1.2 },
    { date: '16/03', revenue: 2400000, spend: 1800000, ordersCount: 12, roas: 1.3 },
    { date: '17/03', revenue: 1900000, spend: 1780000, ordersCount: 9,  roas: 1.1 },
    { date: '18/03', revenue: 2200000, spend: 1800000, ordersCount: 11, roas: 1.2 },
    { date: '19/03', revenue: 2300000, spend: 1790000, ordersCount: 11, roas: 1.3 },
    { date: '20/03', revenue: 2500000, spend: 1800000, ordersCount: 12, roas: 1.4 },
    { date: '21/03', revenue: 2200000, spend: 1790000, ordersCount: 11, roas: 1.2 },
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
  'camp-7': [
    { date: '15/03', revenue: 320000, spend: 600000, ordersCount: 1, roas: 0.5 },
    { date: '16/03', revenue: 380000, spend: 600000, ordersCount: 1, roas: 0.6 },
    { date: '17/03', revenue: 310000, spend: 600000, ordersCount: 0, roas: 0.5 },
    { date: '18/03', revenue: 420000, spend: 600000, ordersCount: 1, roas: 0.7 },
    { date: '19/03', revenue: 480000, spend: 600000, ordersCount: 1, roas: 0.8 },
    { date: '20/03', revenue: 550000, spend: 600000, ordersCount: 0, roas: 0.9 },
    { date: '21/03', revenue: 540000, spend: 600000, ordersCount: 0, roas: 0.9 },
  ],
  'camp-9': [
    { date: '15/03', revenue: 1800000, spend: 480000, ordersCount: 8,  roas: 3.8 },
    { date: '16/03', revenue: 2100000, spend: 510000, ordersCount: 10, roas: 4.1 },
    { date: '17/03', revenue: 1600000, spend: 490000, ordersCount: 7,  roas: 3.3 },
    { date: '18/03', revenue: 2200000, spend: 530000, ordersCount: 11, roas: 4.2 },
    { date: '19/03', revenue: 2400000, spend: 540000, ordersCount: 12, roas: 4.4 },
    { date: '20/03', revenue: 2600000, spend: 550000, ordersCount: 13, roas: 4.7 },
    { date: '21/03', revenue: 2100000, spend: 500000, ordersCount: 10, roas: 4.2 },
  ],
};
