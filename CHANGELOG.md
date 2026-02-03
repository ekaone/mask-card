# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-29

### Added
- Initial release
- `maskEmail()` function with customizable options
- Support for custom mask characters
- Support for custom visible character count
- Domain masking feature
- Viewable mode for conditional masking
- Full TypeScript support with type definitions
- Zero dependencies
- Dual package support (CommonJS + ESM)
- Comprehensive documentation

### Features
- **maskChar**: Customize the masking character (default: `*`)
- **visibleChars**: Control how many characters remain visible (default: `2`)
- **maskDomain**: Option to mask domain part of email (default: `false`)
- **viewable**: Return original email without masking (default: `false`)

### Security
- Input validation to prevent crashes
- Handles edge cases (null, undefined, invalid emails)
- Privacy-focused email masking