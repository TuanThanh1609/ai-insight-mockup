# Master Design Document — AI Insight / Social CDP

> **Phiên bản:** 2.0 — Updated 2026-03-29
> **Dự án:** AI Insight — Khám Bệnh Hội Thoại / Social & AI CDP
> **Nguồn:** `DESIGN.md` (Editorial Precision) + PPTX Proposal + Social Media Assets + PRD-audit.md
> **Trạng thái:** ✅ Active — Sử dụng cho mọi tài sản marketing

---

## MỤC LỤC

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Hệ Sinh Thái Sản Phẩm](#2-hệ-sinh-thái-sản-phẩm)
3. [Design System: Editorial Precision](#3-design-system-editorial-precision)
4. [Brand Identity](#4-brand-identity)
5. [Foundation: Màu Sắc & Typo](#5-foundation-màu-sắc--typo)
6. [Layout & Spatial System](#6-layout--spatial-system)
7. [Components & Visual Patterns](#7-components--visual-patterns)
8. [Kênh & Tài Sản Marketing](#8-kênh--tài-sản-marketing)
9. [Template Library](#9-template-library)
10. [Brand Voice & Tone](#10-brand-voice--tone)
11. [Asset Specifications](#11-asset-specifications)

---

## 1. Tổng Quan Dự Án

### 1.1 Sản Phẩm Chính

**AI Insight — Khám Bệnh Hội Thoại**

> "Không phải 1 lần chẩn đoán — mà là dashboard sức khỏe liên tục."

Phân tích hội thoại khách hàng đa kênh (Facebook, Zalo, Messenger, Website) → chẩn đoán 10 nhóm vấn đề → đề xuất hành động cụ thể từ Chuyên gia Smax. Điểm khác biệt cốt lõi: Hồ sơ bệnh án **cập nhật real-time mỗi ngày** — user nhìn thấy metrics cải thiện khi action đúng → tạo động lực tiếp tục.

### 1.2 Giải Pháp Lớn: Social & AI CDP

**VIK Group** — Giải pháp ĐẦU TIÊN tại Việt Nam cho phép tổng hợp, tối ưu, khai thác dữ liệu bán hàng qua **TẤT CẢ các kênh social** trên toàn bộ Hành trình Khách hàng.

**6 Module cốt lõi:**
| Module | Mô tả |
|--------|--------|
| Livechat & Chatbot | Omni-channel hội thoại đa kênh |
| Customer360 | Hồ sơ khách hàng thống nhất |
| Analytics | Báo cáo real-time đa kênh |
| E-com Automation | Tự động hóa thương mại |
| Marketing Tools | Công cụ marketing tích hợp |
| Loyalty & Rewards | Chương trình khách hàng thân thiết |

### 1.3 Hành Trình Khách Hàng (5 Giai Đoạn)

```
Khám phá (Discovery) → Cân nhắc (Consideration) → Chuyển đổi (Conversion)
                                                                        ↓
Lan tỏa (Advocacy) ← Trung thành (Loyalty) ←──────────────────────────┘
```

### 1.4 Đối Tượng Mục Tiêu

| Nhóm | Người dùng | Primary Goal |
|------|-----------|-------------|
| A | Chủ shop nhỏ (1-2 nhân viên) | "Tôi đang losing khách ở đâu?" |
| B | Marketing Manager | "Chiến dịch nào đang waste budget?" |
| C | CEO / Chủ doanh nghiệp | "Team tôi có vấn đề gì nghiêm trọng nhất?" |

---

## 2. Hệ Sinh Thái Sản Phẩm

### 2.1 Biểu Tượng Sản Phẩm

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI INSIGHT                                │
│  ┌──────────────────┐    ┌──────────────────┐                 │
│  │ 🏥 Khám Bệnh    │    │ 📊 Cài Đặt      │                 │
│  │ Hội Thoại        │    │ Insight          │                 │
│  └──────────────────┘    └──────────────────┘                 │
│  ┌──────────────────┐    ┌──────────────────┐                 │
│  │ 📢 Dashboard    │    │ 🎯 Gợi Ý        │                 │
│  │ Ads              │    │ Tối Ưu Ads      │                 │
│  └──────────────────┘    └──────────────────┘                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              SOCIAL & AI CDP — VIK GROUP                  │   │
│  │  Livechat │ Customer360 │ Analytics │ E-com │ Marketing  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Sản Phẩm Liên Quan

| Sản phẩm | Vai trò trong hệ sinh thái |
|----------|---------------------------|
| **AI Insight** | Phân tích & chẩn đoán — tầng nhận thức |
| **Social CDP** | Tổng hợp dữ liệu — tầng thu thập |
| **Customer360** | Hồ sơ khách hàng thống nhất — tầng lưu trữ |
| **Livechat** | Hội thoại thời gian thực — tầng tương tác |
| **Marketing Tools** | Automation & campaigns — tầng kích hoạt |
| **Loyalty & Rewards** | Chương trình khách hàng — tầng giữ chân |

---

## 3. Design System: Editorial Precision

> **Nguồn gốc:** Được thiết kế để vượt qua các pattern SaaS tiêu chuẩn — tạo trải nghiệm cao cấp, đáng tin cậy và driven by data.

### 3.1 Creative North Star: "The Digital Curator"

Trong thế giới đầy dữ liệu lộn xộn, giao diện của chúng ta hoạt động như một **gallery yên tĩnh, cao cấp**. Chúng ta né tránh các "default" UI patterns — như borders nặng và lưới generic — thay vào đó:

* **Intentional Asymmetry:** Sử dụng khoảng trắng (spacing tokens 20, 24) để dẫn mắt người xem về các insight chính.
* **Tonal Depth:** Thay thế các đường kẻ cấu trúc bằng các giá trị surface có sắc độ khác nhau.
* **High-Contrast Energetics:** Nền deep navy chuyên nghiệp được điểm xuyết bởi Deep Rust (nhân tố "con người") và Vibrant Blue (nhịp điệu số).

### 3.2 Tên Gọi Thương Hiệu

| Element | Giá trị | Ví dụ sử dụng |
|---------|---------|---------------|
| Tên sản phẩm | **AI Insight** | "AI Insight — Khám Bệnh Hội Thoại" |
| Tên công ty | **Smax** | "Chuyên gia Smax gợi ý" |
| Nhà phát triển | **VIK Group** | Footer, proposal deck, legal |
| Tên tính năng | **Khám Bệnh Hội Thoại** | Tên feature, landing page headline |
| Tagline | *"Không phải 1 lần chẩn đoán — mà là dashboard sức khỏe liên tục."* | Landing page, pitch deck |

---

## 4. Brand Identity

### 4.1 Biểu Tượng (Logo)

> **Nguồn chuẩn:** `marketing/template/LOGO CDP *.png`
> **Trạng thái:** ✅ Production-ready — 4 file logo chính thức

#### 4.1.1 Logo Assets Inventory

| File | Kích thước gốc | Ratio | Màu | Ngữ cảnh sử dụng |
|------|--------------|-------|-----|-----------------|
| `LOGO CDP TRẮNG.png` | 4369 × 939 px | 5:1 (ngang rộng) | White `#fcf8fb` | Dark backgrounds: sidebar, nav, dark hero, footer |
| `LOGO CDP XANH.png` | 4369 × 939 px | 5:1 (ngang rộng) | Vibrant Blue `#0052FF` | Light backgrounds: header nav, print, proposal |
| `LOGO CDP MOBILE 1.png` | 2084 × 2084 px | 1:1 (vuông) | White on transparent | App icon, social avatar, favicon, standalone mark |
| `LOGO CDP MOBILE 2.png` | 2084 × 2084 px | 1:1 (vuông) | White on transparent | Variant app icon (thay thế cho MOBILE 1 khi cần) |

#### 4.1.2 Logo Design Language

**Biểu tượng CDP (Icon Mark):**
- Một vòng tròn đồng tâm (circle) ở giữa tượng trưng cho **dữ liệu đa kênh hội tụ**
- Bên trong vòng tròn: chữ **"CDP"** viết cách điệu — chữ **C** và **P** được kết nối liền mạch, chữ **D** nổi bật với thanh ngang đậm
- Phong cách: **phẳng (flat), tối giản, đáng tin cậy** — phù hợp "Digital Curator" aesthetic
- Màu sắc: White trên nền trong suốt — linh hoạt đặt trên mọi nền

**Wordmark "CDP":**
- Font: Sans-serif bold, letter-spacing rộng
- Màu đồng nhất với icon mark
- Đặt bên phải icon mark trong lockup ngang

**Logo ngang (5:1):**
```
[ 🅞🅓🅟 Circle Icon Mark ]     [     CDP     ]
     (~22% width)                    (~78% width)
```

**Logo vuông (1:1 — Mobile):**
```
┌─────────────────────────────┐
│                             │
│                             │
│         🅞🅓🅟              │   ← Icon mark tràn đầy
│       (Circle)              │
│                             │
└─────────────────────────────┘
```

#### 4.1.3 Quy Tắc Sử Dụng Logo

```
SỬ DỤNG ĐÚNG:
  ✓ Dùng `LOGO CDP TRẮNG.png` trên nền tối (Deep Navy #1A2138, dark gradient)
  ✓ Dùng `LOGO CDP XANH.png` trên nền sáng (Surface #FCF8FB, trắng, print)
  ✓ Dùng `LOGO CDP MOBILE 1.png` làm app icon, favicon, social avatar
  ✓ Giữ nguyên tỉ lệ pixel — không co giãn
  ✓ Minimum width: 120px (logo ngang) / 64px (logo vuông)

TUYỆT ĐỐI KHÔNG:
  ✗ Không co giãn, bóp méo tỉ lệ
  ✗ Không thêm shadow, outline, glow, hoặc effect lên logo
  ✗ Không đổi màu logo ngoài 2 variants (TRẮNG / XANH)
  ✗ Không đặt logo XANH trên nền tối (contrast quá thấp)
  ✗ Không đặt logo TRẮNG trên nền màu nhạt (contrast quá thấp)
  ✗ Không tách icon mark ra khỏi wordmark (trừ khi dùng MOBILE 1/2)
  ✗ Không dùng logo trên nền có pattern/gradient phức tạp
```

#### 4.1.4 Clear Space

```
Khoảng trắng tối thiểu:
  Logo ngang:  ≥ ½ chiều cao logo xung quanh (cả 4 cạnh)
  Logo vuông:  ≥ ½ chiều rộng logo xung quanh (cả 4 cạnh)

Không đặt bất kỳ element nào (text, icon, hình ảnh) trong vùng clear space.
```

#### 4.1.5 Logo Cho Từng Kênh

| Kênh / Ngữ cảnh | File logo | Lý do |
|-----------------|-----------|--------|
| Website sidebar / nav | `LOGO CDP TRẮNG.png` | Nền Deep Navy → text trắng |
| Landing page hero (dark) | `LOGO CDP TRẮNG.png` | Dark gradient hero |
| Header nav (light page) | `LOGO CDP XANH.png` | Nền Surface → text xanh nổi |
| Pitch deck slides (dark) | `LOGO CDP TRẮNG.png` | Dark slide background |
| Proposal / Print | `LOGO CDP XANH.png` | Giấy trắng |
| Facebook post / social | `LOGO CDP MOBILE 1.png` | Avatar, icon mark standalone |
| App icon (iOS/Android) | `LOGO CDP MOBILE 1.png` | 1024×1024 app icon |
| Favicon / Tab icon | `LOGO CDP MOBILE 1.png` | 16×16, 32×32 |
| Email signature | `LOGO CDP MOBILE 1.png` | Compact, nhỏ gọn |

### 4.2 Màu Thương Hiệu Chính

```
Deep Navy     ██████  #1A2138   → Nền authority, sidebar, header
Deep Rust    ██████  #BF3003   → CTA chính, urgency, nhấn mạnh
Vibrant Blue ██████  #0052FF   → Digital pulse, active states, links
Surface      ██████  #fcf8fb   → Nền warm off-white chính
On Surface   ██████  #1b1b1d   → Text chính (không dùng #000000)
```

### 4.3 Phối Hợp Màu Theo Ngữ Cảnh

| Ngữ cảnh | Nền | Text | Accent | Icon |
|-----------|-----|------|--------|------|
| Dark hero | `#1A2138` | `#fcf8fb` | `#0052FF` | `#fcf8fb` |
| Light page | `#fcf8fb` | `#1b1b1d` | `#BF3003` | `#1A2138` |
| Glass overlay | `#fcf8fb` @ 80% | `#1b1b1d` | `#0052FF` | `#1A2138` |
| Danger/Urgency | `#BF3003` | `#fcf8fb` | — | `#fcf8fb` |
| Success | `#059669` | `#fcf8fb` | — | `#fcf8fb` |

---

## 5. Foundation: Màu Sắc & Typo

### 5.1 Bảng Màu Hoàn Chỉnh

#### Primary Palette

```
┌────────────────────────────────────────────────────────────────┐
│  PRIMARY — DEEP NAVY                                          │
│  #1A2138  │  rgb(26,33,56)                                    │
│  ──────────────────────────────────────────────────────────   │
│  Mục đích: Authority + Professional                            │
│  Sử dụng: Sidebar, header, dark hero sections, nav bar        │
│  Pairing: + #fcf8fb (text trắng) + #0052FF (accents)         │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  SECONDARY — DEEP RUST                                        │
│  #BF3003  │  rgb(191,48,3)                                    │
│  ──────────────────────────────────────────────────────────   │
│  Mục đích: Human Element — Laser pointer, not paint brush      │
│  Sử dụng: Primary CTA, urgency badges, "bệnh nặng" alerts,    │
│            điểm số thấp, ký hiệu cảnh báo                    │
│  Pairing: + #fcf8fb (text trắng) + #1A2138 (nền nhấn)        │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  TERTIARY — VIBRANT BLUE                                      │
│  #0052FF  │  rgb(0,82,255)                                   │
│  ──────────────────────────────────────────────────────────   │
│  Mục đích: Digital Pulse — momentum, action, connectivity     │
│  Sử dụng: Active states, links, progress bars, secondary CTAs │
│  Pairing: + #1A2138 (nền tối) + #fcf8fb (text sáng)          │
└────────────────────────────────────────────────────────────────┘
```

#### Semantic Colors (Bảng Màu Ngữ Nghĩa)

```
#059669  Emerald Green    → Success, điểm TỐT (≥7.5), trending up
#d97706  Amber            → Warning, điểm TRUNG BÌNH (3.1-6), cảnh báo nhẹ
#dc2626  Red              → Danger, điểm THẤP (<3), junk lead cao, cảnh báo nghiêm trọng
#0052FF  Vibrant Blue     → Active, links, progress (đã định nghĩa ở tertiary)
#BF3003  Deep Rust        → Urgency, CTA nặng (đã định nghĩa ở secondary)
```

#### Surface / Background System (6 Tiers)

```
#FCF8FB  surface               → Nền chính trang (warm off-white)
#FAF6F3  surface_container     → Card nhẹ, section dividers
#F4EEF1  surface_container_low → Dividing sections nhẹ
#EDE6EA  surface_container_lowest → Card components (lift effect)
#E8E2E8  surface_container_high → Input fields, hover states
#DFD8DC  surface_container_highest → Active input, pressed states
#1A2138  surface_bright        → Overlay nhẹ trên nền tối
```

### 5.2 Typography

#### Font Stack

| Cấp | Font | Weight | Kích thước chuẩn | Line-height | Letter-spacing |
|-----|------|--------|------------------|-------------|----------------|
| Display | Manrope | Bold (700) | 3.5rem / 56px | 1.1 | -0.02em |
| Headline | Manrope | Bold (700) / SemiBold (600) | 1.5rem–2rem / 24–32px | 1.25 | -0.01em |
| Title | Manrope | SemiBold (600) | 1rem–1.25rem / 16–20px | 1.4 | 0 |
| Body | Inter | Regular (400) | 0.875rem / 14px | 1.6 | 0 |
| Label | Inter | SemiBold (600) | 0.6875rem / 11px | 1.4 | 0.05em |
| Caption | Inter | Regular (400) | 0.75rem / 12px | 1.5 | 0 |

#### Typography Scale (CSS Classes)

```css
.display-lg   { font: 700 3.5rem/1.1 Manrope; letter-spacing: -0.02em; }
.display-md   { font: 700 2.5rem/1.15 Manrope; letter-spacing: -0.015em; }
.display-sm   { font: 700 1.75rem/1.2 Manrope; letter-spacing: -0.01em; }

.headline-lg  { font: 700 1.5rem/1.25 Manrope; letter-spacing: -0.01em; }
.headline-md  { font: 600 1.25rem/1.3 Manrope; }
.headline-sm  { font: 600 1rem/1.35 Manrope; }

.title-lg     { font: 600 1.125rem/1.4 Manrope; }
.title-md     { font: 600 1rem/1.4 Manrope; }
.title-sm     { font: 600 0.875rem/1.4 Manrope; }

.body-lg      { font: 400 1rem/1.6 Inter; }
.body-md      { font: 400 0.875rem/1.6 Inter; }
.body-sm      { font: 400 0.75rem/1.5 Inter; }

.label-md     { font: 600 0.75rem/1.4 Inter; letter-spacing: 0.05em; text-transform: uppercase; }
.label-sm     { font: 600 0.6875rem/1.4 Inter; letter-spacing: 0.05em; text-transform: uppercase; }
```

#### Vietnamese Typography Rules

- **Luôn dùng font có hỗ trợ tiếng Việt:** Manrope (display/headlines), Inter (body/labels)
- **Không dùng** font fallback như Arial, Helvetica, sans-serif làm font hiển thị chính
- **Font tiếng Việt đặc biệt (đã sử dụng trong PPTX):**
  - `Be Vietnam Ultra-Bold` — Vietnamese headlines có trọng lượng cực nặng
  - `Be Vietnam Medium` — Body copy tiếng Việt
  - `Poppins Bold / SemiBold` — Headlines tiếng Anh
  - `League Spartan Bold` — Condensed display cho social posts
- **Quy tắc ngắt dòng:** Tiếng Việt không có space giữa các từ — khi dùng `word-break`, ưu tiên break theo syllable

### 5.3 Iconography

| Thư viện | Khi nào dùng |
|----------|--------------|
| **Lucide React** | UI trong ứng dụng React |
| **Fluent UI** | Slides, tài liệu Office |
| **Phosphor Icons** | Social media, marketing collateral |

**Kích thước icon chuẩn:**
```
Icon XS   → 16×16px   (inline với text nhỏ, labels)
Icon SM   → 20×20px   (list items, badges)
Icon MD   → 24×24px   (navigation, action buttons)
Icon LG   → 32×32px   (feature cards, section headers)
Icon XL   → 48×48px   (hero sections, empty states)
Icon 2XL  → 64×64px   (landing page CTAs, big features)
```

---

## 6. Layout & Spatial System

### 6.1 Grid System

**8px Base Grid** — Mọi spacing, padding, margin đều là bội số của 8px.

```
Token 0  → 0px      (compact, no space)
Token 1  → 4px      (micro gap within component)
Token 2  → 8px      (base spacing)
Token 3  → 12px     (tight grouping)
Token 4  → 16px     (standard padding)
Token 5  → 24px     (card padding)
Token 6  → 32px     (section internal padding)
Token 7  → 40px     (section gap)
Token 8  → 48px     (section padding)
Token 9  → 64px     (large section gap)
Token 10 → 80px     (page section spacing)
Token 11 → 96px     (hero section)
Token 12 → 128px    (major section break)
```

### 6.2 Border Radius

**8px DEFAULT** — Chỉ dùng 8px (không phải 4px hay 16px) để duy trì "Curated Identity."

```
sm  → 4px   (chỉ dùng cho input fields nhỏ, chip nhỏ)
md  → 8px   (DEFAULT — tất cả cards, buttons, modals)
lg  → 12px  (large modals, full-screen overlays)
xl  → 16px  (glass panels, very large cards)
full → 9999px (pills, avatars)
```

### 6.3 Elevation & Shadows

**Công thức Ambient Shadow:**
- Shadow blur: 32px → 48px
- Shadow opacity: 4% → 8%
- Shadow color: Dùng `on_surface` tinted version (ví dụ: `rgba(27,27,29,0.08)`) — **KHÔNG dùng pure black `#000000`**

```
shadow-sm   → 0 2px 8px rgba(27,27,29,0.06)   (subtle lift)
shadow-md   → 0 4px 16px rgba(27,27,29,0.08)  (card default)
shadow-lg   → 0 8px 32px rgba(27,27,29,0.08)   (elevated card)
shadow-xl   → 0 16px 48px rgba(27,27,29,0.12)  (modal, floating panel)
```

### 6.4 Glassmorphism Formula

```
Glass overlay:
  background: rgba(252, 248, 251, 0.8)   /* surface at 80% opacity */
  backdrop-filter: blur(12px)
  border: 1px solid rgba(27,27,29,0.08)  /* ghost border 8% opacity */
  border-radius: 8px
```

**Khi nào dùng:**
- Modal overlays
- Floating panels / popovers
- Tooltips
- Sticky headers trên nền content
- Bất kỳ overlay nào cần độ sâu nhưng không che khuất hoàn toàn

### 6.5 "No-Line Rule"

> **Quy tắc bắt buộc:** KHÔNG dùng `border: 1px solid` để phân cách sections hoặc cards.

**Thay thế bằng:**
1. **Surface shift:** Đặt `surface_container_low` section trên nền `surface`
2. **Negative space:** Sử dụng gap 8px → 12px để `surface_dim` peek through
3. **Ghost Border (khi bắt buộc):** `outline: 1px solid rgba(27,27,29,0.08)` — 8% opacity thay vì 100%

---

## 7. Components & Visual Patterns

### 7.1 Buttons

```
Primary Button (Deep Rust CTA):
  background: #BF3003
  text: #fcf8fb
  hover: #A32800 (darken 15%)
  border-radius: 8px
  padding: 12px 24px
  font: Manrope SemiBold 14px
  shadow: shadow-md

Tertiary Button (Vibrant Blue):
  background: #0052FF
  text: #fcf8fb
  hover: #0040CC
  border-radius: 8px

Ghost Button:
  background: transparent
  text: #1A2138
  border: 1px solid rgba(26,33,56,0.15)
  hover: background surface_container_low
  border-radius: 8px
```

### 7.2 Cards

```
Card Standard (Surface Container Lowest):
  background: #EDE6EA
  border-radius: 8px
  padding: 24px (token 6)
  shadow: shadow-md
  KHÔNG có border

Card Elevated:
  background: #EDE6EA
  border-radius: 8px
  shadow: shadow-xl
  border: 1px solid rgba(27,27,29,0.08)  /* ghost border only */

Card Glass:
  background: rgba(252,248,251,0.8)
  backdrop-filter: blur(12px)
  border: 1px solid rgba(27,27,29,0.08)
  border-radius: 8px
```

### 7.3 Data Visualization Colors

| Chart Element | Hex | Khi nào dùng |
|--------------|-----|-------------|
| Lead Nóng (Hot) | `#DC2626` | Temperature Nóng |
| Lead Ấm (Warm) | `#F79646` | Temperature Ấm |
| Lead Lạnh (Cold) | `#4F81BD` | Temperature Lạnh |
| Điểm Tốt | `#059669` | Score ≥ 7.5 |
| Điểm TB | `#D97706` | Score 3.1–6.9 |
| Điểm Thấp | `#DC2626` | Score < 3 |
| Progress Bar Fill | `#0052FF` | Progress, completion |
| Progress Bar BG | `#EDE6EA` | Progress bar track |
| ROAS ≥ 3× | `#059669` | ROAS tốt |
| ROAS ≥ 1.5× | `#D97706` | ROAS cải thiện |
| ROAS < 1.5× | `#DC2626` | ROAS thấp |

### 7.4 Badges & Labels

```
Badge Severity — Nặng:
  background: #BF3003 @ 12%
  text: #BF3003
  border: 1px solid #BF3003 @ 25%
  border-radius: 4px
  padding: 2px 8px
  font: label-sm (All-caps, +5% letter-spacing)

Badge Severity — Trung bình:
  background: #0052FF @ 12%
  text: #0052FF
  border: 1px solid #0052FF @ 25%

Badge Severity — Nhẹ:
  background: #059669 @ 12%
  text: #059669
  border: 1px solid #059669 @ 25%

Chip (Primary Fixed / Dark Mode):
  background: #1A2138
  text: #fcf8fb
  border-radius: 9999px (full)
  padding: 4px 12px
  font: Inter SemiBold 11px
```

### 7.5 Form Elements

```
Input Field:
  background: surface_container_high (#E8E2E8)
  border-radius: 8px
  border: none (không border)
  padding: 12px 16px
  font: Inter Regular 14px
  text: #1b1b1d

Input Field (Focus):
  background: surface_container_highest (#DFD8DC)
  border-bottom: 2px solid #0052FF (Vibrant Blue)
  transition: all 0.2s ease
```

---

## 8. Kênh & Tài Sản Marketing

### 8.1 Asset Inventory (Hiện Có)

```
marketing/template/
├── [IMAGE] Facebook Carousel Cards (8 ảnh)
│   ├── Brand: Routine / GenViet
│   ├── Theme: Light editorial (off-white + deep navy)
│   ├── Content: Fashion product carousel
│   └── Design: Editorial Precision (phù hợp hoàn toàn)
│
├── [IMAGE] Facebook Standalone Posts (2 ảnh)
│   ├── Brand: Social CDP
│   ├── Theme: Dark blue gradient (#0052FF → #1A2138)
│   ├── Content: Social CDP value proposition
│   ├── Typography: League Spartan / Poppins Bold
│   └── Design: Bold SaaS aesthetic (khác với Editorial Precision)
│
└── [PPTX] SOCIAL CDP PROPOSAL 2026.pptx (56 slides)
    ├── Sections: Giới thiệu → Bối cảnh → Giải pháp → Demo → Triển khai → Kết luận
    ├── Color theme: #1F497D (corporate blue) — CẦN CẬP NHẬT sang Editorial Precision
    ├── Fonts: Be Vietnam Ultra-Bold, Calibri (Latin default)
    └── Audience: Enterprise decision-makers (CEO, CMO, CTO)

marketing/
├── landingpage/   ← [EMPTY] — cần thiết kế từ đầu
├── slide/         ← [EMPTY] — có thể tái sử dụng PPTX
├── social-image/  ← [EMPTY] — cần thiết kế
└── social-post/  ← [EMPTY] — cần thiết kế
```

### 8.2 Hai Design Language Cần Thống Nhất

| Chiều | PPTX Proposal | Social Carousel | Standalone Post |
|-------|--------------|-----------------|-----------------|
| **Background** | Trắng / off-white | `#FCF8FB` off-white | Dark gradient `#0052FF→#1A2138` |
| **Primary** | `#1F497D` corporate | `#1A2138` deep navy | `#0052FF` vibrant blue |
| **Accent** | `#C0504D` coral | `#BF3003` deep rust | White text |
| **Display Font** | Be Vietnam Ultra-Bold | Roboto/Montserrat | League Spartan Bold |
| **Aesthetic** | Corporate enterprise | Editorial Precision ✅ | Bold SaaS aggressive |
| **Chất lượng** | Cần cập nhật | Tốt — production-ready | Tốt — production-ready |

**Action:** PPTX cần được cập nhật design language sang Editorial Precision trước khi dùng làm tài liệu chuẩn.

---

## 9. Template Library

### 9.1 Facebook Ad — Single Image Post

**Kích thước chuẩn:**
- 1080×1080px (square — phổ biến nhất cho feed)
- 1200×628px (landscape link post)
- 1080×1920px (story / vertical)

**Layout Structure:**

```
┌─────────────────────────────────────────────────────────┐
│  BACKGROUND: Deep Navy #1A2138 gradient to #0d1520     │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ [Logo + Brand mark — top left]                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  [ICON — 64px, centered] 🏥                           │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  KHÁM BỆNH HỘI THOẠI                            │  │
│  │  (display-lg, white, centered)                     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Phân tích 10 nhóm vấn đề trong hội thoại       │  │
│  │  khách hàng đa kênh                             │  │
│  │  (headline-md, white/80%, centered)               │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  [Health Score Display — large centered number]   │  │
│  │     6.2 / 10                                     │  │
│  │  [══════░░░░░░░░░░░░░░░░░░░░] 62%              │  │
│  │  (Vibrant Blue progress bar)                      │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ LQ   │ │ NV   │ │ ĐT   │ │ CS   │ │ KB   │ ...  │
│  │ 10.0 │ │ 4.8⚠│ │ 8.6  │ │ 6.4  │ │ 7.4  │       │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘       │
│  (10 pill badges — colored by severity)                 │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  ✓ Real-time mỗi ngày                            │  │
│  │  ✓ Gợi ý từ Chuyên gia Smax                     │  │
│  │  ✓ Theo dõi cải thiện liên tục                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │         [ TÌM HIỂU THÊM → ]                     │  │
│  │         (Deep Rust button, white text)           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  [Smax / AI Insight — bottom right, small]              │
└─────────────────────────────────────────────────────────┘
```

**Font chuẩn cho ảnh:**
- Headline: Poppins Bold 700 hoặc Manrope Bold 700
- Subheadline: Poppins Medium 500
- Body: Poppins Regular 400
- Vietnamese display: League Spartan Bold (compressed headlines)

### 9.2 Facebook Carousel Post

**Kích thước:** 1080×1080px mỗi card × 5-10 cards

**Cấu trúc mỗi card:**
- Card 1 (Cover): Product/feature overview — large icon + headline
- Card 2-4: Problem cards (pain points) — dark background
- Card 5-7: Solution cards — light background
- Card 8-10: Proof/result cards — with metrics
- Card N (CTA): "Bắt đầu ngay" — prominent CTA

**Design:**
- Background: `#FCF8FB` off-white
- Text: `#1A2138` deep navy
- Accent: `#BF3003` deep rust
- Cards separated by 16px gap
- Consistent padding: 48px all sides

### 9.3 Landing Page (Khám Bệnh Hội Thoại)

**Đã implement tại:** `src/pages/MedicalCheckupLanding.jsx` — chạy production

**Sections theo wireframe PRD:**

```
1. Hero Section
   - Dark navy gradient background
   - Health score "6.2/10" large display
   - Headline: "Khám Bệnh Hội Thoại — AI Insight"
   - Subheadline: "Phân tích tự động 10 nhóm vấn đề"
   - CTA: "Bắt đầu khám bệnh miễn phí"
   - Stats strip: 10,000+ shops, 50,000+ conversations/day
   - Radar effect animation (framer-motion) góc phải

2. Problem Section (3 pain points)
   - "Junk Lead cao" — điểm đau chính
   - "Không biết nhân viên tư vấn thế nào"
   - "Đối thủ cạnh tranh nhắc đến liên tục"
   - Cards: dark background, rust accents

3. How It Works (3 bước)
   - Bước 1: Kết nối Fanpage
   - Bước 2: AI phân tích hội thoại
   - Bước 3: Nhận hồ sơ bệnh án + hành động

4. 10 Nhóm Bệnh (grid)
   - 10 cards color-coded theo severity
   - Red = Nặng, Blue = TB, Green = Nhẹ
   - Hover: hiện metrics cụ thể

5. Results Preview (3 expert recommendations)
   - Cards với expert avatar
   - Impact metrics
   - Before/after improvement

6. Lead Capture Form
   - 3 fields: Họ tên, Email, Đánh giá (5 stars)
   - → Supabase landing_leads table
   - Success state animation

7. Footer
   - Dark footer
   - Trust badges, social links
```

### 9.4 Pitch Deck / Proposal Slides

**Cần cập nhật:** PPTX hiện tại dùng `#1F497D` corporate blue → cần chuyển sang Editorial Precision.

**Slide template structure:**

```
Slide Title Slide:
  background: #1A2138
  Title: Manrope Bold 700 white, centered
  Subtitle: Inter Regular white/70%
  Logo: top-right
  Accent: #BF3003 decorative line

Content Slide:
  background: #FCF8FB
  Title bar: #1A2138 left accent strip
  Body: #1b1b1d text
  Accent: #BF3003 for highlights, #0052FF for links

Data Slide:
  background: #FCF8FB
  Large number: Manrope Bold 700, #1A2138
  Supporting text: Inter Regular, #1b1b1d/70%
  Chart colors: #0052FF, #BF3003, #059669, #D97706

Closing Slide:
  background: #1A2138
  Large CTA: Manrope Bold 700 white
  Button: #BF3003 background
```

---

## 10. Brand Voice & Tone

### 10.1 Voice Attributes

| Attribute | Mô tả | Ví dụ |
|-----------|-------|-------|
| **Authoritative** | Biết rõ vấn đề, có data | "Phân tích 10 nhóm vấn đề — không phải 1 lần chẩn đoán" |
| **Precise** | Con số cụ thể, không mơ hồ | "Thu thập SĐT 23%, Chốt đơn 18%" thay vì "tỉ lệ thấp" |
| **Empathetic** | Thấu hiểu pain point | "Bạn đang losing khách ở đâu?" |
| **Actionable** | Luôn có hành động rõ ràng | "Gợi ý từ Chuyên gia Smax" — không chỉ chẩn đoán |
| **Premium** | Không rẻ tiền, không spam | Không dùng emoji thừa, không viết HOA quá mức |

### 10.2 Tone by Channel

| Kênh | Tone | Ví dụ |
|------|------|--------|
| **Landing Page** | Authoritative, empathetic, premium | "Hồ sơ bệnh án cập nhật real-time mỗi ngày" |
| **Facebook Ad** | Direct, benefit-led, no fluff | "Junk Lead 42%? Biết ngay nhóm nào kéo tụt" |
| **Pitch Deck** | Professional, data-driven, consultative | "Tăng chuyển đổi gấp đôi, giữ chân +25-30%" |
| **In-App** | Friendly, guiding, clear | "Điểm sức khỏe tổng quan: 6.2/10 — Cần cải thiện" |
| **Email** | Personal, relevant, concise | "Hồ sơ bệnh án hôm nay: ↑ điểm Lead Quality" |

### 10.3 Từ Vựng Chuẩn

**Dùng:**
- Khám Bệnh Hội Thoại, Hồ sơ bệnh án, Bệnh nhân (user)
- Chuyên gia Smax (KHÔNG: AI, Bot, Auto)
- Lead Nóng/Ấm/Lạnh (KHÔNG: Hot/Cold/Warm)
- Nhóm bệnh, Hành động, Gợi ý
- Điểm sức khỏe, Real-time, Cải thiện

**Không dùng:**
- "Bệnh" một mình (luôn: "nhóm bệnh" hoặc "hạng mục")
- "Tự động" một mình (nói rõ: auto-reply, auto-tag, auto-label)
- "Tốt nhất" tuyệt đối (nói: "cải thiện", "tăng")
- Emoji spam (tối đa 1-2 emoji cho 1 post)

### 10.4 Vietnamese Copywriting Rules

```
Headline (tối đa 8 từ):
  → "Phân tích 10 nhóm vấn đề trong hội thoại"

Subheadline (tối đa 15 từ):
  → "AI tự động chẩn đoán, gợi ý hành động cụ thể từ Chuyên gia Smax"

CTA Primary:
  → "Bắt đầu khám bệnh miễn phí"
  → "Xem hồ sơ bệnh án của bạn"
  → "Tìm hiểu thêm"

CTA Secondary:
  → "Xem demo"
  → "Đăng ký tư vấn"

Không viết:
  ✗ "HOÀN TOÀN MIỄN PHÍ!" (viết HOA)
  ✗ "Giảm 100% chi phí!" (overpromise)
  ✗ "Tốt nhất thị trường" (comparative claim)
```

---

## 11. Asset Specifications

### 11.1 Social Media Dimensions

| Kênh | Loại | Kích thước | Ratio | File format |
|------|------|-----------|-------|-------------|
| Facebook Feed | Square post | 1080×1080 | 1:1 | PNG/JPG |
| Facebook Feed | Landscape | 1200×630 | 1.91:1 | PNG/JPG |
| Facebook Feed | Portrait | 1080×1350 | 4:5 | PNG/JPG |
| Facebook Story | Vertical | 1080×1920 | 9:16 | PNG/JPG |
| Facebook Carousel | Card | 1080×1080 | 1:1 | PNG/JPG |
| LinkedIn Feed | Square | 1200×1200 | 1:1 | PNG/JPG |
| LinkedIn Banner | Wide | 1584×396 | 4:1 | PNG |
| Zalo Banner | Portrait | 900×1200 | 3:4 | PNG/JPG |

### 11.2 Print & Presentation

| Loại | Kích thước | Resolution | File format |
|------|-----------|------------|-------------|
| Pitch Deck | 1920×1080 | 150 DPI | PPTX / PDF |
| Proposal | A4 | 300 DPI | PDF |
| Business Card | 85×54mm | 600 DPI | AI / PDF |
| Roll-up Banner | 850×2000mm | 150 DPI | AI / PDF |

### 11.3 App UI / Web

| Element | Chiều rộng tối thiểu | Chiều cao tối thiểu |
|---------|----------------------|---------------------|
| App icon | 1024×1024px | (square) |
| Favicon | 32×32px | (ico/png) |
| OG Image (Facebook share) | 1200×630px | (1.91:1) |
| Twitter Card | 1200×600px | (2:1) |
| Email header | 600px | (fixed width) |

### 11.4 Export Settings

```
Ảnh chất lượng cao:
  - PNG: lossless, không nén artifacts
  - JPG: quality 85-90, sRGB color profile
  - Video: H.264, bitrate ≥ 5Mbps cho 1080p

Font embedding (PDF/Print):
  - Embed subset: chỉ glyphs sử dụng
  - Font tiếng Việt: embed toàn bộ Unicode range

Color profile:
  - Luôn dùng sRGB IEC61966-2.1
  - Không dùng CMYK cho digital assets
  - Print: chuyển sang CMYK khi export cuối cùng
```

---

## Revision History

| Phiên bản | Ngày | Thay đổi | Tác giả |
|-----------|------|---------|---------|
| 1.0 | 2026-03-27 | Khởi tạo từ DESIGN.md | AI Assistant |
| 2.0 | 2026-03-29 | Bổ sung full brand guidelines, template specs, voice/tone, asset specs từ marketing/template PPTX + social images | AI Assistant |
| 2.1 | 2026-03-29 | Update section 4.1 Logo — bổ sung 4 logo files production-ready: LOGO CDP TRẮNG/XANH/MOBILE 1/MOBILE 2; mô tả icon mark, lockup structure, clear space, usage guide per channel | AI Assistant |
