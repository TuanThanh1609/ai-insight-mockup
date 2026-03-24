# Design System Specification: Editorial Precision

This document defines the visual language and structural principles for the design system. It is engineered to move beyond "standard" SaaS patterns, instead leveraging high-end editorial layouts, sophisticated tonal layering, and an authoritative typographic scale to create a high-trust, data-driven experience.

---

## 1. Creative North Star: "The Digital Curator"

The system is guided by the concept of **The Digital Curator**. In a world of cluttered data, our interface acts as a premium, quiet gallery. We eschew "default" UI patterns—like heavy borders and generic grids—in favor of:

* **Intentional Asymmetry:** Using white space (from the 20 and 24 spacing tokens) to pull the eye toward key insights.
* **Tonal Depth:** Replacing structural lines with shifting surface values.
* **High-Contrast Energetics:** Using a deep, authoritative navy foundation punctuated by a "Deep Rust" secondary and a "Vibrant Blue" tertiary to signal momentum and action.

---

## 2. Color & Surface Architecture

The palette is rooted in professional stability but energized by high-chroma accents.

### The Palette
* **Primary (#1A2138):** The anchor. Use `primary` and `primary_container` for high-authority surfaces and deep-background navigation.
* **Secondary (#BF3003):** The "Human Element." This deep rust/orange is reserved for critical calls to action and "hot" data points.
* **Tertiary (#0052FF):** The "Digital Pulse." This vibrant blue represents connectivity, active states, and energetic data flows.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined through background color shifts or subtle tonal transitions.
* *Instead of a border:* Place a `surface_container_low` section against a `surface` background.
* *Instead of a divider:* Use a 1px gap to let the `surface_dim` color peak through, or simply utilize vertical white space (Token 6 or 8).

### Glass & Gradient Strategy
To move beyond a flat "template" feel, use **Glassmorphism** for floating elements (Modals, Popovers, Tooltips).
* **Formula:** `surface_container_lowest` at 80% opacity + `backdrop-blur: 12px`.
* **Signature Textures:** For Hero sections or primary CTAs, apply a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle to provide "visual soul."

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
* **Component Cards:** `surface_container_lowest` (This creates a soft, natural "lift" against the darker container).
* **Active Overlays:** `surface_bright`

### Ambient Shadows
If a "floating" effect is required (e.g., a primary action menu), use **Ambient Shadows**:
* **Shadow Blur:** 32px to 48px.
* **Shadow Opacity:** 4% to 8%.
* **Color:** Use a tinted version of `on_surface` rather than pure black to mimic natural light.

### The "Ghost Border" Fallback
If accessibility requirements demand a container boundary, use a **Ghost Border**: `outline_variant` at 15% opacity. Never use 100% opaque borders.

---

## 5. Components

All components follow a **8px (0.5rem) base roundness** (`DEFAULT`) to balance modern friendliness with B2B professional rigor.

* **Buttons:**
* *Primary:* `secondary` background (Deep Rust) with `on_secondary` text. Rounded 8px. Use for the "Ultimate Action."
* *Tertiary:* `tertiary` background (Vibrant Blue) for functional actions (e.g., "Run Report").
* *Ghost:* No background, `outline` text. Used for secondary navigation.
* **Cards:** No borders. Use `surface_container_lowest` on top of `surface_container`. Padding should follow the `6` (1.5rem) or `8` (2rem) spacing tokens.
* **Input Fields:** Use `surface_container_high` for the input track. On focus, transition the background to `surface_container_highest` and add a 2px `tertiary` (Vibrant Blue) bottom-border only.
* **Chips:** Use `primary_fixed` for a "Dark Mode" aesthetic within a light layout. Labels should be `on_primary_fixed`.
* **Data Lists:** Forbid divider lines. Separate rows using a subtle background hover state shift to `surface_container_highest`.

---

## 6. Do’s and Don’ts

### Do
* **Do** use extreme vertical spacing (Token 16, 20) to separate major content groups.
* **Do** mix font weights—use `Manrope Bold` for titles and `Manrope Regular` for body text to create high-contrast hierarchy.
* **Do** use `secondary` (Rust) sparingly. It is a "laser pointer," not a "paint brush."

### Don’t
* **Don’t** use 1px solid dividers to separate list items. Use 8px to 12px of negative space instead.
* **Don’t** use pure black (#000000) for text. Use `on_surface` (#1b1b1d) for a softer, high-end feel.
* **Don’t** use the default 4px border radius. Stick strictly to the **8px (`DEFAULT`)** scale to maintain the system's "Curated" identity.