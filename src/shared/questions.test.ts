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

  it("uses the correct reading for 入れられます and other 入 compounds", () => {
    const m05 = QUESTIONS.find((item) => item.id === "m05");
    expect(m05?.replyText).toContain("入れられます");
    expect(m05?.replyReading).toContain("いれられます");
    expect(m05?.replyReading).not.toContain("はいれられます");

    const b07 = QUESTIONS.find((item) => item.id === "b07");
    expect(b07?.replyText).toContain("入稿");
    expect(b07?.replyReading).toContain("にゅうこう");

    const m08 = QUESTIONS.find((item) => item.id === "m08");
    expect(m08?.replyText).toContain("入れる前");
    expect(m08?.replyReading).toContain("いれるまえ");
    expect(m08?.replyReading).not.toContain("はいれる");

    const a02 = QUESTIONS.find((item) => item.id === "a02");
    expect(a02?.replyText).toContain("入れます");
    expect(a02?.replyReading).toContain("いれます");
    expect(a02?.replyReading).not.toContain("はいれます");
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
