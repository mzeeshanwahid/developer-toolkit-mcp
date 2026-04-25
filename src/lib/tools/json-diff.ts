import { createTwoFilesPatch } from "diff";

export function diffJson(oldJson: string, newJson: string): string {
  const oldParsed: unknown = JSON.parse(oldJson);
  const newParsed: unknown = JSON.parse(newJson);
  const oldFormatted = JSON.stringify(oldParsed, null, 2);
  const newFormatted = JSON.stringify(newParsed, null, 2);
  const patch = createTwoFilesPatch("old.json", "new.json", oldFormatted, newFormatted);
  return patch || "No differences found.";
}
