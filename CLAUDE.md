# CLAUDE.md — Dự Án AI Insight

## Tổng Quan

**Tên dự án:** Bộ Template AI Insight — Phân tích hội thoại đa kênh theo ngành

**Mục tiêu:** AI Engine phân tích dữ liệu từ các đoạn hội thoại đa kênh (Facebook, Zalo, Website Chat...) và trả về các trường dữ liệu có cấu trúc (structured data fields) dựa trên prompt được cấu hình sẵn theo từng ngành.

**Cấu trúc:** 7 ngành × 6 insight = 42 template. Mỗi insight gồm 2–5 cột (field/prompt) có kiểu dữ liệu cố định.

---

## Cấu Trúc Các Ngành & Insight

### Các nhóm ngành

| # | Ngành | Key Insight | Đặc thù nổi bật |
|---|-------|------------|-----------------|
| 1 | Thời trang (Fashion) | Lead Temperature, Competitor, Retargeting | Size, mùa, hàng real/fake |
| 2 | Mẹ và Bé (Mother & Baby) | Safety Concern, Baby Age, Bulk Interest | An toàn sản phẩm, tuổi bé |
| 3 | Mỹ phẩm / Làm đẹp (Cosmetics) | Skin Type, Ingredient Concern, Real/Fake | Da dầu/khô/nhạy cảm, K-beauty |
| 4 | Spa / Thẩm mỹ (Beauty Salon) | Treatment Type, Booking Intent, Before-After | Liệu trình, bác sĩ, đặt lịch |
| 5 | Bất động sản (Real Estate) | Legal Status, Budget, Site Visit | Pháp lý, sổ đỏ/sổ hồng, cò mồi |
| 6 | F&B — Nhà hàng / Ăn uống | Booking/Delivery Intent, Food Review | Đặt bàn, giao hàng, app delivery |
| 7 | Tư vấn Du lịch (Travel) | Destination, OTA Competitor, Deposit Intent | OTA, visa, đặt cọc |

### 6 Insight theo ngành (pattern chung)

Mỗi ngành đều có 6 insight theo pattern nhất quán:

1. **Phân Tích Nhu Cầu Khách Hàng** — Sản phẩm, Pain Point, Lead Temperature
2. **Đánh Giá Chất Lượng Nguồn Lead (Ads)** — Junk Lead, SĐT thu thập, Objection, Ads Source
3. **Đánh Giá Nhân Viên Tư Vấn** — Thái độ tư vấn, Lỗi mất khách
4. **Phân Tích Chân Dung Khách Hàng** — Giới tính, Location, Budget, Customer Segment
5. **Phân Tích Đối Thủ Cạnh Tranh** — Competitor mentioned, Tên, Tiêu chí so sánh
6. **Phân Tích Hậu Mua / Chăm Sóc Sau Mua** — Post-purchase intent, Urgency, Review risk

---

## Kiểu Dữ Liệu Của Các Cột (Field Types)

Mỗi cột prompt có một kiểu dữ liệu cố định, AI cần tuân thủ:

| Kiểu | Mô tả | Ví dụ |
|------|--------|-------|
| `True / False` | Boolean trả lời đúng/sai | Junk Lead, Bức xúc |
| `Short Text` | Văn bản ngắn dưới 12 chữ | Sản phẩm, Pain Point |
| `Single Choice` | 1 lựa chọn trong dropdown | Lead Temperature, Giới tính |
| `Multi-tag / Dropdown` | 1 hoặc nhiều tag | Objection, Tiêu chí so sánh |

---

## Các Trường Dữ Liệu Quan Trọng (Key Fields)

### Lead Temperature (Nhiệt độ lead) — Dùng chung cho tất cả ngành
- **Nóng:** Chủ động hỏi giá, xin SĐT, hỏi "còn không", hỏi mua ngay
- **Ấm:** Đang tư vấn, hỏi thêm nhưng chưa chốt
- **Lạnh:** Hỏi 1 câu rồi im, từ chối, seen không rep

### Junk Lead (Khách rác) — Dùng chung
- True khi: khách gửi tin tự động từ ads rồi không rep, chat không liên quan, bấm nhầm
- Ngược lại → False

