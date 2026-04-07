# PRD — Insight v3: Cài Đặt Insight Theo Template

> **Phiên bản:** 3.0
> **Phục vụ:** Track A — Cài Đặt Insight
> **Owner:** Tuấn
> **Trạng thái:** Active Development
> **Cập nhật lần cuối:** 2026-04-07
> **Thay thế:** PRD.md gốc (Phase 1)

---

## 1. Tổng Quan

### 1.1 Mục tiêu

AI Engine phân tích hội thoại đa kênh (Facebook Messenger, Zalo OA, Website Chat...) → trả về **structured data fields** theo prompt được cấu hình sẵn theo từng ngành. Mỗi doanh nghiệp chỉ cần chọn ngành → hệ thống tự sinh 6 insight chuẩn → thời gian cài đặt **dưới 2 phút**.

### 1.2 Bài toán hiện tại

| Vấn đề | Hậu quả |
|---------|---------|
| Người dùng mới phải tự nghĩ ra các trường dữ liệu cần phân tích | Mất 10–20 phút, dễ bỏ cuộc |
| Không có chuẩn ngành → mỗi người cấu hình khác nhau | Không so sánh được benchmark giữa các doanh nghiệp |
| AI phân tích không nhất quán giữa các ngành | Objection, Priority Escalation khác nhau không đúng đặc thù |

### 1.3 Giải pháp

**Hệ thống Template 7 ngành × 6 insight = 42 template sẵn dùng.**

- Người dùng chọn ngành → hệ thống tự sinh 6 insight theo đúng pattern ngành
- Mỗi insight gồm 2–5 cột (field/prompt) có kiểu dữ liệu cố định
- AI nhận đoạn chat → trả về nhiều dòng structured data (mỗi dòng = 1 conversation × 1 insight × N columns)
- Luật xử lý (Lead Temperature, Junk Lead, Objection, Priority Escalation) khác nhau theo ngành

---

## 2. Tầm Scope

### 2.1 In Scope (Track A)

- [x] Template Library — thư viện 42 template theo ngành
- [x] Insight Settings — cấu hình, tạo mới, chỉnh sửa template
- [x] AI Engine — phân tích chat → structured fields theo prompt ngành
- [x] Data Types — 4 kiểu field: True/False, Short Text, Single Choice, Multi-tag/Dropdown
- [x] Dynamic Metrics Grid — tự sinh chart types từ data type
- [x] Insight Detail — Tổng quan / Cấu hình / Chi tiết
- [x] AI tạo Insight — gọi Custom AI (token.ai.vn) sinh insight mới
- [x] Supabase integration — lưu trữ template + conversations

### 2.2 Out of Scope

- Khám Bệnh Hội Thoại (Track A-2) — tách riêng
- Dashboard Ads (Track B) — tách riêng
- Marketing Team Agents (Track C) — tách riêng
- Real-time crawl từ Fanpage — mockup / simulation

---

## 3. Mô Hình Dữ Liệu

### 3.1 Template Model

```js
{
  id: string,                    // "fsh-1", "mbb-3", "cos-5"
  industry: string,              // "fashion" | "mother-baby" | "cosmetics" | "spa" | "real-estate" | "fb" | "travel"
  industryLabel: string,         // "Thời trang" | "Mẹ và Bé" | ...
  insightType: string,            // "lead-analysis" | "lead-quality" | "staff-eval" | "customer-profile" | "competitor" | "post-purchase"
  insightLabel: string,           // "Phân Tích Nhu Cầu KH" | ...
  prompt: string,                // system prompt cho AI
  columns: Column[],              // danh sách cột
  rowCount: number,               // số dòng conversations đã phân tích
  lastAnalyzedAt: string | null,  // ISO timestamp
  isCustom: boolean               // template tự tạo hay từ thư viện
}
```

### 3.2 Column Model

```js
{
  id: string,
  name: string,                   // "Sản phẩm", "Lead Temperature"
  field: string | null,           // internal key: "temperature", "phoneStatus"
  prompt: string,                 // AI prompt để extract field này
  dataType: 'true_false' | 'short_text' | 'single_choice' | 'multi_tag'
  options: string[] | null        // dropdown options (cho single_choice / multi_tag)
}
```

### 3.3 Conversation Row Model

```js
{
  customerName: string,
  platform: 'facebook' | 'zalo' | 'website' | 'other',
  timestamp: string,
  [columnKey: string]: any         // dynamic fields từ template columns
}
```

### 3.4 Data Types

