import { describe, it, expect } from "vitest";
import { maskCard } from "../src/index";

describe("maskCard", () => {
  describe("Basic functionality", () => {
    it("should mask card with default options (show last 4 digits)", () => {
      expect(maskCard("4532123456789012")).toBe("************9012");
    });

    it("should accept number input", () => {
      expect(maskCard(4532123456789012)).toBe("************9012");
    });

    it("should handle different card lengths", () => {
      expect(maskCard("378282246310005")).toBe("***********0005"); // 15 digits (Amex)
      expect(maskCard("30569309025904")).toBe("**********5904"); // 14 digits (Diners)
      expect(maskCard("6011111111111117")).toBe("************1117"); // 16 digits
      expect(maskCard("3530111333300000")).toBe("************0000"); // 16 digits (JCB)
    });
  });

  describe("Input handling", () => {
    it("should handle null input", () => {
      expect(maskCard(null as any)).toBe("");
    });

    it("should handle undefined input", () => {
      expect(maskCard(undefined as any)).toBe("");
    });

    it("should handle empty string", () => {
      expect(maskCard("")).toBe("");
    });

    it("should strip non-digit characters", () => {
      expect(maskCard("4532-1234-5678-9012")).toBe("************9012");
      expect(maskCard("4532 1234 5678 9012")).toBe("************9012");
      expect(maskCard("4532.1234.5678.9012")).toBe("************9012");
    });

    it("should handle input with only non-digits", () => {
      expect(maskCard("abcd-efgh")).toBe("");
    });
  });

  describe("maskChar option", () => {
    it("should use custom mask character", () => {
      expect(maskCard("4532123456789012", { maskChar: "•" })).toBe(
        "••••••••••••9012"
      );
    });

    it("should use X as mask character", () => {
      expect(maskCard("4532123456789012", { maskChar: "X" })).toBe(
        "XXXXXXXXXXXX9012"
      );
    });

    it("should use # as mask character", () => {
      expect(maskCard("4532123456789012", { maskChar: "#" })).toBe(
        "############9012"
      );
    });
  });

  describe("unmaskedStart option", () => {
    it("should show first 4 digits", () => {
      expect(maskCard("4532123456789012", { unmaskedStart: 4 })).toBe(
        "4532********9012"
      );
    });

    it("should show first 6 digits", () => {
      expect(maskCard("4532123456789012", { unmaskedStart: 6 })).toBe(
        "453212******9012"
      );
    });

    it("should show only first digit", () => {
      expect(
        maskCard("4532123456789012", { unmaskedStart: 1, unmaskedEnd: 0 })
      ).toBe("4***************");
    });

    it("should handle unmaskedStart larger than card length", () => {
      expect(maskCard("4532123456789012", { unmaskedStart: 20 })).toBe(
        "4532123456789012"
      );
    });
  });

  describe("unmaskedEnd option", () => {
    it("should show last 6 digits", () => {
      expect(maskCard("4532123456789012", { unmaskedEnd: 6 })).toBe(
        "**********789012"
      );
    });

    it("should show last 8 digits", () => {
      expect(maskCard("4532123456789012", { unmaskedEnd: 8 })).toBe(
        "********56789012"
      );
    });

    it("should hide all digits", () => {
      expect(
        maskCard("4532123456789012", { unmaskedStart: 0, unmaskedEnd: 0 })
      ).toBe("****************");
    });

    it("should handle unmaskedEnd larger than card length", () => {
      expect(maskCard("4532123456789012", { unmaskedEnd: 20 })).toBe(
        "4532123456789012"
      );
    });
  });

  describe("Combined unmaskedStart and unmaskedEnd", () => {
    it("should show first 4 and last 4", () => {
      expect(
        maskCard("4532123456789012", { unmaskedStart: 4, unmaskedEnd: 4 })
      ).toBe("4532********9012");
    });

    it("should show first 2 and last 2", () => {
      expect(
        maskCard("4532123456789012", { unmaskedStart: 2, unmaskedEnd: 2 })
      ).toBe("45************12");
    });

    it("should handle when unmaskedStart + unmaskedEnd equals total length", () => {
      expect(
        maskCard("4532123456789012", { unmaskedStart: 8, unmaskedEnd: 8 })
      ).toBe("4532123456789012");
    });

    it("should handle when unmaskedStart + unmaskedEnd exceeds total length", () => {
      expect(
        maskCard("4532123456789012", { unmaskedStart: 10, unmaskedEnd: 10 })
      ).toBe("4532123456789012");
    });
  });

  describe("preserveSpacing option", () => {
    it("should preserve original spacing", () => {
      expect(maskCard("4532 1234 5678 9012", { preserveSpacing: true })).toBe(
        "**** **** **** 9012"
      );
    });

    it("should preserve spacing with custom unmasked portions", () => {
      expect(
        maskCard("4532 1234 5678 9012", {
          preserveSpacing: true,
          unmaskedStart: 4,
        })
      ).toBe("4532 **** **** 9012");
    });

    it("should preserve dashes", () => {
      expect(maskCard("4532-1234-5678-9012", { preserveSpacing: true })).toBe(
        "****-****-****-9012"
      );
    });

    it("should preserve mixed separators", () => {
      expect(maskCard("4532 1234-5678.9012", { preserveSpacing: true })).toBe(
        "**** ****-****.9012"
      );
    });

    it("should handle input without spacing", () => {
      expect(maskCard("4532123456789012", { preserveSpacing: true })).toBe(
        "************9012"
      );
    });
  });

  describe("grouping option", () => {
    it("should group by 4 digits", () => {
      expect(maskCard("4532123456789012", { grouping: 4 })).toBe(
        "**** **** **** 9012"
      );
    });

    it("should use custom grouping array (Amex style)", () => {
      expect(maskCard("378282246310005", { grouping: [4, 6, 5] })).toBe(
        "**** ****** *0005"
      );
    });

    it("should use custom grouping array for regular card", () => {
      expect(maskCard("4532123456789012", { grouping: [4, 4, 4, 4] })).toBe(
        "**** **** **** 9012"
      );
    });

    it("should group by 3 digits", () => {
      expect(maskCard("4532123456789012", { grouping: 3 })).toBe(
        "*** *** *** *** 901 2"
      );
    });

    it("should handle grouping with custom mask char", () => {
      expect(maskCard("4532123456789012", { grouping: 4, maskChar: "•" })).toBe(
        "•••• •••• •••• 9012"
      );
    });

    it("should handle incomplete final group", () => {
      expect(maskCard("378282246310005", { grouping: 4 })).toBe(
        "**** **** ***0 005"
      );
    });
  });

  describe("showLength option", () => {
    it("should shorten mask when showLength is false", () => {
      expect(maskCard("4532123456789012", { showLength: false })).toBe(
        "****9012"
      );
    });

    it("should shorten mask with custom unmaskedEnd", () => {
      expect(
        maskCard("4532123456789012", { showLength: false, unmaskedEnd: 6 })
      ).toBe("****789012");
    });

    it("should shorten mask with unmaskedStart", () => {
      expect(
        maskCard("4532123456789012", { showLength: false, unmaskedStart: 4 })
      ).toBe("4532****9012");
    });

    it("should maintain full length when showLength is true (default)", () => {
      expect(maskCard("4532123456789012", { showLength: true })).toBe(
        "************9012"
      );
    });

    it("should limit shortened mask to 4 characters", () => {
      expect(maskCard("45321234567890123456", { showLength: false })).toBe(
        "****3456"
      );
    });
  });

  describe("validateInput option", () => {
    it("should validate card length (valid 16 digits)", () => {
      expect(() =>
        maskCard("4532123456789012", { validateInput: true })
      ).not.toThrow();
    });

    it("should validate card length (valid 15 digits)", () => {
      expect(() =>
        maskCard("378282246310005", { validateInput: true })
      ).not.toThrow();
    });

    it("should validate card length (valid 13 digits)", () => {
      expect(() =>
        maskCard("4532123456789", { validateInput: true })
      ).not.toThrow();
    });

    it("should throw error for too short card (12 digits)", () => {
      expect(() => maskCard("453212345678", { validateInput: true })).toThrow(
        "Invalid card number: must be 13-19 digits"
      );
    });

    it("should throw error for too long card (20 digits)", () => {
      expect(() =>
        maskCard("45321234567890123456", { validateInput: true })
      ).toThrow("Invalid card number: must be 13-19 digits");
    });

    it("should throw error for very short input", () => {
      expect(() => maskCard("123", { validateInput: true })).toThrow(
        "Invalid card number: must be 13-19 digits"
      );
    });

    it("should not validate when validateInput is false (default)", () => {
      expect(() => maskCard("123")).not.toThrow();
    });
  });

  describe("Complex scenarios", () => {
    it("should handle multiple options together", () => {
      expect(
        maskCard("4532123456789012", {
          maskChar: "•",
          unmaskedStart: 4,
          grouping: 4,
        })
      ).toBe("4532 •••• •••• 9012");
    });

    it("should combine preserveSpacing with custom mask char", () => {
      expect(
        maskCard("4532 1234 5678 9012", {
          preserveSpacing: true,
          maskChar: "X",
        })
      ).toBe("XXXX XXXX XXXX 9012");
    });

    it("should prioritize preserveSpacing over grouping", () => {
      expect(
        maskCard("4532-1234-5678-9012", {
          preserveSpacing: true,
          grouping: 4,
        })
      ).toBe("****-****-****-9012");
    });

    it("should handle all options combined", () => {
      expect(
        maskCard("4532123456789012", {
          maskChar: "#",
          unmaskedStart: 4,
          unmaskedEnd: 6,
          grouping: 4,
        })
      ).toBe("4532 #### ##78 9012");
    });
  });

  describe("Real card numbers (test cards)", () => {
    it("should mask Visa test card", () => {
      expect(maskCard("4532123456789012")).toBe("************9012");
    });

    it("should mask Mastercard test card", () => {
      expect(maskCard("5500000000000004")).toBe("************0004");
    });

    it("should mask Amex test card", () => {
      expect(maskCard("340000000000009")).toBe("***********0009");
    });

    it("should mask Discover test card", () => {
      expect(maskCard("6011000000000004")).toBe("************0004");
    });

    it("should mask JCB test card", () => {
      expect(maskCard("3530111333300000")).toBe("************0000");
    });

    it("should mask Diners Club test card", () => {
      expect(maskCard("30569309025904")).toBe("**********5904");
    });
  });

  describe("Edge cases", () => {
    it("should handle very short card number", () => {
      expect(maskCard("12345")).toBe("*2345");
    });

    it("should handle single digit", () => {
      expect(maskCard("4")).toBe("4");
    });

    it("should handle two digits", () => {
      expect(maskCard("45")).toBe("45");
    });

    it("should handle three digits", () => {
      expect(maskCard("453")).toBe("453");
    });

    it("should handle four digits (exactly unmaskedEnd default)", () => {
      expect(maskCard("4532")).toBe("4532");
    });

    it("should handle whitespace only", () => {
      expect(maskCard("   ")).toBe("");
    });

    it("should handle mixed valid and invalid characters", () => {
      expect(maskCard("45a3b2c1d2e3f4g5h6i7j8k9l0m1n2o")).toBe(
        "************9012"
      );
    });
  });
});
