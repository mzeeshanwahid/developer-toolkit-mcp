import { describe, it, expect } from "vitest";
import { baseConverter } from "../src/lib/tools/base-converter.js";

describe("baseConverter", () => {
  describe("valid conversions", () => {
    it("converts decimal to binary", () => {
      expect(baseConverter("10", 10, 2)).toBe("1010");
    });

    it("converts binary to decimal", () => {
      expect(baseConverter("1010", 2, 10)).toBe("10");
    });

    it("converts decimal to hexadecimal", () => {
      expect(baseConverter("255", 10, 16)).toBe("FF");
    });

    it("converts hexadecimal to decimal", () => {
      expect(baseConverter("FF", 16, 10)).toBe("255");
    });

    it("converts decimal to octal", () => {
      expect(baseConverter("8", 10, 8)).toBe("10");
    });

    it("converts octal to decimal", () => {
      expect(baseConverter("10", 8, 10)).toBe("8");
    });

    it("converts binary to hexadecimal", () => {
      expect(baseConverter("11111111", 2, 16)).toBe("FF");
    });

    it("converts hex to binary", () => {
      expect(baseConverter("A", 16, 2)).toBe("1010");
    });

    it("handles uppercase hex input", () => {
      expect(baseConverter("FF", 16, 10)).toBe("255");
    });

    it("handles lowercase hex input", () => {
      expect(baseConverter("ff", 16, 10)).toBe("255");
    });

    it("converts 0 in any base", () => {
      expect(baseConverter("0", 10, 2)).toBe("0");
    });

    it("converts from base 36", () => {
      expect(baseConverter("Z", 36, 10)).toBe("35");
    });

    it("converts to base 36", () => {
      expect(baseConverter("35", 10, 36)).toBe("Z");
    });

    it("result is always uppercase", () => {
      const result = baseConverter("255", 10, 16);
      expect(result).toBe(result.toUpperCase());
    });
  });

  describe("error cases", () => {
    it("throws when 'from' base is less than 2", () => {
      expect(() => baseConverter("1", 1, 10)).toThrow("Base must be between 2 and 36");
    });

    it("throws when 'to' base is greater than 36", () => {
      expect(() => baseConverter("1", 10, 37)).toThrow("Base must be between 2 and 36");
    });

    it("throws when 'from' base is 0", () => {
      expect(() => baseConverter("1", 0, 10)).toThrow("Base must be between 2 and 36");
    });

    it("throws when 'to' base is less than 2", () => {
      expect(() => baseConverter("1", 10, 1)).toThrow("Base must be between 2 and 36");
    });

    it("throws when value is invalid for the given base", () => {
      expect(() => baseConverter("2", 2, 10)).toThrow(/Invalid value "2" for base 2/);
    });

    it("throws when hex chars used in decimal input", () => {
      expect(() => baseConverter("GG", 10, 16)).toThrow(/Invalid value/);
    });

    it("throws for non-numeric string in base 10", () => {
      expect(() => baseConverter("xyz", 10, 2)).toThrow(/Invalid value/);
    });
  });
});
