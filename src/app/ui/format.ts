/**
 * UI formatting utilities for display purposes.
 */

/** Format a number as currency for display */
export const formatMoney = (amount: number) => `$${amount.toLocaleString()}`;
