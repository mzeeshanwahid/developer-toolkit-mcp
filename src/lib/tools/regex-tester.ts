export interface RegexResult {
  isMatch: boolean;
  matchCount: number;
  firstMatch: string[];
  groups: Record<string, string> | null;
  allMatches: string[][];
}

export function testRegex(pattern: string, text: string, flags: string): RegexResult {
  const re = new RegExp(pattern, flags);
  const allMatches: string[][] = [];
  let groups: Record<string, string> | null = null;

  if (flags.includes("g")) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      allMatches.push(Array.from(m));
      if (m.groups) groups = { ...(groups ?? {}), ...m.groups };
    }
    return {
      isMatch: allMatches.length > 0,
      matchCount: allMatches.length,
      firstMatch: allMatches[0] ?? [],
      groups,
      allMatches,
    };
  }

  const m = re.exec(text);
  if (m) {
    groups = m.groups ? { ...m.groups } : null;
    return { isMatch: true, matchCount: 1, firstMatch: Array.from(m), groups, allMatches: [Array.from(m)] };
  }
  return { isMatch: false, matchCount: 0, firstMatch: [], groups: null, allMatches: [] };
}