### Objection (Rào cản chốt đơn) — Khác nhau theo ngành
- **Thời trang:** Giá đắt, Phí ship, Không có size, Hàng fake
- **Mẹ và Bé:** Lo ngại an toàn, Hỏi chồng
- **Mỹ phẩm:** Lo ngại hàng fake, Hỏi về thành phần
- **BDS:** Pháp lý chưa rõ, Ngân sách không xác nhận
- **F&B:** Quá xa, Không có chi nhánh gần
- **Du lịch:** So sánh với OTA (Traveloka/Agoda)

### Priority Escalation — Cần xử lý KHẨN cấp
- **Thời trang/F&B/Du lịch:** Review xấu, dọa bóc phốt
- **Mẹ và Bé:** Khiếu nại an toàn sản phẩm (sức khỏe con)
- **Mỹ phẩm:** Khiếu nại dị ứng, phản ứng da
- **Spa/Thẩm mỹ:** Phản ứng bất lợi sau dịch vụ
- **BDS:** Khiếu nại chất lượng xây dựng, pháp lý

---

## Luật Xử Lý Quan Trọng

### Từ ngữ tiêu cực → Bức xúc = True
- Từ: "tức", "dọa", "kiện", "bóc phốt", "đăng review xấu", "hoàn tiền", "trả hàng"
- Đặc biệt nghiêm trọng khi liên quan đến sức khỏe / an toàn

### Từ ngữ tích cực → Giới thiệu được = True
- Từ: "giới thiệu bạn", "quay lại", "review tốt", "khen", "sẽ ủng hộ"

### Single Choice quy tắc
- Khi khách hỏi nhiều thứ → chọn tiêu chí nổi bật nhất / mới nhất
- Khi không đề cập → trả về giá trị mặc định: "Không xác định" / "Không đề cập"

### Ngưỡng phân loại Lead Temperature
- **Nóng:** Có ít nhất 2+ tín hiệu chốt (hỏi giá + hỏi còn hàng + để lại SĐT)
- **Lạnh:** Chỉ 1 câu hỏi + seen không rep, HOẶC từ chối trực tiếp

---

---

## Dashboard Ads — Metrics & Components

Dashboard Ads phục vụ **CEO/CMO** — scan trong 3 giây, không cần click.

### Layout (thứ tự từ trên xuống)

```
1. Junk alert banner          ← Tự động đếm campaign có aiAction = 'decrease' / 'pause'
2. OverviewCards (4 cards)     ← Tổng hội thoại / Từ Ads / Chuyển đổi / Chi tiêu
3. RevenueCards (2 cards)     ← Doanh thu Portfolio + ROAS trung bình
4. ContributionChart           ← Horizontal bar: Doanh thu vs Chi tiêu theo chiến dịch
5. TrendChart + SourceChart    ← Xu hướng 7 ngày + Donut FB vs Zalo
6. CampaignTable (11 cột)      ← Chi tiết từng chiến dịch
   └─ DailyDetailChart          ← Slide in khi click dòng → 7 ngày Revenue/Orders/ROAS
```

### Các file Dashboard

| File | Vai trò |
|---|---|
| `src/pages/AdsDashboard.jsx` | Layout chính, lắp ghép tất cả components |
| `src/components/insight/RevenueCards.jsx` | 2 card: Doanh thu Portfolio + ROAS trung bình |
| `src/components/insight/ContributionChart.jsx` | Horizontal stacked bar — mức đóng góp từng chiến dịch |
| `src/components/insight/DailyDetailChart.jsx` | 7 ngày chi tiết (Revenue + Orders area + ROAS line + Hòa vốn) |
| `src/components/insight/CampaignTable.jsx` | 11 cột: chiến dịch / chi tiêu / hội thoại / chuyển đổi / **doanh thu** / **ROAS** / **đơn** / chất lượng / AI gợi ý / hành động |
| `src/data/mockCampaigns.js` | Chứa `revenue`, `ordersCount`, `mockDailyBreakdown` (8×7=56 data points), `mockOverviewStats` |

