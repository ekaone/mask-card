// maskCardBatch.test.ts

import { describe, it, expect } from "vitest";
import { maskCardBatch } from "../src/maskCardBatch";

describe("maskCardBatch", () => {
  describe("Basic functionality", () => {
    it("should mask multiple cards with default options", () => {
      const cards = ["4532123456789012", "5500000000000004", "378282246310005"];
      const result = maskCardBatch(cards);

      expect(result).toEqual([
        "************9012",
        "************0004",
        "***********0005",
      ]);
    });

    it("should accept number inputs", () => {
      const cards = [4532123456789012, 5500000000000004];
      const result = maskCardBatch(cards);

      expect(result).toEqual(["************9012", "************0004"]);
    });

    it("should accept mixed string and number inputs", () => {
      const cards = ["4532123456789012", 5500000000000004];
      const result = maskCardBatch(cards);

      expect(result).toEqual(["************9012", "************0004"]);
    });
  });

  describe("Options handling", () => {
    it("should apply same options to all cards", () => {
      const cards = ["4532123456789012", "5500000000000004"];
      const result = maskCardBatch(cards, { unmaskedStart: 4 });

      expect(result).toEqual(["4532********9012", "5500********0004"]);
    });

    it("should apply custom mask character to all cards", () => {
      const cards = ["4532123456789012", "5500000000000004"];
      const result = maskCardBatch(cards, { maskChar: "•" });

      expect(result).toEqual(["••••••••••••9012", "••••••••••••0004"]);
    });

    it("should apply grouping to all cards", () => {
      const cards = ["4532123456789012", "5500000000000004"];
      const result = maskCardBatch(cards, { grouping: 4 });

      expect(result).toEqual(["**** **** **** 9012", "**** **** **** 0004"]);
    });

    it("should apply multiple options to all cards", () => {
      const cards = ["4532123456789012", "5500000000000004"];
      const result = maskCardBatch(cards, {
        maskChar: "X",
        unmaskedStart: 4,
        grouping: 4,
      });

      expect(result).toEqual(["4532 XXXX XXXX 9012", "5500 XXXX XXXX 0004"]);
    });
  });

  describe("Edge cases", () => {
    it("should handle empty array", () => {
      expect(maskCardBatch([])).toEqual([]);
    });

    it("should handle null input", () => {
      expect(maskCardBatch(null as any)).toEqual([]);
    });

    it("should handle undefined input", () => {
      expect(maskCardBatch(undefined as any)).toEqual([]);
    });

    it("should handle array with null/undefined elements", () => {
      const cards = [
        "4532123456789012",
        null,
        undefined,
        "5500000000000004",
      ] as any;
      const result = maskCardBatch(cards);

      expect(result).toEqual(["************9012", "", "", "************0004"]);
    });

    it("should handle array with empty strings", () => {
      const cards = ["4532123456789012", "", "5500000000000004"];
      const result = maskCardBatch(cards);

      expect(result).toEqual(["************9012", "", "************0004"]);
    });

    it("should handle single card in array", () => {
      const cards = ["4532123456789012"];
      const result = maskCardBatch(cards);

      expect(result).toEqual(["************9012"]);
    });

    it("should handle large batch", () => {
      const cards = Array(100).fill("4532123456789012");
      const result = maskCardBatch(cards);

      expect(result).toHaveLength(100);
      expect(result[0]).toBe("************9012");
      expect(result[99]).toBe("************9012");
    });
  });

  describe("Different card types", () => {
    it("should mask different card brands", () => {
      const cards = [
        "4532123456789012", // Visa
        "5500000000000004", // Mastercard
        "378282246310005", // Amex
        "6011000000000004", // Discover
        "3530111333300000", // JCB
        "30569309025904", // Diners
      ];

      const result = maskCardBatch(cards);

      expect(result).toEqual([
        "************9012",
        "************0004",
        "***********0005",
        "************0004",
        "************0000",
        "**********5904",
      ]);
    });

    it("should handle cards with different lengths", () => {
      const cards = [
        "4532123456789", // 13 digits
        "30569309025904", // 14 digits
        "378282246310005", // 15 digits
        "4532123456789012", // 16 digits
      ];

      const result = maskCardBatch(cards);

      expect(result).toEqual([
        "*********6789",
        "**********5904",
        "***********0005",
        "************9012",
      ]);
    });
  });

  describe("Preserving spacing", () => {
    it("should preserve spacing for all cards", () => {
      const cards = ["4532 1234 5678 9012", "5500-0000-0000-0004"];

      const result = maskCardBatch(cards, { preserveSpacing: true });

      expect(result).toEqual(["**** **** **** 9012", "****-****-****-0004"]);
    });
  });
});
