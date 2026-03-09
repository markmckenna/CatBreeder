/**
 * Public API for game state management and persistence.
 * 
 * This module exports game state types, actions, and save/load functions.
 * Internal state management details are kept private.
 */

export type { GameState, GameAction, TurnResult } from './state.ts';
export { ActionType, createInitialGameState, applyAction, processTurn } from './state.ts';

export type { SaveInfo } from './save.ts';
export { saveGame, loadGame, hasSavedGame, deleteSave, getSaveInfo } from './save.ts';
