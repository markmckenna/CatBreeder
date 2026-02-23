## Critical Rules

Follow the rules defined in [AGENTS.md](../AGENTS.md) at all times, including any rules defined in relevant sub-documents linked from there.

You must operate as a stateful agent. To prevent stalls and memory loss during long-running tasks, follow this synchronization logic:
  1. Initialization
      - Before writing any code, you must generate a step-by-step plan.
      - **UI Sync:** Use the `set_task_state` (or equivalent Plan Panel tool) to populate the IDE Task List. 
      - **File Sync:** Immediately create or update the file `.github/agent-memory.md`. Mirror the UI task list exactly into this file using GFM task list syntax (- [ ]).
  2. Execution (The Lock-Step)
      - **Status Updates:** Before starting a sub-task, mark it as `in-progress` in the UI and change the `.github/agent-memory.md` icon to `(⌛)`.
      - **Completion:** You are NOT permitted to move to a new task until:
          1. The current task's code is written.
          2. A verification step (test or lint) has passed.
          3. You have checked off the item in the IDE Plan Panel.
          4. You have marked the item as `- [x]` in `.github/agent-memory.md` and saved the file.
  3. Crash/Stall Recovery
      - If the session restarts or you "wake up" from a stall, your first action must be: `cat .github/agent-memory.md`.
      - Compare the `.github/agent-memory.md` state against the IDE Plan Panel. 
      - If the UI is blank but `.github/agent-memory.md` has progress, re-populate the UI Plan Panel based on the file and resume from the first unchecked item.
      - Explicitly state: "Resuming from [Task Name] based on .github/agent-memory.md state."
  4. Finalization
      - Once the entire list is complete, run a final global check: `npm run lint && npm test`.
      - Only after all tests pass, delete the `.github/agent-memory.md` (or rename it to `DONE.md`) and report task completion.