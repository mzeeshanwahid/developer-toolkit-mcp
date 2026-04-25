import { describe, it, expect } from "vitest";
import { decodeJwt } from "../src/lib/tools/jwt-decoder.js";
import jwt from "jsonwebtoken";

// A fixed, non-expiring JWT for decoding tests (signed with HS256/secret "test")
const FIXED_TOKEN = jwt.sign({ sub: "1234567890", name: "John Doe", iat: 1516239022 }, "test");

// A token with a future exp
const FUTURE_EXP = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
const FUTURE_TOKEN = jwt.sign({ sub: "user1", exp: FUTURE_EXP }, "secret");

// A token with a past exp (already expired)
const PAST_EXP = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
const EXPIRED_TOKEN = jwt.sign({ sub: "user2", exp: PAST_EXP }, "secret", { noTimestamp: true });

describe("decodeJwt", () => {
  describe("valid tokens", () => {
    it("returns header, payload, and expiry for a basic token", () => {
      const result = decodeJwt(FIXED_TOKEN);
      expect(result).toHaveProperty("header");
      expect(result).toHaveProperty("payload");
      expect(result).toHaveProperty("expiry");
    });

    it("header contains alg and typ fields", () => {
      const result = decodeJwt(FIXED_TOKEN);
      expect(result.header["alg"]).toBe("HS256");
      expect(result.header["typ"]).toBe("JWT");
    });

    it("payload contains the expected claims", () => {
      const result = decodeJwt(FIXED_TOKEN);
      expect(result.payload["sub"]).toBe("1234567890");
      expect(result.payload["name"]).toBe("John Doe");
    });

    it("expiry says 'No expiry' when exp claim is absent", () => {
      const result = decodeJwt(FIXED_TOKEN);
      // Note: jwt.sign adds iat but not necessarily exp
      // For the fixed token, there's no exp set
      // Check expiry correctly
      if (!("exp" in result.payload)) {
        expect(result.expiry).toBe("No expiry (exp claim not present)");
      }
    });

    it("reports 'valid' for a future expiry token", () => {
      const result = decodeJwt(FUTURE_TOKEN);
      expect(result.expiry).toContain("valid");
      expect(result.expiry).toContain("Expires at");
    });

    it("reports 'expired' for a past expiry token", () => {
      const result = decodeJwt(EXPIRED_TOKEN);
      expect(result.expiry).toContain("expired");
      expect(result.expiry).toContain("Expired at");
    });

    it("expiry contains an ISO timestamp for expiring tokens", () => {
      const result = decodeJwt(FUTURE_TOKEN);
      expect(result.expiry).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe("invalid tokens", () => {
    it("throws for a token with only 2 parts", () => {
      expect(() => decodeJwt("header.payload")).toThrow(
        "Invalid JWT: expected 3 dot-separated parts"
      );
    });

    it("throws for a token with only 1 part", () => {
      expect(() => decodeJwt("justonepart")).toThrow(
        "Invalid JWT: expected 3 dot-separated parts"
      );
    });

    it("throws for an empty string", () => {
      expect(() => decodeJwt("")).toThrow("Invalid JWT: expected 3 dot-separated parts");
    });

    it("throws for a token with 4 parts", () => {
      expect(() => decodeJwt("a.b.c.d")).toThrow(
        "Invalid JWT: expected 3 dot-separated parts"
      );
    });

    it("throws for a token with non-base64url payload", () => {
      // Header is valid base64url JSON, but payload is garbage
      expect(() => decodeJwt("eyJhbGciOiJIUzI1NiJ9.!!!.sig")).toThrow();
    });
  });
});
