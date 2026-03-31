# CLAUDE.md — Dự Án AI Insight

> **Hướng dẫn:** Khi bắt đầu session mới, hỏi người dùng muốn làm track nào. Không nhảy qua lại giữa 2 track trong cùng một session. Sau khi xong, báo cáo kết quả và cập nhật phần **Session Log** bên dưới.

---

## Design System — Editorial Precision

**Nguồn truth:** `DESIGN.md` — Mọi thay đổi UI/palette/components phải tham chiếu DESIGN.md.

| Chiều | Mô tả |
|-------|-------|
| North Star | "The Digital Curator" — Premium, quiet gallery |
| Primary | `#1A2138` Deep Navy — Authority + Professional |
| Secondary | `#BF3003` Deep Rust — Human Element (laser pointer, not paint brush) |
| Tertiary | `#0052FF` Vibrant Blue — Digital Pulse |
| Surface | `#fcf8fb` warm off-white |
| No-Line Rule | Không dùng 1px solid borders; dùng tonal shifts |
| Radius | 8px DEFAULT (Curated Identity) |
| Elevation | Ambient shadows (tinted, not black) |
| Glass | 80% opacity + backdrop-blur 12px |
| Font Display | Manrope Bold |
| Font Body | Inter Regular |
| Font Label | Inter SemiBold, All-Caps, +5% letter-spacing |

---

## 🎯 BA TRACK ĐỘC LẬP

### Track A — Cài Đặt Insight (Insight Settings)
### Track B — Dashboard Ads (Ads Dashboard)
### Track C — Marketing Team (Team điều phối Agent Marketing)

---

# ═══════════════════════════════════════
# TRACK A — CÀI ĐẶT INSIGHT
# ═══════════════════════════════════════

## A1. Mục Tiêu & Tổng Quan

**Mục tiêu:** AI Engine phân tích hội thoại đa kênh → trả về structured data fields theo prompt được cấu hình sẵn theo từng ngành.

**Cấu trúc:** 7 ngành × 6 insight = 42 template. Mỗi insight gồm 2–5 cột (field/prompt) có kiểu dữ liệu cố định.

**Output của AI:** Một đoạn chat → nhiều dòng structured data (mỗi dòng = 1 conversation × 1 insight × N columns)

---

## A2. Các Ngành & Key Insight Đặc Thù

| # | Ngành | Key Insight | Đặc thù nổi bật |
|---|-------|------------|-----------------|
| 1 | Thời trang (Fashion) | Lead Temperature, Competitor, Retargeting | Size, mùa, hàng real/fake |
| 2 | Mẹ và Bé (Mother & Baby) | Safety Concern, Baby Age, Bulk Interest | An toàn sản phẩm, tuổi bé |
| 3 | Mỹ phẩm / Làm đẹp (Cosmetics) | Skin Type, Ingredient Concern, Real/Fake | Da dầu/khô/nhạy cảm, K-beauty |
| 4 | Spa / Thẩm mỹ (Beauty Salon) | Treatment Type, Booking Intent, Before-After | Liệu trình, bác sĩ, đặt lịch |
| 5 | Bất động sản (Real Estate) | Legal Status, Budget, Site Visit | Pháp lý, sổ đỏ/sổ hồng, cò mồi |
| 6 | F&B — Nhà hàng / Ăn uống | Booking/Delivery Intent, Food Review | Đặt bàn, giao hàng, app delivery |
| 7 | Tư vấn Du lịch (Travel) | Destination, OTA Competitor, Deposit Intent | OTA, visa, đặt cọc |

---

## A3. 6 Insight Pattern Chung (Áp Dụng Mọi Ngành)

Mỗi ngành đều có đúng 6 insight theo pattern nhất quán:

| # | Tên Insight | Các Cột (Columns) |
|---|------------|-------------------|
| 1 | Phân Tích Nhu Cầu Khách Hàng | Sản phẩm, Pain Point, Lead Temperature |
| 2 | Đánh Giá Chất Lượng Nguồn Lead (Ads) | Junk Lead, SĐT thu thập, Objection, Ads Source |
| 3 | Đánh Giá Nhân Viên Tư Vấn | Thái độ tư vấn, Lỗi mất khách |
| 4 | Phân Tích Chân Dung Khách Hàng | Giới tính, Location, Budget, Customer Segment |
| 5 | Phân Tích Đối Thủ Cạnh Tranh | Competitor mentioned, Tên, Tiêu chí so sánh |
| 6 | Phân Tích Hậu Mua / Chăm Sóc Sau Mua | Post-purchase intent, Urgency, Review risk |

---

## A4. Kiểu Dữ Liệu Của Các Cột (Field Types)

| Kiểu | Mô tả | Ví dụ |
|------|--------|-------|
| `True / False` | Boolean trả lời đúng/sai | Junk Lead, Bức xúc |
| `Short Text` | Văn bản ngắn dưới 12 chữ | Sản phẩm, Pain Point |
| `Single Choice` | 1 lựa chọn trong dropdown | Lead Temperature, Giới tính |
| `Multi-tag / Dropdown` | 1 hoặc nhiều tag | Objection, Tiêu chí so sánh |

---

## A5. Key Fields Quan Trọng

### Lead Temperature — Dùng chung
- **Nóng:** Hỏi giá + xin SĐT + hỏi "còn không" + hỏi mua ngay → cần ≥ 2 tín hiệu
- **Ấm:** Đang tư vấn, hỏi thêm nhưng chưa chốt
- **Lạnh:** 1 câu + seen không rep, HOẶC từ chối trực tiếp

### Junk Lead — Dùng chung
- **True** khi: khách gửi tin tự động từ ads rồi không rep, chat không liên quan, bấm nhầm
- Ngược lại → **False**

### Objection — Khác nhau theo ngành
- **Thời trang:** Giá đắt, Phí ship, Không có size, Hàng fake
- **Mẹ và Bé:** Lo ngại an toàn, Hỏi chồng
- **Mỹ phẩm:** Lo ngại hàng fake, Hỏi về thành phần
- **BDS:** Pháp lý chưa rõ, Ngân sách không xác nhận
- **F&B:** Quá xa, Không có chi nhánh gần
- **Du lịch:** So sánh với OTA (Traveloka/Agoda)

### Priority Escalation — Xử lý KHẨN cấp
- **Thời trang/F&B/Du lịch:** Review xấu, dọa bóc phốt
- **Mẹ và Bé:** Khiếu nại an toàn sản phẩm (sức khỏe con)
- **Mỹ phẩm:** Khiếu nại dị ứng, phản ứng da
- **Spa/Thẩm mỹ:** Phản ứng bất lợi sau dịch vụ
- **BDS:** Khiếu nại chất lượng xây dựng, pháp lý

---

## A6. Luật Xử Lý Quan Trọng

### Từ ngữ tiêu cực → Bức xúc = True
- "tức", "dọa", "kiện", "bóc phốt", "đăng review xấu", "hoàn tiền", "trả hàng"
- Đặc biệt nghiêm trọng khi liên quan sức khỏe / an toàn

### Từ ngữ tích cực → Giới thiệu được = True
- "giới thiệu bạn", "quay lại", "review tốt", "khen", "sẽ ủng hộ"

### Single Choice quy tắc
- Khách hỏi nhiều thứ → chọn tiêu chí nổi bật nhất / mới nhất
- Không đề cập → giá trị mặc định: "Không xác định" / "Không đề cập"

### Ngưỡng Lead Temperature
- **Nóng:** ≥ 2 tín hiệu chốt (hỏi giá + hỏi còn hàng + để lại SĐT)
- **Lạnh:** 1 câu + seen không rep HOẶC từ chối trực tiếp

---

## A7. Các File Track A

| File | Vai trò |
|------|---------|
| `src/pages/InsightSettings.jsx` | Layout chính — Template library + insight management |
| `src/components/insight/TemplateLibrary.jsx` | Thư viện template, lọc theo ngành/insight |
| `src/components/insight/TemplateCard.jsx` | Card template, preview prompt + columns |
| `src/components/insight/CreateInsightFromScratchModal.jsx` | Modal tạo insight mới từ đầu |
| `src/components/insight/ColumnTemplatePicker.jsx` | Chọn kiểu cột (field type) khi tạo insight |
| `src/components/insight/InsightTable.jsx` | Bảng hiển thị insight với columns |
| `src/components/insight/InsightDetailModal.jsx` | Modal chi tiết insight |
| `src/components/insight/AIInsightPanel.jsx` | Panel AI phân tích chat |
| `src/data/mockTemplates.js` | Danh sách template (7 ngành × 6 insight) |
| `src/data/mockConversations.js` | Dữ liệu chat mẫu |
| `src/data/mockAnalysisResults.js` | Kết quả phân tích AI mẫu |

**Nguồn truth cho prompt:** `template-insight.md` — mọi thay đổi về prompt/column phải cập nhật vào đây.

---

## A8. Luồng Thêm Ngành Mới

1. Copy pattern từ ngành gần nhất trong `template-insight.md`
2. Tạo 6 insight theo đúng 6 pattern chung (xem A3)
3. Điều chỉnh **Objection** và **Priority** theo đặc thù ngành (xem A5)
4. Thêm vào `mockTemplates.js`
5. Cập nhật `template-insight.md`

---

# ═══════════════════════════════════════
# TRACK B — DASHBOARD ADS
# ═══════════════════════════════════════

## B1. Mục Tiêu & Tổng Quan

**Mục tiêu:** Dashboard phục vụ **CEO/CMO** — scan trong 3 giây, không cần click. Hiển thị chi tiêu, doanh thu, ROAS, chất lượng lead theo chiến dịch.

---

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

---

## B3. Các File Track B

| File | Vai trò |
|------|---------|
| `src/pages/AdsDashboard.jsx` | Tổng quan Ads — overview cards, charts, summary table |
| `src/pages/AdsOptimization.jsx` | Gợi ý tối ưu Ads — AI recommendations, optimization table |
| `src/components/insight/OverviewCards.jsx` | 4 KPI tổng quan |
| `src/components/insight/RevenueCards.jsx` | 2 card: Doanh thu Portfolio + ROAS trung bình |
| `src/components/insight/ContributionChart.jsx` | Horizontal stacked bar — đóng góp từng chiến dịch |
| `src/components/insight/TrendChart.jsx` | 7-day FB vs Zalo area chart |
| `src/components/insight/SourceChart.jsx` | Donut chart FB vs Zalo |
| `src/components/insight/CampaignSummaryTable.jsx` | Bảng Tổng quan — 8 cột: Chiến dịch / Chi tiêu / Hội thoại / CvR / Doanh thu / ROAS / Đơn / Chất lượng — click row → AIInsightPanel + DailyDetailChart |
| `src/components/insight/CampaignOptimizationTable.jsx` | Bảng Gợi ý tối ưu — 4 cột: Chiến dịch / AI Gợi ý / Phân tích / Chỉ số — expandable row → metrics + action buttons. Sort: Tăng → Giữ → Giảm → Tắt |
| `src/components/insight/DailyDetailChart.jsx` | 7 ngày chi tiết (Revenue + Orders area + ROAS line + Hòa vốn) |
| `src/data/mockCampaigns.js` | 8 campaigns + `mockDailyBreakdown` (8×7=56 data points) + `mockOverviewStats` |
| `src/data/mockAIInsights.js` | AI recommendations per campaign |
| `src/lib/utils.js` | `formatCurrency`, `formatRoas`, `formatCompact` |

---

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

---

## B5. Mã Màu ROAS (Nhất Quán Xuyên Suốt)

| ROAS | Màu | Ý nghĩa |
|------|-----|---------|
| ≥ 3× | `#059669` xanh | Tốt — scale được |
| ≥ 1.5× | `#d97706` vàng | Cải thiện — theo dõi |
| < 1.5× | `#dc2626` đỏ | Thấp — cần xem xét |

---

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

---

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

---

# ═══════════════════════════════════════
# TRACK C — MARKETING TEAM AGENTS
# ═══════════════════════════════════════

## C1. Agent Roster

Dự án có **3 agents chuyên biệt** trong `.claude/agents/`:

