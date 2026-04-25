import { describe, it, expect } from "vitest";
import { generateHash } from "../src/lib/tools/hash-generator.js";

// Known hash values for "hello"
const KNOWN = {
  md5: "5d41402abc4b2a76b9719d911017c592",
  sha256: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  sha512:
    "9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043",
};

describe("generateHash", () => {
  describe("md5 algorithm", () => {
    it("produces the correct MD5 hash for 'hello'", () => {
      expect(generateHash("hello", "md5")).toBe(KNOWN.md5);
    });

    it("produces a 32-character hex string for MD5", () => {
      const result = generateHash("any string", "md5");
      expect(result).toMatch(/^[0-9a-f]{32}$/);
    });

    it("produces different hashes for different inputs", () => {
      expect(generateHash("hello", "md5")).not.toBe(generateHash("world", "md5"));
    });

    it("is deterministic — same input always produces same hash", () => {
      expect(generateHash("test", "md5")).toBe(generateHash("test", "md5"));
    });
  });

  describe("sha256 algorithm", () => {
    it("produces the correct SHA-256 hash for 'hello'", () => {
      expect(generateHash("hello", "sha256")).toBe(KNOWN.sha256);
    });

    it("produces a 64-character hex string for SHA-256", () => {
      const result = generateHash("any string", "sha256");
      expect(result).toMatch(/^[0-9a-f]{64}$/);
    });

    it("is deterministic", () => {
      expect(generateHash("reproducible", "sha256")).toBe(generateHash("reproducible", "sha256"));
    });

    it("produces different hashes for different inputs", () => {
      expect(generateHash("a", "sha256")).not.toBe(generateHash("b", "sha256"));
    });
  });

  describe("sha512 algorithm", () => {
    it("produces the correct SHA-512 hash for 'hello'", () => {
      expect(generateHash("hello", "sha512")).toBe(KNOWN.sha512);
    });

    it("produces a 128-character hex string for SHA-512", () => {
      const result = generateHash("any string", "sha512");
      expect(result).toMatch(/^[0-9a-f]{128}$/);
    });

    it("is deterministic", () => {
      expect(generateHash("reproducible", "sha512")).toBe(generateHash("reproducible", "sha512"));
    });
  });

  describe("general behaviour", () => {
    it("hashes an empty string without errors", () => {
      expect(() => generateHash("", "sha256")).not.toThrow();
    });

    it("returns hex-only characters for all algorithms", () => {
      for (const algo of ["md5", "sha256", "sha512"] as const) {
        expect(generateHash("test", algo)).toMatch(/^[0-9a-f]+$/);
      }
    });

    it("produces different digests for different algorithms on the same input", () => {
      const md5 = generateHash("hello", "md5");
      const sha256 = generateHash("hello", "sha256");
      const sha512 = generateHash("hello", "sha512");
      expect(md5).not.toBe(sha256);
      expect(sha256).not.toBe(sha512);
    });
  });
});
