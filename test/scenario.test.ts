import { describe, it, expect } from "vitest";
import {
  detectCardType,
  getCardTypeGrouping,
  getCardFirst6,
  getCardLast4,
  isValidCard,
  isValidCardLuhn,
  maskCard,
  maskCardAuto,
  maskCardBatch,
} from "../src/index";

/**
 * Scenario-style tests: combine multiple public APIs the way an app might
 * (detect brand → validate → derive safe display / audit fields).
 */
describe("scenarios", () => {
  describe("checkout: detect, validate, show masked preview", () => {
    it("uses the same last4 in helpers and auto-masked output", () => {
      const raw = "4532 1234-5678-9014";
      const digitsOnly = raw.replace(/\D/g, "");

      expect(detectCardType(raw)).toBe("visa");
      expect(isValidCard(digitsOnly)).toBe(true);

      const last4 = getCardLast4(raw);
      expect(last4).toBe("9014");
      expect(maskCardAuto(raw)).toContain(last4);
      expect(maskCardAuto(raw)).toBe("**** **** **** 9014");
    });

    it("applies Amex-specific grouping after detection", () => {
      const raw = "3782 822463-10005";
      expect(detectCardType(raw)).toBe("amex");
      expect(getCardTypeGrouping("amex")).toEqual([4, 6, 5]);
      expect(maskCardAuto(raw)).toBe("**** ****** *0005");
    });
  });

  describe("support / audit: BIN + last4 alongside full mask", () => {
    it("builds internal references without exposing the full PAN", () => {
      const raw = "6011000000000004";
      const bin = getCardFirst6(raw);
      const last4 = getCardLast4(raw);
      const display = maskCardAuto(raw);

      expect(detectCardType(raw)).toBe("discover");
      expect(bin).toBe("601100");
      expect(last4).toBe("0004");
      expect(display).toBe("**** **** **** 0004");
      expect(display.includes(bin)).toBe(false);
    });
  });

  describe("bulk redaction: batch API + per-card brand detection", () => {
    it("maskCardBatch preserves last4; pairing with detectCard explains formatting choices", () => {
      const cards = [
        "4532123456789014",
        "378282246310005",
        "30569309025904",
      ] as const;
      const masked = maskCardBatch([...cards], { maskChar: "#" });

      expect(masked).toHaveLength(3);
      expect(detectCardType(cards[0])).toBe("visa");
      expect(detectCardType(cards[1])).toBe("amex");
      expect(detectCardType(cards[2])).toBe("diners");

      cards.forEach((pan, i) => {
        expect(getCardLast4(pan)).toBe(getCardLast4(masked[i]));
      });

      expect(masked[0]).toBe("############9014");
      expect(masked[1]).toBe("###########0005");
      expect(masked[2]).toBe("##########5904");
    });

    it("export-style pipeline: each row uses maskCardAuto for brand-aware spacing", () => {
      const cards = [
        "4532123456789014",
        "378282246310005",
        "30569309025904",
      ] as const;
      const masked = cards.map((pan) => maskCardAuto(pan, { maskChar: "#" }));

      expect(masked[0]).toBe("#### #### #### 9014");
      expect(masked[1]).toBe("#### ###### #0005");
      expect(masked[2]).toBe("#### ###### 5904");
    });
  });

  describe("invalid checksum: still mask for display", () => {
    it("does not pass Luhn but auto-format masking still works", () => {
      const raw = "4532123456789012";
      expect(isValidCardLuhn(raw)).toBe(false);
      expect(maskCardAuto(raw)).toBe("**** **** **** 9012");
    });
  });

  describe("explicit grouping matches auto-format default", () => {
    it("maskCard + getCardTypeGrouping mirrors maskCardAuto for Visa", () => {
      const pan = "5500000000000004";
      const type = detectCardType(pan);
      const grouping = getCardTypeGrouping(type);

      expect(
        maskCard(pan, { grouping, preserveSpacing: false }),
      ).toBe(maskCardAuto(pan));
    });

    it("maskCard + getCardTypeGrouping mirrors maskCardAuto for Diners", () => {
      const pan = "30569309025904";
      const type = detectCardType(pan);
      const grouping = getCardTypeGrouping(type);

      expect(
        maskCard(pan, { grouping, preserveSpacing: false }),
      ).toBe(maskCardAuto(pan));
    });
  });

  describe("validation gate before persist", () => {
    it("skips treating a too-short number as a saveable card", () => {
      const raw = "424242";
      expect(isValidCard(raw)).toBe(false);
      expect(() => maskCard(raw, { validateInput: true })).toThrow(
        "Invalid card number: must be 13-19 digits",
      );
    });
  });
});
