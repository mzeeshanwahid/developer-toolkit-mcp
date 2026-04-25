import { describe, it, expect } from "vitest";
import { convertTimestamp } from "../src/lib/tools/timestamp-converter.js";

// A known fixed epoch: 2021-01-01T00:00:00.000Z
const FIXED_EPOCH_S = 1609459200; // seconds
const FIXED_EPOCH_MS = 1609459200000; // milliseconds
const FIXED_ISO = "2021-01-01T00:00:00.000Z";

describe("convertTimestamp", () => {
  describe("epoch seconds input", () => {
    it("returns the correct ISO string from epoch seconds", () => {
      const result = convertTimestamp(String(FIXED_EPOCH_S));
      expect(result.iso8601).toBe(FIXED_ISO);
    });

    it("returns an epochSeconds value equal to the input", () => {
      const result = convertTimestamp(String(FIXED_EPOCH_S));
      expect(result.epochSeconds).toBe(FIXED_EPOCH_S);
    });

    it("the input field echoes back the original value", () => {
      const result = convertTimestamp(String(FIXED_EPOCH_S));
      expect(result.input).toBe(String(FIXED_EPOCH_S));
    });

    it("utc field is a non-empty string", () => {
      const result = convertTimestamp(String(FIXED_EPOCH_S));
      expect(result.utc).toBeTruthy();
    });

    it("local field is a non-empty string", () => {
      const result = convertTimestamp(String(FIXED_EPOCH_S));
      expect(result.local).toBeTruthy();
    });
  });

  describe("epoch milliseconds input (>= 1e12)", () => {
    it("treats values >= 1e12 as milliseconds", () => {
      const result = convertTimestamp(String(FIXED_EPOCH_MS));
      expect(result.iso8601).toBe(FIXED_ISO);
    });

    it("returns the correct epochSeconds from milliseconds input", () => {
      const result = convertTimestamp(String(FIXED_EPOCH_MS));
      expect(result.epochSeconds).toBe(FIXED_EPOCH_S);
    });
  });

  describe("ISO 8601 string input", () => {
    it("parses an ISO 8601 date string", () => {
      const result = convertTimestamp(FIXED_ISO);
      expect(result.epochSeconds).toBe(FIXED_EPOCH_S);
    });

    it("parses a date-only string", () => {
      const result = convertTimestamp("2021-01-01");
      // Should not throw and epochSeconds should be a number
      expect(typeof result.epochSeconds).toBe("number");
    });

    it("returns iso8601 field matching expected format", () => {
      const result = convertTimestamp(FIXED_ISO);
      expect(result.iso8601).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe("error cases", () => {
    it("throws for a completely non-parseable string", () => {
      expect(() => convertTimestamp("not-a-date")).toThrow(
        /Cannot parse timestamp/
      );
    });

    it("throws for an empty string", () => {
      expect(() => convertTimestamp("")).toThrow(/Cannot parse timestamp/);
    });

    it("throws for a random word", () => {
      expect(() => convertTimestamp("foobar")).toThrow(/Cannot parse timestamp/);
    });
  });

  describe("edge cases", () => {
    it("handles epoch 0 (Unix start)", () => {
      const result = convertTimestamp("0");
      expect(result.epochSeconds).toBe(0);
      expect(result.iso8601).toBe("1970-01-01T00:00:00.000Z");
    });

    it("always returns exactly the 5 expected fields", () => {
      const result = convertTimestamp(String(FIXED_EPOCH_S));
      const keys = Object.keys(result).sort();
      expect(keys).toEqual(["epochSeconds", "input", "iso8601", "local", "utc"]);
    });
  });
});
