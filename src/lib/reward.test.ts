import { describe, expect, it } from "vitest";
import { calcReward, rankFor } from "./reward";

describe("reward", () => {
  it("pays more for advanced and longer text", () => {
    const short = calcReward({
      difficulty: "beginner",
      charCount: 10,
      hits: 20,
      misses: 2,
      elapsedMs: 8000,
    });
    const long = calcReward({
      difficulty: "advanced",
      charCount: 80,
      hits: 120,
      misses: 1,
      elapsedMs: 12000,
    });
    expect(long).toBeGreaterThan(short);
    expect(short).toBeGreaterThanOrEqual(2000);
  });

  it("maps revenue to rank copy", () => {
    expect(rankFor(180_000).label).toBe("駆け出し");
    expect(rankFor(500_000).label).toBe("安定");
    expect(rankFor(800_000).label).toBe("売れっ子エンジニア");
    expect(rankFor(1_200_000).label).toBe("月商 100 万");
  });
});
