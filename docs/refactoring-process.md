# Refactoring Protocol (Mandatory for Structural Changes)

Refactoring is the process of improving internal structure without changing observable behavior.

Behavior must remain identical before and after refactoring unless explicitly part of a planned feature change.

Refactoring is not feature work.

## Preconditions for Refactoring

Before beginning any refactor:
- All tests must pass.
- The codebase must be in a committed state.
- The Plan Panel must contain explicit refactor TODO items.
- No failing tests may be ignored.

If tests are insufficient to guarantee behavior safety:
- First add characterization tests.
- Confirm they pass.
- Then begin refactoring.

No refactoring without safety nets.

## Characterization Test Rule

If working in legacy or poorly tested code:
1. Write tests that capture current behavior, even if the behavior appears incorrect.
1. Confirm those tests pass.
1. Only then modify structure.

Do not “fix” behavior during structural refactors unless:
- A bug fix is explicitly planned.
- It is represented as a separate TODO.
- It results in a separate commit.

## Refactoring Execution Loop

Each refactor must follow this loop:
1. Select one small structural improvement.
1. Make a minimal change.
1. Run the full test suite.
1. Confirm all tests pass.
1. Commit if stable.
1. Repeat.

Never batch large structural rewrites into a single change.

Refactoring must proceed in small, verifiable increments.

## Acceptable Refactoring Types

Examples include:
- Extract method or function
- Rename for clarity
- Remove duplication
- Simplify conditionals
- Isolate side effects
- Improve module boundaries
- Reduce coupling
- Increase cohesion
- Improve type safety
- Replace magic values with constants

Examples that are NOT refactors:
- Adding new features
- Changing user-facing behavior
- Modifying APIs
- Altering business rules

Those require feature or fix plan items.

## Plan Integration

Each refactor must be decomposed into atomic TODOs such as:
- Add characterization tests for module X
- Extract parsing logic into helper
- Rename ambiguous variables in service Y
- Remove duplicate validation logic

Each TODO must:
- Be independently safe
- Pass tests before being marked done
- Result in a commit

Never group unrelated refactors in one TODO.

## Refactor Safety Gate

Before marking a refactor item done:
- Full test suite passes.
- No coverage has unintentionally decreased.
- No public interfaces changed unintentionally.
- No new warnings introduced.

If any failure occurs:
- Stop immediately.
- Update the Plan Panel.
- Repair before continuing.

## Commit Rules for Refactors

Refactor commits must:
- Contain only structural changes.
- Not mix feature or bug fix logic.
- Have type refactor.
- Describe the refactoring concisely.
- Include the time that the refactoring task took to complete.

## Large Refactor Strategy

For multi-file or architectural refactors:
- Create a high-level refactor plan.
- Break into independent vertical slices.
- Stabilize each slice with passing tests.
- Commit per slice.
- Avoid long-running uncommitted branches.
- Never attempt full rewrites in one step.

Incremental evolution is mandatory.

## Anti-Risk Rule

Never:
- Combine refactor + feature in one commit.
- Perform speculative large rewrites.
- Modify behavior “while we’re here.”
- Refactor without tests.
- Leave the repository in a partially refactored state.

## Definition of Successful Refactor

A refactor is complete when:
- Tests pass.
- Code clarity is measurably improved.
- Complexity is reduced or structure improved.
- No behavior changed.
- All changes are committed.

If behavior changes, it was not a refactor. It was a feature or fix.