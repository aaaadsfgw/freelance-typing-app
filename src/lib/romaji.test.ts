import { describe, expect, it } from "vitest";
import {
  createEngine,
  guideProgress,
  handleKey,
  isComplete,
  marksFor,
  romajiGuideChars,
  typeKeys,
} from "./romaji";

function typeAll(engine: ReturnType<typeof createEngine>, keys: string) {
  typeKeys(engine, keys);
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
    for (const [text, keys] of [
      ["つ", "tsu"],
      ["つ", "tu"],
      ["ち", "chi"],
      ["ち", "ti"],
      ["ふ", "fu"],
      ["ふ", "hu"],
    ] as const) {
      const engine = createEngine([{ text, kana: text }]);
      typeAll(engine, keys);
      expect(isComplete(engine), keys).toBe(true);
    }
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

  it("skips half-width spaces without requiring space key", () => {
    const engine = createEngine([
      { text: "API の", kana: "API の" },
      { text: "件", kana: "けん" },
    ]);
    typeAll(engine, "APInoken");
    expect(isComplete(engine)).toBe(true);
    expect(engine.misses).toBe(0);
    expect(handleKey(createEngine([{ text: "PR #128", kana: "PR #128" }]), " ")).toBe("ignore");
  });

  it("accepts API as api", () => {
    const engine = createEngine([{ text: "API", kana: "API" }]);
    typeAll(engine, "api");
    expect(isComplete(engine)).toBe(true);
  });

  it("accepts TODO as todo and PR #128 in lowercase letters", () => {
    const todo = createEngine([{ text: "TODO", kana: "TODO" }]);
    typeAll(todo, "todo");
    expect(isComplete(todo)).toBe(true);

    const pr = createEngine([{ text: "PR #128 を", kana: "PR #128 を" }]);
    typeAll(pr, "pr#128wo");
    expect(isComplete(pr)).toBe(true);
  });

  it("keeps progress stable when kanji reading is longer than the display", () => {
    const engine = createEngine([
      { text: "共有", kana: "きょうゆう" },
      { text: "と確", kana: "とかく" },
      { text: "認", kana: "にん" },
      { text: "と調", kana: "とちょう" },
      { text: "査", kana: "さ" },
      { text: "します。", kana: "します。" },
    ]);
    const before = marksFor(engine);
    expect(before[0]).toBe("current");
    expect(before[1]).toBe("current");
    typeAll(engine, "kyou");
    const mid = marksFor(engine);
    expect(mid[0]).toBe("current");
    expect(mid[1]).toBe("current");
    expect(engine.display.indexOf("認")).toBeGreaterThan(1);
    expect(mid[engine.display.indexOf("認")]).toBe("pending");
    typeAll(engine, "yuutokakunintochousashimasu.");
    expect(isComplete(engine)).toBe(true);
    expect(marksFor(engine).every((mark) => mark === "typed")).toBe(true);
  });

  it("types 共有 / 確認 / 調査 sentences to the end", () => {
    const engine = createEngine([
      { text: "確", kana: "かく" },
      { text: "認", kana: "にん" },
      { text: "して調", kana: "してちょう" },
      { text: "査", kana: "さ" },
      { text: "し、共有", kana: "し、きょうゆう" },
      { text: "します。", kana: "します。" },
    ]);
    typeAll(engine, "kakuninshitechousashi,kyouyuushimasu.");
    expect(isComplete(engine)).toBe(true);
  });

  it("does not drop characters during rapid consecutive input", () => {
    const engine = createEngine([{ text: "確認します。", kana: "かくにんします。" }]);
    const keys = "kakuninshimasu.";
    const outcomes = Array.from(keys).map((key) => handleKey(engine, key));
    expect(outcomes.includes("miss")).toBe(false);
    expect(isComplete(engine)).toBe(true);
    expect(engine.hits).toBe(keys.length);
  });

  it("assigns leftover readings across two kanji runs in one chunk", () => {
    const engine = createEngine([{ text: "先に共有", kana: "さきにきょうゆう" }]);
    const marks = marksFor(engine);
    expect(marks[0]).toBe("current");
    expect(marks[1]).toBe("pending");
    typeAll(engine, "saki");
    const mid = marksFor(engine);
    expect(mid[0]).toBe("typed");
    expect(mid[1]).toBe("current");
    expect(mid[2]).toBe("pending");
    typeAll(engine, "nikyouyuu");
    expect(isComplete(engine)).toBe(true);
    expect(marksFor(engine).every((mark) => mark === "typed")).toBe(true);
  });

  it("treats yoon kana as one display segment so leftover readings stay on kanji", () => {
    const engine = createEngine([{ text: "レビュー後", kana: "れびゅーご" }]);
    typeAll(engine, "rebyu-go");
    expect(isComplete(engine)).toBe(true);
    expect(marksFor(engine).every((mark) => mark === "typed")).toBe(true);
  });

  it("types っ as a doubled consonant without skipping display kana", () => {
    const engine = createEngine([{ text: "インデックス", kana: "いんでっくす" }]);
    typeAll(engine, "indekkusu");
    expect(isComplete(engine)).toBe(true);
    expect(marksFor(engine).every((mark) => mark === "typed")).toBe(true);
  });

  it("accepts ji and zi for じ", () => {
    const a = createEngine([{ text: "じ", kana: "じ" }]);
    typeAll(a, "ji");
    expect(isComplete(a)).toBe(true);
    const b = createEngine([{ text: "じ", kana: "じ" }]);
    typeAll(b, "zi");
    expect(isComplete(b)).toBe(true);
  });

  it("accepts sha/sya, ja/jya/zya, and cha/tya/cya", () => {
    for (const keys of ["sha", "sya"]) {
      const engine = createEngine([{ text: "しゃ", kana: "しゃ" }]);
      typeAll(engine, keys);
      expect(isComplete(engine), keys).toBe(true);
    }
    for (const keys of ["ja", "jya", "zya"]) {
      const engine = createEngine([{ text: "じゃ", kana: "じゃ" }]);
      typeAll(engine, keys);
      expect(isComplete(engine), keys).toBe(true);
    }
    for (const keys of ["cha", "tya", "cya"]) {
      const engine = createEngine([{ text: "ちゃ", kana: "ちゃ" }]);
      typeAll(engine, keys);
      expect(isComplete(engine), keys).toBe(true);
    }
  });

  it("accepts x/l spellings for small kana", () => {
    for (const keys of ["xya", "lya"]) {
      const engine = createEngine([{ text: "ゃ", kana: "ゃ" }]);
      typeAll(engine, keys);
      expect(isComplete(engine), keys).toBe(true);
    }
    for (const keys of ["xa", "la"]) {
      const engine = createEngine([{ text: "ぁ", kana: "ぁ" }]);
      typeAll(engine, keys);
      expect(isComplete(engine), keys).toBe(true);
    }
  });

  it("types まって as matte and っ as xtu/ltu", () => {
    const matte = createEngine([{ text: "まって", kana: "まって" }]);
    typeAll(matte, "matte");
    expect(isComplete(matte)).toBe(true);

    const xtu = createEngine([{ text: "まって", kana: "まって" }]);
    typeAll(xtu, "maxtute");
    expect(isComplete(xtu)).toBe(true);

    const ltu = createEngine([{ text: "きって", kana: "きって" }]);
    typeAll(ltu, "kiltute");
    expect(isComplete(ltu)).toBe(true);
  });

  it("accepts n/nn/n' for ん without swallowing the next vowel", () => {
    const safe = createEngine([{ text: "かん", kana: "かん" }]);
    typeAll(safe, "kan");
    expect(isComplete(safe)).toBe(true);

    const nn = createEngine([{ text: "かんあ", kana: "かんあ" }]);
    typeAll(nn, "kanna");
    expect(isComplete(nn)).toBe(true);

    const apostrophe = createEngine([{ text: "かんあ", kana: "かんあ" }]);
    typeAll(apostrophe, "kan'a");
    expect(isComplete(apostrophe)).toBe(true);

    const swallowed = createEngine([{ text: "かんあ", kana: "かんあ" }]);
    typeAll(swallowed, "kana");
    expect(isComplete(swallowed)).toBe(false);
  });

  it("accepts common foreign-sound IME spellings", () => {
    for (const keys of ["thi", "texi", "teli"]) {
      const engine = createEngine([{ text: "てぃ", kana: "てぃ" }]);
      typeAll(engine, keys);
      expect(isComplete(engine), keys).toBe(true);
    }
    for (const keys of ["dhi", "dexi", "deli"]) {
      const engine = createEngine([{ text: "でぃ", kana: "でぃ" }]);
      typeAll(engine, keys);
      expect(isComplete(engine), keys).toBe(true);
    }
    for (const keys of ["fa", "fuxa", "fula"]) {
      const engine = createEngine([{ text: "ふぁ", kana: "ふぁ" }]);
      typeAll(engine, keys);
      expect(isComplete(engine), keys).toBe(true);
    }
    for (const keys of ["wi", "uxi", "uli"]) {
      const engine = createEngine([{ text: "うぃ", kana: "うぃ" }]);
      typeAll(engine, keys);
      expect(isComplete(engine), keys).toBe(true);
    }
  });

  it("keeps the representative guide while accepting another spelling", () => {
    const engine = createEngine([{ text: "し", kana: "し" }]);
    expect(
      romajiGuideChars(engine)
        .map((item) => item.ch)
        .join(""),
    ).toBe("shi");
    expect(handleKey(engine, "s")).toBe("hit");
    expect(
      romajiGuideChars(engine)
        .map((item) => item.ch)
        .join(""),
    ).toBe("shi");
    expect(handleKey(engine, "i")).toBe("complete");
    expect(isComplete(engine)).toBe(true);
  });

  it("treats a valid prefix as a hit and an unknown prefix as a miss", () => {
    const engine = createEngine([{ text: "ちゃ", kana: "ちゃ" }]);
    expect(handleKey(engine, "t")).toBe("hit");
    expect(handleKey(engine, "y")).toBe("hit");
    expect(handleKey(engine, "x")).toBe("miss");
    expect(handleKey(engine, "a")).toBe("complete");
  });

  it("keeps romaji guide progress in sync with the engine", () => {
    const engine = createEngine([
      { text: "確", kana: "かく" },
      { text: "認", kana: "にん" },
      { text: "します。", kana: "します。" },
    ]);
    typeAll(engine, "kaku");
    const chars = romajiGuideChars(engine);
    const current = chars.findIndex((item) => item.mark === "current");
    expect(current).toBeGreaterThan(0);
    expect(chars.slice(0, current).every((item) => item.mark === "typed")).toBe(true);
    expect(chars.slice(current + 1).every((item) => item.mark === "pending")).toBe(true);
    const progress = guideProgress(engine);
    expect(progress.current).toBe(1);
    expect(progress.typed).toBeGreaterThan(0);
    expect(progress.pending).toBeGreaterThan(0);
    typeAll(engine, "ninshimasu.");
    expect(guideProgress(engine).pending).toBe(0);
    expect(isComplete(engine)).toBe(true);
  });
});
