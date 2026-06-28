# Design DNA: ManuFlex — Advanced Manufacturing & Industrial Website UI Kit
# By dpopstudio (ui8.net/dpopstudio)
# Product: ui8.net/products/manuflex--advanced-manufacturing--industrial-website-ui-kit

---
product_url: "https://ui8.net/dpopstudio/products/manuflex--advanced-manufacturing--industrial-website-ui-kit"
creator: "dpopstudio"
creator_url: "https://ui8.net/dpopstudio"
category: ["figma","all","ui-kits"]
tags: ["figma"]
---

# ManuFlex — Advanced Manufacturing & Industrial Website UI Kit — Design DNA
### Web + Mobile · Light + Dark

## SOURCE OF TRUTH

This DNA file captures the design's personality and key patterns for fast AI code generation.

**Download the full product:** [ManuFlex — Advanced Manufacturing & Industrial Website UI Kit on UI8](https://ui8.net/dpopstudio/products/manuflex--advanced-manufacturing--industrial-website-ui-kit)

**For pixel-perfect fidelity:** Use the Figma source file (included in the product download) with Figma MCP in your AI coding tool to pull exact tokens, spacing, and component specs directly from the design.

---

## DESIGN PHILOSOPHY

A bold, industrial-grade website design system built for advanced manufacturing and automotive companies. The design combines a predominantly dark, cinematic aesthetic with sharp typographic contrast using a serif heading font against clean sans-serif body text, projecting authority, precision, and technological sophistication. Intended for B2B manufacturing firms, automotive OEMs, and industrial technology companies seeking a premium digital presence.

---

## COLOR SYSTEM

Supports light and dark modes.

```
Background:
  --color-background:     #FAFAFA
  --color-surface:        #FFFFFF

Text:
  --color-text-primary:   #111111
  --color-text-secondary: #5C5C5C

Brand:
  --color-primary:        #FFFFFF
  --color-secondary:      #C8A645
  --color-accent:         #C8A645

Semantic:
  --color-success:        #34A853
  --color-warning:        #FBBC04
  --color-error:          #D93025
```

**Dark Mode:**
```
  --color-background-dark:     #0C1019
  --color-surface-dark:        #151B27
  --color-text-primary-dark:   #F0F0F0
  --color-text-secondary-dark: #8A8FA0
```

---

## TYPOGRAPHY

**Font:** DM Serif Display (headings) + DM Sans (body)

```
  --text-display:    56px / 1.08 / bold / tracking -0.03em
  --text-title:      40px / 1.15 / bold / tracking -0.02em
  --text-heading:    28px / 1.25 / semibold / tracking -0.01em
  --text-subheading: 18px / 1.4 / medium / tracking 0
  --text-body:       15px / 1.6 / regular / tracking 0.01em
  --text-small:      13px / 1.5 / regular / tracking 0.01em
  --text-caption:    11px / 1.4 / medium / tracking 0.02em
```

---

## SPACING SYSTEM

```
Micro:    4px
Small:    8px
Base:     16px
Medium:   24px
Large:    40px
XL:       56px
2XL:      80px
3XL:      120px

Card padding:     28px
Section gap:      80px
Component gap:    20px
```

---

## BORDER & RADIUS

```
--radius-sm:    6px
--radius-md:    12px
--radius-lg:    16px
--radius-xl:    20px
--radius-full:  9999px

--shadow-sm: 0 1px 3px rgba(0,0,0,0.06)
--shadow-md: 0 4px 16px rgba(0,0,0,0.10)
--shadow-lg: 0 12px 40px rgba(0,0,0,0.18)
```

---

## COMPONENT PATTERNS

### Buttons

**Primary:** Rounded rectangle with dark fill (#111111 in light mode, white in dark mode), 12px border-radius, white text (or dark text in dark mode), ~44px height, medium weight text with right arrow icon

**Secondary:** Outlined/ghost button with 1px border in current text color, transparent fill, 12px border-radius, same height as primary, arrow icon on right

### Cards

Large rounded corners (16-20px radius), subtle 1px border in light mode, dark surface fill (#151B27) in dark mode, generous 28px padding, minimal shadow in light mode, no shadow in dark mode, often featuring full-bleed imagery at top

### Inputs

Rounded rectangle with 10px radius, 1px neutral border, light fill in light mode, dark surface fill in dark mode, ~44px height

### Navigation

Horizontal top navigation bar with logo left, centered nav links in regular weight, Sign In button right as outlined pill, sticky header with transparent/blur background

### Badges & Tags

Small pill-shaped tags with rounded-full radius, dark fill with white text or semi-transparent fill, used as category labels on images (e.g. 'Efficiency')

### Avatars

Small circular avatars (~32px) used alongside author names in blog cards

```
Icon style:   stroke
Icon library: Lucide
```

---

## LAYOUT

```
Type:       both
Grid:       12-column grid on desktop with ~80px side margins, asymmetric split layouts common with large imagery on one side and text on the other, generous vertical spacing between sections
```

---

## DISTINCTIVE DESIGN PATTERNS

- Serif heading font (DM Serif Display) paired with clean sans-serif body creates a premium industrial editorial feel uncommon in manufacturing websites
- Dark mode uses a deep navy-charcoal (#0C1019) rather than pure black, with blue-tinted surface layers for depth and sophistication
- Floating glassmorphic stat overlays on hero imagery showing metrics like '80% Automated Production Accuracy' with circular progress indicators
- Pill-shaped category badges positioned as floating overlays on photography, creating a layered editorial composition
- Large bold brand wordmark ('MANUFLEX') used as a decorative typographic background element behind hero content
- 3D isometric icon illustrations for machinery and equipment (robotic arms, CNC machines, AI inspection systems) used in feature/product grid sections

---

## RESPONSIVE

### Desktop (≥1024px)

Wide 12-column grid with two-column split sections, large hero areas with full-width imagery, card grids in 3-4 columns, generous whitespace between sections

### Mobile (≤767px)

**Layout:** Single column stacked layout, full-width cards, hero text and images stack vertically, reduced section padding, typography scales down proportionally

**Navigation:** hamburger

**Mobile-only elements:**
- hamburger menu icon
- stacked single-column card layout
- full-width CTA buttons
- condensed section spacing

**Typography scaling:** Display drops from ~56px to ~32px on mobile, titles from 40px to 26px, body remains consistent at 15px

**Card behavior:** Cards reflow from multi-column grid to single-column stacked layout with full viewport width

**Notes:** Mobile version shown on iPhone mockup demonstrates light mode with clean serif headings maintained at reduced scale, imagery remains prominent with aspect ratio adjustments

