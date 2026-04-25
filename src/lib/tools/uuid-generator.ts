import { ulid } from "ulid";
import crypto from "crypto";

export function generateId(type: "uuid" | "ulid"): string {
  if (type === "uuid") {
    return crypto.randomUUID();
  }
  return ulid();
}
