import type { CardInput, MaskCardOptions, MaskedResult } from "./types";

/**
 * Masks a credit card number.
 * Example: '4532123456789012' -> '************9012'
 * @param input - The card number (string or number) to be masked
 * @param options - Configuration options for masking
 * @returns The masked card number string
 */
export const maskCard = (
  input: CardInput,
  options: MaskCardOptions = {}
): MaskedResult => {
  const {
    maskChar = "*",
    unmaskedStart = 0,
    unmaskedEnd = 4,
    preserveSpacing = false,
    grouping,
    showLength = true,
    validateInput = false,
  } = options;

  // Handle null/undefined input
  if (input == null) {
    return "";
  }

  // Convert input to string and store original for spacing preservation
  const original = String(input);

  // Extract only digits from input
  const digits = original.replace(/\D/g, "");

  // Return empty string if no digits found
  if (digits.length === 0) {
    return "";
  }

  // Validate card number length if requested (standard cards: 13-19 digits)
  if (validateInput && (digits.length < 13 || digits.length > 19)) {
    throw new Error("Invalid card number: must be 13-19 digits");
  }

  const totalDigits = digits.length;

  // Handle edge case: unmasked portions exceed total length
  if (unmaskedStart + unmaskedEnd > totalDigits) {
    return digits;
  }

  // Build masked string
  let masked = "";
  for (let i = 0; i < totalDigits; i++) {
    if (i < unmaskedStart || i >= totalDigits - unmaskedEnd) {
      // Show unmasked digit
      masked += digits[i];
    } else {
      // Mask digit
      masked += maskChar;
    }
  }

  // Apply shortened mask if showLength is false
  if (!showLength && unmaskedStart + unmaskedEnd < totalDigits) {
    const start = masked.slice(0, unmaskedStart);
    const end = masked.slice(totalDigits - unmaskedEnd);
    const maskLength = Math.min(4, totalDigits - unmaskedStart - unmaskedEnd);
    masked = start + maskChar.repeat(maskLength) + end;
  }

  // Preserve original spacing/separator pattern (space, hyphen, dot, etc.)
  if (preserveSpacing && /\D/.test(original)) {
    let result = "";
    let digitIndex = 0;
    for (let i = 0; i < original.length; i++) {
      if (/\d/.test(original[i])) {
        result += masked[digitIndex++];
      } else {
        result += original[i];
      }
    }
    return result;
  }

  // Apply grouping if specified
  if (grouping) {
    const groups: number[] = Array.isArray(grouping)
      ? grouping
      : Array(Math.ceil(masked.length / grouping)).fill(grouping);

    let result = "";
    let position = 0;

    for (const groupSize of groups) {
      if (position >= masked.length) break;
      if (result.length > 0) result += " ";
      result += masked.slice(position, position + groupSize);
      position += groupSize;
    }

    // Append remaining digits if any
    if (position < masked.length) {
      result += " " + masked.slice(position);
    }

    return result;
  }

  return masked;
};

export type { CardInput, MaskCardOptions, MaskedResult } from "./types";
