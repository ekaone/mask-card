// maskCardWithMeta.ts

import type { CardInput, CardMaskResult, MaskCardOptions } from "./types";
import { maskCardAuto } from "./autoFormat";
import { detectCardType } from "./cardType";
import { getCardFirst6, getCardLast4 } from "./helpers";
import { isValidCard } from "./luhn";

/**
 * Masks a card and returns all fields a real app typically needs in one call.
 * Combines maskCardAuto + detectCardType + isValidCard + getCardFirst6 + getCardLast4.
 * @param input - The card number (string or number) to process
 * @param options - Configuration options forwarded to maskCardAuto
 * @returns CardMaskResult with masked string, card type, validity, first6, and last4
 */
export const maskCardWithMeta = (
  input: CardInput,
  options: MaskCardOptions = {},
): CardMaskResult => {
  const masked = maskCardAuto(input, options);
  const cardType = detectCardType(input);
  const isValid = isValidCard(input);
  const first6 = getCardFirst6(input);
  const last4 = getCardLast4(input);
  return { masked, cardType, isValid, first6, last4 };
};
