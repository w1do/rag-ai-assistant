# Hover Effects — ManuFlex

## Card Interactions
Cards are the primary content containers and require clear interactive feedback.

### 1. The "Industrial Lift" (Standard Card)
- **Effect:** Subtle scale up and shadow deepening.
- **Tailwind:** `hover:scale-[1.02] hover:shadow-lg transition-all duration-300`
- **Logic:** Makes the content feel like it's being "selected" for inspection.

### 2. Glassmorphic Glow
- **Effect:** Increasing the backdrop blur or adding a subtle white inner glow.
- **Style:** `hover:backdrop-blur-xl hover:bg-white/20`
- **Usage:** Statistics cards and category badges.

## Interactive Links & Navigation
- **Underline Slide:** `after:w-0 hover:after:w-full` using absolute positioning for a sophisticated underline effect.
- **Color Shift:** Transition from `--color-text-secondary` to `--color-accent` (#C8A645).

## Image Hovers
- **Zoom & Pan:** `hover:scale-110` with `overflow-hidden` on the container.
- **Colorize:** Moving from grayscale or muted tones to full vibrancy on hover.
- **Overlay Reveal:** Showing a secondary description or a "View Project" arrow when the user hovers over a portfolio or machine image.

## Cursor Patterns
- **Custom Pointer:** For large image areas, use a custom "Drag" or "Explore" cursor (industrial style).
- **Magnetic Effect:** Buttons and small icons should have a slight magnetic pull towards the cursor within a 20px radius.
