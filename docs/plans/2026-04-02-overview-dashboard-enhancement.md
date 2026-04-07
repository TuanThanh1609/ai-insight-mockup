# CEO Command Center Dashboard — Enrichment Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bổ sung 4 Pillar components với đầy đủ metrics, cập nhật mock data để dashboard tổng quan CEO scan trong 3 giây với tất cả thông tin cần thiết.

**Architecture:** Mở rộng 4 Pillar components hiện tại — mỗi pillar bổ sung metrics mới từ `supabase-conversations.json` (data thật) và `mockCampaigns.js`. Không tạo component mới. Mock data mở rộng trong `medicalService.js` và `seed-conversations.js`. ChartsSection mở rộng thêm 2 chart nhỏ.

---

## Background — Data Available

| Nguồn | File | Độ phủ |
|--------|------|--------|
| Conversations | `src/data/supabase-conversations.json` (6,202 rows, 7 ngành) | Real fields: `temperature`, `phone_status`, `chot_don`, `missed_conv`, `silent_cust`, `attitude`, `satisfaction`, `is_junk`, `is_returning_customer`, `pain_point`, `objection`, `competitor_name`, `criteria`, `product`, `size`, `location`, `budget`, `segment` |
| Campaigns | `src/data/mockCampaigns.js` | 5 campaigns × fields: `spend`, `revenue`, `ordersCount`, `qualityScore`, `conversionRate`, `phoneCollected` |
| Disease scoring | `src/lib/medicalService.js` — `computeDiseaseMetrics()` | 9 nhóm bệnh × sub-metrics (junk, phone, conversion, satisfaction...) |

---

## Phases

### Phase 1: Enrich Pillar A — Chất Lượng Hội Thoại
### Phase 2: Enrich Pillar B — Nhân Viên Tư Vấn
### Phase 3: Enrich Pillar C — Chăm Sóc Sau Mua
### Phase 4: Enrich Pillar D — Feedback Khách Hàng
### Phase 5: Expand ChartsSection + Mock Data

---

## Phase 1: Enrich Pillar A — Chất Lượng Hội Thoại

### Task 1: Enrich PillarConversation — bổ sung Junk Lead + Conversion Rate

**Files:**
- Modify: `src/components/overview/PillarConversation.jsx`

**Step 1: Đọc file hiện tại**

Run: Read `src/components/overview/PillarConversation.jsx`
Expected: Current version có TempBar + PhoneRate. Cần thêm JunkLeadBar + ConversionRow.

**Step 2: Thêm compute logic cho Junk Lead + Conversion**

Thêm vào function `PillarConversation`, sau phần phoneRate:

```jsx
// Junk Lead — available in fsh-2/mbb-2/spa-2 etc.
const junkLeads = conversations.filter(
  (c) => c.is_junk === true || c.is_junk === 'true' || c.junk_lead === true
).length;
const junkRate = total > 0 ? junkLeads / total : 0;

// Conversion — converted_at field
const converted = conversations.filter((c) => c.converted_at || c.converted === true).length;
const conversionRate = total > 0 ? converted / total : 0;
```

**Step 3: Thêm UI rows cho Junk + Conversion**

Thêm vào JSX return của `PillarConversation`, trong `<div className="flex flex-col gap-3">`:

```jsx
{/* Junk Lead */}
<div>
  <div className="flex items-center justify-between mb-1">
    <span className="text-[11px] text-primary opacity-50">Khách rác</span>
    <span className="text-[11px] font-semibold text-[#dc2626]">
      {junkRate > 0 ? `${junkRate > 0.05 ? '⚠️ ' : ''}${junkLeads} (${(junkRate * 100).toFixed(1)}%)` : '0 (0%)'}
    </span>
  </div>
  <div className="bg-[rgba(26,33,56,0.06)] rounded-full h-2">
    <div
      className="h-full rounded-full bg-[#dc2626]"
      style={{ width: `${Math.min(junkRate * 100 * 5, 100)}%` }}
    />
  </div>
</div>

{/* Conversion Rate */}
<div>
  <div className="flex items-center justify-between mb-1">
    <span className="text-[11px] text-primary opacity-50">Tỉ lệ chốt đơn</span>
    <span className="text-[11px] font-semibold text-[#059669]">
      {converted}/{total}
    </span>
  </div>
  <div className="bg-[rgba(26,33,56,0.06)] rounded-full h-2">
    <div
      className="h-full rounded-full bg-[#059669]"
      style={{ width: `${Math.min(conversionRate * 100 * 5, 100)}%` }}
    />
  </div>
</div>
```

