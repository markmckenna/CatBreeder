# Coding Style Guide

Code style and architectural conventions for the CatBreeder project. When making style-based changes, document the rationale here.

## General Principles

### Minimize Duplication
Extract shared code into utilities, avoid redundant comments that restate names, reuse test helpers.

### Minimize Nesting
Reduce visual complexity by:
- Omitting braces for single-line if/else bodies
- Keeping single-line bodies on the same line as the condition
- Using ternaries for conditional assignments
- Using early returns to avoid else blocks

```typescript
// ✅ Minimal nesting
if (!cat) return null;
const status = cat.age >= 4 ? 'adult' : 'kitten';

// ❌ Excessive nesting
if (cat) {
  let status;
  if (cat.age >= 4) {
    status = 'adult';
  } else {
    status = 'kitten';
  }
  // ...
} else {
  return null;
}
```

### Order Conditions by Runtime Cost
In if statements with multiple commutative conditions, order them by expected runtime (cheapest first):

```typescript
// ✅ Equality check before substring search
if (err.code === 'EADDRINUSE' || err.message?.includes('EADDRINUSE'))

// ❌ Expensive operation first
if (err.message?.includes('EADDRINUSE') || err.code === 'EADDRINUSE')
```

Cost hierarchy (cheapest to most expensive):
1. Boolean/null checks (`!x`, `x === null`)
2. Numeric comparisons (`x > 0`)
3. String equality (`x === 'foo'`)
4. String methods (`.includes()`, `.startsWith()`)
5. Regex operations (`.match()`, `.test()`)
6. Function calls with side effects

### Prefer Promise Chains When Simpler
Use `.then()/.catch()` over async/await when it reduces a multi-line function to a single expression:

```javascript
// ✅ Prefer this
const isDevServerRunning = (port) =>
  fetch(`http://localhost:${port}/`)
    .then((res) => res.ok)
    .catch(() => false);

// ❌ Over this
async function isDevServerRunning(port) {
  try {
    const response = await fetch(`http://localhost:${port}/`);
    return response.ok;
  } catch {
    return false;
  }
}
```

## Project Organization

### Feature-Based Structure
Code in `src/app/` is organized by **feature or domain**, not by type. Group related files together to minimize distance between components that work together.

**Do this:**
```
src/app/
├── index.tsx              # App root
├── cats/                  # Cat domain
│   ├── types.ts           # Cat type definitions
│   ├── genetics.ts        # Breeding/inheritance logic
│   ├── genetics.test.ts
│   ├── CatCard.tsx
│   └── CatCard.test.tsx
└── economy/               # Economy domain
    ├── types.ts
    ├── market.ts          # Market simulation
    ├── market.test.ts
    └── MarketView.tsx
```

**Not this:**
```
src/app/
├── components/            # ❌ Don't group by type
│   ├── CatCard.tsx
│   └── MarketView.tsx
├── logic/                 # ❌ Don't separate logic from UI
│   ├── genetics.ts
│   └── market.ts
└── tests/                 # ❌ Keep tests with source
    └── ...
```

### UI/Game Logic Separation

The codebase maintains a clean separation between rendering (UI) and non-rendered game logic:

| Layer | Directory | Purpose |
|-------|-----------|---------|
| **UI** | `src/app/ui/` | Visual components (CatSprite, panels, overlays) |
| **Game Logic** | `src/app/game/` | State management, turn processing, save/load |
| **Domain Logic** | `src/app/cats/`, `economy/`, `environment/` | Pure game mechanics (no React) |

**Design Intent**: Game logic should be able to run in a Node.js environment without any UI dependencies. Data flows from game logic to UI via `useGame()` hook.

### Dependency Direction

**UI modules may import from non-UI modules, but never the reverse.**

```
✅ ui/CatSprite → cats/genetics (UI imports logic)
✅ ui/GameUI → game/GameContext (UI imports state)
✅ game/state → cats/genetics (logic imports logic)
❌ cats/genetics → ui/CatSprite (logic must NOT import UI)
```

This ensures game logic remains testable and portable without UI dependencies.

## File Naming

- React components with styles: Use folder-per-component (see below)
- Simple React components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities/helpers: `camelCase.ts` (e.g., `helpers.ts`)
- Tests: `index.test.tsx` (in component folder) or `[filename].test.ts`
- Non-JS files (HTML, CSS): `kebab-case` (e.g., `index.html`, `main-layout.css`)

## Component Patterns

### Folder-per-Component Structure

Components with styles use a folder structure for cleaner organization:

```
src/app/ui/GameUI/
├── index.tsx        # Component
├── styles.css       # CSS Module (scoped automatically)
└── index.test.tsx   # Tests
```

This pattern:
- Avoids verbose `.module.css` naming
- Keeps related files together
- Allows clean imports: `import GameUI from './ui/GameUI'`

For simple components without styles, use a single file (e.g., `CatCard.tsx`) instead of a folder.

### Component Structure

```tsx
// Imports
import { useState } from 'react';

// Types (if needed)
interface Props {
  title: string;
}

// Component
function MyComponent({ title }: Props) {
  const [state, setState] = useState(0);
  
  return <div>{title}</div>;
}

export default MyComponent;
```

### SVG Componentization

For complex SVG visuals, compose from individual SVG components rather than one monolithic SVG:

```tsx
// ✅ Composable SVG components
function Room() {
  return (
    <div className={styles.container}>
      <WallFloor />
      <Window side="left" />
      <Fireplace />
      <Furniture />
      {children}
    </div>
  );
}

function Fireplace() {
  return (
    <svg viewBox="0 0 240 210" className={styles.fireplace}>
      {/* Fireplace SVG content */}
    </svg>
  );
}
```

Benefits:
- Individual elements can be positioned via CSS
- Easier to maintain and modify individual pieces
- Better code organization and reusability
- Animations and interactions can target specific elements

## Styling

### Prefer CSS Modules Over Inline Styles

Move static styles to adjacent `styles.css` files rather than using `CSSProperties` objects or inline `style` props:

```tsx
import styles from './styles.css';

function Card({ highlighted }: Props) {
  return (
    <div className={highlighted ? styles.highlighted : styles.card}>
      Content
    </div>
  );
}
```

**Not this:**
```tsx
const cardStyle: CSSProperties = {  // ❌ Move to CSS
  padding: '16px',
  borderRadius: '8px',
};

function Card() {
  return <div style={cardStyle}>Content</div>;
}
```

**Exception: Highly dynamic styles.** When every style property depends on props/state (e.g., CatSprite where colors, sizes, and positions all derive from cat phenotype), inline styles are acceptable. The rule of thumb: if a style would be static for most instances, it belongs in CSS.

### CSS Modules Usage

CSS files named `styles.css` in component folders are treated as CSS Modules:

```tsx
import styles from './styles.css';

function GameUI() {
  return <div className={styles.container}>...</div>;
}
```

CSS Module benefits:
- Scoped class names (no collisions)
- Full CSS features (`:hover`, media queries, transitions)
- Co-located with components
- Type-safe imports via `src/css-modules.d.ts`

## Testing

- Place tests adjacent to source files (e.g., `index.tsx` → `index.test.tsx`)
- Use descriptive test names: `it('renders the user name when logged in')`
- Prefer `screen.getByRole()` over `getByTestId()`
- Test behavior, not implementation details
- Use shared test helpers from `@/test/helpers.ts`

## Import Aliases

The `@/` alias maps to `src/`:

```tsx
import { createSeededRandom } from '@/base/random';
```
