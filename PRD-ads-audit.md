# PRD: Khám Bệnh Quảng Cáo (Ads Medical Checkup)

> **Phiên bản:** 1.1
> **Ngày:** 2026-03-28
> **Cập nhật:** 2026-03-29 — Detail Tab 3 sub-tabs implemented
> **Design System:** Editorial Precision (DESIGN.md)
> **Trạng thái:** ✅ In Production — https://audit.cdp.vn

## 📋 Implementation Status

| Section | Trạng thái | File |
|---------|------------|------|
| Wizard 4 bước | ✅ Done | AdsConnectStep / AdsCampaignSelectStep / AdsDateRangeStep / AdsCrawlProgressStep |
| Dashboard Single View | ✅ Done | AdsMedicalDashboard |
| Health Score Header | ✅ Done | AdsHealthScoreHeader |
| KPI Cards | ✅ Done | AdsMedicalDashboard (AdsKpiCards) |
| Disease Cards — Overview + Interpretation tabs | ✅ Done | AdsDiseaseCard |
| **Disease Cards — Chi Tiết 3 sub-tabs** | ✅ **Done 2026-03-29** | AdsDiseaseCard (DetailTab) |
| Sub-tab: Thống Kê Ads | ✅ Done | DetailTab (sort worst-first per disease) |
| Sub-tab: Đơn Hàng từ Ads | ✅ Done | DetailTab + AdsOrderTable |
| Sub-tab: Chi tiết Tin nhắn | ✅ Done | DetailTab → AdsConversationDetailPanel |
| AdsConversationDetailPanel | ✅ Done | AdsConversationDetailPanel.jsx |
| AdsCriticalAlertsPanel | ✅ Done | AdsCriticalAlertsPanel.jsx |
| AdsSmaxRecommendationsPanel | ✅ Done | AdsSmaxRecommendationsPanel.jsx |
| AdsDiseaseItemLayout | ✅ Done | AdsDiseaseItemLayout.jsx |
| adsMedicalService | ✅ Done | adsMedicalService.js |
| PDF Export | ⏳ Pending | Button exists, window.print not wired |

---

## Mục lục

