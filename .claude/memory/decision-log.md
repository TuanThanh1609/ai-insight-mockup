# Decision Log — AI Insight Project

## 2026-04-07 — Mỗi Insight = 1 bảng riêng (không cộng dồn)

**Vấn đề:** Spec ban đầu cho phép chọn nhiều template → columns cộng dồn. User feedback muốn mỗi insight = 1 bảng riêng.
**Lựa chọn:**
1. Cộng dồn columns khi chọn nhiều template
2. Mỗi template = 1 bảng riêng, chọn insight → chỉ hiện bảng đó
**Quyết định:** Chọn option 2 — mỗi insight = 1 bảng riêng
**Lý do:** UX cleaner, tránh bảng quá rộng, user dễ tập trung vào 1 loại insight tại 1 thời điểm. Default = template đầu tiên được activate.

---

## 2026-04-07 — InsightSelectDropdown: bỏ option "Tất cả các cột"

**Vấn đề:** Sau khi đổi sang mỗi insight = 1 bảng riêng, dropdown "Lựa chọn Insight" cần thay đổi behavior.
**Lựa chọn:**
1. Giữ option "Tất cả các cột" (combined view)
2. Bỏ hoàn toàn combined view — mỗi lần chỉ focus 1 template
**Quyết định:** Chọn option 2 — bỏ combined view, chỉ chọn từng template riêng lẻ
**Lý do:** Nhất quán với decision trên — nếu mỗi insight = 1 bảng riêng thì không cần combined view nữa. UX đơn giản hơn.

---

## 2026-04-07 — Template data centralized in insight-v3-data.js

**Vấn đề:** TEMPLATES được define trong InsightV3Header, rồi re-export. Nếu ConversationTable import từ InsightV3Header → circular dependency risk.
**Lựa chọn:**
1. Define TEMPLATES trong InsightV3Header và re-export
2. Tách ra file data riêng `insight-v3-data.js`
**Quyết định:** Chọn option 2 — centralized data file
**Lý do:** Single source of truth, tránh circular import, dễ maintain khi thêm template mới. Cả InsightV3Header và ConversationTable import từ cùng 1 file.

---

## 2026-04-07 — "Lựa chọn Insight" dropdown chỉ hiện khi có template active

**Vấn đề:** Khi chưa activate template nào, dropdown vẫn hiện placeholder gây confusion.
**Lựa chọn:**
1. Dropdown luôn hiện, placeholder "Lựa chọn Insight"
2. Dropdown ẩn khi chưa activate template nào
**Quyết định:** Chọn option 2 — dropdown chỉ hiện khi `selectedTemplates.length > 0`
**Lý do:** Hick's Law — không hiện option không có nghĩa khi chưa chọn template. Progressive disclosure: dropdown xuất hiện khi user đã activate insight.
