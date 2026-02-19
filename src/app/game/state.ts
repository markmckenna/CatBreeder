/**
 * Core game logic and state management.
 */

import type { Cat, RandomFn } from '../cats/genetics.ts';
import { breedCats, createRandomCat, getRandomCatName } from '../cats/genetics.ts';
import type { MarketState, Transaction, MarketCat } from '../economy/market.ts';
import { createMarketState, calculateCatValue, generateMarketInventory } from '../economy/market.ts';
import type { TraitCollection } from '../cats/collection.ts';
import { createTraitCollection, registerBredCat } from '../cats/collection.ts';

/**
 * Planned breeding pair for next turn
 */
export interface BreedingPair {
  parent1Id: string;
  parent2Id: string;
}

/**
 * Complete game state
 */
export interface GameState {
  day: number;
  money: number;
  cats: Cat[];
  market: MarketState;
  
  // Cats available for purchase in the market
  marketInventory: MarketCat[];
  
  // Trait collection - tracks discovered trait combinations
  traitCollection: TraitCollection;
  
  // Pending actions for next turn
  breedingPairs: BreedingPair[];
  catsForSale: string[]; // cat IDs
  
  // History
  transactions: Transaction[];
  
  // Stats
  totalCatsBred: number;
  totalCatsSold: number;
}

/**
 * Actions the player can take
 */
export type GameAction =
  | { type: 'ADD_BREEDING_PAIR'; parent1Id: string; parent2Id: string }
  | { type: 'REMOVE_BREEDING_PAIR'; parent1Id: string; parent2Id: string }
  | { type: 'LIST_FOR_SALE'; catId: string }
  | { type: 'UNLIST_FROM_SALE'; catId: string }
  | { type: 'BUY_CAT'; cat: Cat; price: number }
  | { type: 'END_TURN' };

/**
 * Turn results to show the player
 */
export interface TurnResult {
  day: number;
  births: Cat[];
  sales: { cat: Cat; price: number }[];
  events: string[];
}

/**
 * Create initial game state
 */
export function createInitialGameState(): GameState {
  // Start with 2 random cats
  const starterCats = [
    createRandomCat('Whiskers'),
    createRandomCat('Mittens'),
  ];

  const market = createMarketState();

  return {
    day: 1,
    money: 500,
    cats: starterCats,
    market,
    marketInventory: generateMarketInventory(market),
    traitCollection: createTraitCollection(),
    breedingPairs: [],
    catsForSale: [],
    transactions: [],
    totalCatsBred: 0,
    totalCatsSold: 0,
  };
}

/**
 * Apply an action to game state (immutable)
 */
export function applyAction(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_BREEDING_PAIR': {
      // Check cats exist and aren't already paired
      const cat1 = state.cats.find(c => c.id === action.parent1Id);
      const cat2 = state.cats.find(c => c.id === action.parent2Id);
      if (!cat1 || !cat2) return state;

      const alreadyPaired = state.breedingPairs.some(
        p => p.parent1Id === action.parent1Id || p.parent2Id === action.parent1Id ||
             p.parent1Id === action.parent2Id || p.parent2Id === action.parent2Id
      );
      if (alreadyPaired) return state;

      return {
        ...state,
        breedingPairs: [...state.breedingPairs, { parent1Id: action.parent1Id, parent2Id: action.parent2Id }],
      };
    }

    case 'REMOVE_BREEDING_PAIR': {
      return {
        ...state,
        breedingPairs: state.breedingPairs.filter(
          p => !(p.parent1Id === action.parent1Id && p.parent2Id === action.parent2Id)
        ),
      };
    }

    case 'LIST_FOR_SALE': {
      if (state.catsForSale.includes(action.catId)) return state;
      const cat = state.cats.find(c => c.id === action.catId);
      if (!cat) return state;

      return {
        ...state,
        catsForSale: [...state.catsForSale, action.catId],
      };
    }

    case 'UNLIST_FROM_SALE': {
      return {
        ...state,
        catsForSale: state.catsForSale.filter(id => id !== action.catId),
      };
    }

    case 'BUY_CAT': {
      if (state.money < action.price) return state;
      
      // Remove cat from market inventory
      const newInventory = state.marketInventory.filter(
        mc => mc.cat.id !== action.cat.id
      );

      return {
        ...state,
        money: state.money - action.price,
        cats: [...state.cats, action.cat],
        marketInventory: newInventory,
        transactions: [...state.transactions, {
          type: 'buy',
          catId: action.cat.id,
          amount: action.price,
          day: state.day,
        }],
      };
    }

    case 'END_TURN': {
      // Turn processing is handled by processTurn
      return state;
    }

    default:
      return state;
  }
}

