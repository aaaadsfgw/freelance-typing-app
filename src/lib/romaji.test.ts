import { describe, expect, it } from "vitest";
import { createEngine, handleKey, isComplete } from "./romaji";

function typeAll(engine: ReturnType<typeof createEngine>, keys: string) {
  for (const key of keys) {
    handleKey(engine, key);
  }
}

describe("romaji", () => {
  it("accepts shi and si for し", () => {
    const a = createEngine([{ text: "し", kana: "し" }]);
    typeAll(a, "shi");
    expect(isComplete(a)).toBe(true);

    const b = createEngine([{ text: "し", kana: "し" }]);
    typeAll(b, "si");
    expect(isComplete(b)).toBe(true);
  });

  it("accepts tsu/tu, chi/ti, fu/hu", () => {
    const tsu = createEngine([{ text: "つ", kana: "つ" }]);
    typeAll(tsu, "tu");
    expect(isComplete(tsu)).toBe(true);

    const chi = createEngine([{ text: "ち", kana: "ち" }]);
    typeAll(chi, "ti");
    expect(isComplete(chi)).toBe(true);

    const fu = createEngine([{ text: "ふ", kana: "ふ" }]);
    typeAll(fu, "hu");
    expect(isComplete(fu)).toBe(true);
  });

  it("does not advance on a miss", () => {
    const engine = createEngine([{ text: "か", kana: "か" }]);
    expect(handleKey(engine, "x")).toBe("miss");
    expect(engine.moraIndex).toBe(0);
    expect(engine.combo).toBe(0);
    expect(engine.misses).toBe(1);
    expect(handleKey(engine, "k")).toBe("hit");
    expect(handleKey(engine, "a")).toBe("complete");
  });

  it("types a short Japanese sentence", () => {
    const engine = createEngine([
      { text: "確", kana: "かく" },
      { text: "認", kana: "にん" },
      { text: "します。", kana: "します。" },
    ]);
    typeAll(engine, "kakuninshimasu.");
    expect(isComplete(engine)).toBe(true);
  });

  it("types ASCII as-is", () => {
    const engine = createEngine([
      { text: "API", kana: "API" },
      { text: "を", kana: "を" },
    ]);
    typeAll(engine, "APIwo");
    expect(isComplete(engine)).toBe(true);
  });
});
