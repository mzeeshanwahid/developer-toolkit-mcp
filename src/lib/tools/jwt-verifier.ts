import jwt from "jsonwebtoken";

export function verifyJwt(token: string, secret: string): Record<string, unknown> {
  const decoded = jwt.verify(token, secret);
  return decoded as Record<string, unknown>;
}