### Mã màu ROAS (nhất quán xuyên suốt)

| ROAS | Màu | Ý nghĩa |
|---|---|---|
| ≥ 3× | `#059669` xanh | Tốt — scale được |
| ≥ 1.5× | `#d97706` vàng | Cải thiện — theo dõi |
| < 1.5× | `#dc2626` đỏ | Thấp — cần xem xét |

### Key fields trong Campaign Model

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

### Daily Breakdown (mockDailyBreakdown)

```js
{
  'camp-1': [
    { date: '15/03', revenue, spend, ordersCount, roas },
    // 7 ngày × 8 campaigns
  ]
}
```

> **Lưu ý:** `date` trong `mockDailyBreakdown` phải khớp chính xác với `mockConversationTrend` (`'15/03'` → `'21/03'`)

### Ngưỡng màu cho DailyDetailChart ROAS Line
- Dùng `avgRoas` của 7 ngày để quyết định màu line (không dùng ngưỡng cứng)
- Luôn render `<ReferenceLine y={1}>` với label `"Hòa vốn"` — điểm neo quyết định kinh doanh

---

## Những Điều Cần Nhớ Khi Làm Việc

- **Template đang sống:** File `template-insight.md` là nguồn truth. Bất kỳ thay đổi nào về prompt/column đều phải cập nhật vào file này.
- **Thêm ngành mới:** Cần tuân theo cấu trúc 6 insight × 4-5 column. Copy pattern từ ngành gần nhất, điều chỉnh Objection và Priority theo đặc thù ngành.
- **Tiếng Việt:** Tất cả prompt, output, field name đều là tiếng Việt. Không dịch.
- **Context cần thiết khi gọi AI:** Khi phân tích một đoạn chat, cần truyền vào: (1) Tên ngành, (2) Các prompt tương ứng với insight được chọn, (3) Kiểu dữ liệu của từng field.
- **Không hallucinate:** AI chỉ trích xuất thông tin có trong đoạn chat. Nếu không có → trả giá trị mặc định (Không xác định / Không đề cập / False).

---

## Thư Mục Dự Án

```
d:\vibe-coding\Nâng cấp AI Insight\
├── template-insight.md          ← Nguồn truth cho tất cả prompt Insight
├── CLAUDE.md                    ← File này
├── PRD.md                       ← Product Requirements Document
├── DESIGN.md                    ← Design System ("The Intelligent Canvas")
├── index.html
├── package.json                 ← React 19 + Vite + Tailwind v4 + Recharts + Lucide
└── src/
    ├── pages/
    │   ├── AdsDashboard.jsx         ← Dashboard Ads (nâng cấp mới nhất)
    │   └── InsightSettings.jsx      ← Template library + insight management
    ├── components/
    │   ├── insight/
    │   │   ├── OverviewCards.jsx       ← 4 KPI tổng quan
    │   │   ├── RevenueCards.jsx         ← 2 KPI: Doanh thu + ROAS (MỚI)
    │   │   ├── ContributionChart.jsx    ← Horizontal bar chart (MỚI)
    │   │   ├── TrendChart.jsx          ← 7-day FB vs Zalo area chart
    │   │   ├── SourceChart.jsx         ← Donut chart
    │   │   ├── CampaignTable.jsx       ← 11 columns (nâng cấp)
    │   │   ├── DailyDetailChart.jsx    ← 7-day detail panel (MỚI)
    │   │   └── ...
    │   └── ui/ / layout/              ← Shared components
    ├── data/
    │   ├── mockCampaigns.js           ← 8 campaigns + mockDailyBreakdown
    │   ├── mockAIInsights.js           ← AI recommendations per campaign
    │   └── ...
    └── lib/
        └── utils.js                    ← formatCurrency, formatRoas, formatCompact...
```

### Technology Stack

| Layer | Công nghệ |
|---|---|
| Framework | React 19 (SPA) |
| Bundler | Vite 6 |
| Styling | Tailwind CSS v4 + CSS variables (glassmorphism, no-line UI) |
| Charts | Recharts v2 |
| Icons | Lucide React |
| Fonts | Manrope (display) + Inter (body) |