| `dataType` | Mô tả | Ví dụ |
|------------|--------|--------|
| `true_false` | Boolean trả lời đúng/sai | Junk Lead, Bức xúc, Giới thiệu được |
| `short_text` | Văn bản ngắn dưới 12 chữ | Sản phẩm, Pain Point, Size |
| `single_choice` | 1 lựa chọn trong dropdown | Lead Temperature, Giới tính, Mức độ hài lòng |
| `multi_tag` | 1 hoặc nhiều tag | Objection, Tiêu chí so sánh |

---

## 4. Cấu Trúc 42 Template

### 4.1 7 Ngành

| # | `industry` | `industryLabel` | Key Insight đặc thù |
|---|-----------|-----------------|-------------------|
| 1 | `fashion` | Thời trang | Size, mùa, hàng real/fake |
| 2 | `mother-baby` | Mẹ và Bé | Safety Concern, Baby Age, Bulk Interest |
| 3 | `cosmetics` | Mỹ phẩm / Làm đẹp | Skin Type, Ingredient Concern, Real/Fake |
| 4 | `spa` | Spa / Thẩm mỹ | Treatment Type, Booking Intent, Before-After |
| 5 | `real-estate` | Bất động sản | Legal Status, Budget, Site Visit |
| 6 | `fb` | F&B — Nhà hàng / Ăn uống | Booking/Delivery Intent, Food Review |
| 7 | `travel` | Tư vấn Du lịch | Destination, OTA Competitor, Deposit Intent |

### 4.2 6 Insight Pattern Chung (Áp Dụng Mọi Ngành)

| # | `insightType` | `insightLabel` | Mục đích |
|---|-------------|---------------|----------|
| 1 | `lead-analysis` | Phân Tích Nhu Cầu KH | Nắm bắt khách đang muốn gì |
| 2 | `lead-quality` | Đánh Giá Chất Lượng Nguồn Lead | Junk Lead, SĐT thu thập, Objection, Ads Source |
| 3 | `staff-eval` | Đánh Giá Nhân Viên Tư Vấn | Thái độ tư vấn, Lỗi mất khách |
| 4 | `customer-profile` | Phân Tích Chân Dung KH | Giới tính, Location, Budget, Segment |
| 5 | `competitor` | Phân Tích Đối Thủ Cạnh Tranh | Competitor mentioned, Tên, Tiêu chí so sánh |
| 6 | `post-purchase` | Phân Tích Hậu Mua / Chăm Sóc Sau Mua | Post-purchase intent, Urgency, Review risk |

### 4.3 Chi Tiết 42 Template — Thời Trang (Fashion)

```
fsh-1: Phân Tích Nhu Cầu KH Thời Trang
  ├── Sản phẩm (short_text)
  ├── Size quan tâm (short_text)
  ├── Mức độ quan tâm / Lead Temperature (single_choice: Nóng/Ấm/Lạnh)
  └── Nhu cầu cốt lõi / Pain Point (short_text)

fsh-2: Đánh Giá Chất Lượng Nguồn Lead Thời Trang
  ├── Junk Lead (true_false)
  ├── Trạng thái thu thập SĐT (single_choice: Đã cho/Chưa cho/Từ chối)
  ├── Rào cản chốt đơn (multi_tag: Giá đắt/Phí ship/Không có size/Hàng fake/...)
  └── Nguồn Ads (single_choice: Facebook Ads/Zalo Ads/TikTok Ads/Không rõ)

fsh-3: Đánh Giá Nhân Viên Tư Vấn Thời Trang
  ├── Thái độ tư vấn (single_choice: Tốt/Trung bình/Kém)
  ├── Kịch bản bán hàng (single_choice: Tư vấn chi phí/Khai thác thông tin/Ưu đãi cá nhân hóa/Giải quyết vấn đề)
  ├── Chốt đơn thành công (true_false)
  ├── Bỏ sót hội thoại (true_false)
  └── Khách im lặng (true_false)

fsh-4: Phân Tích Chân Dung KH Thời Trang
  ├── Giới tính (single_choice: Nam/Nữ/Không rõ)
  ├── Khu vực (short_text)
  ├── Khoảng ngân sách (short_text)
  └── Phân loại KH (single_choice: Khách mới/Khách quen/Khách hoàn tiền)

fsh-5: Phân Tích Đối Thủ Thời Trang
  ├── Có nhắc đến đối thủ (true_false)
  ├── Tên đối thủ (short_text)
  └── Tiêu chí so sánh (multi_tag: Giá cả/Chất lượng/Phong cách/Hàng real/...)

fsh-6: Phân Tích Nhu Cầu Mua Lại Thời Trang
  ├── Phân loại mục đích tin nhắn (single_choice: Hỏi đơn/Xin đổi trả/Hỏi sp mới/Khác)
  ├── Mức độ hài lòng (single_choice: Hài lòng/Trung bình/Không HL)
  └── Khách giới thiệu được (true_false)
```

