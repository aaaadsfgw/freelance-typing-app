import { describe, expect, it } from "vitest";
import { QUESTIONS } from "./questions";

describe("questions", () => {
  it("keeps display text aligned with chunks", () => {
    for (const question of QUESTIONS) {
      expect(question.chunks.map((c) => c.text).join("")).toBe(question.replyText);
      expect(question.chunks.map((c) => c.kana).join("")).toBe(question.replyReading);
    }
  });

  it("has playable counts per difficulty", () => {
    expect(QUESTIONS.filter((q) => q.difficulty === "beginner").length).toBeGreaterThanOrEqual(8);
    expect(QUESTIONS.filter((q) => q.difficulty === "intermediate").length).toBeGreaterThanOrEqual(
      8,
    );
    expect(QUESTIONS.filter((q) => q.difficulty === "advanced").length).toBeGreaterThanOrEqual(8);
  });
});
