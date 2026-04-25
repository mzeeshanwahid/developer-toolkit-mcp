export function urlEncodeDecode(data: string, mode: "encode" | "decode"): string {
  if (mode === "encode") {
    return encodeURIComponent(data);
  }
  return decodeURIComponent(data);
}
