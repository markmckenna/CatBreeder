# Architecture and Code Structure

## MVVM Pattern

CatBreeder uses strict Model-View-ViewModel (MVVM) separation:

- **Logic (`src/app/logic/`)**: Pure game logic, state, rules. NO React imports. Fully testable.
- **Renderer (`src/app/renderer/`)**: React components that render logic models.
- **UI (`src/app/ui/`)**: UI utilities (formatting, selection helpers).
- **Core (`src/core/`)**: Generic platform utilities (seeded RNG, etc.).

## Key Rules

- Renderer imports logic, never the reverse
- Logic must be UI-agnostic and testable
- UI is a pure function of logic state
- Never import React in logic modules

## Feature-Based Organization

Organize `src/app/` by **feature/domain**, not by type:

```
✅ DO:
src/app/
├── logic/
│   ├── cats/        # All cat-related logic + tests
│   ├── economy/     # All economy logic + tests
│   └── environment/ # All environment logic + tests
└── renderer/
    ├── CatView.tsx
    └── MarketPanel/

❌ DON'T:
src/app/
├── components/      # Don't group by type
│   ├── CatCard.tsx
├── logic/           # Don't separate logic from UI
│   └── genetics.ts
└── tests/           # Don't centralize tests
```

## File Location Policy

- Keep tests in the **same folder** as source code
- Position helpers near their main consumers
- Only generic utilities go in `src/core/`
- UI formatting helpers in `src/app/ui/`

## Dependency Direction

- UI (React) can depend on non-UI
- Non-UI must never depend on UI
- Game logic is truly portable and testable
