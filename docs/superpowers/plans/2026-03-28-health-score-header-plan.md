# Health Score Header — Diagnostic at a Glance

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nâng cấp HealthScoreHeader từ card đơn giản → diagnostic dashboard: score + breakdown bars 10 nhóm bệnh + critical alert chip + scroll-to-disease.

**Architecture:** Single component rewrite + 1 id-attribute fix trong DiseaseItemLayout. Logic data lấy từ `diseases` prop (đã computed bên ngoài). Không thay đổi medicalService.

**Tech Stack:** React 19, Tailwind CSS v4 (CSS variables), Lucide React icons, Recharts (không dùng — pure CSS bars)

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/medical/DiseaseItemLayout.jsx` | Thêm `id={`disease-${disease.id}`}` vào root `<div>` |
| `src/components/medical/HealthScoreHeader.jsx` | Rewrite hoàn toàn theo 4-zone spec |
| `src/components/medical/MedicalResultStep.jsx` | Truyền `diseases` (đã có), không cần thay đổi logic khác |

---

## Task 1: Add scroll anchor ID to DiseaseItemLayout

**Files:**
- Modify: `d:\vibe-coding\Nâng cấp AI Insight\src\components\medical\DiseaseItemLayout.jsx`

- [ ] **Step 1: Read DiseaseItemLayout.jsx**

Read the full file. Find the root `<div>` that wraps the disease item. It should have `className` containing `bg-surface-container-low rounded-[--radius-xl]`.

- [ ] **Step 2: Add id attribute**

In the root `<div>` of `DiseaseItemLayout`, add:

```jsx
<div
  id={`disease-${disease.id}`}
  className="bg-surface-container-low rounded-[--radius-xl] ..."
  ...
>
```

Keep everything else identical. The `id` prop allows `scrollIntoView` từ HealthScoreHeader bars.

- [ ] **Step 3: Commit**

```bash
cd "d:\vibe-coding\Nâng cấp AI Insight"
git add src/components/medical/DiseaseItemLayout.jsx
git commit -m "feat(medical): add scroll anchor id to DiseaseItemLayout"
```

---

## Task 2: Rewrite HealthScoreHeader.jsx

**Files:**
- Modify: `d:\vibe-coding\Nâng cấp AI Insight\src\components\medical\HealthScoreHeader.jsx`
- Read (first): `d:\vibe-coding\Nâng cấp AI Insight\src\lib\medicalService.js` — function signatures only (`getMedicalHistory`, `getHealthScore`, `getHealthLabel`, `getHealthColor`)

- [ ] **Step 1: Read current HealthScoreHeader.jsx and medicalService.js**

Focus on:
- `getMedicalHistory()` → returns `[{ score, date, ... }]`
- `getHealthScore(diseases)` → returns number 0-10
- `getHealthLabel(score)` → returns string like "Cần cải thiện"
- `getHealthColor(score)` → returns hex color string

- [ ] **Step 2: Write the full rewrite**

Replace the entire content of `HealthScoreHeader.jsx` with this complete implementation:

```jsx
import { useState, useCallback, useMemo } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  getHealthScore,
  getHealthLabel,
  getHealthColor,
  getMedicalHistory,
} from '../../lib/medicalService';

/**
 * Disease code labels (2-char abbreviations)
 */
const CODE_LABELS = {
  'lead-quality':    'LQ',
  'response-speed':  'RS',
  'staff-performance': 'NV',
  'competitor':      'ĐT',
  'post-purchase':   'KH',
  'objection-handling': 'KB',
  'abandoned-chat':  'BD',
  'tone-language':   'NN',
  'upsell':          'US',
  'legal-risk':      'PL',
};

/**
 * Disease full-name labels
 */
const LABEL_MAP = {
  'lead-quality':    'Chất Lượng Nguồn Lead',
  'response-speed':  'Phản Hồi & Chăm Sóc',
  'staff-performance': 'Nhân Viên Tư Vấn',
  'competitor':      'Đối Thủ Cạnh Tranh',
  'post-purchase':   'CSKH & Hậu Mua',
  'objection-handling': 'Kịch Bản Tư Vấn',
  'abandoned-chat':  'Cuộc Trò Chuyện Bỏ Dở',
  'tone-language':   'Ngôn Ngữ & Cách Giao Tiếp',
  'upsell':          'Upsell / Cross-sell',
  'legal-risk':      'Rủi Ro Pháp Lý',
};

