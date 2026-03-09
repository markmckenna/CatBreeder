/**
 * Public API for economy and market systems.
 * 
 * This module exports market types and cat valuation functions.
 * Internal pricing mechanics are kept private.
 */

export type { MarketState, Transaction, MarketCat } from './market.ts';
export { calculateCatValue, getValueBreakdown, createMarketState } from './market.ts';