> Các ngành còn lại (Mẹ & Bé, Mỹ phẩm, Spa, BĐS, F&B, Du lịch) có cấu trúc tương tự với Objection và Priority theo đặc thù ngành. Xem chi tiết tại `template-insight.md`.

---

## 5. Luật Xử Lý Quan Trọng

### 5.1 Lead Temperature — Dùng chung mọi ngành

| Level | Tín hiệu | Ngưỡng |
|-------|---------|--------|
| **Nóng** | Hỏi giá + xin SĐT + hỏi "còn không" + hỏi mua ngay | ≥ 2 tín hiệu |
| **Ấm** | Đang tư vấn, hỏi thêm nhưng chưa chốt | — |
| **Lạnh** | 1 câu + seen không rep, HOẶC từ chối trực tiếp | — |

### 5.2 Junk Lead — Dùng chung mọi ngành

- **True** khi: khách gửi tin tự động từ ads rồi không rep, chat không liên quan, bấm nhầm
- Ngược lại → **False**

### 5.3 Objection — Khác nhau theo ngành

| Ngành | Objection đặc thù |
|-------|-----------------|
| Thời trang | Giá đắt, Phí ship, Không có size, Hàng fake |
| Mẹ và Bé | Lo ngại an toàn, Hỏi chồng |
| Mỹ phẩm | Lo ngại hàng fake, Hỏi về thành phần |
| Bất động sản | Pháp lý chưa rõ, Ngân sách không xác nhận |
| F&B | Quá xa, Không có chi nhánh gần |
| Du lịch | So sánh với OTA (Traveloka/Agoda) |

### 5.4 Priority Escalation — Xử lý KHẨN cấp

| Ngành | Trigger cảnh báo khẩn |
|-------|----------------------|
| Thời trang/F&B/Du lịch | Review xấu, dọa bóc phốt |
| Mẹ và Bé | Khiếu nại an toàn sản phẩm (sức khỏe con) |
| Mỹ phẩm | Khiếu nại dị ứng, phản ứng da |
| Spa/Thẩm mỹ | Phản ứng bất lợi sau dịch vụ |
| Bất động sản | Khiếu nại chất lượng xây dựng, pháp lý |

### 5.5 Từ Ngữ Xử Lý

| Từ ngữ | Label |
|---------|-------|
| `tức`, `dọa`, `kiện`, `bóc phốt`, `đăng review xấu`, `hoàn tiền`, `trả hàng` | **Bức xúc = True** |
| `giới thiệu bạn`, `quay lại`, `review tốt`, `khen`, `sẽ ủng hộ` | **Giới thiệu được = True** |

---

## 6. Luồng Người Dùng

### 6.1 Tạo mới Insight từ Template

```
1. User vào /insight/settings
2. Click "Tạo Insight Mới"
3. Chọn ngành (7 cards grid)
   → Hệ thống hiện 6 insight mẫu của ngành (preview)
4. Click "Sử dụng Template" → tạo 6 insight cùng lúc
   HOẶC
4. Click "Tạo từ đầu" → modal CreateInsightFromScratchModal
   HOẶC
4. Click "Tạo bằng AI" → gọi Custom AI sinh insight mới
5. Insight mới xuất hiện trong Template Library
6. Click row → vào Insight Detail (3 tabs: Tổng quan / Cấu hình / Chi tiết)
```

### 6.2 Xem Kết Quả Phân Tích

```
1. Tab Tổng quan:
   → KPI tổng hợp (Junk Lead %, Lead Nóng/Ấm/Lạnh, Phone Collection %, ...)
   → Dynamic Metrics Grid (6 chart types tự sinh từ data type)
   → Insight Trend Chart (Cột / Vùng — toggle)
   → Cross-filter: click card → chart update

2. Tab Cấu hình:
   → Inline edit: tên cột, prompt, kiểu dữ liệu, options
   → Thêm / Xóa cột
   → Lưu vào localStorage (template tùy biến)

3. Tab Chi tiết:
   → Search + filter
   → Bảng conversations (10 dòng/trang)
   → Mỗi dòng = 1 hội thoại × N columns
```

---

## 7. Kiến Trúc Kỹ Thuật

### 7.1 Trang chính

| Route | File | Mô tả |
|-------|------|--------|
| `/insight/settings` | `src/pages/InsightSettings.jsx` | Layout chính — Template Library + insight management |

### 7.2 Components

