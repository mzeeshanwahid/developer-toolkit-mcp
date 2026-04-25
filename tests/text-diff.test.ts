import { describe, it, expect } from "vitest";
import { diffText } from "../src/lib/tools/text-diff.js";

describe("diffText", () => {
  it("produces a unified diff for two different strings", () => {
    const result = diffText("hello world", "hello vitest");
    expect(result).toContain("-");
    expect(result).toContain("+");
    expect(result).toContain("old");
    expect(result).toContain("new");
  });

  it("returns a non-empty string even when inputs are identical", () => {
    const result = diffText("same text", "same text");
    // createTwoFilesPatch returns at minimum header lines
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("shows removed lines with minus prefix", () => {
    const result = diffText("line1\nline2\nline3", "line1\nline3");
    expect(result).toContain("-line2");
  });

  it("shows added lines with plus prefix", () => {
    const result = diffText("line1\nline3", "line1\nline2\nline3");
    expect(result).toContain("+line2");
  });

  it("handles empty old text", () => {
    const result = diffText("", "new content");
    expect(result).toContain("+new content");
  });

  it("handles empty new text", () => {
    const result = diffText("old content", "");
    expect(result).toContain("-old content");
  });

  it("handles both texts being empty", () => {
    const result = diffText("", "");
    expect(typeof result).toBe("string");
  });

  it("produces file labels old and new", () => {
    const result = diffText("a", "b");
    expect(result).toContain("old");
    expect(result).toContain("new");
  });

  it("handles multiline text with multiple changes", () => {
    const old = "alpha\nbeta\ngamma";
    const next = "alpha\ndelta\ngamma";
    const result = diffText(old, next);
    expect(result).toContain("beta");
    expect(result).toContain("delta");
  });

  it("handles text with special characters", () => {
    const result = diffText("a & b < c > d", "a & b > c < d");
    expect(result).toContain("+");
    expect(result).toContain("-");
  });
});
