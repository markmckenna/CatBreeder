
# Architecture for CatBreeder

CatBreeder uses the Model-View-ViewModel (MVVM) architectural pattern to enforce a clean separation between game logic and UI rendering.

## Structure

- **Logic Module (`src/app/logic/`)**
  - Contains all game logic, rules, and state management.
  - Logic is organized by domain: `cats`, `economy`, `environment`, `game`.
  - Each domain directly exports its types and logic (no extra wrapper files).
  - **No references to React or UI code** - logic is UI-agnostic and independently testable.
  - Can be ported to different languages or run in backend services.

- **UI Module (`src/app/ui/`)**
  - Contains all React components, visualization, and user interaction.
  - Imports types and logic from the logic module.
  - Responsible for all display logic, layout, styling, and user interaction.
  - **Never referenced by the logic module** - maintains one-way dependency (ui → logic).
  - Organized by feature: game orchestration, panels, sprites, utilities.

## State Management

- **Zustand Store** (`src/app/ui/game/store.ts`)
  - Central state management using Zustand for better DevTools and performance.
  - Wraps pure game logic from `logic/game/state.ts` and `logic/game/save.ts`.
  - Handles auto-save to localStorage and seeded random generation.
  
- **React Context Wrapper** (`src/app/ui/game/GameContext.tsx`)
  - Provides backward-compatible API for existing components.
  - Components can use `useGame()` (context) or `useGameStore()` (Zustand) hooks.

## Reference Direction

- **UI imports from logic** - allowed and expected.
- **Logic NEVER imports from UI** - strictly enforced.
- Game logic is testable and reusable, independent of UI.
- UI is a pure visualization layer over the logic model.

## Example

- `Cat` type in `logic/cats/Cat.ts` exposes properties like genetics, phenotype, market value.
- `CatSprite` component in `ui/CatSprite/` receives a `Cat` model as a prop and renders it.
- Game state lives in Zustand store (`ui/game/store.ts`), wrapping pure logic (`logic/game/state.ts`).

## Directory Structure

```
src/app/
├── logic/              # Pure game logic (no React, no ui/ imports)
│   ├── cats/           # Cat breeding, genetics, collection
│   ├── economy/        # Market, trading, valuation
│   ├── environment/    # Furniture, room layout, positions
│   ├── game/           # Game state, actions, save/load
│   └── test/           # Test helpers
└── ui/                 # All visualization (can import from logic/)
    ├── game/           # Game state management (Zustand + Context)
    ├── Room/           # Room visualization component
    ├── CatSprite/      # Cat rendering
    ├── GameUI/         # Main game orchestrator
    ├── MarketPanel/    # Market UI
    ├── ShopPanel/      # Shop UI
    ├── CatListPanel/   # Cat list UI
    ├── TraitCollection/# Trait collection UI
    └── [utilities]     # format.ts, selection.ts, etc.
```

## Benefits

- **Clear separation of concerns** - logic vs. presentation
- **Easier testing** - logic can be tested without React/DOM
- **Maintainability** - changes to UI don't affect game rules
- **Flexibility** - UI can be reimplemented; logic can run elsewhere (backend, mobile, CLI)
- **Better DevTools** - Zustand integration for state inspection

---

See [docs/coding-style.md](coding-style.md) for further conventions.
