/** UI formatting utilities */

/** Format a number as currency for display */
export const formatMoney = (amount: number | null | undefined) =>
	amount == null ? '$—' : `$${amount.toLocaleString()}`;
