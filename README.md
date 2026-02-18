# CatBreeder

A modern React web application built with TypeScript and ESBuild.

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: use the latest LTS version)
- npm, yarn, or pnpm

### Installation

```bash
npm install
```

### Development

Start the development server and open browser:

```bash
npm start
```

Or start dev server without opening browser:

```bash
npm run dev
```

The app will be available at http://localhost:3000

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run tests in watch mode:

```bash
npm test
```

Run tests once:

```bash
npm run test:run
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Linting

Check for linting errors:

```bash
npm run lint
```

Auto-fix linting errors:

```bash
npm run lint:fix
```

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

## Project Structure

```
├── config/              # Build and test configuration
│   ├── esbuild.config.js
│   └── vitest.config.ts
├── public/              # Static assets
│   └── index.html       # HTML entry point
├── src/
│   ├── app/             # React application
│   │   ├── index.tsx    # App component
│   │   └── index.test.tsx
│   ├── test/            # Test setup and utilities
│   ├── utils/           # Utility functions
│   ├── index.tsx        # Application entry point
│   └── index.css        # Global styles
├── .eslintrc.cjs        # ESLint configuration
├── .gitignore           # Git ignore patterns
├── package.json         # Project dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **ESBuild** - Fast bundler
- **Vitest** - Unit testing framework
- **Testing Library** - React testing utilities
- **ESLint** - Code linting
