/**
 * Common utility functions used across the application.
 */

/** Capitalize first letter, lowercase rest. Passes through null/undefined. */
export function capitalize(str: string | null | undefined): string | null | undefined {
  if (str == null) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Format currency using Intl.NumberFormat */
export const formatCurrency = (amount: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
