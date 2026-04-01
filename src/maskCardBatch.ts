// maskCardBatch.ts

import type { CardInput, MaskCardOptions, MaskedResult } from "./types";
import { maskCard } from "./maskCard";

/**
 * Masks multiple credit card numbers at once.
 * Example: ['4532123456789012', '5500000000000004'] -> ['************9012', '************0004']
 * @param cards - Array of card numbers to be masked
 * @param options - Configuration options for masking (applied to all cards)
 * @returns Array of masked card number strings
 */
export const maskCardBatch = (
  cards: CardInput[],
  options: MaskCardOptions = {},
): MaskedResult[] => {
  // Handle null/undefined input
  if (!cards || !Array.isArray(cards)) {
    return [];
  }

  // Map each card through maskCard function
  return cards.map((card) => maskCard(card, options));
};
