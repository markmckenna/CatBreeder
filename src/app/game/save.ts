/**
 * Save/Load system using localStorage.
 * 
 * Handles serialization and deserialization of game state,
 * including the random seed for reproducibility.
 */

import type { GameState } from './state.ts';
import type { TraitCollection, CollectedTrait, TraitKey } from '../cats/collection.ts';
import type { MarketState, Transaction, MarketCat } from '../economy/market.ts';
import type { Cat } from '../cats/genetics.ts';
import type { OwnedFurniture } from '../environment/furniture.ts';

export const SAVE_KEY = 'catbreeder_save';
export const SAVE_VERSION = 1;

/**
 * Serialized save format
 */
interface SaveData {
  version: number;
  timestamp: number;
  seed: number;
  state: SerializedGameState;
}

/**
 * State in serializable format (no Map objects)
 */
interface SerializedGameState {
  day: number;
  money: number;
  cats: Cat[];
  market: MarketState;
  marketInventory: MarketCat[];
  furniture?: OwnedFurniture;
  traitCollection: {
    collected: Array<[TraitKey, CollectedTrait]>;
  };
  breedingPairs: Array<{ parent1Id: string; parent2Id: string }>;
  catsForSale: string[];
  transactions: Transaction[];
  totalCatsBred: number;
  totalCatsSold: number;
}

/**
 * Serialize game state for storage
 */
function serializeState(state: GameState): SerializedGameState {
  return {
    ...state,
    traitCollection: {
      collected: Array.from(state.traitCollection.collected.entries()),
    },
  };
}

/**
 * Deserialize state from storage
 */
function deserializeState(data: SerializedGameState): GameState {
  // Ensure furniture has all expected properties (for old saves)
  const savedFurniture = data.furniture ?? { toys: 0, beds: 0, catTrees: 0 };
  const furniture = {
    toys: savedFurniture.toys ?? 0,
    beds: savedFurniture.beds ?? 0,
    catTrees: savedFurniture.catTrees ?? 0,
  };
  
  return {
    ...data,
    furniture,
    traitCollection: {
      collected: new Map(data.traitCollection.collected),
    } as TraitCollection,
  };
}

/**
 * Save game state to localStorage
 */
export function saveGame(state: GameState, seed: number): boolean {
  try {
    const saveData: SaveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      seed,
      state: serializeState(state),
    };
    
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('Failed to save game:', error);
    return false;
  }
}

/**
 * Load game state from localStorage
 * Returns null if no save exists or save is invalid
 */
export function loadGame(): { state: GameState; seed: number } | null {
  try {
    const savedJson = localStorage.getItem(SAVE_KEY);
    if (!savedJson) return null;

    const saveData: SaveData = JSON.parse(savedJson);
    
    // Version check - could add migration logic here
    if (saveData.version !== SAVE_VERSION) {
      console.warn(`Save version mismatch: ${saveData.version} vs ${SAVE_VERSION}`);
      // For now, just try to load anyway
    }

    const state = deserializeState(saveData.state);
    return { state, seed: saveData.seed };
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

/** Check if a save exists */
export const hasSavedGame = () => localStorage.getItem(SAVE_KEY) !== null;

/**
 * Delete saved game
 */
export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

/**
 * Save metadata for display
 */
export interface SaveInfo {
  day: number;
  money: number;
  catCount: number;
  seed: number;
  timestamp: number;
}

/**
 * Get save metadata without loading full state
 */
export function getSaveInfo(): SaveInfo | null {
  try {
    const savedJson = localStorage.getItem(SAVE_KEY);
    if (!savedJson) return null;
    
    const saveData: SaveData = JSON.parse(savedJson);
    return {
      day: saveData.state.day,
      money: saveData.state.money,
      catCount: saveData.state.cats.length,
      seed: saveData.seed,
      timestamp: saveData.timestamp,
    };
  } catch {
    return null;
  }
}
