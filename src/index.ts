/**
 * @file index.ts
 * @description Core entry point for @ekaone/mask-card.
 * @author Eka Prasetia
 * @website https://prasetia.me
 * @license MIT
 */

export { maskCard } from "./maskCard";
export { maskCardBatch } from "./maskCardBatch";
export { maskCardAuto } from "./autoFormat";
export { detectCardType, getCardTypeGrouping } from "./cardType";
export {
  getCardLast,
  getCardFirst,
  getCardLast4,
  getCardFirst6,
} from "./helpers";
export { isValidCardLuhn, isValidCard } from "./luhn";
export type {
  CardInput,
  MaskCardOptions,
  MaskedResult,
  CardType,
} from "./types";
