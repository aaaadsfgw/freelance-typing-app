import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
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
import { CLIENT_LIST } from "./clients";
import { PERSONA_LINES, personaLineFor } from "./persona";
import { QUESTIONS } from "./questions";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../../public");

describe("questions", () => {
  it("keeps display text aligned with chunks", () => {
    for (const question of QUESTIONS) {
      expect(question.chunks.map((c) => c.text).join("")).toBe(question.replyText);
      expect(question.chunks.map((c) => c.kana).join("")).toBe(question.replyReading);
    }
  });

  it("has playable counts per difficulty", () => {
    expect(QUESTIONS.filter((q) => q.difficulty === "beginner").length).toBeGreaterThanOrEqual(30);
    expect(QUESTIONS.filter((q) => q.difficulty === "intermediate").length).toBeGreaterThanOrEqual(
      35,
    );
    expect(QUESTIONS.filter((q) => q.difficulty === "advanced").length).toBeGreaterThanOrEqual(35);
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(100);
  });

  it("has unique ids, reply texts, and request texts", () => {
    const ids = QUESTIONS.map((item) => item.id);
    const replies = QUESTIONS.map((item) => item.replyText);
    const requests = QUESTIONS.map((item) => item.requestText);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(replies).size).toBe(replies.length);
    expect(new Set(requests).size).toBe(requests.length);
  });

  it("points every client avatar to a local file", () => {
    expect(CLIENT_LIST.length).toBeGreaterThanOrEqual(10);
    const fromPublic = (path: string) => join(publicDir, path.replace(/^\//, ""));
    for (const client of CLIENT_LIST) {
      expect(client.avatar.startsWith("/assets/avatars/")).toBe(true);
      expect(existsSync(fromPublic(client.avatar))).toBe(true);
    }
    for (const question of QUESTIONS) {
      expect(question.clientIcon.startsWith("/assets/avatars/")).toBe(true);
      expect(existsSync(fromPublic(question.clientIcon))).toBe(true);
    }
    expect(existsSync(fromPublic("/assets/illustrations/desk-work.svg"))).toBe(true);
    expect(existsSync(fromPublic("/assets/illustrations/month-done.svg"))).toBe(true);
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

  it("appends one persona line with matching kana", () => {
    const totalLines =
      PERSONA_LINES.beginner.length +
      PERSONA_LINES.intermediate.length +
      PERSONA_LINES.advanced.length;
    expect(PERSONA_LINES.beginner.length).toBeGreaterThanOrEqual(10);
    expect(PERSONA_LINES.intermediate.length).toBeGreaterThanOrEqual(10);
    expect(PERSONA_LINES.advanced.length).toBeGreaterThanOrEqual(10);
    expect(totalLines).toBeGreaterThanOrEqual(30);
    for (const question of QUESTIONS) {
      const punch = personaLineFor(question.id, question.difficulty);
      expect(question.replyText.endsWith(punch.text)).toBe(true);
      expect(question.replyReading.endsWith(punch.kana)).toBe(true);
      expect(question.chunks.at(-1)).toEqual(punch);
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
