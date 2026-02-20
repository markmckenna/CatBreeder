# Agent Instructions

Guidelines for AI agents working with this repository.

## Critical Rules (Read First)

1. **Run checks after changes**: `npm run typecheck && npm run test:run`
2. **Commit after each change**: Test and commit every completed task (features, fixes, refactors) before moving on
3. **Visual positioning**: See [docs/VISUAL_SYSTEM.md](docs/VISUAL_SYSTEM.md) for room coordinates
4. **CSS patterns**: See [docs/CSS_PATTERNS.md](docs/CSS_PATTERNS.md) for styling conventions
5. **Prefer CSS Modules**: Inline styles only when all properties derive from props/state
6. **Save version bumps**: Increment `SAVE_VERSION` in `src/app/game/save.ts` when changing saved state structure
7. **Update documentation**: Keep AGENTS.md, README.md, and [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md) current
8. **Use existing patterns**: Follow conventions in existing files
9. **Minimize duplication**: Extract shared code into utilities, avoid redundant comments that restate names, reuse test helpers
10. **Prefer promise chains when simpler**: Use `.then()/.catch()` over async/await when it reduces a multi-line function to a single expression

## Supplementary Documentation

| Document | Purpose |
|----------|---------|
| [docs/VISUAL_SYSTEM.md](docs/VISUAL_SYSTEM.md) | Room coordinates, positioning, pointer-events |
| [docs/CSS_PATTERNS.md](docs/CSS_PATTERNS.md) | CSS Modules, z-index, transitions |
| [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md) | Game mechanics, formulas, balance values |

**Read these when working on related areas** - they contain detailed patterns that prevent common mistakes.

## Project Overview

CatBreeder is an idle/incremental game about cat breeding, built with React and TypeScript. Players breed cats to discover genetic variations, sell cats in a dynamic market economy, and create cozy environments for their feline empire.

### Game Systems

| System | Purpose |
|--------|---------|
| **Genetics** | Cat traits, inheritance rules, breeding outcomes |
| **Economy** | Market trends, pricing, buying/selling cats |
| **Environment** | Rooms, furniture, toys, cat happiness |
| **Simulation** | Day/turn progression, events, cat needs |
| **Collection** | Discovered variations, achievements |

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.x
- **UI Framework**: React 18
- **Bundler**: ESBuild
- **Test Framework**: Vitest with React Testing Library
- **Linting**: ESLint with TypeScript and React plugins

## Project Structure

```
├── config/              # Build and test configuration
├── docs/                # Detailed documentation
├── public/              # Static assets
├── src/
│   ├── app/             # React application root
│   │   ├── game/        # Core game state & turn loop
│   │   ├── cats/        # Cat genetics, breeding
│   │   ├── economy/     # Market, pricing
│   │   ├── environment/ # Rooms, furniture
│   │   └── ui/          # Visual components
│   ├── base/            # Platform utilities (random, helpers)
│   └── test/            # Test setup
└── dist/                # Build output (gitignored)
```

### Feature-Based Organization

Code in `src/app/` should be organized by **feature or domain**, not by type. Group related files together to minimize distance between components that work together.

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

**Design Intent**: Game logic should be able to run in a Node.js environment without any UI dependencies. Data flows from game logic to UI via `useGame()` hook, which is the primary entry point for UI components to access game state.

### Dependency Direction

**UI modules may import from non-UI modules, but never the reverse.**

```
✅ ui/CatSprite → cats/genetics (UI imports logic)
✅ ui/GameUI → game/GameContext (UI imports state)
✅ game/state → cats/genetics (logic imports logic)
❌ cats/genetics → ui/CatSprite (logic must NOT import UI)
```

This ensures game logic remains testable and portable without UI dependencies.

## Commands

### Development
```bash
npm start            # Build, start dev server, and open browser (port 3000)
npm run dev          # Start dev server with hot reload (no browser open)
```

### Building
```bash
npm run build        # Production build to dist/
npm run preview      # Serve production build locally
```

### Testing
```bash
npm test             # Run tests in watch mode
npm run test:run     # Run tests once (CI mode)
npm run test:coverage # Run tests with coverage report
```

### Code Quality
```bash
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting errors
npm run typecheck    # Run TypeScript type checking
```

## Coding Conventions

### File Naming
- React components with styles: Use folder-per-component (see below)
- Simple React components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities/helpers: `camelCase.ts` (e.g., `helpers.ts`)
- Tests: `index.test.tsx` (in component folder) or `[filename].test.ts`
- Non-JS files (HTML, CSS): `kebab-case` (e.g., `index.html`, `main-layout.css`)

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

### Styling with CSS Modules
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

For simple components without styles, use a single file (e.g., `CatCard.tsx`) instead of a folder.

### Styling Architecture Rules

**Prefer CSS Modules over inline styles.** Move static styles to adjacent `styles.css` files rather than using `CSSProperties` objects or inline `style` props. This keeps styling concerns in CSS where they belong.

**Exception: Highly dynamic styles.** When every style property depends on props/state (e.g., CatSprite where colors, sizes, and positions all derive from cat phenotype), inline styles are acceptable. The rule of thumb: if a style would be static for most instances, it belongs in CSS.

**Do this:**
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

### SVG Componentization

For complex SVG visuals (rooms, backgrounds, detailed graphics), compose from individual SVG components rather than one monolithic SVG:

```tsx
// ✅ Composable SVG components
function Room() {
  return (
    <div className={styles.container}>
      <WallFloor />       {/* Base background */}
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

### Testing Conventions
- Place tests adjacent to source files (e.g., `index.tsx` → `index.test.tsx`)
- Use descriptive test names: `it('renders the user name when logged in')`
- Prefer `screen.getByRole()` over `getByTestId()`
- Test behavior, not implementation details

### Import Aliases
The `@/` alias maps to `src/`:
```tsx
import { createSeededRandom } from '@/base/random';
```

## Workflow Guidelines

### Before Making Changes
1. Run `npm run typecheck` to ensure types are valid
2. Run `npm run lint` to check for style issues
3. Run `npm run test:run` to verify tests pass

### After Making Changes
1. Run `npm run lint:fix` to auto-fix any lint issues
2. Run `npm run test:run` to verify no tests broke
3. Run `npm run build` to verify production build works

### Adding New Features
1. Create component file in appropriate directory
2. Add corresponding test file
3. Export from index if creating a shared module
4. Update `src/index.css` or add component styles if needed

### Adding Dependencies
```bash
npm install <package>           # Runtime dependency
npm install -D <package>        # Dev dependency
```

After adding dependencies, verify:
- TypeScript types are available (install `@types/<package>` if needed)
- Build still works: `npm run build`
- Tests still pass: `npm run test:run`

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and npm scripts |
| `tsconfig.json` | TypeScript compiler options |
| `.eslintrc.cjs` | ESLint rules and plugins |
| `config/vitest.config.ts` | Test runner configuration |
| `config/esbuild.config.js` | Build configuration |
| `.husky/pre-commit` | Git hook: runs lint before commits |
| `.husky/pre-push` | Git hook: runs build + tests before push |

### Configuration Location Guidelines

**Use `config/`** for configs explicitly passed via CLI flags:
- Build configs (esbuild, webpack, etc.)
- Test configs (vitest, jest, etc.)

**Keep at root** for configs auto-discovered by tools:
- `.eslintrc.cjs` - ESLint walks up directory tree
- `tsconfig.json` - TypeScript and editors expect it at root
- `.husky/` - Git hooks require specific location
- `.gitignore` - Git requirement

When adding new tooling, prefer `config/` if the tool supports explicit config paths.

## Git Hooks

The project uses Husky to enforce quality checks:

- **pre-commit**: Runs `npm run lint` - commits blocked if lint fails
- **pre-push**: Runs `npm run build && npm run test:run` - pushes blocked if either fails

To bypass hooks in emergencies: `git commit --no-verify` or `git push --no-verify`

## Common Tasks

### Create a New Component
1. Identify the feature/domain the component belongs to
2. Create or use an existing feature folder: `src/app/<feature>/`
3. Create component file: `src/app/<feature>/MyComponent.tsx`
4. Create test file alongside: `src/app/<feature>/MyComponent.test.tsx`
5. Import and use in parent component

### Add a New Utility Function
1. Add function to `src/base/` (or create new file)
2. Add tests to corresponding `.test.ts` file
3. Export from the module

### Add Global Styles
Edit `src/index.css` or create component-specific CSS files and import them where needed.

### Modify Build Configuration
Edit `config/esbuild.config.js`. Key options:
- `entryPoints`: Input files
- `outfile`: Output bundle location
- `minify`: Enable/disable minification
- `sourcemap`: Source map generation

## Troubleshooting

### TypeScript Errors
- Run `npm run typecheck` for detailed error messages
- Check `tsconfig.json` for compiler options
- Ensure `@types/*` packages are installed for dependencies

### Test Failures
- Run `npm test` for watch mode with detailed output
- Check `src/test/setup.ts` for global test configuration
- Verify mocks are properly set up

### Build Failures
- Check console output from `npm run build`
- Verify all imports resolve correctly
- Check for circular dependencies

## Notes for Agents

1. **Always run tests after changes** - Use `npm run test:run`
2. **Prefer TypeScript** - Don't create `.js` files in `src/`
3. **Keep dependencies minimal** - Only add what's necessary
4. **Write tests for new code** - Maintain test coverage
5. **Use existing patterns** - Follow conventions in existing files
6. **Update documentation** - Keep AGENTS.md, README.md, and GAME_DESIGN.md current (see below)
7. **Commit after each feature** - When implementing multiple features, test and commit each one separately before moving to the next. This keeps changes atomic and makes it easier to review or revert individual features.
8. **Bump save version on compatibility changes** - When changing saved game state structure (adding/removing fields, changing types), increment `SAVE_VERSION` in `src/app/game/save.ts` to invalidate old saves.

## Documentation Requirements

**All changes that affect project structure, commands, or workflows MUST include documentation updates.**

### Game Design Documentation

**All gameplay-related features MUST be documented in [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md).**

This document serves as the authoritative reference for how game mechanics work. Maintainers should be able to read through it and understand:
- What each system does
- The formulas and rules that govern behavior
- How systems interact with each other

### When to Update docs/GAME_DESIGN.md
- Adding new game mechanics or systems
- Modifying existing gameplay behavior
- Changing formulas, rates, or balance values
- Adding new traits, items, or currencies
- Modifying the turn flow or game loop

### When to Update AGENTS.md
- Adding or removing directories
- Adding or modifying npm scripts
- Changing configuration file locations
- Adding new conventions or patterns
- Modifying build or test setup
- Adding new dependencies that affect workflows

### When to Update README.md
- Changes to getting started instructions
- New or modified commands users need to know
- Changes affecting how users run or build the project

### Documentation Checklist
After making structural changes, verify:
- [ ] Project structure diagram is accurate
- [ ] All commands listed actually work
- [ ] File paths in examples are correct
- [ ] Configuration file locations are current
- [ ] Any new patterns are documented
- [ ] Game mechanics are documented in GAME_DESIGN.md