/**
 * HealthScoreHeader — Diagnostic at a Glance
 * 4 zones: Score block | Progress bar | Breakdown bars | Critical chip
 */
export function HealthScoreHeader({ diseases, recordDate }) {
  const score = getHealthScore(diseases);
  const label = getHealthLabel(score);
  const color = getHealthColor(score);

  // ── Medical history ──
  const history = getMedicalHistory();
  const hasHistory = history.length >= 2;
  const prevScore = hasHistory ? history[history.length - 2]?.score : null;
  const delta = hasHistory && prevScore != null ? score - prevScore : null;

  // ── Date/time ──
  const dt = recordDate ? new Date(recordDate) : new Date();
  const formattedDate = dt.toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
  const formattedTime = dt.toLocaleTimeString('vi-VN', {
    hour: '2-digit', minute: '2-digit'
  });

  // ── Progress ──
  const progressPct = Math.round((score / 10) * 100);

  // ── Breakdown bars data ──
  const barData = useMemo(() => {
    const all = diseases.map(d => ({
      id: d.id,
      code: CODE_LABELS[d.id] || d.code || d.id.slice(0, 2).toUpperCase(),
      fullName: LABEL_MAP[d.id] || d.label || d.id,
      score: d.score ?? 5,
      isWeak: (d.score ?? 10) < 5,
      isStrong: (d.score ?? 0) >= 7.5,
      hasData: !d.industryAgnostic || (d.metrics && d.metrics.some(m => (m.value ?? 0) > 0)),
      topRecommendation: d.recommendations?.[0]?.title ?? null,
    })).filter(d => d.hasData);

    return all.sort((a, b) => a.score - b.score); // yếu nhất lên đầu
  }, [diseases]);

  const topWeak = barData.filter(d => d.isWeak).slice(0, 3);
  const critical = topWeak[0] ?? null;

  const maxBarScore = 10;
  const barHeightPx = 8;

  // ── Scroll to disease ──
  const handleBarClick = useCallback((diseaseId) => {
    document.getElementById(`disease-${diseaseId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  // ── Score < 3 → emergency ──
  const isEmergency = score < 3;

  return (
    <div className="bg-surface-container-low rounded-[--radius-xl] p-6 mb-6">
      {/* ── Emergency banner ── */}
      {isEmergency && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-[--radius-md] bg-error/10 border border-error/20">
          <AlertTriangle size={16} className="text-error shrink-0" />
          <span className="text-body-sm font-semibold text-error">
            Cảnh báo khẩn: Điểm sức khỏe rất thấp — Cần hành động ngay
          </span>
        </div>
      )}

      {/* ── Top row: score + delta + meta ── */}
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Score block */}
        <div className="flex items-end gap-4">
          <div>
            <div className="text-label-sm text-on-surface-variant mb-1">
              ĐIỂM SỨC KHỎE TỔNG QUAN
            </div>
            <div className="flex items-end gap-2">
              <span
                className="text-display-lg font-bold leading-none"
                style={{ color }}
              >
                {score.toFixed(1)}
              </span>
              <span className="text-headline-sm text-on-surface-variant font-normal pb-1">
                / 10
              </span>
            </div>
            <div
              className="inline-block mt-2 px-2.5 py-1 rounded-full text-label-sm font-bold"
              style={{ backgroundColor: `${color}18`, color }}
            >
              {label}
            </div>
          </div>

          {/* Delta — only show when history exists */}
          {delta !== null && delta !== 0 && (
            <div className={cn(
              'flex items-center gap-1 pb-1',
              delta > 0 ? 'text-success' : 'text-error'
            )}>
              {delta > 0
                ? <TrendingUp size={14} />
                : <TrendingDown size={14} />
              }
              <span className="text-body-sm font-semibold">
                {Math.abs(delta).toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Critical chip — nhóm bệnh yếu nhất */}
        {critical && !isEmergency && (
          <button
            onClick={() => handleBarClick(critical.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm font-semibold shrink-0
                       bg-warning/10 text-warning border border-warning/20 cursor-pointer hover:bg-warning/20 transition-colors"
          >
            <AlertTriangle size={12} />
            <span>
              {critical.fullName} ({critical.score.toFixed(1)})
            </span>
          </button>
        )}

        {/* Meta — date/time */}
        <div className="text-right shrink-0">
          <div className="text-body-sm text-on-surface">{formattedDate}</div>
          <div className="text-body-sm text-on-surface-variant">{formattedTime}</div>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="mb-5">
        <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex items-center justify-between text-body-sm text-on-surface-variant mt-1.5">
          <span>Nghiêm trọng</span>
          <span>Tốt</span>
        </div>
      </div>

      {/* ── Breakdown bars — only if ≥ 1 disease ── */}
      {barData.length > 0 && (
        <div>
          <div className="text-label-sm text-on-surface-variant mb-3">
            ĐÓNG GÓP THEO NHÓM BỆNH
          </div>

          {/* Bar labels row */}
          <div className="flex gap-3 mb-1 flex-wrap">
            {barData.map(d => (
              <div key={d.id} className="flex flex-col items-center min-w-[28px]">
                <span className="text-label-sm text-on-surface-variant mb-0.5">
                  {d.code}
                </span>
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="flex gap-3 items-end flex-wrap">
            {barData.map(d => {
              const barWidthPct = (d.score / maxBarScore) * 100;
              const isHighlighted = d.isWeak || d.isStrong;

              return (
                <div
                  key={d.id}
                  className="flex flex-col items-center gap-1 flex-1 min-w-[28px] max-w-[80px]"
                >
                  {/* Bar track */}
                  <button
                    onClick={() => handleBarClick(d.id)}
                    title={`${d.fullName}: ${d.score.toFixed(1)}/10 — Click để xem chi tiết`}
                    className={cn(
                      'w-full rounded-sm transition-all cursor-pointer',
                      isHighlighted ? 'h-3' : 'h-2'
                    )}
                    style={{
                      backgroundColor: d.isWeak
                        ? 'var(--color-error)'
                        : d.isStrong
                          ? 'var(--color-success)'
                          : 'var(--color-tertiary)',
                      opacity: isHighlighted ? 1 : 0.45,
                      height: `${barHeightPx + (isHighlighted ? 4 : 0)}px`,
                      width: `${barWidthPct}%`,
                      maxWidth: '100%',
                      minWidth: '4px',
                    }}
                  />
                  {/* Score value */}
                  <span className={cn(
                    'text-label-sm font-semibold',
                    d.isWeak ? 'text-error' : d.isStrong ? 'text-success' : 'text-on-surface-variant'
                  )}>
                    {d.score.toFixed(1)}
                  </span>
                  {/* Weak indicator */}
                  {d.isWeak && (
                    <AlertTriangle size={8} className="text-error" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-label-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-error opacity-100" />
              <span>Cần cải thiện (&lt; 5)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-success opacity-100" />
              <span>Tốt (≥ 7.5)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-tertiary opacity-45" />
              <span>Trung bình</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Build verification**

Run:
```bash
cd "d:\vibe-coding\Nâng cấp AI Insight"
npm run build 2>&1 | tail -30
```
Expected: Build successful (0 errors)

- [ ] **Step 4: Test in browser**

Open `http://localhost:5173/insight/medical-checkup`, complete the wizard (Step 5), verify:
- Score hiển thị đúng màu (theo getHealthColor)
- Breakdown bars hiển thị đúng thứ tự yếu → mạnh
- Top 3 yếu nhất: màu đỏ, hiện icon ⚠️
- Top 2 tốt nhất: màu xanh
- Click thanh → cuộn xuống disease card tương ứng
- Nếu score < 3: emergency banner hiện
- Nếu score ≥ 7: critical chip ẩn

- [ ] **Step 5: Commit**

```bash
cd "d:\vibe-coding\Nâng cấp AI Insight"
git add src/components/medical/HealthScoreHeader.jsx
git commit -m "feat(medical): rewrite HealthScoreHeader to Diagnostic at a Glance"
```

---

## Verification Checklist

- [ ] Build: `npm run build` → 0 error
- [ ] Score block: màu đúng theo score zone (green/yellow/red)
- [ ] Delta: hiện khi ≥ 2 lần khám, ẩn khi lần đầu
- [ ] Breakdown bars: đúng thứ tự yếu → mạnh, highlight đỏ/xanh theo rule
- [ ] Click bar: scrollIntoView đến disease card
- [ ] Critical chip: hiện với nhóm yếu nhất, click → scroll
- [ ] Emergency: banner hiện khi score < 3
- [ ] Medical history: `getMedicalHistory()` được gọi, không crash
- [ ] Console: 0 errors khi render HealthScoreHeader
