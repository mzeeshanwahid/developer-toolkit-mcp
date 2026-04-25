export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  expiry: string;
}

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT: expected 3 dot-separated parts");
  }

  const header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf-8")) as Record<string, unknown>;
  const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8")) as Record<string, unknown>;

  let expiry = "No expiry (exp claim not present)";
  if (typeof payload["exp"] === "number") {
    const expDate = new Date(payload["exp"] * 1000);
    expiry =
      expDate > new Date()
        ? `Expires at ${expDate.toISOString()} (valid)`
        : `Expired at ${expDate.toISOString()} (expired)`;
  }

  return { header, payload, expiry };
}
