## 🔥 Critical Rules

- **At the start of every session**: Check `/memories/` for relevant insights and past learnings before beginning work.
- At the start of every plan/cycle, provide a summary of the planned work using the [Operating Contract](docs/operating-contract.md).
- At the start of every plan/cycle that requires code changes, provide a summary of the planned work using the [Development Process](docs/development-process.md).
- At the start of every plan/cycle that requires refactoring, summarize the [Refactoring Process](docs/refactoring-process.md).
- At the start of every plan/cycle that requires archictural changes, summarize the [Architecture](docs/architecture.md).
- Never ask for permission for CLI/tool actions. Move forward unless clarification is needed.
- If a patch is not applied correctly, attempt to reapply it.
- Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.


## � Memory Management Rules

### Proactive Memory Reading
- **At session start**: Check `/memories/` for relevant project insights before beginning work
- **Before major decisions**: Consult memory for past learnings about similar problems
- **When debugging**: Check for documented patterns of common issues and solutions
- **For code analysis**: Prefer Serena symbol tools (reference memory findings about 77% token reduction)

### Proactive Memory Writing
- **After solving non-trivial problems**: Document what worked and what didn't
- **When discovering patterns**: Save reusable insights (coding patterns, common pitfalls, user preferences)
- **After performance comparisons**: Record tool efficiency findings
- **When encountering project-specific quirks**: Document edge cases and workarounds
- **At task completion**: If work revealed new conventions or best practices, save them

### Memory Best Practices
- **Keep entries concise**: Use bullets, not prose (memory is auto-loaded, brevity matters)
- **Update, don't duplicate**: Refine existing memories rather than creating new ones
- **Delete wrong info**: Remove outdated or incorrect memories immediately
- **Organize by topic**: Use separate files (debugging.md, patterns.md, preferences.md)
- **Session memory**: Only view/update existing session files; don't create unnecessary ones

### What to Remember
- ✅ Lessons learned (problem → solution patterns)
- ✅ User workflow preferences
- ✅ Tool efficiency findings (e.g., "Serena vs read_file: 77% token reduction")
- ✅ Project-specific conventions not in docs
- ✅ Common mistakes and how to avoid them
- ❌ Don't save: temporary task details, one-off debugging steps, obvious information


## 📚 Other Documentation

- [Coding Style](docs/coding-style.md): Rules describing the code style.
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