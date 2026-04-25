import { describe, it, expect } from "vitest";
import { generateId } from "../src/lib/tools/uuid-generator.js";

describe("generateId", () => {
  describe("uuid type", () => {
    it("generates a string", () => {
      expect(typeof generateId("uuid")).toBe("string");
    });

    it("generates a valid UUID v4 format", () => {
      const uuid = generateId("uuid");
      // RFC 4122 UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it("generates unique IDs on each call", () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId("uuid")));
      expect(ids.size).toBe(100);
    });

    it("UUID is always 36 characters long", () => {
      expect(generateId("uuid")).toHaveLength(36);
    });
  });

  describe("ulid type", () => {
    it("generates a string", () => {
      expect(typeof generateId("ulid")).toBe("string");
    });

    it("generates a valid ULID format (26 uppercase alphanumeric chars)", () => {
      const ulid = generateId("ulid");
      expect(ulid).toMatch(/^[0-9A-Z]{26}$/);
    });

    it("generates unique IDs on each call", () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId("ulid")));
      expect(ids.size).toBe(100);
    });

    it("ULID is always 26 characters long", () => {
      expect(generateId("ulid")).toHaveLength(26);
    });

    it("ULIDs are time-sortable (later IDs compare greater)", async () => {
      const first = generateId("ulid");
      // Small delay to ensure timestamp difference
      await new Promise((r) => setTimeout(r, 5));
      const second = generateId("ulid");
      expect(second > first).toBe(true);
    });
  });
});
