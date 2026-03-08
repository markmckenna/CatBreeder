# Coding Style and Conventions

## General Principles

### Minimal Exports
- Export only what's needed by other modules
- Declare constants/helpers as internal, not exported
- Use `index.ts` to explicitly define public APIs

### Eliminate Unused Code
- Delete unused functions, variables, imports
- Don't comment out code—delete it
- Don't keep utilities "just in case"; recreate if needed

### Minimize Duplication
- Extract shared code
- Reuse test helpers
- Avoid redundant comments

## Naming Conventions

### Fluent Naming (Generators, Transforms)
- Prefer `phenotypeFor(cat)` over `getCatPhenotype(cat)`
- Drop the `get` prefix for transformation functions
- Fluent names read naturally in context

### Parameter Names
- Short names for single-line typed functions: `it`, `x`, `n`
- Descriptive names for multi-statement functions
- Use context to infer meaning

## Syntax Style

### Single-Line Conditions
```ts
// ✅ Minimize nesting
if (condition) return value;
const x = condition ? a : b;

// ❌ Avoid
if (condition) {
  return value;
}
```

### Function Declaration
```ts
// ✅ Arrow for single expression
const transform = (x) => x + 1;

// ✅ Function keyword for multi-statement
function processData(x) {
  const y = compute(x);
  return format(y);
}
```

### Promise Chains vs Async/Await
```ts
// ✅ Use .then()/.catch() when cleaner as single expression
promise.then(it => it.value).catch(e => console.error(e))

// ✅ Use async/await for complex flows
async function fetchAndProcess() {
  const data = await fetch(url);
  return transform(data);
}
```

### Type Annotations
- Let TypeScript infer when obvious
- Be explicit for public APIs
- Explicit when inference is too broad or complex

### Condition Ordering (Performance)
Order if-conditions by runtime cost (cheapest first):
1. Equality checks
2. String methods
3. Regex
4. Function calls

## Comments

### Concise, Sentential
```ts
// ✅ Brief, natural language
// Skip invalid entries and stop at first match
const valid = entries.find(hasValue);

// ❌ Verbose or JSDoc overkill
/**
 * @param entries The array of entries to search
 * @returns The first entry with a value, or undefined
 */
const valid = entries.find(hasValue);
```

## Comments & JSDoc
- Use brief, sentential comments
- Only use `@param`/`@returns` for non-obvious details
- Avoid verbose JSDoc; prefer clear code
