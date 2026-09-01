import type { ReplyChunk } from "../shared/types";

const KANA: Record<string, string[]> = {
  あ: ["a"],
  い: ["i"],
  う: ["u", "wu"],
  え: ["e"],
  お: ["o"],
  か: ["ka", "ca"],
  き: ["ki"],
  く: ["ku", "cu", "qu"],
  け: ["ke"],
  こ: ["ko", "co"],
  さ: ["sa"],
  し: ["shi", "si", "ci"],
  す: ["su"],
  せ: ["se", "ce"],
  そ: ["so"],
  た: ["ta"],
  ち: ["chi", "ti"],
  つ: ["tsu", "tu"],
  て: ["te"],
  と: ["to"],
  な: ["na"],
  に: ["ni"],
  ぬ: ["nu"],
  ね: ["ne"],
  の: ["no"],
  は: ["ha"],
  ひ: ["hi"],
  ふ: ["fu", "hu"],
  へ: ["he"],
  ほ: ["ho"],
  ま: ["ma"],
  み: ["mi"],
  む: ["mu"],
  め: ["me"],
  も: ["mo"],
  や: ["ya"],
  ゆ: ["yu"],
  よ: ["yo"],
  ら: ["ra"],
  り: ["ri"],
  る: ["ru"],
  れ: ["re"],
  ろ: ["ro"],
  わ: ["wa"],
  を: ["wo", "o"],
  ん: ["n", "nn", "xn"],
  が: ["ga"],
  ぎ: ["gi"],
  ぐ: ["gu"],
  げ: ["ge"],
  ご: ["go"],
  ざ: ["za"],
  じ: ["ji", "zi"],
  ず: ["zu"],
  ぜ: ["ze"],
  ぞ: ["zo"],
  だ: ["da"],
  ぢ: ["di", "ji"],
  づ: ["du", "zu"],
  で: ["de"],
  ど: ["do"],
  ば: ["ba"],
  び: ["bi"],
  ぶ: ["bu"],
  べ: ["be"],
  ぼ: ["bo"],
  ぱ: ["pa"],
  ぴ: ["pi"],
  ぷ: ["pu"],
  ぺ: ["pe"],
  ぽ: ["po"],
  ぁ: ["la", "xa"],
  ぃ: ["li", "xi", "lyi", "xyi"],
  ぅ: ["lu", "xu"],
  ぇ: ["le", "xe", "lye", "xye"],
  ぉ: ["lo", "xo"],
  ゃ: ["lya", "xya"],
  ゅ: ["lyu", "xyu"],
  ょ: ["lyo", "xyo"],
  っ: ["xtu", "ltu", "xtsu", "ltsu"],
  ー: ["-", "ー"],
  きゃ: ["kya"],
  きゅ: ["kyu"],
  きょ: ["kyo"],
  しゃ: ["sha", "sya"],
  しゅ: ["shu", "syu"],
  しょ: ["sho", "syo"],
  ちゃ: ["cha", "tya", "cya"],
  ちゅ: ["chu", "tyu", "cyu"],
  ちょ: ["cho", "tyo", "cyo"],
  にゃ: ["nya"],
  にゅ: ["nyu"],
  にょ: ["nyo"],
  ひゃ: ["hya"],
  ひゅ: ["hyu"],
  ひょ: ["hyo"],
  みゃ: ["mya"],
  みゅ: ["myu"],
  みょ: ["myo"],
  りゃ: ["rya"],
  りゅ: ["ryu"],
  りょ: ["ryo"],
  ぎゃ: ["gya"],
  ぎゅ: ["gyu"],
  ぎょ: ["gyo"],
  じゃ: ["ja", "jya", "zya"],
  じゅ: ["ju", "jyu", "zyu"],
  じょ: ["jo", "jyo", "zyo"],
  びゃ: ["bya"],
  びゅ: ["byu"],
  びょ: ["byo"],
  ぴゃ: ["pya"],
  ぴゅ: ["pyu"],
  ぴょ: ["pyo"],
  ふぁ: ["fa", "fua", "hwa"],
  ふぃ: ["fi", "fui", "hwi"],
  ふぇ: ["fe", "fue", "hwe"],
  ふぉ: ["fo", "fuo", "hwo"],
  てぃ: ["thi", "texi", "teli"],
  でぃ: ["dhi", "dexi", "deli"],
  とぅ: ["twu", "toxu", "tolu"],
  うぃ: ["wi", "uxi", "uli"],
  うぇ: ["we", "uxe", "ule"],
  うぉ: ["who", "uxo", "ulo"],
};

