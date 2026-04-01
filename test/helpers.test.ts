// helpers.test.ts

import { describe, it, expect } from "vitest";
import {
  getCardLast,
  getCardFirst,
  getCardLast4,
  getCardFirst6,
} from "../src/helpers";

describe("getCardLast", () => {
  describe("Basic functionality", () => {
    it("should get last 4 digits", () => {
      expect(getCardLast(4, "4532123456789012")).toBe("9012");
    });

    it("should get last 6 digits", () => {
      expect(getCardLast(6, "4532123456789012")).toBe("789012");
    });

    it("should get last 1 digit", () => {
      expect(getCardLast(1, "4532123456789012")).toBe("2");
    });

    it("should get last 8 digits", () => {
      expect(getCardLast(8, "4532123456789012")).toBe("56789012");
    });
  });

  describe("Number input", () => {
    it("should accept number input", () => {
      expect(getCardLast(4, 4532123456789012)).toBe("9012");
    });
  });

  describe("Formatting handling", () => {
    it("should strip non-digit characters", () => {
      expect(getCardLast(4, "4532-1234-5678-9012")).toBe("9012");
      expect(getCardLast(4, "4532 1234 5678 9012")).toBe("9012");
      expect(getCardLast(4, "4532.1234.5678.9012")).toBe("9012");
    });
  });

  describe("Edge cases", () => {
    it("should handle count larger than card length", () => {
      expect(getCardLast(20, "4532123456789012")).toBe("4532123456789012");
    });

    it("should handle count equal to card length", () => {
      expect(getCardLast(16, "4532123456789012")).toBe("4532123456789012");
    });

    it("should handle very short cards", () => {
      expect(getCardLast(4, "1234")).toBe("1234");
      expect(getCardLast(2, "12")).toBe("12");
    });

    it("should handle empty input", () => {
      expect(getCardLast(4, "")).toBe("");
    });

    it("should handle null input", () => {
      expect(getCardLast(4, null as any)).toBe("");
    });

    it("should handle undefined input", () => {
      expect(getCardLast(4, undefined as any)).toBe("");
    });

    it("should handle count of 0", () => {
      expect(getCardLast(0, "4532123456789012")).toBe("");
    });

    it("should handle negative count", () => {
      expect(getCardLast(-1, "4532123456789012")).toBe("");
    });
  });

  describe("Different card types", () => {
    it("should work with 15-digit Amex", () => {
      expect(getCardLast(4, "378282246310005")).toBe("0005");
    });

    it("should work with 14-digit Diners", () => {
      expect(getCardLast(4, "30569309025904")).toBe("5904");
    });

    it("should work with 13-digit cards", () => {
      expect(getCardLast(4, "4532123456789")).toBe("6789");
    });
  });
});

describe("getCardFirst", () => {
  describe("Basic functionality", () => {
    it("should get first 4 digits", () => {
      expect(getCardFirst(4, "4532123456789012")).toBe("4532");
    });

    it("should get first 6 digits", () => {
      expect(getCardFirst(6, "4532123456789012")).toBe("453212");
    });

    it("should get first 1 digit", () => {
      expect(getCardFirst(1, "4532123456789012")).toBe("4");
    });

    it("should get first 8 digits", () => {
      expect(getCardFirst(8, "4532123456789012")).toBe("45321234");
    });
  });

  describe("Number input", () => {
    it("should accept number input", () => {
      expect(getCardFirst(6, 4532123456789012)).toBe("453212");
    });
  });

  describe("Formatting handling", () => {
    it("should strip non-digit characters", () => {
      expect(getCardFirst(6, "4532-1234-5678-9012")).toBe("453212");
      expect(getCardFirst(6, "4532 1234 5678 9012")).toBe("453212");
      expect(getCardFirst(6, "4532.1234.5678.9012")).toBe("453212");
    });
  });

  describe("Edge cases", () => {
    it("should handle count larger than card length", () => {
      expect(getCardFirst(20, "4532123456789012")).toBe("4532123456789012");
    });

    it("should handle count equal to card length", () => {
      expect(getCardFirst(16, "4532123456789012")).toBe("4532123456789012");
    });

    it("should handle very short cards", () => {
      expect(getCardFirst(4, "1234")).toBe("1234");
      expect(getCardFirst(2, "12")).toBe("12");
    });

    it("should handle empty input", () => {
      expect(getCardFirst(6, "")).toBe("");
    });

    it("should handle null input", () => {
      expect(getCardFirst(6, null as any)).toBe("");
    });

    it("should handle undefined input", () => {
      expect(getCardFirst(6, undefined as any)).toBe("");
    });

    it("should handle count of 0", () => {
      expect(getCardFirst(0, "4532123456789012")).toBe("");
    });

    it("should handle negative count", () => {
      expect(getCardFirst(-1, "4532123456789012")).toBe("");
    });
  });

  describe("Different card types", () => {
    it("should work with 15-digit Amex", () => {
      expect(getCardFirst(6, "378282246310005")).toBe("378282");
    });

    it("should work with 14-digit Diners", () => {
      expect(getCardFirst(6, "30569309025904")).toBe("305693");
    });

    it("should work with 13-digit cards", () => {
      expect(getCardFirst(6, "4532123456789")).toBe("453212");
    });
  });
});

