# Visual System

This document describes the room layout, coordinate system, and positioning patterns for visual elements in CatBreeder.

## Room Coordinate System

The room uses **percentage-based positioning** relative to the container. Understanding these reference points is critical for correct placement.

### Vertical Layout

| Element | Top % | Description |
|---------|-------|-------------|
| Ceiling | 0% | Top of room |
| Wall | 0-66% | Wall area (cream/wallpaper) |
| Baseboard | 66% | Dark brown trim strip |
| Floor | 67-100% | Wooden floor area |

### Key Reference Points

```
0%  ┌─────────────────────────┐
    │         WALL            │
    │    (wallpaper area)     │
    │                         │
66% ├─────────────────────────┤ ← Baseboard (dark brown)
67% │         FLOOR           │ ← Floor starts here
    │    (wooden planks)      │
100%└─────────────────────────┘
```

### Horizontal Layout

- **Left edge**: 0%
- **Center**: 50%
- **Right edge**: 100%

Cat trees typically positioned at **x: 12%** (left) and **x: 88%** (right).

## Object Positioning

### Objects That Sit ON the Floor

Objects whose base should touch the floor use **`bottom` positioning**:

```css
/* Object with base at floor level */
.floorObject {
  position: absolute;
  bottom: 33%;  /* 100% - 67% floor = 33% from bottom */
}
```

**Why 33%?** Floor starts at 67% from top. `bottom: 33%` means the element's bottom edge sits at `100% - 33% = 67%` from top.

### Objects Positioned by Center Point

Cats and toys use **`top/left` with `transform: translate(-50%, -50%)`**:

```css
.catPosition {
  position: absolute;
  left: 50%;  /* x coordinate */
  top: 75%;   /* y coordinate */
  transform: translate(-50%, -50%);  /* Center the element on that point */
}
```

### Cat Tree Platform Mapping

Cat trees use SVG with `viewBox="0 0 90 210"`. To map platform Y positions to screen coordinates:

**Formula**: `screen_y% = tree_top% + (svg_y / 210) * tree_height%`

With cat tree at `top: 19%`, `height: 50%`:

| Platform | SVG Y (cushion) | Screen Y | Calculation |
|----------|-----------------|----------|-------------|
| Top | 22 | ~24% | 19 + (22/210)*50 = 24.2% |
| Middle | 87 | ~40% | 19 + (87/210)*50 = 39.7% |
| Bottom | 152 | ~55% | 19 + (152/210)*50 = 55.2% |

**Cat offset**: Add ~3% to account for cat sprite height (cats sit ON platforms, not at center).

Final cat positions: **27%, 43%, 58%**

## Pointer Events

### The Layering Problem

The room has multiple layers:
1. **Background** (WallFloor SVG) - non-interactive
2. **Room objects** (fireplace, windows) - non-interactive  
3. **Furniture** (beds, toys, cat trees) - **interactive**
4. **Content overlay** (cats, UI hints) - **interactive**

The content overlay (`div.content`) covers the entire room. Without proper pointer-events handling, it blocks clicks to furniture beneath.

### Solution Pattern

```css
/* Overlay allows clicks to pass through */
.content {
  position: absolute;
  inset: 0;
  pointer-events: none;  /* ← Clicks pass through */
}

/* Individual interactive elements re-enable events */
.catPosition {
  pointer-events: auto;  /* ← Re-enable for this element */
}

.furnitureBed {
  pointer-events: auto;  /* ← Each furniture type needs this */
}
```

### Checklist for New Interactive Elements

1. Parent container has `pointer-events: none`
2. Element itself has `pointer-events: auto`
3. Element has `cursor: pointer`
4. Element has appropriate `z-index` (see css-patterns.md)

## SVG Object Sizing

### Using preserveAspectRatio

Room objects use SVGs with fixed aspect ratios:

```tsx
<svg viewBox="0 0 240 210" preserveAspectRatio="xMidYMid meet">
```

- `xMidYMid` - Center the content
- `meet` - Scale to fit, maintaining aspect ratio

### CSS Sizing

Size SVG objects with percentage width, let height auto-calculate:

```css
.fireplace {
  position: absolute;
  top: 33%;
  left: 35%;
  width: 30%;
  height: 35%;  /* Can be explicit if needed */
}
```

## Common Mistakes

### ❌ Using `top` When Object Should Sit on Floor

```css
/* Wrong - object floats above floor */
.catTree {
  top: 20%;
  height: 50%;
}
```

```css
/* Correct - base sits on floor */
.catTree {
  top: 19%;  /* Calculated: 67% - (base_y/viewbox_height)*height */
  height: 50%;
}
```

### ❌ Forgetting pointer-events on Furniture

```css
/* Wrong - clicks don't register */
.furnitureBed {
  position: absolute;
  cursor: pointer;
}
```

```css
/* Correct */
.furnitureBed {
  position: absolute;
  cursor: pointer;
  pointer-events: auto;  /* ← Required! */
}
```

### ❌ Wrong transform for Centered vs Edge-Aligned Objects

```css
/* Centered object (cats, toys) */
.centered {
  transform: translate(-50%, -50%);
}

/* Left-edge aligned, horizontally centered (cat trees) */
.catTree {
  transform: translateX(-50%);  /* Only center horizontally */
}
```

## Position Reference Quick Table

| Object Type | Position Method | Transform | pointer-events |
|-------------|-----------------|-----------|----------------|
| Cat sprite | `top`, `left` | `translate(-50%, -50%)` | `auto` |
| Toy | `top`, `left` | `translate(-50%, -50%)` | `auto` |
| Bed | `top`, `left` | `translate(-50%, -50%)` | `auto` |
| Cat tree | `top`, `left` | `translateX(-50%)` | `auto` |
| Plant | `bottom`, `left` | none | `none` |
| Fireplace | `top`, `left` | none | `none` |

## Testing Positioning Changes

After modifying positions:

1. **Visual check**: Does the object sit where expected?
2. **Hover check**: Does the cursor change to pointer?
3. **Click check**: Does clicking trigger the handler?
4. **Selection check**: Does the gold glow appear when selected?

If hover/click don't work, check `pointer-events` and `z-index`.
