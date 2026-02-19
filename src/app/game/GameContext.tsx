/**
 * React context for game state management.
 */

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type { GameState, GameAction, TurnResult } from './state.ts';
import { createInitialGameState, applyAction, processTurn } from './state.ts';

interface GameContextValue {
  state: GameState;
  dispatch: (action: GameAction) => void;
  endTurn: () => TurnResult;
  lastTurnResult: TurnResult | null;
}

const GameContext = createContext<GameContextValue | null>(null);

interface GameProviderProps {
  children: ReactNode;
}

interface ReducerState {
  gameState: GameState;
  lastTurnResult: TurnResult | null;
}

type ReducerAction = 
  | { type: 'GAME_ACTION'; action: GameAction }
  | { type: 'END_TURN'; result: TurnResult; newState: GameState };

function reducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case 'GAME_ACTION':
      return {
        ...state,
        gameState: applyAction(state.gameState, action.action),
      };
    case 'END_TURN':
      return {
        gameState: action.newState,
        lastTurnResult: action.result,
      };
    default:
      return state;
  }
}

export function GameProvider({ children }: GameProviderProps) {
  const [{ gameState, lastTurnResult }, internalDispatch] = useReducer(reducer, {
    gameState: createInitialGameState(),
    lastTurnResult: null,
  });

  const dispatch = useCallback((action: GameAction) => {
    if (action.type === 'END_TURN') {
      // Don't process END_TURN through normal dispatch
      return;
    }
    internalDispatch({ type: 'GAME_ACTION', action });
  }, []);

  const endTurn = useCallback(() => {
    const { newState, result } = processTurn(gameState);
    internalDispatch({ type: 'END_TURN', result, newState });
    return result;
  }, [gameState]);

  const value: GameContextValue = {
    state: gameState,
    dispatch,
    endTurn,
    lastTurnResult,
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
