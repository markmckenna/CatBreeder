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
| Floor | 67-100% | Wooden floor area (legacy) |

**New rule:** Anything below the **70%** line is considered “on the floor.” Avoid placing thick objects (e.g., cat trees, beds) too close to the wall/floor line—move them further onto the floor for visual realism.

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


## Visual Layering

Objects are organized in layers (back to front):
1. **Walls & Floor** (background SVGs)
2. **Affixed Objects** (windows, fireplace, plants, rugs)
3. **Placeable Furniture** (cat trees, beds, toys)
4. **Cats** (always on top)

Each layer should have a higher z-index than the one behind it. Placeable objects must never appear behind affixed objects or the floor.

## Object Positioning


### Objects That Sit ON the Floor

Objects whose base should touch the floor use **`bottom` positioning**. For most objects, use `bottom: 30%` (i.e., 70% from top) or greater, depending on the object’s visual thickness. Thicker objects should be placed further from the wall/floor line.


### Placement Positions and Hardpoints

Every placeable object must define a **placement position**: a point within the object (relative to its top-left corner) that should be aligned to the logical placement target (e.g., the floor, a platform, or a bed). For objects that can have other things placed on them (e.g., cat trees), define one or more **hardpoints**: points where another object’s placement position should snap.

**Example:**
- A cat tree’s placement position is at the center of its foot, slightly above the rendered base to account for unrendered thickness.
- The cat tree defines three hardpoints, one at the center of each bed/platform.
- Each cat’s placement position is where its butt sits.
- When placing a cat on the cat tree, align the cat’s placement position to the chosen hardpoint.


## Hitboxes and Pointer Events

### Hitbox Guidance

All interactive objects must use a hover/click hitbox that matches their visible outline (SVG shape), not the SVG bounding box. This allows, for example, selecting a cat tree even if a cat is sitting on it. Use SVG hit testing or CSS `pointer-events: visiblePainted` where possible.

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

1. Parent container: `pointer-events: none`
2. Element: `pointer-events: auto`, `cursor: pointer`, correct `z-index`
3. Hitbox: matches visible outline, not bounding box


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

## Position Reference Quick Table

| Object Type | Position Method | Transform | pointer-events | Placement Position | Hardpoints |
|-------------|----------------|-----------|----------------|-------------------|------------|
| Cat sprite | `top`, `left` | `translate(-50%, -50%)` | `auto` | Butt center | — |
| Toy | `top`, `left` | `translate(-50%, -50%)` | `auto` | Center | — |
| Bed | `top`, `left` | `translate(-50%, -50%)` | `auto` | Center of base | — |
| Cat tree | `top`, `left` | `translateX(-50%)` | `auto` | Center of foot | 3 (platforms) |
| Plant | `bottom`, `left` | none | `none` | Center of base | — |
| Fireplace | `top`, `left` | none | `none` | Center of base | — |


## Example: Cat Tree and Cat Placement

- **Cat tree**: Placement position is at the center of the foot, slightly above the rendered base. Three hardpoints are defined at the center of each platform/bed.
- **Cat**: Placement position is at the butt. When placing a cat on the tree, align the cat’s placement position to the chosen hardpoint.

## Testing Positioning Changes

After modifying positions:

1. **Visual check**: Does the object sit where expected?
2. **Hover check**: Does the cursor change to pointer?
3. **Click check**: Does clicking trigger the handler?
4. **Selection check**: Does the gold glow appear when selected?

If hover/click don't work, check `pointer-events` and `z-index`.
