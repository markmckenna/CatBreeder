# Agent Instructions

Guidelines for AI agents working with this repository.

## Critical Rules (Read First)

1. **Run checks after changes**: `npm run typecheck && npm run test:run`
2. **Commit after each change**: Test and commit every completed task (features, fixes, refactors) before moving on
3. **Record duration**: Include execution time in commit message body (e.g., `Duration: 2m 15s`)
4. **Follow coding style**: See [docs/coding-style.md](docs/coding-style.md) for conventions
5. **Visual positioning**: See [docs/visual-system.md](docs/visual-system.md) for room coordinates
6. **CSS patterns**: See [docs/css-patterns.md](docs/css-patterns.md) for styling conventions
7. **Save version bumps**: Increment `SAVE_VERSION` in `src/app/game/save.ts` when changing saved state structure
8. **Update documentation**: Keep AGENTS.md, README.md, and docs/ current
9. **Document style decisions**: When making code changes based on style/architecture principles, add the rationale to [docs/coding-style.md](docs/coding-style.md)

## Supplementary Documentation

| Document | Purpose |
|----------|---------|
| [docs/coding-style.md](docs/coding-style.md) | Code style, architecture, naming conventions |
| [docs/visual-system.md](docs/visual-system.md) | Room coordinates, positioning, pointer-events |
| [docs/css-patterns.md](docs/css-patterns.md) | CSS Modules, z-index, transitions |
| [docs/game-design.md](docs/game-design.md) | Game mechanics, formulas, balance values |

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

See [docs/coding-style.md](docs/coding-style.md) for feature-based organization, UI/game logic separation, and dependency direction rules.

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

See [docs/coding-style.md](docs/coding-style.md) for detailed coding conventions including:
- File naming and component structure
- Styling with CSS Modules
- Testing conventions
- Import aliases

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
6. **Update documentation** - Keep AGENTS.md, README.md, and game-design.md current (see below)
7. **Commit after each feature** - When implementing multiple features, test and commit each one separately before moving to the next. This keeps changes atomic and makes it easier to review or revert individual features.
8. **Bump save version on compatibility changes** - When changing saved game state structure (adding/removing fields, changing types), increment `SAVE_VERSION` in `src/app/game/save.ts` to invalidate old saves.

## Documentation Requirements

**All changes that affect project structure, commands, or workflows MUST include documentation updates.**

### Game Design Documentation

**All gameplay-related features MUST be documented in [docs/game-design.md](docs/game-design.md).**

This document serves as the authoritative reference for how game mechanics work. Maintainers should be able to read through it and understand:
- What each system does
- The formulas and rules that govern behavior
- How systems interact with each other

### When to Update docs/game-design.md
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
- [ ] Game mechanics are documented in game-design.md