| File | Vai trò |
|------|---------|
| `src/components/insight/TemplateLibrary.jsx` | Thư viện template, lọc theo ngành/insight |
| `src/components/insight/TemplateCard.jsx` | Card template, preview prompt + columns |
| `src/components/insight/CreateInsightFromScratchModal.jsx` | Modal tạo insight mới từ đầu |
| `src/components/insight/ColumnTemplatePicker.jsx` | Chọn kiểu cột (field type) khi tạo insight |
| `src/components/insight/InsightTable.jsx` | Bảng hiển thị insight với columns |
| `src/components/insight/InsightDetail.jsx` | Full-page detail: Tổng quan / Cấu hình / Chi tiết |
| `src/components/insight/InsightDetailModal.jsx` | Modal chi tiết insight (legacy) |
| `src/components/insight/AIInsightPanel.jsx` | Panel AI phân tích chat |
| `src/components/insight/DynamicMetricsGrid.jsx` | Tự sinh chart types từ data type (6 types) |
| `src/components/insight/InsightTrendChart.jsx` | Stacked Bar / Area chart (toggle) |

### 7.3 Data Layer

| File | Vai trò |
|------|---------|
| `src/data/mockTemplates.js` | Danh sách 42 template (7 ngành × 6 insights) |
| `src/data/mockConversations.js` | Dữ liệu chat mẫu |
| `src/data/mockAnalysisResults.js` | Kết quả phân tích AI mẫu |
| `src/data/supabase-conversations.json` | Supabase export — 3,000+ rows × 42 templates |
| `src/lib/mockDataService.js` | Generator conversations + analysis + trend data |
| `src/lib/aiService.js` | Custom AI (token.ai.vn) integration |

### 7.4 AI Service (`src/lib/aiService.js`)

```js
// System prompt theo pattern ngành
// Input: đoạn chat hội thoại
// Output: JSON structured data theo template columns

// 3 cách tạo Insight:
1. Template có sẵn     → chọn ngành → 6 insight tự sinh
2. Từ đầu             → CreateInsightFromScratchModal → chọn cột
3. Custom AI          → gọi token.ai.vn → sinh insight mới
```

### 7.5 Dynamic Metrics Grid — 6 Chart Types

| `dataType` → `detectCardType` | Chart | Mô tả |
|-------------------------------|-------|--------|
| `true_false` | `DonutChart` | SVG donut True/False |
| `temperature` / `single_choice` (3 options) | `TemperatureCard` | 3-bar Nóng/Ấm/Lạnh |
| `short_text` + keyword match `size\|sản phẩm\|pain` | `BarChart` | Top-N ranking horizontal bar |
| `short_text` + keyword match `location\|khu vực\|giới tính` | `ChipGrid` | Demographics chip + stacked bar |
| `channel` / platform | `ChannelDonut` | SVG donut FB/Zalo/Others |
| `single_choice` + 2 options | `DonutChart` | Binary donut |
| keyword match `scenario\|kịch bản` | `ScenarioBarsCard` | Bar chart chốt đơn theo scenario |
| keyword match `score\|rating` | `GaugeCard` | Semi-arc gauge |
| keyword match `top` \| count > 3 | `ScoreCard` | KPI lớn + progress bar |

---

## 8. Non-Goals

- Không có real-time crawl từ Fanpage/Zalo (mockup simulation)
- Không có attribution model nâng cao (không map Ad ID → conversation)
- Không tự động sinh chart từ user prompt tự do (chỉ từ structured columns)
- Không tạo insight không thuộc 6 pattern chung (nếu cần → tạo từ đầu)

---

## 9. Success Metrics

| Metric | Mục tiêu |
|--------|----------|
| Time-to-value | < 2 phút tạo insight mới |
| Template adoption | > 60% user dùng template có sẵn |
| Chart coverage | Mọi template đều có ≥ 1 chart type phù hợp |
| Supabase data | ≥ 3,000 rows × 42 templates |
| Build size | < 2,400 modules |

---

## 10. Roadmap

| Phase | Nội dung | Trạng thái |
|-------|---------|-----------|
| v1 | Template Library cơ bản + 42 templates + Insight Detail | ✅ Hoàn thành |
| v2 | AI tạo Insight (Custom AI) + Dynamic Metrics Grid v2 | ✅ Hoàn thành |
| v3 (hiện tại) | Enrich seed data + 15 new fields + Staff Eval scenarios + CEO Dashboard | ✅ Hoàn thành |
| v4 | Supabase real integration + PDF export + Smax AI integration | 🔄 Tiếp theo |

---

## 11. References

| Document | Mô tả |
|---------|--------|
| `template-insight.md` | Nguồn truth cho prompt & column specs |
| `CLAUDE.md` | Track definitions, file inventory, luật chung |
| `PRD.md` | PRD gốc (Phase 1 + Phase 2 Overview) |
| `DESIGN.md` | Design System "Editorial Precision" |
