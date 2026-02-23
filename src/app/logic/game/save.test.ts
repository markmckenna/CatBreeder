/**
 * Tests for save/load system.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  saveGame,
  loadGame,
  hasSavedGame,
  deleteSave,
  getSaveInfo,
  SAVE_KEY,
  SAVE_VERSION,
} from './save.ts';
import { createInitialGameState } from './state.ts';

describe('save system', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('saveGame', () => {
    it('saves game state to localStorage', () => {
      const state = createInitialGameState();
      const seed = 12345;

      saveGame(state, seed);

      const saved = localStorage.getItem(SAVE_KEY);
      expect(saved).not.toBeNull();

      const parsed = JSON.parse(saved!);
      expect(parsed.version).toBe(SAVE_VERSION);
      expect(parsed.seed).toBe(seed);
      expect(parsed.state).toBeDefined();
    });

    it('includes timestamp in save', () => {
      const state = createInitialGameState();
      const before = Date.now();
      
      saveGame(state, 12345);
      
      const after = Date.now();
      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY)!);
      
      expect(parsed.timestamp).toBeGreaterThanOrEqual(before);
      expect(parsed.timestamp).toBeLessThanOrEqual(after);
    });

    it('overwrites previous save', () => {
      const state1 = createInitialGameState();
      const state2 = { ...createInitialGameState(), day: 10 };
      
      saveGame(state1, 111);
      saveGame(state2, 222);

      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY)!);
      expect(parsed.seed).toBe(222);
      expect(parsed.state.day).toBe(10);
    });
  });

  describe('loadGame', () => {
    it('returns null when no save exists', () => {
      const result = loadGame();
      expect(result).toBeNull();
    });

    it('loads saved game state', () => {
      const state = createInitialGameState();
      state.day = 5;
      state.money = 500;
      const seed = 54321;

      saveGame(state, seed);
      const loaded = loadGame();

      expect(loaded).not.toBeNull();
      expect(loaded!.state.day).toBe(5);
      expect(loaded!.state.money).toBe(500);
      expect(loaded!.seed).toBe(seed);
    });

    it('restores cats with proper structure', () => {
      const state = createInitialGameState();
      saveGame(state, 12345);
      
      const loaded = loadGame();
      expect(loaded!.state.cats).toHaveLength(state.cats.length);
      expect(loaded!.state.cats[0]).toHaveProperty('id');
      expect(loaded!.state.cats[0]).toHaveProperty('name');
      expect(loaded!.state.cats[0]).toHaveProperty('genotype');
      expect(loaded!.state.cats[0]).toHaveProperty('phenotype');
    });

    it('restores trait collection', () => {
      const state = createInitialGameState();
      saveGame(state, 12345);
      
      const loaded = loadGame();
      expect(loaded!.state.traitCollection).toBeDefined();
      expect(loaded!.state.traitCollection.collected).toBeDefined();
      expect(loaded!.state.traitCollection.collected instanceof Map).toBe(true);
    });

    it('returns null for corrupted save data', () => {
      localStorage.setItem(SAVE_KEY, 'invalid json');
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = loadGame();
      
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('logs warning for different version but still loads', () => {
      const state = createInitialGameState();
      const badSave = {
        version: 999,
        timestamp: Date.now(),
        seed: 12345,
        state: {
          ...state,
          traitCollection: {
            collected: Array.from(state.traitCollection.collected.entries()),
          },
        },
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(badSave));
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = loadGame();
      
      // Current implementation still loads even with version mismatch
      expect(result).not.toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('version mismatch'));
      consoleSpy.mockRestore();
    });
  });

  describe('hasSavedGame', () => {
    it('returns false when no save exists', () => {
      expect(hasSavedGame()).toBe(false);
    });

    it('returns true when save exists', () => {
      const state = createInitialGameState();
      saveGame(state, 12345);
      
      expect(hasSavedGame()).toBe(true);
    });
  });

  describe('deleteSave', () => {
    it('removes save from localStorage', () => {
      const state = createInitialGameState();
      saveGame(state, 12345);
      
      expect(hasSavedGame()).toBe(true);
      
      deleteSave();
      
      expect(hasSavedGame()).toBe(false);
    });

    it('does nothing if no save exists', () => {
      // Should not throw
      expect(() => deleteSave()).not.toThrow();
    });
  });

  describe('getSaveInfo', () => {
    it('returns null when no save exists', () => {
      expect(getSaveInfo()).toBeNull();
    });

    it('returns save metadata without full state', () => {
      const state = createInitialGameState();
      state.day = 15;
      state.money = 1500;
      saveGame(state, 99999);

      const info = getSaveInfo();
      
      expect(info).not.toBeNull();
      expect(info!.day).toBe(15);
      expect(info!.money).toBe(1500);
      expect(info!.catCount).toBe(state.cats.length);
      expect(info!.seed).toBe(99999);
      expect(info!.timestamp).toBeDefined();
    });
  });
});
