// maskCardAutoBatch.ts

import type { CardInput, MaskCardOptions, MaskedResult } from "./types";
import { maskCardAuto } from "./autoFormat";

/**
 * Masks an array of card numbers, applying brand-specific auto-formatting to each.
 * Each card is detected individually so Amex, Diners, and standard cards all get
 * their correct grouping (e.g. 4-6-5 for Amex, 4-6-4 for Diners, 4-4-4-4 otherwise).
 * @param cards - Array of card numbers (string or number) to be masked
 * @param options - Configuration options applied to every card
 * @returns Array of masked card strings in the same order
 */
export const maskCardAutoBatch = (
  cards: CardInput[],
  options: MaskCardOptions = {},
): MaskedResult[] => {
  if (cards == null || !Array.isArray(cards)) return [];
  return cards.map((card) => maskCardAuto(card, options));
};
