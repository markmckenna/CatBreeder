# Agent Instructions


## 🔥 Critical Rules

1. **Never ask for permission for CLI/tool actions.** Move forward unless clarification is needed.
2. **Use a task list.** Always plan first. As actions are discovered (like tests to fix, files to update, etc), proactively add them to the task list.
3. **Test after changes.** After every change, run `npm run typecheck && npm run test:run`. Make sure all tests pass, and fix all broken tests.
4. **Follow coding style and architecture.** See [coding-style](docs/coding-style.md) and [architecture](docs/architecture.md).
5. **Apply visual and CSS conventions.** See [docs/visual-system.md](docs/visual-system.md) and [docs/css-patterns.md](docs/css-patterns.md).
6. **Bump SAVE_VERSION.** in `src/app/game/save.ts` if saved state structure changes.
7. **Update documentation immediately.** after any change to structure, commands, or workflow. Keep AGENTS.md, README.md, and docs/ current.
8. **Document style decisions.** Add rationale to [docs/coding-style.md](docs/coding-style.md) for new or updated style rules.
9. **Apply style changes everywhere.** When updating guidelines, refactor the whole codebase to match.
10. **Clean up after refactoring.** Delete old files, remove unused code, and ensure no duplicates remain.
11. **Commit after each prompt.** When the prompt has completed, stage and commit relevant changes.  Include execution time in commit messages. Example: `Duration: 2m 15s`.


## Agent Operating Contract

This repository uses a mandatory plan-driven execution loop. All tasks must follow the 5-Step Plan Execution Cycle defined below.

The Plan Panel is the single source of truth for task state. Work is not complete until the Plan Panel accurately reflects reality.

Failure to update the plan is considered an incomplete task.


## 5-Step Plan Execution Cycle (Mandatory)

For every user request, follow this exact loop:

### Step 1 --- Synchronize Plan

-   Read the current Plan Panel state.
-   If no plan exists, create one.
-   Break work into small, atomic TODO items.
-   Ensure exactly one item is marked as `active`.

Do not begin implementation without an active plan item.

### Step 2 --- Execute Exactly One Active Item

-   Perform work only for the currently active TODO.
-   Do not work on multiple items simultaneously.
-   Do not preemptively complete future steps.

### Step 3 --- Reconcile and Update Plan

Immediately after execution:

-   Mark the completed TODO as `done`, OR
-   Update its description if partial, OR
-   Split it into smaller items if needed.

Then:

-   Select the next TODO and mark it `active`.

Plan updates are required after every code change.

### Step 4 --- Validate Against Plan

Before producing a final response:

-   Check whether any TODO items remain `open` or `active`.
-   If any remain, continue the loop at Step 2.
-   Do not conclude the task while incomplete items exist.

### Step 5 --- Completion Gate

The task is only complete when:

-   All TODO items are marked `done`, OR
-   Remaining items are explicitly deferred with justification.

Only after the plan reflects the true state may you provide a final summary.


## Plan Construction Rules

When creating or modifying plans:

-   Use granular steps (5--20 minutes of work each).
-   Avoid vague items such as "Implement feature".
-   Prefer explicit items like:
    -   "Define interface for AuthService"
    -   "Implement JWT validation middleware"
    -   "Add unit tests for token expiration"

If a task grows during implementation: - Decompose it. - Update the plan before continuing.


## Behavioral Constraints

-   The Plan Panel is authoritative over memory.
-   Never skip plan reconciliation.
-   Never silently complete work without updating the plan.
-   Never provide a final answer if the plan is stale.
-   If unsure about state, resynchronize the plan first.


## Anti-Drift Rule

If implementation and plan state diverge:

1.  Stop.
2.  Repair the plan to reflect actual code state.
3.  Resume the loop.

Accuracy of the plan is more important than speed of output.  No plan update means the task is not finished.


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

```
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
```

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


## Documentation Requirements

**Update documentation immediately for any change to structure, commands, or workflow.**

**Gameplay features:** 
- Document in [docs/game-design.md](docs/game-design.md)
- Focus on high level conceptual logic.

**Update AGENTS.md when:**
- Adding/removing directories, npm scripts, config locations, conventions, build/test setup, or dependencies

**Update README.md when:**
- Changing getting started, commands, or build/run steps