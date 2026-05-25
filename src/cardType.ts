// cardType.ts

import type { CardInput, CardType } from "./types";

// ---------------------------------------------------------------------------
// Module-level BIN sets — allocated once, not on every call
// ---------------------------------------------------------------------------

/** Elo-specific 6-digit BINs (point check) */
const ELO_SIX_DIGIT_BINS = new Set([
  431274, 438935, 451416, 457393, 457631, 457632,
  504175, 506699, 506778, 627780, 636297, 636368,
]);

/** Elo-specific 4-digit BINs (point check) */
const ELO_FOUR_DIGIT_BINS = new Set([4011, 4312, 4389, 4514, 4573, 4576]);

/** RuPay 4-digit BINs (point check) */
const RUPAY_FOUR_DIGIT_BINS = new Set([
  6069, 6071, 6074, 6079, 6080, 6521, 6522,
]);

// ---------------------------------------------------------------------------

/**
 * Detects the card brand/type based on the card number.
 * Detection order matters — more specific / higher-priority brands are checked
 * first to avoid being shadowed by broader rules (e.g. Elo before Visa).
 *
 * Supported brands: Elo, Mir, UATP, Visa, Mastercard, Amex, Discover,
 * JCB, Diners, UnionPay, RuPay, Maestro.
 *
 * @param input - The card number (string or number)
 * @returns The detected card type or 'unknown'
 */
export const detectCardType = (input: CardInput): CardType => {
  if (input == null) return "unknown";

  const digits = String(input).replace(/\D/g, "");
  if (digits.length === 0) return "unknown";

  const firstDigit  = digits[0];
  const firstTwo    = digits.slice(0, 2);
  const firstThree  = digits.slice(0, 3);
  const firstFour   = digits.slice(0, 4);
  const bin6        = parseInt(digits.slice(0, 6), 10) || 0;
  const firstTwoNum = parseInt(firstTwo,   10) || 0;
  const firstThreeNum = parseInt(firstThree, 10) || 0;
  const firstFourNum  = parseInt(firstFour,  10) || 0;

  // ── Elo ───────────────────────────────────────────────────────────────────
  // Must come before Visa (shares 4-prefix BINs), Discover (shares 65x BINs),
  // UnionPay (shares 627780), and Maestro (shares 5-/6-prefix BINs).
  if (
    ELO_FOUR_DIGIT_BINS.has(firstFourNum) ||
    ELO_SIX_DIGIT_BINS.has(bin6)         ||
    (bin6 >= 509000 && bin6 <= 509999)   ||
    (bin6 >= 650031 && bin6 <= 650033)   ||
    (bin6 >= 650035 && bin6 <= 650051)   ||
    (bin6 >= 650405 && bin6 <= 650439)   ||
    (bin6 >= 650485 && bin6 <= 650538)   ||
    (bin6 >= 650541 && bin6 <= 650598)   ||
    (bin6 >= 650700 && bin6 <= 650718)   ||
    (bin6 >= 650720 && bin6 <= 650727)   ||
    (bin6 >= 650901 && bin6 <= 650920)   ||
    (bin6 >= 651652 && bin6 <= 651679)   ||
    (bin6 >= 655000 && bin6 <= 655019)   ||
    (bin6 >= 655021 && bin6 <= 655058)
  ) {
    return "elo";
  }

  // ── Mir ───────────────────────────────────────────────────────────────────
  // 2200–2204 — must come before Mastercard (which starts at 2221).
  if (firstFourNum >= 2200 && firstFourNum <= 2204) {
    return "mir";
  }

  // ── UATP ──────────────────────────────────────────────────────────────────
  // Universal Air Travel Plan — starts with 1, 15 digits.
  if (firstDigit === "1") {
    return "uatp";
  }

  // ── Visa ──────────────────────────────────────────────────────────────────
  if (firstDigit === "4") {
    return "visa";
  }

  // ── Mastercard ────────────────────────────────────────────────────────────
  // 51–55 or 2221–2720
  if (
    (firstTwoNum >= 51 && firstTwoNum <= 55) ||
    (firstFourNum >= 2221 && firstFourNum <= 2720)
  ) {
    return "mastercard";
  }

  // ── American Express ──────────────────────────────────────────────────────
  if (firstTwo === "34" || firstTwo === "37") {
    return "amex";
  }

  // ── RuPay ─────────────────────────────────────────────────────────────────
  // Must come before Discover: 6521/6522 share the 65-prefix with Discover.
  // Must come before Maestro: 508/606x/608x share 50/6-prefix with Maestro.
  if (firstThree === "508" || RUPAY_FOUR_DIGIT_BINS.has(firstFourNum)) {
    return "rupay";
  }

  // ── Discover ──────────────────────────────────────────────────────────────
  // 6011, 622126–622925, 644–649, 65
  if (
    firstFour === "6011"                           ||
    (bin6 >= 622126 && bin6 <= 622925)            ||
    (firstThreeNum >= 644 && firstThreeNum <= 649) ||
    firstTwo === "65"
  ) {
    return "discover";
  }

  // ── JCB ───────────────────────────────────────────────────────────────────
  if (firstFourNum >= 3528 && firstFourNum <= 3589) {
    return "jcb";
  }

  // ── Diners Club ───────────────────────────────────────────────────────────
  // 300–305, 36, 38–39
  if (
    (firstThreeNum >= 300 && firstThreeNum <= 305) ||
    firstTwo === "36" ||
    firstTwo === "38" ||
    firstTwo === "39"
  ) {
    return "diners";
  }

  // ── UnionPay ──────────────────────────────────────────────────────────────
  if (firstTwo === "62") {
    return "unionpay";
  }

  // ── Maestro ───────────────────────────────────────────────────────────────
  // 50, 56–58, or any remaining 6-prefix not already claimed above.
  if (
    firstTwo === "50"                           ||
    (firstTwoNum >= 56 && firstTwoNum <= 58)   ||
    firstDigit === "6"
  ) {
    return "maestro";
  }

  return "unknown";
};

/**
 * Gets the standard digit-grouping pattern for a card type.
 * Used by maskCardAuto to apply brand-correct spacing.
 * @param cardType - The card type
 * @returns Grouping array for the card type
 */
export const getCardTypeGrouping = (cardType: CardType): number[] => {
  switch (cardType) {
    case "amex":   return [4, 6, 5]; // 15 digits: 4-6-5
    case "diners": return [4, 6, 4]; // 14 digits: 4-6-4
    case "uatp":   return [4, 5, 6]; // 15 digits: 4-5-6
    default:       return [4, 4, 4, 4]; // 16 digits: 4-4-4-4
  }
};
