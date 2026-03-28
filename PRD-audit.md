# PRD — Tính Năng "Khám Bệnh" Hội Thoại

> **Phiên bản:** 1.1 — Approved for Implementation
> **Ngày:** 2026-03-27
> **Tác giả:** AI Assistant (Brainstorming Session)
> **Trạng thái:** ✅ Approved — Implementation Complete
> **Design System:** Editorial Precision (DESIGN.md)

---

## 1. Tổng Quan

### 1.1 Mô tả ngắn
"Khám Bệnh" là tính năng phân tích hội thoại tin nhắn đa kênh → chẩn đoán 10 nhóm vấn đề → đề xuất action khắc phục cụ thể từ **Chuyên gia Smax**. Điểm khác biệt cốt lõi: Hồ sơ bệnh án **cập nhật real-time mỗi ngày** — user nhìn thấy metrics cải thiện khi action đúng → tạo động lực tiếp tục.

### 1.2 Core Loop (Gamification)

```
Khám lần đầu → Xem bệnh → Action theo gợi ý
                                   ↓
                    Ngày hôm sau: Metrics cải thiện ↑↑
                                   ↓
                         User có động lực action tiếp
```

> "Không phải 1 lần chẩn đoán — mà là dashboard sức khỏe liên tục"

### 1.3 Target Users
| Nhóm | Người dùng | Primary Goal |
|------|-----------|-------------|
| A | Chủ shop nhỏ (1-2 nhân viên) | "Tôi đang losing khách ở đâu?" |
| B | Marketing Manager | "Chiến dịch nào đang waste budget?" |
| C | CEO / Chủ doanh nghiệp | "Team tôi có vấn đề gì nghiêm trọng nhất?" |

### 1.4 Luồng chính (5 bước)

```
[Step 1] → [Step 2] → [Step 3] → [Step 4] → [Step 5]
Kết nối   Khai báo   Chọn số   Crawl      Kết quả
Fanpage   Ngành hàng  lượng    Progress   (Dashboard real-time)
```

---

## 2. Dữ Liệu

### 2.1 Nguồn dữ liệu
- **Mockup:** Sử dụng 3,462 conversations từ Supabase JSON (đã có sẵn)
- **3 nhóm thiếu** → mock logic tự tạo verdict dựa trên pattern có sẵn:
  - `Abandoned Chat` (Nhóm 7)
  - `Tone & Language` (Nhóm 8)
  - `Overpromising Risk` (Nhóm 10)

### 2.2 10 Nhóm "Bệnh" (Chẩn đoán)

| # | Nhóm Bệnh | Metrics | Action |
|---|-----------|---------|--------|
| 1 | 📊 **Lead Quality** | Junk lead %, SĐT thu thập, tỉ lệ chốt đơn | Cả chỉ số + Chuyên gia Smax gợi ý |
| 2 | ⏱️ **Phản hồi & Chăm sóc** | Tốc độ phản hồi, remind KH, ưu đãi cá nhân hóa | Cả chỉ số + Chuyên gia Smax gợi ý |
| 3 | 🏆 **Nhân viên tư vấn** | Thái độ, lỗi mất khách, tư vấn đúng | Cả chỉ số + Chuyên gia Smax gợi ý |
| 4 | ⚔️ **Đối thủ cạnh tranh** | Đối thủ nhắc đến, so sánh giá | Cả chỉ số + Chuyên gia Smax gợi ý |
| 5 | 💬 **CSKH & Hậu mua** | Chương trình CSKH, review risk, urgency | Cả chỉ số + Chuyên gia Smax gợi ý |
| 6 | 🎯 **Kịch bản tư vấn** | Objection handling, script follow-up, xử lý khách "bốc hơi" | Cả chỉ số + Chuyên gia Smax gợi ý |
| 7 | 🔁 **Cuộc trò chuyện bỏ dở** | Abandoned chat %, no closure, no final message | Cả chỉ số + Chuyên gia Smax gợi ý |
| 8 | 🎨 **Ngôn ngữ & Cách giao tiếp** | Tone giọng, emoji usage, voice message, đoạn văn quá dài | Cả chỉ số + Chuyên gia Smax gợi ý |
| 9 | 📦 **Upsell / Cross-sell** | Gợi ý sản phẩm bổ sung, upsell lên gói cao, KH ignore rec | Cả chỉ số + Chuyên gia Smax gợi ý |
| 10 | ⚠️ **Rủi ro pháp lý** | Overpromising ("cam kết 100%", "đảm bảo hoàn tiền") | Cả chỉ số + Chuyên gia Smax gợi ý |

