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
    expect(short).toBeGreaterThanOrEqual(2000);
  });
});
