import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  applyAction,
  processTurn,
  getAvailableForBreeding,
  getAvailableForSale,
} from './state.ts';

describe('game state', () => {
  describe('createInitialGameState', () => {
    it('starts on day 1', () => {
      const state = createInitialGameState();
      expect(state.day).toBe(1);
    });

    it('starts with $500', () => {
      const state = createInitialGameState();
      expect(state.money).toBe(500);
    });

    it('starts with 2 cats', () => {
      const state = createInitialGameState();
      expect(state.cats).toHaveLength(2);
    });

    it('starts with empty pending actions', () => {
      const state = createInitialGameState();
      expect(state.breedingPairs).toHaveLength(0);
      expect(state.catsForSale).toHaveLength(0);
    });
  });

  describe('applyAction', () => {
    describe('ADD_BREEDING_PAIR', () => {
      it('adds a breeding pair', () => {
        const state = createInitialGameState();
        const [cat1, cat2] = state.cats;

        const newState = applyAction(state, {
          type: 'ADD_BREEDING_PAIR',
          parent1Id: cat1.id,
          parent2Id: cat2.id,
        });

        expect(newState.breedingPairs).toHaveLength(1);
        expect(newState.breedingPairs[0]).toEqual({
          parent1Id: cat1.id,
          parent2Id: cat2.id,
        });
      });

      it('prevents duplicate pairing', () => {
        const state = createInitialGameState();
        const [cat1, cat2] = state.cats;

        let newState = applyAction(state, {
          type: 'ADD_BREEDING_PAIR',
          parent1Id: cat1.id,
          parent2Id: cat2.id,
        });

        // Try to add same pair again
        newState = applyAction(newState, {
          type: 'ADD_BREEDING_PAIR',
          parent1Id: cat1.id,
          parent2Id: cat2.id,
        });

        expect(newState.breedingPairs).toHaveLength(1);
      });

      it('prevents cat from being in multiple pairs', () => {
        const state = createInitialGameState();
        // Add a third cat for this test
        const thirdCat = { ...state.cats[0], id: 'cat3', name: 'Third' };
        const stateWith3Cats = { ...state, cats: [...state.cats, thirdCat] };

        const [cat1, cat2] = stateWith3Cats.cats;

        let newState = applyAction(stateWith3Cats, {
          type: 'ADD_BREEDING_PAIR',
          parent1Id: cat1.id,
          parent2Id: cat2.id,
        });

        // Try to pair cat1 with cat3
        newState = applyAction(newState, {
          type: 'ADD_BREEDING_PAIR',
          parent1Id: cat1.id,
          parent2Id: thirdCat.id,
        });

        expect(newState.breedingPairs).toHaveLength(1);
      });
    });

    describe('LIST_FOR_SALE', () => {
      it('lists a cat for sale', () => {
        const state = createInitialGameState();
        const cat = state.cats[0];

        const newState = applyAction(state, {
          type: 'LIST_FOR_SALE',
          catId: cat.id,
        });

        expect(newState.catsForSale).toContain(cat.id);
      });

      it('prevents duplicate listing', () => {
        const state = createInitialGameState();
        const cat = state.cats[0];

        let newState = applyAction(state, {
          type: 'LIST_FOR_SALE',
          catId: cat.id,
        });

        newState = applyAction(newState, {
          type: 'LIST_FOR_SALE',
          catId: cat.id,
        });

        expect(newState.catsForSale.filter(id => id === cat.id)).toHaveLength(1);
      });
    });
  });

  describe('processTurn', () => {
    it('advances the day', () => {
      const state = createInitialGameState();
      const { newState } = processTurn(state);
      expect(newState.day).toBe(2);
    });

    it('produces offspring from breeding pairs', () => {
      const state = createInitialGameState();
      const [cat1, cat2] = state.cats;

      const stateWithPair = applyAction(state, {
        type: 'ADD_BREEDING_PAIR',
        parent1Id: cat1.id,
        parent2Id: cat2.id,
      });

      const { newState, result } = processTurn(stateWithPair);

      expect(result.births).toHaveLength(1);
      expect(newState.cats).toHaveLength(3);
      expect(newState.totalCatsBred).toBe(1);
    });

    it('sells listed cats and earns money', () => {
      const state = createInitialGameState();
      const cat = state.cats[0];
      const initialMoney = state.money;

      const stateWithSale = applyAction(state, {
        type: 'LIST_FOR_SALE',
        catId: cat.id,
      });

      const { newState, result } = processTurn(stateWithSale);

      expect(result.sales).toHaveLength(1);
      expect(newState.cats).toHaveLength(1); // One cat sold
      expect(newState.money).toBeGreaterThan(initialMoney);
      expect(newState.totalCatsSold).toBe(1);
    });

    it('clears pending actions after turn', () => {
      const state = createInitialGameState();
      const [cat1, cat2] = state.cats;

      const stateWithActions = applyAction(state, {
        type: 'ADD_BREEDING_PAIR',
        parent1Id: cat1.id,
        parent2Id: cat2.id,
      });

      const { newState } = processTurn(stateWithActions);

      expect(newState.breedingPairs).toHaveLength(0);
      expect(newState.catsForSale).toHaveLength(0);
    });

    it('ages all cats by 1 day', () => {
      const state = createInitialGameState();
      const originalAges = state.cats.map(c => c.age);

      const { newState } = processTurn(state);

      newState.cats.forEach((cat, i) => {
        expect(cat.age).toBe(originalAges[i] + 1);
      });
    });

    it('deducts daily food cost of $1 per cat', () => {
      const state = createInitialGameState();
      const startMoney = state.money;
      const catCount = state.cats.length;

      const { newState, result } = processTurn(state);

      expect(newState.money).toBe(startMoney - catCount);
      expect(result.foodCost).toBe(catCount);
    });
  });

  describe('getAvailableForBreeding', () => {
    it('returns all cats when no pairs', () => {
      const state = createInitialGameState();
      const available = getAvailableForBreeding(state);
      expect(available).toHaveLength(state.cats.length);
    });

    it('excludes cats already in pairs', () => {
      const state = createInitialGameState();
      const [cat1, cat2] = state.cats;

      const stateWithPair = applyAction(state, {
        type: 'ADD_BREEDING_PAIR',
        parent1Id: cat1.id,
        parent2Id: cat2.id,
      });

      const available = getAvailableForBreeding(stateWithPair);
      expect(available).toHaveLength(0);
    });
  });

  describe('getAvailableForSale', () => {
    it('returns all cats when none listed', () => {
      const state = createInitialGameState();
      const available = getAvailableForSale(state);
      expect(available).toHaveLength(state.cats.length);
    });

    it('excludes cats already listed', () => {
      const state = createInitialGameState();
      const cat = state.cats[0];

      const stateWithListing = applyAction(state, {
        type: 'LIST_FOR_SALE',
        catId: cat.id,
      });

      const available = getAvailableForSale(stateWithListing);
      expect(available).toHaveLength(1);
      expect(available[0].id).not.toBe(cat.id);
    });
  });

  describe('BUY_FURNITURE action', () => {
    it('buys a toy for $50', () => {
      const state = createInitialGameState();
      const initialMoney = state.money;

      const newState = applyAction(state, { type: 'BUY_FURNITURE', itemType: 'toy' });

      expect(newState.money).toBe(initialMoney - 50);
      expect(newState.furniture.toys).toBe(1);
      expect(newState.furniture.beds).toBe(0);
    });

    it('buys a bed for $100', () => {
      const state = createInitialGameState();
      const initialMoney = state.money;

      const newState = applyAction(state, { type: 'BUY_FURNITURE', itemType: 'bed' });

      expect(newState.money).toBe(initialMoney - 100);
      expect(newState.furniture.toys).toBe(0);
      expect(newState.furniture.beds).toBe(1);
    });

    it('does not buy if not enough money', () => {
      const state = { ...createInitialGameState(), money: 30 };

      const newState = applyAction(state, { type: 'BUY_FURNITURE', itemType: 'toy' });

      expect(newState.money).toBe(30);
      expect(newState.furniture.toys).toBe(0);
    });

    it('can buy multiple furniture items', () => {
      let state = createInitialGameState();
      state = applyAction(state, { type: 'BUY_FURNITURE', itemType: 'toy' });
      state = applyAction(state, { type: 'BUY_FURNITURE', itemType: 'toy' });
      state = applyAction(state, { type: 'BUY_FURNITURE', itemType: 'bed' });

      expect(state.furniture.toys).toBe(2);
      expect(state.furniture.beds).toBe(1);
    });

    it('records transaction when buying furniture', () => {
      const state = createInitialGameState();

      const newState = applyAction(state, { type: 'BUY_FURNITURE', itemType: 'toy' });

      expect(newState.transactions).toHaveLength(1);
      expect(newState.transactions[0].type).toBe('buy');
      expect(newState.transactions[0].amount).toBe(50);
    });
  });
});
