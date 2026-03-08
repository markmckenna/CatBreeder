# Development Workflow: TDD (MANDATORY)

## Test-Driven Development (TDD) Loop

**TDD is mandatory for ALL feature work and bug fixes.**

### The Execution Cycle

1. **Write Failing Test**
   - Create/update a test that defines desired behavior
   - Test should fail with expected reason

2. **Run Tests**
   - Execute: `npm test`
   - Confirm new test fails as expected

3. **Implement Minimal Code**
   - Implement only minimum code to pass the test
   - Don't over-engineer

4. **Run Full Suite**
   - Execute: `npm test`
   - All tests must pass

5. **Refactor (Optional)**
   - Only refactor with tests green
   - Follow [Refactoring Process](../docs/refactoring-process.md)

6. **Repeat**
   - For next test/feature, repeat the cycle

## Critical Rules

### If Test Doesn't Fail as Expected
- Stop work
- Fix the test definition
- Re-run before implementing

### If Tests Fail Unexpectedly
- Update the plan with failure details
- Add debugging TODO
- Resolve ALL test failures before continuing

### Commit Only After Success
- All plan items complete
- All tests passing
- Full suite clean
- Create commit with clear message

## Plan Decomposition

When planning code work, break each task into:
1. Write failing test
2. Implement minimal fix
3. Run full suite
4. Refactor (if needed)

**Each is a separate TODO item.** Never combine into one task.

## Watch Mode for Development

```bash
npm run test:watch    # Run tests in watch mode while developing
npm run dev          # Dev server with hot reload in another terminal
```

## No Shortcuts

You must:
- Write tests for all new code
- Run full suite before marking complete
- Never skip testing to save time
- Never commit untested code
