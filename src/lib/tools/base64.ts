export function base64EncodeDecode(data: string, mode: "encode" | "decode"): string {
  if (mode === "encode") {
    return Buffer.from(data, "utf-8").toString("base64");
  }
  const decoded = Buffer.from(data, "base64").toString("utf-8");
  return decoded;
}
