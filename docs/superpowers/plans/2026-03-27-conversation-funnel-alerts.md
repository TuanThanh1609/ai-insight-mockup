# Conversation Funnel + Critical Alerts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm Phễu Chuyển Đổi Hội Thoại (ConversationFunnelSection) vào MedicalResultStep + mở rộng CriticalAlertsPanel có expandable conversation examples.

**Architecture:** Component-driven. Tạo `ConversationFunnelSection.jsx` mới. Edit `MedicalResultStep.jsx` để chèn section mới. Edit `CriticalAlertsPanel.jsx` thêm accordion expand. Không có thay đổi kiến trúc lớn.

**Tech Stack:** React 19, Tailwind CSS v4, Lucide React icons, existing medicalService utilities.

---

## File Map

| File | Action |
|------|--------|
| `src/components/medical/ConversationFunnelSection.jsx` | CREATE — component mới |
| `src/components/medical/MedicalResultStep.jsx` | MODIFY — import & place new section |
| `src/components/medical/CriticalAlertsPanel.jsx` | MODIFY — add accordion + examples |

---

## Task 1: Create ConversationFunnelSection.jsx

**Files:**
- Create: `src/components/medical/ConversationFunnelSection.jsx`

---

- [ ] **Step 1: Write the component skeleton**

```jsx
import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

export function ConversationFunnelSection({ conversations, totalCount }) {
  // computed from conversations
  // render 2-column grid
  return <div>...</div>;
}
```

---

- [ ] **Step 2: Implement funnel data computation inside useMemo**

Thêm vào trong component, trước return:

```jsx
const { total, hotCount, phoneOkCount, junkCount, returningCount, warmCount } = useMemo(() => {
  const total = conversations.length;
  const hotCount = conversations.filter(r =>
    r.temperature === 'Nóng' || r.temperature === 'nóng'
  ).length;
  const phoneOkCount = conversations.filter(r =>
    r.phone_status === 'Đã cho SĐT' ||
    r.phone_status === 'Có SĐT' ||
    r.phone_status === true
  ).length;
  const junkCount = conversations.filter(r =>
    r.is_junk === true ||
    r.is_junk === 'true' ||
    r.junk_lead === true
  ).length;
  const returningCount = conversations.filter(r =>
    r.is_returning_customer === true ||
    r.is_returning_customer === 'true'
  ).length;
  const warmCount = conversations.filter(r =>
    r.temperature === 'Ấm' || r.temperature === 'ấm'
  ).length;
  return { total, hotCount, phoneOkCount, junkCount, returningCount, warmCount };
}, [conversations]);
```

---

- [ ] **Step 3: Build the 2-column layout**

```jsx
// Outer grid: 5 columns, funnel = 3 cols, sentiment = 2 cols
<div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-5">

  {/* LEFT — Funnel (3/5) */}
  <div className="lg:col-span-3 flex flex-col gap-3">

    {/* Section header */}
    <div className="flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0052ff" strokeWidth="2">
        <path d="M3 3v18h18"/><path d="M18 9l-5-6-4 8-3-2"/>
      </svg>
      <h2 className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
        Phễu Lead — {totalCount.toLocaleString('vi-VN')} Hội Thoại
      </h2>
    </div>

    {/* 4 funnel stages */}
    {/* ... (Step 4-7) */}

    {/* KH Quay Lại */}
    {/* ... (Step 8) */}

    {/* AI Suggestion */}
    {/* ... (Step 9) */}
  </div>

  {/* RIGHT — Sentiment (2/5) */}
  <div className="lg:col-span-2">
    {/* SentimentCard */}
  </div>

</div>
```

---

- [ ] **Step 4: Write FunnelStageRow helper component**

