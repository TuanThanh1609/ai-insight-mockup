# Spec: Fahasa-Style TopNavBar + Sidebar Refresh

## Mục tiêu
- Refresh Sidebar: nền trắng thay vì Deep Navy, text `#1A2138`
- Thêm TopNavBar Fahasa-style (top navigation bar giống screenshot)

## 1. Sidebar — White Refresh

| Thuộc tính | Giá trị |
|---|---|
| Background | `bg-white` |
| Text (inactive) | `#1A2138` |
| Active item | `bg-red-50` + text `#BF3003` + icon `#BF3003` |
| Hover | `bg-gray-50` |
| Logo text | `#1A2138` |
| Bottom footer text | `#1A2138` opacity 50% |

**Nav items giữ nguyên** (không đổi routes/links):
- Cài đặt Insight
- Dashboard Insight
- Khám Bệnh
- Tổng quan Ads
- Gợi ý tối ưu Ads

## 2. TopNavBar — Fahasa Style

### Layout (fixed, full-width, h-14, z-50)
```
[Logo + Brand] | [Main Nav 6 items] | [Utility Icons + User]
```

### Left: Logo + Brand
- S-mark logo (dark navy, square)
- Divider: 1px vertical gray
- Avatar: circular, owl-like icon (or initials)
- Text: "Fahasa" font-semibold `#1A2138`
- Caret: chevron-down icon

### Center: Main Nav (6 items)
- Bảng tin, Nhắn tin, Bot-Auto, Khách hàng, **Thống kê** (active), Zalo ZBS
- Active: rounded-full pill `bg-[#1A2138]` text-white
- Inactive: text `#1A2138` opacity-70 hover:opacity-100
- Thống kê item: icon BarChart2

### Right: Utility Bar
1. **Settings** — Gear icon, circular ghost button
2. **Apps** — LayoutGrid icon, circular ghost button, small red dot badge
3. **Package** — Cube icon, circular ghost button
4. **Bell** — Bell icon, circular ghost button, red badge "2469"
5. **User Avatar** — "TT" initials, circular, purple `#7c3aed`, Vietnamese flag badge

## 3. File Changes

| File | Action |
|---|---|
| `src/components/layout/Sidebar.jsx` | Update bg-white + text-#1A2138 |
| `src/components/layout/TopNavBar.jsx` | Create new component |
| `src/App.jsx` | Add TopNavBar inside AppLayout |
| `docs/superpowers/specs/YYYY-MM-DD-fahasa-header-sidebar-design.md` | This file |

## 4. Styling: Design System "Editorial Precision"

- Font: Manrope (display), Inter (body)
- Radius: 8px
- No 1px solid borders — dùng tonal shifts
- Elevation: ambient shadows (tinted)
