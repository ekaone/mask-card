// luhn.ts

import type { CardInput } from "./types";

/**
 * Validates a card number using the Luhn algorithm (mod-10 check).
 * Example: isValidCardLuhn('4532123456789014') -> true
 * @param input - The card number (string or number)
 * @returns True if the card passes Luhn validation, false otherwise
 */
export const isValidCardLuhn = (input: CardInput): boolean => {
  // Handle null/undefined
  if (input == null) {
    return false;
  }

  // Convert to string and extract digits
  const digits = String(input).replace(/\D/g, "");

  // Must have at least 2 digits for Luhn check
  if (digits.length < 2) {
    return false;
  }

  // All zeros passes mod-10 but is not a real card number
  if (/^0+$/.test(digits)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  // Loop through digits from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    // Double every second digit from right
    if (isEven) {
      digit *= 2;
      // If doubling results in two digits, subtract 9
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  // Valid if sum is divisible by 10
  return sum % 10 === 0;
};

/**
 * Validates a card number for both Luhn algorithm and length.
 * Example: isValidCard('4532123456789014') -> true
 * @param input - The card number (string or number)
 * @param checkLength - Whether to also validate length (13-19 digits)
 * @returns True if the card is valid, false otherwise
 */
export const isValidCard = (
  input: CardInput,
  checkLength: boolean = true,
): boolean => {
  // Handle null/undefined
  if (input == null) {
    return false;
  }

  // Convert to string and extract digits
  const digits = String(input).replace(/\D/g, "");

  // Check length if requested (standard cards: 13-19 digits)
  if (checkLength && (digits.length < 13 || digits.length > 19)) {
    return false;
  }

  // Perform Luhn check
  return isValidCardLuhn(digits);
};
