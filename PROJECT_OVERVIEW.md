# AI Insight — Project Overview

> **Người đọc:** Dev mới tiếp nhận dự án
> **Mục đích:** Hiểu toàn cảnh — kiến trúc, business logic, data flow, design system — để tiếp tục phát triển mà không cần đọc hàng trăm dòng session log
> **Ngôn ngữ:** Tiếng Việt cho business context, tiếng Anh cho code/technical terms

---

## Mục lục

1. [Tổng quan sản phẩm](#1-tổng-quan-sản-phẩm)
2. [Kiến trúc ứng dụng](#2-kiến-trúc-ứng-dụng)
3. [Design System](#3-design-system)
4. [Routes & Pages](#4-routes--pages)
5. [Data Layer](#5-data-layer)
6. [Track A — Cài đặt Insight](#6-track-a--cài-đặt-insight)
7. [Track B — Dashboard Ads](#7-track-b--dashboard-ads)
8. [Tính năng Khám Bệnh Hội Thoại](#8-tính-năng-khám-bệnh-hội-thoại)
9. [AI Integration](#9-ai-integration)
10. [Scripts & Infrastructure](#10-scripts--infrastructure)
11. [Quy tắc triển khai](#11-quy-tắc-triển-khai)
12. [Còn cần làm](#12-còn-cần-làm)

---

## 1. Tổng quan sản phẩm

### 1.1 Mô tả

**AI Insight** là module phân tích hội thoại đa kênh (Facebook Messenger, Zalo OA) sử dụng AI để:

- Đánh giá **chất lượng Lead** (khách hàng tiềm năng) từ nội dung chat
- Cấu hình **Insight templates** (template cấu hình AI phân tích) theo từng ngành
- Đề xuất **tối ưu chiến dịch quảng cáo** dựa trên chất lượng hội thoại thực tế

### 1.2 Hai Track chính

| | Track A — Cài Đặt Insight | Track B — Dashboard Ads |
|---|---|---|
| **Route** | `/insight/settings` | `/insight/dashboard`, `/insight/ads-optimization` |
| **User** | Người cấu hình template AI | CEO / CMO / Marketer |
| **Goal** | Setup AI analysis config | Scan chiến dịch trong 3 giây |

### 1.3 Bối cảnh thiết kế (North Star)

> **"The Digital Curator"** — Premium, quiet gallery. Không clutter, không 1px borders, không generic SaaS patterns.

---

## 2. Kiến trúc ứng dụng

### 2.1 Tech Stack

```
Framework:    React 19 (SPA)
Bundler:      Vite 6
Styling:      Tailwind CSS v4 + CSS variables
Charts:       Recharts v2
Icons:        Lucide React
Animation:    Framer Motion
Router:       React Router v7
Deployment:   Vercel
```

### 2.2 Project Structure

```
src/
├── App.jsx                  # React Router v7 — flat routes
├── index.css               # Design tokens, typography, surface system
├── main.jsx
├── lib/
│   ├── utils.js            # formatCurrency, formatRoas, formatCompact, ...
│   ├── supabaseLanding.js  # Landing page → Supabase (REST API, service role key)
│   ├── medicalService.js   # Khám Bệnh logic (diagnosis, score, Smax recs)
│   ├── smaxAIService.js    # Streaming AI wrapper (Smax API + localStorage cache)
│   └── mockDataService.js  # Runtime generator cho insight mới tạo
├── data/
│   ├── mockTemplates.js        # 42 templates (7 ngành × 6 insights)
│   ├── mockConversations.js    # Chat mẫu (legacy, ít dùng)
│   ├── supabase-conversations.json  # 3,462 conversations thật từ Supabase
│   ├── mockCampaigns.js        # 8 campaigns + 56 daily breakdown points
│   ├── mockAIInsights.js       # AI recommendations per campaign
│   ├── mockConversationDetails.js  # Chi tiết hội thoại (messages, eval, actions)
│   └── *.json / *.js          # Landing, testimonials, ...
├── pages/
│   ├── LandingPage.jsx          # Landing page (route: /)
│   ├── MedicalCheckupLanding.jsx # Landing Khám Bệnh (route: /kham-benh)
│   ├── InsightSettings.jsx      # Track A: Cài đặt Insight
│   ├── AdsDashboard.jsx         # Track B: Tổng quan Ads
│   ├── AdsOptimization.jsx       # Track B: Gợi ý tối ưu Ads
│   ├── InsightDashboard.jsx     # (hiện tại ít dùng)
│   └── MedicalCheckup.jsx       # Track A: Khám Bệnh 5-step wizard
└── components/
    ├── layout/                  # Sidebar, Header, PageContainer, TopNavBar
    ├── ui/                      # Button, Badge, Card, Modal, Input, Toast, Tabs, RadarEffect
    ├── landing/                 # Hero, Problem, Solution, HowItWorks, Testimonials, TemplateGallery, LeadCapture, Footer, TrustSection, TopNavBar
    ├── medical/                # 18 components cho Khám Bệnh
    └── insight/                 # 20+ components cho Insight Settings + Dashboard Ads
```

### 2.3 API Proxy

```
api/
└── smax-chat.js   # Vercel serverless — proxy /api/smax-chat → smaxai.cdp.vn/api/chat
```

### 2.4 Vercel Config

```json
// vercel.json — SPA rewrite (fix 404 on F5)
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## 3. Design System

> **Nguồn truth:** `DESIGN.md` — Mọi thay đổi UI/palette/components phải tham chiếu file này.

### 3.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#1A2138` | Sidebar, authority surfaces (Deep Navy) |
| `secondary` | `#BF3003` | Primary CTA, bệnh nặng, urgency (Deep Rust) |
| `tertiary` | `#0052FF` | Active states, links, digital pulse (Vibrant Blue) |
| `surface` | `#fcf8fb` | Page background (warm off-white) |

### 3.2 Surface Tiers (6 levels)

```
surface_bright         → Active overlays
surface_container_highest → Hover states
surface_container_high   → Input tracks
surface_container        → Section backgrounds
surface_container_low    → Card separation
surface_container_lowest → Component cards (default lift)
surface                 → Page background
surface_dim             → Contrast contrast backgrounds
```

### 3.3 Typography

| Class | Font | Weight | Size | Use |
|-------|------|--------|------|-----|
| `display-*` | Manrope | Bold | 3.5rem → 1.875rem | Hero numbers, scores |
| `headline-*` | Manrope | Bold/SemiBold | 1.5rem → 1.125rem | Section headers |
| `title-*` | Manrope | SemiBold | 1rem → 0.875rem | Card titles |
| `body-*` | Inter | Regular | 0.875rem → 0.75rem | Data, descriptions |
| `label-*` | Inter | SemiBold | 0.6875rem | Badges, tabs, tags (ALL CAPS, +5% letter-spacing) |

### 3.4 Key Rules

- **No-Line Rule:** Không dùng `1px solid` borders. Dùng tonal shifts (surface tier differences).
- **Radius:** 8px DEFAULT cho mọi cards, buttons, inputs.
- **Elevation:** Ambient shadows — blur 32-48px, opacity 4-8%, tinted (không dùng pure black).
- **Glass:** 80% opacity + `backdrop-blur: 12px` cho floating elements (modals, popovers).
- **Ghost Border fallback:** Chỉ khi accessibility yêu cầu — `outline_variant` at 15% opacity.

### 3.5 ROAS Color System

| ROAS | Màu | Ý nghĩa |
|------|-----|---------|
| ≥ 3× | `#059669` | Tốt — scale được |
| ≥ 1.5× | `#d97706` | Cải thiện — theo dõi |
| < 1.5× | `#dc2626` | Thấp — cần xem xét |

### 3.6 Component Props (UI Kit)

```
Button:     variant (primary/tertiary/ghost/ghost-outline)
            size (sm/md/lg)
Card:       elevated, ghostBorder, surface level
Badge:      primary/secondary/tertiary/info, fixed
Input:      surface_container_high track, tertiary focus border
Modal:      glass (80% + blur 12px), ghostBorder, 2xl maxWidth
Tabs:       elevated active tab (surface_container_lowest + shadow)
```

---

## 4. Routes & Pages

### 4.1 Route Architecture

```jsx
// App.jsx — React Router v7 flat routes

/                  → LandingPage (standalone, no sidebar)
/kham-benh         → MedicalCheckupLanding (standalone, no sidebar)
/insight/settings       → AppLayout + InsightSettings
/insight/dashboard     → AppLayout + AdsDashboard
/insight/ads-optimization → AppLayout + AdsOptimization
/insight/insight-dashboard → AppLayout + InsightDashboard
/insight/medical-checkup   → AppLayout + MedicalCheckup
```

### 4.2 App Layout

```
┌─────────────────────────────────────────┐
│  TopNavBar (sticky, full-width)         │  z-50
├────────┬────────────────────────────────┤
│        │                                │
│Sidebar │  main content (scrollable)     │
│ 240px  │  flex-1 min-w-0               │
│        │                                │
└────────┴────────────────────────────────┘
```

### 4.3 Sidebar Navigation

```
AI Insight
├── Dashboard (Sparkles icon)
├── Tổng quan Ads (BarChart3)
├── Gợi ý tối ưu Ads (TrendingUp + "AI" badge)
├── Cài đặt Insight (Settings icon)
├── Khám Bệnh (Stethoscope icon)
└── [separator]
    Tài khoản & Hỗ trợ (HelpCircle icon)
```

---

## 5. Data Layer

### 5.1 Supabase Conversations

```javascript
// src/data/supabase-conversations.json
// 3,462 records × 42 templates
// Mỗi record = 1 hội thoại với fields động theo template

{
  "templateId": "fsh-1",      // Fashion — Phân tích Nhu cầu KH
  "rows": [
    {
      "id": "fsh-1-001",
      "customer": "Nguyễn Thị Lan",
      "platform": "facebook",
      "temperature": "Nóng",
      "phone_status": "Đã thu thập",
      "is_junk": false,
      "sentiment": "positive",
      "pain_point": "Giá cao",
      "last_message": "...",
      "last_message_at": "2026-03-25T14:30:00Z",
      "is_returning_customer": false,
      // + dynamic fields tùy template
    }
  ]
}
```

### 5.2 Mock Campaigns (Track B)

```javascript
// src/data/mockCampaigns.js

// 8 campaigns
const mockCampaigns = [
  { id: 'camp-1', name: 'Retargeting - Đã thêm giỏ hàng', platform: 'facebook', status: 'active',
    budget: 5000000, spend: 4230000, revenue: 12800000, ordersCount: 42,
    qualityScore: 72, conversionRate: 3.8, aiAction: 'increase', ... },
  // ...
];

// 56 daily breakdown points (8 campaigns × 7 days: 15/03 → 21/03)
const mockDailyBreakdown = {
  'camp-1': [
    { date: '15/03', revenue: 1800000, spend: 600000, ordersCount: 6, roas: 3.0 },
    // 7 ngày
  ],
  // ...
};
```

### 5.3 Mock Templates (Track A)

```javascript
// 42 templates = 7 ngành × 6 insights
const mockTemplates = [
  {
    id: 'fsh-1',
    industry: 'fashion',
    industryLabel: 'Thời trang',
    category: 'nhu-cau-khach-hang',
    name: 'Phân tích nhu cầu khách hàng — Thời trang',
    columns: [
      { name: 'Sản phẩm quan tâm', dataType: 'short_text', field: 'product' },
      { name: 'Pain Point', dataType: 'short_text', field: 'painPoint' },
      { name: 'Mức độ quan tâm', dataType: 'single_choice', field: 'temperature',
        options: ['Nóng', 'Ấm', 'Lạnh'] },
    ],
  },
  // 41 templates còn lại
];
```

---

## 6. Track A — Cài Đặt Insight

### 6.1 Business Logic

**7 ngành × 6 insight = 42 templates**

| Ngành | Key Insight đặc thù |
|-------|---------------------|
| Thời trang | Size, mùa, hàng real/fake |
| Mẹ và Bé | An toàn sản phẩm, tuổi bé |
| Mỹ phẩm | Da dầu/khô/nhạy cảm, K-beauty |
| Spa/Thẩm mỹ | Liệu trình, bác sĩ, đặt lịch |
| Bất động sản | Pháp lý, sổ đỏ/sổ hồng, cò mồi |
| F&B | Đặt bàn, giao hàng, app delivery |
| Du lịch | OTA, visa, đặt cọc |

### 6.2 6 Insight Pattern Chung

| # | Tên | Columns chính |
|---|-----|---------------|
| 1 | Phân Tích Nhu Cầu KH | Sản phẩm, Pain Point, Lead Temperature |
| 2 | Đánh Giá Chất Lượng Lead (Ads) | Junk Lead, SĐT thu thập, Objection, Ads Source |
| 3 | Đánh Giá Nhân Viên Tư Vấn | Thái độ, Lỗi mất khách |
| 4 | Phân Tích Chân Dung KH | Giới tính, Location, Budget, Customer Segment |
| 5 | Phân Tích Đối Thủ Cạnh Tranh | Competitor mentioned, Tên, Tiêu chí so sánh |
| 6 | Phân Tích Hậu Mua / CSKH | Post-purchase intent, Urgency, Review risk |

### 6.3 Key Fields (Business Rules)

**Lead Temperature:**
- **Nóng:** ≥ 2 tín hiệu chốt (hỏi giá + hỏi còn + để lại SĐT)
- **Ấm:** Đang tư vấn, hỏi thêm nhưng chưa chốt
- **Lạnh:** 1 câu + seen không rep, HOẶC từ chối trực tiếp

**Junk Lead:**
- **True** khi: tin tự động từ ads rồi không rep, chat không liên quan, bấm nhầm
- **False:** ngược lại

**Objection** (khác nhau theo ngành):
- Thời trang: Giá đắt, Phí ship, Không có size, Hàng fake
- Mẹ và Bé: Lo ngại an toàn, Hỏi chồng
- Mỹ phẩm: Lo ngại hàng fake, Hỏi về thành phần
- BDS: Pháp lý chưa rõ, Ngân sách không xác nhận
- F&B: Quá xa, Không có chi nhánh gần
- Du lịch: So sánh với OTA (Traveloka/Agoda)

### 6.4 Data Type Definitions

| Type | Mô tả |
|------|--------|
| `true / false` | Boolean — Junk Lead, Bức xúc |
| `short_text` | < 12 ký tự — Sản phẩm, Pain Point |
| `single_choice` | 1 lựa chọn dropdown — Temperature, Giới tính |
| `multi_tag / dropdown` | 1 hoặc nhiều tag — Objection, Tiêu chí so sánh |

### 6.5 Luồng Thêm Ngành Mới

1. Copy pattern từ ngành gần nhất trong `template-insight.md`
2. Tạo 6 insight theo đúng 6 pattern chung
3. Điều chỉnh **Objection** và **Priority** theo đặc thù ngành
4. Thêm vào `mockTemplates.js`
5. Cập nhật `template-insight.md`

---

## 7. Track B — Dashboard Ads

### 7.1 Hai trang

```
/insight/dashboard — Tổng quan Ads
├── Junk alert banner        (aiAction = 'decrease' | 'pause')
├── OverviewCards (4 KPI)    Tổng hội thoại / Từ Ads / CvR / Chi tiêu
├── RevenueCards             Doanh thu Portfolio + ROAS trung bình
├── PlatformROASCard
├── CostPerQualityLeadCard
├── ContributionChart       Horizontal bar: doanh thu vs chi tiêu theo chiến dịch
├── RevenueSpendTrendChart  7-day FB vs Zalo area
├── SourceChart             Donut FB vs Zalo
└── CampaignSummaryTable    8 cột — click row → AIInsightPanel + DailyDetailChart

/insight/ads-optimization — Gợi ý tối ưu Ads
├── Junk alert banner
├── ExecutiveSummaryCard    Budget recommendation, 3 cột Urgent/Watch/Highlight
└── CampaignOptimizationTable  4 cột — expandable row
    Sort: Tăng → Giữ → Giảm → Tắt
```

### 7.2 Campaign Model

```javascript
{
  id, name, platform,           // 'facebook' | 'zalo'
  status,                       // 'active' | 'paused'
  adId, budget, spend,
  impressions, clicks,
  conversations, leads,
  qualityScore, conversionRate,
  revenue,                       // VND — doanh thu quy cho chiến dịch
  ordersCount,
  aiAction,                     // 'increase' | 'decrease' | 'keep' | 'pause'
  lastUpdated
}
```

### 7.3 AI Action → Junk Alert Banner

- `aiAction = 'decrease'` HOẶC `'pause'` → campaign được tính trong banner cảnh báo

---

## 8. Tính năng Khám Bệnh Hội Thoại

> **PRD:** `PRD-audit.md`

### 8.1 Luồng 5 bước

```
Step 1: Kết nối Fanpage    [Mockup — 2s loading → auto-advance]
Step 2: Khai báo ngành     [Dropdown 7 ngành + mô tả nhóm KH]
Step 3: Chọn số lượng       [1K / 5K / 10K hội thoại]
Step 4: Crawl Progress     [Progress bar + 9 disease groups status]
Step 5: Kết quả            [Real-time dashboard — 9 nhóm bệnh]
```

### 8.2 9 Nhóm Bệnh (Health Score 0-10)

| Code | Nhóm | Key Metrics |
|------|------|-------------|
| LQ | Chất Lượng Nguồn Lead | Junk Lead %, SĐT thu thập, Chốt đơn |
| RS | Phản Hồi & Chăm Sóc | TB phản hồi, Remind KH, Ưu đãi cá nhân |
| NV | Nhân Viên Tư Vấn | Thái độ tốt, Lỗi mất khách, Tư vấn đúng |
| ĐT | Đối Thủ Cạnh Tranh | Nhắc đến đối thủ, So sánh giá |
| KH | CSKH & Hậu Mua | CSKH sau mua, Risk review, Urgency |
| KB | Kịch Bản Tư Vấn | Objection handling, Script follow-up |
| BD | Cuộc Trò Chuyện Bỏ Dở | Abandoned chat %, no closure |
| NN | Ngôn Ngữ & Cách Giao Tiếp | Tone, emoji usage, voice message |
| US | Upsell / Cross-sell | Gợi ý sản phẩm bổ sung, upsell rate |

### 8.3 Disease Card Tabs

Mỗi nhóm bệnh có 3 tabs:
- **Tổng quan:** KPI metrics + trend chart 7 ngày + Health Score Header
- **Chi tiết:** 2 cột — Danh sách hội thoại (40%) | Chi tiết 3 tab (60%)
  - Tin nhắn: Chat bubbles customer/shop + stats bar
  - Đánh Giá: AI evaluation (temperature, phone, junk, attitude, sentiment...)
  - Hành Động: Severity cards (✓ Thành công / → Gợi ý / ⚠ Cảnh báo / ✗ Lỗi)
- **Diễn giải:** Text prose tiếng Việt — diagnosis + key concern + bottom line + summary chips

### 8.4 Health Score Header (Option E — 3 Column Layout)

```
Cột 1 (25%): Score tổng + progress bar + delta so với lần khám trước
Cột 2 (50%): Cần cải thiện (score < 5) thanh đỏ + Trung bình chip thu gọn
Cột 3 (22%): Tốt (score ≥ 7.5) thanh xanh
```

Emergency banner khi score < 3. Delta chỉ hiện khi ≥ 2 lần khám trong history.

### 8.5 Smax AI Gợi Ý (Real API)

```
API: POST https://smaxai.cdp.vn/api/chat
Key: 3a914320759947da9124f10b1b7d53df
Proxy: /api/smax-chat (Vercel serverless)
Cache: localStorage key smax-rec-{industry}-{diseaseId}, TTL 24h

Prompt contract (JSON):
{
  "actions": [
    {
      "title": "Tiêu đề hành động",
      "smax_feature": "Tên tính năng Smax",
      "impact": "Tác động mong đợi",
      "steps": ["Bước 1", "Bước 2", "Bước 3"]
    }
  ]
}
```

UI: Checklist thuần — click action để expand steps, có lưu (bookmark) và nút "Làm mới" xóa cache.

---

## 9. AI Integration

### 9.1 Smax AI Service

```javascript
// src/lib/smaxAIService.js
// Endpoint: /api/smax-chat (dev: Vite proxy, prod: Vercel rewrite)
// Streaming: response.body.getReader() + TextDecoder
// Strip: [THINKING] blocks, markdown artifacts
// Cache: localStorage 24h
```

### 9.2 Custom AI (token.ai.vn)

```javascript
// src/lib/aiService.js
// Endpoint: token.ai.vn, model: gpt-4.1-mini
// Luồng: Khai báo doanh nghiệp → AI gen 6 insights → Preview & edit → Save
```

### 9.3 LocalStorage Keys

| Key | Content | TTL |
|-----|---------|-----|
| `smax-rec-{industry}-{diseaseId}` | Smax AI recommendations | 24h |
| `medical-history` | Array of medical records | Persistent |
| `saved-actions-{industry}` | Array of saved action IDs | Persistent |
| `insight-config-{id}` | Editable column configs | Persistent |

---

## 10. Scripts & Infrastructure

### 10.1 Supabase Scripts

| Script | Purpose |
|--------|---------|
| `scripts/seed-conversations.js` | Seed 3,462 conversations vào Supabase DB |
| `scripts/export-conversations.js` | Export Supabase → `supabase-conversations.json` |
| `scripts/supabase-mockup.js` | Tạo bảng `ai_insight_mockup` + insert 50 records |
| `scripts/create-landing-table.js` | Tạo bảng `landing_leads` (REST API) |
| `scripts/create-landing-table-mcp.js` | Tạo bảng `landing_leads` qua MCP endpoint |
| `scripts/debug-parse.js` | Debug export parsing issues |
| `scripts/fix-missing-records.js` | Fix missing records after export |

### 10.2 Vercel API

```
api/
└── smax-chat.js   # POST proxy — smaxai.cdp.vn/api/chat
```

### 10.3 Supabase Schema

**Bảng `landing_leads`**
```
id (UUID PK)
name (TEXT NOT NULL)
email (TEXT NOT NULL)
experience_rating (INTEGER 1-5)
consent_privacy (BOOLEAN)
created_at (TIMESTAMPTZ)
RLS: insert = anon (service role key bypass), select = authenticated
```

---

## 11. Quy tắc triển khai

### 11.1 Không nhảy track

- Mỗi session chỉ làm **1 track** (A hoặc B)
- Muốn chuyển → kết thúc session, báo cáo kết quả, cập nhật Session Log trong CLAUDE.md

### 11.2 Design System compliance

- **Mọi thay đổi UI/palette/components** phải tham chiếu `DESIGN.md`
- **Mọi thay đổi prompt/column** phải cập nhật `template-insight.md`

### 11.3 Deploy checklist (Vercel)

1. Build: `npm run build`
2. Deploy: `npx vercel --prod`
3. Check alias:
   ```bash
   npx vercel alias ls | grep "ai-insight-mockup.vercel.app"
   ```
4. Alias phải trỏ đúng deployment mới nhất
5. Verify route:
   ```
   https://ai-insight-mockup.vercel.app/insight/medical-checkup
   ```
6. Nếu 404 → kiểm tra `vercel.json` ở **root project** (không đặt trong `src/`)
7. Chỉ xác nhận "deploy xong" khi cả 2 điều kiện thỏa

### 11.4 Anti-hallucination rule

- **Chỉ trích xuất thông tin có trong dữ liệu**
- Không có → giá trị mặc định: "Không xác định" / "Không đề cập"

### 11.5 Tiếng Việt

- Tất cả prompt, output, field name đều là **tiếng Việt**
- Không dịch

---

## 12. Còn cần làm

### 12.1 PDF Export

- **Priority:** Cao
- **Scope:** Export đầy đủ (metrics + Smax actions + ví dụ hội thoại) từ Khám Bệnh dashboard
- **Approach:** `window.print()` hoặc `html2pdf.js`
- **Button đã có** trong UI, chưa implement logic

### 12.2 End-to-End Testing

- Track A: Test Custom AI thực tế (token.ai.vn)
- Khám Bệnh: Smoke test với Playwright trước mỗi deploy

### 12.3 Supabase Production Schema

- Bảng `ai_insight_mockup` + `ai_insight_conversations` đã tạo
- Cần kết nối production Supabase thay vì mock JSON

---

## Quick Reference

### Routes
| URL | Page | Track |
|-----|------|-------|
| `/` | LandingPage | — |
| `/kham-benh` | MedicalCheckupLanding | A |
| `/insight/settings` | InsightSettings | A |
| `/insight/medical-checkup` | MedicalCheckup (5-step wizard) | A |
| `/insight/dashboard` | AdsDashboard | B |
| `/insight/ads-optimization` | AdsOptimization | B |

### Deploy URLs
| Environment | URL |
|-------------|-----|
| Production | https://ai-insight-mockup.vercel.app |
| Audit (medical) | https://audit.cdp.vn/insight/medical-checkup |

### Key Files
| File | Role |
|------|------|
| `CLAUDE.md` | Session log + 2 tracks overview |
| `PRD.md` | Product Requirements Document gốc |
| `PRD-audit.md` | PRD Khám Bệnh (approved + implementation) |
| `DESIGN.md` | Design System (truth) |
| `template-insight.md` | Prompt templates cho 42 insights (truth) |
| `src/lib/medicalService.js` | 9 nhóm bệnh logic + Smax recommendations |
| `src/lib/smaxAIService.js` | Streaming AI wrapper + 24h cache |
| `src/data/supabase-conversations.json` | 3,462 conversations (data source) |