**Step 4: Build để verify**

Run: `cd d:\vibe-coding\Nâng cấp AI Insight && npx vite build 2>&1 | tail -5`
Expected: `✓ built in XXs` — không có lỗi.

---

### Task 2: Enrich PillarConversation — bổ sung Top Products + Campaigns

**Files:**
- Modify: `src/components/overview/PillarConversation.jsx`

**Step 1: Thêm compute logic cho Top Products + Top Campaigns**

Thêm vào function `PillarConversation`:

```jsx
// Top Products (fsh-1/mbb-1 templates có field 'product')
const productCount = {};
conversations.forEach((c) => {
  if (c.product || c.service || c.data_json?.product || c.data_json?.service) {
    const p = c.product || c.service || c.data_json?.product || c.data_json?.service;
    productCount[p] = (productCount[p] || 0) + 1;
  }
});
const topProducts = Object.entries(productCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 4);

// Top Campaigns (từ mockCampaigns)
const { mockCampaigns } = require('../../data/mockCampaigns');
const topCampaigns = [...mockCampaigns]
  .sort((a, b) => b.conversations - a.conversations)
  .slice(0, 3);
```

> ⚠️ Nếu dùng `require` bị lỗi ESM, chuyển sang import ở đầu file.

**Step 2: Thêm UI chips cho Top Products + Campaign list**

Thêm vào JSX, sau PhoneRate block:

```jsx
{/* Top sản phẩm quan tâm */}
{topProducts.length > 0 && (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[11px] text-primary opacity-50">Sản phẩm quan tâm nhiều nhất</span>
    </div>
    <div className="flex flex-wrap gap-1">
      {topProducts.map(([product, count]) => (
        <span
          key={product}
          className="text-[10px] px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-medium"
        >
          {product} ({count})
        </span>
      ))}
    </div>
  </div>
)}

{/* Top chiến dịch */}
{topCampaigns.length > 0 && (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[11px] text-primary opacity-50">Chiến dịch nhiều hội thoại nhất</span>
    </div>
    <div className="flex flex-col gap-1">
      {topCampaigns.map((camp) => (
        <div key={camp.id} className="flex items-center justify-between">
          <span className="text-[11px] text-primary truncate max-w-[120px]">{camp.name}</span>
          <span className="text-[11px] font-semibold text-primary">{camp.conversations}</span>
        </div>
      ))}
    </div>
  </div>
)}
```

**Step 3: Build để verify**

Run: `npx vite build 2>&1 | tail -5`
Expected: `✓ built` không lỗi.

---

## Phase 2: Enrich Pillar B — Nhân Viên Tư Vấn

### Task 3: Enrich PillarStaffEval — bổ sung Attitude + Mistakes

**Files:**
- Modify: `src/components/overview/PillarStaffEval.jsx`

**Step 1: Đọc file hiện tại**

Run: Read `src/components/overview/PillarStaffEval.jsx`

**Step 2: Mở rộng compute logic**

Thêm vào component:

```jsx
// Attitude breakdown (from attitude field — fsh-3, mbb-3, spa-3, cos-3...)
const goodAttitude = conversations.filter(
  (c) => c.attitude === 'Tốt' || c.attitude === 'good' || c.attitude === 'positive'
).length;
const avgAttitude = conversations.filter(
  (c) => c.attitude === 'Trung bình' || c.attitude === 'average' || c.attitude === 'avg'
).length;
const poorAttitude = conversations.filter(
  (c) => c.attitude === 'Kém' || c.attitude === 'poor' || c.attitude === 'negative'
).length;
const withAttitude = goodAttitude + avgAttitude + poorAttitude;
const goodAttitudeRate = withAttitude > 0 ? goodAttitude / withAttitude : 0;

// Mistakes (from mistake field — available in staff-eval templates)
const mistakeCount = {};
conversations.forEach((c) => {
  const m = c.mistake || c.data_json?.mistake;
  if (m) mistakeCount[m] = (mistakeCount[m] || 0) + 1;
});
const topMistakes = Object.entries(mistakeCount).sort((a, b) => b[1] - a[1]).slice(0, 3);

// Staff scenario performance
const scenarioCount = {};
conversations.forEach((c) => {
  const s = c.scenario || c.data_json?.scenario;
  if (s) scenarioCount[s] = (scenarioCount[s] || 0) + 1;
});
const topScenarios = Object.entries(scenarioCount).sort((a, b) => b[1] - a[1]).slice(0, 2);
```

