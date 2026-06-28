# Animated Tailwind Buttons — ManuFlex

## Button Motion Patterns

### 1. The Arrow Slide (Signature)
The right arrow icon in primary/secondary buttons slides to the right on hover.
- **Tailwind Implementation:**
  ```html
  <button class="group flex items-center gap-2 px-6 py-3 bg-[#111111] text-white rounded-[12px] transition-all">
    <span>View Solutions</span>
    <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" ...></svg>
  </button>
  ```
- **Context:** Standard for all "Call to Action" buttons.

### 2. Shimmer Effect (Premium)
A subtle light sweep across the button surface, indicating high importance.
- **Tailwind Implementation:**
  ```html
  <button class="relative overflow-hidden bg-[#C8A645] text-white px-8 py-4 rounded-[12px]">
    <span class="relative z-10">Request a Quote</span>
    <div class="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shimmer"></div>
  </button>
  ```
- **Keyframes:** `0% { left: -100% } 100% { left: 100% }`

### 3. Micro-Pulse Active State
A slight vibration or pulse when the button is clicked or during a loading state.
- **Tailwind:** `active:scale-95 transition-transform duration-75`
- **Logic:** Provides tactile feedback to the user.

### 4. Ghost-to-Solid Transition
A secondary button that fills with a solid color on hover.
- **Tailwind:** `bg-transparent border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors duration-300`

## Loading States
Buttons should never be static during a process.
- **Spinner Integration:** Replace the arrow icon with a Lucide `loader-2` icon and apply `animate-spin`.
- **Progress Bar:** A 2px line at the bottom of the button filling from 0 to 100%.

## Accessibility Note
Ensure all animations can be disabled via `motion-safe:` media queries for users with vestibular disorders.
- **Example:** `motion-safe:hover:translate-x-1`
