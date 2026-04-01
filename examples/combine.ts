import {
  maskCard,
  maskCardAuto,
  maskCardBatch,
  detectCardType,
  getCardTypeGrouping,
  getCardLast4,
  getCardFirst6,
  isValidCard,
  isValidCardLuhn,
} from "../src/index";

console.log("=== New API features ===\n");

// 1. maskCardAuto — brand-based grouping (Visa 4-4-4-4, Amex 4-6-5)
console.log("1. maskCardAuto (auto grouping by card brand)");
const visa = "4111111111111111";
const amex = "378282246310005";
console.log("   Visa:  ", maskCardAuto(visa));
console.log("   Amex: ", maskCardAuto(amex));
console.log(
  "   Custom mask char still works:",
  maskCardAuto(visa, { maskChar: "•" }),
);
console.log();

// 2. detectCardType + getCardTypeGrouping — inspect before masking
console.log("2. detectCardType + getCardTypeGrouping");
for (const raw of [
  visa,
  amex,
  "5500000000000004",
  "6011000000000004",
]) {
  const type = detectCardType(raw);
  const grouping = getCardTypeGrouping(type);
  console.log(`   ${raw.slice(0, 6)}… → type: ${type}, grouping: [${grouping.join(", ")}]`);
}
console.log();

// 3. maskCardBatch — same options for many inputs
console.log("3. maskCardBatch");
const batch = maskCardBatch(
  [visa, amex, "55-00-0000-0000-0004"],
  { unmaskedStart: 0, unmaskedEnd: 4 },
);
console.log("   ", batch);
console.log();

// 4. preserveSpacing — any separator (space, hyphen, dot, mixed)
console.log("4. preserveSpacing (mixed / hyphen-only separators)");
console.log(
  "   Mixed:",
  maskCard("4532 1234-5678.9012", { preserveSpacing: true }),
);
console.log(
  "   Hyphens only:",
  maskCard("4532-1234-5678-9012", { preserveSpacing: true }),
);
console.log();

// 5. Helpers — BIN and last-four without masking
console.log("5. getCardFirst6 / getCardLast4");
const pan = "4111-1111-1111-1111";
console.log("   Input: ", pan);
console.log("   First 6 (BIN):", getCardFirst6(pan));
console.log("   Last 4:       ", getCardLast4(pan));
console.log();

// 6. Luhn + full validation
console.log("6. isValidCardLuhn / isValidCard");
const validVisa = "4111111111111111";
const badCheckDigit = "4111111111111112";
console.log("   Valid Visa:          ", isValidCard(validVisa, true));
console.log("   Bad check digit:    ", isValidCard(badCheckDigit, true));
console.log("   Luhn only (no length):", isValidCardLuhn("18"));
console.log();