---

## 3. Wireframe — Step by Step

*(Sử dụng Design System: Deep Navy / Deep Rust / Vibrant Blue / 8px radius / no-line rule / Glassmorphism / Manrope + Inter typography)*

---

### Step 1 — Kết nối Fanpage (Mockup UI)

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]                                                   │
│                                                              │
│  🏥  KHÁM BỆNH HỘI THOẠI                                   │
│  ─────────────────────────────────────────────────────       │
│                                                              │
│  Bước 1/4: Kết nối Fanpage                                  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  [✓ Done  ]  │  │ [○ Active ]  │  │ [  Pending]  │       │
│  │  Kết nối    │  │  Ngành hàng  │  │  Số lượng    │       │
│  │  Fanpage    │  │              │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │     [  Logo FB  ]   Kết nối Fanpage của bạn           │  │
│  │                                                        │  │
│  │     Nhấn "Kết nối" để bắt đầu phân tích              │  │
│  │     hội thoại từ các trang mạng xã hội               │  │
│  │                                                        │  │
│  │         [ 🔗 Kết nối Fanpage ]                        │  │
│  │                                                        │  │
│  │     ✅ Hiện tại chỉ là mockup — chưa kết nối thật     │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

> **Hành vi:** Nhấn nút → 2-3s loading → tự động chuyển Step 2

---

### Step 2 — Khai báo Ngành hàng + Nhóm KH

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]                                                   │
│                                                              │
│  🏥  KHÁM BỆNH HỘI THOẠI                                   │
│  ─────────────────────────────────────────────────────       │
│                                                              │
│  Bước 2/4: Khai báo ngành hàng                              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  [✓ Done  ]  │  │ [○ Active ]  │  │ [  Pending]  │       │
│  │  Kết nối    │  │  Ngành hàng  │  │  Số lượng    │       │
│  │  Fanpage    │  │              │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
│  Ngành hàng của bạn *                                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Thời trang                                    [▼]     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Nhóm đối tượng khách hàng                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Mô tả ngắn về nhóm KH mà shop đang hướng đến...       │  │
│  │                                                        │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│                          [ Tiếp tục → ]                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

> **Ngành hàng options:** Thời trang, Mẹ và Bé, Mỹ phẩm, Spa/Thẩm mỹ, Bất động sản, F&B, Du lịch

---

### Step 3 — Chọn số lượng hội thoại

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]                                                   │
│                                                              │
│  🏥  KHÁM BỆNH HỘI THOẠI                                   │
│  ─────────────────────────────────────────────────────       │
│                                                              │
│  Bước 3/4: Chọn số lượng hội thoại                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  [✓ Done  ]  │  │  [✓ Done  ]  │  │ [○ Active ]  │       │
│  │  Kết nối    │  │  Ngành hàng  │  │  Số lượng    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
│  Chọn số lượng hội thoại gần nhất để khám bệnh             │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │            │  │            │  │            │            │
│  │   1,000   │  │   5,000   │  │   10,000   │            │
│  │ hội thoại │  │ hội thoại │  │ hội thoại │            │
│  │           │  │           │  │           │            │
│  │  ~1 phút  │  │  ~5 phút  │  │  ~10 phút  │            │
│  │  crawl    │  │  crawl    │  │  crawl    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│       (O)              ( )             ( )                  │
│                                                              │
│  ⚠️ Thời gian crawl ước tính dựa trên tốc độ thực tế         │
│                                                              │
│                          [ Bắt đầu Khám → ]                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

> **Hành vi:** Chọn 1 option → nhấn button → chuyển Step 4

---

