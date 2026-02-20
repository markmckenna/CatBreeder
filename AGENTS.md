
# Agent Instructions

## 🚀 Quickstart for Agents

**Do these every time:**
- ✅ Run `npm run typecheck && npm run test:run` after every change
- ✅ Auto-commit after each completed feature/fix/refactor (include duration in commit message)
- ✅ Follow [docs/coding-style.md](docs/coding-style.md) for all code
- ✅ Update docs and version numbers as needed
- ✅ Apply style/architecture changes project-wide

## 🔥 Critical Rules (Read First)

1. **Run checks after changes**: `npm run typecheck && npm run test:run` (**must do after every change!**)
2. **Auto-commit after each change**: Test and commit every completed task (features, fixes, refactors) before moving on
3. **Record duration**: Include execution time in commit message body (e.g., `Duration: 2m 15s`)
4. **Follow coding style**: See [docs/coding-style.md](docs/coding-style.md)
5. **Visual positioning**: See [docs/visual-system.md](docs/visual-system.md)
6. **CSS patterns**: See [docs/css-patterns.md](docs/css-patterns.md)
7. **Save version bumps**: Increment `SAVE_VERSION` in `src/app/game/save.ts` when changing saved state structure
8. **Update documentation**: Keep AGENTS.md, README.md, and docs/ current
9. **Document style decisions**: When making code changes based on style/architecture principles, add the rationale to [docs/coding-style.md](docs/coding-style.md)
10. **Apply style changes project-wide**: When adding or updating coding style guidelines, proactively apply them across the existing codebase


## 📚 Supplementary Documentation

- [docs/coding-style.md](docs/coding-style.md): Code style, architecture, naming
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
	base/    — Platform utilities
	test/    — Test setup
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

**Before changes:**
- Run `npm run typecheck` (types)
- Run `npm run lint` (style)
- Run `npm run test:run` (tests)

**After changes:**
- Run `npm run lint:fix`
- Run `npm run test:run`
- Run `npm run build`

**Adding features:**
- Create files in the right feature folder
- Add tests
- Export from index if shared
- Add/update styles as needed

**Adding dependencies:**
```bash
npm install <package>           # Runtime
npm install -D <package>        # Dev
```
Check types, build, and tests after adding.


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
1. Add to `src/base/`
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

- Always run tests after changes (`npm run test:run`)
- Use TypeScript only (no `.js` in `src/`)
- Keep dependencies minimal
- Write tests for new code
- Follow existing patterns
- Update docs (AGENTS.md, README.md, game-design.md)
- Commit after each feature (atomic changes)
- Bump save version on save structure changes


## Documentation Requirements

**Any change to project structure, commands, or workflow must update docs.**

**Gameplay features:** Document in [docs/game-design.md](docs/game-design.md)
- What each system does
- Formulas/rules
- System interactions

**Update docs/game-design.md when:**
- Adding/modifying mechanics, formulas, traits, turn flow

**Update AGENTS.md when:**
- Adding/removing directories, npm scripts, config locations, conventions, build/test setup, dependencies

**Update README.md when:**
- Changing getting started, commands, or build/run steps

**Checklist:**
- [ ] Structure diagram accurate
- [ ] Commands work
- [ ] File paths correct
- [ ] Config locations current
- [ ] New patterns documented
- [ ] Game mechanics in game-design.md