| Agent | File | Vai trò | Đầu ra |
|-------|------|---------|--------|
| **Market Research Agent** | `market-research-agent.md` | Nghiên cứu thị trường, TAM/SAM, đối thủ, xu hướng, SWOT/PESTEL, personas | Báo cáo, DOCX, PPTX, XLSX, PDF |
| **Campaign Strategist Agent** | `campaign-strategist-agent.md` | Thiết kế chiến dịch, kế hoạch đa kênh, brief Content/Design/Media | Master Campaign Plan, briefs |
| **Social Content Agent** | `content.md` | Tạo nội dung sáng tạo: social post, landing page, slide, document | HTML, PPTX, DOCX, social copy |
| **Graphic Design Agent** | `design-graphic.md` | Tạo hình ảnh, banner, landing page bằng AI tools (nanobanana, Stitch, Canva) | PNG/JPG, UI screens |

## C2. Điều Phối — Mô Hình Pipeline

Khi nhận **kế hoạch triển khai marketing**, điều phối agents theo pipeline:

```
Bước 1 — MARKET RESEARCH (chạy song song nếu cần)
  └─ Market Research Agent
      → Đầu ra: Research Report (DOCX) + Competitor Matrix (XLSX)

Bước 2 — CAMPAIGN STRATEGY (chạy sau khi research xong)
  └─ Campaign Strategist Agent
      → Đầu ra: Master Campaign Plan (DOCX) + briefs cho từng team

Bước 3 — CONTENT CREATION (chạy song song, nhận brief từ Strategist)
  └─ Social Content Agent
      → Đầu ra: Social posts, landing page copy, email sequences, slide decks

Bước 4 — VISUAL DESIGN (chạy song song với Content, nhận brief từ Strategist)
  └─ Graphic Design Agent
      → Đầu ra: Banner ads, social images, hero visuals, UI screens

Bước 5 — CONSOLIDATION
  └─ Synthesize tất cả đầu ra → trình kết quả cho user
```

## C3. Khi Nào Gọi Agent Nào

| Tình huống | Agent gọi |
|-----------|-----------|
| Cần nghiên cứu thị trường mới (size, đối thủ, xu hướng) | Market Research Agent |
| Cần lên kế hoạch chiến dịch marketing đầy đủ | Campaign Strategist Agent |
| Cần tạo nội dung cụ thể: post, landing page, slide, doc | Social Content Agent |
| Cần tạo hình ảnh quảng cáo, banner, UI design | Graphic Design Agent |
| Cần cả nghiên cứu + chiến dịch + nội dung + design | Chạy pipeline: Research → Strategy → Content → Design |

## C4. Cách Triển Khai — Nhận Kế Hoạch Marketing

### Khi user bàn giao 1 kế hoạch triển khai marketing:

**Bước 1: Phân tích brief**
- Xác định mục tiêu (thương hiệu? sản phẩm mới? event? lead generation?)
- Xác định audience mục tiêu
- Xác định timeline và ngân sách
- Kiểm tra có research data sẵn không

**Bước 2: Gọi agents theo sequence**
```
1. Market Research Agent (nếu chưa có data)
   → "Research [industry/market] for [product/campaign]. Focus on: competitors, audience personas, market size, trends."

2. Campaign Strategist Agent (sau research)
   → "Build a full-funnel campaign plan for [objective]. Audience: [description]. Product: [description]. Timeline: [duration]."

3. Social Content Agent + Graphic Design Agent (song song, nhận brief từ Strategist)
   → "Create [specific content pieces] based on the campaign brief. Brand: [brand guidelines]."
   → "Generate [visual assets] for the campaign. Style: [style guide]. Dimensions: [specs]."
```

**Bước 3: Tổng hợp kết quả**
- Gom tất cả đầu ra từ các agents
- Kiểm tra consistency (message, visual, tone)
- Trình báo cáo tổng hợp cho user

## C5. Output Directory Structure

```
output/
├── marketing/
│   ├── {YYYY-MM-DD}-{campaign-name}/
│   │   ├── research/          ← Market Research Agent outputs
│   │   │   ├── research-report.docx
│   │   │   ├── competitor-matrix.xlsx
│   │   │   └── audience-personas.pdf
│   │   ├── strategy/          ← Campaign Strategist Agent outputs
│   │   │   ├── master-campaign-plan.docx
│   │   │   ├── content-brief.md
│   │   │   ├── design-brief.md
│   │   │   └── media-brief.md
│   │   ├── content/           ← Social Content Agent outputs
│   │   │   ├── social-posts.md
│   │   │   ├── landing-page-copy.html
│   │   │   └── email-sequences.docx
│   │   └── visuals/           ← Graphic Design Agent outputs
│   │       ├── banners/
│   │       ├── hero-images/
│   │       └── social-assets/
└── designs/                   ← nanobanana / Stitch outputs
    └── {YYYY-MM-DD}/
```

## C6. Các File Agent

| Agent File | Mục đích |
|-----------|----------|
| `market-research-agent.md` | Nghiên cứu thị trường — TAM/SAM/SOM, đối thủ, personas, SWOT, PESTEL |
| `campaign-strategist-agent.md` | Chiến lược chiến dịch — full-funnel plan, team briefs (Content/Design/Media) |
| `content.md` | Nội dung sáng tạo — social posts, landing pages, slides, documents |
| `design-graphic.md` | Thiết kế đồ họa — hình ảnh qua nanobanana/Stitch/Canva |

---

# ═══════════════════════════════════════
# LUẬT CHUNG — ÁP DụNG CẢ 2 TRACK
# ═══════════════════════════════════════

- **Tiếng Việt:** Tất cả prompt, output, field name đều là tiếng Việt. Không dịch.
- **Không hallucinate:** Chỉ trích xuất thông tin có trong dữ liệu. Không có → giá trị mặc định.
- **Không nhảy track:** Mỗi session chỉ làm 1 track. Muốn chuyển → kết thúc session hiện tại, báo cáo, rồi bắt đầu track mới.
- **Template đang sống:** `template-insight.md` là nguồn truth cho Track A. Mọi thay đổi prompt/column phải cập nhật vào file này.

### Quy tắc chống deploy nhầm (Vercel)
- Luôn kiểm tra alias trước khi báo deploy xong:
  - `npx vercel alias ls | grep "ai-insight-mockup.vercel.app"`
- Alias bắt buộc phải trỏ đúng deployment mới nhất (không dùng deployment cũ dù status `Ready`).
- Sau khi deploy, luôn verify trực tiếp route chính:
  - `https://ai-insight-mockup.vercel.app/insight/medical-checkup`
- Nếu thấy `404: NOT_FOUND`, kiểm tra ngay `vercel.json` ở **root project** (không đặt trong `src/`).
- Chỉ xác nhận "deploy xong" sau khi đã qua 2 bước: **alias đúng + route hoạt động**.

---

# ═══════════════════════════════════════
# SESSION LOG
# ═══════════════════════════════════════

## Quy Tắc Báo Cáo Sau Mỗi Session

Sau khi hoàn thành 1 session, AI **bắt buộc** cập nhật phần này với:

```
### [Ngày] — Track [A/B]: [Tên tính năng]
- **Trạng thái:** ✅ Xong / ⚠️ Còn lỗi / 🔄 Đang làm dở
- **File đã sửa:** [danh sách file]
- **File đã tạo:** [danh sách file mới]
- **Bug đã fix:** [mô tả]
- **Còn cần làm:** [mô tả nếu chưa xong]
```

---

### 2026-03-31 — Track C: Launch Campaign — SMAX AI Insight "Biết khách đang nói gì"
- **Trạng thái:** ✅ Xong + Build OK (2371 modules) + Deploy production ✅
- **URL:** https://audit.cdp.vn/official
- **File đã tạo:**
  - `src/pages/OfficialPage.jsx` — Landing page campaign hoàn chỉnh 8 sections (Hero + Stats Strip + Problem + Features + Industries + How It Works + Lead Form + Footer), dark theme SMAX brand, form Supabase lead capture
  - `output/marketing/2026-03-31-smax-insight-launch/content/social-posts.md` — 8 posts × 2 platforms (FB + IG) + story sequence + engagement replies
  - `output/marketing/2026-03-31-smax-insight-launch/campaign-plan.md` — Full campaign plan 14 ngày: audience targeting, funnel architecture, budget allocation, KPIs, execution checklist
- **File đã sửa:**
  - `src/App.jsx` — Thêm route `/official` → `<OfficialPage />`
- **Hình ảnh quảng cáo đã tạo** (nanobanana, 7 assets):
  - `public/assets/campaign/official/banner-hero-[1-3].png` — 3 Hero 16:9 dark radar dashboard
  - `public/assets/campaign/official/carousel-[1-2].png` — 2 Carousel 1:1 pain point + testimonial
  - `public/assets/campaign/official/banner-split-[1-2].png` — 2 Before/after 16:9
- **Campaign Specs:** Brand SMAX · Audience: CMO/CEO/Sales/CS · Lead goal: 100 · CTA: Nhận báo cáo miễn phí · Thời gian: 01/04–14/04/2026 · 8 content posts
- **Còn cần làm:** Chạy ads thực tế trên Facebook/Instagram

---

### 2026-03-31 — Track A: Rewrite IndustryFormStep — Cards Grid + Disease Preview Panel
- **Trạng thái:** ✅ Xong + Build OK (2371 modules) + Deploy production ✅
- **URL:** https://audit.cdp.vn/insight/medical-checkup
- **File đã sửa:**
  - `src/components/medical/IndustryFormStep.jsx` — Rewrite hoàn toàn: dropdown → 7 industry cards (grid-cols-2 md:grid-cols-4), Lucide icons (Shirt/Baby/Sparkles/Flower2/Building2/UtensilsCrossed/Plane), selected card: border-l-4 Deep Rust + icon circle Deep Rust, Disease Preview Panel (glass-panel) hiện 9 nhóm bệnh khi đã chọn ngành, Customer Group textarea với ambient shadow
  - `src/pages/MedicalCheckup.jsx` — Fix extra `}` orphan trên line 411
- **Bug đã fix:**
  - `Spa` icon không tồn tại trong lucide-react → thay bằng `Flower2`
  - `MedicalCheckup.jsx` line 411: `})` thừa → duplicate closing brace → syntax error
- **GitHub:** `abae10f` — fix(medical): rewrite IndustryFormStep to cards grid + disease preview panel
- **Còn cần làm:** T2/T3/T4 — đang chờ user cập nhật spec

---

### 2026-03-30 — Track C: Marketing Agent Team Setup + Orchestration
- **Trạng thái:** ✅ Xong
- **File đã sửa:**
  - `CLAUDE.md` — Thêm Track C (Marketing Team), Agent Roster, Pipeline điều phối, cách triển khai, Output Directory Structure
- **Thay đổi:**
  - Thêm **Track C — Marketing Team** vào danh sách track
  - Thêm **Agent Roster** (4 agents: Market Research, Campaign Strategist, Social Content, Graphic Design)
  - Thêm **Pipeline 5 bước**: Research → Strategy → Content → Design → Consolidation
  - Thêm **Matrix khi nào gọi agent nào** (6 tình huống)
  - Thêm **Quy trình nhận kế hoạch triển khai** (3 bước: phân tích brief, gọi agents, tổng hợp)
  - Thêm **Output Directory Structure** cho marketing deliverables
  - Cập nhật **Thư mục dự án** — thêm `.claude/agents/` folder
- **Agent files đã review:**
  - `market-research-agent.md` — Nghiên cứu thị trường, TAM/SAM, đối thủ, SWOT/PESTEL, personas. Input: research objectives. Output: DOCX, PPTX, XLSX, PDF reports.
  - `campaign-strategist-agent.md` — Lên kế hoạch chiến dịch, full-funnel channel plan, Content/Design/Media briefs. Input: research + product docs. Output: Master Campaign Plan, team briefs.
  - `content.md` — Tạo nội dung sáng tạo (social posts, landing pages, slides, docs). Input: brand guidelines + campaign brief. Output: HTML, PPTX, DOCX, social copy.
  - `design-graphic.md` — Tạo hình ảnh bằng AI (nanobanana, Stitch, Canva). Input: design specs + brand tokens. Output: PNG/JPG, UI screens.
- **Còn cần làm:** Không

