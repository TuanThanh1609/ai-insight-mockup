# Health Score Header — Option E: 3-Column Diagnostic Layout

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nâng cấp HealthScoreHeader thành 3 cột: [Score] | [Cần cải thiện] | [Tốt] — scan 3 giây biết ngay nhóm nào kéo tụt, nhóm nào tốt.

**Architecture:** Single component rewrite. Data từ `diseases` prop. Phân loại nhóm theo score: yếu (<5) / trung bình (5-7.4) / tốt (≥7.5). Click item → scrollIntoView đến disease card. Không thay đổi medicalService.

**Tech Stack:** React 19, Tailwind CSS v4 (CSS variables), Lucide React icons

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/medical/DiseaseItemLayout.jsx` | Thêm `id={`disease-${disease.id}`}` vào root `<div>` |
| `src/components/medical/HealthScoreHeader.jsx` | Rewrite hoàn toàn theo Option E |
| `src/components/medical/MedicalResultStep.jsx` | Không đổi — `diseases` prop đã được truyền |

---

## Layout Wireframe (Option E)

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

---

## Task 1: Add scroll anchor ID to DiseaseItemLayout

**Files:**
- Modify: `d:\vibe-coding\Nâng cấp AI Insight\src\components\medical\DiseaseItemLayout.jsx`

- [ ] **Step 1: Read DiseaseItemLayout.jsx**

Read the full file. Find the root `<div>` that wraps the disease item (className contains `bg-surface-container-low`).

- [ ] **Step 2: Add id attribute**

In the root `<div>` of `DiseaseItemLayout`, add `id={`disease-${disease.id}`}`. Keep everything else identical.

```jsx
<div
  id={`disease-${disease.id}`}
  className="bg-surface-container-low rounded-[--radius-xl] ..."
  ...
>
```

- [ ] **Step 3: Commit**

```bash
cd "d:\vibe-coding\Nâng cấp AI Insight\.worktrees\feat\health-score-header"
git add src/components/medical/DiseaseItemLayout.jsx
git commit -m "feat(medical): add scroll anchor id to DiseaseItemLayout"
```

---

## Task 2: Rewrite HealthScoreHeader.jsx (Option E — 3 Columns)

**Files:**
- Modify: `d:\vibe-coding\Nâng cấp AI Insight\src\components\medical\HealthScoreHeader.jsx`
- Read (first): `d:\vibe-coding\Nâng cấp AI Insight\src\lib\medicalService.js` — focus on `getHealthScore`, `getHealthLabel`, `getHealthColor`, `getMedicalHistory`

- [ ] **Step 1: Read current HealthScoreHeader.jsx and medicalService.js**

Focus on:
- `getHealthScore(diseases)` → returns number 0-10
- `getHealthLabel(score)` → returns string like "Cần cải thiện"
- `getHealthColor(score)` → returns hex color string
- `getMedicalHistory()` → returns `[{ score, date }]`

- [ ] **Step 2: Write the full rewrite**

Replace the entire content of `HealthScoreHeader.jsx` with:

```jsx
import { useMemo, useCallback } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  getHealthScore,
  getHealthLabel,
  getHealthColor,
  getMedicalHistory,
} from '../../lib/medicalService';

