
# Architecture for CatBreeder

CatBreeder uses the Model-View-ViewModel (MVVM) architectural pattern to enforce a clean separation between game logic and UI rendering.

## Structure

- **Logic Module (`src/app/logic/`)**
  - Contains all game logic, rules, and state management.
  - Logic is organized by domain: `cats`, `economy`, `environment`, `game`.
  - Each domain directly exports its types and logic (no extra wrapper files).
  - No references to React or UI code.

- **Renderer Module (`src/app/renderer/`)**
  - Contains all React components and UI logic.
  - Imports types from the logic module and maps game models to rendering components.
  - Responsible for all display logic, layout, and user interaction.
  - Never referenced by the logic module.

## Reference Direction

- Renderer imports logic types, never the reverse.
- Game logic is testable and reusable, independent of UI.
- UI is a pure function of the logic model state.

## Example

- `Cat` type in logic exposes properties like colour, genetics, market value, etc.
- `Cat` renderer component receives a `Cat` model as a prop and renders it accordingly.

## Benefits

- Clear separation of concerns
- Easier testing and maintenance
- Flexible UI changes without affecting game logic

---

See [docs/coding-style.md](coding-style.md) for further conventions.
