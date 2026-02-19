# Agent Instructions

This document provides guidelines for AI agents and automated tools working with this repository.

## Project Overview

CatBreeder is an idle/incremental game about cat breeding, built with React and TypeScript. Players breed cats to discover genetic variations, sell cats in a dynamic market economy, and create cozy environments for their feline empire.

### Game Systems

| System | Purpose |
|--------|---------|
| **Genetics** | Cat traits, inheritance rules, breeding outcomes |
| **Economy** | Market trends, pricing, buying/selling cats |
| **Environment** | Rooms, furniture, toys, cat happiness |
| **Simulation** | Day/turn progression, events, cat needs |
| **Collection** | Discovered variations, achievements, completion tracking |

### Turn-Based Flow

The game runs on a day-by-day turn system:
1. Player makes decisions (breed, sell, decorate)
2. Player ends turn
3. Game simulates results (births, sales, events)
4. Next day begins

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
│   ├── esbuild.config.js
│   └── vitest.config.ts
├── public/              # Static assets served directly
│   └── index.html       # HTML entry point
├── src/
│   ├── app/             # React application root
│   │   ├── index.tsx    # App shell
│   │   ├── game/        # Core game state & turn loop
│   │   ├── cats/        # Cat genetics, breeding, display
│   │   ├── economy/     # Market, pricing, transactions
│   │   ├── environment/ # Rooms, furniture, decorations
│   │   └── ui/          # Shared UI components
│   ├── test/            # Test setup and utilities
│   ├── utils/           # Shared utility functions
│   ├── index.tsx        # Bootstrap/entry point
│   └── index.css        # Global styles
├── dist/                # Build output (gitignored)
└── [root config files]  # package.json, tsconfig.json, etc.
```

## Important Directories

| Directory | Purpose |
|-----------|---------|
| `src/` | All application source code |
| `src/app/` | React application (organized by feature, not type) |
| `src/app/game/` | Game state, turn system, save/load |
| `src/app/cats/` | Cat types, genetics, breeding logic |
| `src/app/economy/` | Market simulation, pricing |
| `src/app/environment/` | Room/furniture system |
| `src/app/ui/` | Reusable UI components |
| `src/test/` | Test setup, mocks, and utilities |
| `src/utils/` | Shared helper functions |
| `config/` | Build and test configuration files |
| `public/` | Static files copied to dist |

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
import { helper } from '@/utils/helpers';
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
1. Add function to `src/utils/helpers.ts` (or create new file)
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
