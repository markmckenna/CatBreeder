# Agent Instructions

## 🔥 Critical Rules (Read First)

**Always follow these rules, step by step:**

1. **Never ask for permission for CLI/tool actions.** Move forward unless clarification is needed.
2. **After every change, run:** `npm run typecheck && npm run test:run` (always verify correctness).
3. **Commit after each meaningful functional change.** Test, then commit every feature, fix, or refactor before starting the next.
4. **Include execution time in commit messages.** Example: `Duration: 2m 15s`.
5. **Follow coding style and architecture.** See [coding-style](docs/coding-style.md) and [architecture](docs/architecture.md).
6. **Apply visual and CSS conventions.** See [docs/visual-system.md](docs/visual-system.md) and [docs/css-patterns.md](docs/css-patterns.md).
7. **Bump SAVE_VERSION** in `src/app/game/save.ts` if saved state structure changes.
8. **Update documentation immediately** after any change to structure, commands, or workflow. Keep AGENTS.md, README.md, and docs/ current.
9. **Document style decisions.** Add rationale to [docs/coding-style.md](docs/coding-style.md) for new or updated style rules.
10. **Apply style changes everywhere.** When updating guidelines, refactor the whole codebase to match.
11. **Clean up after refactoring.** Delete old files, remove unused code, and ensure no duplicates remain.

## 📚 Supplementary Documentation

- [docs/coding-style.md](docs/coding-style.md): Code style, architecture, naming
- [docs/architecture.md](docs/architecture.md): Architecture (MVVM, logic/renderer separation)
- [docs/visual-system.md](docs/visual-system.md): Room coordinates, positioning
- [docs/css-patterns.md](docs/css-patterns.md): CSS Modules, z-index, transitions
- [docs/game-design.md](docs/game-design.md): Game mechanics, formulas, balance

**Read these when working on related areas—they prevent common mistakes.**

## Project Overview

CatBreeder is an idle/incremental game about cat breeding, built with React and TypeScript. Players breed cats, discover genetics, sell in a dynamic market, and create cozy environments.

### Game Systems

- **Genetics**: Cat traits, inheritance, breeding
- **Economy**: Market, pricing, buying/selling
- **Environment**: Rooms, furniture, toys, happiness
- **Simulation**: Day/turns, events, cat needs
- **Collection**: Variations, achievements


## Tech Stack

- Node.js 18+
- TypeScript 5.x
- React 18
- ESBuild
- Vitest + React Testing Library
- ESLint (TypeScript/React)


## Project Structure

config/    — Build/test config
docs/      — Documentation
public/    — Static assets
src/
	app/     — App root, features (game, cats, economy, environment, ui)
	core/    — Platform utilities
	test/    — Test setup
	css-modules.d.ts
	index.css
	index.tsx
dist/      — Build output


See [docs/coding-style.md](docs/coding-style.md) for feature-based organization, UI/game logic separation, and dependency direction.

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

**After every change:**
- Run `npm run lint:fix` (auto-fix style)
- Run `npm run build` (verify build)
- Run `npm run test:run` (verify tests)

**When adding features:**
- Localize code within feature-specific folders (obeying guidelines in) [architecture](docs/architecture.md)
- Add tests for new code
- Export from index if shared
- Add or update styles as needed

**When adding dependencies:**
```bash
npm install <package>           # Runtime
npm install -D <package>        # Dev
```
After installing, always check types, build, and tests.


## Configuration Files

- `package.json`: Dependencies, npm scripts
- `tsconfig.json`: TypeScript config
- `.eslintrc.cjs`: ESLint rules
- `config/vitest.config.ts`: Test config
- `config/esbuild.config.js`: Build config
- `.husky/pre-commit`: Lint before commit
- `.husky/pre-push`: Build/tests before push


**Config location:**
- Use `config/` for CLI configs (build, test)
- Keep at root for auto-discovered configs (ESLint, tsconfig, husky, .gitignore)


## Git Hooks

- **pre-commit**: Runs `npm run lint` (blocks commit if fails)
- **pre-push**: Runs `npm run build && npm run test:run` (blocks push if fails)

Bypass: `git commit --no-verify` or `git push --no-verify`


## Common Tasks

**New component:**
1. Pick feature folder: `src/app/<feature>/`
2. Add component file and test
3. Import in parent

**New utility:**
1. Add to `src/core/`
2. Add tests
3. Export

**Global styles:**
Edit `src/index.css` or add component CSS

**Build config:**
Edit `config/esbuild.config.js` (see comments for options)


## Troubleshooting


**TypeScript errors:**
- Run `npm run typecheck`
- Check `tsconfig.json`
- Install missing `@types/*`

**Test failures:**
- Run `npm test` (watch mode)
- Check `src/test/setup.ts`
- Verify mocks

**Build failures:**
- Check `npm run build` output
- Verify imports
- Check for circular deps


## Notes for Agents

**Agent must always:**
- Run tests after every change (`npm run test:run`)
- Use TypeScript only (no `.js` files in `src/`)
- Keep dependencies minimal
- Write tests for all new code
- Follow existing code patterns and conventions
- Update documentation (AGENTS.md, README.md, game-design.md) after any relevant change
- Commit after each atomic feature or fix
- Bump save version if save structure changes


## Documentation Requirements

**Update documentation immediately for any change to structure, commands, or workflow.**

**Gameplay features:** Document in [docs/game-design.md](docs/game-design.md):
- System purpose
- Formulas and rules
- System interactions

**Update docs/game-design.md when:**
- Adding or modifying game mechanics, game components, rules or logic.
- Focus on high level conceptual logic.

**Update AGENTS.md when:**
- Adding/removing directories, npm scripts, config locations, conventions, build/test setup, or dependencies

**Update README.md when:**
- Changing getting started, commands, or build/run steps