**Step 3: Thêm UI rows cho Attitude + Mistakes**

Thêm vào JSX return, sau section hiển thị chot_don/missed_conv/silent_cust:

```jsx
{/* Attitude breakdown */}
{withAttitude > 0 && (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] text-primary opacity-50">Thái độ tư vấn</span>
    </div>
    <div className="flex gap-2 text-[10px]">
      <span className="text-[#059669] font-semibold">✓ Tốt {goodAttitude} ({(goodAttitudeRate * 100).toFixed(0)}%)</span>
      {avgAttitude > 0 && <span className="text-[#d97706]">◯ TB {avgAttitude}</span>}
      {poorAttitude > 0 && <span className="text-[#dc2626]">✗ Kém {poorAttitude}</span>}
    </div>
  </div>
)}

{/* Top mistakes */}
{topMistakes.length > 0 && (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] text-primary opacity-50">Lỗi mất khách phổ biến</span>
    </div>
    <div className="flex flex-col gap-1">
      {topMistakes.map(([mistake, count]) => (
        <div key={mistake} className="flex items-center justify-between">
          <span className="text-[11px] text-primary opacity-60 truncate max-w-[100px]">{mistake}</span>
          <span className="text-[11px] font-semibold text-[#dc2626]">{count}</span>
        </div>
      ))}
    </div>
  </div>
)}

{/* Top selling scenarios */}
{topScenarios.length > 0 && (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] text-primary opacity-50">Kịch bản bán hàng</span>
    </div>
    <div className="flex flex-wrap gap-1">
      {topScenarios.map(([scenario, count]) => (
        <span key={scenario} className="text-[10px] px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-medium">
          {scenario} ({count})
        </span>
      ))}
    </div>
  </div>
)}
```

**Step 4: Build để verify**

Run: `npx vite build 2>&1 | tail -5`
Expected: `✓ built` không lỗi.

---

## Phase 3: Enrich Pillar C — Chăm Sóc Sau Mua

### Task 4: Enrich PillarPostPurchase — bổ sung CSKH metrics thực

**Files:**
- Modify: `src/components/overview/PillarPostPurchase.jsx`

**Step 1: Đọc file hiện tại**

Run: Read `src/components/overview/PillarPostPurchase.jsx`

**Step 2: Thêm compute logic mở rộng cho CSKH**

Thêm vào component:

```jsx
// is_returning_customer — real field từ seed-conversations.js
const returningCustomers = conversations.filter(
  (c) => c.is_returning_customer === true || c.is_returning_customer === 'true'
).length;
const returningRate = total > 0 ? returningCustomers / total : 0;

// Satisfaction breakdown
const satHaiLong = conversations.filter(
  (c) =>
    c.satisfaction === 'Hài lòng' ||
    c.satisfaction === 'Rất hài lòng' ||
    c.satisfaction === 'very_satisfied' ||
    c.satisfaction === 'satisfied'
).length;
const satTrungBinh = conversations.filter(
  (c) =>
    c.satisfaction === 'Trung bình' ||
    c.satisfaction === 'average' ||
    c.satisfaction === 'neutral'
).length;
const satKhongHaiLong = conversations.filter(
  (c) =>
    c.satisfaction === 'Không hài lòng' ||
    c.satisfaction === 'Rất không hài lòng' ||
    c.satisfaction === 'dissatisfied' ||
    c.satisfaction === 'very_dissatisfied'
).length;

// Can refer — positive word-of-mouth
const canRefer = conversations.filter(
  (c) => c.can_refer === true || c.can_refer === 'true' || c.refer_possible === true
).length;
const referRate = total > 0 ? canRefer / total : 0;

// Urgency signal — frustration flags
const urgencyCases = conversations.filter(
  (c) =>
    c.frustration === true ||
    c.frustration === 'true' ||
    c.urgency === true ||
    c.urgency === 'urgent'
).length;
```

**Step 3: Thêm UI CSKH rows**

Thêm vào JSX, sau phần returning donut:

