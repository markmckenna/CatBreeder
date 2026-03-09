/**
 * Zustand store for game state management.
 * 
 * Wraps pure game logic (state.ts) and persistence (save.ts) with a reactive store.
 * Handles save/load with localStorage and seeded random generation.
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { GameState, GameAction, TurnResult } from '../../logic/game';
import { createInitialGameState, applyAction, processTurn } from '../../logic/game';
import { saveGame, loadGame, deleteSave } from '../../logic/game';
import { createSeededRandom } from '@/core';

/** 
 * Fixed seed for new games - ensures consistent starting conditions.
 * All new games start with the same cats, market, etc.
 */
const DEFAULT_GAME_SEED = 12345;

interface GameStore {
  // State
  gameState: GameState;
  lastTurnResult: TurnResult | null;
  gameSeed: number;
  error: Error | null;
  
  // Actions
  dispatch: (action: GameAction) => void;
  endTurn: () => TurnResult;
  resetGame: () => void;
  setError: (error: Error | null) => void;
  
  // Internal actions (not exported in context)
  _setGameState: (state: GameState) => void;
  _setLastTurnResult: (result: TurnResult | null) => void;
}

/**
 * Initialize state - load from save or create new.
 * New games use a fixed seed for consistent starting conditions.
 */
function initializeState(): { gameState: GameState; seed: number } {
  const saved = loadGame();
  if (saved) {
    console.log('Loaded saved game from day', saved.state.day);
    return {
      gameState: saved.state,
      seed: saved.seed,
    };
  }
  
  // Use fixed seed for new games so all players start with same conditions
  const seed = DEFAULT_GAME_SEED;
  const rng = createSeededRandom(seed);
  console.log('Starting new game with seed', seed);
  return {
    gameState: createInitialGameState(rng),
    seed,
  };
}

const initialState = initializeState();

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gameState: initialState.gameState,
    lastTurnResult: null,
    gameSeed: initialState.seed,
    error: null,
    
    // Actions
    dispatch: (action: GameAction) => {
      if (action.type === 'END_TURN') {
        // Don't process END_TURN through normal dispatch
        return;
      }
      
      try {
        const currentState = get().gameState;
        const newState = applyAction(currentState, action);
        set({ gameState: newState, error: null });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        set({ error: err });
        console.error('Error in dispatch:', err);
      }
    },
    
    endTurn: () => {
      try {
        const { gameState, gameSeed } = get();
        
        // Create seeded RNG based on seed + day for reproducibility
        const turnSeed = gameSeed + gameState.day;
        const rng = createSeededRandom(turnSeed);
        
        const { newState, result } = processTurn(gameState, rng);
        set({ 
          gameState: newState, 
          lastTurnResult: result,
          error: null,
        });
        
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        set({ error: err });
        console.error('Error in endTurn:', err);
        return { 
          day: get().gameState.day, 
          births: [], 
          sales: [], 
          foodCost: 0, 
          events: ['Error processing turn'] 
        };
      }
    },
    
    resetGame: () => {
      try {
        deleteSave();
        // New games are deterministic - use fixed seed
        const rng = createSeededRandom(DEFAULT_GAME_SEED);
        console.log('Starting new game with seed', DEFAULT_GAME_SEED);
        set({
          gameState: createInitialGameState(rng),
          lastTurnResult: null,
          gameSeed: DEFAULT_GAME_SEED,
          error: null,
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        set({ error: err });
        console.error('Error in resetGame:', err);
      }
    },
    
    setError: (error: Error | null) => set({ error }),
    
    // Internal actions
    _setGameState: (state: GameState) => set({ gameState: state }),
    _setLastTurnResult: (result: TurnResult | null) => set({ lastTurnResult: result }),
  }))
);

// Auto-save subscription - saves whenever gameState or gameSeed changes
useGameStore.subscribe(
  (state) => ({ gameState: state.gameState, gameSeed: state.gameSeed }),
  ({ gameState, gameSeed }) => {
    saveGame(gameState, gameSeed);
  },
  {
    // Use shallow equality check for the selected state
    equalityFn: (a, b) => a.gameState === b.gameState && a.gameSeed === b.gameSeed,
  }
);
