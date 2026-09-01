import { describe, expect, it } from "vitest";
import { calcReward } from "./reward";

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
    expect(short).toBeGreaterThanOrEqual(200000);
    expect(short % 10000).toBe(0);
    expect(long % 10000).toBe(0);
  });

  it("lands ordinary sessions in a few million yen", () => {
    const typical = calcReward({
      difficulty: "intermediate",
      charCount: 40,
      hits: 70,
      misses: 2,
      elapsedMs: 14000,
    });
    expect(typical).toBeGreaterThanOrEqual(400000);
    expect(typical).toBeLessThanOrEqual(1200000);
    expect(typical * 6).toBeGreaterThanOrEqual(3000000);
    expect(typical * 8).toBeLessThanOrEqual(10000000);
  });
});
