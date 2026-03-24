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

## 🎯 HAI TRACK ĐỘC LẬP

### Track A — Cài Đặt Insight (Insight Settings)
### Track B — Dashboard Ads (Ads Dashboard)

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
3. ExecutiveSummaryCard       ← CEO 3-second scan (urgent / watch / highlight)
4. RevenueCards + PlatformROASCard + CostPerQualityLeadCard
5. ContributionChart         ← Horizontal bar: Doanh thu vs Chi tiêu theo chiến dịch
6. RevenueSpendTrendChart + SourceChart
7. CampaignSummaryTable (8 cột)
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
# LUẬT CHUNG — ÁP DụNG CẢ 2 TRACK
# ═══════════════════════════════════════

- **Tiếng Việt:** Tất cả prompt, output, field name đều là tiếng Việt. Không dịch.
- **Không hallucinate:** Chỉ trích xuất thông tin có trong dữ liệu. Không có → giá trị mặc định.
- **Không nhảy track:** Mỗi session chỉ làm 1 track. Muốn chuyển → kết thúc session hiện tại, báo cáo, rồi bắt đầu track mới.
- **Template đang sống:** `template-insight.md` là nguồn truth cho Track A. Mọi thay đổi prompt/column phải cập nhật vào file này.

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

# ═══════════════════════════════════════
# THƯ MỤC DỰ ÁN (Tổng Hợp)
# ═══════════════════════════════════════

```
d:\vibe-coding\Nâng cấp AI Insight\
├── template-insight.md          ← Nguồn truth cho prompt Insight (Track A)
├── CLAUDE.md                    ← File này
├── vercel.json                 ← SPA rewrite (fix 404 on F5)
├── PRD.md                       ← Product Requirements Document
├── DESIGN.md                    ← Design System ("The Intelligent Canvas")
├── index.html
├── package.json                 ← React 19 + Vite + Tailwind v4 + Recharts + Lucide
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── lib/
    │   └── utils.js
    ├── data/
    │   ├── mockTemplates.js         ← 42 template (Track A)
    │   ├── mockConversations.js      ← Chat mẫu (Track A)
    │   ├── mockAnalysisResults.js    ← Kết quả AI mẫu (Track A)
    │   ├── mockCampaigns.js         ← 8 campaigns + daily breakdown (Track B)
    │   ├── mockAIInsights.js         ← AI recommendations (Track B)
    │   └── mockInsightTrend.js       ← Trend data 7d/30d cho Insight Trend Chart
    ├── pages/
    │   ├── InsightSettings.jsx      ← Track A: Cài đặt Insight
    │   ├── AdsDashboard.jsx         ← Track B: Tổng quan Ads
    │   └── AdsOptimization.jsx      ← Track B: Gợi ý tối ưu Ads
    └── components/
        ├── layout/                   ← Sidebar, Header, PageContainer
        ├── ui/                      ← Button, Badge, Card, Modal, Input, Toast, Tabs
        └── insight/
            ├── TemplateLibrary.jsx          ← Track A
            ├── TemplateCard.jsx             ← Track A
            ├── CreateInsightFromScratchModal.jsx ← Track A
            ├── ColumnTemplatePicker.jsx     ← Track A
            ├── InsightTable.jsx            ← Track A
            ├── InsightDetail.jsx            ← Track A (full-page detail view)
            ├── InsightDetailModal.jsx       ← Track A (legacy modal, not used)
            ├── AIInsightPanel.jsx          ← Track A
            ├── InsightTrendChart.jsx       ← Track A: Line chart Tuần/Tháng
            ├── OverviewCards.jsx           ← Track B
            ├── RevenueCards.jsx            ← Track B
            ├── ContributionChart.jsx       ← Track B
            ├── TrendChart.jsx              ← Track A + B
            ├── SourceChart.jsx             ← Track B
            ├── CampaignTable.jsx           ← Track B
            └── DailyDetailChart.jsx        ← Track B
```

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
