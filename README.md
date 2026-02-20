# CatBreeder

An idle/incremental game about breeding cats, built with React and TypeScript.

## Game Concept

**CatBreeder** is a turn-based idle game where players build and manage a cat breeding empire. Each day (turn), players make decisions about their cats, then advance time to see results.

### Core Gameplay

- **Breeding** - Pair cats to produce offspring with inherited traits. Discover all possible coat colors, patterns, eye colors, and other variations.
- **Collecting** - Build a catalog of every cat variation. Track your discoveries and aim for completion.
- **Economy** - Sell cats to fund your empire. Prices fluctuate based on a simulated market with shifting trends in what's desirable.
- **Environment** - Create cozy spaces for your cats with rooms, furniture, toys, and decorations. Happy cats = better breeding.

### Turn Structure

1. **Planning Phase** - Assign breeding pairs, list cats for sale, arrange rooms
2. **End Turn** - Advance to next day
3. **Results** - See births, sales, market changes, and events

## Quick Start

```bash
npm install
npm start
```

Opens http://localhost:3000

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Dev server + open browser |
| `npm run build` | Production build |
| `npm test` | Run tests (watch mode) |
| `npm run lint` | Check linting |
| `npm run typecheck` | Check types |

## For AI Agents

See [AGENTS.md](AGENTS.md) for detailed development guidelines.

## Game Design

See [docs/game-design.md](docs/game-design.md) for detailed gameplay mechanics and system documentation.
