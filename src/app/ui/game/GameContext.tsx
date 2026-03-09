/**
 * React context wrapper for game state (Zustand-backed).
 * 
 * Provides backward-compatible API for existing components while using
 * Zustand store under the hood for better state management and DevTools.
 */

import { createContext, useContext, ReactNode } from 'react';
import type { GameState, GameAction, TurnResult } from '../../logic/game';
import { useGameStore } from './store.ts';

interface GameContextValue {
  state: GameState;
  dispatch: (action: GameAction) => void;
  endTurn: () => TurnResult;
  lastTurnResult: TurnResult | null;
  resetGame: () => void;
  gameSeed: number;
  error: Error | null;
  setError: (error: Error | null) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

interface GameProviderProps {
  children: ReactNode;
}

/**
 * GameProvider wraps the Zustand store in a React Context for backward compatibility.
 * 
 * Components can use either:
 * - useGame() hook (context-based, original API)
 * - useGameStore() hook (Zustand-based, direct store access)
 */
export function GameProvider({ children }: GameProviderProps) {
  // Subscribe to Zustand store
  const gameState = useGameStore((state) => state.gameState);
  const lastTurnResult = useGameStore((state) => state.lastTurnResult);
  const gameSeed = useGameStore((state) => state.gameSeed);
  const error = useGameStore((state) => state.error);
  const dispatch = useGameStore((state) => state.dispatch);
  const endTurn = useGameStore((state) => state.endTurn);
  const resetGame = useGameStore((state) => state.resetGame);
  const setError = useGameStore((state) => state.setError);

  const value: GameContextValue = {
    state: gameState,
    dispatch,
    endTurn,
    lastTurnResult,
    gameSeed,
    resetGame,
    error,
    setError,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

/**
 * Hook to access game state via React Context.
 * 
 * For new code, consider using useGameStore() directly for better performance
 * (selective subscriptions) and DevTools integration.
 */
export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}
