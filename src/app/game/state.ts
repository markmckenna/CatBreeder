/**
 * Core game logic and state management.
 */

import type { Cat, RandomFn } from '../cats/genetics.ts';
import { breedCats, createRandomCat, getRandomCatName } from '../cats/genetics.ts';
import type { MarketState, Transaction, MarketCat } from '../economy/market.ts';
import { createMarketState, calculateCatValue, generateMarketInventory, FOOD_COST_PER_CAT } from '../economy/market.ts';
import type { TraitCollection } from '../cats/collection.ts';
import { createTraitCollection, registerBredCat } from '../cats/collection.ts';
import type { OwnedFurniture, FurnitureItemType } from '../environment/furniture.ts';
import { createInitialFurniture, SHOP_ITEMS, calculateCapacity } from '../environment/furniture.ts';
import { assignCatPositions, type SpotType } from '../environment/positions.ts';

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
  
  // Furniture owned by the player
  furniture: OwnedFurniture;
  
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
 * Actions the player can take.
 * Each action type maps to a handler function.
 */
export enum ActionType {
  ADD_BREEDING_PAIR = 'ADD_BREEDING_PAIR',
  REMOVE_BREEDING_PAIR = 'REMOVE_BREEDING_PAIR',
  LIST_FOR_SALE = 'LIST_FOR_SALE',
  UNLIST_FROM_SALE = 'UNLIST_FROM_SALE',
  BUY_CAT = 'BUY_CAT',
  BUY_FURNITURE = 'BUY_FURNITURE',
  END_TURN = 'END_TURN',
}

export type GameAction =
  | { type: ActionType.ADD_BREEDING_PAIR; parent1Id: string; parent2Id: string }
  | { type: ActionType.REMOVE_BREEDING_PAIR; parent1Id: string; parent2Id: string }
  | { type: ActionType.LIST_FOR_SALE; catId: string }
  | { type: ActionType.UNLIST_FROM_SALE; catId: string }
  | { type: ActionType.BUY_CAT; cat: Cat; price: number }
  | { type: ActionType.BUY_FURNITURE; itemType: FurnitureItemType }
  | { type: ActionType.END_TURN };

/**
 * Turn results to show the player
 */
export interface TurnResult {
  day: number;
  births: Cat[];
  sales: { cat: Cat; price: number }[];
  foodCost: number;
  events: string[];
}

/**
 * Create initial game state
 * 
 * @param rng - Optional random function for deterministic generation
 */
export function createInitialGameState(rng?: RandomFn): GameState {
  // Start with 2 cats
  const starterCats = [
    createRandomCat('Whiskers', { random: rng }),
    createRandomCat('Mittens', { random: rng }),
  ];

  const market = createMarketState();

  return {
    day: 1,
    money: 500,
    cats: starterCats,
    market,
    marketInventory: generateMarketInventory(market, rng),
    traitCollection: createTraitCollection(),
    furniture: createInitialFurniture(),
    breedingPairs: [],
    catsForSale: [],
    transactions: [],
    totalCatsBred: 0,
    totalCatsSold: 0,
  };
}

// ============= Action Handlers =============
// Each handler is a pure function: (state, actionPayload) => newState

function addBreedingPair(
  state: GameState, 
  parent1Id: string, 
  parent2Id: string
): GameState {
  // Check cats exist and aren't already paired
  const cat1 = state.cats.find(c => c.id === parent1Id);
  const cat2 = state.cats.find(c => c.id === parent2Id);
  if (!cat1 || !cat2) return state;

  const alreadyPaired = state.breedingPairs.some(
    p => p.parent1Id === parent1Id || p.parent2Id === parent1Id ||
         p.parent1Id === parent2Id || p.parent2Id === parent2Id
  );
  if (alreadyPaired) return state;

  return {
    ...state,
    breedingPairs: [...state.breedingPairs, { parent1Id, parent2Id }],
  };
}

function removeBreedingPair(
  state: GameState, 
  parent1Id: string, 
  parent2Id: string
): GameState {
  return {
    ...state,
    breedingPairs: state.breedingPairs.filter(
      p => !(p.parent1Id === parent1Id && p.parent2Id === parent2Id)
    ),
  };
}

function listForSale(state: GameState, catId: string): GameState {
  if (state.catsForSale.includes(catId)) return state;
  const cat = state.cats.find(c => c.id === catId);
  if (!cat) return state;

  return {
    ...state,
    catsForSale: [...state.catsForSale, catId],
  };
}

function unlistFromSale(state: GameState, catId: string): GameState {
  return {
    ...state,
    catsForSale: state.catsForSale.filter(id => id !== catId),
  };
}

