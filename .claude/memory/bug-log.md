# Bug Log — AI Insight Project

## 2026-04-07 — ConversationTable: col.key vs col.id bug

**Symptom:** Bảng dynamic columns không hiển thị data — cell luôn ra "—"
**Nguyên nhân:** Template columns dùng field `id` (e.g. `tinh_hinh_tu_van`), không phải `key`. Header dùng `col.key` nhưng data object cũng dùng `col.id`
**Fix:** Đổi `col.key` → `col.id` trong cả `<th>` và `<td>` render của ConversationTable
**Phòng ngừa:** Template definitions luôn dùng `id` field — enforce naming convention khi tạo template schema

---

## 2026-04-07 — InsightV3Page: Wrong relative import path

**Symptom:** Build fail — `Could not resolve "./components/insight-v3/..." from "src/pages/InsightV3Page.jsx"`
**Nguyên nhân:** InsightV3Page.jsx nằm trong `src/pages/`, dùng `./components/...` thay vì `../components/...`
**Fix:** Sửa import path thành `../components/insight-v3/...`
**Phòng ngừa:** Luôn kiểm tra relative path khi tạo file trong `pages/` directory

---
