# Design System Specification: Editorial Precision — Ultra Soft Identity

This document defines the visual language and structural principles for the design system. It is engineered to move beyond "standard" SaaS patterns, instead leveraging high-end editorial layouts, sophisticated tonal layering, and an authoritative typographic scale to create a high-trust, data-driven experience.

---

## 1. Creative North Star: "The Digital Curator"

The system is guided by the concept of **The Digital Curator**. In a world of cluttered data, our interface acts as a premium, quiet gallery. We eschew "default" UI patterns—like heavy borders and generic grids—in favor of:

* **Intentional Asymmetry:** Using white space (from the 20 and 24 spacing tokens) to pull the eye toward key insights.
* **Tonal Depth:** Replacing structural lines with shifting surface values.
* **High-Contrast Energetics:** Using a deep, authoritative navy foundation punctuated by a "Deep Rust" secondary and a "Vibrant Blue" tertiary to signal momentum and action.
* **Ultra Soft Identity:** Generous border radius, subtle gradient fills, gentle hover animations — the interface breathes and feels alive.

---

## 2. Color & Surface Architecture

The palette is rooted in professional stability but energized by high-chroma accents.

### The Palette
* **Primary (#1A2138):** The anchor. Use `primary` and `primary_container` for high-authority surfaces and deep-background navigation.
* **Secondary (#BF3003):** The "Human Element." This deep rust/orange is reserved for critical calls to action and "hot" data points.
* **Tertiary (#0052FF):** The "Digital Pulse." This vibrant blue represents connectivity, active states, and energetic data flows.

### Surface Gradient Fills
To achieve the **Ultra Soft Identity**, cards and sections use subtle gradient fills instead of flat backgrounds:
```
Card fill:    linear-gradient(180deg, #ffffff 0%, #faf7fc 100%)  ← warm white
Surface fill: linear-gradient(180deg, #fcf8fb 0%, #f8f4fa 100%)  ← warm off-white
Panel fill:   linear-gradient(180deg, #f5f1f5 0%, #f0ecf2 100%)  ← soft lavender
```

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined through background color shifts or subtle tonal transitions.
* *Instead of a border:* Place a `surface_container_low` section against a `surface` background.
* *Instead of a divider:* Use a 1px gap to let the `surface_dim` color peak through, or simply utilize vertical white space (Token 6 or 8).

### Glass & Gradient Strategy
To move beyond a flat "template" feel, use **Glassmorphism** for floating elements (Modals, Popovers, Tooltips).
* **Formula:** `surface_container_lowest` at 80% opacity + `backdrop-blur: 12px`.
* **Signature Textures:** For Hero sections or primary CTAs, apply a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle to provide "visual soul."
* **Soft Glow:** For elevated cards, add a subtle outer glow: `0 0 20px rgba(0, 82, 255, 0.06)` or `rgba(191, 48, 3, 0.04)`.

---

## 3. Typography: The Manrope Scale

We use **Manrope** for its technical precision and modern geometric forms. It bridges the gap between a grotesque and a humanist typeface, ensuring readability in complex data environments.

* **Display (lg/md/sm):** Reserved for high-impact data hero numbers or editorial headers. Use `display-lg` (3.5rem) sparingly to create a "Big Print" feel.
* **Headlines & Titles:** Set in Bold or Semi-Bold. These are your anchors. They should sit atop `surface_container` tiers to establish immediate hierarchy.
* **Body (lg/md/sm):** Use `body-md` (0.875rem) as the workhorse for all data descriptions.
* **Labels (md/sm):** Use `label-sm` (0.6875rem) for overlines and category tags. Always set these in All-Caps with +5% letter spacing for a premium, architectural look.

---

## 4. Elevation & Depth (Tonal Layering)

Hierarchy is achieved through physical "stacking" of paper-like layers rather than traditional drop shadows.

### The Layering Principle
* **Base:** `surface` (#fcf8fb)
* **Sectioning:** `surface_container_low`
* **Component Cards:** `surface_container_lowest` with gradient fill + soft glow
* **Active Overlays:** `surface_bright`

### Ambient Shadows — Ultra Soft
If a "floating" effect is required (e.g., primary action menus, slide panels), use **Ambient Soft Shadows**:
* **Shadow Blur:** 24px to 48px.
* **Shadow Opacity:** 3% to 6%.
* **Color:** Use tinted shadows — warm tone `rgba(26, 33, 56, 0.04)` for navy, `rgba(0, 82, 255, 0.06)` for blue glow.
* **Soft Glow overlay:** Combine shadow with a subtle gradient overlay at the top edge for premium depth.

### The "Ghost Border" Fallback
If accessibility requirements demand a container boundary, use a **Ghost Border**: `outline_variant` at 15% opacity. Never use 100% opaque borders.

---

## 5. Border Radius — Ultra Soft Identity

**Explicit Instruction:** Every component type has a dedicated radius to create visual hierarchy through shape. Do NOT use a single radius for all components.

| Component | Radius | Token | Notes |
|-----------|--------|-------|-------|
| Small elements (chips, badges, tags) | 6px | `--radius-sm` | Compact |
| Buttons, inputs, small cards | 10px | `--radius-md` | DEFAULT for interactive |
| Cards, panels, containers | 14px | `--radius-lg` | Standard component |
| Modals, slide panels, large cards | 18px | `--radius-xl` | Overlay containers |
| Hero sections, feature blocks | 24px | `--radius-2xl` | Large sections |
| Pills, avatar circles | 9999px | `--radius-full` | Full round |

**Key principle:** Larger components get larger radius. This creates a clear size hierarchy that feels natural and premium.

---

## 6. Hover & Animation — Soft & Alive

Every interactive component should feel **alive** through gentle motion:

### Hover Effects
```
Cards:    scale(1.015) + shadow elevation + subtle gradient shift (200ms ease)
Buttons:  scale(1.02) + brightness(1.05) + shadow lift (150ms ease)
Tabs:     background fade + text color shift (150ms ease)
List rows: background tonal shift (100ms ease)
```

### Transition Guidelines
- Use `duration-150` (150ms) for micro-interactions (buttons, tabs)
- Use `duration-200` (200ms) for layout transitions (cards, modals)
- Use `duration-300` (300ms) for page transitions (slide panels)
- All transitions: `ease-out` for snappy, `ease-in-out` for smooth

### Active / Press States
```
Buttons:  scale(0.97) + reduced brightness (100ms)
Cards:    scale(0.99) + shadow reduction (100ms)
```

---

## 7. Components

All components follow the **Ultra Soft** scale. No default 4px.

* **Buttons:**
  * *Primary:* `secondary` background (Deep Rust) with `on_secondary` text. Rounded 10px. Soft glow on hover.
  * *Tertiary:* `tertiary` background (Vibrant Blue) for functional actions. Rounded 10px.
  * *Ghost:* No background, `outline` text. Rounded 10px. Background tint on hover.
  * *Hover animation:* `scale(1.02) + shadow lift + brightness(1.05)`
* **Cards:**
  * Rounded 14px. Gradient fill (warm white → soft lavender). Soft outer glow on hover (`0 4px 24px rgba(26,33,56,0.05)`).
  * No borders. Lift via shadow + gradient.
* **Input Fields:** Rounded 10px. Surface gradient track. Bottom-border focus only.
* **Chips:** Rounded 9999px (pill). Soft background tint.
* **Modals:** Rounded 18px. Glassmorphism + ambient shadow.
* **Slide Panels:** Rounded 18px on left edge. Ambient soft shadow.
* **Data Lists:** Forbid divider lines. Use 8px–12px gaps between rows.

---

## 8. Do's and Don'ts

### Do
* **Do** use the full radius scale — match radius to component size for natural hierarchy.
* **Do** add subtle gradient fills on cards — no flat solid colors on cards.
* **Do** use gentle hover animations (scale + shadow lift).
* **Do** mix font weights—use `Manrope Bold` for titles and `Manrope Regular` for body text.
* **Do** use `secondary` (Rust) sparingly. It is a "laser pointer," not a "paint brush."

### Don't
* **Don't** use 1px solid dividers to separate list items. Use 8px–12px gaps instead.
* **Don't** use pure black (#000000) for shadows. Use tinted warm tones.
* **Don't** use the default 4px border radius. Stick strictly to the **Ultra Soft scale** (10px/14px/18px/24px).
* **Don't** use abrupt hover states. Always animate (even subtle opacity shift).
