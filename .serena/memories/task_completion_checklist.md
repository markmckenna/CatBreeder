# Task Completion Checklist

When a task is complete, verify ALL of the following:

## Code Quality

- [ ] All changes follow [Coding Style](coding_conventions.md)
- [ ] No unused variables, imports, or dead code
- [ ] No commented-out code (delete it)
- [ ] Export only necessary items via `index.ts`
- [ ] No console.log or debug code left in

## Architecture Compliance

- [ ] Logic doesn't import React
- [ ] Renderer only imports logic, not reverse
- [ ] Feature-based folder structure maintained
- [ ] Tests colocated with source files (same folder)

## Testing (MANDATORY - TDD Required)

- [ ] New/modified tests exist for all code changes
- [ ] All new tests pass
- [ ] Full test suite passes: `npm test`
- [ ] No test failures or warnings

## Type Safety

- [ ] No TypeScript errors: `npm run typecheck`
- [ ] No type `any` unless explicitly justified

## Linting & Formatting

- [ ] No lint errors: `npm run lint`
- [ ] Run `npm run lint:fix` if needed
- [ ] Code is properly formatted

## Git & Commit

- [ ] Ready to commit at task completion
- [ ] Commit message is clear and structured
- [ ] Only task-related changes in commit
- [ ] Include time taken in commit message

## Before Marking Done

1. Run full test suite: `npm test`
2. Run type check: `npm run typecheck`
3. Run linter: `npm run lint`
4. Verify all three pass
5. Only then mark task complete

## Anti-Shortcut Rule

Never skip testing, linting, or type checking to "save time". These checks are part of task definition, not optional polish.
