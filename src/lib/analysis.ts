import type { KeyStat } from "../shared/types";
import type { TypingEngine } from "./romaji";

export type PlayTotals = {
  hits: number;
  misses: number;
  maxCombo: number;
  revenue: number;
  jobs: number;
  keyStats: Record<string, KeyStat>;
  fingerStats: Record<string, KeyStat>;
  bigramStats: Record<string, KeyStat>;
};

function missRate(stat: KeyStat): number {
  const total = stat.hits + stat.misses;
  if (total === 0) return 0;
  return stat.misses / total;
}

export function topWeak(
  stats: Record<string, KeyStat>,
  limit = 5,
): Array<{ key: string; hits: number; misses: number; rate: number }> {
  return Object.entries(stats)
    .map(([key, stat]) => ({
      key,
      hits: stat.hits,
      misses: stat.misses,
      rate: missRate(stat),
    }))
    .filter((row) => row.misses > 0)
    .sort((a, b) => b.rate - a.rate || b.misses - a.misses)
    .slice(0, limit);
}

export function mergeStats(
  target: Record<string, KeyStat>,
  extra: Record<string, KeyStat>,
): Record<string, KeyStat> {
  const next = { ...target };
  for (const [key, stat] of Object.entries(extra)) {
    const cur = next[key] ?? { hits: 0, misses: 0 };
    next[key] = { hits: cur.hits + stat.hits, misses: cur.misses + stat.misses };
  }
  return next;
}

export function absorbEngineStats(
  totals: PlayTotals,
  engine: TypingEngine,
  options?: { reward?: number; completedJob?: boolean },
): void {
  totals.hits += engine.hits;
  totals.misses += engine.misses;
  totals.maxCombo = Math.max(totals.maxCombo, engine.maxCombo);
  totals.keyStats = mergeStats(totals.keyStats, engine.keyStats);
  totals.fingerStats = mergeStats(totals.fingerStats, engine.fingerStats);
  totals.bigramStats = mergeStats(totals.bigramStats, engine.bigramStats);
  if (options?.completedJob) {
    totals.jobs += 1;
    totals.revenue += options.reward ?? 0;
  }
}
