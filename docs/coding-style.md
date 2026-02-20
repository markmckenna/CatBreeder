# Coding Style Guide

Code style and architectural conventions for the CatBreeder project. When making style-based changes, document the rationale here.

## General Principles

### Minimize Duplication
Extract shared code into utilities, avoid redundant comments that restate names, reuse test helpers.

### Transparent Utility Functions
When a utility function accepts optional arguments, it should pass through nullish values rather than converting them:

```typescript
// ✅ When input can be optional, preserve null/undefined
function capitalize(str: string | null | undefined): string | null | undefined {
  if (str == null) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ❌ Don't convert null/undefined to a different value
function capitalize(str: string | null | undefined): string {
  if (!str) return '';  // Loses information
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
```

However, if a function's signature already requires non-null arguments, don't change it to accept null/undefined just for passthrough. The goal is simpler typing, not forcing generics everywhere:

```typescript
// ✅ Fine as-is if callers always have a string
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
```

### Prefer Single-Line and Fluent Style
When a function body is a single expression, use arrow function syntax without braces. For method chains, align continuation lines:

```typescript
// ✅ Single expression as arrow function
export const formatCurrency = (amount: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency })
    .format(amount);

// ✅ Short enough for one line
export const square = (n: number) => n * n;

// ❌ Unnecessary braces and return
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}
```

Use `function` declarations for:
- Functions with multiple statements
- Functions that need hoisting
- Methods that use `this`

### Fluent Naming Convention
Prefer fluent naming over getter-style naming for transformation functions:

```typescript
// ✅ Fluent style - reads naturally as "phenotype for genotype"
export const phenotypeFor = (genotype: Genotype): Phenotype => ...
export const keyFor = (item: Item): string => ...

// ❌ Getter style - reads awkwardly as "get phenotype, genotype"  
export const getPhenotype = (genotype: Genotype): Phenotype => ...
export const getKey = (item: Item): string => ...
```

For generator functions (that create rather than transform), drop the `get` prefix:

```typescript
// ✅ Generator without get prefix
export const randomCatName = (rng?: RandomFn): string => ...

// ❌ Getter style for generator
export const getRandomCatName = (rng?: RandomFn): string => ...
```

### Abbreviated Parameter Names
For concise single-line functions with typed parameters, use short symbolic names rather than verbose ones. When context is clear from the type, a single parameter can be named `it`:

```typescript
// ✅ Short names when type provides context
export const sizePhenotypeFor = (it: SizeGenotype): SizePhenotype =>
  it.includes('S') ? 'large' : 'small';

// ✅ Inline callbacks - type flows from context
cats.filter(it => it.age > 30)
promise.then(it => it.value).catch(e => console.error(e))

// ✅ Two parameters - use single letters or short names
const add = (a: number, b: number) => a + b;

// ❌ Verbose names in simple functions
export const sizePhenotypeFor = (genotype: SizeGenotype): SizePhenotype =>
  genotype.includes('S') ? 'large' : 'small';
```

Use abbreviated names when:
- The function is a single expression
- Parameter types are explicit (or inferred in callbacks)
- The function name already describes the transformation

Keep descriptive names when:
- The function has multiple statements
- Multiple parameters of the same type need disambiguation
- The meaning isn't clear from types alone

### Write Naturally Generic Functions
When a utility function's logic doesn't depend on a specific type, write it generically:

```typescript
// ✅ Generic - works with any array type
export const pickRandom = <T>(items: T[], rng = defaultRandom): T =>
  items[Math.floor(rng() * items.length)];

// ✅ Generic - works with any two values
export const coinFlip = <T>(a: T, b: T, rng = defaultRandom): T =>
  rng() < 0.5 ? a : b;

// ❌ Unnecessarily specific
export const pickRandomString = (items: string[], rng = defaultRandom): string =>
  items[Math.floor(rng() * items.length)];
```

This applies when:
- The function operates on values without using type-specific methods
- The same logic would work for different types
- Type parameters can be inferred from usage

### Omit Redundant Type Annotations
Let TypeScript infer types when the result is obvious from context:

```typescript
// ✅ Return type inferred from expression
export const formatMoney = (amount: number) => `$${amount.toLocaleString()}`;
export const square = (n: number) => n * n;

// ✅ Void return is obvious - no one would store the result
export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

// ❌ Redundant return type annotation
export const formatMoney = (amount: number): string => `$${amount.toLocaleString()}`;
export function deleteSave(): void { ... }
```

Omit type annotations when:
- Return type is obvious from the expression
- Function clearly has no meaningful return value (void)
- Types can be inferred from assignment or usage

Keep explicit types when:
- The function is part of a public API that needs documentation
- The inferred type would be wider than intended
- Complex return types benefit from explicit declaration

### Prefer Direct Assignment Over Wrapping
When assigning a function that doesn't depend on `this`, assign it directly rather than wrapping in an arrow function:

```typescript
// ✅ Direct assignment
export const defaultRandom: RandomFn = Math.random;

// ❌ Unnecessary wrapper
export const defaultRandom: RandomFn = () => Math.random();
```

This only applies when the assigned function:
- Doesn't use `this` (most static methods like `Math.random`)
- Has a compatible signature (no extra arguments to discard)

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

### Position Helpers Near Their Consumers

Utility functions should be placed close to the code that uses them:
- UI formatting functions (e.g., `formatMoney`) belong in `src/app/ui/`
- Domain helpers belong in their respective domain directories
- Only truly generic utilities (no domain knowledge) belong in `src/base/`

```
src/app/
├── ui/
│   ├── format.ts          # UI formatting utilities
│   └── MarketPanel/       # Uses format.ts
└── base/
    └── helpers.ts         # Generic utilities (capitalize, etc.)
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
