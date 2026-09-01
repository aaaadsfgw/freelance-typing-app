import { describe, expect, it } from "vitest";
import { absorbEngineStats, type PlayTotals } from "./analysis";
import { createEngine, typeKeys } from "./romaji";

function emptyTotals(): PlayTotals {
  return {
    hits: 0,
    misses: 0,
    maxCombo: 0,
    revenue: 0,
    jobs: 0,
    keyStats: {},
    fingerStats: {},
    bigramStats: {},
  };
}

describe("analysis", () => {
  it("adds an incomplete job's keystrokes without a reward", () => {
    const totals = emptyTotals();
    const engine = createEngine([{ text: "確認します。", kana: "かくにんします。" }]);
    typeKeys(engine, "kakunin");
    absorbEngineStats(totals, engine);
    expect(totals.hits).toBe(engine.hits);
    expect(totals.misses).toBe(0);
    expect(totals.jobs).toBe(0);
    expect(totals.revenue).toBe(0);
    expect(totals.maxCombo).toBe(engine.maxCombo);
    expect(Object.keys(totals.keyStats).length).toBeGreaterThan(0);
  });

  it("does not double-count a completed job that was already absorbed", () => {
    const totals = emptyTotals();
    const engine = createEngine([{ text: "あ", kana: "あ" }]);
    typeKeys(engine, "a");
    absorbEngineStats(totals, engine, { reward: 1000, completedJob: true });
    const fresh = createEngine([{ text: "い", kana: "い" }]);
    absorbEngineStats(totals, fresh);
    expect(totals.hits).toBe(1);
    expect(totals.jobs).toBe(1);
    expect(totals.revenue).toBe(1000);
  });
});