describe("getCardLast4", () => {
  it("should get last 4 digits (convenience function)", () => {
    expect(getCardLast4("4532123456789012")).toBe("9012");
  });

  it("should work with number input", () => {
    expect(getCardLast4(4532123456789012)).toBe("9012");
  });

  it("should handle different card types", () => {
    expect(getCardLast4("378282246310005")).toBe("0005"); // Amex
    expect(getCardLast4("5500000000000004")).toBe("0004"); // Mastercard
    expect(getCardLast4("30569309025904")).toBe("5904"); // Diners
  });

  it("should strip formatting", () => {
    expect(getCardLast4("4532-1234-5678-9012")).toBe("9012");
    expect(getCardLast4("4532 1234 5678 9012")).toBe("9012");
  });

  it("should handle short numbers", () => {
    expect(getCardLast4("123")).toBe("123");
  });

  it("should handle empty input", () => {
    expect(getCardLast4("")).toBe("");
  });

  it("should handle null/undefined", () => {
    expect(getCardLast4(null as any)).toBe("");
    expect(getCardLast4(undefined as any)).toBe("");
  });
});

describe("getCardFirst6", () => {
  it("should get first 6 digits (convenience function)", () => {
    expect(getCardFirst6("4532123456789012")).toBe("453212");
  });

  it("should work with number input", () => {
    expect(getCardFirst6(4532123456789012)).toBe("453212");
  });

  it("should handle different card types", () => {
    expect(getCardFirst6("378282246310005")).toBe("378282"); // Amex
    expect(getCardFirst6("5500000000000004")).toBe("550000"); // Mastercard
    expect(getCardFirst6("30569309025904")).toBe("305693"); // Diners
  });

  it("should strip formatting", () => {
    expect(getCardFirst6("4532-1234-5678-9012")).toBe("453212");
    expect(getCardFirst6("4532 1234 5678 9012")).toBe("453212");
  });

  it("should handle short numbers", () => {
    expect(getCardFirst6("123")).toBe("123");
  });

  it("should handle empty input", () => {
    expect(getCardFirst6("")).toBe("");
  });

  it("should handle null/undefined", () => {
    expect(getCardFirst6(null as any)).toBe("");
    expect(getCardFirst6(undefined as any)).toBe("");
  });
});

describe("Combined usage", () => {
  it("should work together for card display", () => {
    const card = "4532123456789012";
    const first = getCardFirst6(card);
    const last = getCardLast4(card);

    expect(first).toBe("453212");
    expect(last).toBe("9012");
    expect(`${first}******${last}`).toBe("453212******9012");
  });

  it("should handle same card for both functions", () => {
    const cards = ["4532123456789012", "5500000000000004"];

    cards.forEach((card) => {
      const first = getCardFirst(4, card);
      const last = getCardLast(4, card);
      expect(first.length).toBe(4);
      expect(last.length).toBe(4);
    });
  });
});
