# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2026-05-25

### Added
- `maskCardAutoBatch()` — batch masking with per-card brand detection; each card automatically gets its correct grouping (Amex: 4-6-5, Diners: 4-6-4, standard: 4-4-4-4)
- `maskCardWithMeta()` — composite result function returning `{ masked, cardType, isValid, first6, last4 }` in one call, replacing the common 4-function boilerplate in checkout and audit flows
- `CardMaskResult` interface exported from package root for typed destructuring of `maskCardWithMeta` results

### Changed
- `maskCard()` now throws a descriptive error when `maskChar` is not exactly one character, preventing silent visual misalignment in grouped output

### Fixed
- Added missing CHANGELOG entries for v1.1.0 and v1.1.1

---

## [1.1.1] - 2026-03-01

### Added
- Scenario-style integration tests covering checkout, audit, bulk redaction, and validation gate flows
- `.cursor/skills/mask-card/SKILL.md` — project scope and maintenance guidelines
- `examples/basic.ts` and `examples/combine.ts` — runnable usage examples

### Changed
- CI workflow pins pnpm version for reproducible installs

---

## [1.1.0] - 2026-02-15

### Added
- `maskCardAuto()` — auto-detects card brand and applies brand-specific grouping (Amex: 4-6-5, Diners: 4-6-4, standard: 4-4-4-4)
- `maskCardBatch()` — mask an array of cards with the same options in one call
- `detectCardType()` — returns the card brand (`"visa"`, `"mastercard"`, `"amex"`, etc.) from the card number
- `getCardTypeGrouping()` — returns the standard digit grouping array for a given brand
- `isValidCardLuhn()` — Luhn (mod-10) checksum validation
- `isValidCard()` — Luhn + optional length check (13–19 digits)
- `getCardFirst6()` — extracts the 6-digit BIN/IIN from a card number
- `getCardLast4()` — extracts the last 4 digits (most common display identifier)
- `getCardFirst()` / `getCardLast()` — generic first/last N digit helpers
- `CardType` union type and `getCardTypeGrouping` exported from package root
- Support for 8 card brands: Visa, Mastercard, Amex, Discover, JCB, Diners Club, UnionPay, Maestro

---

## [1.0.0] - 2026-02-03

### Added
- Initial release of `@ekaone/mask-card`
- `maskCard()` function for masking credit card numbers
- Support for `string` and `number` inputs
- Custom mask character (`maskChar`, default: `*`)
- Control of visible digits at the beginning (`unmaskedStart`)
- Control of visible digits at the end (`unmaskedEnd`, default: `4`)
- Option to preserve original separators/spacing (`preserveSpacing`)
- Configurable digit grouping (`grouping` as number or array)
- Shortened mask output while keeping context (`showLength`)
- Optional input length validation for card-like numbers (`validateInput`)
- Full TypeScript support with exported types (`MaskCardOptions`, `CardInput`, `MaskedResult`)
- Zero dependencies and tree-shakeable build
- Dual package support (CommonJS + ESM) with proper `exports` map
- Comprehensive README with API docs, examples, and PCI DSS notes

### Features
- **maskChar**: Customize the masking character used for hidden digits
- **unmaskedStart**: Number of digits to show at the beginning of the card number
- **unmaskedEnd**: Number of digits to show at the end of the card number
- **preserveSpacing**: Maintain original spacing/formatting from the input (spaces, dashes, dots, etc.)
- **grouping**: Add spacing to the masked output using uniform groups (e.g. `4`) or custom patterns (e.g. `[4, 6, 5]`)
- **showLength**: Toggle between full-length masking and a shortened mask with fewer mask characters
- **validateInput**: Validate that the input length looks like a real card (13–19 digits), throwing a descriptive error otherwise

### Security & Compliance
- Follows PCI DSS recommendation to show at most first 6 and last 4 digits
- Encourages using last 4 digits only as a safe default
- Avoids logging or storing unmasked card numbers in examples and documentation
- Handles edge cases safely (null/undefined, empty/whitespace, non-digit characters)
- Designed strictly as a display/masking utility (no storage, tokenization, or encryption)