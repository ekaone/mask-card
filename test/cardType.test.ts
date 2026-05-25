// cardType.test.ts

import { describe, it, expect } from "vitest";
import { detectCardType, getCardTypeGrouping } from "../src/cardType";

describe("detectCardType", () => {
  describe("Visa detection", () => {
    it("should detect Visa cards (starts with 4)", () => {
      expect(detectCardType("4532123456789012")).toBe("visa");
      expect(detectCardType("4111111111111111")).toBe("visa");
      expect(detectCardType("4000000000000000")).toBe("visa");
    });

    it("should detect Visa with number input", () => {
      expect(detectCardType(4532123456789012)).toBe("visa");
    });

    it("should detect Visa with formatting", () => {
      expect(detectCardType("4532-1234-5678-9012")).toBe("visa");
      expect(detectCardType("4532 1234 5678 9012")).toBe("visa");
    });
  });

  describe("Mastercard detection", () => {
    it("should detect Mastercard (51-55)", () => {
      expect(detectCardType("5100000000000000")).toBe("mastercard");
      expect(detectCardType("5500000000000004")).toBe("mastercard");
      expect(detectCardType("5599999999999999")).toBe("mastercard");
    });

    it("should detect Mastercard (2221-2720)", () => {
      expect(detectCardType("2221000000000000")).toBe("mastercard");
      expect(detectCardType("2720000000000000")).toBe("mastercard");
      expect(detectCardType("2500000000000000")).toBe("mastercard");
    });
  });

  describe("American Express detection", () => {
    it("should detect Amex (34 or 37)", () => {
      expect(detectCardType("378282246310005")).toBe("amex");
      expect(detectCardType("371449635398431")).toBe("amex");
      expect(detectCardType("340000000000009")).toBe("amex");
    });
  });

  describe("Discover detection", () => {
    it("should detect Discover (6011)", () => {
      expect(detectCardType("6011000000000004")).toBe("discover");
      expect(detectCardType("6011111111111117")).toBe("discover");
    });

    it("should detect Discover (622126-622925)", () => {
      expect(detectCardType("6221260000000000")).toBe("discover");
      expect(detectCardType("6229250000000000")).toBe("discover");
    });

    it("should detect Discover (644-649)", () => {
      expect(detectCardType("6440000000000000")).toBe("discover");
      expect(detectCardType("6490000000000000")).toBe("discover");
    });

    it("should detect Discover (65)", () => {
      expect(detectCardType("6500000000000000")).toBe("discover");
      expect(detectCardType("6599999999999999")).toBe("discover");
    });
  });

  describe("JCB detection", () => {
    it("should detect JCB (3528-3589)", () => {
      expect(detectCardType("3530111333300000")).toBe("jcb");
      expect(detectCardType("3528000000000000")).toBe("jcb");
      expect(detectCardType("3589000000000000")).toBe("jcb");
    });
  });

  describe("Diners Club detection", () => {
    it("should detect Diners (300-305)", () => {
      expect(detectCardType("30000000000000")).toBe("diners");
      expect(detectCardType("30569309025904")).toBe("diners");
      expect(detectCardType("30500000000000")).toBe("diners");
    });

    it("should detect Diners (36)", () => {
      expect(detectCardType("36000000000000")).toBe("diners");
      expect(detectCardType("36999999999999")).toBe("diners");
    });

    it("should detect Diners (38-39)", () => {
      expect(detectCardType("38000000000000")).toBe("diners");
      expect(detectCardType("39000000000000")).toBe("diners");
    });
  });

  describe("UnionPay detection", () => {
    it("should detect UnionPay (starts with 62)", () => {
      expect(detectCardType("6200000000000000")).toBe("unionpay");
      expect(detectCardType("6280000000000000")).toBe("unionpay");
    });

    it("should not conflict with Discover 622126-622925", () => {
      expect(detectCardType("6221260000000000")).toBe("discover");
      expect(detectCardType("6220000000000000")).toBe("unionpay");
    });
  });

  describe("Maestro detection", () => {
    it("should detect Maestro (50)", () => {
      expect(detectCardType("5000000000000000")).toBe("maestro");
    });

    it("should detect Maestro (56-58)", () => {
      expect(detectCardType("5600000000000000")).toBe("maestro");
      expect(detectCardType("5700000000000000")).toBe("maestro");
      expect(detectCardType("5800000000000000")).toBe("maestro");
    });

    it("should detect Maestro (starts with 6, not Discover/UnionPay)", () => {
      expect(detectCardType("6300000000000000")).toBe("maestro");
    });
  });

  describe("Elo detection", () => {
    it("should detect Elo by 4-digit BIN (4011, 4312, 4389, 4514, 4573, 4576)", () => {
      expect(detectCardType("4011000000000000")).toBe("elo");
      expect(detectCardType("4312000000000000")).toBe("elo");
      expect(detectCardType("4389000000000000")).toBe("elo");
      expect(detectCardType("4514000000000000")).toBe("elo");
      expect(detectCardType("4573000000000000")).toBe("elo");
      expect(detectCardType("4576000000000000")).toBe("elo");
    });

    it("should detect Elo by specific 6-digit BIN (431274, 438935, 636297, 636368…)", () => {
      expect(detectCardType("4312740000000000")).toBe("elo");
      expect(detectCardType("4389350000000000")).toBe("elo");
      expect(detectCardType("6362970000000000")).toBe("elo");
      expect(detectCardType("6363680000000000")).toBe("elo");
      expect(detectCardType("6277800000000000")).toBe("elo"); // 627780 — overlaps UnionPay 62-prefix
    });

    it("should detect Elo by 6-digit BIN range (509000-509999)", () => {
      expect(detectCardType("5090000000000000")).toBe("elo");
      expect(detectCardType("5099990000000000")).toBe("elo");
    });

    it("should detect Elo by 6-digit BIN range (650031-650051, 655000-655058…)", () => {
      expect(detectCardType("6500310000000000")).toBe("elo"); // 650031 — overlaps Discover 65-prefix
      expect(detectCardType("6550000000000000")).toBe("elo"); // 655000
      expect(detectCardType("6550580000000000")).toBe("elo"); // 655058
    });

    it("should NOT detect Elo for non-Elo 65xx cards (Discover)", () => {
      // 650000 is below the first Elo range (650031); Discover catches it via 65-prefix
      expect(detectCardType("6500000000000000")).toBe("discover");
      expect(detectCardType("6599999999999999")).toBe("discover");
    });
  });

  describe("Mir detection", () => {
    it("should detect Mir (2200-2204)", () => {
      expect(detectCardType("2200000000000000")).toBe("mir");
      expect(detectCardType("2201000000000000")).toBe("mir");
      expect(detectCardType("2204000000000000")).toBe("mir");
    });

    it("should NOT detect Mir for 2205+ (falls to unknown, not Mastercard)", () => {
      expect(detectCardType("2205000000000000")).toBe("unknown");
    });

    it("should NOT overlap with Mastercard (2221-2720)", () => {
      expect(detectCardType("2221000000000000")).toBe("mastercard");
      expect(detectCardType("2199000000000000")).toBe("unknown");
    });
  });

  describe("UATP detection", () => {
    it("should detect UATP (starts with 1)", () => {
      expect(detectCardType("123456789012345")).toBe("uatp");
      expect(detectCardType("100000000000000")).toBe("uatp");
      expect(detectCardType("199999999999999")).toBe("uatp");
    });

    it("should detect UATP with formatting", () => {
      expect(detectCardType("1234 56789 012345")).toBe("uatp");
    });
  });

  describe("RuPay detection", () => {
    it("should detect RuPay by 3-digit BIN (508)", () => {
      expect(detectCardType("5080000000000000")).toBe("rupay");
      expect(detectCardType("5089999999999999")).toBe("rupay");
    });

    it("should detect RuPay by 4-digit BIN (6069, 6071, 6074, 6079, 6080, 6521, 6522)", () => {
      expect(detectCardType("6069000000000000")).toBe("rupay");
      expect(detectCardType("6071000000000000")).toBe("rupay");
      expect(detectCardType("6074000000000000")).toBe("rupay");
      expect(detectCardType("6079000000000000")).toBe("rupay");
      expect(detectCardType("6080000000000000")).toBe("rupay");
      expect(detectCardType("6521000000000000")).toBe("rupay");
      expect(detectCardType("6522000000000000")).toBe("rupay");
    });

    it("should NOT conflict with Maestro for non-RuPay 50/6-prefix cards", () => {
      expect(detectCardType("5000000000000000")).toBe("maestro"); // 50, not 508
      expect(detectCardType("6300000000000000")).toBe("maestro"); // 6-prefix, not RuPay BIN
    });
  });

  describe("Unknown cards", () => {
    it("should return unknown for unrecognized patterns", () => {
      // Note: 1-prefix is now UATP; use 9- and 0-prefix for unknown
      expect(detectCardType("9999999999999999")).toBe("unknown");
      expect(detectCardType("0000000000000000")).toBe("unknown");
    });

    it("should return unknown for invalid inputs", () => {
      expect(detectCardType("")).toBe("unknown");
      expect(detectCardType(null as any)).toBe("unknown");
      expect(detectCardType(undefined as any)).toBe("unknown");
    });

    it("should return unknown for non-digit strings", () => {
      expect(detectCardType("abcd-efgh-ijkl")).toBe("unknown");
    });
  });

  describe("Edge cases", () => {
    it("should handle very short numbers", () => {
      expect(detectCardType("4")).toBe("visa");
      expect(detectCardType("5")).toBe("unknown");
    });

    it("should handle very long numbers", () => {
      expect(detectCardType("45321234567890123456")).toBe("visa");
    });

    it("should strip formatting before detection", () => {
      expect(detectCardType("4532-1234-5678-9012")).toBe("visa");
      expect(detectCardType("3782 8224 6310 005")).toBe("amex");
    });
  });
});

