A lightweight, zero-dependency TypeScript library for masking credit card numbers to protect sensitive payment information.

[![npm version](https://img.shields.io/npm/v/@ekaone/mask-card.svg)](https://www.npmjs.com/package/@ekaone/mask-card)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@ekaone/mask-card)](https://bundlephobia.com/package/@ekaone/mask-card)

## Features

🔒 **PCI DSS Compliant** - Follows payment card industry standards
✨ **Lightweight** - Under 2KB, zero dependencies
📦 **TypeScript** - Full type safety and IntelliSense support
⚙️ **Flexible** - Extensive customization options
🎯 **Universal** - Supports all card types (Visa, Mastercard, Amex, JCB, etc.)
🚀 **Simple API** - Easy to use with sensible defaults

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

## API Reference

### `maskCard(input, options?)`

Masks a credit card number according to the provided options.

#### Parameters

- **input** (`string | number`) - The card number to mask
- **options** (`MaskCardOptions`, optional) - Configuration options

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maskChar` | `string` | `'*'` | Character used for masking |
| `unmaskedStart` | `number` | `0` | Number of digits to show at the beginning |
| `unmaskedEnd` | `number` | `4` | Number of digits to show at the end |
| `preserveSpacing` | `boolean` | `false` | Maintain original spacing/formatting from input |
| `grouping` | `number \| number[]` | `undefined` | Add spacing in output (number for uniform, array for custom) |
| `showLength` | `boolean` | `true` | Maintain original digit count in output |
| `validateInput` | `boolean` | `false` | Validate if input looks like valid card number (13-19 digits) |

#### Returns

- (`string`) - The masked card number

#### TypeScript Types

```typescript
export type MaskChar = string;

export interface MaskCardOptions {
  /** Character to use for masking (default: '*') */
  maskChar?: string;
  
  /** Number of digits to show at the beginning (default: 0) */
  unmaskedStart?: number;
  
  /** Number of digits to show at the end (default: 4) */
  unmaskedEnd?: number;
  
  /** Maintain original spacing/formatting from input (default: false) */
  preserveSpacing?: boolean;
  
  /** Add spacing in output (default: undefined) */
  grouping?: number | number[];
  
  /** Maintain original digit count in output (default: true) */
  showLength?: boolean;
  
  /** Validate if input looks like valid card number (default: false) */
  validateInput?: boolean;
}

export type CardInput = string | number;

export type MaskedResult = string;
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

🔒 **This library is designed for display and logging purposes.** It does not:
- Store card data securely
- Tokenize cards for payment processing
- Validate card authenticity (Luhn algorithm)
- Handle actual payment transactions
- Encrypt or hash card data

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

- ⚡ Lightweight: < 2KB minified + gzipped
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

Full TypeScript support with comprehensive type definitions included.

```typescript
import { maskCard, type MaskCardOptions, type CardInput } from '@ekaone/mask-card';

const options: MaskCardOptions = {
  maskChar: '•',
  unmaskedEnd: 4,
  grouping: 4
};

const card: CardInput = '4532123456789012';
const masked: string = maskCard(card, options);
```

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

- [@ekaone/mask-card](https://www.npmjs.com/package/@ekaone/mask-card) - Credit card masking library