/**
 * Process end of turn - breeding, sales, aging
 * @param state - Current game state
 * @param rng - Optional random function for deterministic results
 */
export function processTurn(
  state: GameState,
  rng?: RandomFn
): { newState: GameState; result: TurnResult } {
  const result: TurnResult = {
    day: state.day,
    births: [],
    sales: [],
    events: [],
  };

  const newState = { ...state };
  const newDiscoveries: string[] = [];

  // Process breeding
  for (const pair of state.breedingPairs) {
    const parent1 = state.cats.find(c => c.id === pair.parent1Id);
    const parent2 = state.cats.find(c => c.id === pair.parent2Id);
    
    if (parent1 && parent2) {
      const offspring = breedCats(
        parent1, 
        parent2, 
        getRandomCatName(rng),
        rng ? { random: rng } : undefined
      );
      result.births.push(offspring);
      newState.cats = [...newState.cats, offspring];
      newState.totalCatsBred++;
      
      // Register in trait collection
      const { updated, collection } = registerBredCat(
        newState.traitCollection,
        offspring,
        newState.day
      );
      newState.traitCollection = collection;
      
      if (updated) {
        newDiscoveries.push(offspring.name);
      }
    }
  }

  // Process sales (simplified: all listed cats sell at market value)
  const soldCatIds: string[] = [];
  for (const catId of state.catsForSale) {
    const cat = newState.cats.find(c => c.id === catId);
    if (cat) {
      const price = calculateCatValue(cat, newState.market);
      result.sales.push({ cat, price });
      soldCatIds.push(catId);
      newState.money += price;
      newState.totalCatsSold++;
      newState.transactions = [...newState.transactions, {
        type: 'sell',
        catId: cat.id,
        amount: price,
        day: newState.day,
      }];
    }
  }

  // Remove sold cats
  newState.cats = newState.cats.filter(c => !soldCatIds.includes(c.id));

  // Age all cats
  newState.cats = newState.cats.map(cat => ({
    ...cat,
    age: cat.age + 1,
  }));

  // Clear pending actions
  newState.breedingPairs = [];
  newState.catsForSale = [];

  // Advance day
  newState.day++;

  // Generate new market inventory for the next day
  newState.marketInventory = generateMarketInventory(newState.market, rng);

  // Generate events
  if (result.births.length > 0) {
    result.events.push(`${result.births.length} kitten(s) were born!`);
  }
  if (newDiscoveries.length > 0) {
    result.events.push(`🎉 New trait discovered by ${newDiscoveries.join(', ')}!`);
  }
  if (result.sales.length > 0) {
    const totalEarned = result.sales.reduce((sum, s) => sum + s.price, 0);
    result.events.push(`Sold ${result.sales.length} cat(s) for $${totalEarned}!`);
  }

  return { newState, result };
}

/**
 * Get cats available for breeding (not already in a pair)
 */
export function getAvailableForBreeding(state: GameState): Cat[] {
  const pairedIds = new Set(
    state.breedingPairs.flatMap(p => [p.parent1Id, p.parent2Id])
  );
  return state.cats.filter(c => !pairedIds.has(c.id));
}

/**
 * Get cats available for sale (not already listed)
 */
export function getAvailableForSale(state: GameState): Cat[] {
  return state.cats.filter(c => !state.catsForSale.includes(c.id));
}
