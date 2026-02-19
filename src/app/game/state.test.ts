import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  applyAction,
  processTurn,
  getAvailableForBreeding,
  getAvailableForSale,
  ActionType,
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
          type: ActionType.ADD_BREEDING_PAIR,
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
          type: ActionType.ADD_BREEDING_PAIR,
          parent1Id: cat1.id,
          parent2Id: cat2.id,
        });

        // Try to add same pair again
        newState = applyAction(newState, {
          type: ActionType.ADD_BREEDING_PAIR,
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
          type: ActionType.ADD_BREEDING_PAIR,
          parent1Id: cat1.id,
          parent2Id: cat2.id,
        });

        // Try to pair cat1 with cat3
        newState = applyAction(newState, {
          type: ActionType.ADD_BREEDING_PAIR,
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
          type: ActionType.LIST_FOR_SALE,
          catId: cat.id,
        });

        expect(newState.catsForSale).toContain(cat.id);
      });

      it('prevents duplicate listing', () => {
        const state = createInitialGameState();
        const cat = state.cats[0];

        let newState = applyAction(state, {
          type: ActionType.LIST_FOR_SALE,
          catId: cat.id,
        });

        newState = applyAction(newState, {
          type: ActionType.LIST_FOR_SALE,
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
        type: ActionType.ADD_BREEDING_PAIR,
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
        type: ActionType.LIST_FOR_SALE,
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
        type: ActionType.ADD_BREEDING_PAIR,
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

    it('increases happiness when at optimal capacity', () => {
      // Base capacity is 2, start with 2 cats = optimal
      const state = createInitialGameState();
      const initialHappiness = state.cats[0].happiness;

      const { newState } = processTurn(state);

      // At optimal capacity, happiness should increase by 5
      expect(newState.cats[0].happiness).toBe(Math.min(100, initialHappiness + 5));
    });

    it('decreases happiness when overcrowded', () => {
      // Create a state with more cats than capacity (base is 2)
      const state = createInitialGameState();
      // Add more cats to exceed capacity
      const extraCats = [
        { ...state.cats[0], id: 'extra1', name: 'Extra1', happiness: 50 },
        { ...state.cats[0], id: 'extra2', name: 'Extra2', happiness: 50 },
        { ...state.cats[0], id: 'extra3', name: 'Extra3', happiness: 50 },
      ];
      const overcrowdedState = {
        ...state,
        cats: [...state.cats, ...extraCats],
      };

      const { newState } = processTurn(overcrowdedState);

      // 5 cats with capacity 2 = 3 over = Z-score of 6 = -25 happiness change
      // Should decrease significantly
      const extraCat = newState.cats.find(c => c.id === 'extra1');
      expect(extraCat!.happiness).toBeLessThan(50);
    });

    it('clamps happiness between 0 and 100', () => {
      const state = createInitialGameState();
      // Set cats to max happiness
      const maxHappyState = {
        ...state,
        cats: state.cats.map(c => ({ ...c, happiness: 100 })),
      };

      const { newState } = processTurn(maxHappyState);

      // Should not exceed 100
      expect(newState.cats[0].happiness).toBeLessThanOrEqual(100);
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
        type: ActionType.ADD_BREEDING_PAIR,
        parent1Id: cat1.id,
        parent2Id: cat2.id,
      });

      const available = getAvailableForBreeding(stateWithPair);
      expect(available).toHaveLength(0);
    });

    it('excludes kittens under 4 weeks old', () => {
      const state = createInitialGameState();
      // Add a kitten (age 0)
      const kitten = { ...state.cats[0], id: 'kitten-1', age: 0 };
      const stateWithKitten = { ...state, cats: [...state.cats, kitten] };
      
      const available = getAvailableForBreeding(stateWithKitten);
      expect(available).toHaveLength(state.cats.length); // Original cats only, not the kitten
      expect(available.find(c => c.id === 'kitten-1')).toBeUndefined();
    });

    it('includes cats that are exactly 4 weeks old', () => {
      const state = createInitialGameState();
      const catAt4Weeks = { ...state.cats[0], id: 'cat-4-weeks', age: 4 };
      const stateWith4WeekCat = { ...state, cats: [...state.cats, catAt4Weeks] };
      
      const available = getAvailableForBreeding(stateWith4WeekCat);
      expect(available.find(c => c.id === 'cat-4-weeks')).toBeDefined();
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
        type: ActionType.LIST_FOR_SALE,
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

      const newState = applyAction(state, { type: ActionType.BUY_FURNITURE, itemType: 'toy' });

      expect(newState.money).toBe(initialMoney - 50);
      expect(newState.furniture.toys).toBe(1);
      expect(newState.furniture.beds).toBe(0);
    });

    it('buys a bed for $100', () => {
      const state = createInitialGameState();
      const initialMoney = state.money;

      const newState = applyAction(state, { type: ActionType.BUY_FURNITURE, itemType: 'bed' });

      expect(newState.money).toBe(initialMoney - 100);
      expect(newState.furniture.toys).toBe(0);
      expect(newState.furniture.beds).toBe(1);
    });

    it('does not buy if not enough money', () => {
      const state = { ...createInitialGameState(), money: 30 };

      const newState = applyAction(state, { type: ActionType.BUY_FURNITURE, itemType: 'toy' });

      expect(newState.money).toBe(30);
      expect(newState.furniture.toys).toBe(0);
    });

    it('can buy multiple furniture items', () => {
      let state = createInitialGameState();
      state = applyAction(state, { type: ActionType.BUY_FURNITURE, itemType: 'toy' });
      state = applyAction(state, { type: ActionType.BUY_FURNITURE, itemType: 'toy' });
      state = applyAction(state, { type: ActionType.BUY_FURNITURE, itemType: 'bed' });

      expect(state.furniture.toys).toBe(2);
      expect(state.furniture.beds).toBe(1);
    });

    it('records transaction when buying furniture', () => {
      const state = createInitialGameState();

      const newState = applyAction(state, { type: ActionType.BUY_FURNITURE, itemType: 'toy' });

      expect(newState.transactions).toHaveLength(1);
      expect(newState.transactions[0].type).toBe('buy');
      expect(newState.transactions[0].amount).toBe(50);
    });
  });
});
