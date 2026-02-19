/**
 * React context for game state management.
 * 
 * Handles save/load with localStorage and seeded random generation.
 */

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type { GameState, GameAction, TurnResult } from './state.ts';
import { createInitialGameState, applyAction, processTurn } from './state.ts';
import { saveGame, loadGame, deleteSave } from './save.ts';
import { createSeededRandom } from '@/utils/random.ts';

interface GameContextValue {
  state: GameState;
  dispatch: (action: GameAction) => void;
  endTurn: () => TurnResult;
  lastTurnResult: TurnResult | null;
  resetGame: () => void;
  gameSeed: number;
}

const GameContext = createContext<GameContextValue | null>(null);

interface GameProviderProps {
  children: ReactNode;
}

interface ReducerState {
  gameState: GameState;
  lastTurnResult: TurnResult | null;
  seed: number;
}

type ReducerAction = 
  | { type: 'GAME_ACTION'; action: GameAction }
  | { type: 'END_TURN'; result: TurnResult; newState: GameState }
  | { type: 'RESET'; newState: GameState; seed: number }
  | { type: 'LOAD'; state: GameState; seed: number };

function reducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case 'GAME_ACTION':
      return {
        ...state,
        gameState: applyAction(state.gameState, action.action),
      };
    case 'END_TURN':
      return {
        ...state,
        gameState: action.newState,
        lastTurnResult: action.result,
      };
    case 'RESET':
      return {
        gameState: action.newState,
        lastTurnResult: null,
        seed: action.seed,
      };
    case 'LOAD':
      return {
        gameState: action.state,
        lastTurnResult: null,
        seed: action.seed,
      };
    default:
      return state;
  }
}

/**
 * Generate a new random seed
 */
function generateSeed(): number {
  return Math.floor(Math.random() * 2147483647);
}

/**
 * Initialize state - load from save or create new
 */
function initializeState(): ReducerState {
  const saved = loadGame();
  if (saved) {
    console.log('Loaded saved game from day', saved.state.day);
    return {
      gameState: saved.state,
      lastTurnResult: null,
      seed: saved.seed,
    };
  }
  
  const seed = generateSeed();
  console.log('Starting new game with seed', seed);
  return {
    gameState: createInitialGameState(),
    lastTurnResult: null,
    seed,
  };
}

export function GameProvider({ children }: GameProviderProps) {
  const [{ gameState, lastTurnResult, seed }, internalDispatch] = useReducer(
    reducer,
    null,
    initializeState
  );

  const dispatch = useCallback((action: GameAction) => {
    if (action.type === 'END_TURN') {
      // Don't process END_TURN through normal dispatch
      return;
    }
    internalDispatch({ type: 'GAME_ACTION', action });
  }, []);

  const endTurn = useCallback(() => {
    // Create seeded RNG based on seed + day for reproducibility
    const turnSeed = seed + gameState.day;
    const rng = createSeededRandom(turnSeed);
    
    const { newState, result } = processTurn(gameState, rng);
    internalDispatch({ type: 'END_TURN', result, newState });
    
    // Auto-save after each turn
    saveGame(newState, seed);
    
    return result;
  }, [gameState, seed]);

  const resetGame = useCallback(() => {
    deleteSave();
    const newSeed = generateSeed();
    console.log('Starting new game with seed', newSeed);
    internalDispatch({ 
      type: 'RESET', 
      newState: createInitialGameState(), 
      seed: newSeed 
    });
  }, []);

  const value: GameContextValue = {
    state: gameState,
    dispatch,
    endTurn,
    lastTurnResult,
    gameSeed: seed,
    resetGame,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
