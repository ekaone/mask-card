// autoFormat.ts

import type { CardInput, MaskCardOptions, MaskedResult } from "./types";
import { maskCard } from "./maskCard";
import { detectCardType, getCardTypeGrouping } from "./cardType";

/**
 * Masks a card with automatic brand-specific formatting.
 * Automatically detects card type and applies appropriate grouping.
 * Example: '378282246310005' -> '**** ****** *0005' (auto-detects Amex)
 * @param input - The card number (string or number) to be masked
 * @param options - Configuration options (grouping will be auto-set based on card type)
 * @returns The masked card number with auto-formatting
 */
export const maskCardAuto = (
  input: CardInput,
  options: MaskCardOptions = {},
): MaskedResult => {
  // Detect card type
  const cardType = detectCardType(input);

  // Get appropriate grouping for the card type
  const autoGrouping = getCardTypeGrouping(cardType);

  // Merge options with auto-detected grouping (user grouping takes precedence).
  // Auto-format always re-groups with spaces; input separators are not preserved.
  const finalOptions: MaskCardOptions = {
    ...options,
    grouping: options.grouping ?? autoGrouping,
    preserveSpacing: false,
  };

  // Apply masking with auto-format
  return maskCard(input, finalOptions);
};
