# SMAX AI Insight — Launch Campaign Plan
## Chiến dịch: "Biết khách đang nói gì"
**Ngày:** 01/04/2026 — 14/04/2026
**Product:** SMAX AI Insight — Audit dữ liệu Hội thoại & Quảng cáo
**Lead Goal:** 100 đăng ký nhận báo cáo miễn phí
**Budget:** Nhỏ (quick test)

---

## 1. Campaign Overview

### 1.1 Problem Statement
Đa số doanh nghiệp SME tại Việt Nam đang vận hành marketing (Facebook Ads, Zalo OA, Fanpage) dựa trên **cảm tính** — không có cách nào phân loại leads, đánh giá chất lượng tư vấn, hay biết chiến dịch ads nào thực sự hiệu quả.

Hậu quả: chi tiêu ads tăng, ROAS giảm, nhân viên mất khách không ai phát hiện, khách rác chiếm 40-70% inbox.

### 1.2 Solution
**SMAX AI Insight** — bộ công cụ AI phân tích hội thoại đa kênh:
- Phân loại Lead Nóng/Ấm/Lạnh tự động
- Dashboard ROAS theo chiến dịch & platform
- AI gợi ý hành động cụ thể theo priority
- Hỗ trợ 7 ngành: Thời trang, Mẹ & Bé, Mỹ phẩm, Spa, BĐS, F&B, Du lịch

### 1.3 Offer
**Lead Magnet:** Nhận báo cáo AI Audit miễn phí cho 500+ hội thoại đầu tiên.
- Phân tích 500+ hội thoại đầu tiên
- Health Score theo 6 dimensions
- 3 action items ưu tiên cao nhất
- Gửi trong 24h qua email
- Không cần thẻ tín dụng

---

## 2. Target Audience

### 2.1 Primary Segments

| Segment | Mô tả | Pain Point chính | Messaging |
|---------|--------|------------------|-----------|
| **CEO / Founder SME** | Doanh nghiệp 5-50 nhân, chạy ads tự DIY | Không có data để đưa ra quyết định marketing | "Đưa quyết định bằng data, không cảm tính" |
| **CMO / Head of Marketing** | Quản lý team marketing, chi tiêu ads lớn | Không biết chiến dịch nào ROI, leads nào chất lượng | "Dashboard scan 3 giây — biết ngay ROAS thật" |
| **Head of Sales / CS** | Quản lý nhân viên tư vấn | Không đánh giá được ai tốt, ai đang mất khách | "Biết ngay nhân viên nào cần training" |

### 2.2 Targeting Parameters (Facebook Ads)

| Segment | Interest targeting | Behavior targeting |
|---------|-------------------|-------------------|
| CEO/Founder | "Entrepreneurship", "Small Business", "Vietnamese Business" | "Business owners", "Top decision makers" |
| CMO/Marketing | "Marketing", "Digital Marketing", "Facebook Marketing" | "Marketing professionals", "Business buyers" |
| Sales/CS | "Customer Service", "Sales Management", "Retail" | "Sales and marketing" |

---

## 3. Campaign Structure

### 3.1 Funnel Architecture

```
AWARENESS (Tuần 1)
  └─ Facebook Feed + IG: Pain Point posts
      → Landing Page /official (awareness)

CONSIDERATION (Tuần 1-2)
  └─ Facebook Feed: How It Works + Industry posts
      → Lead Form /official#lead-form

CONVERSION (Tuần 2)
  └─ Retargeting: Social Proof + Urgency
      → Lead Form (final push)
```

### 3.2 Ad Set Structure

| Phase | Ad Set | Objective | Format |
|-------|--------|-----------|--------|
| Warm-up | ATL_Pain_Points | Awareness | Single image 16:9 |
| Warm-up | ATL_Industry_Fashion | Awareness | Carousel 1:1 |
| Conversion | BTL_HowItWorks | Traffic | Single image 16:9 |
| Conversion | BTL_ROI_Story | Lead gen | Single image 16:9 |
| Retargeting | RTG_Urgency | Lead gen | Countdown image |

---

## 4. Content Plan

### 4.1 Content Pillar Mix

| Pillar | % | Chi tiết |
|--------|---|---------|
| Pain Point / Awareness | 30% | Gây nhận thức về vấn đề "đi mù" |
| How It Works | 25% | Giải thích giá trị 3 phút |
| Social Proof | 20% | Testimonial + case study |
| Demo / Feature | 15% | Showcase dashboard thực tế |
| CTA / Offer | 10% | Lead form push cuối |

### 4.2 Posting Schedule

