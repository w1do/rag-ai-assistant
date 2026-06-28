# Animations — ManuFlex

## Global Transition Principles
All interactive elements should use smooth transitions to maintain a premium industrial feel.
- **Default Duration:** `300ms` (`duration-300`)
- **Default Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (`ease-in-out`)

## Pulsation Effects (Pulse)
Used for status indicators, active recording states, or highlighting key metrics.

### 1. Subtle Ring Pulse
A soft radiating ring behind an element.
- **Tailwind Example:**
  ```html
  <div class="relative flex h-3 w-3">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
    <span class="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
  </div>
  ```
- **Usage:** Small status dots next to "Live Production" or "System Active" labels.

### 2. Soft Shadow Pulse
A breathing effect using box-shadow.
- **Keyframes:**
  ```css
  @keyframes soft-pulse {
    0% { box-shadow: 0 0 0 0 rgba(200, 166, 69, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(200, 166, 69, 0); }
    100% { box-shadow: 0 0 0 0 rgba(200, 166, 69, 0); }
  }
  ```
- **Usage:** Key CTA highlights or background elements in hero sections.

## Entry Animations
Elements should feel like they are "locking into place" rather than just appearing.
- **Slide Up:** `translate-y-4` to `translate-y-0` with `opacity-0` to `opacity-100`.
- **Blur In:** `blur-sm` to `blur-none`.

## Scroll-Triggered Animations
- **Staggered Fade-in:** Use for card grids (each card delayed by 100ms).
- **Parallax:** Subtle movement on background brand wordmarks.
