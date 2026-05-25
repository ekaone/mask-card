// maskCardAutoBatch.test.ts

import { describe, it, expect } from "vitest";
import { maskCardAutoBatch } from "../src/maskCardAutoBatch";
import { maskCardAuto } from "../src/autoFormat";

describe("maskCardAutoBatch", () => {
  describe("Basic functionality", () => {
    it("applies brand-aware grouping to each card independently", () => {
      const cards = [
        "4532123456789012", // Visa → 4-4-4-4
        "378282246310005",  // Amex → 4-6-5
        "30569309025904",   // Diners → 4-6-4
      ];
      const result = maskCardAutoBatch(cards);

      expect(result[0]).toBe("**** **** **** 9012");
      expect(result[1]).toBe("**** ****** *0005");
      expect(result[2]).toBe("**** ****** 5904");
    });

    it("masks standard 16-digit cards with 4-4-4-4 grouping", () => {
      const cards = [
        "4532123456789012", // Visa
        "5500000000000004", // Mastercard
        "6011000000000004", // Discover
      ];
      const result = maskCardAutoBatch(cards);

      expect(result).toEqual([
        "**** **** **** 9012",
        "**** **** **** 0004",
        "**** **** **** 0004",
      ]);
    });

    it("returns same results as cards.map(maskCardAuto)", () => {
      const cards = [
        "4532123456789012",
        "378282246310005",
        "30569309025904",
      ];
      const batch = maskCardAutoBatch(cards);
      const manual = cards.map((c) => maskCardAuto(c));

      expect(batch).toEqual(manual);
    });
  });

  describe("Options propagation", () => {
    it("applies custom maskChar to all cards", () => {
      const cards = ["4532123456789012", "378282246310005"];
      const result = maskCardAutoBatch(cards, { maskChar: "#" });

      expect(result[0]).toBe("#### #### #### 9012");
      expect(result[1]).toBe("#### ###### #0005");
    });

    it("applies unmaskedStart to all cards", () => {
      const cards = ["4532123456789012", "5500000000000004"];
      const result = maskCardAutoBatch(cards, { unmaskedStart: 4 });

      expect(result[0]).toBe("4532 **** **** 9012");
      expect(result[1]).toBe("5500 **** **** 0004");
    });

    it("user-supplied grouping overrides auto-detected grouping", () => {
      const cards = ["378282246310005"]; // Amex — auto would be [4,6,5]
      const result = maskCardAutoBatch(cards, { grouping: 4 });

      // 15 digits with uniform groups of 4: ****|****|***0|005
      expect(result[0]).toBe("**** **** ***0 005");
    });
  });

  describe("Edge cases", () => {
    it("returns empty array for empty input", () => {
      expect(maskCardAutoBatch([])).toEqual([]);
    });

    it("returns empty array for null input", () => {
      expect(maskCardAutoBatch(null as any)).toEqual([]);
    });

    it("returns empty array for undefined input", () => {
      expect(maskCardAutoBatch(undefined as any)).toEqual([]);
    });

    it("handles null/undefined elements in the array", () => {
      const cards = ["4532123456789012", null, undefined, "5500000000000004"] as any;
      const result = maskCardAutoBatch(cards);

      expect(result[0]).toBe("**** **** **** 9012");
      expect(result[1]).toBe("");
      expect(result[2]).toBe("");
      expect(result[3]).toBe("**** **** **** 0004");
    });

    it("handles a single card in array", () => {
      const result = maskCardAutoBatch(["4532123456789012"]);
      expect(result).toEqual(["**** **** **** 9012"]);
    });

    it("handles number inputs", () => {
      const result = maskCardAutoBatch([4532123456789012, 5500000000000004]);
      expect(result[0]).toBe("**** **** **** 9012");
      expect(result[1]).toBe("**** **** **** 0004");
    });
  });
});
