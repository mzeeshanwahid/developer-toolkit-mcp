import crypto from "crypto";

export function generateHash(data: string, algorithm: "md5" | "sha256" | "sha512"): string {
  return crypto.createHash(algorithm).update(data, "utf-8").digest("hex");
}
