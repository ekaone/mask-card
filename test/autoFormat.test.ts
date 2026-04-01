// autoFormat.test.ts

import { describe, it, expect } from "vitest";
import { maskCardAuto } from "../src/autoFormat";

describe("maskCardAuto", () => {
  describe("Auto-format by card type", () => {
    it("should auto-format Visa with 4-4-4-4 grouping", () => {
      expect(maskCardAuto("4532123456789012")).toBe("**** **** **** 9012");
    });

    it("should auto-format Mastercard with 4-4-4-4 grouping", () => {
      expect(maskCardAuto("5500000000000004")).toBe("**** **** **** 0004");
    });

    it("should auto-format Amex with 4-6-5 grouping", () => {
      expect(maskCardAuto("378282246310005")).toBe("**** ****** *0005");
    });

    it("should auto-format Discover with 4-4-4-4 grouping", () => {
      expect(maskCardAuto("6011000000000004")).toBe("**** **** **** 0004");
    });

    it("should auto-format JCB with 4-4-4-4 grouping", () => {
      expect(maskCardAuto("3530111333300000")).toBe("**** **** **** 0000");
    });

    it("should auto-format Diners with 4-6-4 grouping", () => {
      expect(maskCardAuto("30569309025904")).toBe("**** ****** 5904");
    });

    it("should auto-format UnionPay with 4-4-4-4 grouping", () => {
      expect(maskCardAuto("6200000000000000")).toBe("**** **** **** 0000");
    });

    it("should auto-format unknown cards with 4-4-4-4 grouping", () => {
      expect(maskCardAuto("1234567890123456")).toBe("**** **** **** 3456");
    });
  });

  describe("Number input", () => {
    it("should accept number input", () => {
      expect(maskCardAuto(4532123456789012)).toBe("**** **** **** 9012");
    });
  });

  describe("With custom options", () => {
    it("should apply custom mask character", () => {
      expect(maskCardAuto("4532123456789012", { maskChar: "•" })).toBe(
        "•••• •••• •••• 9012",
      );
    });

    it("should apply custom unmaskedStart", () => {
      expect(maskCardAuto("4532123456789012", { unmaskedStart: 4 })).toBe(
        "4532 **** **** 9012",
      );
    });

    it("should apply custom unmaskedEnd", () => {
      expect(maskCardAuto("4532123456789012", { unmaskedEnd: 6 })).toBe(
        "**** **** **78 9012",
      );
    });

    it("should combine multiple custom options", () => {
      expect(
        maskCardAuto("378282246310005", {
          maskChar: "X",
          unmaskedStart: 4,
        }),
      ).toBe("3782 XXXXXX X0005");
    });

    it("should use auto-format even with other options", () => {
      expect(
        maskCardAuto("30569309025904", {
          maskChar: "•",
          unmaskedEnd: 6,
        }),
      ).toBe("•••• ••••02 5904");
    });
  });

  describe("User grouping override", () => {
    it("should allow user to override auto-grouping", () => {
      // Amex normally uses 4-6-5, but user wants 4-4-4-4
      expect(maskCardAuto("378282246310005", { grouping: 4 })).toBe(
        "**** **** ***0 005",
      );
    });

    it("should allow custom grouping array", () => {
      expect(maskCardAuto("4532123456789012", { grouping: [6, 10] })).toBe(
        "****** ******9012",
      );
    });

    it("should respect user grouping over auto-detection", () => {
      // Visa 16-digit with Amex-style template: pattern grows the 6-field to fit (4+7+5)
      expect(maskCardAuto("4532123456789012", { grouping: [4, 6, 5] })).toBe(
        "**** ******* *9012",
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle empty input", () => {
      expect(maskCardAuto("")).toBe("");
    });

    it("should handle null input", () => {
      expect(maskCardAuto(null as any)).toBe("");
    });

    it("should handle undefined input", () => {
      expect(maskCardAuto(undefined as any)).toBe("");
    });

    it("should handle very short cards", () => {
      expect(maskCardAuto("1234")).toBe("1234");
    });

    it("should strip formatting before auto-format", () => {
      expect(maskCardAuto("4532-1234-5678-9012")).toBe("**** **** **** 9012");
    });
  });

  describe("Different card lengths", () => {
    it("should handle 13-digit cards", () => {
      expect(maskCardAuto("4532123456789")).toBe("**** **** *6789");
    });

    it("should handle 14-digit cards (Diners)", () => {
      expect(maskCardAuto("30569309025904")).toBe("**** ****** 5904");
    });

    it("should handle 15-digit cards (Amex)", () => {
      expect(maskCardAuto("378282246310005")).toBe("**** ****** *0005");
    });

    it("should handle 16-digit cards", () => {
      expect(maskCardAuto("4532123456789012")).toBe("**** **** **** 9012");
    });

    it("should handle 19-digit cards", () => {
      expect(maskCardAuto("6331101999990016123")).toBe(
        "**** **** **** ***6123",
      );
    });
  });

  describe("Comparison with regular maskCard", () => {
    it("should produce same result when grouping is manually specified", () => {
      const card = "4532123456789012";
      const auto = maskCardAuto(card);
      // Manual mask with same grouping
      const manual = "**** **** **** 9012";
      expect(auto).toBe(manual);
    });

    it("should auto-detect Amex grouping", () => {
      const card = "378282246310005";
      const auto = maskCardAuto(card);
      expect(auto).toBe("**** ****** *0005"); // Amex 4-6-5 format
    });
  });

  describe("Real-world scenarios", () => {
    it("should format for display in UI", () => {
      const cards = ["4532123456789012", "5500000000000004", "378282246310005"];

      const formatted = cards.map((card) => maskCardAuto(card));

      expect(formatted).toEqual([
        "**** **** **** 9012",
        "**** **** **** 0004",
        "**** ****** *0005",
      ]);
    });

    it("should work with custom mask for receipts", () => {
      const card = "4532123456789012";
      const receipt = maskCardAuto(card, { maskChar: "•" });
      expect(receipt).toBe("•••• •••• •••• 9012");
    });

    it("should work with first 4 visible for card selection", () => {
      const card = "378282246310005";
      const display = maskCardAuto(card, { unmaskedStart: 4 });
      expect(display).toBe("3782 ****** *0005");
    });
  });

  describe("PreserveSpacing should be ignored", () => {
    it("should use auto-format instead of preserveSpacing", () => {
      // User input with different spacing
      const card = "4532-1234-5678-9012";
      // Auto-format should override preserveSpacing
      const result = maskCardAuto(card, { preserveSpacing: true });
      // Should use auto-detected 4-4-4-4 for Visa
      expect(result).toBe("**** **** **** 9012");
    });
  });
});