```jsx
{/* Satisfaction breakdown */}
{(satHaiLong + satTrungBinh + satKhongHaiLong) > 0 && (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] text-primary opacity-50">Mức độ hài lòng</span>
    </div>
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#059669]">✓ Hài lòng</span>
        <span className="text-[11px] font-semibold text-[#059669]">{satHaiLong}</span>
      </div>
      {satTrungBinh > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#d97706]">◯ Trung bình</span>
          <span className="text-[11px] font-semibold text-[#d97706]">{satTrungBinh}</span>
        </div>
      )}
      {satKhongHaiLong > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#dc2626]">✗ Không hài lòng</span>
          <span className="text-[11px] font-semibold text-[#dc2626]">{satKhongHaiLong}</span>
        </div>
      )}
    </div>
  </div>
)}

{/* Refer / Giới thiệu */}
{referRate > 0 && (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] text-primary opacity-50">Có thể giới thiệu</span>
    </div>
    <div className="bg-[rgba(26,33,56,0.06)] rounded-full h-2">
      <div
        className="h-full rounded-full bg-[#059669]"
        style={{ width: `${Math.min(referRate * 100 * 5, 100)}%` }}
      />
    </div>
    <span className="text-[10px] text-primary opacity-50">{canRefer} khách có thể giới thiệu</span>
  </div>
)}

{/* Urgency / Bức xúc cases */}
{urgencyCases > 0 && (
  <div className="flex items-center gap-2 mt-1 px-2 py-1 rounded bg-[#dc2626]/5">
    <span className="text-[11px] text-[#dc2626] font-semibold">⚠️ {urgencyCases} tín hiệu bức xúc</span>
    <span className="text-[11px] text-primary opacity-50">— cần CSKH xử lý ngay</span>
  </div>
)}
```

**Step 4: Build để verify**

Run: `npx vite build 2>&1 | tail -5`
Expected: `✓ built` không lỗi.

---

## Phase 4: Enrich Pillar D — Feedback Khách Hàng

### Task 5: Enrich PillarFeedback — bổ sung Competitor + Trend + Pain Points

**Files:**
- Modify: `src/components/overview/PillarFeedback.jsx`

**Step 1: Đọc file hiện tại**

Run: Read `src/components/overview/PillarFeedback.jsx`

**Step 2: Thêm compute logic cho Competitor + Pain Points + Trends**

Thêm vào component:

```jsx
// Competitor mentions (fsh-5, spa-5, cos-5...)
const competitorMentions = {};
conversations.forEach((c) => {
  const name =
    c.competitor_name ||
    c.data_json?.competitor_name ||
    c.competitor;
  if (name) competitorMentions[name] = (competitorMentions[name] || 0) + 1;
});
const topCompetitors = Object.entries(competitorMentions)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3);
const competitorRate = conversations.length > 0
  ? Object.values(competitorMentions).reduce((s, n) => s + n, 0) / conversations.length
  : 0;

// Criteria so sánh (khi khách nhắc đến competitor)
const criteriaCount = {};
conversations.forEach((c) => {
  const crit = c.criteria || c.data_json?.criteria;
  if (crit) criteriaCount[crit] = (criteriaCount[crit] || 0) + 1;
});
const topCriteria = Object.entries(criteriaCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 4);

// Pain points (fsh-1, mbb-1, spa-1...)
const painPointCount = {};
conversations.forEach((c) => {
  const pp = c.pain_point || c.data_json?.pain_point || c.painPoint;
  if (pp) painPointCount[pp] = (painPointCount[pp] || 0) + 1;
});
const topPainPoints = Object.entries(painPointCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 4);

// Objections (fsh-2, spa-2...)
const objectionCount = {};
conversations.forEach((c) => {
  const obj = c.objection || c.data_json?.objection;
  if (obj) objectionCount[obj] = (objectionCount[obj] || 0) + 1;
});
const topObjections = Object.entries(objectionCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 4);

// Customer interest trends (fsh-4: budget, location, segment)
const budgetCount = {};
const locationCount = {};
conversations.forEach((c) => {
  const budget = c.budget || c.data_json?.budget;
  const location = c.location || c.data_json?.location;
  if (budget) budgetCount[budget] = (budgetCount[budget] || 0) + 1;
  if (location) locationCount[location] = (locationCount[location] || 0) + 1;
});
const topBudgets = Object.entries(budgetCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
const topLocations = Object.entries(locationCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
```