/**
 * HealthScoreHeader — Option E: 3-Column Diagnostic Layout
 * Col 1: Score tổng + progress bar
 * Col 2: Nhóm Cần cải thiện (score < 5) + Trung bình (5 ≤ score < 7.5) thu gọn
 * Col 3: Nhóm Tốt (score ≥ 7.5)
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
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  const formattedTime = dt.toLocaleTimeString('vi-VN', {
    hour: '2-digit', minute: '2-digit',
  });

  const progressPct = Math.round((score / 10) * 100);

  // ── Disease group classification ──
  const { weak, medium, strong } = useMemo(() => {
    const all = diseases.map(d => ({
      id: d.id,
      label: d.label || d.id,
      score: d.score ?? 5,
      topRecommendation: d.recommendations?.[0]?.title ?? null,
    }));

    return {
      weak:   all.filter(d => d.score < 5).sort((a, b) => a.score - b.score),
      medium: all.filter(d => d.score >= 5 && d.score < 7.5).sort((a, b) => a.score - b.score),
      strong: all.filter(d => d.score >= 7.5).sort((a, b) => b.score - a.score),
    };
  }, [diseases]);

  // ── Scroll to disease ──
  const handleScrollTo = useCallback((diseaseId) => {
    document.getElementById(`disease-${diseaseId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const isEmergency = score < 3;

  // ── Render progress bar for a single item ──
  const ProgressBarMini = ({ value, color: barColor }) => (
    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${(value / 10) * 100}%`,
          backgroundColor: barColor,
        }}
      />
    </div>
  );

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

      {/* ── Top meta row ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-label-sm text-on-surface-variant">
          ĐIỂM SỨC KHỎE TỔNG QUAN
        </div>
        <div className="text-right">
          <div className="text-body-sm text-on-surface">{formattedDate}</div>
          <div className="text-body-sm text-on-surface-variant">{formattedTime}</div>
        </div>
      </div>

      {/* ── 3 COLUMN LAYOUT ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">

        {/* ── COLUMN 1: Score tổng ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-2">
            <span className="text-display-lg font-bold leading-none" style={{ color }}>
              {score.toFixed(1)}
            </span>
            <span className="text-headline-sm text-on-surface-variant font-normal pb-1">/ 10</span>
          </div>

          <div
            className="inline-block px-2.5 py-1 rounded-full text-label-sm font-bold self-start"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {label}
          </div>

          {delta !== null && delta !== 0 && (
            <div className={cn('flex items-center gap-1', delta > 0 ? 'text-success' : 'text-error')}>
              {delta > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span className="text-body-sm font-semibold">{Math.abs(delta).toFixed(1)}</span>
              <span className="text-body-sm text-on-surface-variant">so với lần khám trước</span>
            </div>
          )}

          {/* Progress bar lớn */}
          <div>
            <div className="h-3 bg-surface-container-high rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%`, backgroundColor: color }}
              />
            </div>
            <div className="flex justify-between text-body-sm text-on-surface-variant">
              <span>Nghiêm trọng</span>
              <span>Tốt</span>
            </div>
          </div>
        </div>

        {/* ── COLUMN 2: Cần cải thiện + Trung bình ── */}
        <div className="flex flex-col gap-3">
          {/* Cần cải thiện */}
          {weak.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle size={12} className="text-error shrink-0" />
                <span className="text-label-sm font-bold text-error">
                  CẦN CẢI THIỆN ({weak.length} nhóm)
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {weak.map(d => (
                  <div key={d.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-body-sm text-on-surface font-medium truncate max-w-[160px]">
                        {d.label}
                      </span>
                      <button
                        onClick={() => handleScrollTo(d.id)}
                        className="text-label-sm text-tertiary hover:text-tertiary/80 shrink-0 ml-2 cursor-pointer"
                      >
                        Xem →
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <ProgressBarMini value={d.score} color="var(--color-error)" />
                      <span className="text-label-sm font-semibold text-error shrink-0 w-7 text-right">
                        {d.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trung bình */}
          {medium.length > 0 && (
            <div>
              <div className="text-label-sm font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">
                Trung bình ({medium.length} nhóm)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {medium.map(d => (
                  <button
                    key={d.id}
                    onClick={() => handleScrollTo(d.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-[--radius-sm] bg-surface-container-high text-body-sm
                               hover:bg-surface-container-low cursor-pointer transition-colors"
                    title={`${d.label}: ${d.score.toFixed(1)}`}
                  >
                    <span className="text-label-sm text-on-surface-variant">{d.label}</span>
                    <span className="text-label-sm font-semibold text-tertiary">{d.score.toFixed(1)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── COLUMN 3: Tốt ── */}
        <div className="flex flex-col gap-3">
          {strong.length > 0 ? (
            <>
              <div className="flex items-center gap-1.5 mb-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="var(--color-success)" opacity="0.2" />
                  <path d="M8 12l3 3 5-5" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-label-sm font-bold text-success">
                  TỐT ({strong.length} nhóm)
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {strong.map(d => (
                  <div key={d.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-body-sm text-on-surface font-medium truncate max-w-[120px]">
                        {d.label}
                      </span>
                      <button
                        onClick={() => handleScrollTo(d.id)}
                        className="text-label-sm text-success hover:text-success/80 shrink-0 ml-2 cursor-pointer"
                      >
                        Xem →
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <ProgressBarMini value={d.score} color="var(--color-success)" />
                      <span className="text-label-sm font-semibold text-success shrink-0 w-7 text-right">
                        {d.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-body-sm text-on-surface-variant">
                Chưa có nhóm nào đạt mức Tốt
              </div>
              <div className="text-label-sm text-on-surface-variant mt-1">
                Cải thiện các nhóm Cần cải thiện để nâng điểm
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build verification**

```bash
cd "d:\vibe-coding\Nâng cấp AI Insight\.worktrees\feat\health-score-header"
npm run build 2>&1 | tail -10
```
Expected: Build successful (0 errors)

- [ ] **Step 4: Test in browser**

Open `http://localhost:5174/insight/medical-checkup`, complete wizard (Step 5), verify:
- 3 cột hiển thị đúng: Score | Cần cải thiện + Trung bình | Tốt
- Nhóm yếu (< 5): thanh đỏ, nút "Xem →" hoạt động
- Nhóm TB (5-7.4): chip nhỏ thu gọn
- Nhóm tốt (≥ 7.5): thanh xanh, nút "Xem →" hoạt động
- Click "Xem →" → cuộn đến disease card tương ứng
- Score < 3 → emergency banner hiện
- Score ≥ 7 → cột 3 hiện badge xanh

- [ ] **Step 5: Commit**

```bash
cd "d:\vibe-coding\Nâng cấp AI Insight\.worktrees\feat\health-score-header"
git add src/components/medical/HealthScoreHeader.jsx
git commit -m "feat(medical): HealthScoreHeader Option E — 3-column diagnostic layout"
```

---

## Verification Checklist

- [ ] Build: `npm run build` → 0 error
- [ ] 3 cột: Score | Cần cải thiện + TB | Tốt
- [ ] Nhóm yếu (<5): thanh đỏ, list chi tiết với progress bar mini
- [ ] Nhóm TB (5-7.4): chip nhỏ thu gọn (không chi tiết)
- [ ] Nhóm tốt (≥7.5): thanh xanh, list chi tiết
- [ ] "Xem →": scroll đến disease card
- [ ] Emergency: banner khi score < 3
- [ ] Delta: hiện khi ≥ 2 lần khám
- [ ] Console: 0 errors
