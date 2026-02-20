/**
 * UI formatting utilities for display purposes.
 */

/** Format a number as currency for display */
export function formatMoney(amount: number): string {
  return `$${amount.toLocaleString()}`;
}
