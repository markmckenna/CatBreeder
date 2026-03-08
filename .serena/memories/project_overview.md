# CatBreeder Project Overview

## Purpose

CatBreeder is an idle/incremental breeding game about building a cat breeding empire. Players breed cats with inherited traits, discover color/pattern variations, manage an economy with market fluctuations, and create cozy environments.

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.x
- **UI Framework**: React 18
- **Build Tool**: ESBuild
- **Testing**: Vitest + React Testing Library + jsdom
- **Linting**: ESLint (TypeScript + React plugins)
- **Formatting**: ESLint auto-fix
- **Type Checking**: TypeScript compiler
- **Git Hooks**: Husky (pre-commit lint, pre-push build+test)

## Project Language

TypeScript (all source in `src/` directory)

## Codebase Structure

```
src/
  app/
    index.tsx              # React root component
    logic/                 # Pure game logic (no React)
      cats/                # Cat breeding domain
      economy/             # Market simulation domain
      environment/         # Room/furniture domain
      game/                # Game state/save system
    renderer/              # React components for rendering
    ui/                    # UI utilities (format, selection)
  core/                    # Platform utilities (random, etc.)
  css-modules.d.ts         # CSS module type definitions
  index.css                # Global styles
  index.tsx                # App entry point
  test.ts                  # Test setup

config/
  esbuild.config.js        # Build configuration
  vitest.config.ts         # Test configuration

docs/
  architecture.md          # MVVM architecture details
  coding-style.md          # Code style conventions
  css-patterns.md          # CSS and styling patterns
  development-process.md   # TDD workflow (MANDATORY)
  game-design.md           # Detailed game mechanics
  operating-contract.md    # Operating guidelines
  refactoring-process.md   # Refactoring workflow
  testing.md               # Testing guidelines
  visual-system.md         # Design system

.github/
  copilot-instructions.md  # Agent-specific instructions
  
AGENTS.md                  # Critical rules and project info
```