### Step 4 — Màn hình Crawl Progress

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  🏥  Đang thu thập & phân tích hội thoại...                │
│                                                              │
│  ════════════════════════════════════════════════════       │
│  ║███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║       │
│  ════════════════════════════════════════════════════       │
│                                                              │
│  📊  Đã xử lý:  4,521 / 10,000 hội thoại                  │
│  ⏱️  Còn lại:   ~6 phút 30 giây                            │
│  📈  Tiến độ:   45%                                         │
│                                                              │
│  ─────────────────────────────────────────────────────       │
│                                                              │
│  🏥  Các "bệnh" đang được phân tích:                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ✅ Lead Quality              ─────────────── Done       │  │
│  │ ✅ Nhân viên tư vấn          ─────────────── Done       │  │
│  │ ✅ Đối thủ cạnh tranh        ─────────────── Done       │  │
│  │ ◉ Phản hồi & CSKH           ═══════════    60%        │  │
│  │ ○ Kịch bản tư vấn           ─────────────── Pending    │  │
│  │ ○ Upsell / Cross-sell        ─────────────── Pending    │  │
│  │ ○ Cuộc trò chuyện bỏ dở    ─────────────── Pending    │  │
│  │ ○ Ngôn ngữ & Cách giao tiếp ─────────────── Pending    │  │
│  │ ○ Rủi ro pháp lý            ─────────────── Pending    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  🔄  Đang phân tích nhóm "Phản hồi & CSKH"...              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

> **Hành vi:** Tự động chuyển Step 5 khi progress = 100%

---