```jsx
function FunnelStageRow({ dotColor, label, count, total, subtitle, barColor }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
          <span className="text-body-sm font-semibold text-on-surface">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-display font-bold text-base" style={{ color: barColor }}>
            {count.toLocaleString('vi-VN')}
          </span>
          <span className="text-body-xs text-on-surface-variant">/ {total.toLocaleString('vi-VN')}</span>
          <span className="text-label-xs font-bold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${barColor}18`, color: barColor }}>
            {pct}%
          </span>
        </div>
      </div>
      {/* Bar */}
      <div className="h-1.5 rounded-full bg-[var(--color-outline-variant)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <span className="text-label-xs text-on-surface-variant">{subtitle}</span>
    </div>
  );
}
```

---

- [ ] **Step 5: Render 4 funnel stages**

Thêm vào trong div.left (sau section header):

```jsx
<div className="bg-surface-container-low rounded-[--radius-lg] p-4 flex flex-col gap-3">
  <FunnelStageRow
    dotColor="#dc2626" label="Lead Nóng"
    count={hotCount} total={total}
    barColor="#dc2626"
    subtitle="Hỏi giá + xin SĐT + hỏi còn không"
  />
  <FunnelStageRow
    dotColor="#059669" label="Thu thập SĐT"
    count={phoneOkCount} total={total}
    barColor="#059669"
    subtitle="Đã để lại số điện thoại"
  />
  <FunnelStageRow
    dotColor="#0052ff" label="Chốt đơn thành công"
    count={hotCount} total={total}
    barColor="#0052ff"
    subtitle="Chuyển đổi thành công"
  />
  <FunnelStageRow
    dotColor="#6b7280" label="Khách rác cần lọc"
    count={junkCount} total={total}
    barColor="#6b7280"
    subtitle="Tin tự động / bấm nhầm"
  />
</div>
```

---

- [ ] **Step 6: Write KH Quay Lại bar**

Thêm vào sau bg-surface-container-low block:

```jsx
<div className="bg-surface-container-low rounded-[--radius-lg] p-4">
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-2">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span className="text-label-sm font-semibold text-on-surface uppercase tracking-wide">
        Khách Hàng Quay Lại
      </span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="font-display font-bold text-base" style={{ color: '#d97706' }}>
        {returningCount.toLocaleString('vi-VN')}
      </span>
      <span className="text-body-xs text-on-surface-variant">/ {total.toLocaleString('vi-VN')}</span>
      <span className="text-label-xs font-bold px-1.5 py-0.5 rounded-full"
        style={{ backgroundColor: 'rgba(217,119,6,0.1)', color: '#d97706' }}>
        {total > 0 ? Math.round((returningCount / total) * 100) : 0}%
      </span>
    </div>
  </div>
  <div className="h-1.5 rounded-full bg-[var(--color-outline-variant)] overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-500"
      style={{
        width: `${total > 0 ? Math.round((returningCount / total) * 100) : 0}%`,
        backgroundColor: '#d97706',
      }}
    />
  </div>
</div>
```

---

- [ ] **Step 7: Write AI Suggestion panel**

Thêm vào sau KH Quay Lại bar:

```jsx
<div className="bg-white/80 backdrop-blur-12 rounded-[--radius-md] border border-[var(--color-outline-variant)] px-4 py-3">
  <div className="flex items-center gap-1.5 mb-2">
    <Sparkles size={13} className="text-[#0052ff]" />
    <span className="text-label-xs font-semibold text-[#0052ff] uppercase tracking-wide">
      Gợi ý từ AI
    </span>
  </div>
  <p className="text-body-sm text-on-surface leading-relaxed">
    Lead Nóng chiếm{' '}
    <span className="font-bold text-[#dc2626]">
      {total > 0 ? Math.round((hotCount / total) * 100) : 0}%
    </span>
    {` — tỉ lệ chốt đơn tiềm năng cao. `}
    {warmCount > 0 && (
      <>
        Ưu tiên nhắn lại khách <span className="font-bold text-[#d97706]">Ấm ({warmCount.toLocaleString('vi-VN')} người)</span> để chuyển thành Nóng.{' '}
      </>
    )}
    {junkCount > 0 && (
      <>
        Phát hiện <span className="font-bold text-[#6b7280]">{junkCount.toLocaleString('vi-VN')} khách rác</span> — đề xuất chặn nguồn spam.
      </>
    )}
  </p>
