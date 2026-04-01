A lightweight, zero-dependency TypeScript library for masking credit card numbers to protect sensitive payment information.

[![npm version](https://img.shields.io/npm/v/@ekaone/mask-card.svg)](https://www.npmjs.com/package/@ekaone/mask-card)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## Features

- 🔒 **PCI DSS friendly** - Defaults align with common display guidelines (last 4 digits)
- ✨ **Lightweight** - Small footprint, zero dependencies
- 📦 **TypeScript** - Full type safety and IntelliSense support
- 🎨 **Auto-format** - `maskCardAuto` picks spacing by detected card brand (Visa, Amex, Diners, etc.)
- 🏷️ **Card type detection** - `detectCardType` and `getCardTypeGrouping` for BIN-style routing
- ✅ **Luhn checks** - `isValidCardLuhn` / `isValidCard` for checksum (and optional 13–19 length)
- 📋 **Batch** - `maskCardBatch` to mask many numbers with one options object
- 🧩 **Helpers** - `getCardLast`, `getCardFirst`, `getCardLast4`, `getCardFirst6`
- ⚙️ **Flexible** - Mask character, grouping, shortened masks, preserve separators, validation
- 🎯 **Universal** - Works with major brands (Visa, Mastercard, Amex, Discover, JCB, Diners, UnionPay, Maestro)

## Installation

```bash
npm install @ekaone/mask-card
```

```bash
yarn add @ekaone/mask-card
```

```bash
pnpm add @ekaone/mask-card
```

## Quick Start

```typescript
import { maskCard } from '@ekaone/mask-card';

maskCard('4532123456789012');
// Output: '************9012'
```

## Usage Examples

### Basic Usage

```typescript
import { maskCard } from '@ekaone/mask-card';

// Default masking (shows last 4 digits)
maskCard('4532123456789012');
// Output: '************9012'

// Accepts number input
maskCard(4532123456789012);
// Output: '************9012'

// Auto-strips formatting
maskCard('4532-1234-5678-9012');
// Output: '************9012'
```

### Show Beginning Digits

Control how many digits to show at the start:

```typescript
// Show first 4 digits (card type indicator)
maskCard('4532123456789012', { unmaskedStart: 4 });
// Output: '4532********9012'

// Show first 6 digits (BIN number)
maskCard('4532123456789012', { unmaskedStart: 6 });
// Output: '453212******9012'

// Show only first digit
maskCard('4532123456789012', { unmaskedStart: 1, unmaskedEnd: 0 });
// Output: '4***************'
```

### Show Ending Digits

Control how many digits to show at the end:

```typescript
// Show last 6 digits
maskCard('4532123456789012', { unmaskedEnd: 6 });
// Output: '**********789012'

// Hide all digits (complete masking)
maskCard('4532123456789012', { unmaskedStart: 0, unmaskedEnd: 0 });
// Output: '****************'
```

### Custom Mask Character

Change the masking character from the default `*`:

```typescript
maskCard('4532123456789012', { maskChar: '•' });
// Output: '••••••••••••9012'

maskCard('4532123456789012', { maskChar: 'X' });
// Output: 'XXXXXXXXXXXX9012'

maskCard('4532123456789012', { maskChar: '#' });
// Output: '############9012'
```

### Grouping Digits

Add spacing for better readability:

```typescript
// Group by 4 digits (standard format)
maskCard('4532123456789012', { grouping: 4 });
// Output: '**** **** **** 9012'

// Amex-style grouping (4-6-5)
maskCard('378282246310005', { grouping: [4, 6, 5] });
// Output: '**** ****** *0005'

// Group by 3 digits
maskCard('4532123456789012', { grouping: 3 });
// Output: '*** *** *** *** 9012'
```

### Preserve Original Spacing

Maintain the formatting from the input:

```typescript
maskCard('4532 1234 5678 9012', { preserveSpacing: true });
// Output: '**** **** **** 9012'

maskCard('4532-1234-5678-9012', { preserveSpacing: true });
// Output: '****-****-****-9012'

maskCard('4532.1234.5678.9012', { preserveSpacing: true });
// Output: '****.****.****.9012'
```

### Shortened Mask

Show a shorter mask for compact displays:

```typescript
maskCard('4532123456789012', { showLength: false });
// Output: '****9012'

maskCard('4532123456789012', { showLength: false, unmaskedEnd: 6 });
// Output: '****789012'

maskCard('4532123456789012', { showLength: false, unmaskedStart: 4 });
// Output: '4532****9012'
```

### Input Validation

Validate card number length:

```typescript
// Valid card (13-19 digits)
maskCard('4532123456789012', { validateInput: true });
// Output: '************9012'

// Invalid card (throws error)
try {
  maskCard('123', { validateInput: true });
} catch (error) {
  console.error(error.message);
  // Output: 'Invalid card number: must be 13-19 digits'
}
```

### Combined Options

Mix and match options for custom behavior:

```typescript
maskCard('4532123456789012', {
  maskChar: '•',
  unmaskedStart: 4,
  grouping: 4
});
// Output: '4532 •••• •••• 9012'

maskCard('4532123456789012', {
  maskChar: 'X',
  unmaskedEnd: 6,
  grouping: 4
});
// Output: 'XXXX XXXX XX78 9012'
```

### Auto-format (`maskCardAuto`)

Detects the card brand from the number and applies brand-typical spacing (Amex **4-6-5**, Diners **4-6-4**, most others **4-4-4-4**). Group sizes are adjusted for PAN lengths that are not 16 digits (e.g. 13- or 19-digit numbers). You can still pass `grouping` in options to override detection. `preserveSpacing` is always turned off for this helper so the output uses normalized spaces (not the input’s dashes or spaces).

```typescript
import { maskCardAuto } from '@ekaone/mask-card';

maskCardAuto('4532123456789012');
// '**** **** **** 9012'

maskCardAuto('378282246310005');
// '**** ****** *0005'

maskCardAuto('4532123456789012', { maskChar: '•', unmaskedStart: 4 });
// '4532 •••• •••• 9012'
```

### Batch masking (`maskCardBatch`)

Applies the same `MaskCardOptions` to every element. Non-arrays or nullish inputs return an empty array.

```typescript
import { maskCardBatch } from '@ekaone/mask-card';

maskCardBatch(['4532123456789012', '5500000000000004'], { grouping: 4 });
// ['**** **** **** 9012', '**** **** **** 0004']
```

For brand-specific spacing on each row, map with `maskCardAuto` instead of a single `grouping` in batch.

### Card type detection

```typescript
import { detectCardType, getCardTypeGrouping } from '@ekaone/mask-card';

detectCardType('4532123456789012'); // 'visa'

getCardTypeGrouping('amex'); // [4, 6, 5]
```

`detectCardType` returns one of: `visa`, `mastercard`, `amex`, `discover`, `jcb`, `diners`, `unionpay`, `maestro`, or `unknown` (see `CardType` below). It ignores non-digits; empty or invalid input yields `unknown`.

### Luhn validation

```typescript
import { isValidCardLuhn, isValidCard } from '@ekaone/mask-card';

isValidCardLuhn('4532123456789014'); // true (mod-10 + formatting stripped)

isValidCard('4111111111111111'); // true — Luhn + length 13–19
isValidCard('4111111111111111', false); // true — Luhn only, skips length check

// All-zero strings fail intentionally (checksum would pass but not a real PAN)
isValidCardLuhn('0000000000000000'); // false
```

### Helpers (first / last digits)

Useful for labels, BIN display, or “last four” copy (still follow your PCI / retention policies).

```typescript
import { getCardLast, getCardFirst, getCardLast4, getCardFirst6 } from '@ekaone/mask-card';

getCardLast(4, '4532-1234-5678-9012'); // '9012'
getCardFirst(6, '4532123456789012');   // '453212'
getCardLast4('4532123456789012');      // '9012'
getCardFirst6('4532123456789012');     // '453212'

getCardLast(0, '4532123456789012');    // '' — counts ≤ 0 return ''
```

## API Reference

### `maskCard(input, options?)`

Masks a credit card number according to the provided options.

| Parameter | Description |
|---|---|
| **input** | `CardInput` — string or number; non-digits are stripped |
| **options** | `MaskCardOptions` (optional) |
| **returns** | `MaskedResult` — masked string |

#### `MaskCardOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maskChar` | `string` | `'*'` | Character used for masking |
| `unmaskedStart` | `number` | `0` | Digits to show at the start |
| `unmaskedEnd` | `number` | `4` | Digits to show at the end |
| `preserveSpacing` | `boolean` | `false` | Keep non-digit separators from the input (spaces, dashes, dots, etc.) |
| `grouping` | `number \| number[]` | `undefined` | Uniform group size (e.g. `4`) or pattern (e.g. `[4, 6, 5]`). Arrays are adjusted so the full masked length is covered |
| `showLength` | `boolean` | `true` | If `false`, collapse the middle to a short mask |
| `validateInput` | `boolean` | `false` | If `true`, require 13–19 digits or throw |

---

### `maskCardAuto(input, options?)`

Same options as `maskCard`, except `grouping` defaults from `getCardTypeGrouping(detectCardType(input))` when omitted, and `preserveSpacing` is forced to `false`.

| Parameter | Description |
|---|---|
| **input** | `CardInput` |
| **options** | `MaskCardOptions` (optional) |
| **returns** | `MaskedResult` |

---

### `maskCardBatch(cards, options?)`

| Parameter | Description |
|---|---|
| **cards** | `CardInput[]` |
| **options** | `MaskCardOptions` (optional), applied to each item |
| **returns** | `MaskedResult[]` — empty array if `cards` is missing or not an array |

---

### `detectCardType(input)`

| Parameter | Description |
|---|---|
| **input** | `CardInput` |
| **returns** | `CardType` |

---

### `getCardTypeGrouping(cardType)`

| Parameter | Description |
|---|---|
| **cardType** | `CardType` |
| **returns** | `number[]` — e.g. `[4, 6, 5]` for Amex, `[4, 6, 4]` for Diners, `[4, 4, 4, 4]` for most other labels |

---

### `getCardLast(count, input)` / `getCardFirst(count, input)`

| Parameter | Description |
|---|---|
| **count** | Positive finite number; `≤ 0` or non-finite → `''` |
| **input** | `CardInput` |
| **returns** | `string` — digits only (non-digits stripped); up to `count` from end or start |

---

### `getCardLast4(input)` / `getCardFirst6(input)`

Convenience wrappers: `getCardLast(4, input)` and `getCardFirst(6, input)`.

| Parameter | Description |
|---|---|
| **input** | `CardInput` |
| **returns** | `string` — digits only |

---

### `isValidCardLuhn(input)`

Luhn (mod 10) on digits after stripping non-digits. Requires at least two digits. Returns `false` for all-zero strings, nullish input, or failed checksum.

| Parameter | Description |
|---|---|
| **input** | `CardInput` |
| **returns** | `boolean` |

---

### `isValidCard(input, checkLength?)`

| Parameter | Description |
|---|---|
| **input** | `CardInput` |
| **checkLength** | `boolean` (default `true`) — if `true`, length must be 13–19 inclusive |
| **returns** | `boolean` |

---

### TypeScript types

```typescript
export type MaskChar = string;

export type CardType =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'jcb'
  | 'diners'
  | 'unionpay'
  | 'maestro'
  | 'unknown';

export interface MaskCardOptions {
  maskChar?: MaskChar;
  unmaskedStart?: number;
  unmaskedEnd?: number;
  preserveSpacing?: boolean;
  grouping?: number | number[];
  showLength?: boolean;
  validateInput?: boolean;
}

export type CardInput = string | number;
export type MaskedResult = string;
```

```typescript
import {
  maskCard,
  maskCardAuto,
  maskCardBatch,
  detectCardType,
  getCardTypeGrouping,
  getCardLast4,
  isValidCard,
  type MaskCardOptions,
  type CardInput,
  type CardType,
} from '@ekaone/mask-card';
```

## Real-World Use Cases

### E-commerce Checkout Display

```typescript
const cardNumber = '4532123456789012';
const maskedCard = maskCard(cardNumber);

console.log(`Payment method: Card ending in ${maskedCard.slice(-4)}`);
// Output: "Payment method: Card ending in 9012"
```

### Banking App - Card Selection

```typescript
const userCards = [
  { type: 'Visa', number: '4532123456789012' },
  { type: 'Mastercard', number: '5500000000000004' },
  { type: 'Amex', number: '378282246310005' }
];

userCards.forEach(card => {
  const masked = maskCard(card.number, { unmaskedStart: 4 });
  console.log(`${card.type}: ${masked}`);
});
// Output:
// Visa: 4532********9012
// Mastercard: 5500********0004
// Amex: 3782*******0005
```

### Receipt/Invoice Printing

```typescript
const receiptCard = '4532123456789012';
const formatted = maskCard(receiptCard, {
  maskChar: '•',
  grouping: 4
});

console.log(`Card: ${formatted}`);
// Output: "Card: •••• •••• •••• 9012"
```

### Security Levels

```typescript
function maskCardBySecurityLevel(card: string, level: 'low' | 'medium' | 'high') {
  switch (level) {
    case 'low':
      return maskCard(card, { unmaskedEnd: 8 });
    case 'medium':
      return maskCard(card, { unmaskedEnd: 4 });
    case 'high':
      return maskCard(card, { unmaskedStart: 0, unmaskedEnd: 0 });
  }
}

const card = '4532123456789012';
console.log('Low:   ', maskCardBySecurityLevel(card, 'low'));
console.log('Medium:', maskCardBySecurityLevel(card, 'medium'));
console.log('High:  ', maskCardBySecurityLevel(card, 'high'));
// Output:
// Low:    ********56789012
// Medium: ************9012
// High:   ****************
```

### Customer Service Display

```typescript
// Show more context for verification
function displayForSupport(cardNumber: string) {
  return maskCard(cardNumber, {
    unmaskedStart: 6,
    unmaskedEnd: 4,
    grouping: 4
  });
}

console.log(displayForSupport('4532123456789012'));
// Output: '4532 12** **** 9012'
```

### Audit Logging

```typescript
function logPayment(cardNumber: string, amount: number) {
  const maskedCard = maskCard(cardNumber, {
    unmaskedStart: 1,
    unmaskedEnd: 0
  });
  
  console.log(`Payment of $${amount} using card ${maskedCard}`);
}

logPayment('4532123456789012', 99.99);
// Output: "Payment of $99.99 using card 4***************"
```

## Security & Compliance

### PCI DSS Guidelines

This library follows PCI DSS (Payment Card Industry Data Security Standard) requirements for card display:

⚠️ **PCI DSS Requirement 3.3**: When displaying Primary Account Numbers (PAN):
- **Maximum visible**: First 6 digits + Last 4 digits
- **Recommended**: Last 4 digits only (default)

```typescript
// ✅ PCI Compliant (Last 4 only - Default)
maskCard('4532123456789012');
// Output: '************9012'

// ✅ PCI Compliant (Maximum allowed: First 6 + Last 4)
maskCard('4532123456789012', { unmaskedStart: 6 });
// Output: '453212******9012'

// ⚠️ Exceeds PCI recommendation (use only for non-production)
maskCard('4532123456789012', { unmaskedStart: 8, unmaskedEnd: 4 });
// Output: '45321234****9012'
```

### Security Best Practices

1. **Never log unmasked card numbers** in production
2. **Use last 4 digits** for user identification (default behavior)
3. **Enable validation** in production: `{ validateInput: true }`
4. **This library is for display only** - Never store unmasked cards
5. **Backend compliance** - Ensure your server properly handles card data

### Important Notice

🔒 **This library is designed for display, logging, and light client-side validation.** It does not:
- Store card data securely
- Tokenize cards for payment processing
- Replace server-side validation (always verify payments on your backend)
- Handle actual payment transactions by itself
- Encrypt or hash card data

**Luhn** (`isValidCardLuhn` / `isValidCard`) checks the checksum only: a passing result does not mean the account is open, has funds, or was issued. Never log full PANs in production.

This is a **pure masking utility** that works in both frontend and backend environments (Node.js, browser, serverless functions, etc.).

Always ensure your systems comply with PCI DSS requirements when handling real payment card data.

## Supported Card Types

Works with all major card brands:

```typescript
// Visa (16 digits)
maskCard('4532123456789012');
// Output: '************9012'

// Mastercard (16 digits)
maskCard('5500000000000004');
// Output: '************0004'

// American Express (15 digits)
maskCard('378282246310005');
// Output: '***********0005'

// Discover (16 digits)
maskCard('6011000000000004');
// Output: '************0004'

// JCB (16 digits)
maskCard('3530111333300000');
// Output: '************0000'

// Diners Club (14 digits)
maskCard('30569309025904');
// Output: '**********5904'
```

## Edge Cases

The library handles various edge cases gracefully:

```typescript
// Very short numbers
maskCard('1234');
// Output: '1234' (all visible when length ≤ unmaskedEnd)

// Empty input
maskCard('');
// Output: ''

// Null/undefined
maskCard(null);
// Output: ''

// Mixed characters (auto-strips non-digits)
maskCard('4532-ABCD-5678-9012');
// Output: '************9012'

// Whitespace only
maskCard('   ');
// Output: ''

// Very long numbers
maskCard('45321234567890123456789');
// Output: '*******************6789' (validates with validateInput: true)
```

## Performance

- ⚡ Lightweight: < 2KB gzipped (minified)
- 🚀 Zero dependencies
- 💨 Fast execution (< 1ms for typical cards)
- 🌳 Tree-shakeable

## Browser Support

This library works in all modern browsers and Node.js environments that support ES2015+.

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Node.js 14+

## TypeScript Support

Full TypeScript support with types exported from the package entry (see **TypeScript types** under [API Reference](#api-reference)).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Run examples
npm run example
```

## License

MIT © Eka Prasetia

## Links

- [npm Package](https://www.npmjs.com/package/@ekaone/mask-card)
- [GitHub Repository](https://github.com/ekaone/mask-card)
- [Issue Tracker](https://github.com/ekaone/mask-card/issues)

## Related Packages

- [Email masking library](https://github.com/ekaone/mask-email)
- [Token masking library](https://github.com/ekaone/mask-token)
- [Phone masking library](https://github.com/ekaone/mask-phone)

---

⭐ If this library helps you, please consider giving it a star on GitHub!
