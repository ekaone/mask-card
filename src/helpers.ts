// helpers.ts

import type { CardInput } from "./types";

/**
 * Partitions length into card-style 4-wide groups (e.g. 13 → 4+4+5, 19 → 4+4+4+7).
 */
const chunkByFixedSize = (totalDigits: number, chunk: number): number[] => {
  if (totalDigits <= 0 || chunk <= 0) return [];
  if (totalDigits <= chunk) return [totalDigits];

  const out: number[] = [];
  let rem = totalDigits;

  while (rem > chunk) {
    if (rem - chunk === 1) {
      out.push(rem);
      break;
    }
    const tail = rem - chunk;
    if (tail > 0 && tail <= chunk - 1) {
      out.push(rem);
      break;
    }
    out.push(chunk);
    rem -= chunk;
  }

  if (rem > 0) {
    out.push(rem);
  }

  return out;
};

/**
 * Adjusts a grouping pattern so segment sizes sum to {@link totalDigits}.
 * Handles 4-4-4-4 style, Amex/Diners (4, n, m), and simple grow/shrink of the last group.
 */
export const normalizeGroupingPattern = (
  pattern: number[],
  totalDigits: number,
): number[] => {
  if (pattern.length === 0 || totalDigits <= 0) {
    return pattern;
  }

  if (pattern.every((g) => g === 4)) {
    return chunkByFixedSize(totalDigits, 4);
  }

  if (pattern.length === 3 && pattern[0] === 4) {
    const [a, b, c] = pattern;
    const sum = a + b + c;
    if (sum === totalDigits) {
      return [a, b, c];
    }
    if (sum < totalDigits) {
      return [a, b + (totalDigits - sum), c];
    }
    const excess = sum - totalDigits;
    if (c > excess) {
      return [a, b, c - excess];
    }
    const tail = b + c - excess;
    return tail >= 1 ? [a, tail] : [totalDigits];
  }

  let sum = pattern.reduce((x, y) => x + y, 0);
  if (sum === totalDigits) {
    return [...pattern];
  }
  if (sum < totalDigits) {
    return [
      ...pattern.slice(0, -1),
      pattern[pattern.length - 1] + (totalDigits - sum),
    ];
  }

  const out = [...pattern];
  while (sum > totalDigits && out.length > 0) {
    const need = sum - totalDigits;
    const last = out[out.length - 1];
    if (last > need) {
      out[out.length - 1] = last - need;
      break;
    }
    sum -= last;
    out.pop();
  }
  return out.filter((g) => g > 0);
};

/**
 * Extracts the last N digits from a card number.
 * Example: getCardLast(4, '4532123456789012') -> '9012'
 * @param count - Number of digits to extract from the end
 * @param input - The card number (string or number)
 * @returns The last N digits as a string
 */
export const getCardLast = (count: number, input: CardInput): string => {
  // Handle null/undefined
  if (input == null) {
    return "";
  }

  if (!Number.isFinite(count) || count <= 0) {
    return "";
  }

  // Convert to string and extract digits
  const digits = String(input).replace(/\D/g, "");

  // Return empty if no digits
  if (digits.length === 0) {
    return "";
  }

  const actualCount = Math.min(count, digits.length);
  return digits.slice(-actualCount);
};

/**
 * Extracts the first N digits from a card number.
 * Example: getCardFirst(6, '4532123456789012') -> '453212'
 * @param count - Number of digits to extract from the start
 * @param input - The card number (string or number)
 * @returns The first N digits as a string
 */
export const getCardFirst = (count: number, input: CardInput): string => {
  // Handle null/undefined
  if (input == null) {
    return "";
  }

  if (!Number.isFinite(count) || count <= 0) {
    return "";
  }

  // Convert to string and extract digits
  const digits = String(input).replace(/\D/g, "");

  // Return empty if no digits
  if (digits.length === 0) {
    return "";
  }

  const actualCount = Math.min(count, digits.length);
  return digits.slice(0, actualCount);
};

/**
 * Convenience function: Get last 4 digits (most common use case).
 * Example: getCardLast4('4532123456789012') -> '9012'
 * @param input - The card number (string or number)
 * @returns The last 4 digits as a string
 */
export const getCardLast4 = (input: CardInput): string => {
  return getCardLast(4, input);
};

/**
 * Convenience function: Get first 6 digits (BIN number).
 * Example: getCardFirst6('4532123456789012') -> '453212'
 * @param input - The card number (string or number)
 * @returns The first 6 digits as a string
 */
export const getCardFirst6 = (input: CardInput): string => {
  return getCardFirst(6, input);
};
