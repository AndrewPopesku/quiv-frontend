export function parseExamples(example: string | string[]): string[] {
  if (Array.isArray(example)) return example;
  if (typeof example !== "string") return [];
  const trimmed = example.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const matches = trimmed.match(/'((?:[^'\\]|\\.)*)'/g);
    if (matches) return matches.map(s => s.slice(1, -1));
  }
  return [example];
}
