# Suggested Commands for CatBreeder Development

## Development

- `npm start` - Build, start dev server (http://localhost:3000), and open browser with auto-reload
- `npm run dev` - Start dev server with hot reload (no browser open)
- `npm run dev:restart` - Kill and restart dev server (useful if port 3000 is stuck)

## Building

- `npm run build` - Production build to `dist/` directory
- `npm run preview` - Serve production build locally for testing

## Testing & Quality

- `npm test` - Run full test suite with coverage (once, exit mode)
- `npm run test:watch` - Run tests in watch mode for development
- `npm run lint` - Check TypeScript/React files for linting errors
- `npm run lint:fix` - Auto-fix linting errors
- `npm run typecheck` - Run TypeScript type checking without compilation

## Git/System

- `git add` / `git commit` - Version control
- `husky` installed - Pre-commit and pre-push hooks are configured
  - Pre-commit: lint check
  - Pre-push: build + test verification