const PUNCT: Record<string, string[]> = {
  "。": [".", "。"],
  "、": [",", "、"],
  "？": ["?"],
  "！": ["!"],
  "「": ["["],
  "」": ["]"],
  "・": ["/", "・"],
  "：": [":"],
  "（": ["("],
  "）": [")"],
  "　": [" "],
};

export type KeyOutcome = "hit" | "miss" | "ignore" | "complete";

export type DisplayMark = "typed" | "current" | "pending";

export type TypingEngine = {
  display: string;
  morae: string[][];
  charToMora: number[];
  moraIndex: number;
  buffer: string;
  hits: number;
  misses: number;
  combo: number;
  maxCombo: number;
  keyStats: Record<string, { hits: number; misses: number }>;
  fingerStats: Record<string, { hits: number; misses: number }>;
  bigramStats: Record<string, { hits: number; misses: number }>;
  lastKey: string | null;
  missFlash: boolean;
};

const FINGER: Record<string, string> = {
  "1": "左小指",
  q: "左小指",
  a: "左小指",
  z: "左小指",
  "2": "左薬指",
  w: "左薬指",
  s: "左薬指",
  x: "左薬指",
  "3": "左中指",
  e: "左中指",
  d: "左中指",
  c: "左中指",
  "4": "左人差し指",
  r: "左人差し指",
  f: "左人差し指",
  v: "左人差し指",
  "5": "左人差し指",
  t: "左人差し指",
  g: "左人差し指",
  b: "左人差し指",
  "6": "右人差し指",
  y: "右人差し指",
  h: "右人差し指",
  n: "右人差し指",
  "7": "右人差し指",
  u: "右人差し指",
  j: "右人差し指",
  m: "右人差し指",
  "8": "右中指",
  i: "右中指",
  k: "右中指",
  ",": "右中指",
  "9": "右薬指",
  o: "右薬指",
  l: "右薬指",
  ".": "右薬指",
  "0": "右小指",
  p: "右小指",
  "-": "右小指",
  ";": "右小指",
  "/": "右小指",
};

const SHIFT_BASE: Record<string, string> = {
  "!": "1",
  "#": "3",
  $: "4",
  "%": "5",
  "&": "7",
  "(": "9",
  ")": "0",
  "@": "2",
  _: "-",
  "+": ";",
  "{": "[",
  "}": "]",
  ":": ";",
  '"': "'",
  "<": ",",
  ">": ".",
  "?": "/",
};

function toHiragana(input: string): string {
  return Array.from(input)
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 0x30a1 && code <= 0x30f6) {
        return String.fromCharCode(code - 0x60);
      }
      return ch;
    })
    .join("");
}

function spellingsFor(token: string): string[] {
  if (KANA[token]) return KANA[token];
  if (PUNCT[token]) return PUNCT[token];
  if (token.length === 1) return [token];
  return [token];
}

function tokenizeKana(kana: string, nextAfter = ""): string[][] {
  const src = toHiragana(kana);
  const look = toHiragana(nextAfter);
  const out: string[][] = [];
  let i = 0;
  while (i < src.length) {
    const two = src.slice(i, i + 2);
    if (src[i] === "っ" && i + 1 < src.length) {
      const rest = tokenizeKana(src.slice(i + 1), look);
      const next = rest[0] ?? ["a"];
      const merged = [
        ...new Set(
          next.flatMap((s) => {
            const c = s[0] ?? "";
            return c && /[bcdfghjklmnpqrstvwxyz]/i.test(c)
              ? [`${c}${s}`, `xtu${s}`, `ltu${s}`]
              : [];
          }),
        ),
      ];
      out.push(merged.length > 0 ? merged : ["xtu", "ltu", "xtsu", "ltsu"]);
      out.push(...rest.slice(1));
      break;
    }
    if (src[i] === "ん") {
      const next = src[i + 1] ?? look;
      const nextNeedNn = !next || /[あいうえおやゆよんaiueowny]/i.test(toHiragana(next));
      out.push(nextNeedNn ? ["nn", "xn", "n'"] : ["n", "nn", "xn"]);
      i += 1;
      continue;
    }
    if (KANA[two]) {
      out.push(KANA[two]);
      i += 2;
      continue;
    }
    out.push(spellingsFor(src[i] ?? ""));
    i += 1;
  }
  return out;
}