function buyCat(state: GameState, cat: Cat, price: number): GameState {
  if (state.money < price) return state;
  
  // Remove cat from market inventory
  const newInventory = state.marketInventory.filter(
    mc => mc.cat.id !== cat.id
  );

  return {
    ...state,
    money: state.money - price,
    cats: [...state.cats, cat],
    marketInventory: newInventory,
    transactions: [...state.transactions, {
      type: 'buy',
      catId: cat.id,
      amount: price,
      day: state.day,
    }],
  };
}

function buyFurniture(state: GameState, itemType: FurnitureItemType): GameState {
  const item = SHOP_ITEMS[itemType];
  if (!item || state.money < item.price) {
    return state;
  }

  const newFurniture = { ...state.furniture };
  if (itemType === 'toy') {
    newFurniture.toys += 1;
  } else if (itemType === 'bed') {
    newFurniture.beds += 1;
  }

  return {
    ...state,
    money: state.money - item.price,
    furniture: newFurniture,
    transactions: [...state.transactions, {
      type: 'buy',
      catId: `furniture-${itemType}-${Date.now()}`,
      amount: item.price,
      day: state.day,
    }],
  };
}

// ============= Action Dispatcher =============

/**
 * Apply an action to game state (immutable)
 */
export function applyAction(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case ActionType.ADD_BREEDING_PAIR:
      return addBreedingPair(state, action.parent1Id, action.parent2Id);
    
    case ActionType.REMOVE_BREEDING_PAIR:
      return removeBreedingPair(state, action.parent1Id, action.parent2Id);
    
    case ActionType.LIST_FOR_SALE:
      return listForSale(state, action.catId);
    
    case ActionType.UNLIST_FROM_SALE:
      return unlistFromSale(state, action.catId);
    
    case ActionType.BUY_CAT:
      return buyCat(state, action.cat, action.price);
    
    case ActionType.BUY_FURNITURE:
      return buyFurniture(state, action.itemType);
    
    case ActionType.END_TURN:
      // Turn processing is handled by processTurn
      return state;

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
    foodCost: 0,
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

  // Process sales (simplified: all listed cats sell at market value with price fluctuation)
  const soldCatIds: string[] = [];
  for (const catId of state.catsForSale) {
    const cat = newState.cats.find(c => c.id === catId);
    if (cat) {
      const price = calculateCatValue(cat, newState.market, { fluctuate: true, random: rng });
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

  // Update cat happiness based on their daily experience
  // First, assign positions to get each cat's spot type
  const catPositions = assignCatPositions(
    newState.cats.map(c => c.id),
    newState.furniture,
    rng
  );
  const spotsByCat = new Map(catPositions.map(p => [p.catId, p.spotType]));
  
  // Calculate capacity and overcrowding
  const capacity = calculateCapacity(newState.furniture);
  const catCount = newState.cats.length;
  const overcrowdCount = Math.max(0, catCount - capacity);
  const isAlone = catCount === 1;
  
  // Apply happiness changes to each cat
  newState.cats = newState.cats.map(cat => {
    // Base daily decay: -5%
    let change = -5;
    
    // Get cat's spot type
    const spotType: SpotType | undefined = spotsByCat.get(cat.id);
    
    // Toy access: +5% happiness
    if (spotType === 'toy') {
      change += 5;
    }
    
    // Bed access: +8% happiness
    if (spotType === 'bed') {
      change += 8;
    }
    
    // Comfort spot (rug or bookshelf): no penalty
    // No comfort spot (floor): -5% extra
    if (spotType === 'floor') {
      change -= 5;
    }
    
    // Alone penalty: -5% extra
    if (isAlone) {
      change -= 5;
    }
    
    // Overcrowding penalty: -1% per cat over capacity
    change -= overcrowdCount;
    
    return {
      ...cat,
      happiness: Math.max(0, Math.min(100, cat.happiness + change)),
    };
  });

  // Deduct daily food costs
  const foodCost = newState.cats.length * FOOD_COST_PER_CAT;
  newState.money -= foodCost;
  result.foodCost = foodCost;

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
  if (foodCost > 0) {
    result.events.push(`Food expenses: $${foodCost}`);
  }

  return { newState, result };
}

/**
 * Get cats available for breeding (not already in a pair, at least 4 weeks old)
 */
export function getAvailableForBreeding(state: GameState): Cat[] {
  const pairedIds = new Set(
    state.breedingPairs.flatMap(p => [p.parent1Id, p.parent2Id])
  );
  return state.cats.filter(c => !pairedIds.has(c.id) && c.age >= 4);
}

/**
 * Get cats available for sale (not already listed)
 */
export function getAvailableForSale(state: GameState): Cat[] {
  return state.cats.filter(c => !state.catsForSale.includes(c.id));
}