---

### 2026-03-30 — Track B: Campaign Overview Table — Nằm dưới 4 KPI Cards
- **Trạng thái:** ✅ Xong + Build OK (2367 modules) + Deploy production ✅
- **URL:** https://audit.cdp.vn/insight/medical-checkup
- **File đã tạo:**
  - `src/components/ads/AdsCampaignOverviewTable.jsx` — Table tổng quan chiến dịch Ads nằm ngay dưới 4 KPI cards
- **File đã sửa:**
  - `src/components/ads/AdsMedicalDashboard.jsx` — Import + wire `AdsCampaignOverviewTable` sau `AdsKpiCards`
- **Thay đổi:**
  - 12-column CSS Grid layout: Chiến Dịch (4col) | Chi Tiêu (2col right) | Doanh Thu (2col right) | ROAS (1col center) | Đơn Hàng (1col center) | Đánh Giá (2col center)
  - Platform badge: Facebook (blue pill) / Zalo (teal pill) với SVG icon
  - ROAS color-coded: ≥3× xanh / ≥1.5× vàng / <1.5× đỏ + 3 dots indicator
  - Action badge: ↑ Tăng (xanh) / ● Giữ (blue) / ↓ Giảm (đỏ) / ⏸ Tạm dừng (vàng)
  - Filter chips: Tất cả / Facebook / Zalo + Sort dropdown (Mới nhất / ROAS / Chi tiêu)
  - Paused campaigns: opacity 60% + strikethrough name + "⏸ Tạm dừng" label
- **Còn cần làm:** Không

---

### 2026-03-29 — Track A: Debug — Gợi Ý Tối Ưu Smax treo "Đang xử lý..."
- **Trạng thái:** ✅ Xong + Build OK (2366 modules) + Deploy production ✅
- **URL:** https://audit.cdp.vn/insight/medical-checkup
- **File đã sửa:**
  - `src/lib/smaxAIService.js` — Fix 2 bug nghiêm trọng trong `askSmaxForDisease()`
  - `src/components/medical/SmaxRecommendationsPanel.jsx` — Fix render `done` + empty actions fallthrough
- **Bug đã fix:**
  - **Bug 1 — Cache HIT không bao giờ gọi `onDone`:** `askSmaxForDisease()` khi cache HIT chỉ simulate streaming text, không gọi `onDone(actions)` → `status` mắc ở `'streaming'`, không bao giờ chuyển sang `'done'`. Fix: parse cached text → `normalizeSmaxActions()` → gọi `onDone(actions)` đúng cách.
  - **Bug 2 — `done` + empty actions fallthrough:** Khi `status === 'done'` nhưng `actions.length === 0` → render rơi vào branch `actions.length > 0 ? ... : (...)` → hiện "Đang phân tích..." với spinner. Fix: thêm IIFE guard — nếu `done` nhưng `actions.length === 0` → hiện `preview` text (đã có giá trị) thay vì spinner.
- **Console error đi kèm:** `Unhandled Promise Rejection: Bridge route searchFTSReportTabAlive timed out` — lỗi này đến từ Supabase MCP bridge trên máy user, không ảnh hưởng Smax AI panel.
- **Còn cần làm:** Không

### 2026-03-29 — Track B: Flow Simplification — Bỏ Tab Phễu Attribution
- **Trạng thái:** ✅ Xong + Build OK + Deploy production ✅
- **URL:** https://audit.cdp.vn/insight/medical-checkup
- **File đã sửa:**
  - `src/components/ads/AdsMedicalDashboard.jsx` — bỏ hoàn toàn tab switcher `Phễu Attribution | Bệnh Ads`; bỏ nhánh render funnel; giữ single result view chỉ còn Bệnh Ads; dọn state/import/hàm không dùng
  - `PRD-ads-audit.md` — cập nhật PRD theo flow mới: single view Bệnh Ads (không còn 2 tabs), cập nhật mục lục/section title/core loop/architecture/table kỹ thuật và đánh dấu phần Tab 2 là deprecated
  - `CLAUDE.md` — cập nhật session log
- **Bug/UX đã fix:**
  - Flow đúng theo yêu cầu: Kết nối Ads → chọn campaign → chọn ngày → xem kết quả Khám Bệnh Ads
  - Loại bỏ phần Phễu Attribution không cần thiết khỏi màn kết quả
- **Còn cần làm:** User review UI cuối

### 2026-03-29 — Track B: Redesign Layout — Khám Bệnh Ads theo Hồ Sơ Bệnh Án
- **Trạng thái:** ✅ Xong + Build OK (2366 modules) + Deploy production ✅
- **URL:** https://audit.cdp.vn/insight/medical-checkup
- **File đã sửa:**
  - `src/components/ads/AdsHealthScoreHeader.jsx` — rewrite hoàn toàn theo layout mẫu: score lớn cột trái + danh sách "Đóng Góp Theo Nhóm Bệnh" cột phải + sparkline + CTA scroll tới từng disease card
  - `src/components/ads/AdsMedicalDashboard.jsx` — thêm `AdsKpiCards` (4 card chỉ số quan trọng) ngay dưới header; truyền `diseases` vào header để render contribution list; set `defaultExpanded={true}` khi render `AdsDiseaseItemLayout`
  - `src/components/ads/AdsDiseaseCard.jsx` — đồng bộ mở rộng mặc định theo prop `defaultExpanded`, giữ trạng thái expanded khi parent yêu cầu mở
- **Bug đã fix:**
  - Áp dụng layout mẫu “Hồ Sơ Bệnh Án” cho Khám Bệnh Ads (visual parity)
  - Nhóm bệnh Ads mở rộng mặc định (không còn load ở trạng thái thu gọn)
- **Còn cần làm:** Chờ user xác nhận UI thực tế

### 2026-03-29 — Track B: Redesign Layout — Khám Bệnh Ads theo Hồ Sơ Bệnh Án
- **Trạng thái:** ✅ Xong + Build OK (2366 modules) + Deploy production ✅
- **URL:** https://audit.cdp.vn/insight/medical-checkup
- **File đã sửa:**
  - `src/components/ads/AdsHealthScoreHeader.jsx` — rewrite hoàn toàn theo layout mẫu: score lớn cột trái + danh sách "Đóng Góp Theo Nhóm Bệnh" cột phải + sparkline + CTA scroll tới từng disease card
  - `src/components/ads/AdsMedicalDashboard.jsx` — thêm `AdsKpiCards` (4 card chỉ số quan trọng) ngay dưới header; truyền `diseases` vào header để render contribution list; set `defaultExpanded={true}` khi render `AdsDiseaseItemLayout`
  - `src/components/ads/AdsDiseaseCard.jsx` — đồng bộ mở rộng mặc định theo prop `defaultExpanded`, giữ trạng thái expanded khi parent yêu cầu mở
- **Bug đã fix:**
  - Áp dụng layout mẫu “Hồ Sơ Bệnh Án” cho Khám Bệnh Ads (visual parity)
  - Nhóm bệnh Ads mở rộng mặc định (không còn load ở trạng thái thu gọn)
- **Còn cần làm:** Chờ user xác nhận UI thực tế

### 2026-03-29 — Track B: Debug — Khám Bệnh Ads UI Fixes (Round 2)
- **Trạng thái:** ✅ Xong + Build OK (2366 modules) + Deploy production ✅
- **URL:** https://audit.cdp.vn/insight/medical-checkup
- **File đã sửa:**
  - `src/components/ads/AdsHealthScoreHeader.jsx` — rewrite hoàn toàn theo layout mẫu: score lớn cột trái + danh sách "Đóng Góp Theo Nhóm Bệnh" cột phải + sparkline + CTA scroll tới từng disease card
  - `src/components/ads/AdsMedicalDashboard.jsx` — thêm `AdsKpiCards` (4 card chỉ số quan trọng) ngay dưới header; truyền `diseases` vào header để render contribution list; set `defaultExpanded={true}` khi render `AdsDiseaseItemLayout`
  - `src/components/ads/AdsDiseaseCard.jsx` — đồng bộ mở rộng mặc định theo prop `defaultExpanded`, giữ trạng thái expanded khi parent yêu cầu mở
- **Bug đã fix:**
  - Áp dụng layout mẫu “Hồ Sơ Bệnh Án” cho Khám Bệnh Ads (visual parity)
  - Nhóm bệnh Ads mở rộng mặc định (không còn load ở trạng thái thu gọn)
- **Còn cần làm:** Chờ user xác nhận UI thực tế

### 2026-03-29 — Track B: Redesign Layout — Khám Bệnh Ads theo Hồ Sơ Bệnh Án
- **Trạng thái:** ✅ Xong + Build OK (2366 modules) + Deploy production ✅
- **URL:** https://audit.cdp.vn/insight/medical-checkup
- **File đã sửa:**
  - `src/components/ads/AdsHealthScoreHeader.jsx` — rewrite hoàn toàn theo layout mẫu: score lớn cột trái + danh sách "Đóng Góp Theo Nhóm Bệnh" cột phải + sparkline + CTA scroll tới từng disease card
  - `src/components/ads/AdsMedicalDashboard.jsx` — thêm `AdsKpiCards` (4 card chỉ số quan trọng) ngay dưới header; truyền `diseases` vào header để render contribution list; set `defaultExpanded={true}` khi render `AdsDiseaseItemLayout`
  - `src/components/ads/AdsDiseaseCard.jsx` — đồng bộ mở rộng mặc định theo prop `defaultExpanded`, giữ trạng thái expanded khi parent yêu cầu mở
- **Bug đã fix:**
  - Áp dụng layout mẫu “Hồ Sơ Bệnh Án” cho Khám Bệnh Ads (visual parity)
  - Nhóm bệnh Ads mở rộng mặc định (không còn load ở trạng thái thu gọn)
- **Còn cần làm:** Chờ user xác nhận UI thực tế

### 2026-03-29 — Track B: Debug — Khám Bệnh Ads UI Fixes (Round 2)
- **Trạng thái:** ✅ Xong + Build OK (2366 modules) + Deploy production ✅
- **URL:** https://audit.cdp.vn/insight/medical-checkup
- **File đã sửa:**
  - `src/pages/MedicalCheckup.jsx` — wrap wizard container với `{adsStep < 5 && (...)}` để ẩn thanh wizard 4-step khi dashboard hiện
  - `src/components/ads/AdsHealthScoreHeader.jsx` — fix funnelPcts normalize để tổng = 100%, thêm defensive guards cho NaN/undefined; fix cả `AttributionFunnel` chips
  - `src/components/ads/AdsMedicalDashboard.jsx` — `collapsedIds = []` default → disease cards mở rộng mặc định
  - `src/components/ads/AdsRoasBreakdown.jsx` — import `AdsOrderTable`, thêm modal state + `buildMockOrdersForCampaign()`, 2 nút "Xem chi tiết orders" + "Gợi ý Smax" có onClick, 2 modal với nội dung thực
  - `src/components/ads/AdsDiseaseCard.jsx` — import `AdsOrderTable`, rewrite `DetailTab` hoàn toàn: summary metrics cards + `AdsOrderTable` với mock orders, fallback hiển thị metrics rows
- **Bug đã fix:**
  - Wizard 4-step không còn đè lên Dashboard (adsStep < 5 → wizard ẩn hoàn toàn)
  - Phễu funnel text không còn đè nhau (normalize funnelPcts → tổng 100%)
  - Disease cards default mở rộng thay vì thu gọn
  - "Xem chi tiết orders" → modal với AdsOrderTable 24 dòng mock orders
  - "Gợi ý Smax" → modal với 3 recommendations theo priority
  - Tab Chi Tiết nhóm bệnh → real metrics + orders table thay vì placeholder
- **Còn cần làm:** Kiểm tra trên trình duyệt

### 2026-03-29 — Track B: Detail Tab — 3 Sub-tabs (Thống Kê Ads | Đơn Hàng | Chi tiết Tin nhắn)
- **Trạng thái:** ✅ Xong + Build OK (2366 modules) + Deploy production ✅
- **URL:** https://audit.cdp.vn/insight/medical-checkup
- **File đã sửa:**
  - `src/components/ads/AdsDiseaseCard.jsx` — viết lại `DetailTab` hoàn toàn với 3 sub-tabs theo PRD Section 6.3
  - `src/components/ads/AdsDiseaseCard.jsx` — thêm import `AdsConversationDetailPanel`