| Ngày | Content | Platform | Phase |
|------|---------|----------|-------|
| 01/04 | Pain Point: "Đi mù" | FB + IG | Warm-up |
| 03/04 | How It Works: 3 bước | FB + IG | Warm-up |
| 05/04 | Industry: Thời trang | FB Group + IG | Warm-up |
| 07/04 | ROI Story: ROAS | FB + LinkedIn | Conversion |
| 09/04 | Testimonial | FB + IG | Conversion |
| 10/04 | CEO/CMO targeted | FB (targeted) | Conversion |
| 12/04 | Urgency: Last chance | FB + IG | Closing |
| 14/04 | Final CTA: Soft close | FB + IG | Closing |

### 4.3 Visual Assets

| Asset | File | Format | Số lượng |
|-------|------|--------|---------|
| Hero Banner | banner-hero-[1-3].png | 1200×628px | 3 |
| Carousel | carousel-[1-2].png | 1080×1080px | 2 |
| Before/After | banner-split-[1-2].png | 1200×628px | 2 |
| **Tổng** | | | **7 assets** |

---

## 5. Landing Page Strategy

### 5.1 URL
`https://ai-insight-mockup.vercel.app/official`

### 5.2 Key Sections

1. **Hero** — Headline nhấn pain point + mock dashboard + CTA
2. **Stats Strip** — Social proof numbers
3. **Problem Section** — 3 pain points với stats
4. **Features** — 3 module với mini visual
5. **Industries** — 7 ngành templates
6. **How It Works** — 3 bước
7. **Lead Form** — Form đơn giản (name + email)
8. **Footer**

### 5.3 Form Flow
```
Họ tên + Email → Supabase landing_leads table
                 → Success state hiện trên page
                 → Lead count hiện (47 đã đăng ký)
```

---

## 6. Budget Allocation

### 6.1 Suggested Budget (2 tuần)

| Channel | Budget | Mục tiêu |
|---------|--------|---------|
| Facebook Feed Ads | 60% | Awareness + Conversion |
| Facebook Retargeting | 25% | Nhắm lại visitors chưa convert |
| Instagram Ads | 15% | Cross-platform reach |

### 6.2 Bidding Strategy
- **Warm-up (Tuần 1):** CBO, lowest cost, objective = Traffic
- **Conversion (Tuần 2):** ABO, Target cost, objective = Lead generation

---

## 7. Success Metrics

### 7.1 KPIs

| Metric | Target | Measurement |
|--------|--------|------------|
| Leads đăng ký | 100 | Supabase `landing_leads` count |
| Cost per Lead (CPL) | < 150K VND | Spend / Leads |
| Landing Page CVR | > 5% | Leads / Landing Page visitors |
| Engagement Rate | > 3% | Reactions+Comments+Shares / Reach |

### 7.2 Funnel Targets

```
Reach: 10,000
  ↓ CTR 3%
Landing Page Visitors: 300
  ↓ CVR 33%
Leads: 100 ✅
```

---

## 8. Execution Checklist

### Pre-Launch (Trước 01/04)
- [x] Landing page `/official` deployed
- [x] 7 ad visuals tạo xong
- [x] Supabase `landing_leads` table verify
- [ ] Facebook Page + IG Business verified
- [ ] Pixel setup (nếu cần retargeting)

### Launch Week 1 (01–07/04)
- [ ] Đăng Post 1 (Pain Point) — 01/04 09:00
- [ ] Boost Post 1 với ngân sách test
- [ ] Đăng Post 2 (How It Works) — 03/04 09:00
- [ ] Đăng Post 3 (Fashion) — 05/04 09:00

### Launch Week 2 (08–14/04)
- [ ] Đăng Post 4 (ROI Story) — 07/04 09:00
- [ ] Đăng Post 5 (Testimonial) — 09/04 09:00
- [ ] Đăng Post 6 (CEO targeted) — 10/04 09:00
- [ ] Đăng Post 7 (Urgency) — 12/04 09:00
- [ ] Đăng Post 8 (Final CTA) — 14/04 09:00

### Post-Campaign (15/04+)
- [ ] Tổng kết số leads đạt được
- [ ] Phân tích CPL thực tế
- [ ] Follow-up với từng lead qua email/Zalo
- [ ] Đề xuất chiến dịch tiếp theo

---

## 9. Output Files

| File | Location |
|------|---------|
| Landing Page | `src/pages/OfficialPage.jsx` |
| Ad Visuals | `public/assets/campaign/official/` |
| Social Content | `output/marketing/2026-03-31-smax-insight-launch/content/social-posts.md` |
| Campaign Plan | `output/marketing/2026-03-31-smax-insight-launch/campaign-plan.md` |

---

*Lần cập nhật: 2026-03-31*
