/**
 * Utility for consistent equal-split money calculations across the app.
 * Ensures that per-person amounts are computed with a single rounding strategy.
 */

/**
 * Compute equal split per person with consistent rounding.
 * @param totalAmount - The total amount to split
 * @param numberOfPeople - Number of people to split among
 * @returns The per-person amount (rounded to 2 decimal places)
 */
export function computeEqualSplit(totalAmount: number, numberOfPeople: number): number {
  if (numberOfPeople <= 0) return 0;
  return Math.round((totalAmount / numberOfPeople) * 100) / 100;
}

/**
 * Get per-head amount from an entry, with fallback for legacy entries.
 * @param entry - Entry with optional perHead field
 * @param totalAmount - Total amount if perHead is not available
 * @param workerCount - Number of workers if perHead is not available
 * @returns The per-person amount
 */
export function getPerHeadAmount(
  entry: { perHead?: number; amount?: number; names?: string[] },
  totalAmount?: number,
  workerCount?: number
): number {
  if (entry.perHead !== undefined) {
    return entry.perHead;
  }
  // Fallback: derive from total amount and worker count
  const amount = totalAmount ?? entry.amount ?? 0;
  const count = workerCount ?? entry.names?.length ?? 1;
  return computeEqualSplit(amount, count);
}
