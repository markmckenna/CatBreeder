/**
 * Genetics utility functions for breeding and phenotype prediction.
 * 
 * Pure functions for analyzing allele combinations and predicting
 * breeding outcomes.
 */

/**
 * Get breeding status for an allele pair.
 * 
 * Determines if a cat is pure-breeding (homozygous recessive),
 * a carrier (heterozygous), or dominant (homozygous dominant).
 * 
 * Returns:
 * - 'pure': homozygous recessive (e.g., 'ss') - breeds true to recessive
 * - 'carrier': heterozygous (e.g., 'Ss') - may pass dominant allele
 * - 'dominant': homozygous dominant (e.g., 'SS') - always expresses dominant
 */
export function getBreedingStatus(alleles: [string, string]): 'pure' | 'carrier' | 'dominant' {
  const [a, b] = alleles;
  const isLower = (s: string) => s === s.toLowerCase();
  
  if (isLower(a) && isLower(b)) return 'pure';      // e.g., 'ss' - both recessive
  if (isLower(a) || isLower(b)) return 'carrier';   // e.g., 'Ss' - one of each
  return 'dominant';                                 // e.g., 'SS' - both dominant
}

/**
 * Get color description for a breeding status.
 * Used in UI to visually represent allele combinations.
 */
export function getBreedingStatusColor(status: 'pure' | 'carrier' | 'dominant'): string {
  switch (status) {
    case 'pure':
      return '#66BB6A'; // Green - predictable, breeds true
    case 'carrier':
      return '#FFA726'; // Orange - uncertainty, may express when paired
    case 'dominant':
      return '#EF5350'; // Red - always dominant
  }
}