**Step 3: Thêm UI sections cho Competitor + Pain Points + Trends**

Thêm vào JSX, sau phần sentiment bar hiện tại:

```jsx
{/* Đối thủ cạnh tranh */}
{topCompetitors.length > 0 && (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] text-primary opacity-50">Đối thủ được nhắc đến</span>
      {competitorRate > 0.1 && (
        <span className="text-[10px] text-[#dc2626] font-semibold">⚠️ {(competitorRate * 100).toFixed(0)}%</span>
      )}
    </div>
    <div className="flex flex-col gap-1">
      {topCompetitors.map(([name, count]) => (
        <div key={name} className="flex items-center justify-between">
          <span className="text-[11px] text-primary opacity-70">{name}</span>
          <span className="text-[11px] font-semibold text-[#dc2626]">{count}x</span>
        </div>
      ))}
    </div>
  </div>
)}

{/* Tiêu chí so sánh */}
{topCriteria.length > 0 && (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] text-primary opacity-50">Tiêu chí so sánh</span>
    </div>
    <div className="flex flex-wrap gap-1">
      {topCriteria.map(([crit, count]) => (
        <span key={crit} className="text-[10px] px-2 py-0.5 rounded-full bg-[#d97706]/10 text-[#d97706] font-medium">
          {crit} ({count})
        </span>
      ))}
    </div>
  </div>
)}

{/* Pain Points + Objections */}
{(topPainPoints.length > 0 || topObjections.length > 0) && (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] text-primary opacity-50">Thắc mắc phổ biến</span>
    </div>
    <div className="flex flex-col gap-0.5">
      {[...topPainPoints, ...topObjections].slice(0, 4).map(([item, count], i) => (
        <div key={i} className="flex items-center justify-between">
          <span className="text-[11px] text-primary opacity-60 truncate max-w-[120px]">{item}</span>
          <span className="text-[11px] font-semibold text-primary shrink-0 ml-2">{count}</span>
        </div>
      ))}
    </div>
  </div>
)}

{/* Xu hướng quan tâm — Budget + Location */}
{(topBudgets.length > 0 || topLocations.length > 0) && (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] text-primary opacity-50">Xu hướng quan tâm</span>
    </div>
    <div className="flex flex-col gap-1">
      {topBudgets.slice(0, 2).map(([budget, count]) => (
        <div key={budget} className="flex items-center justify-between">
          <span className="text-[11px] text-primary opacity-60">💰 {budget}</span>
          <span className="text-[11px] font-semibold text-primary">{count}</span>
        </div>
      ))}
      {topLocations.slice(0, 2).map(([loc, count]) => (
        <div key={loc} className="flex items-center justify-between">
          <span className="text-[11px] text-primary opacity-60">📍 {loc}</span>
          <span className="text-[11px] font-semibold text-primary">{count}</span>
        </div>
      ))}
    </div>
  </div>
)}
```

**Step 4: Build để verify**

Run: `npx vite build 2>&1 | tail -5`
Expected: `✓ built` không lỗi.

---

## Phase 5: Enrich Seed Data + Seed Script

### Task 6: Mở rộng seed-conversations.js — bổ sung fields mới

**Files:**
- Modify: `scripts/seed-conversations.js`

**Step 1: Đọc seed script**

Run: Read `scripts/seed-conversations.js` (first 200 lines)

**Step 2: Bổ sung field pools cho mỗi template**

Thêm pools vào file, sau phần existing pools:

