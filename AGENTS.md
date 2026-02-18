# Agent Instructions

This document provides guidelines for AI agents and automated tools working with this repository.

## Project Overview

CatBreeder is a React web application built with TypeScript and ESBuild. The project follows modern web development practices with a focus on type safety, testing, and fast builds.

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
│   │   ├── index.tsx    # App component
│   │   └── index.test.tsx
│   ├── test/            # Test setup and utilities
│   ├── utils/           # Shared utility functions
│   ├── index.tsx        # Bootstrap/entry point
│   └── index.css        # Global styles
├── dist/                # Build output (gitignored)
├── kotlin/              # ARCHIVED - do not modify
└── [root config files]  # package.json, tsconfig.json, etc.
```

## Important Directories

| Directory | Purpose |
|-----------|---------|
| `src/` | All application source code |
| `src/app/` | React components and application logic |
| `src/test/` | Test setup, mocks, and utilities |
| `src/utils/` | Shared helper functions |
| `config/` | Build and test configuration files |
| `public/` | Static files copied to dist |
| `kotlin/` | **ARCHIVED** - Legacy code, do not touch |

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
- React components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities/helpers: `camelCase.ts` (e.g., `helpers.ts`)
- Tests: `[filename].test.ts` or `[filename].test.tsx`
- Styles: `camelCase.css` or `kebab-case.css`

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

## Git Hooks

The project uses Husky to enforce quality checks:

- **pre-commit**: Runs `npm run lint` - commits blocked if lint fails
- **pre-push**: Runs `npm run build && npm run test:run` - pushes blocked if either fails

To bypass hooks in emergencies: `git commit --no-verify` or `git push --no-verify`

## Common Tasks

### Create a New Component
1. Create `src/app/components/MyComponent.tsx` (or appropriate subdirectory)
2. Create `src/app/components/MyComponent.test.tsx`
3. Import and use in parent component

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

1. **Never modify files in `kotlin/`** - This is archived legacy code
2. **Always run tests after changes** - Use `npm run test:run`
3. **Prefer TypeScript** - Don't create `.js` files in `src/`
4. **Keep dependencies minimal** - Only add what's necessary
5. **Write tests for new code** - Maintain test coverage
6. **Use existing patterns** - Follow conventions in existing files
7. **Update documentation** - Keep AGENTS.md and README.md current (see below)

## Documentation Requirements

**All changes that affect project structure, commands, or workflows MUST include documentation updates.**

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
