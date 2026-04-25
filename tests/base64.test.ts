import { describe, it, expect } from "vitest";
import { base64EncodeDecode } from "../src/lib/tools/base64.js";

describe("base64EncodeDecode", () => {
  describe("encode mode", () => {
    it("encodes a simple ASCII string", () => {
      expect(base64EncodeDecode("hello", "encode")).toBe("aGVsbG8=");
    });

    it("encodes an empty string", () => {
      expect(base64EncodeDecode("", "encode")).toBe("");
    });

    it("encodes a string with spaces and special characters", () => {
      const result = base64EncodeDecode("hello world!", "encode");
      expect(result).toBe("aGVsbG8gd29ybGQh");
    });

    it("encodes unicode characters correctly", () => {
      const result = base64EncodeDecode("héllo", "encode");
      expect(Buffer.from(result, "base64").toString("utf-8")).toBe("héllo");
    });

    it("encodes a URL-like string", () => {
      const url = "https://example.com?key=value&other=123";
      const encoded = base64EncodeDecode(url, "encode");
      expect(base64EncodeDecode(encoded, "decode")).toBe(url);
    });

    it("encodes a long token correctly", () => {
      const long = "a".repeat(1000);
      const encoded = base64EncodeDecode(long, "encode");
      expect(base64EncodeDecode(encoded, "decode")).toBe(long);
    });
  });

  describe("decode mode", () => {
    it("decodes a valid base64 string", () => {
      expect(base64EncodeDecode("aGVsbG8=", "decode")).toBe("hello");
    });

    it("decodes an empty base64 string", () => {
      expect(base64EncodeDecode("", "decode")).toBe("");
    });

    it("decodes a base64 string without padding", () => {
      const encoded = Buffer.from("test", "utf-8").toString("base64");
      expect(base64EncodeDecode(encoded, "decode")).toBe("test");
    });

    it("round-trips encode then decode", () => {
      const original = "The quick brown fox jumps over the lazy dog";
      const encoded = base64EncodeDecode(original, "encode");
      const decoded = base64EncodeDecode(encoded, "decode");
      expect(decoded).toBe(original);
    });

    it("round-trips multiline text", () => {
      const original = "line1\nline2\nline3";
      const encoded = base64EncodeDecode(original, "encode");
      expect(base64EncodeDecode(encoded, "decode")).toBe(original);
    });
  });
});
