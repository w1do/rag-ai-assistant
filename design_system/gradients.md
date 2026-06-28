# Gradients & Overlays — ManuFlex

## Industrial Gradients
ManuFlex uses sophisticated gradients to add depth without losing the "hard" industrial aesthetic.

### 1. Three-Color Brand Gradient (Dynamic)
Used for special hover states on cards or as section dividers.
- **Colors:** Primary Blue-Gray -> Brand Gold -> Secondary Navy.
- **Tailwind Config (Example):** `bg-gradient-to-br from-[#151B27] via-[#C8A645] to-[#0C1019]`
- **Usage:** Applied to card borders or background overlays on hover with 30% opacity.

### 2. Cinematic Dark Gradient
Used to transition from imagery to content blocks.
- **Formula:** `linear-gradient(to bottom, transparent 0%, rgba(12, 16, 25, 0.8) 50%, #0C1019 100%)`
- **Usage:** Placed over full-bleed hero images to ensure text legibility.

## Glassmorphism (Frosted Metal)
A signature ManuFlex pattern used for stats and navigation.

### 1. Light Surface Glass
- **Background:** `rgba(255, 255, 255, 0.1)`
- **Backdrop Blur:** `blur(12px)`
- **Border:** `1px solid rgba(255, 255, 255, 0.2)`
- **Usage:** Navigation bars, floating stats on light imagery.

### 2. Dark Surface Glass
- **Background:** `rgba(21, 27, 39, 0.6)`
- **Backdrop Blur:** `blur(20px)`
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Usage:** Hero stat overlays, mobile menu backgrounds.

## Decorative Text Gradients
Sometimes used for large display headings to give them a "metallic" look.
- **Gradient:** `linear-gradient(180deg, #FFFFFF 0%, #8A8FA0 100%)`
- **Tailwind:** `bg-clip-text text-transparent bg-gradient-to-b from-white to-secondary-dark`
