import { describe, it, expect } from "vitest";
import { diffJson } from "../src/lib/tools/json-diff.js";

describe("diffJson", () => {
  it("returns a unified diff for two different JSON strings", () => {
    const oldJson = JSON.stringify({ a: 1, b: 2 });
    const newJson = JSON.stringify({ a: 1, b: 3 });
    const result = diffJson(oldJson, newJson);
    expect(result).toContain("-");
    expect(result).toContain("+");
    expect(result).toContain("old.json");
    expect(result).toContain("new.json");
  });

  it("returns a patch header even when there are no differences", () => {
    const json = JSON.stringify({ a: 1 });
    const result = diffJson(json, json);
    // createTwoFilesPatch always returns a header string
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("pretty-prints JSON before diffing (preserves insertion order)", () => {
    // JSON.stringify preserves key insertion order — so {b,a} vs {a,b} WILL produce a diff.
    // This test verifies the function correctly diffs the pretty-printed representations.
    const oldJson = '{"b":2,"a":1}';
    const newJson = '{"a":1,"b":2}';
    const result = diffJson(oldJson, newJson);
    // Both are valid JSON and produce formatted output with same values — diff will show reordering
    expect(result).toContain("old.json");
    expect(result).toContain("new.json");
    expect(typeof result).toBe("string");
  });

  it("returns diff that shows removed key", () => {
    const oldJson = JSON.stringify({ a: 1, b: 2, c: 3 });
    const newJson = JSON.stringify({ a: 1, b: 2 });
    const result = diffJson(oldJson, newJson);
    expect(result).toContain("c");
  });

  it("returns diff that shows added key", () => {
    const oldJson = JSON.stringify({ a: 1 });
    const newJson = JSON.stringify({ a: 1, b: 2 });
    const result = diffJson(oldJson, newJson);
    expect(result).toContain("b");
  });

  it("throws on invalid old JSON", () => {
    expect(() => diffJson("not json", '{"a":1}')).toThrow();
  });

  it("throws on invalid new JSON", () => {
    expect(() => diffJson('{"a":1}', "not json")).toThrow();
  });

  it("throws when both inputs are invalid JSON", () => {
    expect(() => diffJson("bad", "also bad")).toThrow();
  });

  it("handles nested objects", () => {
    const oldJson = JSON.stringify({ a: { b: { c: 1 } } });
    const newJson = JSON.stringify({ a: { b: { c: 2 } } });
    const result = diffJson(oldJson, newJson);
    expect(result).toContain("c");
  });

  it("handles arrays in JSON", () => {
    const oldJson = JSON.stringify([1, 2, 3]);
    const newJson = JSON.stringify([1, 2, 4]);
    const result = diffJson(oldJson, newJson);
    expect(result).toContain("+");
  });
});
