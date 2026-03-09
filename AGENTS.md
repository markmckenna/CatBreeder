## 🔥 Critical Rules

- **At the start of every session**: Check `/memories/` for relevant insights and past learnings before beginning work.
- **At the start of every plan/cycle**: provide a summary of the planned work using the [Operating Contract](docs/operating-contract.md).
- **At the start of every plan/cycle that requires code changes**: provide a summary of the planned work using the [Development Process](docs/development-process.md).
- **At the start of every plan/cycle that requires refactoring:** summarize the [Refactoring Process](docs/refactoring-process.md).
- **At the start of every plan/cycle that requires archictural changes**: summarize the [Architecture](docs/architecture.md).
- Never ask for permission for CLI/tool actions. Move forward unless clarification is needed.
- If a patch is not applied correctly, attempt to reapply it.
- Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.
- **For code analysis**: Prefer Serena symbol tools (reference memory findings about 77% token reduction)


## Memory Management Rules

### Canonical vs Distilled (Required)
- **Canonical source of truth**: Keep stable rules, architecture, workflow policy, and long-form rationale in `docs/*.md` and `AGENTS.md`.
- **Distilled working memory**: Keep Serena memory and `/memories/*` focused on concise, high-value operational notes.
- **No verbatim duplication**: Do not copy full doc sections into memory. Memory should summarize and point back to canonical docs when needed.

### Proactive Reading
- **At session start**: Check `/memories/` and relevant Serena memories for prior learnings.
- **Before major decisions**: Read the canonical docs first, then consult memory for practical history.
- **When debugging**: Check memory for known failure patterns and edge-case workarounds.

### Proactive Writing (Update Both, Split Correctly)
- **When a stable workflow/policy changes**: Update canonical docs (`docs/*.md` and/or `AGENTS.md`) first.
- **After doc updates**: Update Serena memory and `/memories/*` with short distilled bullets (what changed, why it matters, where canonical details live).
- **After non-trivial implementation learnings**: Save tactical lessons to memory even if docs do not need changes.
- **At task completion**: Reconcile docs vs memory and remove misplaced or duplicated content.

### Placement Rules
- **Put in docs/AGENTS**: Normative instructions, standards, architecture, process checklists, durable conventions.
- **Put in memory**: Lessons learned, tool efficiency findings, recurring pitfalls, user preferences, quick decision heuristics.
- **If memory entry becomes policy**: Promote it to docs, then trim memory to a short pointer.
- **If docs contain tactical noise**: Move the tactical details to memory and keep docs concise.

### Memory Hygiene
- **Keep entries concise**: Bullets over prose.
- **Update, don't duplicate**: Prefer refining existing notes.
- **Delete wrong info**: Remove stale/incorrect notes quickly.
- **Organize by topic**: Group by purpose (patterns, debugging, preferences, repo conventions).
- **Session scope discipline**: Only view/update existing session files unless a new one is clearly needed.


## 📚 Other Documentation

- [Coding Style](docs/coding-style.md): Rules describing the code style.
- [Visual System](docs/visual-system.md): Rules describing the visual design system.
- [CSS Patterns](docs/css-patterns.md): How to organize and use styles in this project.
- [Game Design](docs/game-design.md): How the game is supposed to work.
- [Memory Strategy](docs/memory-strategy.md): Canonical rules for docs-vs-memory placement and deduplication.

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