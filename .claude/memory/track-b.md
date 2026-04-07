# Track B — Dashboard Ads (Chi Tiết)

## B1. Mục Tiêu & Tổng Quan

**Mục tiêu:** Dashboard phục vụ **CEO/CMO** — scan trong 3 giây, không cần click. Hiển thị chi tiêu, doanh thu, ROAS, chất lượng lead theo chiến dịch.

## B2. Cấu Trúc 2 Page (Side-by-Side)

Dashboard Ads được tách thành **2 route riêng** qua Sidebar:

### `/insight/dashboard` — Tổng quan Ads
```
1. Junk alert banner          ← aiAction = 'decrease' / 'pause'
2. OverviewCards (4 cards)   ← Tổng hội thoại / Từ Ads / Chuyển đổi / Chi tiêu
3. RevenueCards + PlatformROASCard + CostPerQualityLeadCard
4. ContributionChart         ← Horizontal bar: Doanh thu vs Chi tiêu theo chiến dịch
5. RevenueSpendTrendChart + SourceChart
6. CampaignSummaryTable (8 cột)
   └─ DailyDetailChart         ← Slide in khi click dòng → 7 ngày Revenue/Orders/ROAS
```

### `/insight/ads-optimization` — Gợi ý Tối ưu Ads
```
1. Junk alert banner
2. ExecutiveSummaryCard       ← Budget recommendation, urgent/watch/highlight
3. CampaignOptimizationTable (4 cột) — expandable row
```

## B3. Các File Track B

| File | Vai trò |
|------|---------|
| `src/pages/AdsDashboard.jsx` | Tổng quan Ads — overview cards, charts, summary table |
| `src/pages/AdsOptimization.jsx` | Gợi ý tối ưu Ads — AI recommendations, optimization table |
| `src/components/insight/OverviewCards.jsx` | 4 KPI tổng quan |
| `src/components/insight/RevenueCards.jsx` | 2 card: Doanh thu Portfolio + ROAS trung bình |
| `src/components/insight/ContributionChart.jsx` | Horizontal stacked bar — đóng góp từng chiến dịch |
| `src/components/insight/TrendChart.jsx` | 7-day FB vs Zalo area chart, toggle ẩn/bật từng đường |
| `src/components/insight/SourceChart.jsx` | Donut chart FB vs Zalo |
| `src/components/insight/CampaignSummaryTable.jsx` | Bảng Tổng quan — 8 cột: Chiến dịch / Chi tiêu / Hội thoại / CvR / Doanh thu / ROAS / Đơn / Chất lượng — click row → AIInsightPanel + DailyDetailChart |
| `src/components/insight/CampaignOptimizationTable.jsx` | Bảng Gợi ý tối ưu — 4 cột: Chiến dịch / AI Gợi ý / Phân tích / Chỉ số — expandable row → metrics + action buttons. Sort: Tăng → Giữ → Giảm → Tắt |
| `src/components/insight/DailyDetailChart.jsx` | 7 ngày chi tiết (Revenue + Orders area + ROAS line + Hòa vốn) |
| `src/components/ads/AdsCampaignOverviewTable.jsx` | Table chiến dịch Ads |
| `src/components/ads/AdsHealthScoreHeader.jsx` | Score header + contribution list |
| `src/components/ads/AdsDiseaseCard.jsx` | Disease card với 3 sub-tabs: Thống Kê / Đơn Hàng / Chi tiết Tin nhắn |
| `src/components/ads/AdsMedicalDashboard.jsx` | Container cho Khám Bệnh Ads |
| `src/data/mockCampaigns.js` | 8 campaigns + `mockDailyBreakdown` (8×7=56 data points) + `mockOverviewStats` |
| `src/data/mockAIInsights.js` | AI recommendations per campaign |
| `src/lib/utils.js` | `formatCurrency`, `formatRoas`, `formatCompact` |

## B4. Campaign Model (Key Fields)

```js
{
  id, name, platform,           // 'facebook' | 'zalo'
  status,                       // 'active' | 'paused'
  adId, budget, spend,
  impressions, clicks,
  conversations, leads,
  qualityScore, conversionRate,
  revenue,                       // VND — doanh thu quy cho chiến dịch
  ordersCount,                  // số đơn hàng
  aiAction,                     // 'increase' | 'decrease' | 'keep' | 'pause'
  lastUpdated
}
```

### AI Action → Junk Alert Banner
- `aiAction = 'decrease'` HOẶC `'pause'` → campaign được tính trong banner cảnh báo

## B5. Mã Màu ROAS (Nhất Quán Xuyên Suốt)

| ROAS | Màu | Ý nghĩa |
|------|-----|---------|
| ≥ 3× | `#059669` xanh | Tốt — scale được |
| ≥ 1.5× | `#d97706` vàng | Cải thiện — theo dõi |
| < 1.5× | `#dc2626` đỏ | Thấp — cần xem xét |

## B6. Daily Breakdown Data

```js
{
  'camp-1': [
    { date: '15/03', revenue, spend, ordersCount, roas },
    // 7 ngày × 8 campaigns
  ]
}
```

> **Lưu ý:** `date` trong `mockDailyBreakdown` phải khớp chính xác với `mockConversationTrend` (`'15/03'` → `'21/03'`)

### DailyDetailChart — Ngưỡng màu ROAS Line
- Dùng `avgRoas` của 7 ngày để quyết định màu line (không dùng ngưỡng cứng)
- Luôn render `<ReferenceLine y={1}>` với label `"Hòa vốn"`

## B7. Các Component Cần Biết

### RevenueCards.jsx
- Card 1: **Doanh thu Portfolio** — sum `revenue` tất cả campaign, format VND
- Card 2: **ROAS trung bình** — avg ROAS tất cả campaign

### ContributionChart.jsx
- Horizontal stacked bar
- Mỗi bar = 1 chiến dịch, chia 2 phần: doanh thu (xanh) vs chi tiêu (đỏ)
- Bar càng dài → đóng góp càng lớn

### CampaignSummaryTable.jsx — 8 cột
- Click row → mở AIInsightPanel (side panel) + DailyDetailChart bên dưới

### CampaignOptimizationTable.jsx — 4 cột
- Expandable row: hiện junk/quality/spam metrics + nút hành động
- Sort: Tăng → Giữ → Giảm → Tắt

### DailyDetailChart.jsx
- Kích hoạt khi click 1 dòng trong CampaignSummaryTable
- 3 chart trong 1: Revenue (area), Orders (area), ROAS (line)
- ReferenceLine y=1 với label "Hòa vốn"
