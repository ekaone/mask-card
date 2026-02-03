import { maskCard } from "../src/index";

console.log("=== Basic Usage Examples ===\n");

// Example 1: Default behavior (show last 4 digits)
console.log("1. Default masking:");
console.log("   Input:  4532123456789012");
console.log("   Output:", maskCard("4532123456789012"));
console.log("   Result: ************9012\n");

// Example 2: Show first 4 and last 4 digits
console.log("2. Show first 4 and last 4:");
console.log("   Input:  4532123456789012");
console.log("   Output:", maskCard("4532123456789012", { unmaskedStart: 4 }));
console.log("   Result: 4532********9012\n");

// Example 3: Custom mask character
console.log("3. Custom mask character (•):");
console.log("   Input:  4532123456789012");
console.log("   Output:", maskCard("4532123456789012", { maskChar: "•" }));
console.log("   Result: ••••••••••••9012\n");

// Example 4: Group by 4 digits
console.log("4. Grouped format:");
console.log("   Input:  4532123456789012");
console.log("   Output:", maskCard("4532123456789012", { grouping: 4 }));
console.log("   Result: **** **** **** 9012\n");

// Example 5: Preserve original spacing
console.log("5. Preserve spacing:");
console.log("   Input:  4532 1234 5678 9012");
console.log(
  "   Output:",
  maskCard("4532 1234 5678 9012", { preserveSpacing: true })
);
console.log("   Result: **** **** **** 9012\n");

// Example 6: Show last 6 digits
console.log("6. Show last 6 digits:");
console.log("   Input:  4532123456789012");
console.log("   Output:", maskCard("4532123456789012", { unmaskedEnd: 6 }));
console.log("   Result: **********789012\n");

// Example 7: Hide all digits
console.log("7. Complete masking:");
console.log("   Input:  4532123456789012");
console.log(
  "   Output:",
  maskCard("4532123456789012", { unmaskedStart: 0, unmaskedEnd: 0 })
);
console.log("   Result: ****************\n");

// Example 8: Amex-style grouping
console.log("8. Amex-style grouping:");
console.log("   Input:  378282246310005");
console.log("   Output:", maskCard("378282246310005", { grouping: [4, 6, 5] }));
console.log("   Result: **** ****** *0005\n");

// Example 9: Combined options
console.log("9. Multiple options (dots + grouping):");
console.log("   Input:  4532123456789012");
console.log(
  "   Output:",
  maskCard("4532123456789012", {
    maskChar: "•",
    grouping: 4,
    unmaskedStart: 4,
  })
);
console.log("   Result: 4532 •••• •••• 9012\n");

// Example 10: Accept number input
console.log("10. Number input:");
console.log("   Input:  4532123456789012 (as number)");
console.log("   Output:", maskCard(4532123456789012));
console.log("   Result: ************9012\n");

// Example 11: Strip non-digit characters
console.log("11. Auto-strip formatting:");
console.log("   Input:  4532-1234-5678-9012");
console.log("   Output:", maskCard("4532-1234-5678-9012"));
console.log("   Result: ************9012\n");

// Example 12: Shortened mask (showLength: false)
console.log("12. Shortened mask:");
console.log("   Input:  4532123456789012");
console.log("   Output:", maskCard("4532123456789012", { showLength: false }));
console.log("   Result: ****9012\n");

console.log("=== Real-World Scenarios ===\n");

// E-commerce checkout
console.log("E-commerce Checkout Display:");
const orderCard = "4532123456789012";
console.log(`Card ending in: ${maskCard(orderCard).slice(-4)}`);
console.log(`Masked: ${maskCard(orderCard)}\n`);

// Banking app - card selection
console.log("Banking App - Card List:");
const cards = [
  { type: "Visa", number: "4532123456789012" },
  { type: "Mastercard", number: "5500000000000004" },
  { type: "Amex", number: "378282246310005" },
];

cards.forEach((card) => {
  const masked = maskCard(card.number, { unmaskedStart: 4 });
  console.log(`${card.type}: ${masked}`);
});
console.log();

// Receipt printing
console.log("Receipt Format:");
const receiptCard = "4532123456789012";
console.log(
  maskCard(receiptCard, {
    maskChar: "•",
    grouping: 4,
  })
);
console.log();

// Security levels
console.log("Dynamic Security Levels:");
const sensitiveCard = "4532123456789012";
console.log("Low security:   ", maskCard(sensitiveCard, { unmaskedEnd: 8 }));
console.log("Medium security:", maskCard(sensitiveCard, { unmaskedEnd: 4 }));
console.log("High security:  ", maskCard(sensitiveCard, { unmaskedEnd: 0 }));
