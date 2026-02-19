# CatBreeder Game Design Document

This document describes all gameplay systems and their intended behavior. It serves as the authoritative reference for how game mechanics should work.

## Table of Contents

- [Core Concepts](#core-concepts)
- [Genetics System](#genetics-system)
- [Breeding](#breeding)
- [Trait Collection](#trait-collection)
- [Economy](#economy)
- [Market](#market)
- [Cat Happiness](#cat-happiness)
- [Save System](#save-system)

---

## Core Concepts

CatBreeder is a turn-based idle game where each turn represents one day. Players breed cats, discover trait combinations, and manage an economy of buying and selling cats.

### Turn Flow

1. **Planning Phase**: Player assigns breeding pairs, lists cats for sale, buys items/cats
2. **End Turn**: Advance to next day
3. **Processing**: 
   - Breeding pairs produce offspring
   - Listed cats are sold at current market prices
   - Daily costs are deducted
   - Cat happiness is updated
   - Market prices fluctuate
4. **Results**: Player sees births, sales, expenses, events

---

## Genetics System

Cats have four genetic traits, each following Mendelian inheritance with dominant and recessive alleles.

### Traits

| Trait | Dominant | Recessive | Phenotypes |
|-------|----------|-----------|------------|
| Size | S (large) | s (small) | Large / Small |
| Tail Length | T (long) | t (short) | Long / Short |
| Ear Shape | E (pointed) | f (folded) | Pointed / Folded |
| Fur Color | O (orange) | w (white) | Orange / White |

### Genotype Display

The UI shows genotype status with visual indicators:
- **✓ Green** - Homozygous recessive (e.g., `ss`) - will always breed true
- **⚠ Orange** - Heterozygous carrier (e.g., `Ss`) - 50% chance of passing dominant
- **Plain** - Homozygous dominant (e.g., `SS`) - cannot produce recessive offspring

### Inheritance Rules

Standard Mendelian genetics apply:
- Each parent contributes one allele randomly (50/50)
- Dominant allele masks recessive in phenotype
- Cross outcomes:
  - `SS × SS` → 100% `SS` (all dominant phenotype)
  - `ss × ss` → 100% `ss` (all recessive phenotype)
  - `Ss × Ss` → 25% `SS`, 50% `Ss`, 25% `ss` (3:1 phenotype ratio)
  - `Ss × ss` → 50% `Ss`, 50% `ss` (1:1 phenotype ratio)

---

## Breeding

### Breeding Flow

1. Select a cat and click "Breed"
2. Select a second cat as mate
3. Pair is queued for breeding
4. On End Turn, offspring is generated

### Offspring Generation

- Genotype: Each trait inherits one allele from each parent (random selection)
- Phenotype: Calculated from genotype using dominance rules
- Name: Randomly selected from name pool
- Age: 0 days
- Happiness: 100%

---

## Trait Collection

The Trait Collection (contact sheet) tracks which trait phenotypes the player has successfully bred.

### Collection Grid

- Displays all 16 possible trait combinations (2^4 phenotypes)
- Each slot shows a greyed-out cat silhouette initially
- When an offspring with that trait combination is bred, the slot fills with that cat's appearance
- **First cat to achieve a trait combination "owns" that slot**

### Hover Preview

- Hovering over an uncollected slot shows what a cat with those traits would look like
- Helps players plan which trait combinations to pursue

### Completion Tracking

- Progress displayed as "X/16 traits discovered"
- Only cats bred by the player count (not purchased cats)

---

## Economy

### Currency

Players start with $500. Money is earned by selling cats and spent on:
- Purchasing cats from the market
- Daily food costs
- Buying furniture and toys

### Daily Costs

**Food Cost**: $1 per cat per day, deducted at end of turn.

### Pricing

Base price: $100 per cat

Trait multipliers (applied multiplicatively):
| Trait | Value | Multiplier |
|-------|-------|------------|
| Small size | Rare | 1.5x |
| Short tail | Rare | 1.3x |
| Folded ears | Rare | 2.0x |
| White fur | Rare | 1.4x |
| Large/Long/Pointed/Orange | Common | 1.0x |

### Sale Price Formula

```
SalePrice = BasePrice × TraitMultiplier × DailyFluctuation × HappinessMultiplier
```

Where:
- `BasePrice` = 100
- `TraitMultiplier` = product of all trait multipliers
- `DailyFluctuation` = random ±10% per trait (normal distribution)
- `HappinessMultiplier` = cat.happiness / 100 (0.0 to 1.0)

**Example**: A cat with folded ears (2.0x), white fur (1.4x), 80% happiness:
- Base calculation: $100 × 2.0 × 1.4 = $280
- With fluctuation (+5% ears, -3% fur): $280 × 1.05 × 0.97 ≈ $285
- With happiness: $285 × 0.80 = $228

---

## Market

### Buying Cats

Each day, the market offers 3 randomly generated cats for purchase.

**Purchase Price**: Calculated value + 20% premium

The market refreshes daily with new cats.

### Market UI

- Shows 3 cats with visible traits and genetics
- Displays purchase price for each
- Player can buy any/all cats if they have funds
- Purchased cats are added to player's collection immediately

---

## Cat Happiness

Cat happiness affects sale price and general wellbeing. Happiness ranges from 0-100%.

### Carrying Capacity

The room has an optimal number of cats based on furniture:
- **Base capacity**: 2 cats (just for having a room)
- **Per toy**: +1 cat capacity
- **Per bed**: +1 cat capacity

`OptimalCapacity = 2 + ToyCount + BedCount`

### Happiness Change Formula

Happiness changes daily based on how close cat count is to optimal capacity.

**Z-Score Calculation**:
```
Z = (CatCount - OptimalCapacity) / (OptimalCapacity × 0.25)
```

**Daily Happiness Change**:
```
DailyChange = -5 × Z + 5
```

This means:
| Z-Score | Cat Count vs Optimal | Daily Change |
|---------|---------------------|--------------|
| 0 | At optimal | +5% |
| 1 | 25% over optimal | ±0% (neutral) |
| 2 | 50% over optimal | -5% |
| 3 | 75% over optimal | -10% |
| -1 | 25% under optimal | +10% |

**Bounds**: Happiness is clamped to 0-100%.

### Furniture Shop

Players can purchase items to increase carrying capacity:

| Item | Price | Capacity Bonus |
|------|-------|----------------|
| Cat Toy | $50 | +1 |
| Cat Bed | $100 | +1 |
| Scratching Post | $75 | +1 |
| Cat Tree | $200 | +2 |

---

## Save System

Game progress is automatically saved to browser localStorage.

### Saved Data

- Current day
- Money
- All cats (with full genotype/phenotype data)
- Collected traits (which combinations have been discovered)
- Owned furniture/toys
- Current market state
- **Random seed** for the play session (ensures reproducibility)
- Breeding pairs and sale listings (pending actions)

### Save Behavior

- Game auto-saves after each turn
- Save persists across browser sessions
- "New Game" option clears save and starts fresh

### Random Seed

The game uses a seeded random number generator. The seed is:
- Generated once at game start
- Saved with game state
- Restored on load to maintain deterministic behavior

This ensures that save/load doesn't change outcomes and makes the game reproducible for testing.
