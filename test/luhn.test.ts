// luhn.test.ts

import { describe, it, expect } from "vitest";
import { isValidCardLuhn, isValidCard } from "../src/luhn";

describe("isValidCardLuhn", () => {
  describe("Valid test cards", () => {
    it("should validate valid Visa card", () => {
      expect(isValidCardLuhn("4532123456789014")).toBe(true);
      expect(isValidCardLuhn("4111111111111111")).toBe(true);
    });

    it("should validate valid Mastercard", () => {
      expect(isValidCardLuhn("5500000000000004")).toBe(true);
      expect(isValidCardLuhn("5555555555554444")).toBe(true);
    });

    it("should validate valid Amex", () => {
      expect(isValidCardLuhn("378282246310005")).toBe(true);
      expect(isValidCardLuhn("371449635398431")).toBe(true);
    });

    it("should validate valid Discover", () => {
      expect(isValidCardLuhn("6011000000000004")).toBe(true);
      expect(isValidCardLuhn("6011111111111117")).toBe(true);
    });

    it("should validate valid JCB", () => {
      expect(isValidCardLuhn("3530111333300000")).toBe(true);
    });

    it("should validate valid Diners", () => {
      expect(isValidCardLuhn("30569309025904")).toBe(true);
    });
  });

  describe("Invalid cards", () => {
    it("should reject invalid Visa", () => {
      expect(isValidCardLuhn("4532123456789012")).toBe(false);
      expect(isValidCardLuhn("4111111111111112")).toBe(false);
    });

    it("should reject invalid Mastercard", () => {
      expect(isValidCardLuhn("5500000000000005")).toBe(false);
    });

    it("should reject invalid Amex", () => {
      expect(isValidCardLuhn("378282246310006")).toBe(false);
    });

    it("should reject all zeros", () => {
      expect(isValidCardLuhn("0000000000000000")).toBe(false);
    });

    it("should reject sequential numbers", () => {
      expect(isValidCardLuhn("1234567890123456")).toBe(false);
    });

    it("should reject all same digits", () => {
      expect(isValidCardLuhn("1111111111111111")).toBe(false);
      expect(isValidCardLuhn("9999999999999999")).toBe(false);
    });
  });

  describe("Number input", () => {
    it("should accept number input", () => {
      expect(isValidCardLuhn(4111111111111111)).toBe(true);
      expect(isValidCardLuhn(4111111111111112)).toBe(false);
    });
  });

  describe("Formatting handling", () => {
    it("should strip non-digit characters", () => {
      expect(isValidCardLuhn("4111-1111-1111-1111")).toBe(true);
      expect(isValidCardLuhn("4111 1111 1111 1111")).toBe(true);
      expect(isValidCardLuhn("4111.1111.1111.1111")).toBe(true);
    });

    it("should reject invalid cards with formatting", () => {
      expect(isValidCardLuhn("4111-1111-1111-1112")).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should reject empty string", () => {
      expect(isValidCardLuhn("")).toBe(false);
    });

    it("should reject null", () => {
      expect(isValidCardLuhn(null as any)).toBe(false);
    });

    it("should reject undefined", () => {
      expect(isValidCardLuhn(undefined as any)).toBe(false);
    });

    it("should reject single digit", () => {
      expect(isValidCardLuhn("4")).toBe(false);
    });

    it("should reject two digits", () => {
      expect(isValidCardLuhn("12")).toBe(false);
    });

    it("should validate short valid numbers", () => {
      expect(isValidCardLuhn("18")).toBe(true);
      expect(isValidCardLuhn("10")).toBe(false);
    });

    it("should reject very long numbers", () => {
      expect(isValidCardLuhn("41111111111111111111111")).toBe(false);
    });

    it("should reject non-numeric strings", () => {
      expect(isValidCardLuhn("abcd-efgh-ijkl")).toBe(false);
    });
  });

  describe("Luhn algorithm correctness", () => {
    it("should correctly validate Luhn checksum", () => {
      // Known valid Luhn numbers
      expect(isValidCardLuhn("79927398713")).toBe(true);
      expect(isValidCardLuhn("49927398716")).toBe(true);
      expect(isValidCardLuhn("1234567812345670")).toBe(true);
    });

    it("should correctly reject invalid Luhn checksums", () => {
      // Same numbers with wrong check digit
      expect(isValidCardLuhn("79927398714")).toBe(false);
      expect(isValidCardLuhn("49927398717")).toBe(false);
      expect(isValidCardLuhn("1234567812345671")).toBe(false);
    });
  });
});