function physicalKey(input: string): string {
  const lower = input.length === 1 ? input.toLowerCase() : input;
  return SHIFT_BASE[input] ?? lower;
}

function bump(
  map: Record<string, { hits: number; misses: number }>,
  key: string,
  field: "hits" | "misses",
) {
  const row = map[key] ?? { hits: 0, misses: 0 };
  row[field] += 1;
  map[key] = row;
}

export function createEngine(chunks: ReplyChunk[]): TypingEngine {
  const display = chunks.map((c) => c.text).join("");
  const morae: string[][] = [];
  const charToMora: number[] = [];
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += 1) {
    const chunk = chunks[chunkIndex]!;
    const start = morae.length;
    const nextKana = chunks[chunkIndex + 1]?.kana ?? "";
    const tokenized = tokenizeKana(chunk.kana, nextKana[0] ?? "");
    if (tokenized.length === 0) {
      tokenized.push(spellingsFor(chunk.kana || chunk.text));
    }
    morae.push(...tokenized);
    const chars = Array.from(chunk.text);
    chars.forEach((_, idx) => {
      const moraAt = start + Math.min(idx, tokenized.length - 1);
      charToMora.push(moraAt);
    });
  }
  return {
    display,
    morae,
    charToMora,
    moraIndex: 0,
    buffer: "",
    hits: 0,
    misses: 0,
    combo: 0,
    maxCombo: 0,
    keyStats: {},
    fingerStats: {},
    bigramStats: {},
    lastKey: null,
    missFlash: false,
  };
}

export function isComplete(engine: TypingEngine): boolean {
  return engine.moraIndex >= engine.morae.length;
}

export function currentGuide(engine: TypingEngine, count = 8): string {
  if (isComplete(engine)) return "";
  const parts: string[] = [];
  for (let i = engine.moraIndex; i < engine.morae.length && parts.length < count; i += 1) {
    const spell = engine.morae[i]?.[0] ?? "";
    if (i === engine.moraIndex) {
      parts.push(spell.slice(engine.buffer.length));
    } else {
      parts.push(spell);
    }
  }
  return parts.join("");
}

export function marksFor(engine: TypingEngine): DisplayMark[] {
  return Array.from(engine.display).map((_, idx) => {
    const mora = engine.charToMora[idx] ?? 0;
    if (mora < engine.moraIndex) return "typed";
    if (mora === engine.moraIndex) return "current";
    return "pending";
  });
}

export function handleKey(engine: TypingEngine, key: string): KeyOutcome {
  if (key.length !== 1) return "ignore";
  if (isComplete(engine)) return "complete";

  const expected = engine.morae[engine.moraIndex] ?? [];
  const next = engine.buffer + key;
  const matched = expected.filter((s) => s.startsWith(next));
  const phys = physicalKey(key);
  const finger = FINGER[phys];

  if (matched.length === 0) {
    engine.misses += 1;
    engine.combo = 0;
    engine.missFlash = true;
    bump(engine.keyStats, phys, "misses");
    if (finger) bump(engine.fingerStats, finger, "misses");
    if (engine.lastKey) bump(engine.bigramStats, `${engine.lastKey}${phys}`, "misses");
    engine.lastKey = phys;
    return "miss";
  }

  engine.hits += 1;
  engine.combo += 1;
  engine.maxCombo = Math.max(engine.maxCombo, engine.combo);
  engine.missFlash = false;
  engine.buffer = next;
  bump(engine.keyStats, phys, "hits");
  if (finger) bump(engine.fingerStats, finger, "hits");
  if (engine.lastKey) bump(engine.bigramStats, `${engine.lastKey}${phys}`, "hits");
  engine.lastKey = phys;

  if (expected.includes(next)) {
    engine.moraIndex += 1;
    engine.buffer = "";
  }
  return isComplete(engine) ? "complete" : "hit";
}

export function accuracyOf(engine: TypingEngine): number {
  const total = engine.hits + engine.misses;
  if (total === 0) return 1;
  return engine.hits / total;
}