</div>
```

---

- [ ] **Step 8: Write SentimentCard component**

Thêm vào trong div.right (cột phải 2/5):

```jsx
function SentimentCard() {
  const SENTIMENT = { positive: 60, hesitant: 25, negative: 15 };
  const items = [
    { label: 'Tích cực', pct: SENTIMENT.positive, color: '#059669', bg: 'rgba(5,150,105,0.12)', icon: '😊', desc: 'Mặt cười' },
    { label: 'Băn khoăn', pct: SENTIMENT.hesitant, color: '#d97706', bg: 'rgba(217,119,6,0.12)', icon: '🤔', desc: 'Dấu hỏi' },
    { label: 'Tiêu cực', pct: SENTIMENT.negative, color: '#dc2626', bg: 'rgba(220,38,38,0.12)', icon: '😔', desc: 'Mặt buồn' },
  ];
  const maxPct = Math.max(...items.map(i => i.pct));

  return (
    <div className="bg-surface-container-low rounded-[--radius-lg] p-4 h-full">
      <h3 className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-3 text-center">
        Cảm Xúc Khách Hàng
      </h3>
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <div key={item.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span>{item.icon}</span>
                <span className="text-body-xs font-semibold text-on-surface">{item.label}</span>
              </div>
              <span className="text-label-sm font-bold" style={{ color: item.color }}>
                {item.pct}%
              </span>
            </div>
            {/* Bar: height proportional to pct, max 48px */}
            <div
              className="rounded-md flex items-center justify-end px-2 transition-all duration-500"
              style={{
                backgroundColor: item.bg,
                height: `${Math.max(24, Math.round((item.pct / maxPct) * 48))}px`,
                minHeight: '24px',
              }}
            >
              <span className="text-label-xs font-bold" style={{ color: item.color }}>
                {item.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Thêm vào cuối div.left trước đóng `</div>`:

```jsx
{/* RIGHT — Sentiment */}
<div className="lg:col-span-2">
  <SentimentCard />
</div>
```

---

- [ ] **Step 9: Finalize and export**

Đảm bảo file kết thúc với:

```jsx
export function ConversationFunnelSection({ conversations, totalCount }) {
  // ... all code above
}
```

Verify build: chạy `npm run build` — mong đợi 0 error, 0 warning liên quan.

---

## Task 2: Insert ConversationFunnelSection into MedicalResultStep

**Files:**
- Modify: `src/components/medical/MedicalResultStep.jsx:1-20`

---

- [ ] **Step 1: Add import**

Thêm vào đầu file, sau các import hiện tại:

```jsx
import { ConversationFunnelSection } from './ConversationFunnelSection';
```

---

- [ ] **Step 2: Place between HealthScoreHeader and LeadsQualityDashboard**

Tìm trong return:

```jsx
{/* ── Health Score ── */}
<div className="mb-5">
  <HealthScoreHeader diseases={diseases} />
</div>

{/* ── Leads Quality Dashboard ── */}
```

Thay thế thành:

```jsx
{/* ── Health Score ── */}
<div className="mb-5">
  <HealthScoreHeader diseases={diseases} />
</div>

{/* ── Conversation Funnel ── */}
<ConversationFunnelSection
  conversations={conversations}
  totalCount={conversations.length}
/>

{/* ── Leads Quality Dashboard ── */}
```

---

- [ ] **Step 3: Verify component placement**

Kiểm tra structure cuối cùng:
```
HealthScoreHeader
  → ConversationFunnelSection  ← NEW
  → LeadsQualityDashboard
  → Filter Tabs
  → DiseaseItemLayout list
  → SavedActionsBar
```

Verify build: `npm run build` — mong đợi 0 error.

---

## Task 3: Extend CriticalAlertsPanel with expandable conversation examples

**Files:**
- Modify: `src/components/medical/CriticalAlertsPanel.jsx`

---

- [ ] **Step 1: Add useState import**

Kiểm tra import đầu file. Thêm `useState` nếu chưa có:

```jsx
import { useState } from 'react';
```

---

- [ ] **Step 2: Add expandedId state to CriticalAlertsPanel**

Thêm vào đầu `CriticalAlertsPanel`:

```jsx
export function CriticalAlertsPanel({ diseases }) {
  const [expandedId, setExpandedId] = useState(null);
  // ... existing code
```

---

- [ ] **Step 3: Write conversation examples mock function**

Thêm trước `AlertRow`:

```jsx
/** Mock examples for each alert type — picks real customer names from conversations */
function getConversationExamples(alert, conversations) {
  // Pick 10 random customer names from conversations
  const pool = conversations.length > 0
    ? [...conversations].sort(() => Math.random() - 0.5).slice(0, 10)
    : [];

  const summaries = {
    junkLeadPercent: 'Tin tự động từ ads, khách không tương tác thêm',
    phoneCollected: 'Khách hỏi nhưng không để lại SĐT, rời đi ngay',
    conversionRate: 'Hỏi giá nhiều lần nhưng chưa chốt, đang cân nhắc',
    avgResponseMinutes: 'Phản hồi chậm > 30 phút, khách đã chuyển sang shop khác',
    remindRate: 'Khách có signal mua nhưng không được nhắc lại sau đó',
    personalOfferRate: 'Tư vấn chung chung, không đề xuất ưu đãi cá nhân hóa',
    mistakeRate: 'Sale đưa thông tin sai về size/sản phẩm, khách hủy đơn',
    goodAttitudePercent: 'Thái độ tích cực, nhiệt tình hỗ trợ — cần nhân rộng',
    competitorMentionRate: 'Khách so sánh với shop khác về giá và chất lượng',
    priceComparisonRate: 'Hỏi giá 3 shop trước khi quyết định mua',
    reviewRiskRate: 'Khách phàn nàn về chất lượng, dọa đăng review xấu',
    urgencyRate: 'Khách hỏi gấp nhưng nhận được phản hồi chậm trễ',
    objectionRate: 'Đặt câu hỏi về giá/chất lượng nhưng không được giải đáp rõ',
    ghostRate: 'Khách seen không rep sau tin đầu, nhân viên không follow-up',
    ignoredRecRate: 'Gợi ý sản phẩm bổ sung nhưng bị khách phớt lờ',
    upsellAttemptRate: 'Cố upsell sản phẩm cao cấp nhưng khách chọn bản rẻ hơn',
    overpromiseRate: 'Cam kết "đảm bảo 100%" nhưng không nêu điều kiện kèm theo',
    guaranteeRate: 'Nói "đổi trả thoải mái" nhưng không có chính sách cụ thể',
    abandonRate: 'Khách nhắn 1-2 tin rồi bỏ giữa chừng, không có closure',
    noClosureRate: 'Hội thoại kết thúc đột ngột, không có tin nhắn cuối',
    noFinalMsgRate: 'Khách không nhận được tin nhắn kết thúc từ nhân viên',
    badToneRate: 'Reply quá dài 15+ dòng, toàn emoji, không chuyên nghiệp',
    emojiOveruseRate: 'Dùng emoji liên tục trong tin nhắn tư vấn, gây nghiệp',
    longMsgRate: 'Tin nhắn > 5 dòng không có dấu, khách khó đọc',
  };

  const summary = summaries[alert.metricKey] || 'Hội thoại có vấn đề cần xem xét';

  return pool.map((row, idx) => ({
    id: `ex-${idx}`,
    customer: row.customer || `Khách hàng ${idx + 1}`,
    platform: row.platform || 'facebook',
    summary,
  }));
}
```

---

- [ ] **Step 4: Add PlatformIcon helper**

Thêm vào trước `AlertRow`:

```jsx
function PlatformIcon({ platform }) {
  if (platform === 'zalo') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#0068ff">
        <circle cx="12" cy="12" r="10" />
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Z</text>
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877f2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
```

---

- [ ] **Step 5: Refactor AlertRow to support expand**

Thay toàn bộ `AlertRow` bằng version có expand:

```jsx
function AlertRow({ alert, conversations, isExpanded, onToggle }) {
  const metricLabel = getVietnameseMetricLabel(alert);
  const alertId = `${alert.diseaseId}-${alert.metricKey}`;
  const examples = getConversationExamples(alert, conversations);

  return (
    <div className="flex flex-col">
      {/* Clickable header row */}
      <div
        className="flex items-start gap-2.5 px-3 py-2.5 rounded-[--radius-sm] transition-colors hover:bg-surface-container-low cursor-pointer"
        onClick={onToggle}
      >
        {/* Alert icon */}
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: alert.bg }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={alert.color} strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-body-sm font-semibold text-on-surface truncate">
              {alert.diseaseLabel}
            </span>
            <span className="text-body-sm font-medium text-on-surface-variant truncate">
              {metricLabel}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <span className="text-title-sm font-bold" style={{ color: alert.color }}>
              {alert.value}{alert.unit}
            </span>
            <button className="text-label-xs font-semibold px-2 py-0.5 rounded transition-colors shrink-0"
              style={{ color: alert.color, backgroundColor: alert.bg }}>
              {isExpanded ? '▲ Thu gọn' : `▼ Xem ${examples.length} hội thoại`}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded: conversation examples */}
      {isExpanded && (
        <div className="flex flex-col gap-0.5 px-3 pb-2 mt-0.5">
          {examples.map(ex => (
            <div
              key={ex.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-[--radius-sm] bg-surface-container-lowest"
            >
              <PlatformIcon platform={ex.platform} />
              <span className="text-body-xs font-medium text-on-surface truncate flex-1 min-w-0">
                {ex.customer}
              </span>
              <span className="text-body-xs text-on-surface-variant truncate shrink-1" style={{ maxWidth: '180px' }}>
                {ex.summary}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

- [ ] **Step 6: Update CriticalAlertsPanel to pass conversations + handle expand**

Thay `CriticalAlertsPanel` body (giữ nguyên phần imports, `getVietnameseMetricLabel`, `PlatformIcon`, `getConversationExamples`, `AlertRow` đã viết ở trên):

```jsx
export function CriticalAlertsPanel({ diseases, conversations = [] }) {
  const [expandedId, setExpandedId] = useState(null);
  const alerts = getTopCriticalMetrics(diseases, 6);
  const redAlerts = alerts.filter(a => a.level === 'red');
  const yellowAlerts = alerts.filter(a => a.level === 'yellow');

  const handleToggle = (alertId) => {
    setExpandedId(prev => prev === alertId ? null : alertId);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 mb-1 px-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <h3 className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
          Cảnh báo khẩn
        </h3>
        {redAlerts.length > 0 && (
          <span className="ml-auto text-label-xs font-bold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#dc2626' }}>
            {redAlerts.length}
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="px-3 py-4 text-center">
          <span className="text-body-sm text-on-surface-variant/60">Không có cảnh báo</span>
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {redAlerts.map(alert => {
            const alertId = `${alert.diseaseId}-${alert.metricKey}`;
            return (
              <AlertRow
                key={alertId}
                alert={alert}
                conversations={conversations}
                isExpanded={expandedId === alertId}
                onToggle={() => handleToggle(alertId)}
              />
            );
          })}
          {yellowAlerts.map(alert => {
            const alertId = `${alert.diseaseId}-${alert.metricKey}`;
            return (
              <AlertRow
                key={alertId}
                alert={alert}
                conversations={conversations}
                isExpanded={expandedId === alertId}
                onToggle={() => handleToggle(alertId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
```

---

- [ ] **Step 7: Update DiseaseItemLayout to pass conversations to CriticalAlertsPanel**

Mở `src/components/medical/DiseaseItemLayout.jsx`, tìm:

```jsx
<CriticalAlertsPanel diseases={[disease]} />
```

Thay bằng:

```jsx
<CriticalAlertsPanel diseases={[disease]} conversations={conversations} />
```

---

- [ ] **Step 8: Verify build**

Run `npm run build` — mong đợi 0 error liên quan đến 3 file trên.

---

## Task 4: Verify End-to-End

**Files:** — thực thi manual verification

---

- [ ] **Step 1: Run dev server**

```bash
cd "d:\vibe-coding\Nâng cấp AI Insight" && npm run dev
```
Mở trình duyệt → `/insight/medical-checkup` → chạy wizard 1→5 (chọn ngành Thời trang, số lượng 5.000).

---

- [ ] **Step 2: Verify ConversationFunnelSection**

Scroll xuống dưới HealthScoreHeader:
- Thấy "PHỄU LEAD — 5.000 HỘI THOẠI"
- 4 funnel bars: Lead Nóng (đỏ), Thu thập SĐT (xanh), Chốt đơn (xanh dương), Khách rác (xám)
- Bar "KH QUAY LẠI" (cam)
- AI Suggestion panel có sparkles icon
- Cột phải: 3 stacked sentiment blocks (Tích cực/Băn khoăn/Tiêu cực)

---

- [ ] **Step 3: Verify CriticalAlertsPanel expand**

Trong bất kỳ DiseaseItemLayout nào, click "Xem N hội thoại":
- Accordion expand, hiện list tên khách + platform icon + 1 dòng summary
- Click lại → thu gọn

---

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Mong đợi: Build successful, 0 error.

---

## Spec Self-Review Checklist

- [x] Spec coverage: Phễu 4 nấc + KH Quay Lại + AI suggestion + Sentiment card → **Task 1 ✓**
- [x] Spec coverage: Cảnh báo khẩn expandable → **Task 3 ✓**
- [x] Placement in MedicalResultStep → **Task 2 ✓**
- [x] No placeholder "TBD" / "TODO" in plan
- [x] Props consistent: `ConversationFunnelSection({ conversations, totalCount })` matches MedicalResultStep pass
- [x] `CriticalAlertsPanel` receives `conversations` prop from DiseaseItemLayout
- [x] PlatformIcon uses real platform values from data (`facebook` / `zalo`)
- [x] FunnelStageRow and SentimentCard are defined before use in ConversationFunnelSection
