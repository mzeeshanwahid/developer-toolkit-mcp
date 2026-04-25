import { describe, it, expect } from "vitest";
import { urlEncodeDecode } from "../src/lib/tools/url-encoder.js";

describe("urlEncodeDecode", () => {
  describe("encode mode", () => {
    it("encodes a simple string with no special characters", () => {
      expect(urlEncodeDecode("hello", "encode")).toBe("hello");
    });

    it("encodes a string with spaces", () => {
      expect(urlEncodeDecode("hello world", "encode")).toBe("hello%20world");
    });

    it("encodes special URL characters", () => {
      expect(urlEncodeDecode("a&b=c+d", "encode")).toBe("a%26b%3Dc%2Bd");
    });

    it("encodes a query string with multiple params", () => {
      const result = urlEncodeDecode("name=John Doe&age=30", "encode");
      expect(result).toBe("name%3DJohn%20Doe%26age%3D30");
    });

    it("encodes unicode characters", () => {
      const result = urlEncodeDecode("日本語", "encode");
      expect(result).toBe("%E6%97%A5%E6%9C%AC%E8%AA%9E");
    });

    it("encodes an empty string", () => {
      expect(urlEncodeDecode("", "encode")).toBe("");
    });

    it("encodes reserved characters like / # ?", () => {
      const result = urlEncodeDecode("path/to?query#hash", "encode");
      expect(result).toBe("path%2Fto%3Fquery%23hash");
    });
  });

  describe("decode mode", () => {
    it("decodes a percent-encoded string", () => {
      expect(urlEncodeDecode("hello%20world", "decode")).toBe("hello world");
    });

    it("decodes an empty string", () => {
      expect(urlEncodeDecode("", "decode")).toBe("");
    });

    it("decodes a string with no encoding", () => {
      expect(urlEncodeDecode("hello", "decode")).toBe("hello");
    });

    it("decodes unicode encoded characters", () => {
      expect(urlEncodeDecode("%E6%97%A5%E6%9C%AC%E8%AA%9E", "decode")).toBe("日本語");
    });

    it("decodes multiple encoded chars", () => {
      expect(urlEncodeDecode("name%3DJohn%20Doe%26age%3D30", "decode")).toBe(
        "name=John Doe&age=30"
      );
    });

    it("round-trips encode then decode", () => {
      const original = "hello world & special=chars+here";
      const encoded = urlEncodeDecode(original, "encode");
      const decoded = urlEncodeDecode(encoded, "decode");
      expect(decoded).toBe(original);
    });

    it("throws on malformed percent encoding", () => {
      expect(() => urlEncodeDecode("%ZZ", "decode")).toThrow();
    });
  });
});
