import { describe, expect, it } from "vitest";
import { formatYen } from "../lib/reward";
import { evaluatePlay, RATING } from "../lib/rating";
import { APP_NAME, DIFFICULTY_META } from "./copy";

describe("copy", () => {
  it("uses Dev Desk and the required difficulty names", () => {
    expect(APP_NAME).toBe("Dev Desk");
    expect(DIFFICULTY_META.beginner.title).toBe("新米エンジニア");
    expect(DIFFICULTY_META.intermediate.title).toBe("慣れてきたエンジニア");
    expect(DIFFICULTY_META.advanced.title).toBe("つよつよエンジニア");
  });

  it("formats salary as yen", () => {
    expect(formatYen(4280000)).toBe("¥4,280,000");
    expect(formatYen(420000)).toBe("¥420,000");
  });

  it("keeps typing rank independent of salary", () => {
    const rating = evaluatePlay({
      difficulty: "intermediate",
      speed: 200,
      accuracy: 0.96,
      jobsCompleted: 6,
    });
    expect(rating.title).toBe(RATING.titles[rating.rank]);
    expect(Object.values(RATING.titles)).toEqual([
      "新米エンジニア",
      "戦力化エンジニア",
      "頼れるエンジニア",
      "つよつよエンジニア",
      "フルスタックエース",
    ]);
  });
});
