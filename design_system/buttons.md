# Buttons — ManuFlex

## Button Styles

| Type | Light Mode | Dark Mode | Shared Properties |
|------|------------|-----------|-------------------|
| **Primary** | Fill: `#111111`, Text: `#FFFFFF` | Fill: `#FFFFFF`, Text: `#111111` | Radius: 12px, Height: 44px, Medium weight, Right arrow icon |
| **Secondary** | Outline: 1px `#111111`, Fill: Transparent | Outline: 1px `#F0F0F0`, Fill: Transparent | Radius: 12px, Height: 44px, Medium weight, Right arrow icon |
| **Ghost/Tertiary**| No border/fill, Text: `#111111` | No border/fill, Text: `#F0F0F0` | Often used for navigation or less critical actions |

## Icon Usage
- Buttons predominantly use a **right arrow icon** to indicate action/progression.
- Icon library: **Lucide** (Stroke style).

## Interactive States
- **Hover:** Subtle opacity shift or background tint.
- **Active:** Slight scale down (0.98).
- **Disabled:** 40% opacity, `cursor: not-allowed`.

## Responsive
- Mobile: Buttons often expand to **full-width** (100%) in stacked layouts.
