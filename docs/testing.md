
# Unit Testing Guidelines


## Principles for High-Quality Unit Tests

- **Isolate units:** Test one function, method, or class at a time. Mock dependencies and avoid integration logic in unit tests.
- **Arrange-Act-Assert:** Structure tests with clear setup, execution, and verification steps. Use comments for these sections if it improves clarity, but this is not required for every test.
- **Descriptive names:** Use test names that clearly state the behavior being tested and the expected outcome.
- **Test edge cases:** Cover typical, boundary, and error conditions. Think about null/undefined, empty arrays, and invalid inputs.
- **Keep tests deterministic:** Tests must always pass or fail for the same code. Avoid randomness, time dependencies, or external state.
- **Minimal setup:** Only set up what is necessary for the test. Avoid unnecessary complexity or unrelated data.
- **Readable and maintainable:** Prefer clarity over cleverness. Use helper functions for repeated logic, but keep tests easy to follow and consistent with existing patterns.
- **Assertions:** Each test should check a specific behavior. Multiple assertions are fine when they are closely related or improve clarity.
- **Use fixtures and mocks appropriately:** Use test helpers, fixtures, and mocks to isolate units and control test data, but only as needed.
- **Comment intent when helpful:** Use comments to clarify why a test exists, especially for complex or non-obvious logic. Comments are not required for every test.


## Example Structure

```ts
// src/app/logic/cats/Cat.test.ts

describe('Cat', () => {
  it('should create a cat with default traits', () => {
    // Arrange
    // ...setup code...

    // Act
    // ...call code under test...

    // Assert
    // ...expectations...
  });
});
```


## Best Practices

- Place tests next to the code they cover (e.g., `Cat.ts` and `Cat.test.ts`).
- Use [docs/coding-style.md](coding-style.md) for naming, structure, and import conventions.
- Run tests frequently: `npm test`
- Prefer Vitest and React Testing Library for all new tests.
- Add tests for all new code and when fixing bugs.
- Review and refactor tests as code evolves.
- Follow the conventions and style of existing tests in the codebase.


## References
- [Vitest Docs](https://vitest.dev/guide/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Test-Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
