# CSS Patterns

This document describes CSS conventions, module usage, and styling patterns for CatBreeder.

## CSS Modules

### Basic Usage

Components with styles use a folder structure:

```
src/app/ui/GameUI/
├── index.tsx        # Component
├── styles.css       # CSS Module
└── index.test.tsx   # Tests
```

Import and use:

```tsx
import styles from './styles.css';

function GameUI() {
  return <div className={styles.container}>...</div>;
}
```

### Class Naming

Use **camelCase** for CSS class names:

```css
/* ✅ Correct */
.catPosition { }
.furnitureBed { }
.panelSection { }

/* ❌ Wrong */
.cat-position { }
.furniture_bed { }
.PanelSection { }
```

### Composing Classes

Use `composes` to share base styles:

```css
.svgObject {
  position: absolute;
  pointer-events: none;
}

.fireplace {
  composes: svgObject;
  top: 33%;
  left: 35%;
}

.plant {
  composes: svgObject;
  bottom: 33%;
  left: 18%;
}
```

## When to Use Inline Styles

### ✅ Use Inline Styles When:

**All or most properties derive from props/state:**

```tsx
// CatSprite - colors, sizes all from cat.phenotype
const containerStyle: CSSProperties = {
  width: `${80 * scale}px`,
  height: `${66 * scale}px`,
  transform: isHighlighted ? 'scale(1.15)' : 'scale(1)',
  filter: isHighlighted ? `drop-shadow(0 0 8px ${glowColor})` : 'none',
};
```

**Position comes from data:**

```tsx
// Cat position from game state
<div style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
```

**Dynamic colors:**

```tsx
// Toy color varies by index
style={{ background: `linear-gradient(135deg, ${colors.main}, ${colors.accent})` }}
```

### ❌ Use CSS Modules When:

**Styles are static or only toggle between states:**

```tsx
// ❌ Wrong - static styles in JS
const cardStyle = { padding: '16px', borderRadius: '8px' };

// ✅ Correct - use CSS
<div className={styles.card}>
```

**Hover/focus/active states:**

```css
/* CSS handles pseudo-classes */
.button:hover {
  transform: scale(1.05);
}
```

**Media queries or transitions:**

```css
/* CSS-only features */
.panel {
  transition: transform 0.15s ease;
}

@media (max-width: 768px) {
  .panel { width: 100%; }
}
```

## Z-Index Conventions

### Room Layers

| Layer | z-index | Contents |
|-------|---------|----------|
| Background | 0 | WallFloor SVG |
| Static objects | (default) | Fireplace, windows, rug |
| Cat trees | 2 | Behind cats |
| Beds | 2 | Under cats |
| Toys | 3 | Foreground |
| Content overlay | 1 | Cat sprites |
| Modals | 100+ | Panels, dialogs |

### Guidelines

- Avoid arbitrary z-index values (don't use 999, 9999)
- Keep values low and meaningful
- Document non-obvious z-index choices in comments

## Selection & Hover States

### Consistent Glow Pattern

Selected/hovered items use the same visual language:

```css
/* Hover state */
.furnitureBed:hover {
  transform: translate(-50%, -50%) scale(1.15);
  filter: brightness(1.15) drop-shadow(0 0 6px rgba(255, 255, 255, 0.5));
}

/* Selected state - gold glow */
.furnitureSelected {
  filter: brightness(1.2) drop-shadow(0 0 10px rgba(255, 215, 0, 0.7)) !important;
}
```

### Transform Preservation

When adding selected state, preserve the base transform:

```css
/* Base has translate */
.furnitureToy {
  transform: translate(-50%, -50%);
}

/* Selected adds scale but keeps translate */
.furnitureToy.furnitureSelected {
  transform: translate(-50%, -50%) scale(1.25);
}
```

### Interactive Element Checklist

Every interactive element needs:

```css
.interactive {
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.interactive:hover {
  /* Visual feedback */
}
```

## Transition Patterns

### Standard Durations

| Type | Duration | Easing |
|------|----------|--------|
| Hover effects | 0.15s | ease |
| Position changes | 0.5s | ease-out |
| Modal appear/disappear | 0.2s | ease |

### Properties to Transition

```css
/* ✅ Transition specific properties */
transition: transform 0.15s ease, filter 0.15s ease;

/* ❌ Avoid transition: all (performance) */
transition: all 0.15s ease;
```

## SVG Styling

### Inline SVG Approach

Room objects use inline SVG for full styling control:

```tsx
function BedItem({ colors }) {
  return (
    <svg viewBox="0 0 80 35" className={styles.furnitureBed}>
      <ellipse cx="40" cy="22" rx="40" ry="15" fill={colors.main} />
    </svg>
  );
}
```

### SVG-Specific CSS

```css
.furnitureBed {
  /* Standard positioning */
  position: absolute;
  
  /* Size - fixed or percentage */
  width: 80px;
  height: 35px;
  
  /* Filter effects work on SVG */
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.5));
}
```

## Common Patterns

### Centered Overlay

```css
.overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
}
```

### Panel with Header

```css
.panel {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.panelTitle {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}
```

### Button Variants

```css
.buttonPrimary {
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.buttonSecondary {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.buttonDanger {
  background: #e74c3c;
  color: white;
}
```

## File Organization

### When to Create styles.css

Create a CSS Module when:
- Component has 3+ CSS rules
- Component has hover/focus states
- Component needs transitions
- Styles might be reused via `composes`

### Single-File Components

For simple components, inline minimal styles:

```tsx
// Simple wrapper - no CSS file needed
function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />;
}
```

Or use utility classes from a shared styles file.