- **Thay đổi chi tiết:**
  - **Sub-tab 1 — Thống Kê Ads:** 3 summary metric cards + bảng 5 cột (Ads ID / Chiến dịch / metric 1 / metric 2 / Score). Sort worst-first theo disease-specific sort key (ROAS→roasGap, Attribution→matchedRate, Junk→junkRate, etc.). Color-coded dots per row (🔴🟡⚪)
  - **Sub-tab 2 — Đơn Hàng từ Ads:** Summary chips (matched/untracked count) + `AdsOrderTable` với filter Matched/Untracked
  - **Sub-tab 3 — Chi tiết Tin nhắn:** Gọi `AdsConversationDetailPanel` — 2 cột: danh sách hội thoại đã match (40%) + chi tiết 3 tabs Tin nhắn/Đánh Giá/Hành Động (60%)
  - Mock conversations tự generate từ `attributionData` để preview real flow
  - Empty state khi không có data cho sub-tab
- **Trạng thái components:** Tất cả 4 component còn lại đã verify — AdsConversationDetailPanel ✅ / AdsCriticalAlertsPanel ✅ / AdsSmaxRecommendationsPanel ✅ / AdsDiseaseItemLayout ✅
- **Còn cần làm:** PDF export button (đã có UI, chưa implement `window.print`)

### 2026-03-28 — Track B: TrendChart — Toggle tắt/bật từng đường Line
- **Trạng thái:** ✅ Xong + Build OK (2348 modules)
- **File đã sửa:** `src/components/insight/TrendChart.jsx`
- **Thay đổi:**
  - Thêm `useState` cho `hiddenLines` để track đường Line đang ẩn
  - Thay `<Legend>` mặc định bằng custom legend — 2 nút clickable (Facebook / Zalo)
  - Nút ẩn: màu xám + opacity 0.45 + line thay bằng dashed placeholder
  - Mỗi Area có `hide={hiddenLines[key]}` — Recharts tự ẩn/hiện đường + tooltip
  - Toggle bằng click trực tiếp trên legend buttons
- **Còn cần làm:** Deploy Vercel

---

### 2026-03-28 — Track A: Smax AI JSON Checklist + UI tối giản
- **Trạng thái:** ✅ Xong + Build OK (2348 modules) + Deploy production ✅
- **URL:** https://audit.cdp.vn/insight/medical-checkup
- **File đã tạo:**
  - `src/lib/smaxAIService.js` — Service gọi Smax AI API (`POST https://smaxai.cdp.vn/api/chat`) + cache 24h + prompt JSON output
  - `api/smax-chat.js` — Vercel API proxy chống CORS
- **File đã sửa:**
  - `src/components/medical/SmaxRecommendationsPanel.jsx` — Rewrite UI checklist thuần: bỏ tab Hành Động, bỏ badge AI dư thừa, click action để expand steps
  - `src/components/medical/DiseaseItemLayout.jsx` — Truyền `industry`, `industryLabel`, `conversations` xuống panel
  - `src/components/medical/MedicalResultStep.jsx` — Truyền context ngành hàng
  - `src/lib/medicalService.js` — Bổ sung fields hỗ trợ AI prompt context
- **Bug đã fix:**
  - Fix lỗi hiển thị raw bytes/JSON string (`91,84,72...` hoặc `{"actions"...`) trong UI
  - Fix trạng thái treo `Đang xử lý...` khi parser bắt JSON không đầy đủ
  - Fix CORS khi gọi trực tiếp `smaxai.cdp.vn` từ browser
- **Thay đổi:**
  - Prompt yêu cầu AI trả JSON format `{ actions: [...] }`
  - Render checklist ngắn gọn: title action + impact + click mở steps
  - Có save từng action (bookmark) và refresh cache
- **Còn cần làm:** PDF export

---

### 2026-03-28 — Track A: Smax AI JSON Checklist + UI tối giản
- **Trạng thái:** ✅ Xong + Build OK (2348 modules) + Deploy production ✅
- **URL:** https://audit.cdp.vn/insight/medical-checkup
- **File đã tạo:**
  - `src/lib/smaxAIService.js` — Service gọi Smax AI API (`POST https://smaxai.cdp.vn/api/chat`) + cache 24h + prompt JSON output
  - `api/smax-chat.js` — Vercel API proxy chống CORS
- **File đã sửa:**
  - `src/components/medical/SmaxRecommendationsPanel.jsx` — Rewrite UI checklist thuần: bỏ tab Hành Động, bỏ badge AI dư thừa, click action để expand steps
  - `src/components/medical/DiseaseItemLayout.jsx` — Truyền `industry`, `industryLabel`, `conversations` xuống panel
  - `src/components/medical/MedicalResultStep.jsx` — Truyền context ngành hàng
  - `src/lib/medicalService.js` — Bổ sung fields hỗ trợ AI prompt context
- **Bug đã fix:**
  - Fix lỗi hiển thị raw bytes/JSON string (`91,84,72...` hoặc `{"actions"...`) trong UI
  - Fix trạng thái treo `Đang xử lý...` khi parser bắt JSON không đầy đủ
  - Fix CORS khi gọi trực tiếp `smaxai.cdp.vn` từ browser
- **Thay đổi:**
  - Prompt yêu cầu AI trả JSON format `{ actions: [...] }`
  - Render checklist ngắn gọn: title action + impact + click mở steps
  - Có save từng action (bookmark) và refresh cache
- **Còn cần làm:** PDF export

---

### 2026-03-28 — Track A: Fix Cảnh Báo Khẩn — Hiển thị Hội Thoại
- **Trạng thái:** ✅ Xong + Build OK (2348 modules) + Deploy production ✅
- **URL:** https://ai-insight-mockup.vercel.app/insight/medical-checkup
- **File đã sửa:**
  - `src/components/medical/CriticalAlertsPanel.jsx` — Rewrite hoàn toàn phần expand alert
  - `docs/superpowers/specs/2026-03-28-critical-alerts-conversation-display-design.md` — Design spec
- **Thay đổi:**
  - Font `text-[11px]` cho cả tên khách + summary (thay vì `text-[12px]` + truncate)
  - Summary 2 dòng không `...` — dùng `line-clamp-2`
  - `buildConversationSummary(conv)`: ghép emoji từ data thực — temp + phoneStatus + sentiment (fallback painPoint/objection)
  - `getConversationExamples()`: pick 10 unique customers, sort Nóng → Ấm → Lạnh
  - AlertRow expanded: `[PlatformIcon 20px] [Tên + Summary 2 dòng] [Spacer] [TempDot + Date]`
- **GitHub:** `491c788` — fix(medical): CriticalAlertsPanel — font small + per-conv emoji summaries
- **Còn cần làm:** Không

---

### 2026-03-28 — Track A: Health Score Header — Option E (3-Column Diagnostic Layout)
- **Trạng thái:** ✅ Xong + Build OK (2341 modules) + Deploy production ✅
- **URL:** https://ai-insight-mockup.vercel.app
- **File đã sửa:**
  - `src/components/medical/HealthScoreHeader.jsx` — Rewrite hoàn toàn theo Option E: 3 cột (Score | Cần cải thiện + Trung bình | Tốt)
  - `src/App.jsx` — Thêm route `/kham-benh` → `MedicalCheckupLanding`
  - `src/components/landing/TopNavBar.jsx` — TopNavBar cho landing page
  - `src/lib/medicalService.js` — Bỏ legal-risk group (9 nhóm thay vì 10)
- **File đã tạo:**
  - `src/pages/MedicalCheckupLanding.jsx` — Landing page riêng cho Khám Bệnh (route `/kham-benh`)
  - `docs/superpowers/specs/2026-03-28-health-score-header-design.md` — Design spec
  - `docs/superpowers/plans/2026-03-28-health-score-header-plan.md` — Implementation plan
- **Thay đổi:**
  - Option E: Cột 1 = Score tổng + progress bar + delta; Cột 2 = Nhóm yếu (<5) thanh đỏ chi tiết + Trung bình chip thu gọn; Cột 3 = Nhóm tốt (≥7.5) thanh xanh
  - Bỏ truncate text → hiện đủ tên nhóm bệnh không còn `...`
  - Emergency banner khi score < 3
  - Delta chỉ hiện khi ≥ 2 lần khám (từ medical history)
  - `DiseaseItemLayout` đã có `id={`disease-${disease.id}`}` cho scrollIntoView
- **GitHub:** `9a40c3f` — feat(medical): HealthScoreHeader Option E + MedicalCheckupLanding page
- **Còn cần làm:** PDF export

---

### 2026-03-27 — Track A: Phễu Chuyển Đổi Hội Thoại + Cảnh Báo Khẩn Expandable
- **Trạng thái:** ✅ Xong + Build OK (2345 modules) + Playwright E2E ✅
- **File đã tạo:**
  - `src/components/medical/ConversationFunnelSection.jsx` — Phễu 4 nấc (Lead Nóng / Thu thập SĐT / Chốt đơn / Khách rác) + bar KH Quay Lại + AI suggestion panel + Sentiment card (Tích cực/Băn khoăn/Tiêu cực), grid 60/40 layout
  - `docs/superpowers/plans/2026-03-27-conversation-funnel-alerts.md` — Design spec
- **File đã sửa:**
  - `src/components/medical/MedicalResultStep.jsx` — Chèn `ConversationFunnelSection` giữa `HealthScoreHeader` và `LeadsQualityDashboard`
  - `src/components/medical/CriticalAlertsPanel.jsx` — Rewrite hoàn toàn: thêm `expandedId` state, accordion expand, hiện 10 hội thoại dẫn chứng (tên khách + platform icon + 1 dòng tóm tắt), `getConversationExamples()` + `PlatformIcon` helper
  - `src/components/medical/DiseaseItemLayout.jsx` — Truyền `conversations` prop vào `CriticalAlertsPanel`
- **Thay đổi:**
  - Phễu Lead: data computed từ `conversations` (temperature/phone_status/is_junk/is_returning_customer), % scale theo `conversations.length`
  - AI suggestion: dùng `warmCount` + `junkCount` thực từ data để render conditional text
  - Sentiment: mock 60/25/15% hardcoded, 3 stacked blocks với height tỉ lệ %
  - Cảnh báo expand: `Math.random()` pick 10 customer names từ conversations pool, gắn summary string theo alert type
- **GitHub:** `8a19617` — feat(medical): add ConversationFunnelSection + expandable CriticalAlertsPanel
- **Còn cần làm:** PDF export

---

### 2026-03-27 — Track A: Tính năng "Khám Bệnh Hội Thoại" (PRD approved → Implementation)
- **Trạng thái:** ✅ Xong + Build OK (2334 modules)
- **File đã tạo:**
  - `src/lib/medicalService.js` — Logic chẩn đoán 10 nhóm bệnh từ Supabase JSON + rule-based Chuyên gia Smax recommendations + crawl simulation + localStorage medical records
  - `src/pages/MedicalCheckup.jsx` — Wizard layout 5 bước với step indicator
  - `src/components/medical/FanpageConnectStep.jsx` — Step 1 mockup (2s loading → auto-advance)
  - `src/components/medical/IndustryFormStep.jsx` — Step 2 ngành hàng + nhóm KH
  - `src/components/medical/QuantitySelectStep.jsx` — Step 3 chọn 1K/5K/10K
  - `src/components/medical/CrawlProgressStep.jsx` — Step 4 progress bar + disease groups
  - `src/components/medical/MedicalResultStep.jsx` — Step 5 real-time dashboard
  - `src/components/medical/DiseaseCard.jsx` — Card bệnh (collapsed + expanded)
  - `src/components/medical/MedicalFilterTabs.jsx` — Filter tabs pill-style theo nhóm bệnh
  - `src/components/medical/HealthScoreHeader.jsx` — Điểm sức khỏe + progress bar + delta
  - `src/components/medical/ActionRecommendation.jsx` — Chuyên gia Smax recommendation card
  - `src/components/medical/SavedActionsBar.jsx` — Sticky bar tổng hợp actions đã lưu
