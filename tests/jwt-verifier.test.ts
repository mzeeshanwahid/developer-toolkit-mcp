import { describe, it, expect } from "vitest";
import { verifyJwt } from "../src/lib/tools/jwt-verifier.js";
import jwt from "jsonwebtoken";

const SECRET = "my-super-secret";

describe("verifyJwt", () => {
  describe("valid tokens", () => {
    it("verifies a valid HS256 token and returns the payload", () => {
      const token = jwt.sign({ userId: 42 }, SECRET);
      const result = verifyJwt(token, SECRET);
      expect(result["userId"]).toBe(42);
    });

    it("returned payload includes iat field", () => {
      const token = jwt.sign({ sub: "user" }, SECRET);
      const result = verifyJwt(token, SECRET);
      expect(result).toHaveProperty("iat");
    });

    it("verifies a token with multiple claims", () => {
      const payload = { sub: "abc", role: "admin", org: "acme" };
      const token = jwt.sign(payload, SECRET);
      const result = verifyJwt(token, SECRET);
      expect(result["sub"]).toBe("abc");
      expect(result["role"]).toBe("admin");
      expect(result["org"]).toBe("acme");
    });

    it("verifies a token with a future expiry", () => {
      const token = jwt.sign({ sub: "user" }, SECRET, { expiresIn: "1h" });
      const result = verifyJwt(token, SECRET);
      expect(result).toHaveProperty("exp");
    });
  });

  describe("invalid tokens", () => {
    it("throws when the secret is wrong", () => {
      const token = jwt.sign({ sub: "user" }, SECRET);
      expect(() => verifyJwt(token, "wrong-secret")).toThrow();
    });

    it("throws for an expired token", () => {
      const token = jwt.sign({ sub: "user" }, SECRET, { expiresIn: -1 });
      expect(() => verifyJwt(token, SECRET)).toThrow();
    });

    it("throws for a malformed token string", () => {
      expect(() => verifyJwt("not.a.token", SECRET)).toThrow();
    });

    it("throws for an empty string", () => {
      expect(() => verifyJwt("", SECRET)).toThrow();
    });

    it("throws when token header is tampered", () => {
      const token = jwt.sign({ sub: "user" }, SECRET);
      // Swap the header for a different one
      const parts = token.split(".");
      const tamperedToken = `${Buffer.from('{"alg":"none"}').toString("base64url")}.${parts[1]}.${parts[2]}`;
      expect(() => verifyJwt(tamperedToken, SECRET)).toThrow();
    });

    it("throws when payload is tampered", () => {
      const token = jwt.sign({ sub: "user", role: "user" }, SECRET);
      const parts = token.split(".");
      const tamperedPayload = Buffer.from(
        JSON.stringify({ sub: "user", role: "admin" })
      ).toString("base64url");
      const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;
      expect(() => verifyJwt(tamperedToken, SECRET)).toThrow();
    });
  });
});
