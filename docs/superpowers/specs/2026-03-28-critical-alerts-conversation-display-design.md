# Spec: Fix Cảnh Báo Khẩn — Hiển thị Hội Thoại

**Date:** 2026-03-28
**Status:** Draft → Pending User Review
**Author:** AI

---

## Context

CriticalAlertsPanel hiện tại có 2 vấn đề:

1. **Font to** — text-[12px] trong row có nhiều element, summary bị cắt `...` → user không đọc được đủ nội dung vấn đề
2. **Nội dung lặp** — `getConversationExamples()` pick 10 khách nhưng gán **cùng 1 fixed summary string** cho tất cả → tất cả 10 dòng đều hiện "Khách nhắn 1-2 tin rồi..."

**Mục tiêu:** User scan trong 3 giây → thấy chi tiết hội thoại khi expand alert, không cần mở ConversationDetailPanel.

---

## Design

### File sửa
`src/components/medical/CriticalAlertsPanel.jsx`

### 1. Font nhỏ + 2 dòng không truncation

**Alert Row đã expand — per conversation row:**

```
[PlatformIcon 20px] [16px gap] [Tên + Summary 2 dòng] [Spacer] [TempDot + Time]
```

| Element | Style |
|---------|-------|
| Tên khách | `text-[11px]`, `font-semibold`, `text-[--text-primary]` |
| Summary | `text-[11px]`, `text-[--text-secondary]`, `line-clamp-2` (2 dòng, không truncate) |
| Row padding | `py-1.5 px-3` |
| Row separator | `border-b border-[--surface-secondary]` |

### 2. Summary đa chiều từ data thực

Thay fixed string bằng **summary ghép 2–3 field thực từ hội thoại:**

```
"🔥 Nóng · 📞 Đã thu thập · 😤 Bức xúc"
"🌡️ Ấm · ❌ Chưa thu thập · 😑 Băn khoăn"
"❄️ Lạnh · 🚫 Từ chối · 📉 1 tin"
```

**Logic ghép summary** (`buildConversationSummary(conv)`):
- `temperature` → emoji: Nóng/Ấm/Lạnh
- `phoneStatus` → icon: Đã thu thập / Chưa thu thập / Từ chối
- `sentiment` → emoji: Bức xúc / Băn khoăn / Tiêu cực / Tích cực
- Fallback: nếu field không có → bỏ qua phần đó

**Priority field ghép:**
1. Nếu có `sentiment` → ghép temp + phone + sentiment
2. Nếu không có sentiment → ghép temp + phone + painPoint (ngắn)
3. Nếu không có painPoint → ghép temp + phone + objection ngắn

### 3. Deduplicate — pick 10 unique customer names

- Pick **10 hội thoại** unique (không trùng tên) từ pool
- Nếu pool < 10 → hiện bao nhiêu có bấy nhiêu
- Sắp xếp: Nóng trước → Ấm → Lạnh

---

## Components

### `buildConversationSummary(conv)` — helper function

```js
function buildConversationSummary(conv) {
  const parts = []
  if (conv.temperature) parts.push(tempEmoji(conv.temperature))
  if (conv.phoneStatus) parts.push(phoneLabel(conv.phoneStatus))
  if (conv.sentiment) parts.push(sentimentEmoji(conv.sentiment))
  else if (conv.painPoint) parts.push(conv.painPoint.slice(0, 20))
  else if (conv.objection) parts.push(conv.objection.slice(0, 20))
  return parts.join(' · ')
}
```

### Emoji/Icon mapping

| Field | Value | Display |
|-------|-------|---------|
| temperature | Nóng | 🔥 |
| temperature | Ấm | 🌡️ |
| temperature | Lạnh | ❄️ |
| phoneStatus | Đã thu thập | 📞 |
| phoneStatus | Chưa thu thập | ❌ |
| phoneStatus | Từ chối | 🚫 |
| sentiment | Bức xúc | 😤 |
| sentiment | Băn khoăn | 😑 |
| sentiment | Tiêu cực | 😞 |
| sentiment | Tích cực | 😊 |

---

## Verification

1. Mở `/insight/medical-checkup` → expand 1 alert (ví dụ: "Cuộc Trò Chuyện Bỏ Dở")
2. Kiểm tra: mỗi dòng hiện tên khách + summary 2 dòng, không có `...`
3. Kiểm tra: 10 dòng không trùng nội dung (mỗi dòng có temp/phone/sentiment khác nhau)
4. Build: `npm run build` ✅