```js
// NEW: satisfaction pools (cho post-purchase templates: fsh-6, mbb-5, spa-6, cos-6...)
const SATISFACTION_POOL = [
  'Hài lòng', 'Hài lòng', 'Hài lòng', 'Hài lòng',  // 60% satisfied
  'Trung bình', 'Trung bình',                         // 20% neutral
  'Không hài lòng',                                   // 15% dissatisfied
  'Rất hài lòng',                                     // 5% very satisfied
];

// NEW: competitor pools (cho fsh-5, spa-5, cos-5...)
const COMPETITOR_POOL = [
  null, null, null, null, null, null, null,  // 70% không nhắc competitor
  'Shein', 'Shopee', 'Lazada', 'Zara', 'H&M', 'Nike',  // 30% nhắc competitor
];
const COMPETITOR_NAME_POOL = ['Shein', 'Shopee', 'Lazada', 'Zara', 'H&M', 'Nike', 'Adidas', 'Uniqlo', 'Maybelline', 'Innisfree'];
const CRITERIA_POOL = ['Giá cả', 'Chất lượng', 'Mẫu mã', 'Uy tín', 'Phí ship', 'Giao hàng nhanh'];

// NEW: pain_point pools (cho fsh-1, mbb-1, spa-1, cos-1...)
const PAIN_POINT_POOL = [
  'Giá cao hơn kỳ vọng', 'Không có size', 'Sợ hàng không chất lượng',
  'Hàng không giống ảnh', 'Lo ngại an toàn', 'Phí ship đắt',
  'Không biết chọn size nào', 'Chất lượng không đồng đều', 'Mẫu mã cũ',
];

// NEW: objection pools (cho fsh-2, spa-2, cos-2, fb-2...)
const OBJECTION_POOL = [
  'Giá đắt', 'Hỏi chồng', 'Cần suy nghĩ thêm', 'So sánh với chỗ khác',
  'Không có chi nhánh gần', 'Lo ngại hàng fake', 'Chưa cần ngay',
  'Pháp lý chưa rõ', 'Ngân sách không xác nhận',
];

// NEW: attitude pools (cho staff-eval templates: fsh-3, mbb-3, spa-3...)
const ATTITUDE_POOL = [
  'Tốt', 'Tốt', 'Tốt', 'Tốt',  // 50% good
  'Trung bình', 'Trung bình',   // 25% average
  'Kém',                           // 25% poor
];

// NEW: mistake pools (cho staff-eval)
const MISTAKE_POOL = [
  null, null, null, null,  // 70% không lỗi
  'Trả lời trễ', 'Tư vấn sai', 'Bỏ sót khách', 'Không follow-up',
  'Không chốt đơn được', 'Thái độ chưa tốt',
];

// NEW: scenario pools (cho staff-eval)
const SCENARIO_POOL = [
  'Tư vấn chi phí', 'Khai thác thông tin', 'Ưu đãi cá nhân hóa', 'Giải quyết vấn đề',
];

// NEW: satisfaction_reason pools
const SATISFACTION_REASON_POOL = [
  'Sản phẩm đúng mô tả', 'Giao hàng nhanh', 'Nhân viên tư vấn nhiệt tình',
  'Chất lượng vượt kỳ vọng', 'Đóng gói đẹp', 'Chương trình khuyến mãi tốt',
];
const DISSATISFACTION_REASON_POOL = [
  'Sản phẩm không đúng mô tả', 'Giao hàng chậm', 'Chất lượng kém',
  'Không được như ảnh', 'Nhân viên tư vấn không tốt', 'Không hỗ trợ đổi trả',
];

// NEW: budget pools (cho segmentation templates: fsh-4, mbb-4, spa-4...)
const BUDGET_POOL = [
  'Dưới 500K', '500K - 1 triệu', '1 - 3 triệu', '3 - 5 triệu', 'Trên 5 triệu',
];
const LOCATION_POOL = [
  'TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Biên Hòa',
  'Nha Trang', 'Huế', 'Quy Nhơn', 'Vũng Tàu',
];
const SEGMENT_POOL = [
  'Nhóm tuổi 18-25', 'Nhóm tuổi 25-35', 'Nhóm tuổi 35-45', 'Nhóm tuổi 45+',
  'Sinh viên', 'Nhân viên văn phòng', 'Mẹ bỉm', 'Người đi làm',
];

// NEW: is_returning_customer pools
const RETURNING_POOL = [
  false, false, false, false, false, false,  // 80% mới
  true, true,  // 20% quay lại
];

// NEW: frustration pools (urgent post-purchase)
const FRUSTRATION_POOL = [
  null, null, null, null, null, null, null, null,  // 88% không bức xúc
  true,  // 12% bức xúc
];

// NEW: urgency pools
const URGENCY_POOL = [
  null, null, null, null, null, null, null,  // 85%
  'Cần giao gấp', 'Cần tư vấn lại', 'Khiếu nại',
];
```

**Step 3: Cập nhật hàm generateRow() để include fields mới**

Tìm function `generateRow` trong seed-conversations.js. Thêm vào object trả về, sau các field hiện tại:

