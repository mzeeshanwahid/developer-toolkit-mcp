import { describe, it, expect } from "vitest";
import { testRegex } from "../src/lib/tools/regex-tester.js";

describe("testRegex", () => {
  describe("basic matching (no flags)", () => {
    it("returns isMatch true when pattern matches", () => {
      const result = testRegex("\\d+", "hello 123", "");
      expect(result.isMatch).toBe(true);
    });

    it("returns isMatch false when pattern does not match", () => {
      const result = testRegex("\\d+", "no digits here", "");
      expect(result.isMatch).toBe(false);
    });

    it("matchCount is 1 for single non-global match", () => {
      const result = testRegex("\\d+", "abc 123 def", "");
      expect(result.matchCount).toBe(1);
    });

    it("firstMatch[0] contains the matched substring", () => {
      const result = testRegex("\\d+", "hello 42 world", "");
      expect(result.firstMatch[0]).toBe("42");
    });

    it("no match returns empty firstMatch", () => {
      const result = testRegex("xyz", "abc", "");
      expect(result.firstMatch).toEqual([]);
    });

    it("no match returns allMatches as empty array", () => {
      const result = testRegex("xyz", "abc", "");
      expect(result.allMatches).toEqual([]);
    });

    it("allMatches contains one entry for a single match", () => {
      const result = testRegex("\\d+", "foo 99 bar", "");
      expect(result.allMatches).toHaveLength(1);
    });

    it("groups is null when no named groups in pattern", () => {
      const result = testRegex("\\d+", "42", "");
      expect(result.groups).toBeNull();
    });
  });

  describe("capture groups", () => {
    it("firstMatch includes positional capture groups", () => {
      const result = testRegex("(\\d+)-(\\w+)", "42-hello", "");
      expect(result.firstMatch[1]).toBe("42");
      expect(result.firstMatch[2]).toBe("hello");
    });

    it("returns named groups when pattern has named captures", () => {
      const result = testRegex("(?<year>\\d{4})-(?<month>\\d{2})", "2024-01", "");
      expect(result.groups).not.toBeNull();
      expect(result.groups?.["year"]).toBe("2024");
      expect(result.groups?.["month"]).toBe("01");
    });
  });

  describe("global flag", () => {
    it("returns all matches with 'g' flag", () => {
      const result = testRegex("\\d+", "1 2 3 4 5", "g");
      expect(result.matchCount).toBe(5);
      expect(result.allMatches).toHaveLength(5);
    });

    it("isMatch is false when no matches with 'g' flag", () => {
      const result = testRegex("\\d+", "no digits", "g");
      expect(result.isMatch).toBe(false);
      expect(result.matchCount).toBe(0);
    });

    it("firstMatch is empty when no global matches", () => {
      const result = testRegex("xyz", "abc def", "g");
      expect(result.firstMatch).toEqual([]);
    });

    it("firstMatch returns first of multiple global matches", () => {
      const result = testRegex("\\d+", "10 20 30", "g");
      expect(result.firstMatch[0]).toBe("10");
    });

    it("collects named groups across global matches", () => {
      const result = testRegex("(?<n>\\d+)", "1 2 3", "g");
      expect(result.groups).not.toBeNull();
      expect(result.groups?.["n"]).toBeDefined();
    });
  });

  describe("case-insensitive flag", () => {
    it("matches case-insensitively with 'i' flag", () => {
      const result = testRegex("hello", "HELLO WORLD", "i");
      expect(result.isMatch).toBe(true);
    });

    it("does not match case-insensitively without 'i' flag", () => {
      const result = testRegex("hello", "HELLO WORLD", "");
      expect(result.isMatch).toBe(false);
    });
  });

  describe("error cases", () => {
    it("throws for an invalid regex pattern", () => {
      expect(() => testRegex("[invalid", "test", "")).toThrow();
    });

    it("throws for an invalid flag character", () => {
      expect(() => testRegex("\\d", "123", "z")).toThrow();
    });
  });
});
