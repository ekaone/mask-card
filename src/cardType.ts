// cardType.ts

import type { CardInput, CardType } from "./types";

/**
 * Detects the card brand/type based on the card number.
 * Example: '4532123456789012' -> 'visa'
 * @param input - The card number (string or number)
 * @returns The detected card type or 'unknown'
 */
export const detectCardType = (input: CardInput): CardType => {
  // Handle null/undefined
  if (input == null) {
    return "unknown";
  }

  // Convert to string and extract digits
  const digits = String(input).replace(/\D/g, "");

  // Return unknown if no digits
  if (digits.length === 0) {
    return "unknown";
  }

  // Get first 6 digits for BIN detection
  const bin = digits.slice(0, 6);
  const firstDigit = digits[0];
  const firstTwo = digits.slice(0, 2);
  const firstThree = digits.slice(0, 3);
  const firstFour = digits.slice(0, 4);

  // Visa: starts with 4
  if (firstDigit === "4") {
    return "visa";
  }

  // Mastercard: 51-55 or 2221-2720
  if (
    (parseInt(firstTwo) >= 51 && parseInt(firstTwo) <= 55) ||
    (parseInt(firstFour) >= 2221 && parseInt(firstFour) <= 2720)
  ) {
    return "mastercard";
  }

  // American Express: 34 or 37
  if (firstTwo === "34" || firstTwo === "37") {
    return "amex";
  }

  // Discover: 6011, 622126-622925, 644-649, 65
  if (
    firstFour === "6011" ||
    (parseInt(bin) >= 622126 && parseInt(bin) <= 622925) ||
    (parseInt(firstThree) >= 644 && parseInt(firstThree) <= 649) ||
    firstTwo === "65"
  ) {
    return "discover";
  }

  // JCB: 3528-3589
  if (parseInt(firstFour) >= 3528 && parseInt(firstFour) <= 3589) {
    return "jcb";
  }

  // Diners Club: 300-305, 36, 38-39
  if (
    (parseInt(firstThree) >= 300 && parseInt(firstThree) <= 305) ||
    firstTwo === "36" ||
    firstTwo === "38" ||
    firstTwo === "39"
  ) {
    return "diners";
  }

  // UnionPay: starts with 62
  if (firstTwo === "62") {
    return "unionpay";
  }

  // Maestro: 50, 56-58, 6
  if (
    firstTwo === "50" ||
    (parseInt(firstTwo) >= 56 && parseInt(firstTwo) <= 58) ||
    firstDigit === "6"
  ) {
    // Check if not already identified as Discover or UnionPay
    if (
      firstFour !== "6011" &&
      firstTwo !== "65" &&
      firstTwo !== "62" &&
      !(parseInt(bin) >= 622126 && parseInt(bin) <= 622925) &&
      !(parseInt(firstThree) >= 644 && parseInt(firstThree) <= 649)
    ) {
      return "maestro";
    }
  }

  return "unknown";
};

/**
 * Gets the standard grouping pattern for a card type.
 * @param cardType - The card type
 * @returns Grouping array for the card type
 */
export const getCardTypeGrouping = (cardType: CardType): number[] => {
  switch (cardType) {
    case "amex":
      return [4, 6, 5]; // Amex: 4-6-5
    case "diners":
      return [4, 6, 4]; // Diners: 4-6-4
    default:
      return [4, 4, 4, 4]; // Standard: 4-4-4-4
  }
};
