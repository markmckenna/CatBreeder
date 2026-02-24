# Agent Operating Contract

This repository uses a mandatory plan-driven execution loop. All tasks must follow the 5-Step Plan Execution Cycle defined below.

The Plan Panel is the single source of truth for task state. Work is not complete until the Plan Panel accurately reflects reality.

Failure to update the plan is considered an incomplete task.


## 5-Step Plan Execution Cycle (Mandatory)

For every user request, follow this exact loop:

### Step 1 --- Synchronize Plan

-   Read the current Plan Panel state.
-   If no plan exists, create one.
-   Break work into small, atomic TODO items.
-   Ensure exactly one item is marked as `active`.

Do not begin implementation without an active plan item.

### Step 2 --- Execute Exactly One Active Item

-   Perform work only for the currently active TODO.
-   Do not work on multiple items simultaneously.
-   Do not preemptively complete future steps.

### Step 3 --- Reconcile and Update Plan

Immediately after execution:

-   Mark the completed TODO as `done`, OR
-   Update its description if partial, OR
-   Split it into smaller items if needed.

Then:

-   Select the next TODO and mark it `active`.

Plan updates are required after every code change.

### Step 4 --- Validate Against Plan

Before producing a final response:

-   Check whether any TODO items remain `open` or `active`.
-   If any remain, continue the loop at Step 2.
-   Do not conclude the task while incomplete items exist.

### Step 5 --- Completion Gate

The task is only complete when:
-   All TODO items are marked `done`, OR
-   Remaining items are explicitly deferred with justification.

Only after the plan reflects the true state may you provide a final summary.


## Plan Construction Rules

When creating or modifying plans:
-   Use granular steps (5-20 minutes of work each).
-   Avoid vague items such as "Implement feature".
-   Prefer explicit items like:
    -   "Define interface for AuthService"
    -   "Implement JWT validation middleware"
    -   "Add unit tests for token expiration"

If a task grows during implementation: 
- Decompose it. 
- Update the plan before continuing.


## Behavioral Constraints

-   The Plan Panel is authoritative over memory.
-   Never skip plan reconciliation.
-   Never silently complete work without updating the plan.
-   Never provide a final answer if the plan is stale.
-   If unsure about state, resynchronize the plan first.


## Anti-Drift Rule

If implementation and plan state diverge:

1.  Stop.
2.  Repair the plan to reflect actual code state.
3.  Resume the loop.

Accuracy of the plan is more important than speed of output.  No plan update means the task is not finished.