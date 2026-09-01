import { describe, expect, it } from "vitest";
import {
  cloneEngine,
  createEngine,
  handleKey,
  isComplete,
  marksFor,
  romajiGuideChars,
  typeKeys,
} from "../lib/romaji";
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

  it("can finish every question without spaces or letter case", () => {
    for (const question of QUESTIONS) {
      const engine = createEngine(question.chunks);
      const keys = romajiGuideChars(engine)
        .map((item) => item.ch)
        .join("")
        .replaceAll(" ", "")
        .replace(/[A-Z]/g, (ch) => ch.toLowerCase());
      typeKeys(engine, keys);
      expect(isComplete(engine), question.id).toBe(true);
      expect(
        marksFor(engine).every((mark) => mark === "typed"),
        `${question.id} display`,
      ).toBe(true);
      expect(
        romajiGuideChars(engine).every((item) => item.mark === "typed"),
        `${question.id} guide`,
      ).toBe(true);
    }
  });

  it("keeps the same progress when keys arrive through a cloned engine", () => {
    const question = QUESTIONS.find((item) => item.id === "b01");
    expect(question).toBeTruthy();
    let engine = createEngine(question!.chunks);
    const keys = romajiGuideChars(engine)
      .map((item) => item.ch)
      .join("")
      .replaceAll(" ", "")
      .replace(/[A-Z]/g, (ch) => ch.toLowerCase());
    for (const key of keys) {
      const next = cloneEngine(engine);
      handleKey(next, key);
      engine = next;
    }
    expect(isComplete(engine)).toBe(true);
    expect(marksFor(engine).every((mark) => mark === "typed")).toBe(true);
  });
});