```js
// Thêm cho tất cả rows (universal fields)
satisfaction: sr(rowSeed + 97 * 7919) < 0.6
  ? SATISFACTION_POOL[sr(rowSeed + 97 * 7919 + 1) % SATISFACTION_POOL.length]
  : SATISFACTION_POOL[sr(rowSeed + 97 * 7919 + 2) % 2 === 0 ? 6 : 7],
is_returning_customer: RETURNING_POOL[sr(rowSeed + 98 * 7919) % RETURNING_POOL.length],
frustration: FRUSTRATION_POOL[sr(rowSeed + 99 * 7919) % FRUSTRATION_POOL.length],
can_refer: sr(rowSeed + 100 * 7919) % 10 < 3,  // 30% có thể giới thiệu

// Thêm cho template-4 (segmentation) và template-6 (post-purchase)
budget: BUDGET_POOL[sr(rowSeed + 101 * 7919) % BUDGET_POOL.length],
location: LOCATION_POOL[sr(rowSeed + 102 * 7919) % LOCATION_POOL.length],
segment: SEGMENT_POOL[sr(rowSeed + 103 * 7919) % SEGMENT_POOL.length],

// Thêm cho template-5 (competitor)
competitor_name: COMPETITOR_POOL[sr(rowSeed + 104 * 7919) % COMPETITOR_POOL.length] === null
  ? null
  : COMPETITOR_NAME_POOL[sr(rowSeed + 105 * 7919) % COMPETITOR_NAME_POOL.length],
criteria: sr(rowSeed + 106 * 7919) % 10 < 3
  ? CRITERIA_POOL[sr(rowSeed + 107 * 7919) % CRITERIA_POOL.length]
  : null,

// Thêm cho template-3 (staff eval)
attitude: ATTITUDE_POOL[sr(rowSeed + 108 * 7919) % ATTITUDE_POOL.length],
mistake: MISTAKE_POOL[sr(rowSeed + 109 * 7919) % MISTAKE_POOL.length],
scenario: SCENARIO_POOL[sr(rowSeed + 110 * 7919) % SCENARIO_POOL.length],

// Thêm cho template-1 (pain point)
pain_point: PAIN_POINT_POOL[sr(rowSeed + 111 * 7919) % PAIN_POINT_POOL.length],

// Thêm cho template-2 (objection)
objection: OBJECTION_POOL[sr(rowSeed + 112 * 7919) % OBJECTION_POOL.length],
```

> ⚠️ Xem lại `generateRow` signature để biết `rowSeed` được tính thế nào trước khi thêm fields. Dùng offset nhân với số nguyên tố lớn (7919) để tránh trùng lặp với các field cũ.

**Step 4: Build và verify không lỗi**

Run: `npx vite build 2>&1 | tail -5`
Expected: `✓ built`

---

### Task 7: Regenerate Supabase data + Export JSON

**Files:**
- Run: `node scripts/seed-conversations.js`
- Run: `node scripts/export-conversations.cjs`

**Step 1: Seed Supabase**

Run: `cd d:\vibe-coding\Nâng cấp AI Insight && node scripts/seed-conversations.js`
Expected: Log output: "✅ Seeded N rows across X templates"

**Step 2: Export to JSON**

Run: `node scripts/export-conversations.cjs`
Expected: File `src/data/supabase-conversations.json` cập nhật, kích thước tăng lên.

**Step 3: Build**

Run: `npx vite build 2>&1 | grep -E "(error|Error|built in)"`
Expected: `✓ built in XXs`

---

## Phase 6: Expand ChartsSection

### Task 8: ChartsSection — bổ sung 2 mini charts nhỏ

**Files:**
- Modify: `src/components/overview/ChartsSection.jsx`

**Step 1: Đọc file hiện tại**

Run: Read `src/components/overview/ChartsSection.jsx`

**Step 2: Bổ sung mini chart — Top Products Bar**

Thêm vào ChartsSection:

```jsx
// Top products
const productCount = {};
conversations.forEach((c) => {
  const p = c.product || c.data_json?.product;
  if (p) productCount[p] = (productCount[p] || 0) + 1;
});
const topProducts = Object.entries(productCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 6);

return (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Revenue vs Spend — existing */}
    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm">
      <h3 className="text-[13px] font-semibold text-primary mb-4">Doanh thu vs Chi tiêu</h3>
      {/* ... existing bar chart ... */}
    </div>

    {/* Temperature Funnel — existing */}
    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm">
      <h3 className="text-[13px] font-semibold text-primary mb-4">Phễu Nhiệt Độ Lead</h3>
      {/* ... existing funnel ... */}
    </div>

    {/* NEW: Top Products */}
    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm">
      <h3 className="text-[13px] font-semibold text-primary mb-4">Top Sản Phẩm Quan Tâm</h3>
      <div className="flex flex-col gap-2">
        {topProducts.map(([product, count], i) => {
          const maxCount = topProducts[0]?.[1] || 1;
          const pct = (count / maxCount) * 100;
          return (
            <div key={product} className="flex items-center gap-2">
              <span className="text-[11px] text-primary w-4 text-center shrink-0">{i + 1}</span>
              <div className="flex-1 bg-[rgba(26,33,56,0.06)] rounded-full h-4">
                <div
                  className="h-full rounded-full bg-tertiary"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[11px] text-primary shrink-0 w-20 truncate">{product}</span>
              <span className="text-[11px] font-semibold text-primary shrink-0">{count}</span>
            </div>
          );
        })}
        {topProducts.length === 0 && (
          <p className="text-[12px] text-primary opacity-40 italic">Chưa có dữ liệu sản phẩm</p>
        )}
      </div>
    </div>

    {/* NEW: Top Locations */}
    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm">
      <h3 className="text-[13px] font-semibold text-primary mb-4">Top Khu Vực Khách Hàng</h3>
      <div className="flex flex-col gap-2">
        {(() => {
          const locCount = {};
          conversations.forEach((c) => {
            const loc = c.location || c.data_json?.location;
            if (loc) locCount[loc] = (locCount[loc] || 0) + 1;
          });
          const topLocs = Object.entries(locCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
          const maxLoc = topLocs[0]?.[1] || 1;
          return topLocs.length > 0 ? topLocs.map(([loc, count], i) => {
            const pct = (count / maxLoc) * 100;
            return (
              <div key={loc} className="flex items-center gap-2">
                <span className="text-[11px] text-primary w-4 text-center shrink-0">{i + 1}</span>
                <div className="flex-1 bg-[rgba(26,33,56,0.06)] rounded-full h-4">
                  <div
                    className="h-full rounded-full bg-secondary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-primary shrink-0 w-20 truncate">{loc}</span>
                <span className="text-[11px] font-semibold text-primary shrink-0">{count}</span>
              </div>
            );
          }) : (
            <p className="text-[12px] text-primary opacity-40 italic">Chưa có dữ liệu khu vực</p>
          );
        })()}
      </div>
    </div>
  </div>
);
```

**Step 3: Build để verify**

Run: `npx vite build 2>&1 | tail -5`
Expected: `✓ built` không lỗi.

---

## Phase 7: Deploy

### Task 9: Deploy Vercel + Verify

**Step 1: Deploy**

Run: `cd d:\vibe-coding\Nâng cấp AI Insight && npx vercel --prod 2>&1`
Expected: Deployment URL, status ● Ready

**Step 2: Set alias**

Run: `npx vercel alias set <deployment-url> ai-insight-mockup.vercel.app 2>&1`
Expected: Alias set

**Step 3: Verify route hoạt động**

Run: `curl -s -o /dev/null -w "%{http_code}" "https://ai-insight-mockup.vercel.app/insight/overview"`
Expected: `200`

**Step 4: Commit changes**

Run:
```bash
cd d:\vibe-coding\Nâng cấp AI Insight
git add src/components/overview/ scripts/ src/data/supabase-conversations.json
git status --short
```
Expected: Các file đã modify hiển thị.

---

## Summary — File Touches

| File | Action | Task |
|------|--------|------|
| `src/components/overview/PillarConversation.jsx` | Modify | 1, 2 |
| `src/components/overview/PillarStaffEval.jsx` | Modify | 3 |
| `src/components/overview/PillarPostPurchase.jsx` | Modify | 4 |
| `src/components/overview/PillarFeedback.jsx` | Modify | 5 |
| `src/components/overview/ChartsSection.jsx` | Modify | 8 |
| `scripts/seed-conversations.js` | Modify | 6 |
| `scripts/export-conversations.cjs` | Run | 7 |
| `src/data/supabase-conversations.json` | Regenerate | 7 |
| `CLAUDE.md` | Update Session Log | 9 |
