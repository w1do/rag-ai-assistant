# Components — ManuFlex

## Basic Principles
- **Editorial Fidelity:** Components must maintain high typographic contrast and generous spacing.
- **Glassmorphism:** Use subtle glassmorphic effects (blur + transparency) for overlays.
- **Industrial Precision:** Sharp corners are avoided in favor of precise radii (10px-20px).

## Shared Assets

### 1. Avatars
- **Shape:** Circular.
- **Size:** ~32px.
- **Usage:** Team members, authors in blog cards.

### 2. Icons
- **Style:** Stroke (not filled).
- **Library:** Lucide.
- **Context:** Right arrow icons are preferred for buttons and links.
- **Scaling:** Default size 16px-20px depending on context.

## Specific Components
For detailed specifications of key components, refer to:
- ⌨️ **[Inputs](./inputs.md)**
- 🏷️ **[Badges & Tags](./badges.md)**
- 🔘 **[Buttons](./buttons.md)**
- 🗂️ **[Cards](./cards.md)**

## Component Architecture (React/Inertia)
Each component should be self-contained in its own directory:
`ComponentName/`
├── `index.tsx` (Main export)
├── `ComponentName.tsx` (Logic & UI)
├── `types.ts` (TypeScript interfaces)

### Example TypeScript Props
```typescript
interface ComponentProps {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    children?: React.ReactNode;
}
```
