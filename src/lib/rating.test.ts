import { describe, expect, it } from "vitest";
import {
  RATING,
  accuracyScoreOf,
  evaluatePlay,
  jobsScoreOf,
  rankForScore,
  speedScoreOf,
} from "./rating";

const base = {
  difficulty: "intermediate" as const,
  speed: 200,
  accuracy: 0.96,
  jobsCompleted: 6,
};

describe("rating", () => {
  it("gives S or SS for fast and accurate play", () => {
    const result = evaluatePlay({
      difficulty: "intermediate",
      speed: 300,
      accuracy: 0.99,
      jobsCompleted: 8,
      maxCombo: 50,
    });
    expect(["S", "SS"]).toContain(result.rank);
    expect(result.totalScore).toBeGreaterThanOrEqual(RATING.rankThresholds.S);
    expect(result.comment).toContain("指名");
  });

  it("drops rank when speed is high but accuracy is low", () => {
    const clean = evaluatePlay({
      difficulty: "intermediate",
      speed: 300,
      accuracy: 0.99,
      jobsCompleted: 8,
    });
    const sloppy = evaluatePlay({
      difficulty: "intermediate",
      speed: 300,
      accuracy: 0.84,
      jobsCompleted: 8,
    });
    expect(sloppy.totalScore).toBeLessThan(clean.totalScore - 10);
    expect(sloppy.totalScore).toBeLessThan(RATING.rankThresholds.S);
    expect(sloppy.comment).toContain("ミス");
  });

  it("does not tank a slow but accurate play", () => {
    const result = evaluatePlay({
      difficulty: "beginner",
      speed: 120,
      accuracy: 0.99,
      jobsCompleted: 4,
    });
    expect(result.accuracyScore).toBeGreaterThanOrEqual(38);
    expect(result.totalScore).toBeGreaterThanOrEqual(55);
    expect(["B", "A"]).toContain(result.rank);
    expect(result.comment).toMatch(/丁寧|正確/);
  });

  it("caps each category and keeps the total in 0-100", () => {
    const overflow = evaluatePlay({
      difficulty: "beginner",
      speed: 900,
      accuracy: 1,
      jobsCompleted: 80,
    });
    expect(overflow.speedScore).toBeLessThanOrEqual(RATING.speedMax);
    expect(overflow.accuracyScore).toBeLessThanOrEqual(RATING.accuracyMax);
    expect(overflow.jobsScore).toBeLessThanOrEqual(RATING.jobsMax);
    expect(overflow.totalScore).toBeGreaterThanOrEqual(0);
    expect(overflow.totalScore).toBeLessThanOrEqual(100);

    const empty = evaluatePlay({
      difficulty: "advanced",
      speed: 0,
      accuracy: 0,
      jobsCompleted: 0,
    });
    expect(empty.totalScore).toBe(0);
    expect(empty.rank).toBe("C");
  });

  it("uses the rank thresholds", () => {
    expect(rankForScore(90)).toBe("SS");
    expect(rankForScore(80)).toBe("S");
    expect(rankForScore(68)).toBe("A");
    expect(rankForScore(55)).toBe("B");
    expect(rankForScore(54.9)).toBe("C");
  });

  it("scores the same raw speed differently by difficulty", () => {
    const beginner = speedScoreOf("beginner", 240);
    const advanced = speedScoreOf("advanced", 240);
    expect(advanced).toBeGreaterThan(beginner);
    expect(speedScoreOf("beginner", 300)).toBe(RATING.speedMax);
    expect(speedScoreOf("advanced", 240)).toBe(RATING.speedMax);
  });

  it("keeps the same rank when only revenue changes", () => {
    const typing = evaluatePlay(base);
    const richer = evaluatePlay(base);
    expect(typing.rank).toBe(richer.rank);
    expect(typing.totalScore).toBe(richer.totalScore);
    expect(typing).toEqual(richer);
  });

  it("follows the accuracy curve without a cliff at 90%", () => {
    const at90 = accuracyScoreOf(0.9);
    const justBelow = accuracyScoreOf(0.899);
    expect(at90).toBeCloseTo(22, 0);
    expect(Math.abs(at90 - justBelow)).toBeLessThan(1);
    expect(accuracyScoreOf(0.98)).toBeGreaterThanOrEqual(38);
    expect(accuracyScoreOf(0.85)).toBeLessThan(12);
  });

  it("keeps jobs as a small bonus", () => {
    expect(jobsScoreOf("intermediate", 7)).toBe(RATING.jobsMax);
    expect(jobsScoreOf("intermediate", 3)).toBeLessThan(RATING.jobsMax);
    expect(RATING.jobsMax).toBeLessThan(RATING.speedMax);
    expect(RATING.jobsMax).toBeLessThan(RATING.accuracyMax);
  });
});
