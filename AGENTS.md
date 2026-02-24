# Agent Instructions


## 🔥 Critical Rules

1. Never ask for permission for CLI/tool actions. Move forward unless clarification is needed.
2. Apply visual and CSS conventions. See [docs/visual-system.md](docs/visual-system.md) and [docs/css-patterns.md](docs/css-patterns.md).
3. All code creation activities must follow [Development Process](docs/development-process.md).
4. All refactoring actions must follow [Refactoring Process](docs/refactoring-process.md).
5. All structural or architectural changes must follow [Architecture](docs/architecture.md).
6. All code must follow [Coding Style](docs/coding-style.md).


## 📚 Documentation

- [Operating Contract](docs/operating-contract.md): Mandatory process to use for all agent operations.
- [Development Process](docs/development-process.md): Mandatory process to use when authoring code.
- [Refactoring Process](docs/refactoring-process.md): Mandatory process to use when refactoring code.
- [Coding Style](docs/coding-style.md): Mandatory styles and conventions to use when authoring or refactoring code.
- [Architecture](docs/architecture.md): Mandatory architectural rules to obey when organizing code.
- [Visual System](docs/visual-system.md): Rules describing the visual design system.
- [CSS Patterns](docs/css-patterns.md): How to organize and use styles in this project.
- [Game Design](docs/game-design.md): How the game is supposed to work.

**Read these when working on related areas: they prevent common mistakes.**


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
npm test     		 # Run tests
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting errors
npm run typecheck    # Run TypeScript type checking
```


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


## Troubleshooting

**TypeScript errors:**
- Run `npm run typecheck`
- Check `tsconfig.json`
- Install missing `@types/*`

**Test failures:**
- Run `npm test`
- Check `src/test.ts`
- Verify mocks

**Build failures:**
- Check `npm run build` output
- Verify imports
- Check for circular deps