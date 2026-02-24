This repository uses a strict test-driven development workflow.

## Test-Driven Development (TDD) Workflow (Mandatory When Writing Code)

All feature work and bug fixes must follow a strict test -> implement -> verify loop.

No code may be committed without a sufficient number of automated unit tests verifying that the code works as written.


### Execution Cycle

When implementing or modifying behavior:

1.  Create or update a test that defines the desired behavior.
2.  Run tests.
3.  Confirm the new test fails for the expected reason.
4.  Implement the minimal code necessary to make the test pass.
5.  Run the full test suite.
6.  Confirm all tests pass before proceeding.
7.  Refactor only if tests remain green.

If tests do not fail when expected: 
- Stop. 
- Fix the test. 
- Re-run before implementing.

If tests fail unexpectedly: 
- Update the Plan Panel. 
- Add a debugging TODO. 
- Resolve before continuing feature work.


### Integration with 5-Step Plan Loop

When TDD mode is active, each plan item involving code must be decomposed into:
-   Write failing test
-   Implement minimal fix
-   Run full suite
-   Refactor (optional)

Each of these must be separate TODO items.

Never combine them into one large task.


## Test Validation Gate

Before marking any plan item `done` that affects code:
-   The relevant tests must exist.
-   The new or updated tests must pass.
-   The entire test suite must pass.

If any test fails: 
- The plan must reflect the failure state. 
- The task cannot be marked complete.


## Mandatory Commit Rule

At the end of a successful execution cycle:

1.  Verify:
    -   All plan items are `done` or explicitly deferred.
    -   All tests pass.
2.  Create a commit.

Each run must end with a commit unless:
- The run was exploratory only, OR 
- The user explicitly forbids committing.


## Commit Requirements

Every commit must:
-   Include only changes related to completed plan items.
-   Have a clear, structured message.
-	Include the time taken to complete the full execution cycle.


## Anti-Shortcut Rule

Never: 
- Skip writing tests for behavioral changes. 
- Mark tasks complete before tests pass. 
- Produce a final answer without committing. 
- Bundle unrelated changes into one commit.


## Completion Definition

A task is only complete when:
-   Plan Panel is accurate.
-   All tests pass.
-   Changes are committed.
-   Commit message meets the required format.

If any condition fails, the task is incomplete.