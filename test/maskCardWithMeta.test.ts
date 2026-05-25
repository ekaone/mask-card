// maskCardWithMeta.test.ts

import { describe, it, expect } from "vitest";
import { maskCardWithMeta } from "../src/maskCardWithMeta";
import { detectCardType } from "../src/cardType";
import { isValidCard } from "../src/luhn";
import { getCardFirst6, getCardLast4 } from "../src/helpers";
import { maskCardAuto } from "../src/autoFormat";

describe("maskCardWithMeta", () => {
  describe("Return shape", () => {
    it("returns all five fields for a valid Visa card", () => {
      const result = maskCardWithMeta("4532123456789014");

      expect(result).toHaveProperty("masked");
      expect(result).toHaveProperty("cardType");
      expect(result).toHaveProperty("isValid");
      expect(result).toHaveProperty("first6");
      expect(result).toHaveProperty("last4");
    });

    it("returns correct values for a valid Visa card", () => {
      const result = maskCardWithMeta("4532123456789014");

      expect(result.masked).toBe("**** **** **** 9014");
      expect(result.cardType).toBe("visa");
      expect(result.isValid).toBe(true);
      expect(result.first6).toBe("453212");
      expect(result.last4).toBe("9014");
    });

    it("returns correct values for an Amex card", () => {
      const result = maskCardWithMeta("378282246310005");

      expect(result.masked).toBe("**** ****** *0005");
      expect(result.cardType).toBe("amex");
      expect(result.first6).toBe("378282");
      expect(result.last4).toBe("0005");
    });

    it("returns correct values for a Diners card", () => {
      const result = maskCardWithMeta("30569309025904");

      expect(result.masked).toBe("**** ****** 5904");
      expect(result.cardType).toBe("diners");
      expect(result.first6).toBe("305693");
      expect(result.last4).toBe("5904");
    });

    it("returns correct values for a Mastercard", () => {
      const result = maskCardWithMeta("5500000000000004");

      expect(result.masked).toBe("**** **** **** 0004");
      expect(result.cardType).toBe("mastercard");
      expect(result.isValid).toBe(true);
      expect(result.first6).toBe("550000");
      expect(result.last4).toBe("0004");
    });
  });

  describe("Checkout scenario — replaces 4-call boilerplate", () => {
    it("single call matches manual multi-call approach", () => {
      const raw = "6011000000000004";
      const result = maskCardWithMeta(raw);

      expect(result.masked).toBe(maskCardAuto(raw));
      expect(result.cardType).toBe(detectCardType(raw));
      expect(result.isValid).toBe(isValidCard(raw));
      expect(result.first6).toBe(getCardFirst6(raw));
      expect(result.last4).toBe(getCardLast4(raw));
    });
  });

  describe("Invalid cards", () => {
    it("returns isValid: false for a card that fails Luhn", () => {
      const result = maskCardWithMeta("4532123456789012"); // bad checksum

      expect(result.isValid).toBe(false);
      expect(result.masked).toBe("**** **** **** 9012"); // still masked for display
      expect(result.cardType).toBe("visa");
    });

    it("returns empty strings for null input", () => {
      const result = maskCardWithMeta(null as any);

      expect(result.masked).toBe("");
      expect(result.first6).toBe("");
      expect(result.last4).toBe("");
    });
  });

  describe("Options forwarding", () => {
    it("forwards maskChar option to masked output", () => {
      const result = maskCardWithMeta("4532123456789014", { maskChar: "#" });

      expect(result.masked).toBe("#### #### #### 9014");
      expect(result.last4).toBe("9014"); // helpers are unaffected by options
    });

    it("forwards unmaskedStart option to masked output", () => {
      const result = maskCardWithMeta("4532123456789014", { unmaskedStart: 4 });

      expect(result.masked).toBe("4532 **** **** 9014");
    });
  });

  describe("Input formats", () => {
    it("accepts number input", () => {
      const result = maskCardWithMeta(5500000000000004);

      expect(result.cardType).toBe("mastercard");
      expect(result.last4).toBe("0004");
    });

    it("strips non-digit separators before processing", () => {
      const result = maskCardWithMeta("4532 1234-5678-9014");

      expect(result.masked).toBe("**** **** **** 9014");
      expect(result.first6).toBe("453212");
      expect(result.last4).toBe("9014");
    });
  });
});