- **File đã sửa:**
  - `src/App.jsx` — Thêm route `/insight/medical-checkup`
  - `src/components/layout/Sidebar.jsx` — Thêm nav item "Khám Bệnh" (Stethoscope icon)
  - `src/components/ui/Button.jsx` — Primary = Deep Rust (#BF3003) thay vì Coral (#fa6e5b)
- **Design System:** Editorial Precision — Deep Navy / Deep Rust / Vibrant Blue / 8px radius / no-line rule / glassmorphism
- **Còn cần làm:** PDF export (button đã có, chờ implement `window.print` hoặc html2pdf)

---

### 2026-03-23 — Track A: Khởi tạo CLAUDE.md
- **Trạng thái:** ✅ Xong
- **File đã sửa:** `CLAUDE.md` (viết lại hoàn toàn)
- **Thay đổi:** Tách đôi CLAUDE.md thành Track A (Cài Đặt Insight) và Track B (Dashboard Ads), thêm Session Log, thêm luật chung

---

### 2026-03-23 — Track A: Tạo Insight bằng AI (Custom AI token.ai.vn)
- **Trạng thái:** ✅ Xong
- **File đã tạo:** `src/lib/aiService.js` — AI service cho Custom AI endpoint
- **File đã sửa:** `src/components/insight/CreateInsightFromScratchModal.jsx` (viết lại hoàn toàn), `src/pages/InsightSettings.jsx`
- **Thay đổi:**
  - Bước 0: Khai báo thông tin Doanh nghiệp (tên, ngành, quy mô, tập KH, mong muốn phân tích)
  - Bước 1: Gọi Custom AI (token.ai.vn, model gpt-4.1-mini) → gen Master Business Insight + 6 Insight chi tiết
  - Bước 2: Preview 6 Insight với edit inline (tên, mô tả, cột dữ liệu)
  - Bước 3: Summary + Save
  - Hỗ trợ retry khi API lỗi
  - InsightEditModal: sửa tên/mô tả/cột dữ liệu (single_select, dropdown, true_false, short_text)
  - 11 ngành + ngành khác
- **Còn cần làm:** Test end-to-end với Custom AI thực tế

### 2026-03-23 — Track B: Tách bảng Chiến dịch thành 2 view
- **Trạng thái:** ✅ Xong
- **File đã tạo:** `src/components/insight/CampaignSummaryTable.jsx`, `src/components/insight/CampaignOptimizationTable.jsx`
- **File đã sửa:** `src/pages/AdsDashboard.jsx`, `CLAUDE.md`
- **Thay đổi:**
  - Tách Dashboard Ads thành 2 page riêng biệt qua Sidebar:
    - `/insight/dashboard` → **Tổng quan Ads**: Overview cards, Executive Summary, charts, bảng CampaignSummaryTable (8 cột)
    - `/insight/ads-optimization` → **Gợi ý tối ưu Ads**: Junk banner, Executive Summary, bảng CampaignOptimizationTable (4 cột) với expand row
  - Sidebar: thêm 2 nav items "Tổng quan Ads" (Sparkles) và "Gợi ý tối ưu Ads" (TrendingUp, badge AI)
  - File mới: `src/pages/AdsOptimization.jsx`
  - File đã sửa: `AdsDashboard.jsx`, `App.jsx`, `Sidebar.jsx`

---

### 2026-03-23 — Track A: Gộp tab "Kết quả phân tích" vào "Tổng quan"
- **Trạng thái:** ✅ Xong
- **File đã sửa:** `src/components/insight/InsightDetail.jsx`
- **Thay đổi:**
  - Bỏ tab "Kết quả phân tích" (was tab 3)
  - Gộp toàn bộ nội dung (Pain Points, Rào cản chốt đơn, Lỗi mất khách, Đối thủ, Giới tính, Khu vực, Cảm xúc, Phân loại tin nhắn) vào tab "Tổng quan"
  - Còn 3 tab: Tổng quan · Cấu hình · Chi tiết
  - Layout grid 3 cột gọn hơn (164 insertions, 227 deletions)

### 2026-03-23 — Track A: Thêm Line Chart xu hướng + fix layout Tổng quan
- **Trạng thái:** ✅ Xong
- **File đã tạo:** `src/components/insight/InsightTrendChart.jsx`, `src/data/mockInsightTrend.js`
- **File đã sửa:** `src/components/insight/InsightDetail.jsx`
- **Thay đổi:**
  - Thêm **InsightTrendChart** — Line chart multi-metric theo thời gian, toggle Tuần (7 ngày) / Tháng (30 ngày), placed sau KPI stats row
  - Fix layout: chuyển sang **auto-fill grid** (grid-cols-2 sm:grid-cols-3 xl:grid-cols-4) — card nào có data mới render, không còn khoảng trống thừa
  - Fix bug NaN: dùng `analyzedAt` thay vì `lastConversation`
  - Fix chart visibility: nền tinted, line 2.5px + dot, tooltip white bg, màu bão hòa

---

### 2026-03-23 — Track A: Full-page Insight Detail + Bug Fixes
- **Trạng thái:** ✅ Xong
- **File đã tạo:** `src/components/insight/InsightDetail.jsx`
- **File đã sửa:** `src/pages/InsightSettings.jsx`, `src/components/insight/InsightTable.jsx`, `src/data/mockConversations.js`, `vercel.json`
- **Bug đã fix:**
  - `InsightTable`: `onView(insight)` → `onView(insight.id)` (truyền đúng id thay vì object → detail view trống)
  - `InsightDetail`: `h-full` → `flex-1 min-h-0 overflow-y-auto` (parent height context)
  - Wrap detail content trong scrollable div + `scrollIntoView` khi chọn card
- **Thay đổi:**
  - Convert `InsightDetailModal` → full-page view trong `InsightSettings` (không còn modal)
  - Top carousel: horizontal scrollable card row chọn insight
  - Back button quay về danh sách
  - Insight header: icon, tên, badge, nút Cấu hình/Xuất dữ liệu
  - 3 tabs: Tổng quan / Cấu hình / Chi tiết
  - Click bất kỳ đâu trên dòng table → mở detail (bỏ icon mắt, action buttons dùng `stopPropagation`)
- **Config:** Thêm `vercel.json` với SPA rewrite để fix 404 khi F5

---

### 2026-03-23 — Track A: Mở rộng Template Library + 42 templates + Search filter + Push GitHub
- **Trạng thái:** ✅ Xong
- **File đã tạo:** `src/data/generate-conversations.js` — Generator script tạo 42 templates × 20 rows
- **File đã sửa:**
  - `src/data/mockConversations.js` — 42 templates × 20 rows = 840 dòng conversations data
  - `src/data/mockTemplates.js` — 42 templates (7 ngành × 6 insights)
  - `src/components/insight/TemplateLibrary.jsx` — Tab ngành thay vì tab kênh
  - `src/components/insight/TemplateCard.jsx` — Badge ngành thay vì badge kênh
  - `src/components/insight/InsightDetailModal.jsx` — Thêm Search filter trong Tab Chi tiết
- **Thay đổi:**
  - Thư viện Template: tab ngành hàng (Thời trang, Mẹ và Bé, Mỹ phẩm, Spa/Thẩm mỹ, Bất động sản, F&B, Du lịch)
  - Mỗi template có 20 dòng mockup conversations
  - Search filter trong Tab Chi tiết: tìm theo tên khách hàng hoặc bất kỳ giá trị nào (temperature, location, painPoint...)
  - Kết hợp được với cross-filter đã có
  - Auto-reset search khi mở insight mới
- **GitHub:** `71cd94d` — feat(insight): expand conversations to 20 rows/template + add search filter

---

### 2026-03-24 — Track A: Insight Detail — Editable Config, Line Chart, Fix bugs
- **Trạng thái:** ✅ Xong
- **File đã tạo:** `src/components/insight/InsightTrendChart.jsx`, `src/data/mockInsightTrend.js`
- **File đã sửa:** `src/components/insight/InsightDetail.jsx`, `src/pages/InsightSettings.jsx`, `src/components/ui/Modal.jsx`
- **Thay đổi:**
  - Tab Cấu hình: inline edit tên cột, prompt, kiểu dữ liệu (Text/True-False/Lựa chọn/Dropdown), options tags, thêm cột mới, lưu vào localStorage
  - InsightTrendChart: Line chart multi-metric theo thời gian, toggle Tuần/Tháng, cross-filter đồng bộ từ các card metrics
  - Auto-fill grid (grid-cols-2 sm:grid-cols-3 xl:grid-cols-4) — không khoảng trống thừa
  - Bảng Chi tiết: 10 hội thoại/page (tăng từ 5)
- **Bug đã fix:**
  - `handleCrossFilter` undefined → restore callback sau khi thêm editing state
  - genWeek data undefined → genSeries() gen đủ 9 keys cho mọi insight
  - Modal không có border → thêm border + shadow-xl vào Modal container
  - NaN "Lần phân tích cuối" → dùng analyzedAt thay vì lastConversation

---

### 2026-03-24 — Track A: Đồng bộ mock data + Filter kích hoạt được
- **Trạng thái:** ✅ Xong
- **File đã sửa:** `src/lib/mockDataService.js`, `src/components/insight/InsightDetail.jsx`
- **Thay đổi:**
  - `mockDataService.js` viết lại hoàn toàn: `computeAnalysisFromConversations(conversations, crossFilter)` — phân tích được tính từ conversations.rows, không còn dùng `mockAnalysisResults` static
  - Filter lọc rows trước khi tính stats → metrics cards update ngay khi filter thay đổi
  - `InsightDetail`: thay `getAnalysis(insightId)` bằng `computeAnalysisFromConversations(conversations, crossFilter)` trực tiếp trong component
  - Kiến trúc mới: conversations = SINGLE SOURCE OF TRUTH — mọi stats đều computed từ rows
- **Còn cần làm:** Regenerate mockConversations để đồng bộ với format mới (sẽ làm ở session tiếp theo)

---

### 2026-03-24 — Track A: Regenerate mockConversations + kiến trúc hoàn thiện
- **Trạng thái:** ✅ Xong
- **File đã tạo:** `src/data/generate-conversations.js` — generator 42 templates × 20 rows
- **File đã sửa:** `src/data/mockConversations.js` — thay bằng file đầy đủ 42 templates (1312 dòng)
- **Thay đổi:**
  - Chạy `node src/data/generate-conversations.js` để regenerate đầy đủ 42 templates × 20 rows
  - Kiến trúc đã hoàn chỉnh: `getConversations(insightId)` → `computeAnalysisFromConversations(conversations, crossFilter)` → `InsightDetail` (filter kích hoạt ngay)
  - `InsightDetailModal.jsx` vẫn import `mockConversations` trực tiếp (legacy file, không được sử dụng ở đâu)
- **Còn cần làm:** Test end-to-end với dev server

---

### 2026-03-24 — Design System: Update to "Editorial Precision"
- **Trạng thái:** ✅ Xong
- **File đã sửa:**
  - `src/index.css` — Viết lại hoàn toàn: new palette (Deep Navy + Deep Rust + Vibrant Blue), surface architecture (6-tier tonal system), ambient shadows (tinted), glassmorphism formula, typography scale utilities (Display/Headline/Title/Body/Label classes), ROAS color system, gradient utilities, scrollbar + selection tinting
  - `src/components/ui/Button.jsx` — Primary = Deep Rust (secondary), Tertiary = Vibrant Blue (tertiary), new ghost-outline variant, 8px radius, ambient shadow, JSDoc design rationale
  - `src/components/ui/Card.jsx` — No borders, surface_container_lowest lift, elevated + ghostBorder props, 8px radius, ambient shadow, JSDoc
  - `src/components/ui/Input.jsx` — surface_container_high track (no border), focus = 2px tertiary bottom-border only (no ring), Textarea added, label-sm typography
  - `src/components/ui/Badge.jsx` — primary_fixed chip variant ("Dark Mode" chip), secondary badge (Deep Rust), tertiary/info badge, JSDoc
  - `src/components/ui/Modal.jsx` — Glass formula: 80% opacity + blur 12px, ambient shadow-xl, ghostBorder prop, 2xl maxWidth
  - `src/components/ui/Tabs.jsx` — Elevated active tab (surface_container_lowest + shadow), 8px radius, px-4 py-2 sizing
  - `src/components/layout/Sidebar.jsx` — Deep Navy (primary) background, gradient-signature logo mark, ghost nav items, Deep Rust AI badge, border-t ghost border
  - `src/components/layout/Header.jsx` — Elevated (surface_container_low + shadow), gradient-signature avatar, text-label-sm subtitle
  - `CLAUDE.md` — Thêm Design System reference table + Session Log entry

---

### 2026-03-24 — Track A: Bổ sung mockup data cho Insight mới (Template + AI)
- **Trạng thái:** ✅ Xong
- **File đã tạo:** `src/lib/mockDataService.js`
- **File đã sửa:** `src/pages/InsightSettings.jsx`, `src/components/insight/InsightDetail.jsx`, `src/components/insight/InsightTrendChart.jsx`
- **Thay đổi:**
  - Tạo `mockDataService.js` — runtime generator tạo mock conversations + analysis + trend data ngay lúc tạo Insight
  - Generator: seed pools theo ngành (7 ngành), smart field inference từ `col.name`, 20 hội thoại mỗi insight
  - Template flow: `handleSaveTemplate` → `generateConversations` → `registerInsightData` → ghi vào module-level registry
  - AI flow: `handleSaveAIScratch` → gen mock data cho từng insight → lưu registry với `ins.id`
  - `InsightDetail`: thay `mockConversations[]` / `mockAnalysisResults[]` bằng `getConversations(insightId)` / `getAnalysis(insightId)` — tự động fallback static → runtime
  - `InsightTrendChart`: viết lại hoàn toàn — detect static `{ week, month, metrics }` vs runtime `[]`, hỗ trợ cả 2 format
  - Insight mới tạo có: conversations table (20 dòng), metrics cards, trend chart 7 ngày
- **Còn cần làm:** Test end-to-end với Custom AI thực tế

---

### 2026-03-24 — Track A: Rà soát & Fix Tab Tổng quan — mỗi template hiển đúng stats của cột mình có
- **Trạng thái:** ✅ Xong
- **File đã sửa:** `src/lib/mockDataService.js`, `src/components/insight/InsightDetail.jsx`
- **Bug đã fix:**
  - `_findFieldByKeywords`: Root cause — keyword `"phone"` không khớp tên column tiếng Việt `"Trạng thái thu thập SĐT"`, dẫn đến card "Thu thập SĐT" luôn = 0. Fix: ưu tiên tìm theo `field` property (tiếng Anh như `phoneStatus`, `isJunk`...) trước, rồi mới fallback keyword matching trên `name`.
  - Card "Mức độ quan tâm" / "Thái độ Sale" hiện 0 cho template Lead Quality vì template đó không có field đó → thêm guard `> 0` để không hiện card rỗng.
  - Card "Khách hàng rác" (Junk Lead) cho Lead Quality templates (spa-2, fsh-2...) không hiện → thêm `topBookingIntents` + `junkNotJunk` vào computed result.
- **Thay đổi:**
  - `_findFieldByKeywords`: 3 bước — (1) tìm field property, (2) tìm column name, (3) fallback data rows
  - Thêm `topBookingIntents` (ý định đặt lịch) cho Spa/BDS/F&B
  - Thêm card "Khách hàng rác" với bar chart cho Lead Quality templates
  - Thêm card "Ý định đặt lịch" cho Spa/BDS/F&B
  - Card guard: `temperature` chỉ hiện khi `hot+warm+cold > 0`, `phoneCollection` chỉ hiện khi có data, `attitude` chỉ hiện khi `good+avg+poor > 0`, `junkNotJunk` chỉ hiện khi `> 0`
- **Verified:** Build OK (2306 modules), logic đúng qua test inline Node.js

---

### 2026-03-24 — Track A: Fix mapping insightId ↔ templateId cho mock data
- **Trạng thái:** ✅ Xong
- **File đã sửa:** `src/components/insight/InsightDetail.jsx`, `CLAUDE.md`
- **Bug đã fix:**
  - Insight seed (`ins-1`, `ins-2`, ...) không hiển thị đúng mock conversations theo template vì lookup theo `insightId` không khớp key data static (`fsh-1`, `mbb-3`, ...)
- **Thay đổi:**
  - `InsightDetail` thêm fallback khi load dữ liệu:
    - ưu tiên `getConversations(insightId)` cho runtime insight mới tạo
    - fallback `getConversations(templateId)` cho insight seed/mock
  - đảm bảo mỗi Template hiển thị đúng bộ dữ liệu mockup riêng

---

### 2026-03-24 — Track A: Fix Tab Tổng Quan đồng bộ với dữ liệu Chi tiết theo từng Template
- **Trạng thái:** ✅ Xong
- **File đã sửa:** `src/lib/mockDataService.js`, `CLAUDE.md`
- **Bug đã fix:**
  - Tab **Tổng Quan** hiển thị metrics giống nhau giữa nhiều template do logic phân tích dùng field cố định và fallback mặc định gây nhiễu (đặc biệt `attitude` bị dồn về “Kém” khi template không có cột này)
- **Thay đổi:**
  - `computeAnalysisFromConversations` refactor theo hướng dynamic field mapping từ `conversations.columns` + dữ liệu thực tế `rows`
  - Áp dụng đồng nhất cho toàn bộ 7 ngành (Fashion, Mẹ & Bé, Mỹ phẩm, Spa, BĐS, F&B, Du lịch)
  - Các nhóm metrics (interest/pain/objection/mistake, phone, sentiment, competitor, attitude, temperature) chỉ tính khi template có field liên quan
  - Bổ sung `topMistakes` để card “Lỗi mất khách” trong Tổng Quan phản ánh đúng dữ liệu Tab Chi tiết
  - Giữ nguyên cơ chế crossFilter filter-reactive

---

### 2026-03-24 — Track A: Supabase DB — Tạo bảng ai_insight_mockup + ai_insight_conversations + Export JSON
- **Trạng thái:** ✅ Xong
- **File đã tạo:**
  - `scripts/supabase-mockup.js` — Tạo bảng `ai_insight_mockup` (46 records) + insert 50 records
  - `scripts/seed-conversations.js` — Tạo bảng `ai_insight_conversations` (2100 records, 42 templates × 50 rows)
  - `scripts/export-conversations.js` — Export toàn bộ 2100 rows → `src/data/supabase-conversations.json` (dùng Supabase REST API `https://db.cdp.vn/rest/v1`)
  - `scripts/debug-parse.js`, `scripts/fix-missing-records.js`
- **File đã sửa:** `src/lib/mockDataService.js`
- **Thay đổi:**
  - Import `supabase-conversations.json` (2100 rows × 42 templates)
  - Thêm `buildColumnsFromRows()` — tự động tạo columns metadata từ field names trong rows
  - `getConversations()`: ưu tiên Supabase JSON > mockConversations static JS
  - `getTrendData()`: ưu tiên Supabase JSON
  - `hasMockData()`: check Supabase JSON
- **Bug đã fix:**
  - MCP untrusted-data parser: `</untrusted-data` bị cắt giữa trong response text → dùng Supabase REST API thay vì MCP để export
- **Verified:** Build OK (2307 modules)

---

### 2026-03-24 — Track A: Tổng quan = Visualization từ conversation data (Supabase JSON)
- **Trạng thái:** ✅ Xong
- **Thay đổi kiến trúc:**
  - `computeAnalysisFromConversations()` nhận data từ Supabase JSON (2100 rows)
  - Tab **Tổng quan**: metrics compute trực tiếp từ `conversations.rows` (đã đúng từ kiến trúc trước)
  - Tab **Chi tiết**: hiển thị `conversations.rows` (đã đúng từ kiến trúc trước)
  - Không cần thay đổi UI code — chỉ cần đổi data source từ static JS → Supabase JSON
- **Verified:** Build OK

---

### 2026-03-26 — Track B: Remove duplicate ExecutiveSummaryCard từ Tổng quan Ads
- **Trạng thái:** ✅ Xong
- **File đã sửa:** `src/pages/AdsDashboard.jsx`
- **Bug đã fix:** `ExecutiveSummaryCard` (Tóm tắt tuần + 3 cột Urgent/Watch/Highlight + Budget Recommendation) bị trùng ở cả 2 page — chỉ nên nằm ở **Gợi ý tối ưu Ads**. Đã bỏ khỏi `AdsDashboard.jsx` và giữ nguyên ở `AdsOptimization.jsx`.

---

### 2026-03-26 — Track A: Đa dạng hóa dữ liệu Supabase (42 templates × 50 rows)
- **Trạng thái:** ✅ Xong + Deploy OK
- **URL:** https://ai-insight-mockup.vercel.app
- **File đã sửa:** `scripts/seed-conversations.js`
- **Bug đã fix:** Seed generator dùng chung `rng` cho tất cả fields → tất cả rows cùng template có cùng giá trị (ví dụ fsh-1 products = "Giày sneaker" cho 50 rows)
- **Thay đổi:**
  - Mỗi field giờ có seed riêng: `sr(rowSeed + fieldOffset * 7919)` (large prime)
  - Field offset khác nhau cho mỗi field đảm bảo picks khác nhau
  - fsh-1 giờ có: 20 products, 11 sizes, 3 temps, 10 pain_points
  - Chạy lại seed 2100 rows → export JSON mới → deploy

---

### 2026-03-26 — Track A: Random row count 50–100/template + đa dạng chart types + deploy
- **Trạng thái:** ✅ Xong + Deploy OK
- **URL:** https://ai-insight-mockup.vercel.app
- **File đã sửa:**
  - `scripts/seed-conversations.js` — `getRowCount(templateId)` deterministic random 50–100/template
  - `scripts/export-conversations.js` — bỏ hardcode total=2100, dùng MAX_TOTAL=6000 + stop on empty
- **Thay đổi:**
  - 3462 records mới: mbb=75, cos=90, spa=89, fsh=87, fb=83, rls=98, trv=55 rows/template
  - Export → `src/data/supabase-conversations.json` (3462 rows × 42 templates)
  - Tái deploy Vercel với data mới
- **Bug đã fix:** `total is not defined` trong export script

---

### 2026-03-27 — Landing Page: Truyền thông sản phẩm + Lead Capture → Supabase ✅ COMPLETE
- **Trạng thái:** ✅ Xong + Build OK (2320 modules) + Supabase live test ✅
- **File đã tạo:**
  - `src/pages/LandingPage.jsx` — Assembles all sections
  - `src/components/landing/HeroSection.jsx` — Gradient Deep Navy, CTA, stats strip, mockup preview
  - `src/components/landing/ProblemSection.jsx` — 3 pain points cards
  - `src/components/landing/SolutionSection.jsx` — 3 features (zigzag layout, glass cards)
  - `src/components/landing/HowItWorksSection.jsx` — 3-step flow với numbered circles
  - `src/components/landing/TestimonialsSection.jsx` — Auto-play carousel, 5 testimonials
  - `src/components/landing/TemplateGallerySection.jsx` — 7 ngành cards grid
  - `src/components/landing/LeadCaptureSection.jsx` — 3-field form → Supabase (Họ tên, Email, 5-star rating)
  - `src/components/landing/Footer.jsx` — Dark footer, trust badges
  - `src/lib/supabaseLanding.js` — Supabase REST API integration (native fetch)
  - `scripts/create-landing-table-mcp.js` — Tạo bảng `landing_leads` qua MCP endpoint
  - `src/data/landingTestimonials.js` — 5 testimonials + stats
  - `src/data/landingTemplates.js` — 7 ngành preview data
  - `.env` — Supabase credentials (đã có trong `.gitignore`)
- **File đã sửa:** `src/App.jsx` — Root route `/` → `<LandingPage />` (standalone, no sidebar); `/insight/*` → AppShell (with sidebar)
- **Supabase Setup:**
  - Bảng `landing_leads` tạo qua MCP (`https://db.cdp.vn/mcp`) bằng `@modelcontextprotocol/sdk`
  - 6 columns: `id (UUID)`, `name (TEXT NOT NULL)`, `email (TEXT NOT NULL)`, `experience_rating (INTEGER 1-5)`, `consent_privacy (BOOLEAN)`, `created_at (TIMESTAMPTZ)`
  - RLS: insert = anon (bypass via service role key), select = authenticated
  - `.env` có `VITE_SUPABASE_URL=https://db.cdp.vn` + `VITE_SUPABASE_SERVICE_KEY`
  - Live test: INSERT → ✅ verified → DELETE cleanup ✅
- **Design System:** Editorial Precision (Deep Navy / Deep Rust / Vibrant Blue / 8px radius / glassmorphism / scroll-reveal animations)
- **Route Architecture:**
  - `/` → LandingPage (full-screen, no sidebar)
  - `/insight/settings` → InsightSettings (with sidebar)
  - `/insight/dashboard` → AdsDashboard (with sidebar)
  - `/insight/ads-optimization` → AdsOptimization (with sidebar)
  - `/insight/insight-dashboard` → InsightDashboard (with sidebar)
- **⚠️ Lưu ý:** `.env` chứa Service Role Key (bypass RLS) — đã có trong `.gitignore`, không push key lên git

---

### 2026-03-27 — Landing Page: Thay mockup = Real AI Insight UI (Hero + 42 Templates)
- **Trạng thái:** ✅ Xong + Build OK (2338 modules)
- **File đã sửa:**
  - `src/components/landing/HeroSection.jsx` — Thay dashboard mockup bằng real components: `OverviewCards` (4 KPI tổng hội thoại/Ads/CvR/Chi tiêu), `ContributionChart` (horizontal bar doanh thu vs chi tiêu), `TrendChart` (7-day FB vs Zalo), `SourceChart` (donut FB vs Zalo)
  - `src/components/landing/TemplateGallerySection.jsx` — Viết lại hoàn toàn: dùng `mockTemplates` 42 templates thật, `CompactTemplateCard` với stats mini-row, `TemplatePreviewModal` với danh sách cột AI + dataType badges, filter tabs theo 7 ngành

### 2026-03-27 — Landing Page: Redesign visual theo MCP Stitch + Smax Insight Blue v2
- **Trạng thái:** ✅ Xong + Build OK (2322 modules)
- **File đã tạo:**
  - `src/components/landing/TopNavBar.jsx` — Top nav fixed glassmorphism theo style reference
  - `src/components/landing/TrustSection.jsx` — Trusted logos + bento testimonial block
- **File đã sửa:**
  - `src/pages/LandingPage.jsx` — thêm `TopNavBar` + `TrustSection` vào layout
  - `src/components/landing/HeroSection.jsx`
  - `src/components/landing/ProblemSection.jsx`
  - `src/components/landing/SolutionSection.jsx`
  - `src/components/landing/HowItWorksSection.jsx`
  - `src/components/landing/TestimonialsSection.jsx`
  - `src/components/landing/TemplateGallerySection.jsx`
  - `src/components/landing/LeadCaptureSection.jsx`
  - `src/components/landing/Footer.jsx`
- **Thay đổi:**
  - Kết nối MCP Stitch project `8841492142454668511` để lấy ngữ cảnh design system/screens
  - Áp visual language **Smax Insight Blue v2** + tham chiếu trực tiếp HTML mẫu user gửi
  - Hero section chỉnh lại phong cách dark premium (nav fixed, badge, CTA hierarchy, dashboard mockup)
  - Thêm Trust section kiểu bento (logo wall + quote card + KPI card)
  - Tinh chỉnh toàn bộ section để đồng bộ typography/spacing/elevation theo phong cách mới
  - Bám trực tiếp screen Stitch: `Smax AI Landing Page Hero` (`677f8139f1574d579ba30d0d5c6df7b4`)
  - Tải reference qua `curl -L`:
    - `stitch-landing-hero.html`
    - `stitch-landing-hero.png`
  - Cải thiện UX form: responsive layout tốt hơn (`flex-col lg:flex-row`) + hover rating mượt hơn
- **Verified:** `npm run build` ✅ (2322 modules)

---

### 2026-03-26 — Track A: Đa dạng hóa chart types trong Tab Tổng quan + 3 block/hàng
- **Trạng thái:** ✅ Xong + Deploy OK
- **URL:** https://ai-insight-mockup.vercel.app
- **File đã sửa:**
  - `src/components/insight/DynamicMetricsGrid.jsx` — viết lại hoàn toàn
  - `src/components/insight/InsightDetail.jsx` — bỏ sidebar, full-width grid
  - `vercel.json` — thêm `"name": "ai-insight-mockup"` để ghép đúng project Vercel
- **Thay đổi:**
  - Layout: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — **3 block/hàng** thay vì 4, cards lớn hơn gấp rưỡi
  - Bỏ sidebar (Cột dữ liệu thông minh + Luồng trực tiếp) → toàn bộ diện tích dành cho metrics grid
  - **6 loại chart types mới:**
    1. **Score Card** — KPI lớn với progress bar + 3 stats row (Đạt / Chưa / Tỉ lệ)
    2. **Donut Chart** — Tỉ lệ True/False với SVG arc + legend buttons clickable
    3. **Gauge Chart** — Mức độ với arc path + mini bar per category (Attitude/Priority/Sentiment)
    4. **Temperature Chart** — 3-bar visualization Nóng/Ấm/Lạnh với summary chips row
    5. **Top List Card** — Horizontal ranked bar với rank badge + fill bar
    6. **Demographics Card** — Chip grid với stacked bar (Gender/Location)
  - Card type detection: dynamic từ `column.dataType` + tên field
- **Bug đã fix:** `as const` TypeScript syntax trong JSX; `Record<string,string>` → plain object
- **Verified:** Build OK (2308 modules) · Deploy OK → `ai-insight-mockup.vercel.app`

---

### 2026-03-27 — Track A: InsightTrendChart — Area/Stacked Bar thay Line chart
- **Trạng thái:** ✅ Xong + Deploy OK
- **URL:** https://ai-insight-mockup.vercel.app
- **File đã sửa:** `src/components/insight/InsightTrendChart.jsx`
- **Thay đổi:**
  - Bỏ **Line chart** (flat y=1 do data count nhỏ mỗi bucket → đường trùng gridline)
  - Thêm **Stacked Bar** làm chart mặc định — chiều cao cột thay đổi theo tổng count mỗi ngày (`stackOffset` không dùng → absolute counts)
  - Giữ **Area Chart** làm lựa chọn thay thế (gradient fill 30%→3% opacity)
  - Toggle: **Cột** (mặc định) | **Vùng**
- **Root cause Line không hiện:** `computeAllSeriesBuckets` cho BĐS (rls-*) — mỗi category ~1-2 rows/day → tất cả bucket values = 1 (minimum) → Recharts Line y=1 trùng gridline đáy → nhìn như flat
- **Bug đã fix:**
  - `dropdownOptions`: chỉ hiện per-column groups khi có `columnSeries` (tránh key mismatch với defaultMetrics)
  - `activeMetrics`: resolve selectedSeries qua `columnSeries` trước để key khớp với bucket data
  - `buildTimeSeriesData` → `computeAllSeriesBuckets`: rewrite hoàn toàn, count ALL series mọi bucket (trước bỏ qua khi `selectedSeries = null`)

---

### 2026-03-28 — Track A: Loại bỏ nhóm bệnh "Rủi Ro Pháp Lý"
- **Trạng thái:** ✅ Xong + Build OK
- **File đã sửa:** `src/lib/medicalService.js`
- **Thay đổi:** Loại bỏ 4 chỗ liên quan `legal-risk`:
  1. `DISEASE_GROUPS[]` — xóa group definition (id: `legal-risk`, code: `PL`)
  2. `SMAX_RECOMMENDATIONS` — xóa 2 gợi ý (`rq-pl-1`, `rq-pl-2`)
  3. `computeDiseaseMetrics()` — xóa `case 'legal-risk'`
  4. `computeScore()` — xóa `case 'legal-risk'`
- **Còn cần làm:** Deploy

---

### 2026-03-27 — Track A: Khám Bệnh UI Revamp (Leads Dashboard + 2/3-1/3 + Tabs)
- **Trạng thái:** ✅ Xong + Build OK (2338 modules) + Deploy OK
- **URL:** https://ai-insight-mockup.vercel.app/insight/medical-checkup
- **File đã tạo:**
  - `src/components/medical/LeadsQualityDashboard.jsx` — Bảng KPI trọng tâm 4 chỉ số: Leads rác, Thu thập SĐT, Chốt đơn, KH cũ quay lại (giá trị + trend 7 ngày + cảnh báo)
  - `src/components/medical/CriticalAlertsPanel.jsx` — Panel cảnh báo khẩn (top metrics nguy hiểm)
  - `src/components/medical/SmaxRecommendationsPanel.jsx` — Panel gợi ý tổng hợp từ Chuyên gia Smax
  - `src/components/medical/ConversationList.jsx` — Danh sách hội thoại cho tab Chi tiết (search/filter/pagination)
  - `src/components/medical/DiseaseItemLayout.jsx` — Per-item layout 2/3 + 1/3 (left card + right panel cùng hạng mục)
- **File đã sửa:**
  - `src/components/medical/MedicalResultStep.jsx` — Refactor từ right panel global → per-item 2/3+1/3 theo từng hạng mục
  - `src/components/medical/DiseaseCard.jsx` — Thêm 2 tab **Tổng quan / Chi tiết** trong mỗi nhóm bệnh, highlight mạnh các chỉ số thấp
  - `src/lib/medicalService.js` — Thêm `computeLeadsKPI`, `getLeadsKPIWithTrend`, `getTopCriticalMetrics`; fix bug `computeMockTrend` (`base is not a function`)
  - `scripts/seed-conversations.js` — Thêm field `is_returning_customer`
  - `src/data/supabase-conversations.json` — Regenerate dữ liệu 3462 rows có `is_returning_customer`
  - `playwright-medical-review.cjs` — Bổ sung kiểm thử E2E flow Khám Bệnh + assert không có console errors
- **Bug đã fix:**
  - Chỉ số Leads trước đó khó hiểu/khó scan → chuyển thành dashboard KPI rõ nghĩa theo business definition
  - Thiếu dữ liệu "KH cũ quay lại" → bổ sung field `is_returning_customer` từ seed/export pipeline
  - Lỗi runtime production trắng trang: `Cannot read properties of null (reading 'useMemo')` (mismatch asset/cache trong thời điểm deploy) → đã verify lại production bằng Playwright, console errors = 0
- **Quy trình QA:** Luôn chạy Playwright trước deploy và smoke test lại production sau deploy
- **Update thêm (2026-03-27):**
  - Mặc định mỗi hạng mục bệnh ở trạng thái **mở rộng** (không còn thu gọn mặc định)
  - Việt hóa + bỏ viết tắt ở panel **Cảnh báo khẩn** (dùng tên đầy đủ hạng mục và nhãn chỉ số tiếng Việt)
  - Bỏ trùng lặp "Smax gợi ý" ở phần 2/3 bên trái; thay bằng **Trending Chart 7 ngày gần nhất** cho từng hạng mục
  - Deploy production mới: `dpl_71RfoDouznzWXgu6qvShfvTsWoRc` → https://ai-insight-mockup.vercel.app
- **Còn cần làm:** PDF export (button đã có, chưa implement)

---

### 2026-03-28 — Track A: Radar Effect Integration — Hero Re-design
- **Trạng thái:** ✅ Xong + Build OK (1948 KB)
- **File đã tạo:**
  - `src/components/ui/RadarEffect.jsx` — Radar scan animation với framer-motion, 8 icon items (MessageSquare, TrendingUp, Users, ShieldCheck, Zap, BarChart3, Phone, Star), gradient sweep, concentric circles
- **File đã sửa:**
  - `src/pages/MedicalCheckupLanding.jsx` — Nhúng `<RadarEffect>` góc phải Hero (opacity 0.35, positioned absolute), Hero layout được wrap với Stats strip trong container div đúng hierarchy
  - `package.json` — Install `framer-motion`
- **Thay đổi:**
  - RadarEffect dùng `lucide-react` thay vì `react-icons` (project không có react-icons)
  - Position: `absolute top-50% right-2% transform translateY(-50%)` — nằm sau dashboard preview (zIndex 0)
  - `itemColor` prop để customize màu theo design token
  - Hero section: thêm wrapper div quanh Stats strip để đúng DOM nesting
- **Bug đã fix:**
  - Duplicate `useScrollReveal()` calls trong `ProblemMedicalSection` map (2 refs trong 1 component)
  - Missing `</div>` closure cho Stats strip wrapper (inserted before `</section>`)
- **Còn cần làm:** Deploy Vercel

---

### 2026-03-28 — Track A: Landing Page "Khám Bệnh Hội Thoại" — Lead Capture
- **Trạng thái:** ✅ Xong + Build OK (2341 modules)
- **File đã tạo:**
  - `src/pages/MedicalCheckupLanding.jsx` — Landing page hoàn chỉnh 7 sections (Hero + Problem + HowItWorks + DiseaseGroups + ResultsPreview + LeadForm + Footer), design Editorial Precision, Supabase lead capture
- **File đã sửa:**
  - `src/App.jsx` — Thêm route `/kham-benh` → `MedicalCheckupLanding`
  - `src/components/landing/TopNavBar.jsx` — Thêm nav link "Khám Bệnh" (NEW badge) trỏ đến `/kham-benh`
- **Thay đổi:**
  - 7 sections theo wireframe PRD: Hero (Health Score preview 6.4/10), Problem (4 triệu chứng dark), How It Works (3 bước), 10 Nhóm Bệnh (grid color-coded severity), Results Preview (3 expert recs với impact), Lead Form (Supabase), Footer
  - Design System: Editorial Precision — Deep Navy / Deep Rust / Vibrant Blue / 8px radius / no-line
  - Lead Form: gửi vào bảng `landing_leads` Supabase, có success state
  - TopNavBar: thêm item "Khám Bệnh" với badge "NEW" màu Deep Rust
- **Bug đã fix:**
  - Duplicate `import { useState }` (đặt thừa giữa file) → gom lên đầu file
  - `../../lib/supabaseLanding` → `../lib/supabaseLanding` (path sai từ `src/pages/`)
  - Syntax error: `}}>` thừa ở `<select>` và `<textarea>` → sửa thành `}>`
- **Còn cần làm:** Deploy Vercel + Smoke test Playwright

---

### 2026-03-28 — Track A: Chi Tiết Hội Thoại — Wireframe 2 Cột + Thu Nhỏ Text
- **Trạng thái:** ✅ Xong + Build OK (2740 modules) + Deploy production ✅
- **URL:** https://ai-insight-mockup.vercel.app/insight/medical-checkup
- **File đã tạo:**
  - `src/data/mockConversationDetails.js` — Mock data: 12–15 conversations/nhóm bệnh, mỗi conv gồm `messages[]` + `evaluation{}` + `actions[]`
  - `src/components/medical/ConversationDetailPanel.jsx` — Component 2 cột hoàn chỉnh (Danh sách | Chi tiết 3 tab)
- **File đã sửa:**
  - `src/components/medical/DiseaseCard.jsx` — Thay `ConversationList` bằng `ConversationDetailPanel` ở tab Chi tiết
- **Thay đổi:**
  - Tab **Chi tiết** giờ hiển thị **2 cột**:
    - Cột Trái (40%): Danh sách hội thoại với search + filter Nóng/Ấm/Lạnh + tags (SĐT, TT, ĐT, Obj)
    - Cột Phải (60%): Chi tiết hội thoại — 3 tab: **Tin nhắn** | **Đánh Giá** | **Hành Động**
  - Tab Tin nhắn: bubbles chat (customer/shop), stats bar, system messages
  - Tab Đánh Giá: AI evaluation (temperature, phone, junk, attitude, sentiment, pain point, objection, mistake, competitor)
  - Tab Hành Động: severity cards (✓ Thành công / → Gợi ý / ⚠ Cảnh báo / ✗ Lỗi) + summary
  - Text sizing: thu nhỏ đồng bộ (`text-[12px]` name, `text-[11px]` preview/time, `text-[10px]` tags/avatar)
- **Bug đã fix:**
  - `ConversationList` cũ không có 2 cột → thay hoàn toàn bằng `ConversationDetailPanel`
  - Avatar: 36px → 24px (list) / 32px (header)
  - Message bubbles: `px-4 py-2.5` → `px-3 py-2`, font `text-body-sm` → `text-[13px]`
  - TempChip counter, Stats bar: giảm size đồng bộ
- **Còn cần làm:** PDF export

---

# ═══════════════════════════════════════
# THƯ MỤC DỰ ÁN (Tổng Hợp)
# ═══════════════════════════════════════

```
d:\vibe-coding\Nâng cấp AI Insight\
├── .claude/
│   ├── agents/                 ← Marketing Agent prompts
│   │   ├── market-research-agent.md
│   │   ├── campaign-strategist-agent.md
│   │   ├── content.md
│   │   └── design-graphic.md
│   └── rules/
├── template-insight.md          ← Nguồn truth cho prompt Insight (Track A)
├── CLAUDE.md                    ← File này
├── vercel.json                 ← SPA rewrite (fix 404 on F5)
├── PRD.md                       ← Product Requirements Document
├── DESIGN.md                    ← Design System ("The Intelligent Canvas")
├── index.html
├── package.json                 ← React 19 + Vite + Recharts + Lucide + framer-motion
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── lib/
    │   ├── utils.js
    │   └── supabaseLanding.js   ← Landing page → Supabase (native fetch, service role key)
    ├── data/
    │   ├── mockTemplates.js         ← 42 template (Track A)
    │   ├── mockConversations.js      ← Chat mẫu (Track A)
    │   ├── mockAnalysisResults.js    ← Kết quả AI mẫu (Track A)
    │   ├── mockCampaigns.js         ← 8 campaigns + daily breakdown (Track B)
    │   ├── mockAIInsights.js         ← AI recommendations (Track B)
    │   ├── mockInsightTrend.js       ← Trend data 7d/30d cho Insight Trend Chart
    │   ├── landingTestimonials.js    ← Landing page: 5 testimonials + stats
    │   └── landingTemplates.js       ← Landing page: 7 ngành preview
    ├── pages/
    │   ├── LandingPage.jsx          ← Landing page (route: /)
    │   ├── MedicalCheckupLanding.jsx ← Landing page Khám Bệnh (route: /kham-benh)
    │   ├── InsightSettings.jsx      ← Track A: Cài đặt Insight
    │   ├── AdsDashboard.jsx         ← Track B: Tổng quan Ads
    │   ├── AdsOptimization.jsx      ← Track B: Gợi ý tối ưu Ads
    │   ├── InsightDashboard.jsx
    │   └── MedicalCheckup.jsx       ← Track A: Khám Bệnh Hội Thoại (5-step wizard)
    └── components/
        ├── layout/                   ← Sidebar, Header, PageContainer
        ├── ui/                      ← Button, Badge, Card, Modal, Input, Toast, Tabs, RadarEffect
        ├── landing/                  ← Hero, Problem, Solution, HowItWorks, Testimonials, TemplateGallery, LeadCapture, Footer
        └── medical/                  ← ConversationFunnelSection, DiseaseCard, DiseaseItemLayout, LeadsQualityDashboard, CriticalAlertsPanel, SmaxRecommendationsPanel, SavedActionsBar, ConversationList, ConversationDetailPanel, HealthScoreHeader, MedicalFilterTabs, FanpageConnectStep, IndustryFormStep, QuantitySelectStep, CrawlProgressStep, ActionRecommendation
        └── insight/
            ├── TemplateLibrary.jsx          ← Track A
            ├── TemplateCard.jsx             ← Track A
            ├── CreateInsightFromScratchModal.jsx ← Track A
            ├── ColumnTemplatePicker.jsx     ← Track A
            ├── InsightTable.jsx            ← Track A
            ├── InsightDetail.jsx            ← Track A (full-page detail view)
            ├── InsightDetailModal.jsx       ← Track A (legacy modal, not used)
            ├── AIInsightPanel.jsx          ← Track A
            ├── InsightTrendChart.jsx       ← Track A: Stacked Bar / Area chart (bỏ Line)
            ├── OverviewCards.jsx           ← Track B
            ├── RevenueCards.jsx            ← Track B
            ├── ContributionChart.jsx       ← Track B
            ├── TrendChart.jsx              ← Track A + B
            ├── SourceChart.jsx             ← Track B
            ├── CampaignTable.jsx           ← Track B
            └── DailyDetailChart.jsx        ← Track B
```

---

### 2026-03-28 — Track A: Smax AI Gợi Ý — Kết nối API thực thay rule-based
- **Trạng thái:** ✅ Xong + Build OK (2348 modules)
- **File đã tạo:**
  - `src/lib/smaxAIService.js` — Streaming wrapper cho Smax AI API (`POST https://smaxai.cdp.vn/api/chat`), build prompt tự động, localStorage cache 24h, clean markdown streaming
- **File đã sửa:**
  - `src/components/medical/SmaxRecommendationsPanel.jsx` — Rewrite hoàn toàn: tab "Hành Động" (rule-based) + tab "AI Gợi Ý" (streaming AI), per-disease expand, loading/error/retry states, cache hit instant display
  - `src/components/medical/DiseaseItemLayout.jsx` — Truyền thêm `industry`, `industryLabel`, `conversations` xuống `SmaxRecommendationsPanel`
  - `src/components/medical/MedicalResultStep.jsx` — Truyền `config.industry` + `industryLabel` xuống `DiseaseItemLayout`
  - `src/lib/medicalService.js` — Thêm `topObjections`/`topMistakes` vào disease object
- **Thay đổi:**
  - API endpoint: `https://smaxai.cdp.vn/api/chat` với `x-api-key: 3a914320759947da9124f10b1b7d53df`
  - Streaming: `response.body.getReader()` + `TextDecoder`, strip `[THINKING]` blocks và markdown artifacts
  - Cache: `smax-rec-{industry}-{diseaseId}` key trong localStorage, 24h TTL, nút "Làm mới" để xóa cache
  - Prompt builder: tự động detect chỉ số yếu từ `disease.metrics`, gắn `topObjections`/`topMistakes` từ `computeTopIssues()`
  - API test: đã verify trả về 3 hành động cụ thể với Smax feature links
- **Còn cần làm:** Deploy Vercel + Playwright smoke test

---

### 2026-03-28 — Track A: Tab Diễn Giải cho Nhóm Bệnh — Text prose thay chart
- **Trạng thái:** ✅ Xong + Build OK (2348 modules)
- **URL:** https://ai-insight-mockup.vercel.app/insight/medical-checkup
- **File đã sửa:**
  - `src/lib/medicalService.js` — Thêm hàm `generateInterpretation(disease)` trả về 4 trường text: `diagnosis` (2 đoạn văn), `keyConcern` (vấn đề nổi bật), `bottomLine` (tóm lại + hành động), `summary` (chips)
  - `src/components/medical/DiseaseCard.jsx` — Thêm component `InterpretationTab` + thêm tab "Diễn giải" giữa "Chi tiết" và cuối; wire `activeTab === 'interpret'`
- **Thay đổi:**
  - Mỗi DiseaseCard giờ có 3 tabs: **Tổng quan** | **Chi tiết** | **Diễn giải**
  - Tab Diễn giải hiển thị prose tiếng Việt (không chart): icon + score header, đoạn chẩn đoán, vấn đề nổi bật (border-left color = severityColor), tóm lại + hành động, summary chips
  - 9 nhóm bệnh đều có diễn giải riêng biệt, context-aware theo từng nhóm (lead-quality, response-speed, staff-performance, competitor, post-purchase, objection-handling, abandoned-chat, tone-language, upsell)
  - Fallback generic interpretation cho bất kỳ nhóm nào
- **Còn cần làm:** Deploy Vercel

---

### Technology Stack

| Layer | Công nghệ |
|-------|-----------|
| Framework | React 19 (SPA) |
| Bundler | Vite 6 |
| Styling | Tailwind CSS v4 + CSS variables (glassmorphism, no-line UI) |
| Charts | Recharts v2 |
| Icons | Lucide React |
| Fonts | Manrope (display) + Inter (body) |