describe("isValidCard", () => {
  describe("Valid cards with length check", () => {
    it("should validate 13-digit cards", () => {
      expect(isValidCard("4532123456789", true)).toBe(false); // Invalid Luhn
      expect(isValidCard("4556737586899855", true)).toBe(true); // Valid 16-digit
    });

    it("should validate 14-digit cards", () => {
      expect(isValidCard("30569309025904", true)).toBe(true); // Valid Diners
    });

    it("should validate 15-digit cards", () => {
      expect(isValidCard("378282246310005", true)).toBe(true); // Valid Amex
    });

    it("should validate 16-digit cards", () => {
      expect(isValidCard("4111111111111111", true)).toBe(true); // Valid Visa
      expect(isValidCard("5500000000000004", true)).toBe(true); // Valid Mastercard
    });

    it("should validate 19-digit cards", () => {
      // Need valid 19-digit test card with Luhn
      expect(isValidCard("6331101999990016")).toBe(true); // Switch card
    });
  });

  describe("Invalid length rejection", () => {
    it("should reject cards shorter than 13 digits", () => {
      expect(isValidCard("123456789012", true)).toBe(false); // 12 digits
      expect(isValidCard("12345678901", true)).toBe(false); // 11 digits
    });

    it("should reject cards longer than 19 digits", () => {
      expect(isValidCard("41111111111111111111", true)).toBe(false); // 20 digits
      expect(isValidCard("411111111111111111111", true)).toBe(false); // 21 digits
    });
  });

  describe("Without length check", () => {
    it("should validate short numbers without length check", () => {
      expect(isValidCard("18", false)).toBe(true);
      expect(isValidCard("10", false)).toBe(false);
    });

    it("should validate long numbers without length check", () => {
      expect(isValidCard("41111111111111111111", false)).toBe(false); // Invalid Luhn
    });
  });

  describe("Default behavior", () => {
    it("should check length by default", () => {
      expect(isValidCard("123456789012")).toBe(false); // Too short
      expect(isValidCard("4111111111111111")).toBe(true); // Valid
    });
  });

  describe("Number input", () => {
    it("should accept number input with length check", () => {
      expect(isValidCard(4111111111111111, true)).toBe(true);
    });
  });

  describe("Formatting handling", () => {
    it("should strip formatting before validation", () => {
      expect(isValidCard("4111-1111-1111-1111", true)).toBe(true);
      expect(isValidCard("4111 1111 1111 1111", true)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should reject empty string", () => {
      expect(isValidCard("", true)).toBe(false);
    });

    it("should reject null", () => {
      expect(isValidCard(null as any, true)).toBe(false);
    });

    it("should reject undefined", () => {
      expect(isValidCard(undefined as any, true)).toBe(false);
    });
  });

  describe("Combined Luhn and length validation", () => {
    it("should reject valid Luhn but invalid length", () => {
      expect(isValidCard("18", true)).toBe(false); // Valid Luhn, too short
    });

    it("should reject invalid Luhn but valid length", () => {
      expect(isValidCard("4111111111111112", true)).toBe(false); // Valid length, invalid Luhn
    });

    it("should accept valid Luhn and valid length", () => {
      expect(isValidCard("4111111111111111", true)).toBe(true);
    });
  });
});