### Step 5 — Kết quả Khám Bệnh (Real-time Dashboard)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [← Khám lại]            🏥 HỒ SƠ BỆNH ÁN                            │
│                           ───────────────────────────────────────        │
│  📅 Hôm nay               🔄 Đang theo dõi: +42 cuộc mới hôm nay       │
│  27/03/2026, 14:32        ⏱️ Cập nhật real-time mỗi ngày              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ⚠️ ĐIỂM SỨC KHỎE TỔNG QUAN:  6.2 / 10                                │
│  ────────────────────────────────────────────────────────────────────    │
│  [████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  CẢNH BÁO         │
│  ▲ +0.3 so với 26/03      ↓ Junk Lead ↓ Phản hồi nhanh hơn            │
│                                                                          │
│  📅 So sánh:  [Hôm qua] [3 ngày] [7 ngày] [Từ đầu tháng]              │
│  📋 Lọc theo nhóm:                                                       │
│  [Tất cả] [Lead] [CS] [NV] [ĐT] [KH] [KB] [BD] [NN] [US] [PL]         │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────      │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  🔴 BỆNH 1: Tỉ lệ Junk Lead cao bất thường                      │   │
│  │  Nhóm: Lead Quality     Mức độ: NẶNG     Điểm: 2.1/10          │   │
│  │  ▲ +5% junk hôm nay vs tuần trước                               │   │
│  │  ───────────────────────────────────────────────────────────────  │   │
│  │  📊 Metrics:  Junk Lead 42% | SĐT thu thập 23% | Chốt đơn 18%  │   │
│  │  ───────────────────────────────────────────────────────────────  │   │
│  │  👨‍⚕️ Chuyên gia Smax gợi ý:                                      │   │
│  │  • Thêm câu hỏi sàng lọc vào ad creative để giảm junk 20%       │   │
│  │  • Script phản hồi nhanh: hỏi "Bạn muốn tìm hiểu sản phẩm gì?"  │   │
│  │  ───────────────────────────────────────────────────────────────  │   │
│  │  [Xem chi tiết 47 cuộc hội thoại]    [Lưu hành động ✓]        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  🟡 BỆNH 2: Tốc độ phản hồi chậm trung bình 23 phút            │   │
│  │  Nhóm: Phản hồi & CSKH   Mức độ: TBÌNH  Điểm: 4.8/10          │   │
│  │  ▼ -3 phút so với tuần trước (↓ tốt)                            │   │
│  │  ───────────────────────────────────────────────────────────────  │   │
│  │  📊 Metrics:  TB phản hồi 23p | Remind KH 12% | Ưu đãi 8%       │   │
│  │  ───────────────────────────────────────────────────────────────  │   │
│  │  ✅ ĐÃ ACTION: Auto-reply 2p — đang cải thiện ↓                   │   │
│  │  👨‍⚕️ Chuyên gia Smax gợi ý thêm:                                  │   │
│  │  • Đặt KPI: phản hồi < 10 phút (giờ hành chính)                │   │
│  │  [Xem chi tiết]    [Lưu hành động ✓]                            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ... (8 bệnh còn lại — sắp xếp nặng → nhẹ)                            │
│                                                                          │
│  ══════════════════════════════════════════════════════════════════      │
│  📌 TỔNG HỢP HÀNH ĐỘNG ĐÃ LƯU (3 actions)                             │
│  [1. Auto-reply 2p ✓ đang cải thiện]  [+2 chưa action]                 │
│  ══════════════════════════════════════════════════════════════════      │
│                                                                          │
│  [Xuất báo cáo PDF]        [🔄 Khám lại với bộ lọc khác]               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

> **Real-time tracking:** Mỗi ngày, hồ sơ cập nhật thêm dữ liệu hội thoại mới → User thấy metrics thay đổi (↑↓) so với ngày trước. Khi action được lưu → hiện badge "Đang cải thiện ↓" kèm delta. Đây là gamification loop — cải thiện = động lực tiếp tục.

---

### Wireframe — Card bệnh mở rộng (khi click "Xem chi tiết")

```
┌──────────────────────────────────────────────────────────────────┐
│  🔴 BỆNH 1: Tỉ lệ Junk Lead cao bất thường — MỞ RỘNG          │
│  ───────────────────────────────────────────────────────────     │
│                                                                  │
│  📊 BIỂU ĐỒ & CHỈ SỐ                                           │
│  ┌─────────────────┐  Junk Lead %:  ████████████░░░  42%       │
│  │   [Donut Chart] │  SĐT thu thập: █████░░░░░░░░  23%       │
│  │     42% Junk    │  Tỉ lệ chốt:   ████░░░░░░░░░  18%       │
│  │     58% Good    │                                         │
│  └─────────────────┘  ▲ +8% so với TB ngành Thời trang        │
│                                                                  │
│  👨‍⚕️ CHUYÊN GIA SMAX GỢI Ý HÀNH ĐỘNG                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. [HIGH] Thêm câu hỏi sàng lọc vào ad creative          │  │
│  │    Tác động ước tính: ↓ junk 20%                         │  │
│  │                                          [Chọn ✓]          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ 2. [HIGH] Script phản hồi nhanh trong 5p đầu            │  │
│  │    Tác động ước tính: ↑ chốt đơn 15%                     │  │
│  │                                          [Chọn ✓]          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ 3. [MEDIUM] Auto-reply với template tin nhắn             │  │
│  │    Tác động ước tính: ↑ phản hồi 30%                    │  │
│  │                                          [Chọn ✓]          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  💬 VÍ DỤ HỘI THOẠI ĐẠI DIỆN                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Khách: "Tôi muốn hỏi về sp"  [Junk - không rep lại]   │  │
│  │ Khách: "ádasdad"               [Junk - tự động ads]    │  │
│  │ Khách: "sp nào đẹp nhất"      [Junk - quá chung chung]│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                              [Thu gọn ▲]        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Design Specifications

### 4.1 Tuân thủ DESIGN.md ("Editorial Precision")

| Element | Design Rule (DESIGN.md) | Áp dụng trong PRD |
|---------|------------------------|-------------------|
| Primary Color | `#1A2138` Deep Navy | Header, Sidebar, authority surfaces |
| Secondary | `#BF3003` Deep Rust | Primary CTA, "bệnh nặng" badges, urgency |
| Tertiary | `#0052FF` Vibrant Blue | Active states, links, progress |
| Surface | `#fcf8fb` warm off-white | Page background |
| No-Line Rule | Tonal shifts thay vì 1px borders | Card separation by surface_container levels |
| Radius | 8px DEFAULT | Tất cả cards, buttons, inputs |
| Elevation | Ambient shadows (tinted, not black) | Floating elements |
| Glass | 80% opacity + backdrop-blur 12px | Modal overlays, floating panels |
| Font Display | Manrope Bold | Headers, Disease names, scores |
| Font Body | Inter Regular | Metrics, descriptions |
| Font Label | Inter SemiBold, All-Caps, +5% letter-spacing | Badges, tags, filter tabs |

### 4.2 Disease Severity Colors

| Mức độ | Màu (Semantic) | Hex |
|--------|---------------|-----|
| Nặng (Điểm 0-3) | Deep Rust | `#BF3003` |
| Trung bình (3.1-6) | Vibrant Blue | `#0052FF` |
| Nhẹ (6.1-10) | Emerald Green | `#059669` |

### 4.3 Typography Scale

| Class | Font | Weight | Size | Use |
|-------|------|--------|------|-----|
| `display-lg` | Manrope | Bold | 3.5rem | Điểm sức khỏe tổng quan |
| `headline-md` | Manrope | Bold | 1.5rem | Tên bệnh |
| `title-sm` | Manrope | SemiBold | 1rem | Section headers |
| `body-md` | Inter | Regular | 0.875rem | Metrics, descriptions |
| `label-sm` | Inter | SemiBold | 0.6875rem | Badges, tabs, tags |

---

## 5. Decision Log

| # | Quyết định | Thay thế | Lý do |
|---|-----------|---------|--------|
| 1 | Dùng 3,462 conversations cũ + mock logic cho 3 nhóm thiếu | Tạo mockup mới hoàn toàn | Tiết kiệm thời gian; missing data → hiển thị "Cần thu thập thêm" là hợp lý |
| 2 | 5-step wizard flow | Single-page SPA | Wizard dễ hiểu cho user mới, có sense of progress |
| 3 | Bỏ phần Lỗi trong Crawl Progress | Hiện error count + retry | Không cần cho mockup |
| 4 | Priority Queue cho results (nặng → nhẹ) | Tab riêng từng nhóm | CEO scan trong 30 giây |
| 5 | Mỗi bệnh có cả metrics + Chuyên gia Smax action | Chỉ metrics hoặc chỉ action | Cả 3 user groups đều cần cả 2 |
| 6 | Filter tabs theo nhóm bệnh | Dropdown filter | Clickable tabs nhanh hơn |
| 7 | Mockup only cho Fanpage connection | Kết nối thật | Yêu cầu của user |
| 8 | 10 nhóm bệnh (5 gốc + 5 thêm) | Giữ 5 nhóm | Đủ phạm vi cho MVP |
| 9 | **Real-time daily tracking** | Static 1-time report | Gamification loop — cải thiện metrics tạo động lực action |
| 10 | **"Chuyên gia Smax"** thay vì AI | Dùng AI thật | Không dùng AI, dùng chuyên gia Smax phân tích |
| 11 | PDF export đầy đủ (metrics + actions + ví dụ) | Chỉ summary | Đầy đủ để user present cho team/sếp |

---

## 6. Các File đã Implementation ✅

| File | Vai trò | Status |
|------|---------|--------|
| `src/lib/medicalService.js` | Logic chẩn đoán + mock Smax + crawl simulation + localStorage | ✅ |
| `src/pages/MedicalCheckup.jsx` | Trang chính — wizard 5 bước | ✅ |
| `src/components/medical/FanpageConnectStep.jsx` | Step 1 — Mockup Fanpage connect | ✅ |
| `src/components/medical/IndustryFormStep.jsx` | Step 2 — Khai báo ngành hàng | ✅ |
| `src/components/medical/QuantitySelectStep.jsx` | Step 3 — Chọn số lượng | ✅ |
| `src/components/medical/CrawlProgressStep.jsx` | Step 4 — Progress + bệnh list | ✅ |
| `src/components/medical/MedicalResultStep.jsx` | Step 5 — Real-time Dashboard | ✅ |
| `src/components/medical/DiseaseCard.jsx` | Card bệnh (thu gọn + mở rộng) | ✅ |
| `src/components/medical/MedicalFilterTabs.jsx` | Filter tabs theo nhóm bệnh | ✅ |
| `src/components/medical/HealthScoreHeader.jsx` | Điểm sức khỏe + comparison bar | ✅ |
| `src/components/medical/ActionRecommendation.jsx` | Chuyên gia Smax action card | ✅ |
| `src/components/medical/SavedActionsBar.jsx` | Thanh tổng hợp actions đã lưu | ✅ |
| `src/data/supabase-conversations.json` | 3,462 conversations (đã có) | ✅ |
| `PRD-audit.md` | File PRD này | ✅ |

### File đã sửa (implementation)
| File | Thay đổi |
|------|----------|
| `src/App.jsx` | Thêm route `/insight/medical-checkup` |
| `src/components/layout/Sidebar.jsx` | Thêm nav item "Khám Bệnh" (Stethoscope icon) |
| `src/components/ui/Button.jsx` | Primary = Deep Rust (#BF3003) |
| `CLAUDE.md` | Cập nhật Session Log |

### File đã bổ sung (UI Revamp 2026-03-27)
| File | Vai trò |
|------|---------|
| `src/components/medical/LeadsQualityDashboard.jsx` | Dashboard KPI trọng tâm cho Chất lượng Leads (4 chỉ số business) |
| `src/components/medical/CriticalAlertsPanel.jsx` | Khối Cảnh báo khẩn ở panel 1/3 |
| `src/components/medical/SmaxRecommendationsPanel.jsx` | Khối Gợi ý chuyên gia Smax ở panel 1/3 |
| `src/components/medical/ConversationList.jsx` | Tab Chi tiết trong từng nhóm bệnh (hội thoại đầy đủ) |

### File đã cập nhật (UI Revamp 2026-03-27)
| File | Thay đổi |
|------|----------|
| `src/components/medical/MedicalResultStep.jsx` | Refactor sang per-item layout: mỗi hạng mục bệnh có cấu trúc 2/3 (tabs/chỉ số/chart) + 1/3 (Cảnh báo/Gợi ý Smax); mặc định mở rộng tất cả hạng mục |
| `src/components/medical/DiseaseCard.jsx` | Thêm 2 tab mỗi nhóm bệnh: **Tổng quan** / **Chi tiết**; thay block gợi ý Smax bên trái bằng **Trending Chart 7 ngày** |
| `src/components/medical/DiseaseItemLayout.jsx` | Component mới ghép DiseaseCard + right panel theo từng hạng mục |
| `src/components/medical/CriticalAlertsPanel.jsx` | Bỏ viết tắt mã nhóm (US/PL/...) trong danh sách cảnh báo; hiển thị tên hạng mục đầy đủ + nhãn chỉ số Việt hóa |
| `src/lib/medicalService.js` | Bổ sung compute KPI Leads + trend mock 7 ngày + top critical metrics; fix `computeMockTrend` runtime bug |
| `scripts/seed-conversations.js` | Bổ sung field `is_returning_customer` |
| `src/data/supabase-conversations.json` | Regenerate 3462 rows có `is_returning_customer` |
| `playwright-medical-review.cjs` | Script E2E flow Khám Bệnh để verify UI + console errors trước/sau deploy |

### QA / Release
- Playwright E2E verified trước deploy (flow Step 1 → Step 5, console errors = 0)
- Production deploy: https://ai-insight-mockup.vercel.app (deployment id: `dpl_71RfoDouznzWXgu6qvShfvTsWoRc`)

---

## 7. Assumptions (Giả định)

- Mockup không cần kết nối Fanpage thật
- Dữ liệu crawl "thành công 100%" — không có error state
- Chuyên gia Smax gợi ý được mock từ rule-based logic, không cần call AI API
- "Nhóm đối tượng KH" ở Step 2 là mô tả đơn giản, không ảnh hưởng logic phân tích
- Hồ sơ bệnh án lưu vào localStorage — user có thể xem lịch sử khám (lần 1 vs lần 2 so sánh cải thiện)
- Real-time update: mỗi ngày thêm dữ liệu → metrics thay đổi delta (↑↓) so với ngày trước
- PDF export đầy đủ: metrics + Chuyên gia Smax actions + ví dụ hội thoại

---

## 8. Open Questions (Đã giải quyết ✅)

- ✅ Bệnh nào hiển thị đầu tiên? → **Nặng nhất lên trên** (Điểm thấp nhất)
- ✅ User có thể lưu Hồ sơ bệnh án? → **Có** — lưu localStorage, xem lịch sử
- ✅ PDF export bao gồm gì? → **Đầy đủ** (metrics + Chuyên gia Smax actions + ví dụ)

---

## 9. Wireframe Options — Health Score Header (2026-03-28)

> 3 phương án bố cục để cải thiện phần "Điểm Sức Khỏe Tổng Quan"
> Vấn đề hiện tại: 10 nhóm bệnh viết tắt (US, NV, KH...) khiến user không hiểu

---

### Option A — Bố cục NGANG (Giữ nguyên), bỏ tắt

```
┌──────────────────────────────────────────────────────────────────────┐
│  ĐIỂM SỨC KHỎE TỔNG QUAN                     28/03/2026  01:02  │
│                                                                       │
│  6.8 / 10   [CẦN CẢI THIỆN]          ⚠️ Upsell / Cross-sell (4.6) │
│               ▲ 0.1 (so với lần khám trước)                          │
│  ────────────────────────────────────────────────────────────────     │
│  [██████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]   │
│  Nghiêm trọng                                                     Tốt │
│                                                                       │
│  ĐÓNG GÓP THEO NHÓM BỆNH                                          │
│  ────────────────────────────────────────────────────────────────     │
│  Chất Lượng Nguồn Lead │ Nhân Viên Tư Vấn │ CSKH & Hậu Mua │ ...  │
│  ████████████ 10.0  │ ████████░░ 4.8⚠️  │ ██████████░░ 6.4  │      │
│  (xanh)            │ (đỏ)              │ (trung bình)    │        │
│                                                                       │
│  ● Cần cải thiện (< 5)  ● Tốt (≥ 7.5)  ● Trung bình             │
└──────────────────────────────────────────────────────────────────────┘
```

**Ưu điểm:** Giữ layout hiện tại, chỉ thay label tắt → tên đầy đủ
**Nhược điểm:** 10 label dài, chiếm nhiều chỗ → có thể phải wrap thành 2 dòng

---

### Option B — CHIA 2 CỘT (Score | Nhóm bệnh)

```
┌──────────────────────────────────────────────────────────────────────┐
│  ĐIỂM SỨC KHỎE TỔNG QUAN                     28/03/2026  01:02  │
│                                                                       │
│  ┌─────────────────────────┐  ┌──────────────────────────────────┐  │
│  │                         │  │  ĐÓNG GÓP THEO NHÓM BỆNH       │  │
│  │    6.8 / 10            │  │                                  │  │
│  │    [CẦN CẢI THIỆN]    │  │  ████████████ Chất Lượng Lead   │  │
│  │    ▲ 0.1               │  │  10.0 ████████████████████ (xanh)│  │
│  │                         │  │                                  │  │
│  │  [████████████░░░░░░]   │  │  ████████░░░░ Nhân Viên Tư Vấn │  │
│  │  Nghiêm trọng    Tốt   │  │  4.8 ████████████░░░░░ (đỏ) ⚠️ │  │
│  │                         │  │                                  │  │
│  │  ⚠️ Upsell/Cross-sell  │  │  ██████████░░░░ CSKH & Hậu Mua │  │
│  │     điểm thấp nhất     │  │  6.4 ██████████████░░░░░░        │  │
│  └─────────────────────────┘  │  ... (7 nhóm còn lại, yếu→tốt)  │  │
│       (cột trái ~35%)         │  ● Cần cải thiện  ● Tốt  ● TB   │  │
│                                └──────────────────────────────────┘  │
│                                    (cột phải ~63%)                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Ưu điểm:** Score nổi bật bên trái, nhóm bệnh có không gian rộng hiển thị tên đầy đủ
**Nhược điểm:** Chiếm nhiều chiều cao hơn (2 cột thay vì 1 hàng bars)

---

### Option C — HYBRID (Score + Chip nhóm yếu + Mini bars)

```
┌──────────────────────────────────────────────────────────────────────┐
│  ĐIỂM SỨC KHỎE TỔNG QUAN                     28/03/2026  01:02  │
│                                                                       │
│  6.8 / 10   [CẦN CẢI THIỆN]          ⚠️ Upsell/Cross-sell (4.6)   │
│               ▲ 0.1                                                      │
│  [██████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]   │
│  Nghiêm trọng                                                     Tốt │
│                                                                       │
│  ĐÓNG GÓP THEO NHÓM BỆNH                                            │
│                                                                       │
│  ⚠️ Cần cải thiện:                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐                  │
│  │ Upsell/Cross-sell    │  │ Nhân Viên Tư Vấn    │                  │
│  │ ██████████░░░░ 4.6  │  │ ██████████░░░░ 4.8  │                  │
│  │ [Xem chi tiết →]     │  │ [Xem chi tiết →]     │                  │
│  └──────────────────────┘  └──────────────────────┘                  │
│                                                                       │
│  ✅ Tốt nhất:                                                            │
│  Chất Lượng Lead ████████████████████ 10.0 (xanh)                   │
│                                                                       │
│  📊 Tất cả nhóm (click → scroll đến bệnh):                          │
│  [LQ 10.0] [NV 4.8⚠️] [KH 6.4] [BD 6.4] [NN 7.1] [PL 7.2]        │
│  [KB 7.4]   [RS 7.4]   [ĐT 8.6]  [US 4.6⚠️]                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Ưu điểm:** Ưu tiên hiển thị nhóm YẾU trước (card nhỏ), nhóm TỐT gọn, click card → scroll đến disease card
**Nhược điểm:** Layout phức tạp hơn, nhiều vùng

---

### Option D — Radar Chart (10 nhóm bệnh)

```
┌──────────────────────────────────────────────────────────────────────┐
│  ĐIỂM SỨC KHỎE TỔNG QUAN                     28/03/2026  01:02  │
│                                                                       │
│  ┌─────────────────────────────────┐  ┌────────────────────────────┐ │
│  │                                 │  │   ĐIỂM SỐ & TRẠNG THÁI  │ │
│  │        ĐT ─── LQ               │  │                            │ │
│  │        /\    /\               │  │     6.8 / 10              │ │
│  │      RS/  \  /  \ĐT          │  │     [CẦN CẢI THIỆN]      │ │
│  │      (7.4)\/    \(8.6)       │  │     ▲ 0.1                  │ │
│  │            \   NV/            │  │                            │ │
│  │      KB ──\/── PL            │  │  [██████████████░░░░░░░] │ │
│  │     (7.2) /\  (7.1)          │  │  Nghiêm trọng        Tốt │ │
│  │         /  \                  │  │                            │ │
│  │    NN(7.1)  US(4.6)⚠️        │  │  ⚠️ YẾU NHẤT:             │ │
│  │         \  /                  │  │  • Upsell/Cross-sell (4.6) │ │
│  │      KH(5.4)                  │  │  • Nhân Viên Tư Vấn (4.8) │ │
│  │                                 │  │  [Xem chi tiết →]         │ │
│  │  ● Đỏ < 5  ● Vàng 5-7  ● Xanh ≥ 7.5 │  └────────────────────────────┘ │
│  └─────────────────────────────────┘                                │
│          (Radar chart ~40%)              (Score + Actions ~60%)     │
└──────────────────────────────────────────────────────────────────────┘
```

**Ưu điểm:** Radar cho cái nhìn TỔNG QUAN một lượt — hình polygon cho biết ngay nhóm nào lõm (yếu) vs nhô ra (tốt). Score + action list bên cạnh cho chi tiết.
**Nhược điểm:** Radar khó đọc giá trị chính xác. Cần Recharts RadarChart.

---

### Option E — 3 CỘT (Score | Nhóm yếu | Nhóm tốt)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ĐIỂM SỨC KHỎE TỔNG QUAN                          28/03/2026  01:02  │
│                                                                          │
│  ┌──────────────┐  ┌─────────────────────────────────┐  ┌────────────┐  │
│  │              │  │  ⚠️  CẦN CẢI THIỆN (2 nhóm)    │  │  ✅ TỐT   │  │
│  │   6.8 / 10  │  │                                   │  │  (1 nhóm) │  │
│  │              │  │  Upsell / Cross-sell   ████░ 4.6│  │            │  │
│  │  [CẦN CẢI  │  │  Nhân Viên Tư Vấn     ████░ 4.8│  │ ████████  │  │
│  │   THIỆN]    │  │  [Xem chi tiết →]  [Xem →]     │  │ LQ  10.0  │  │
│  │              │  │                                   │  │            │  │
│  │  ▲ 0.1      │  │  ── Trung bình (7 nhóm) ──       │  │            │  │
│  │              │  │  CSKH & Hậu Mua  ██████░ 6.4   │  │            │  │
│  │  [██████░░░]│  │  Kịch Bản Tư Vấn  ██████░ 7.2  │  │            │  │
│  │  Nghiêm Tốt │  │  ... (5 nhóm còn lại, thu gọn) │  │            │  │
│  └──────────────┘  └─────────────────────────────────┘  └────────────┘  │
│    (cột 1 ~25%)     (cột 2 ~50%)                          (cột 3 ~22%)  │
└──────────────────────────────────────────────────────────────────────────┘
```

**Ưu điểm:** Phân tách rõ 3 nhóm: Cần cải thiện / Trung bình / Tốt. Scan 3 giây hiểu ngay: điểm tổng + nhóm nào kéo tụt + nhóm nào tốt.
**Nhược điểm:** Chiếm nhiều chiều rộng, cột phải hẹp nếu screen nhỏ.

---

### Đề xuất: ~~Option B~~ → **Option E** ✅ ĐÃ CHỌN

- **E ✅** — 3 cột: Score | Cần cải thiện + Trung bình | Tốt. Phân tách rõ yếu/tốt, dễ prioritize hành động.

**Lý do:** Cột trái tập trung vào **điểm số tổng** (scan nhanh), cột phải hiển thị đầy đủ **tên nhóm bệnh** (đọc hiểu được), scrollbar nếu vượt viewport.

## 10. Còn cần làm

- [ ] **PDF Export** — implement `window.print()` hoặc `html2pdf.js` để xuất báo cáo đầy đủ (metrics + actions + ví dụ hội thoại)
