import { createTwoFilesPatch } from "diff";

export function diffText(oldText: string, newText: string): string {
  const patch = createTwoFilesPatch("old", "new", oldText, newText);
  return patch || "No differences found.";
}