describe("getCardTypeGrouping", () => {
  it("should return Amex grouping (4-6-5)", () => {
    expect(getCardTypeGrouping("amex")).toEqual([4, 6, 5]);
  });

  it("should return Diners grouping (4-6-4)", () => {
    expect(getCardTypeGrouping("diners")).toEqual([4, 6, 4]);
  });

  it("should return standard grouping (4-4-4-4) for Visa", () => {
    expect(getCardTypeGrouping("visa")).toEqual([4, 4, 4, 4]);
  });

  it("should return standard grouping for Mastercard", () => {
    expect(getCardTypeGrouping("mastercard")).toEqual([4, 4, 4, 4]);
  });

  it("should return standard grouping for Discover", () => {
    expect(getCardTypeGrouping("discover")).toEqual([4, 4, 4, 4]);
  });

  it("should return standard grouping for JCB", () => {
    expect(getCardTypeGrouping("jcb")).toEqual([4, 4, 4, 4]);
  });

  it("should return standard grouping for UnionPay", () => {
    expect(getCardTypeGrouping("unionpay")).toEqual([4, 4, 4, 4]);
  });

  it("should return standard grouping for Maestro", () => {
    expect(getCardTypeGrouping("maestro")).toEqual([4, 4, 4, 4]);
  });

  it("should return standard grouping for unknown", () => {
    expect(getCardTypeGrouping("unknown")).toEqual([4, 4, 4, 4]);
  });

  it("should return UATP grouping (4-5-6)", () => {
    expect(getCardTypeGrouping("uatp")).toEqual([4, 5, 6]);
  });

  it("should return standard grouping (4-4-4-4) for Elo", () => {
    expect(getCardTypeGrouping("elo")).toEqual([4, 4, 4, 4]);
  });

  it("should return standard grouping (4-4-4-4) for Mir", () => {
    expect(getCardTypeGrouping("mir")).toEqual([4, 4, 4, 4]);
  });

  it("should return standard grouping (4-4-4-4) for RuPay", () => {
    expect(getCardTypeGrouping("rupay")).toEqual([4, 4, 4, 4]);
  });
});
