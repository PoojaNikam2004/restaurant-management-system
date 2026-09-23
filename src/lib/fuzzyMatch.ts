function levenshtein(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[rows - 1][cols - 1];
}

function maxDistanceFor(wordLength: number): number {
  if (wordLength <= 3) return 1;
  if (wordLength <= 6) return 2;
  return 3;
}

/** True if `query` is close enough (typo-tolerant) to any word in `text`. */
export function fuzzyIncludes(text: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = text.toLowerCase();
  if (haystack.includes(q)) return true;

  const words = haystack.split(/[^a-z0-9]+/).filter(Boolean);
  const threshold = maxDistanceFor(q.length);
  return words.some((word) => levenshtein(word, q) <= threshold);
}