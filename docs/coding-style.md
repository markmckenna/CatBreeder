
# Coding Style Guide

Agent-oriented code and architecture conventions for CatBreeder. Document rationale for new style rules here.

## General Principles

### Eliminate Unused Code
Remove unused functions, variables, imports, and dead code. Don't keep utilities "just in case"—recreate them if needed.

### Minimize Exports
Export only what's needed by other modules. Prefer internal helpers. Move logic into the owning module when possible ("tell, don't ask").

### Minimize Duplication
Extract shared code, avoid redundant comments, reuse test helpers.

### Concise Comments
Prefer brief, sentential comments over verbose JSDoc. Only use `@param`/`@returns` for non-obvious details.

### Transparent Utility Functions
If a utility accepts optional args, pass through null/undefined—don't convert unless required. Don't widen types just for passthrough.

### Prefer Single-Line and Fluent Style
Use arrow functions for single-expression bodies. Align method chains. Use `function` for multi-statement, hoisted, or `this`-using functions.

### Fluent Naming Convention
Prefer fluent names (e.g., `phenotypeFor`) over `getX` for transforms. For generators, drop the `get` prefix.

### Inline Single-Use Variables
Inline variables used only once, unless it hurts clarity. Keep variables for clarity, reuse, or easier debugging.

promise.then(it => it.value).catch(e => console.error(e))
### Abbreviated Parameter Names
Use short names for single-line, typed functions. Prefer `it` or single letters when context is clear. Use descriptive names for multi-statement or ambiguous cases.

### Write Naturally Generic Functions
Write utilities generically when logic is type-agnostic. Use type parameters when logic works for multiple types.

### Omit Redundant Type Annotations
Let TypeScript infer types when obvious. Use explicit types for public APIs, when inference is too broad, or for complex returns.

### Prefer Direct Assignment Over Wrapping
Assign functions directly (e.g., `Math.random`) if they don't use `this` and signatures match. Avoid unnecessary wrappers.

### Minimize Nesting
Reduce visual complexity: omit braces for single-line if/else, use ternaries, and prefer early returns over else blocks.

### Order Conditions by Runtime Cost
Order if-statement conditions by runtime cost (cheapest first): equality, then string methods, then regex, then function calls.

### Prefer Promise Chains When Simpler
Use `.then()/.catch()` over async/await when it makes code a single expression.

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
src/app/
├── components/            # ❌ Don't group by type
│   ├── CatCard.tsx
│   └── MarketView.tsx
├── logic/                 # ❌ Don't separate logic from UI
│   ├── genetics.ts
│   └── market.ts
└── tests/                 # ❌ Keep tests with source
    └── ...
## Project Organization

### Feature-Based Structure
Organize `src/app/` by feature/domain, not by type. Keep related files (including tests) together.

src/app/
├── ui/
│   └── format.ts          # UI formatting utilities
└── base/
    └── random.ts          # Generic utilities (seeded RNG, etc.)
### Position Helpers Near Their Consumers
Place helpers/utilities near their main consumers. Only generic utilities go in `src/base/`.

### UI/Game Logic Separation
Keep UI (src/app/ui/) and game logic (src/app/game/, cats/, economy/, environment/) separate. Game logic must not depend on UI. Data flows from game logic to UI.

### Dependency Direction
UI may import from non-UI, but never the reverse. Game logic must remain testable and portable.

## File Naming

- Components with styles: folder-per-component
- Simple components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Tests: `index.test.tsx` or `[filename].test.ts`
- Non-JS: `kebab-case`

src/app/ui/GameUI/
├── index.tsx        # Component
├── styles.css       # CSS Module (scoped automatically)
└── index.test.tsx   # Tests
## Component Patterns

### Folder-per-Component
For styled components, use a folder: `index.tsx`, `styles.css`, `index.test.tsx`. For simple components, use a single file.

### Component Structure
Imports, types, then component. Export default at end.

### SVG Componentization
Compose complex SVGs from small components for maintainability and reusability.

## Styling

### Prefer CSS Modules
Put static styles in `styles.css` (CSS Modules) next to components. Use inline styles only for highly dynamic cases.

### CSS Modules Usage
Name CSS files `styles.css` in component folders. CSS Modules provide scoping, full CSS features, and type-safe imports.

## Testing

- Place tests next to source files
- Use descriptive test names
- Prefer `screen.getByRole()` over `getByTestId()`
- Test behavior, not implementation
- Use shared test helpers from feature folders

## Import Aliases

The `@/` alias maps to `src/`.
