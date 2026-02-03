# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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