1. [Tổng Quan](#1-tổng-quan)
2. [Luồng Người Dùng](#2-luồng-người-dùng)
3. [Dữ Liệu](#3-dữ-liệu)
4. [Wizard 4 Bước](#4-wizard-4-bước)
5. [Dashboard Kết Quả — Single View (Bệnh Ads)](#5-dashboard-kết-quả--single-view-bệnh-ads)
6. [Nhóm Bệnh Quảng Cáo — Chi Tiết 3 Tab](#6-nhóm-bệnh-quảng-cáo--chi-tiết-3-tab)
7. [8 Nhóm Bệnh Chẩn Đoán](#7-8-nhóm-bệnh-chẩn-đoán)
8. [Kiến Trúc Kỹ Thuật](#8-kiến-trúc-kỹ-thuật)
9. [Design Specifications](#9-design-specifications)
10. [Decision Log](#10-decision-log)

---

## 1. Tổng Quan

### 1.1 Mô tả

"Khám Bệnh Quảng Cáo" phân tích **hành trình khách hàng đa kênh**: Ads → Hội thoại → Đơn hàng, nối qua **SĐT**. Kết quả là Dashboard **single view Bệnh Ads** (không còn tab Phễu Attribution) + chẩn đoán 8 nhóm bệnh quảng cáo — dùng Smax AI để gợi ý hành động cải thiện.

### 1.2 Core Loop (Gamification)

```
Khám Hội Thoại (lần đầu) → Unlock Tab Ads
                                        ↓
              Kết nối tài khoản Ads → Wizard 4 bước
                                        ↓
                          Dashboard: Bệnh Ads (single view)
                                        ↓
                    KH thấy ROAS thực + Chi phí "Ảo"
                                        ↓
                         Action theo gợi ý Smax
                                        ↓
                      Ngày hôm sau: Metrics cải thiện
```

### 1.3 Target Users

| Nhóm | Người dùng | Primary Goal |
|------|-----------|-------------|
| A | Chủ shop nhỏ (1-2 nhân viên) | "Tôi đang losing bao nhiêu tiền vào ads rác?" |
| B | Marketing Manager | "Chiến dịch nào thực sự chuyển đổi thành đơn?" |
| C | CEO / Chủ doanh nghiệp | "Tổng chi phí có đáng không? ROAS thật vs ảo?" |

### 1.4 Điều kiện Unlock

Tab Ads chỉ hiển thị/active khi `localStorage` có ≥1 medical record (đã khám Hội Thoại ≥1 lần). Check: `getMedicalHistory().length > 0`.

---

## 2. Luồng Người Dùng

### 2.1 Architecture

```
MedicalCheckup.jsx (route: /insight/medical-checkup)
  ├── Wizard step indicator: [Hội Thoại] [Ads]
  │
  ├── [Tab: Hội Thoại] ← luôn active
  │   └── MedicalResultStep (existing — Track A)
  │
  └── [Tab: Ads] ← active only if hasMedicalHistory
        │
        ├── [LOCKED STATE] — chưa khám Hội Thoại lần nào
        │   Banner card với benefits list + CTA "Bắt đầu Khám Hội Thoại →"
        │
        └── [WIZARD STATE] — đã khám
              ├── Step 1: AdsConnectStep (mock UI — kết nối Meta/Google)
              ├── Step 2: AdsCampaignSelectStep (checkbox multi-select)
              ├── Step 3: AdsDateRangeStep (7d / 30d / 90d)
              ├── Step 4: AdsCrawlProgressStep (progress bar)
              └── Dashboard: AdsMedicalDashboard (single view — Bệnh Ads)
```

### 2.2 Route

> Không tạo route mới — Ads Wizard là **tab state trong MedicalCheckup.jsx**

---

## 3. Dữ Liệu

### 3.1 Attribution Table (Mock — File mới)

**File:** `src/data/mockAttributionData.js`

Mỗi row = 1 hành trình khách hoàn chỉnh:

```js
{
  id: 'attr-001',
  phoneHash: 'sha256_xxx',
  phone: '0912***789',           // masked display
  platform: 'facebook',             // 'facebook' | 'zalo'
  orderId: 'ORD-20260315-001',
  orderValue: 450000,             // VND
  orderDate: '2026-03-15T14:22:00Z',
  revenue: 450000,

  // Attribution — First Touch
  firstTouch: {
    campaignId: 'camp-1',
    campaignName: 'KPI Spring Sale 2026',
    platform: 'facebook',
    adId: 'FB-AD-001',
    adName: 'Spring Sale - Carousel - 1',
    touchDate: '2026-03-10T09:15:00Z',
    daysToConversion: 5,
  },

  // Attribution — Last Touch
  lastTouch: {
    campaignId: 'camp-2',
    campaignName: 'Retargeting - Cart Abandoned',
    platform: 'facebook',
    adId: 'FB-AD-007',
    adName: 'Retargeting - 20% Off',
    touchDate: '2026-03-15T10:05:00Z',
    daysToConversion: 0,
  },

  // Tất cả các lần chạm (ordered by time)
  touches: [
    { campaignId: 'camp-1', campaignName: 'KPI Spring Sale 2026',
      platform: 'facebook', adId: 'FB-AD-001', adName: 'Spring Sale - Carousel',
      touchDate: '2026-03-10T09:15:00Z', type: 'impression' },
    { campaignId: 'camp-3', campaignName: 'Brand Awareness March',
      platform: 'zalo', adId: 'ZALO-AD-003', adName: 'Zalo OA - Brand Post',
      touchDate: '2026-03-12T20:30:00Z', type: 'click' },
    { campaignId: 'camp-2', campaignName: 'Retargeting - Cart Abandoned',
      platform: 'facebook', adId: 'FB-AD-007', adName: 'Retargeting - 20% Off',
      touchDate: '2026-03-15T10:05:00Z', type: 'click' },
  ],

  // Match với conversation (nếu có SĐT)
  matchedConversationId: 'fsh-1-row-042',
  matchedConversationTemp: 'Nóng',
  conversationDate: '2026-03-15T10:08:00Z',

  // Reference
  campaignId: 'camp-1',
  campaignPlatform: 'facebook',
  campaignBudget: 15000000,
  campaignSpend: 8200000,
  campaignRoas: 4.0,
  attributedRoas: 3.8,
}
```

**Quy tắc generate mock (deterministic — dùng `sr()` seed):**
- 50–80 attribution rows tổng cộng
- `phone` = số VN format (09xx, 03xx...), masked display
- `platform`: 70% facebook, 30% zalo
- `orderValue`: 200,000 – 2,000,000 VND
- `daysToConversion`: 60% trong 7 ngày, 30% 7-14 ngày, 10% 14-30 ngày
- `attributedRoas` = `campaignRoas × (0.6 – 1.0)`
- ~20% không có `matchedConversationId` (untracked)

### 3.2 Nguồn dữ liệu kết hợp

| Nguồn | Dùng cho | File |
|-------|---------|------|
| `mockCampaigns.js` | Campaign metadata (budget, spend, name, platform) | Campaign selector + disease groups |
| `mockAIInsights.js` | AI recommendation per campaign | `adsMedicalService.js` |
| `supabase-conversations.json` | Conversation data (phone_status, temp) | Attribution matching + conversation disease |
| `mockAttributionData.js` | Attribution records (NEW) | Funnel + attribution disease groups |

---

## 4. Wizard 4 Bước

---

### Step 1 — Kết nối Tài khoản Quảng Cáo

```
┌─────────────────────────────────────────────────────────────────┐
│  [← Quay lại]                                                   │
│                                                                   │
│  🏥  KHÁM BỆNH QUẢNG CÁO                                        │
│  ─────────────────────────────────────────────────────            │
│                                                                   │
│  Bước 1/4: Kết nối Tài khoản Quảng Cáo                          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  [✓ Done  ]  │  │ [○ Active ]  │  │ [  Pending]  │           │
│  │  Kết nối   │  │  Chọn       │  │  Khoảng     │           │
│  │  Ads       │  │  Chiến dịch │  │  thời gian  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                             │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐          │  │
│  │  │  🌐  Meta Ads       │  │  🔍  Google Ads     │          │  │
│  │  │  Facebook + IG      │  │  Search + Display   │          │  │
│  │  └─────────────────────┘  └─────────────────────┘          │  │
│  │                                                             │  │
│  │  Phân tích hành trình: Ads → Hội thoại → Đơn hàng        │  │
│  │  Kết nối qua SĐT để truy xuất nguồn đơn hàng thực      │  │
│  │                                                             │  │
│  │  [  🔗 Kết nối Tài khoản Ads  ]                          │  │
│  │                                                             │  │
│  │  ✅ Mockup — chưa kết nối thật với Meta/Google            │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Hành vi:** Nhấn nút → 2-3s loading spinner → auto chuyển Step 2

---

### Step 2 — Chọn Chiến dịch

```
┌─────────────────────────────────────────────────────────────────┐
│  [← Quay lại]                                                   │
│                                                                   │
│  🏥  KHÁM BỆNH QUẢNG CÁO                                        │
│  ─────────────────────────────────────────────────────            │
│                                                                   │
│  Bước 2/4: Chọn chiến dịch quảng cáo                            │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  [✓ Done  ]  │  │ [○ Active ]  │  │ [  Pending]  │           │
│  │  Kết nối   │  │  Chọn       │  │  Khoảng     │           │
│  │  Ads       │  │  Chiến dịch │  │  thời gian  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  Tất cả (6)        Facebook (4)       Zalo (2)       Đang chạy (5)  │
│  ─────────────────────────────────────────────────────────────────── │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  ☑  ┌──┐ KPI Spring Sale 2026           Facebook │  Budget: 15,000,000 │ │
│  │      │FB│ 📣 234 hội thoại                                          │ │
│  │      └──┘ ROAS: 4.0x  │  Spend: 8.2M  │  Đơn: 164               │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │  ☑  ┌──┐ Retargeting - Cart Abandoned     Facebook │  Budget: 5,000,000  │ │
│  │      │FB│ 📣 89 hội thoại                                             │ │
│  │      └──┘ ROAS: 3.2x  │  Spend: 3.1M  │  Đơn: 67                │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │  ☑  ┌──┐ Brand Awareness March          Zalo    │  Budget: 8,000,000  │ │
│  │      │ZA│ 📣 45 hội thoại                                             │ │
│  │      └──┘ ROAS: 1.8x  │  Spend: 5.2M  │  Đơn: 31                │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │  ☐  ┌──┐ Summer Collection Test         Facebook │  Budget: 3,000,000 │ │
│  │      │FB│ 📣 12 hội thoại                                             │ │
│  │      └──┘ ROAS: 2.1x  │  Spend: 0.8M  │  Đơn: 8                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Đã chọn: 3 chiến dịch  │  Tổng ngân sách: 28,000,000đ  │  [Tiếp tục →]  │
└─────────────────────────────────────────────────────────────────┘
```

**Hành vi:** Checkbox multi-select, mặc định tất cả checked. Nhấn "Tiếp tục" chuyển Step 3.

---

### Step 3 — Chọn Khoảng thời gian

```
┌─────────────────────────────────────────────────────────────────┐
│  [← Quay lại]                                                   │
│                                                                   │
│  🏥  KHÁM BỆNH QUẢNG CÁO                                        │
│  ─────────────────────────────────────────────────────            │
│                                                                   │
│  Bước 3/4: Chọn khoảng thời gian phân tích                      │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  [✓ Done  ]  │  │  [✓ Done  ]  │  │ [○ Active ]  │           │
│  │  Kết nối   │  │  Chọn       │  │  Khoảng     │           │
│  │  Ads       │  │  Chiến dịch │  │  thời gian  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  Chọn khoảng thời gian thu thập dữ liệu                         │
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                 │
│  │            │  │            │  │            │                 │
│  │   7 ngày  │  │   30 ngày  │  │   90 ngày  │                 │
│  │            │  │            │  │            │                 │
│  │  ~3 phút  │  │  ~10 phút  │  │  ~30 phút  │                 │
│  │  crawl    │  │  crawl     │  │  crawl    │                 │
│  └────────────┘  └────────────┘  └────────────┘                 │
│       (O)              ( )             ( )                       │
│                                                                   │
│  📊 Ước tính: 2 chiến dịch × 7 ngày = ~350 đơn hàng           │
│                                                                   │
│                          [ Bắt đầu Phân tích → ]                │
└─────────────────────────────────────────────────────────────────┘
```

---

### Step 4 — Màn hình Phân tích

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  🏥  Đang phân tích hành trình khách hàng...                    │
│                                                                   │
│  ══════════════════════════════════════════════════════          │
│  ║███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║          │
│  ══════════════════════════════════════════════════════          │
│                                                                   │
│  📊  Đã xử lý:  68 / 100 attribution records                    │
│  ⏱️  Còn lại:   ~45 giây                                        │
│  📈  Tiến độ:   68%                                              │
│                                                                   │
│  ─────────────────────────────────────────────────────            │
│                                                                   │
│  🏥  Các "bệnh" đang được phân tích:                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │ ✅ ROAS Thực vs Ảo           ─────────────── Done       │     │
│  │ ✅ Chiến Dịch Rác            ─────────────── Done       │     │
│  │ ◉ Attribution Quality             ═══════════    60%        │     │
│  │ ○ Audience Targeting             ─────────────── Pending    │     │
│  │ ○ Budget Allocation              ─────────────── Pending    │     │
│  │ ○ Platform Performance           ─────────────── Pending    │     │
│  │ ○ Ad Creative Health             ─────────────── Pending    │     │
│  │ ○ Lead → Order Conversion        ─────────────── Pending    │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                   │
│  🔄  Đang phân tích nhóm "Attribution Quality"...               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Hành vi:** Auto chuyển Dashboard khi progress = 100%

---

## 5. Dashboard Kết Quả — Single View (Bệnh Ads)

---

### Single View — Bệnh Ads (Mặc định)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [← Khám lại]     🏥 HỒ SƠ QUẢNG CÁO                    [🔄 Khám lại]      │
│                      ─────────────────────────────────────────────────────────│
│  📅 07/03 → 28/03/2026  │  3 chiến dịch  │  ⏱️ Cập nhật real-time daily  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ⚠️ ĐIỂM SỨC KHỎE QUẢNG CÁO:  5.8 / 10  [CẢNH BÁO]                     │
│  [███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]        │
│  ▲ +0.4 so với lần khám trước                                               │
│                                                                              │
│  [Bệnh Ads ✅]  (single view — đã bỏ tab Funnel)                            │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  📍 FUNNEL ATTRIBUTION  (Ads → Hội thoại → Đơn hàng)                        │
│  ─────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                          │  │
│  │  IMPRESSIONS          CLICKS           HỘI THOẠI        ĐƠN HÀNG    │  │
│  │  ████████████████  ██████████      ████████        ██████             │  │
│  │  1,245,000         18,420            368             89                  │  │
│  │  (100%)            (1.48%)          (2.00%)        (24.2%)           │  │
│  │                                                                          │  │
│  │  ─────────────────────────────────────────────────────────────         │  │
│  │  📞 SĐT thu thập: 89/368 (24.2%)                                       │  │
│  │  🔗 Attribution Matched: 67/89 (75.3%) ← đơn có SĐT + match được    │  │
│  │  ⚠️ Untracked Orders: 22 (không match được)                             │  │
│  │                                                                          │  │
│  │  💡 "Chi phí Ảo" phát hiện: 39,300,000đ — đơn không truy xuất nguồn   │  │
│  │                                                                          │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  📊 ROAS BREAKDOWN                                                           │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  ┌────────────────────────────────────────────────────────────────────┐ │  │
│  │  │ KPI Spring Sale 2026           FB  │  ⭐ Recommended              │ │  │
│  │  │─────────────────────────────────── │  ──────────────────────────── │ │  │
│  │  │  ROAS gốc:  ●●●●○○○○○○  4.0x     │  ROAS thực:  ●●●○○○○○○○○ 3.2x │ │  │
│  │  │  Đơn: 164                       │  Matched: 131/164 (79.9%)      │ │  │
│  │  │  Revenue: 65,600,000đ           │  Untracked: 33 đơn (13.2M)     │ │  │
│  │  │                                  │  ⚠️ Lệch: -20%                  │ │  │
│  │  │  [Xem chi tiết orders →]       │  [Gợi ý Smax →]               │ │  │
│  │  └────────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                          │  │
│  │  ┌────────────────────────────────────────────────────────────────────┐ │  │
│  │  │ Retargeting - Cart Abandoned       FB  │  📈 Scale Up               │ │  │
│  │  │  ROAS gốc:  ●●●○○○○○○○○  3.2x     │  ROAS thực:  ●●●○○○○○○○○ 2.9x │ │  │
│  │  │  Đơn: 67                        │  Matched: 58/67 (86.6%)        │ │  │
│  │  │  Revenue: 18,900,000đ           │  Untracked: 9 đơn (2.5M)      │ │  │
│  │  └────────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                          │  │
│  │  ┌────────────────────────────────────────────────────────────────────┐ │  │
│  │  │ Brand Awareness March              ZA  │  ⚠️ Needs Review           │ │  │
│  │  │  ROAS gốc:  ●●○○○○○○○○○  1.8x     │  ROAS thực:  ●○○○○○○○○○○ 0.9x │ │  │
│  │  │  Đơn: 31                        │  Matched: 14/31 (45.2%)        │ │  │
│  │  │  Revenue: 4,700,000đ            │  Untracked: 17 đơn (2.6M)     │ │  │
│  │  └────────────────────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  📌 TỔNG HỢP HÀNH ĐỘNG ĐÃ LƯU (2 actions)                                │
│  ─────────────────────────────────────────────────────────────────────────── │
│                    [Xuất báo cáo PDF]                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### (Deprecated) Tab 2 — Nhóm Bệnh Quảng Cáo (đã gộp vào Single View)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [← Khám lại]     🏥 HỒ SƠ QUẢNG CÁO                    [🔄 Khám lại]      │
│  📅 07/03 → 28/03/2026  │  3 chiến dịch  │  ⏱️ Cập nhật real-time daily  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ⚠️ ĐIỂM SỨC KHỎE QUẢNG CÁO:  5.8 / 10  [CẢNH BÁO]                     │
│  [███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]        │
│                                                                              │
│  [🔴 Bệnh Ads ✅]  (single view)                                           │
│                                                                              │
│  [Tất cả] [ROAS] [Ngân sách] [Target] [Conv] [Platform] [Creative] [Rác]   │
│                                                                              │
│  ┌──────────────────────────────────────────┐  ┌──────────────────────────┐ │
│  │ 🔴 BỆNH 1: ROAS Thực Thấp Hơn Báo Cáo │  │ 🏥 SMAR GỢI Ý           │ │
│  │ Nhóm: ROAS Health │ Mức độ: NẶNG      │  │                          │ │
│  │ Điểm: 2.4/10 │ ▲ Lệch -20%           │  │ 3 hành động khuyến nghị │ │
│  │ ───────────────────────────────────────│  │                          │ │
│  │ [Tổng quan] [Diễn Giải] [Chi Tiết]    │  │ ┌──────────────────────┐│ │
│  │ ───────────────────────────────────────│  │ │ 🔴 A/B test 3 head  ││ │
│  │ ... (xem Section 6 chi tiết)           │  │ │  Tác động: ↑ CTR 25%││ │
│  │ [Thu gọn ▲]                            │  │ │  [Chọn ✓] [Xem →]  ││ │
│  └──────────────────────────────────────────┘  │ └──────────────────────┘│ │
│                                                  │                          │ │
│  ┌──────────────────────────────────────────┐  │ ┌──────────────────────┐│ │
│  │ 🟡 BỆNH 2: Audience Targeting Trùng Lặp  │  │ │ 🟡 Thêm UTM param    ││ │
│  │ Nhóm: Audience │ Mức độ: TRUNG BÌNH     │  │ │  Tác động: ↑ match  ││ │
│  │ Điểm: 4.1/10                          │  │ │  [Chọn] [Xem →]     ││ │
│  │ ───────────────────────────────────────│  │ └──────────────────────┘│ │
│  │ [Thu gọn ▲]                            │  │                          │ │
│  └──────────────────────────────────────────┘  │ [Tải lại Smax] [Lưu tất]│ │
│                                                  └──────────────────────────┘ │
│  ... (6 bệnh còn lại — sắp xếp nặng → nhẹ)                              │
│                                                                              │
│  ════════════════════════════════════════════════════════════════════════   │
│  📌 TỔNG HỢP HÀNH ĐỘNG ĐÃ LƯU (2 actions)                               │
│  ════════════════════════════════════════════════════════════════════════   │
│                    [Xuất báo cáo PDF]                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Nhóm Bệnh Quảng Cáo — Chi Tiết 3 Tab ⭐ IMPLEMENTED 2026-03-29

Mỗi Disease Card trong Tab "Bệnh Ads" có **4 tab con**: Tổng Quan / Diễn Giải / Chi Tiết (với **3 sub-tab**: Thống Kê Ads / Đơn Hàng từ Ads / Chi tiết Tin nhắn). Layout áp dụng từ wireframe `robust-swinging-nest-wireframes-ads-disease-detail.md`.

---

### 6.1 Tab Tổng Quan

Nội dung: 4 metrics cards + Line chart 7 ngày (ROAS gốc vs thực) + Breakdown theo chiến dịch.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  🔴 BỆNH 1: ROAS Thực Thấp Hơn Báo Cáo                            [Thu gọn ▲] │
│  Nhóm: ROAS Health  │  Mức độ: NẶNG  │  Điểm: 2.4/10  │  ▲ Lệch -20%       │
│  ────────────────────────────────────────────────────────────────────────────────│
│                                                                                  │
│  [🔵 Tổng Quan]    [Diễn Giải]    [Chi Tiết]                                    │
│  ──────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │  📊 CHỈ SỐ CHÍNH                                                          │  │
│  │                                                                             │  │
│  │  ROAS gốc          ROAS thực         Untracked Revenue    Match Rate         │  │
│  │  ████████░░░░░░  ██████░░░░░░░░  ████████░░░░░░░  ████████████████░░░   │  │
│  │     4.0x               3.2x               31.2M              75.3%         │  │
│  │     (gốc)              (thực)             ⚠️ cao           (matched)        │  │
│  │  ▲ +8% vs tuần trước     ▼ -5% vs tuần trước   ▲ +3 đơn       ▲ +2.1%   │  │
│  └────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │  📈 BIỂU ĐỒ ROAS — 7 ngày gần nhất                                     │  │
│  │                                                                             │  │
│  │   5.0x ────────────────────────────────────────────                       │  │
│  │                ╭─╮                                                           │  │
│  │   4.0x ── ─╮  ─ ─╯  ╰─ ─ ─╮                              ← ROAS gốc      │  │
│  │             ╰─ ─ ─ ─ ─ ─ ─ ─╯  ─ ─ ─╮  (dashed line)                    │  │
│  │   3.0x ── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─╰─ ─╮                                  │  │
│  │                                ╰─ ─╯    ← ROAS thực (solid line)         │  │
│  │   2.0x ── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─╮                                │  │
│  │                                          ╰─ ─ ─ ─                         │  │
│  │   1.0x ───────────────────────────────────────────────────────     ─     │  │
│  │          22/03   23/03   24/03   25/03   26/03   27/03   28/03          │  │
│  │   Gap giữa 2 đường = Revenue không match được với Ads                     │  │
│  └────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │  📋 BREAKDOWN THEO CHIẾN DỊCH                                              │  │
│  │                                                                             │  │
│  │  Chiến dịch        │ ROAS gốc → thực    │ Untracked        │ Chi tiết       │  │
│  │  ──────────────────┼───────────────────┼──────────────────┼────────────────│  │
│  │  camp-1 (FB)     │ 4.0x → 3.2x [-20%]│ 33 đơn (13.2M)  │ [→ Chi tiết]   │  │
│  │  camp-2 (FB)     │ 3.2x → 2.9x [-9%] │ 9 đơn (2.5M)    │ [→ Chi tiết]   │  │
│  │  camp-3 (ZA)     │ 1.8x → 0.9x [-50%]│ 17 đơn (15.6M)  │ [→ Chi tiết]   │  │
│  └────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### 6.2 Tab Diễn Giải

Nội dung: Prose tiếng Việt — Chẩn đoán / Vấn đề nổi bật / Bottom Line.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  🔴 BỆNH 1: ROAS Thực Thấp Hơn Báo Cáo                            [Thu gọn ▲] │
│  [Tổng Quan]    [🔵 Diễn Giải]    [Chi Tiết]                                    │
│  ──────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │  🔍 CHẨN ĐOÁN                                                           │  │
│  │                                                                             │  │
│  │  Chiến dịch "Brand Awareness March" đang báo cáo ROAS 1.8x, nhưng khi    │  │
│  │  đối soát với đơn hàng thực tế (qua SĐT), chỉ 45.2% đơn hàng có thể    │  │
│  │  truy xuất nguồn về chiến dịch này. Điều này có nghĩa là:                │  │
│  │                                                                             │  │
│  │  • 17 đơn hàng (55% còn lại) không match được với bất kỳ Ads nào          │  │
│  │  • Tiền chi cho 17 đơn này = "chi phí ảo" — không rõ nguồn chuyển đổi   │  │
│  │  • Rủi ro: team đang tăng budget dựa trên ROAS ảo                       │  │
│  │                                                                             │  │
│  │  ──────────────────────────────────────────────────────────────────────── │  │
│  │                                                                             │  │
│  │  ⚠️ VẤN ĐỀ NỔI BẬT                                                       │  │
│  │                                                                             │  │
│  │  Tỉ lệ match chỉ 45.2% — ngưỡng nguy hiểm. Thông thường, tỉ lệ tối     │  │
│  │  thiểu nên đạt 70% để đảm bảo attribution data đáng tin cậy.            │  │
│  │  Đặc biệt nghiêm trọng với Zalo OA — không có Pixel tracking mặc định.  │  │
│  │                                                                             │  │
│  │  ──────────────────────────────────────────────────────────────────────── │  │
│  │                                                                             │  │
│  │  💡 BOTTOM LINE                                                           │  │
│  │                                                                             │  │
│  │  Hành động ngay: Thêm UTM parameter + Pixel event vào Zalo OA để        │  │
│  │  track chính xác. ROAS thực của camp-3 có thể cao hơn nếu đo lường    │  │
│  │  đúng — nhưng hiện tại không có data để xác nhận.                       │  │
│  └────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### 6.3 Tab Chi Tiết — 3 Sub-Tabs

> **Wireframe mới thay thế hoàn toàn wireframe cũ (6.3 Tab Chi Tiết — 2 Sub-Tabs)**
> Xuất phát từ **Ads ID** đang có vấn đề. Sort worst-first. Mỗi sub-tab đều filter theo Ad đang chọn.

**Nguyên tắc thiết kế:**
- Xuất phát từ **Ads ID** (không phải chiến dịch)
- Sort worst-first: ads có metrics xấu nhất lên đầu
- Mỗi nhóm bệnh có **score riêng** cho từng Ad dựa trên metrics của nhóm đó
- 3 sub-tab: **Thống kê Ads** / **Đơn Hàng từ Ads** / **Chi tiết Tin nhắn**

---

#### Sơ đồ Data Flow

```
attributionData (50-80 rows)
  │
  ├── Per-Ad aggregation  ← adsMedicalService.computeAdMetricsPerAd()
  │     ├── group by: adId (from firstTouch.adId / lastTouch.adId)
  │     ├── metrics per adId: cost, messageCount, phoneCollected, orderCount, revenue, roas
  │     └── adScore per disease group  ← filter row by disease.id switch
  │
  ├── Order enrichment     ← attributionData filtered by selected adId
  │     └── link: orderId → order details (value, date, matched status)
  │
  ├── Conversation enrichment  ← mockConversationDetails.js hoặc fallback generate
  │     └── link: matchedConversationId → conversations[].messages[]
  │
  └── Disease-specific scoring
        ├── roas-health      → sort by roasGap (worst-first)
        ├── attribution-qa   → sort by unmatchedCount (worst-first)
        ├── lead-order-conv  → sort by coldToOrderRate (worst-first)
        ├── junk-campaigns   → sort by junkRate (worst-first)
        └── ... (8 nhóm đều có sort key riêng)
```

---

**Sub-Tab 1: Thống Kê Ads**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  [Tổng Quan]    [Diễn Giải]    [🔵 Chi Tiết]                                    │
│  ───────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  [📊 Thống Kê Ads]    [📦 Đơn hàng từ Ads]    [💬 Chi tiết Tin nhắn]  ← pills│
│  ──────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  📋 {disease.label} theo Ad  │  6 Ads  │  [Tải lại ↻]               │
│  ────────────────────────────────────────────────────────────────────────────────│
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │ ADS ID         │ CHI PHÍ  │ TIN NHẮN │ SĐT THU THẬP │ ĐƠN │ DTUONG THU │ ROAS ││
│  │────────────────┼──────────┼──────────┼───────────────┼──────┼───────────┼──────││
│  │ 🔴 FB-Ads-003  │ 4.2M     │ 89       │ 12            │  31  │ 89.5M     │ 0.9x ││
│  │    Retargeting 20% Off    │ ▲ worst  │ ⚠️ 13.5%      │      │ ▼ -55%    │ ▼    ││
│  ├────────────────┼──────────┼──────────┼───────────────┼──────┼───────────┼──────││
│  │ 🔴 ZL-Ads-001  │ 5.1M     │ 45       │ 8             │  14  │ 12.6M     │ 1.2x ││
│  │    Brand Post Zalo OA     │          │ ⚠️ 17.8%      │      │ ▼ -42%    │ ▼    ││
│  ├────────────────┼──────────┼──────────┼───────────────┼──────┼───────────┼──────││
│  │ 🟡 FB-Ads-001  │ 8.2M     │ 234      │ 89            │ 164  │ 65.6M     │ 3.2x ││
│  │    Spring Sale Carousel   │ ▲ best   │ ✅ 38.2%       │      │ ▲ +8%     │ ▲    ││
│  ├────────────────┼──────────┼──────────┼───────────────┼──────┼───────────┼──────││
│  │ 🟡 FB-Ads-007  │ 3.1M     │ 67       │ 31            │  58  │ 18.9M     │ 2.9x ││
│  │    Cart Abandoned         │          │ ✅ 46.3%       │      │ ▲ +2%     │ ▲    ││
│  ├────────────────┼──────────┼──────────┼───────────────┼──────┼───────────┼──────││
│  │ ⚪ ZL-Ads-002  │ 2.8M     │ 22       │ 5             │  8   │ 4.7M      │ 1.8x ││
│  │    Flash Deal March       │          │ ✅ 22.7%       │      │ ▲ +5%     │ ▲    ││
│  ├────────────────┼──────────┼──────────┼───────────────┼──────┼───────────┼──────││
│  │ ⚪ FB-Ads-008  │ 0.8M     │ 12       │ 4             │  8   │ 3.2M      │ 2.1x ││
│  │    Summer Test            │          │ ✅ 33.3%       │      │ ▲ +3%     │ ▲    ││
│  └────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  💡 Click vào dòng để xem chi tiết Đơn hàng & Tin nhắn từ Ad đó              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Sub-row expand (khi click vào dòng):**

```
│  ▶ FB-Ads-003   │  4.2M   │  89  │  12  │  31  │  89.5M  │  0.9x  │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │  📊 CHỈ SỐ CHI TIẾT — FB-Ads-003                                    [▲] │  │
│  │  ─────────────────────────────────────────────────────────────────────────│  │
│  │  Chiến dịch: KPI Spring Sale 2026  │  Platform: Facebook  │  Ad Set: Retarget │  │
│  │  ─────────────────────────────────────────────────────────────────────────│  │
│  │  Impressions: 124,500  │  CTR: 0.8%  │  Scroll Stop: 12%  │  Hook Retention: 45%│  │
│  │  Match Rate: 13.5% ⚠️  │  Untracked: 23 đơn  │  Virtual Cost: 4.2Mđ ⚠️       │  │
│  │  ─────────────────────────────────────────────────────────────────────────│  │
│  │  💡 "Ad này có tỉ lệ match chỉ 13.5% — 23 đơn không truy xuất được.    │  │
│  │     Nguyên nhân: thiếu Pixel trên Zalo OA. Chi phí ảo = 4.2Mđ."         │  │
│  │  ─────────────────────────────────────────────────────────────────────────│  │
│  │  [📦 Xem đơn hàng từ Ad này]   [💬 Xem tin nhắn từ Ad này →]         │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
```

**Quy tắc sort (per disease group):**

| Disease Group | Sort Key | Chiều |
|---|---|---|
| ROAS Thực vs Ảo | `roasGap` (cao nhất = worst) | ↓ |
| Attribution Quality | `matchedRate` (thấp nhất = worst) | ↓ |
| Ad Creative Health | `ctr` (thấp nhất = worst) | ↓ |
| Audience Targeting | `overlapPercent` (cao nhất = worst) | ↓ |
| Budget Allocation | `dailyUtilization` (thấp nhất = worst) | ↓ |
| Platform Performance | `roas` (thấp nhất = worst) | ↓ |
| Lead → Order Conversion | `coldToOrderRate` (cao nhất = worst) | ↓ |
| Chiến Dịch Rác | `junkRate` (cao nhất = worst) | ↓ |

**Color coding row:**

| Màu | Ý nghĩa |
|---|---|
| 🔴 `#BF3003` Deep Rust | Ad có vấn đề nghiêm trọng (score ≤ 3 / ROAS < 1.5x / unmatched > 30%) |
| 🟡 `#d97706` Amber | Ad cần theo dõi (3 < score < 6 / 1.5x ≤ ROAS < 3x) |
| ⚪ `#059669` Emerald | Ad khỏe mạnh (score ≥ 6 / ROAS ≥ 3x) |

---

**Sub-Tab 2: Đơn Hàng từ Ads**

Xuất phát từ **Ad đang được chọn** ở sub-tab 1. Nếu chưa chọn Ad → hiện empty state. Bảng đơn hàng của Ad đó, lọc Matched / Untracked.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  [📊 Thống Kê Ads]    [🔵 Đơn hàng từ Ads]    [💬 Chi tiết Tin nhắn]  ← pill│
│  ──────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  📋 Targeting Ad:  [FB-Ads-003 — Retargeting 20% Off ▼]  │  ← synced dropdown  │
│  ────────────────────────────────────────────────────────────────────────────────│
│                                                                                  │
│  BỘ LỌC:  [Tất cả 31] [Matched ✅ 18] [Untracked ⚠️ 13]  │  Tìm: [____________]│
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │ Order ID        │ SĐT      │ Giá trị │ Ngày  │ Attribution       │ Trạng ││  │
│  │ ────────────────┼──────────┼─────────┼───────┼───────────────────┼───────┤│  │
│  │ORD-20260328-001 │ 091***789│ 650K   │28/03  │Last: FB-Ads-003  │  ✅   ││  │
│  │ORD-20260327-005 │ 090***234│ 320K   │27/03  │First: FB-Ads-003 │  ✅   ││  │
│  │ORD-20260327-003 │ —       │ 890K   │27/03  │Untracked ⚠️       │  ⚠️   ││  │
│  │  └─ ⚠️ Không match SĐT — đơn nằm ngoài attribution window               ││  │
│  │ORD-20260326-012 │ 093***567│ 450K   │26/03  │Last: FB-Ads-003  │  ✅   ││  │
│  │ORD-20260325-007 │ 098***123│ 1.2M   │25/03  │Last: FB-Ads-003  │  ✅   ││  │
│  │  └─ ⚠️ Không match SĐT — đơn nằm ngoài attribution window               ││  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│  Trang 1 / 2    [◀ Trước]    [Sau ▶]                                          │
│                                                                                  │
│  📊 SUMMARY — FB-Ads-003:                                                       │
│  ┌─────────────────┬────────────────┬────────────────┬─────────────────────────┐│
│  │ Matched ✅      │ Untracked ⚠️   │ Revenue Matched│ Revenue Untracked     ││
│  │ 18 đơn          │ 13 đơn         │ 41,200,000đ    │ 10,800,000đ           ││
│  │ 58.1%           │ 41.9%          │ (79.2%)        │ (20.8%) ⚠️            ││
│  └─────────────────┴────────────────┴────────────────┴─────────────────────────┘│
│  💡 41.9% đơn không truy xuất được → "Chi phí Ảo" = 10,800,000đ từ Ad này   │
│                                                                                  │
│  [← Quay lại Thống kê Ads]                                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Empty state (chưa chọn Ad):**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│                         ┌─────────────────────────┐                              │
│                         │    📊 Chưa chọn Ad     │                              │
│                         │                         │                              │
│                         │  Chọn 1 Ad từ tab     │                              │
│                         │  "Thống kê Ads" để      │                              │
│                         │  xem đơn hàng từ Ad    │                              │
│                         │                         │                              │
│                         │  [← Quay lại Thống kê] │                              │
│                         └─────────────────────────┘                              │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

**Sub-Tab 3: Chi tiết Tin nhắn**

Xuất phát từ **Ad đang được chọn**. 2 cột: **40% Danh sách Hội thoại** | **60% Chi tiết Tin nhắn**. Empty state khi chưa chọn Ad.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  [📊 Thống Kê Ads]    [📦 Đơn hàng từ Ads]    [🔵 Chi tiết Tin nhắn]  ← pill│
│  ──────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  📋 Targeting Ad:  [FB-Ads-003 — Retargeting 20% Off ▼]  │  ← synced dropdown  │
│  ────────────────────────────────────────────────────────────────────────────────│
│                                                                                  │
│  BỘ LỌC:  [Tất cả] [Nóng 🔴] [Ấm 🟡] [Lạnh ⚪]     Tìm: [________________]   │
│  🔗 CHỈ HIỂN THỊ: Hội thoại đã match với Ad đang chọn (có SĐT)              │
│                                                                                  │
│  ┌──────────────────────────────┬──────────────────────────────────────────────┐
│  │                              │                                              │
│  │  💬 HỘI THOẠI TỪ ADS      │  👤 Nguyễn Văn A  │  📱 Facebook           │
│  │  (40%)                      │  SĐT: 091***789   │  📞 Thu thập ✅        │
│  │  ────────────────────────────│  ──────────────────────────────────────────  │
│  │                              │  [💬 Tin nhắn] [📊 Đánh Giá] [Hành Động]  │
│  │                              │  ──────────────────────────────────────────  │
│  │  🔴 Nguyễn Văn A           │  💬 TIN NHẮN                                  │
│  │  📱 FB │ 091***789         │  ──────────────────────────────────────────  │
│  │  Order: 650K │ FB-Ads-003  │  👤 Khách: Chào shop, mình muốn hỏi về      │
│  │  Touches: 2 │ 15/03        │      sản phẩm Áo phông nam size L [10:15]    │
│  │  🔴 NÓNG                  │  🏪 Shop: Dạ có ạ, Size L còn 5 cái. [10:16] │
│  │  ────────────────────────────│  👤 Khách: Có màu đen không? Đặt 2 cái.  │
│  │  🟡 Trần Thị B            │      [10:18]                                  │
│  │  📱 FB │ 090***234         │  🏪 Shop: Dạ có ạ. SĐT: 091***789 nhé.    │
│  │  Order: 320K │ FB-Ads-003  │      [10:19]                                  │
│  │  Touches: 3 │ 15/03        │  👤 Khách: Size L, chuyển khoản 650K.      │
│  │  🟡 ẤM                  │      Confirm đơn rồi nhé [10:21]               │
│  │  ────────────────────────────│  🏪 Shop: ✅ Confirm thành công! Ship 2-3d│  │
│  │  ⚪ Lê Văn C              │  ──────────────────────────────────────────  │
│  │  📱 ZA │ 093***777         │  📊 ĐÁNH GIÁ AI                               │
│  │  Order: 1.2M│ FB-Ads-003  │  🌡️ Nhiệt độ: 🔴 NÓNG (3 tín hiệu)         │
│  │  Touches: 1 │ 16/03        │  📱 SĐT: ✅ Thu thập OK                       │
│  │  ⚪ LẠNH                 │  😊 Thái độ Shop: ✅ Tích cực                  │
│  │  ...                       │  ⚠️ Vấn đề: Giá đắt — khách hỏi 1 lần rồi│  │
│  │                              │      không rep trong 30 phút                │
│  │  Trang 1/7  [◀] [▶]       │  ──────────────────────────────────────────  │
│  │  (20 conv / trang)         │  ✅ HÀNH ĐỘNG                                │
│  │                              │  ┌───────────────────────────────────────┐  │
│  │                              │  │ ✅ Xác nhận đơn hàng thành công       │  │
│  │                              │  │    10:21 — Confirm + ship 2-3 ngày    │  │
│  │                              │  └───────────────────────────────────────┘  │
│  │                              │  ──────────────────────────────────────────  │
│  │                              │  📌 ORDER: ORD-2026-0001 | 650,000đ        │
│  │                              │  🔗 First: FB-Ads-003 → Last: FB-Ads-003   │
│  │                              │     Touches: 2 → mua                        │
│  └──────────────────────────────┴──────────────────────────────────────────────┘
│                                                                                  │
│  💡 Chỉ hiển thị hội thoại có SĐT đã thu thập và match được với Ad đang chọn  │
│     Để xem hội thoại chưa match, chuyển sang tab Thống kê Ads                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Chi tiết 3 tab trong panel phải:**

| Tab | Nội dung | Source |
|---|---|---|
| 💬 Tin nhắn | Chat bubbles (Khách / Shop / System), thời gian, stats bar | `mockConversationDetails` hoặc fallback generate |
| 📊 Đánh Giá | Temperature, SĐT thu thập, Thái độ Shop, Sentiment, Pain Point, Objection | `evaluation` object |
| Hành Động | Action cards theo severity (✓ Thành công / → Gợi ý / ⚠️ Cảnh báo / ✗ Lỗi) | `actions` array |

---

### 6.4 Data Enrichment Strategy

**Vấn đề:** `attributionData` có `matchedConversationId` nhưng **không có messages/evaluation**. `supabase-conversations.json` có messages nhưng **không link được với adId**.

**Giải pháp (Tiered fallback):**

```
Step 1:  Lấy matchedConversationId từ attributionData
Step 2:  Tìm conversation trong mockConversationDetails.js (key = matchedConversationId)
Step 3:  Nếu không có → generate deterministic fallback từ attributionData fields
         (dùng seed từ matchedConversationId để đảm bảo consistent)
Step 4:  Nếu có conversation → enrich với ad metrics từ attributionData
```

**Mock conversation data generation (fallback):**

```js
// adsMedicalService.js
function generateMockConversationForAd(attrRow, adId) {
  const seed = hashString(attrRow.matchedConversationId || adId);
  const temps  = ['Nóng', 'Nóng', 'Ấm', 'Lạnh']; // skew hot for matched rows
  const temp   = temps[seed % temps.length];
  const phoneOk = attrRow.matchedRate > 50;
  const msgCount = 2 + (seed % 6);  // 2-7 messages

  return {
    id: attrRow.matchedConversationId || `gen-${adId}-${seed}`,
    customerName: generateName(seed),
    platform: attrRow.platform,
    date: formatDate(attrRow.conversationDate),
    messages: generateMessages(msgCount, seed, temp),
    evaluation: {
      temperature: temp,
      temperatureColor: temp === 'Nóng' ? '#BF3003' : temp === 'Ấm' ? '#d97706' : '#059669',
      phoneStatus: phoneOk ? 'Đã thu thập' : 'Chưa thu thập',
      isJunk: attrRow.matchedRate < 40,
      sentiment: temp === 'Nóng' ? 'Tích cực' : 'Băn khoăn',
      painPoint: generatePainPoint(seed, attrRow.campaignId),
    },
    actions: generateActions(temp, seed),
  };
}
```

**Nguyên tắc thiết kế:**
- Xuất phát từ **Ads ID đang có vấn đề**, không phải từ chiến dịch
- Sort worst-first: ads có score/ROAS thấp nhất lên đầu
- Mỗi nhóm bệnh có **score riêng** cho từng Ad dựa trên metrics của nhóm đó
- 2 sub-tab: **Thống kê Ads** (summary metrics per Ad) | **Chi tiết Tin nhắn** (drill-down conversation)

---

#### Sơ đồ Data Flow

```
attributionData (50-80 rows)
  │
  ├── Per-Ad aggregation  ← adsMedicalService.computeAdMetricsPerAd()
  │     ├── group by: adId (from firstTouch.adId / lastTouch.adId)
  │     ├── metrics per adId: cost, messageCount, phoneCollected, orderCount, revenue, roas
  │     └── adScore per disease group  ← filter row by disease.id switch
  │
  ├── Conversation enrichment  ← mockConversationDetails.js hoặc fallback
  │     └── link: matchedConversationId → conversations[].messages[]
  │
  └── Disease-specific scoring
        ├── roas-health      → sort by roasGap (worst-first)
        ├── attribution-qa   → sort by unmatchedCount (worst-first)
        ├── lead-order-conv  → sort by coldToOrderRate (worst-first)
        ├── junk-campaigns   → sort by junkRate (worst-first)
        └── ... (8 nhóm đều có sort key riêng)
```

---

#### Tab Chi Tiết — Sub-Tab 1: Thống Kê Ads

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  🔴 BỆNH 1: ROAS Thực Thấp Hơn Báo Cáo                            [Thu gọn ▲] │
│  Nhóm: ROAS Health  │  Mức độ: NẶNG  │  Điểm: 2.4/10  │  ▲ Lệch -20%       │
│  ────────────────────────────────────────────────────────────────────────────────│
│                                                                                  │
│  [Tổng Quan]    [Diễn Giải]    [🔵 Chi Tiết]                                    │
│  ──────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  ┌──────────────────┐                                                           │
│  │ 📊 Thống Kê Ads │  💬 Chi tiết Tin nhắn                                    │  ← sub-tab pill
│  └──────────────────┘                                                           │
│  ──────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  📋 HIỂN THỊ: {disease.label} theo Ad  │  6 Ads  │  [Tải lại ↻]               │
│  ────────────────────────────────────────────────────────────────────────────────│
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │ ADS ID         │ CHI PHÍ  │ TIN NHẮN │ SĐT THU THẬP │ ĐƠN │ DOANH THU │ ROAS ││
│  │────────────────┼──────────┼──────────┼───────────────┼──────┼───────────┼──────││
│  │ 🔴 FB-Ads-003  │ 4.2M     │ 89       │ 12            │  31  │ 89.5M     │ 0.9x ││
│  │    Retargeting 20% Off    │ ▲ worst  │ ⚠️ 13.5%      │      │ ▼ -55%    │ ▼    ││
│  ├────────────────┼──────────┼──────────┼───────────────┼──────┼───────────┼──────││
│  │ 🔴 ZL-Ads-001  │ 5.1M     │ 45       │ 8             │  14  │ 12.6M     │ 1.2x ││
│  │    Brand Post Zalo OA     │          │ ⚠️ 17.8%      │      │ ▼ -42%    │ ▼    ││
│  ├────────────────┼──────────┼──────────┼───────────────┼──────┼───────────┼──────││
│  │ 🟡 FB-Ads-001  │ 8.2M     │ 234      │ 89            │ 164  │ 65.6M     │ 3.2x ││
│  │    Spring Sale Carousel   │ ▲ best   │ ✅ 38.2%       │      │ ▲ +8%     │ ▲    ││
│  ├────────────────┼──────────┼──────────┼───────────────┼──────┼───────────┼──────││
│  │ 🟡 FB-Ads-007  │ 3.1M     │ 67       │ 31            │  58  │ 18.9M     │ 2.9x ││
│  │    Cart Abandoned         │          │ ✅ 46.3%       │      │ ▲ +2%     │ ▲    ││
│  ├────────────────┼──────────┼──────────┼───────────────┼──────┼───────────┼──────││
│  │ ⚪ ZL-Ads-002  │ 2.8M     │ 22       │ 5             │  8   │ 4.7M      │ 1.8x ││
│  │    Flash Deal March       │          │ ✅ 22.7%       │      │ ▲ +5%     │ ▲    ││
│  ├────────────────┼──────────┼──────────┼───────────────┼──────┼───────────┼──────││
│  │ ⚪ FB-Ads-008  │ 0.8M     │ 12       │ 4             │  8   │ 3.2M      │ 2.1x ││
│  │    Summer Test            │          │ ✅ 33.3%       │      │ ▲ +3%     │ ▲    ││
│  └────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  💡 Click vào dòng để xem chi tiết tin nhắn từ Ad đó                           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Quy tắc sort (per disease group):**

| Disease Group | Sort Key | Chiều |
|---|---|---|
| ROAS Thực vs Ảo | `roasGap` (cao nhất = worst) | ↓ |
| Attribution Quality | `matchedRate` (thấp nhất = worst) | ↓ |
| Ad Creative Health | `ctr` (thấp nhất = worst) | ↓ |
| Audience Targeting | `overlapPercent` (cao nhất = worst) | ↓ |
| Budget Allocation | `dailyUtilization` (thấp nhất = worst) | ↓ |
| Platform Performance | `roas` (thấp nhất = worst) | ↓ |
| Lead → Order Conversion | `coldToOrderRate` (cao nhất = worst) | ↓ |
| Chiến Dịch Rác | `junkRate` (cao nhất = worst) | ↓ |

**Color coding row:**

| Màu | Ý nghĩa |
|---|---|
| 🔴 `#BF3003` Deep Rust | Ad có vấn đề nghiêm trọng (score ≤ 3 / ROAS < 1.5x / unmatched > 30%) |
| 🟡 `#d97706` Amber | Ad cần theo dõi (3 < score < 6 / 1.5x ≤ ROAS < 3x) |
| ⚪ `#059669` Emerald | Ad khỏe mạnh (score ≥ 6 / ROAS ≥ 3x) |

**Sub-row detail (expand khi click):**

```
│  ▶ FB-Ads-003   │  4.2M   │  89  │  12  │  31  │  89.5M  │  0.9x  │  ▼  │  ← click → expand
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │  📊 CHỈ SỐ CHI TIẾT — FB-Ads-003                                    [▲] │  │
│  │  ─────────────────────────────────────────────────────────────────────────│  │
│  │  Chiến dịch: KPI Spring Sale 2026  │  Platform: Facebook  │  Ad Set: Retarget │  │
│  │  ─────────────────────────────────────────────────────────────────────────│  │
│  │  Impressions: 124,500  │  CTR: 0.8%  │  Scroll Stop: 12%  │  Hook Retention: 45%│  │
│  │  Match Rate: 13.5% ⚠️  │  Untracked: 23 đơn  │  Virtual Cost: 4.2Mđ ⚠️      │  │
│  │  ─────────────────────────────────────────────────────────────────────────│  │
│  │  💡 "Ad này có tỉ lệ match chỉ 13.5% — 23 đơn không truy xuất được.    │  │
│  │     Nguyên nhân: thiếu Pixel trên Zalo OA. Chi phí ảo = 4.2Mđ."         │  │
│  │  ─────────────────────────────────────────────────────────────────────────│  │
│  │  [Xem chi tiết tin nhắn từ Ad này →]      [Gợi ý Smax cho Ad này →]    │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
```

---

#### Tab Chi Tiết — Sub-Tab 2: Chi tiết Tin nhắn

Xuất phát từ **Ad đang được chọn** ở sub-tab 1. Nếu chưa chọn Ad nào → hiện empty state với hướng dẫn "Chọn 1 Ad từ tab Thống kê Ads".

Layout 2 cột: **40% Danh sách Hội thoại** | **60% Chi tiết Tin nhắn**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  [Tổng Quan]    [Diễn Giải]    [Chi Tiết]                                    │
│  ───────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  [📊 Thống Kê Ads]    [🔵 Chi tiết Tin nhắn]     ← sub-tab pill active         │
│  ───────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  � targeting Ad:  [FB-Ads-003 ▼]   ← dropdown ads đang được chọn              │
│  ────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  ┌──────────────────────────────┬──────────────────────────────────────────────┐
│  │                              │                                              │
│  │  💬 HỘI THOẠI TỪ ADS      │  👤 Nguyễn Văn A  │  📱 Facebook           │
│  │  (40%)                      │  SĐT: 091***789   │  📞 Thu thập ✅        │
│  │  ────────────────────────────│  ──────────────────────────────────────────  │
│  │  Filter: [Tất cả] [Nóng]   │  [💬 Tin nhắn] [📊 Đánh Giá] [Hành Động]  │
│  │         [Ấm] [Lạnh]        │  ──────────────────────────────────────────  │
│  │                              │                                              │
│  │  🔴 Nguyễn Văn A           │  💬 TIN NHẮN                                  │
│  │  📱 FB │ 091***789         │  ──────────────────────────────────────────  │
│  │  Order: 650K │ FB-Ads-003  │  👤 Khách: Chào shop, mình muốn hỏi về      │
│  │  Touches: 2 │ 15/03        │      sản phẩm Áo phông nam size L [10:15]    │
│  │  🔴 NÓNG                  │  🏪 Shop: Dạ có ạ, Size L còn 5 cái. [10:16] │
│  │  ────────────────────────────│  👤 Khách: Có màu đen không? Đặt 2 cái.  │
│  │  🟡 Trần Thị B            │      [10:18]                                  │
│  │  📱 FB │ 090***234         │  🏪 Shop: Dạ có ạ. SĐT: 091***789 nhé.    │
│  │  Order: 320K │ FB-Ads-003  │      [10:19]                                  │
│  │  Touches: 3 │ 15/03        │  👤 Khách: Size L, chuyển khoản 650K.      │
│  │  🟡 ẤM                  │      Confirm đơn rồi nhé [10:21]               │
│  │  ────────────────────────────│  🏪 Shop: ✅ Confirm thành công! Ship 2-3d│  │
│  │  ⚪ Lê Văn C              │  ──────────────────────────────────────────  │
│  │  📱 ZA │ 093***777         │  📊 ĐÁNH GIÁ AI                               │
│  │  Order: 1.2M│ ZL-Ads-001  │  🌡️ Nhiệt độ: 🔴 NÓNG (3 tín hiệu)         │
│  │  Touches: 1 │ 16/03        │  📱 SĐT: ✅ Thu thập OK                       │
│  │  ⚪ LẠNH                 │  😊 Thái độ Shop: ✅ Tích cực                  │
│  │  ...                       │  ⚠️ Vấn đề: Giá đắt — khách hỏi 1 lần rồi│  │
│  │                              │      không rep trong 30 phút                │
│  │  Trang 1/7  [◀] [▶]        │  ──────────────────────────────────────────  │
│  │  (20 conv / trang)         │  ✅ HÀNH ĐỘNG                                │
│  │                              │  ┌───────────────────────────────────────┐  │
│  │                              │  │ ✅ Xác nhận đơn hàng thành công       │  │
│  │                              │  │    10:21 — Confirm + ship 2-3 ngày    │  │
│  │                              │  └───────────────────────────────────────┘  │
│  │                              │  ──────────────────────────────────────────  │
│  │                              │  📌 ORDER: ORD-2026-0001 | 650,000đ        │
│  │                              │  🔗 First: FB-Ads-003 → Last: FB-Ads-003   │
│  │                              │     Touches: 2 → mua                        │
│  └──────────────────────────────┴──────────────────────────────────────────────┘
│                                                                                  │
│  💡 Chỉ hiển thị hội thoại có SĐT đã thu thập và match được với Ad đang chọn  │
│     Để xem hội thoại chưa match, chuyển sang tab Thống kê Ads                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Empty state (chưa chọn Ad):**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│                         ┌─────────────────────────┐                              │
│                         │    📊 Chưa chọn Ad     │                              │
│                         │                         │                              │
│                         │  Chọn 1 Ad từ tab      │                              │
│                         │  "Thống kê Ads" để      │                              │
│                         │  xem chi tiết tin nhắn  │                              │
│                         │                         │                              │
│                         │  [← Quay lại Thống kê] │                              │
│                         └─────────────────────────┘                              │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Chi tiết 3 tab trong panel phải:**

| Tab | Nội dung | Source |
|---|---|---|
| 💬 Tin nhắn | Chat bubbles (Khách / Shop / System), thời gian, stats bar | `mockConversationDetails` hoặc fallback generate |
| 📊 Đánh Giá | Temperature, SĐT thu thập, Thái độ Shop, Sentiment, Pain Point, Objection | `evaluation` object |
| Hành Động | Action cards theo severity (✓ Thành công / → Gợi ý / ⚠️ Cảnh báo / ✗ Lỗi) | `actions` array |

---

### 6.4 Data Enrichment Strategy

**Vấn đề:** `attributionData` có `matchedConversationId` nhưng **không có messages/evaluation**. `supabase-conversations.json` có messages nhưng **không link được với adId**.

**Giải pháp (Tiered fallback):**

```
Step 1:  Lấy matchedConversationId từ attributionData
Step 2:  Tìm conversation trong mockConversationDetails.js (key = matchedConversationId)
Step 3:  Nếu không có → generate deterministic fallback từ attributionData fields
         (dùng seed từ matchedConversationId để đảm bảo consistent)
Step 4:  Nếu có conversation → enrich với ad metrics từ attributionData
```

**Mock conversation data generation (fallback):**

```js
// adsMedicalService.js
function generateMockConversationForAd(attrRow, adId) {
  const seed = hashString(attrRow.matchedConversationId || adId);
  const temps  = ['Nóng', 'Nóng', 'Ấm', 'Lạnh']; // skew hot for matched rows
  const temp   = temps[seed % temps.length];
  const phoneOk = attrRow.matchedRate > 50;
  const msgCount = 2 + (seed % 6);  // 2-7 messages

  return {
    id: attrRow.matchedConversationId || `gen-${adId}-${seed}`,
    customerName: generateName(seed),
    platform: attrRow.platform,
    date: formatDate(attrRow.conversationDate),
    messages: generateMessages(msgCount, seed, temp),
    evaluation: {
      temperature: temp,
      temperatureColor: temp === 'Nóng' ? '#BF3003' : temp === 'Ấm' ? '#d97706' : '#059669',
      phoneStatus: phoneOk ? 'Đã thu thập' : 'Chưa thu thập',
      isJunk: attrRow.matchedRate < 40,
      sentiment: temp === 'Nóng' ? 'Tích cực' : 'Băn khoăn',
      painPoint: generatePainPoint(seed, attrRow.campaignId),
    },
    actions: generateActions(temp, seed),
  };
}
```

---

## 7. 8 Nhóm Bệnh Chẩn Đoán

| # | Nhóm Bệnh | Code | Metrics | Nguồn data |
|---|-----------|------|---------|-----------|
| 1 | 📊 **ROAS Thực vs Ảo** | RA | ROAS gốc, ROAS thực, Lệch %, Untracked revenue | `attribution` |
| 2 | 💰 **Attribution Quality** | AQ | Matched rate, Unmatched orders, Freshness days | `attribution` |
| 3 | 🎨 **Ad Creative Health** | AC | CTR, hook retention, scroll stop rate | `mockCampaigns` (mock) |
| 4 | 🎯 **Audience Targeting** | AT | Overlap %, Age match %, Interest accuracy | `attribution` (mock) |
| 5 | 💸 **Budget Allocation** | BA | Daily utilization, hourly spread, campaign balance | `mockCampaigns` |
| 6 | 📱 **Platform Performance** | PP | FB vs Zalo ROAS, FB vs Zalo revenue contribution | `attribution` |
| 7 | 🔁 **Lead → Order Conversion** | LC | Lead temp → order rate, Nóng→Đơn, Lạnh→Đơn | `attribution` + `conv` |
| 8 | ⚠️ **Chiến Dịch Rác** | CR | aiAction=decrease/pause, junkRate, qualityRate | `mockAIInsights` |

### 7.1 Score Formula (0–10)

| Nhóm | Công thức |
|------|-----------|
| ROAS Thực vs Ảo | `10 - abs(roasGapPercent) * 0.05` |
| Attribution Quality | `matchedRate * 10` |
| Ad Creative Health | `(ctr * 2) + (hookRetention * 0.1) - (scrollStopRate * 0.05)` |
| Audience Targeting | `10 - (overlapPercent * 0.1)` |
| Budget Allocation | `utilizationScore` (0–10 mock) |
| Platform Performance | `(fbRoas / zaloRoas) * 5` clamp 0-10 |
| Lead → Order Conversion | `(hotToOrderRate * 5) + (warmToOrderRate * 3)` |
| Chiến Dịch Rác | `(qualityRate * 10) - (junkRate * 5)` |

### 7.2 Severity Thresholds

| Điểm | Mức độ | Màu |
|-------|--------|-----|
| 0–3 | Nặng | `#BF3003` Deep Rust |
| 3.1–6 | Trung bình | `#0052FF` Vibrant Blue |
| 6.1–10 | Nhẹ | `#059669` Emerald Green |

---

## 8. Kiến Trúc Kỹ Thuật

### 8.1 File mới

| File | Vai trò |
|------|---------|
| `src/data/mockAttributionData.js` | 50-80 attribution rows (ads→conv→order) |
| `src/lib/adsMedicalService.js` | Logic chẩn đoán 8 nhóm bệnh + attribution metrics + localStorage |
| `src/pages/AdsMedicalCheckup.jsx` | Không tạo — state quản lý trong MedicalCheckup.jsx |
| `src/components/ads/AdsHealthScoreHeader.jsx` | Điểm sức khỏe tổng quan + Funnel mini-bar |
| `src/components/ads/AttributionFunnel.jsx` | Funnel chart (Impressions → Clicks → Conv → Order) |
| `src/components/ads/AdsRoasBreakdown.jsx` | ROAS thực vs gốc per campaign |
| `src/components/ads/AdsDiseaseCard.jsx` | Card bệnh Ads (thu gọn + mở rộng, 3 tabs con) |
| `src/components/ads/AdsDiseaseItemLayout.jsx` | Per-item layout 2/3 + 1/3 |
| `src/components/ads/AdsCriticalAlertsPanel.jsx` | Panel cảnh báo khẩn |
| `src/components/ads/AdsSmaxRecommendationsPanel.jsx` | Smax AI gợi ý (reuse `smaxAIService.js`) |
| `src/components/ads/AdsFilterTabs.jsx` | Filter tabs (Tất cả / ROAS / Ngân sách / Target / Conv / Platform / Creative / Rác) |
| `src/components/ads/AdsWizardSteps.jsx` | Step indicator (4 bước) |
| `src/components/ads/AdsConnectStep.jsx` | Step 1: Mock connect UI |
| `src/components/ads/AdsCampaignSelectStep.jsx` | Step 2: Campaign checkbox selector |
| `src/components/ads/AdsDateRangeStep.jsx` | Step 3: Date range (7d/30d/90d) |
| `src/components/ads/AdsCrawlProgressStep.jsx` | Step 4: Progress bar + disease group status |
| `src/components/ads/AdsMedicalDashboard.jsx` | Dashboard wrapper (single view: Bệnh Ads) |
| `src/components/ads/AdsConversationDetailPanel.jsx` | 2-cột: Danh sách conv + Chi tiết (Tin nhắn / Đánh Giá / Hành Động) |
| `src/components/ads/AdsOrderTable.jsx` | Bảng orders với Matched/Untracked filter |

### 8.2 File sửa đổi

| File | Thay đổi |
|------|----------|
| `src/pages/MedicalCheckup.jsx` | Thêm state `adsTab`, `adsStep`, `adsConfig`; Tab Ads nếu locked → hiện locked card; nếu unlocked → render AdsMedicalDashboard |
| `src/components/medical/HealthScoreHeader.jsx` | Thêm `showAdsTab` prop hoặc tách phần tab vào MedicalCheckup.jsx |
| `src/components/layout/Sidebar.jsx` | Nav item "Khám Bệnh" → thêm badge "Ads" bên cạnh "Hội Thoại" |
| `src/App.jsx` | Không cần thay đổi |

### 8.3 localStorage Keys

```js
// Ads medical records (parallel với Hội Thoại)
const ADS_RECORDS_KEY = 'smax_ads_medical_records';
saveAdsMedicalRecord({ id, date, campaigns, healthScore, diseases: [] })
getAdsMedicalHistory()  // → [{ id, date, healthScore, ... }]

// Ads saved actions (riêng)
const ADS_ACTIONS_KEY = 'smax_ads_saved_actions';

// Ads Smax cache
`smax-ads-rec-${diseaseId}` // 24h TTL
```

### 8.4 Reuse từ Track A

| Component | Reuse trong Ads Medical | Cách adapt |
|-----------|----------------------|-----------|
| `SmaxRecommendationsPanel.jsx` | `AdsSmaxRecommendationsPanel.jsx` | Copy, thay data source |
| `DiseaseItemLayout.jsx` | `AdsDiseaseItemLayout.jsx` | Copy, adapt disease → ads disease |
| `CriticalAlertsPanel.jsx` | `AdsCriticalAlertsPanel.jsx` | Copy, thay alert pools |
| `ConversationDetailPanel.jsx` | `AdsConversationDetailPanel.jsx` | Copy, thêm Attribution chain |
| `smaxAIService.js` | `adsMedicalService.js` | Gọi lại, khác prompt |

---

## 9. Design Specifications

### 9.1 Design System Compliance (DESIGN.md)

| Element | Rule | Áp dụng |
|---------|------|---------|
| Primary | `#1A2138` Deep Navy | Header, Sidebar, authority surfaces |
| Secondary | `#BF3003` Deep Rust | Primary CTA, "bệnh nặng" badges |
| Tertiary | `#0052FF` Vibrant Blue | Active states, progress, links |
| Surface | `#fcf8fb` warm off-white | Page background |
| No-Line Rule | Tonal shifts thay 1px borders | Card separation |
| Radius | 8px DEFAULT | Tất cả cards, buttons, inputs |
| Elevation | Ambient shadows (tinted) | Floating elements |
| Font Display | Manrope Bold | Headers, Disease names, scores |
| Font Body | Inter Regular | Metrics, descriptions |
| Font Label | Inter SemiBold, All-Caps, +5% letter-spacing | Badges, tabs, tags |

### 9.2 Funnel Colors

| Stage | Màu |
|-------|-----|
| Impressions | `#1A2138` Deep Navy |
| Clicks | `#0052FF` Vibrant Blue |
| Hội thoại | `#7C3AED` Purple |
| Đơn hàng | `#059669` Green |

---

## 10. Decision Log

| # | Quyết định | Thay thế | Lý do |
|---|-----------|---------|--------|
| 1 | Mock attribution table (50-80 rows) | Ghép campaign↔conversation gián tiếp | Đủ phức tạp cho mockup, không cần API thật |
| 2 | Lưu đầy đủ first/last/touches[] | Chỉ 1 model | Dashboard filter được theo attribution model |
| 3 | Ads là tab trong MedicalCheckup | Route riêng `/insight/ads-checkup` | Giữ liên kết Hội Thoại ↔ Ads, unlock flow tự nhiên |
| 4 | Auto-unlock (hasMedicalHistory > 0) | Manual unlock button | KH đã khám → đã có context |
| 5 | 3 lựa chọn date range (7d/30d/90d) | 1 date range cố định | Linh hoạt, giống pattern Track A |
| 6 | Dùng lại smaxAIService.js | Tạo service mới | Tiết kiệm thời gian, cùng Smax engine |
| 7 | Dùng chung DiseaseCard pattern từ Track A | Viết mới hoàn toàn | Nhanh, nhất quán |
| 8 | 3 tab con trong Disease Card (Tổng Quan / Diễn Giải / Chi Tiết) | Không có tab | Giống pattern Khám Bệnh Hội Thoại |
| 9 | Sub-tab Chi Tiết gồm Đơn hàng + Hội thoại phát sinh | Chỉ 1 danh sách | Capture được hành trình đầy đủ |
| 10 | Hội thoại phát sinh hiển thị 2 cột | 1 cột | Giống ConversationDetailPanel đã có |

---

## 11. Open Questions ✅ (Đã giải quyết)

- ✅ Attribution model? → **Lưu đầy đủ** (first/last/touches[])
- ✅ Khoảng thời gian? → **3 lựa chọn**: 7d / 30d / 90d
- ✅ Dashboard hay 2 tab? → **Dashboard Unificado + 2 Tab**: Funnel | Bệnh Ads
- ✅ Unlock? → **Auto-unlock** khi `medical_history.length > 0`
- ✅ Nguồn data? → **Mock attribution table mới**
- ✅ Disease Card có 3 tab? → **Có**: Tổng Quan / Diễn Giải / Chi Tiết ✅ IMPLEMENTED 2026-03-29
- ✅ Chi tiết sub-tabs? → **Thống Kê Ads + Đơn hàng từ Ads + Chi tiết Tin nhắn** (3 sub-tabs) ✅ IMPLEMENTED 2026-03-29