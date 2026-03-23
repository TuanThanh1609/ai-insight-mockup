# Design System Document: The Intelligent Canvas

## 1. Overview & Creative North Star

**Creative North Star: "The Digital Concierge"**
In a world of cluttered B2B dashboards, this design system acts as a sophisticated, quiet partner. It moves away from the "industrial" feel of traditional SaaS and toward a high-end editorial experience. We achieve this through **Atmospheric Depth** and **Intentional Asymmetry**.

Rather than boxing users into rigid, heavy-bordered grids, we use expansive whitespace and tonal shifts to guide the eye. The interface feels "smart" not because of complex animations, but because of its clarity, its use of high-contrast typography scales, and its ethereal, layered surfaces. It is professional, yet possesses a "soul" through subtle AI-themed glassmorphism and soft gradients.

---

## 2. Colors

This palette is designed to feel crisp and authoritative. We prioritize the "on-surface" readability and use platform-specific blues (Facebook/Zalo) as contextual anchors rather than overpowering brand elements.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders (`#acb3b7` or similar) for sectioning primary layout areas. Boundaries must be defined solely through background color shifts. Use `surface-container-low` for a sidebar and `surface` for the main content. The lack of hard lines creates a modern, "limitless" feel.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
- **Layer 0 (Base):** `surface` (`#f7f9fb`)
- **Layer 1 (Recessed):** `surface-container-low` (`#f0f4f7`) for secondary navigation or utility panels.
- **Layer 2 (Elevated Card):** `surface-container-lowest` (`#ffffff`) for main data containers.
- **Layer 3 (Active/Pop-over):** Use Glassmorphism (see below).

### The "Glass & Gradient" Rule
To elevate AI-driven features (like GenAI insights or automated triggers), apply a subtle gradient from `primary` (`#0048e2`) to `primary-container` (`#0052fe`). For floating AI "sparkle" panels, use a backdrop-blur (12px-20px) with `surface-container-lowest` at 80% opacity.

---

## 3. Typography

The system utilizes a dual-font approach to balance authority with utility.

* **Display & Headlines (Manrope):** A geometric sans-serif that feels modern and "tech-forward." Use `display-md` for high-level dashboard summaries to create an editorial impact.
* **Body & Titles (Inter):** The workhorse for data density. Inter provides exceptional legibility at small sizes (`body-sm`) for complex marketing tables.

**The Hierarchy Logic:**
- **Primary Data Points:** Use `headline-sm` in `on-surface` for critical metrics.
- **Micro-Copy:** Use `label-md` in `on-surface-variant` for metadata. The high contrast between `Manrope` headers and `Inter` body text signals the difference between "Insight" and "Data."

---

## 4. Elevation & Depth

We eschew traditional "drop shadows" in favor of **Tonal Layering**.

* **The Layering Principle:** Depth is achieved by "stacking." A card (`surface-container-lowest`) placed on a canvas (`surface`) provides a soft, natural lift.
* **Ambient Shadows:** If a component must float (e.g., a dropdown or modal), use a highly diffused shadow:
* *Blur:* 24px - 40px
* *Opacity:* 4%-6%
* *Color:* Use a tint of `on-surface` (`#2c3437`) to keep it grounded.
* **The "Ghost Border" Fallback:** For input fields or high-density table cells where separation is required for accessibility, use a **Ghost Border**: `outline-variant` at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-dim`) with `on-primary` text. Roundedness: `md` (0.75rem).
- **Secondary:** Surface-tinted. No border. Use `surface-container-high` background with `primary` text.
- **AI-Action:** A special variant featuring a small "sparkle" icon, utilizing a subtle glow effect (2px outer spread of `primary_fixed`).

### Cards & Lists
- **Forbid Dividers:** Do not use horizontal lines between list items. Use the **Spacing Scale** (`spacing-4`) to create enough breathing room that the eye naturally groups the information.
- **Interactive States:** On hover, a card should shift from `surface-container-lowest` to `surface-container-low` rather than "lifting" with a shadow.

### Status Chips
- **Success:** `tertiary-container` background with `on-tertiary-container` text (Emerald palette).
- **Warning:** `error-container` background with `on-error-container` text (Rose palette).
- **Shape:** Always `full` (9999px) to contrast against the `md` roundedness of cards.

### Input Fields
- **Default:** `surface-container-lowest` background with a Ghost Border.
- **Focus:** Transition the border to `primary` at 100% and add a 2px "aura" using `primary_fixed_dim` at 30% opacity.

---

## 6. Do's and Don'ts

### Do
- **Do** use `spacing-8` or `spacing-10` for page margins to create a "premium" sense of space.
- **Do** use the **Glassmorphism** effect for AI-generated insight panels to separate them from static data.
- **Do** align items to a "Soft Grid"—ensure vertical rhythm follows the spacing scale, but allow for asymmetrical horizontal layouts (e.g., a wide table next to a narrow "AI Insight" sidebar).

### Don't
- **Don't** use pure black `#000000`. Always use `on-surface` for text to maintain a professional, soft-contrast look.
- **Don't** use 1px dividers. If you feel the need for a divider, increase the whitespace (`spacing-5`) or change the background color of the container instead.
- **Don't** use sharp corners. Everything must adhere to the **Roundedness Scale** (8px-12px) to maintain the "smart and approachable" vibe.

### Accessibility Note
While we prioritize "Ghost Borders" and tonal shifts, always ensure that interactive elements (Inputs, Buttons) maintain a contrast ratio of at least 4.5:1 against their immediate background. The use of `on-surface-variant` for labels ensures the hierarchy is clear without sacrificing legibility.