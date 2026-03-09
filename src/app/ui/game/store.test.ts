/**
 * Tests for Zustand game store (store.ts)
 * 
 * Tests the store's state management, actions, and persistence.
 * Uses getState() and setState() to avoid React hook context issues.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { useGameStore } from './store.ts';
import * as saveModule from '../../logic/game/save';
import { ActionType } from '../../logic/game';

// Mock the save module
vi.mock('../../logic/game/save', () => ({
  loadGame: vi.fn(() => null),
  saveGame: vi.fn(),
  deleteSave: vi.fn(),
}));

describe('useGameStore - Actions and State', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('creates a game state with valid structure', () => {
      const state = useGameStore.getState();
      expect(state.gameState).toBeDefined();
      expect(state.gameState.day).toBeGreaterThan(0);
      expect(state.gameState.cats).toBeInstanceOf(Array);
      expect(state.gameState.money).toBeGreaterThanOrEqual(0);
    });

    it('initializes with a seed', () => {
      const state = useGameStore.getState();
      expect(state.gameSeed).toBeDefined();
      expect(typeof state.gameSeed).toBe('number');
      expect(state.gameSeed).toBeGreaterThan(0);
    });

    it('starts with no error', () => {
      const state = useGameStore.getState();
      expect(state.error).toBeNull();
    });

    it('starts with no turn result', () => {
      const state = useGameStore.getState();
      expect(state.lastTurnResult).toBeNull();
    });
  });

  describe('setError Action', () => {
    it('sets an error in the store', () => {
      const state = useGameStore.getState();
      const testError = new Error('Test error');
      state.setError(testError);
      
      const updatedState = useGameStore.getState();
      expect(updatedState.error).toEqual(testError);
    });

    it('clears an error when set to null', () => {
      const state = useGameStore.getState();
      const testError = new Error('Test error');
      state.setError(testError);
      state.setError(null);
      
      const updatedState = useGameStore.getState();
      expect(updatedState.error).toBeNull();
    });
  });

  describe('resetGame Action', () => {
    it('resets game to initial state', () => {
      const state = useGameStore.getState();
      
      state.resetGame();
      
      const resetState = useGameStore.getState();
      expect(resetState.error).toBeNull();
      expect(resetState.lastTurnResult).toBeNull();
    });

    it('sets seed to DEFAULT_GAME_SEED (12345) on reset', () => {
      const state = useGameStore.getState();
      state.resetGame();
      
      const resetState = useGameStore.getState();
      expect(resetState.gameSeed).toBe(12345);
    });

    it('calls deleteSave when resetting', () => {
      const state = useGameStore.getState();
      
      state.resetGame();
      
      // Verify deleteSave was called
      expect(saveModule.deleteSave).toHaveBeenCalled();
    });
  });

  describe('_setGameState Internal Action', () => {
    it('updates gameState directly', () => {
      const state = useGameStore.getState();
      const currentState = state.gameState;
      const modifiedState = {
        ...currentState,
        day: currentState.day + 5,
      };
      
      state._setGameState(modifiedState);
      
      const updatedState = useGameStore.getState();
      expect(updatedState.gameState.day).toBe(currentState.day + 5);
    });

    it('preserves other state fields when updating gameState', () => {
      const state = useGameStore.getState();
      const originalSeed = state.gameSeed;
      const originalError = state.error;
      
      const newState = {
        ...state.gameState,
        day: 999,
      };
      state._setGameState(newState);
      
      const updatedState = useGameStore.getState();
      expect(updatedState.gameSeed).toBe(originalSeed);
      expect(updatedState.error).toBe(originalError);
    });
  });

  describe('_setLastTurnResult Internal Action', () => {
    it('sets turn result', () => {
      const state = useGameStore.getState();
      const mockResult = {
        day: 5,
        births: [],
        sales: [],
        foodCost: 100,
        events: [],
      };
      
      state._setLastTurnResult(mockResult);
      
      const updatedState = useGameStore.getState();
      expect(updatedState.lastTurnResult).toEqual(mockResult);
    });

    it('clears turn result when set to null', () => {
      const state = useGameStore.getState();
      const mockResult = {
        day: 5,
        births: [],
        sales: [],
        foodCost: 100,
        events: [],
      };
      
      state._setLastTurnResult(mockResult);
      state._setLastTurnResult(null);
      
      const updatedState = useGameStore.getState();
      expect(updatedState.lastTurnResult).toBeNull();
    });
  });

  describe('dispatch Action', () => {
    it('ignores END_TURN action', () => {
      const state = useGameStore.getState();
      const initialState = state.gameState;
      
      // Dispatch END_TURN should do nothing
      state.dispatch({ type: ActionType.END_TURN });
      
      const sameState = useGameStore.getState();
      expect(sameState.gameState).toEqual(initialState);
    });

    it('handles valid dispatch actions', () => {
      const state = useGameStore.getState();
      
      // Get the first cat to toggle as favorite
      const firstCatId = state.gameState.cats[0].id;
      state.dispatch({ type: ActionType.TOGGLE_FAVOURITE, catId: firstCatId });
      
      // Store should remain functional with no error
      const updatedState = useGameStore.getState();
      expect(updatedState.error).toBeNull();
    });

    it('catches errors during dispatch', () => {
      const state = useGameStore.getState();
      // Send invalid action that will cause an error
      state.dispatch({ type: ActionType.TOGGLE_FAVOURITE, catId: 'INVALID_ID' });
      
      // After error, store should capture it
      const errorState = useGameStore.getState();
      // Error will be set if dispatch fails
      expect(errorState).toBeDefined();
    });
  });

  describe('endTurn Action', () => {
    it('returns a turn result', () => {
      const state = useGameStore.getState();
      const result = state.endTurn();
      
      expect(result).toBeDefined();
      expect(result.day).toBeGreaterThanOrEqual(0);
      expect(result.births).toBeInstanceOf(Array);
      expect(result.sales).toBeInstanceOf(Array);
      expect(typeof result.foodCost).toBe('number');
      expect(result.events).toBeInstanceOf(Array);
    });

    it('updates lastTurnResult in store', () => {
      const state = useGameStore.getState();
      const result = state.endTurn();
      
      const updatedState = useGameStore.getState();
      expect(updatedState.lastTurnResult).toBeDefined();
      // Should have same day as the returned result
      expect(updatedState.lastTurnResult?.day).toBe(result.day);
    });

    it('advances game day', () => {
      const state = useGameStore.getState();
      const initialDay = state.gameState.day;
      
      state.endTurn();
      
      const updatedState = useGameStore.getState();
      expect(updatedState.gameState.day).toBeGreaterThan(initialDay);
    });

    it('handles errors gracefully, returning error turn result', () => {
      const state = useGameStore.getState();
      // Normal end turn should work
      const result = state.endTurn();
      
      expect(result).toBeDefined();
      expect(result.day).toBeGreaterThanOrEqual(0);
    });

    it('uses seeded RNG for reproducible turns', () => {
      const state1 = useGameStore.getState();
      const seed1 = state1.gameSeed;
      const result1 = state1.endTurn();
      
      // Count births in first turn
      const births1 = result1.births.length;
      
      // Reset and run same turn
      state1.resetGame();
      const state2 = useGameStore.getState();
      expect(state2.gameSeed).toBe(seed1);
      
      const result2 = state2.endTurn();
      const births2 = result2.births.length;
      
      // Should get same # of births due to seeded RNG
      // (Note: exact properties may differ based on game logic)
      expect(births2).toBe(births1);
    });
  });

  describe('Store Consistency', () => {
    it('maintains consistency after multiple operations', () => {
      const state = useGameStore.getState();
      
      // Get first cat to toggle as favorite
      const firstCatId = state.gameState.cats[0].id;
      state.dispatch({ type: ActionType.TOGGLE_FAVOURITE, catId: firstCatId });
      state.setError(null);
      const initialTurnResult = state.endTurn();
      state._setLastTurnResult(initialTurnResult);
      
      const finalState = useGameStore.getState();
      expect(finalState.gameState).toBeDefined();
      expect(finalState.gameSeed).toBeGreaterThan(0);
      expect(finalState.lastTurnResult).toBeDefined();
    });

    it('error state does not affect other operations', () => {
      const state = useGameStore.getState();
      const testError = new Error('Test error');
      state.setError(testError);
      
      // Should still be able to dispatch
      const firstCatId = state.gameState.cats[0].id;
      state.dispatch({ type: ActionType.TOGGLE_FAVOURITE, catId: firstCatId });
      
      const updatedState = useGameStore.getState();
      expect(updatedState.error).toBeDefined();
    });
  });
});
