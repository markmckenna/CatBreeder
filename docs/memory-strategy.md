# Memory Strategy

This project uses a two-layer knowledge model:

1. Canonical documentation (`docs/*.md`, `AGENTS.md`)
2. Distilled memory (Serena memory and `/memories/*`)

## Purpose of Each Layer

### Canonical Docs (Source of Truth)
Use canonical docs for:
- Stable rules and policies
- Architecture and system design decisions
- Team conventions that should be reviewed in pull requests
- Process definitions (operating, development, testing, refactoring)

Characteristics:
- Full context and rationale
- Durable and reviewable in git history
- Shared with humans and tools

### Distilled Memory (Operational Cache)
Use memory for:
- Practical lessons learned from implementation/debugging
- Reusable troubleshooting patterns
- Tool efficiency notes and workflow shortcuts
- User preferences and recurring decision heuristics

Characteristics:
- Brief bullets only
- Fast retrieval during active work
- May include pointers back to canonical docs

## Required Workflow

When behavior, policy, or conventions change:
1. Update canonical docs first.
2. Update memory with concise bullets that summarize the change.
3. Add a pointer to canonical docs instead of duplicating full text.

When tactical learnings emerge without policy changes:
1. Update memory only.
2. Promote to canonical docs later if the learning becomes durable policy.

## Deduplication Rules

- Do not copy doc sections verbatim into memory.
- If memory entry grows long or normative, move it into docs and keep memory as a short pointer.
- If docs contain tactical one-off troubleshooting details, move those details to memory.
- Remove stale or contradictory memory entries immediately.

## Quick Placement Checklist

Put it in canonical docs if the statement is:
- Normative (must/should rules)
- Architectural
- Process-critical
- Long-lived

Put it in memory if the statement is:
- Tactical (what worked/failed)
- Time-saving during execution
- Preference-based
- Potentially temporary
