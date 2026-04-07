# CLAUDE.md — Dự Án AI Insight

> **Hướng dẫn:** Khi bắt đầu session mới, hỏi người dùng muốn làm track nào. Không nhảy qua lại giữa 2 track trong cùng một session. Sau khi xong, báo cáo kết quả và cập nhật **Session Log** (`.claude/memory/session-log.md`).

> **Chi tiết từng track:** xem `.claude/memory/track-a.md` (A), `track-b.md` (B), `track-c.md` (C). **Session log:** `.claude/memory/session-log.md`. **Cấu trúc dự án:** `.claude/memory/project-structure.md`.

---

## Design System — Editorial Precision

**Nguồn truth:** `DESIGN.md`

| Chiều | Mô tả |
|-------|-------|
| Primary | `#1A2138` Deep Navy |
| Secondary | `#BF3003` Deep Rust |
| Tertiary | `#0052FF` Vibrant Blue |
| Surface | `#fcf8fb` warm off-white |
| No-Line Rule | Dùng tonal shifts, không dùng 1px borders |
| Radius | 8px DEFAULT |
| Font Display | Manrope Bold |
| Font Body | Inter Regular |

---

## BA TRACK ĐỘC LẬP

### Track A — Cài Đặt Insight
- **Mục tiêu:** AI Engine phân tích hội thoại đa kênh → structured data fields theo prompt mỗi ngành
- **Cấu trúc:** 7 ngành × 6 insight = **42 template**
- **4 kiểu field:** True/False / Short Text / Single Choice / Multi-tag
- **Key fields:** Lead Temperature, Junk Lead, Objection (theo ngành), Priority Escalation
- **Chi tiết:** `.claude/memory/track-a.md`

### Track B — Dashboard Ads
- **Mục tiêu:** Dashboard CEO/CMO — scan trong 3 giây
- **2 routes:** `/insight/dashboard` (overview) + `/insight/ads-optimization` (AI recommendations)
- **ROAS color:** ≥3× xanh / ≥1.5× vàng / <1.5× đỏ
- **Chi tiết:** `.claude/memory/track-b.md`

### Track C — Marketing Team Agents
- **4 agents:** Market Research / Campaign Strategist / Social Content / Graphic Design
- **Pipeline:** Research → Strategy → Content → Design → Consolidation
- **Chi tiết:** `.claude/memory/track-c.md`

---

## LUẬT CHUNG — Áp Dụng Cả 3 Track

- **Tiếng Việt:** Tất cả prompt, output, field name đều là tiếng Việt. Không dịch.
- **Không hallucinate:** Chỉ trích xuất thông tin có trong dữ liệu. Không có → giá trị mặc định.
- **Không nhảy track:** Mỗi session chỉ làm 1 track. Muốn chuyển → kết thúc session hiện tại, báo cáo, rồi bắt đầu track mới.
- **Template truth:** `template-insight.md` là nguồn truth cho Track A.

---

## QUY TẮC DEPLOY VERCEL

Luôn kiểm tra **2 bước** trước khi báo deploy xong:
1. Kiểm tra alias: `npx vercel alias ls | grep "ai-insight-mockup.vercel.app"` → phải trỏ đúng deployment mới nhất
2. Verify route chính: `https://ai-insight-mockup.vercel.app/insight/medical-checkup` → phải hoạt động
3. Nếu `404: NOT_FOUND` → kiểm tra `vercel.json` ở **root project** (không phải `src/`)

Chi tiết: `.claude/rules/deploy-vercel.md`

---

## CẬP NHẬT SESSION LOG

Sau mỗi session, bắt buộc cập nhật `.claude/memory/session-log.md` với format:

```
### [Ngày] — Track [A/B/C]: [Tên tính năng]
- **Trạng thái:** ✅ Xong / ⚠️ Còn lỗi / 🔄 Đang làm dở
- **File đã sửa:** [danh sách file]
- **File đã tạo:** [danh sách file mới]
- **Bug đã fix:** [mô tả]
- **Còn cần làm:** [mô tả nếu chưa xong]
```
