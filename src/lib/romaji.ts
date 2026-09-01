import type { ReplyChunk } from "../shared/types";

const KANA_BASE: Record<string, string[]> = {
  あ: ["a"],
  い: ["i", "yi"],
  う: ["u", "wu", "whu"],
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
  ゐ: ["wyi"],
  ゑ: ["wye"],
  を: ["wo", "o"],
  ん: ["nn", "n", "xn", "n'"],
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
  ぁ: ["xa", "la"],
  ぃ: ["xi", "li", "xyi", "lyi"],
  ぅ: ["xu", "lu"],
  ぇ: ["xe", "le", "xye", "lye"],
  ぉ: ["xo", "lo"],
  ゃ: ["xya", "lya"],
  ゅ: ["xyu", "lyu"],
  ょ: ["xyo", "lyo"],
  ゎ: ["xwa", "lwa"],
  っ: ["xtu", "ltu", "xtsu", "ltsu"],
  ー: ["-", "ー"],
  きゃ: ["kya"],
  きぃ: ["kyi"],
  きゅ: ["kyu"],
  きぇ: ["kye"],
  きょ: ["kyo"],
  しゃ: ["sha", "sya"],
  しぃ: ["syi", "shyi"],
  しゅ: ["shu", "syu"],
  しぇ: ["she", "sye"],
  しょ: ["sho", "syo"],
  ちゃ: ["cha", "tya", "cya"],
  ちぃ: ["tyi", "cyi"],
  ちゅ: ["chu", "tyu", "cyu"],
  ちぇ: ["che", "tye", "cye"],
  ちょ: ["cho", "tyo", "cyo"],
  にゃ: ["nya"],
  にぃ: ["nyi"],
  にゅ: ["nyu"],
  にぇ: ["nye"],
  にょ: ["nyo"],
  ひゃ: ["hya"],
  ひぃ: ["hyi"],
  ひゅ: ["hyu"],
  ひぇ: ["hye"],
  ひょ: ["hyo"],
  みゃ: ["mya"],
  みぃ: ["myi"],
  みゅ: ["myu"],
  みぇ: ["mye"],
  みょ: ["myo"],
  りゃ: ["rya"],
  りぃ: ["ryi"],
  りゅ: ["ryu"],
  りぇ: ["rye"],
  りょ: ["ryo"],
  ぎゃ: ["gya"],
  ぎぃ: ["gyi"],
  ぎゅ: ["gyu"],
  ぎぇ: ["gye"],
  ぎょ: ["gyo"],
  じゃ: ["ja", "jya", "zya"],
  じぃ: ["jyi", "zyi"],
  じゅ: ["ju", "jyu", "zyu"],
  じぇ: ["je", "jye", "zye"],
  じょ: ["jo", "jyo", "zyo"],
  びゃ: ["bya"],
  びぃ: ["byi"],
  びゅ: ["byu"],
  びぇ: ["bye"],
  びょ: ["byo"],
  ぴゃ: ["pya"],
  ぴぃ: ["pyi"],
  ぴゅ: ["pyu"],
  ぴぇ: ["pye"],
  ぴょ: ["pyo"],
  ふぁ: ["fa", "fuxa", "fula", "hwa"],
  ふぃ: ["fi", "fuxi", "fuli", "hwi", "fyi"],
  ふぅ: ["fwu"],
  ふぇ: ["fe", "fuxe", "fule", "hwe", "fye"],
  ふぉ: ["fo", "fuxo", "fulo", "hwo"],
  ふゃ: ["fya"],
  ふゅ: ["fyu"],
  ふょ: ["fyo"],
  てぃ: ["thi", "texi", "teli"],
  てぅ: ["twu"],
  てゅ: ["thu"],
  でぃ: ["dhi", "dexi", "deli"],
  でぅ: ["dwu"],
  でゅ: ["dhu"],
  とぁ: ["twa"],
  とぃ: ["twi"],
  とぅ: ["twu", "toxu", "tolu"],
  とぇ: ["twe"],
  とぉ: ["two"],
  どぁ: ["dwa"],
  どぃ: ["dwi"],
  どぅ: ["dwu", "doxu", "dolu"],
  どぇ: ["dwe"],
  どぉ: ["dwo"],
  うぁ: ["wha", "uxa", "ula"],
  うぃ: ["wi", "uxi", "uli", "whi"],
  うぇ: ["we", "uxe", "ule", "whe"],
  うぉ: ["who", "uxo", "ulo"],
  ゔ: ["vu"],
  ゔぁ: ["va", "vuxa", "vula"],
  ゔぃ: ["vi", "vuxi", "vuli", "vyi"],
  ゔぇ: ["ve", "vuxe", "vule", "vye"],
  ゔぉ: ["vo", "vuxo", "vulo"],
  ゔゅ: ["vyu"],
  くぁ: ["qa", "kwa", "kuxa", "kula", "qwa"],
  くぃ: ["qi", "kwi", "kuxi", "kuli", "qyi", "qwi"],
  くぅ: ["qwu"],
  くぇ: ["qe", "kwe", "kuxe", "kule", "qye", "qwe"],
  くぉ: ["qo", "kwo", "kuxo", "kulo", "qwo"],
  くゎ: ["kwa"],
  ぐぁ: ["gwa", "guxa", "gula"],
  ぐぃ: ["gwi", "guxi", "guli"],
  ぐぇ: ["gwe", "guxe", "gule"],
  ぐぉ: ["gwo", "guxo", "gulo"],
  つぁ: ["tsa", "tuxa", "tula"],
  つぃ: ["tsi", "tuxi", "tuli"],
  つぇ: ["tse", "tuxe", "tule"],
  つぉ: ["tso", "tuxo", "tulo"],
  いぇ: ["ye", "ixe", "ile"],
};

function isSmallYoonChar(ch: string): boolean {
  return "ぁぃぅぇぉゃゅょァィゥェォャュョゎヮ".includes(ch);
}

function uniqueSpellings(items: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const key = item.toLowerCase();
    if (!item || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function expandImeSpellings(table: Record<string, string[]>): Record<string, string[]> {
  const next: Record<string, string[]> = { ...table };
  for (const key of Object.keys(table)) {
    const chars = Array.from(key);
    if (chars.length !== 2) continue;
    const [head, tail] = chars;
    if (!head || !tail || !isSmallYoonChar(tail)) continue;
    const headSpells = table[head] ?? [];
    const tailSpells = table[tail] ?? [];
    if (headSpells.length === 0 || tailSpells.length === 0) continue;
    const composed = headSpells.flatMap((a) => tailSpells.map((b) => `${a}${b}`));
    next[key] = uniqueSpellings([...(table[key] ?? []), ...composed]);
  }
  return next;
}

const KANA = expandImeSpellings(KANA_BASE);

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
};

export type KeyOutcome = "hit" | "miss" | "ignore" | "complete";

export type DisplayMark = "typed" | "current" | "pending";

export type TypeUnit = {
  spellings: string[];
  preferred: string;
  skip: boolean;
  displayFrom: number;
  displayTo: number;
  chosen?: string;
};

export type GuideChar = {
  ch: string;
  mark: DisplayMark;
};

export type TypingEngine = {
  display: string;
  units: TypeUnit[];
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

function isSpace(ch: string): boolean {
  return ch === " " || ch === "\u3000";
}

function isAsciiLetter(ch: string): boolean {
  return /[A-Za-z]/.test(ch);
}

function isSmallYoon(ch: string): boolean {
  return isSmallYoonChar(ch);
}

function isKanaChar(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return (
    (code >= 0x3041 && code <= 0x3096) ||
    (code >= 0x30a1 && code <= 0x30f6) ||
    ch === "ー" ||
    ch === "・"
  );
}

function isAsciiGlyph(ch: string): boolean {
  return ch.charCodeAt(0) < 128 && !isSpace(ch);
}

function isKanjiChar(ch: string): boolean {
  return !isSpace(ch) && !isAsciiGlyph(ch) && !isKanaChar(ch) && !PUNCT[ch];
}

function spellingsFor(token: string): string[] {
  if (KANA[token]) return KANA[token];
  if (PUNCT[token]) return PUNCT[token];
  if (token.length === 1 && isAsciiLetter(token)) {
    const lower = token.toLowerCase();
    const upper = token.toUpperCase();
    return lower === upper ? [token] : [token, token === lower ? upper : lower];
  }
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
    if (src[i] === "っ") {
      const restSrc = src.slice(i + 1);
      const rest = restSrc.length > 0 ? tokenizeKana(restSrc, look) : [];
      const next = rest[0] ?? (look ? tokenizeKana(look, "")[0] : undefined) ?? ["a"];
      const consonants = [
        ...new Set(
          next.map((s) => s[0] ?? "").filter((c) => c && /[bcdfghjklmnpqrstvwxyz]/i.test(c)),
        ),
      ];
      out.push(
        consonants.length > 0
          ? [...consonants, "xtu", "ltu", "xtsu", "ltsu"]
          : ["xtu", "ltu", "xtsu", "ltsu"],
      );
      out.push(...rest);
      break;
    }
    if (src[i] === "ん") {
      const next = src[i + 1] ?? look;
      const nextNeedNn = !next || /[あいうえおやゆよんaiueowy]/i.test(toHiragana(next));
      out.push(nextNeedNn ? ["nn", "xn", "n'"] : ["nn", "n", "xn", "n'"]);
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

type DisplaySeg = {
  kind: "space" | "single" | "kanji";
  from: number;
  to: number;
};

function displaySegs(chars: string[]): DisplaySeg[] {
  const out: DisplaySeg[] = [];
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i] ?? "";
    if (isSpace(ch)) {
      out.push({ kind: "space", from: i, to: i + 1 });
      i += 1;
      continue;
    }
    if (isKanjiChar(ch)) {
      const from = i;
      while (i < chars.length && isKanjiChar(chars[i] ?? "")) i += 1;
      out.push({ kind: "kanji", from, to: i });
      continue;
    }
    if (isKanaChar(ch) && isSmallYoon(chars[i + 1] ?? "")) {
      out.push({ kind: "single", from: i, to: i + 2 });
      i += 2;
      continue;
    }
    out.push({ kind: "single", from: i, to: i + 1 });
    i += 1;
  }
  return out;
}

function kanjiTakes(
  leftover: number,
  charCount: number,
  kanjiCharsLeft: number,
  last: boolean,
): number {
  if (last || leftover <= 0) return Math.max(leftover, 0);
  const share = Math.max(1, Math.round((leftover * charCount) / kanjiCharsLeft));
  return Math.min(leftover, share);
}

function makeUnit(
  spellings: string[],
  displayFrom: number,
  displayTo: number,
  skip = false,
): TypeUnit {
  return {
    spellings,
    preferred: spellings[0] ?? "",
    skip,
    displayFrom,
    displayTo,
  };
}

function alignChunk(text: string, morae: string[][], displayOffset: number): TypeUnit[] {
  const chars = Array.from(text);
  const segs = displaySegs(chars);
  const nonKanji = segs.filter((seg) => seg.kind !== "kanji").length;
  let leftover = Math.max(0, morae.length - nonKanji);
  let kanjiCharsLeft = segs
    .filter((seg) => seg.kind === "kanji")
    .reduce((sum, seg) => sum + (seg.to - seg.from), 0);
  let kanjiLeft = segs.filter((seg) => seg.kind === "kanji").length;
  const units: TypeUnit[] = [];
  let moraIdx = 0;
  for (const seg of segs) {
    const from = displayOffset + seg.from;
    const to = displayOffset + seg.to;
    if (seg.kind === "space") {
      if (moraIdx < morae.length && isSpace(morae[moraIdx]?.[0] ?? "")) moraIdx += 1;
      units.push(makeUnit([" "], from, to, true));
      continue;
    }
    if (seg.kind === "single") {
      units.push(makeUnit(morae[moraIdx] ?? spellingsFor(chars[seg.from] ?? ""), from, to));
      moraIdx += 1;
      continue;
    }
    const charCount = seg.to - seg.from;
    kanjiLeft -= 1;
    const take = kanjiTakes(leftover, charCount, Math.max(kanjiCharsLeft, 1), kanjiLeft === 0);
    leftover -= take;
    kanjiCharsLeft -= charCount;
    const count = take > 0 ? take : moraIdx < morae.length ? 1 : 0;
    for (let n = 0; n < count && moraIdx < morae.length; n += 1) {
      units.push(makeUnit(morae[moraIdx] ?? [chars[seg.from] ?? ""], from, to));
      moraIdx += 1;
    }
  }
  while (moraIdx < morae.length) {
    const last = units[units.length - 1];
    units.push(
      makeUnit(
        morae[moraIdx] ?? [""],
        last?.displayFrom ?? displayOffset,
        last?.displayTo ?? displayOffset + chars.length,
      ),
    );
    moraIdx += 1;
  }
  return units;
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

function charsEqual(expected: string, actual: string): boolean {
  if (isAsciiLetter(expected) && isAsciiLetter(actual)) {
    return expected.toLowerCase() === actual.toLowerCase();
  }
  return expected === actual;
}

function spellingMatches(spelling: string, typed: string): boolean {
  if (typed.length > spelling.length) return false;
  for (let i = 0; i < typed.length; i += 1) {
    if (!charsEqual(spelling[i] ?? "", typed[i] ?? "")) return false;
  }
  return true;
}

function matchingSpellings(spellings: string[], typed: string): string[] {
  return spellings.filter((spelling) => spellingMatches(spelling, typed));
}

function completeSpellings(spellings: string[], typed: string): string[] {
  return matchingSpellings(spellings, typed).filter((spelling) => spelling.length === typed.length);
}

function spellingForGuide(unit: TypeUnit, buffer: string, current: boolean): string {
  if (!current) return unit.chosen ?? unit.preferred;
  if (!buffer) return unit.preferred;
  const matched = matchingSpellings(unit.spellings, buffer);
  if (matched.length === 0) return unit.preferred;
  if (matched.includes(unit.preferred) || spellingMatches(unit.preferred, buffer)) {
    return unit.preferred;
  }
  return matched[0] ?? unit.preferred;
}

function commitUnit(engine: TypingEngine, spelling: string) {
  const unit = engine.units[engine.moraIndex];
  if (unit) unit.chosen = spelling;
  engine.moraIndex += 1;
  engine.buffer = "";
  skipReady(engine);
}

function skipReady(engine: TypingEngine) {
  while (engine.moraIndex < engine.units.length && engine.units[engine.moraIndex]?.skip) {
    engine.moraIndex += 1;
  }
}

export function createEngine(chunks: ReplyChunk[]): TypingEngine {
  const display = chunks.map((c) => c.text).join("");
  const units: TypeUnit[] = [];
  let offset = 0;
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += 1) {
    const chunk = chunks[chunkIndex]!;
    const nextKana = chunks[chunkIndex + 1]?.kana ?? "";
    const tokenized = tokenizeKana(chunk.kana, nextKana[0] ?? "");
    const aligned = alignChunk(
      chunk.text,
      tokenized.length > 0 ? tokenized : [spellingsFor(chunk.kana || chunk.text)],
      offset,
    );
    units.push(...aligned);
    offset += Array.from(chunk.text).length;
  }
  const engine: TypingEngine = {
    display,
    units,
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
  skipReady(engine);
  return engine;
}

export function cloneEngine(engine: TypingEngine): TypingEngine {
  return {
    ...engine,
    units: engine.units.map((unit) => ({ ...unit, spellings: [...unit.spellings] })),
    keyStats: { ...engine.keyStats },
    fingerStats: { ...engine.fingerStats },
    bigramStats: { ...engine.bigramStats },
  };
}

export function isComplete(engine: TypingEngine): boolean {
  skipReady(engine);
  return engine.moraIndex >= engine.units.length;
}

export function currentGuide(engine: TypingEngine, count = 8): string {
  return romajiGuideChars(engine)
    .filter((item) => item.mark !== "typed")
    .slice(0, count * 4)
    .map((item) => item.ch)
    .join("");
}

export function romajiGuideChars(engine: TypingEngine): GuideChar[] {
  const out: GuideChar[] = [];
  for (let i = 0; i < engine.units.length; i += 1) {
    const unit = engine.units[i]!;
    if (unit.skip) {
      out.push({ ch: " ", mark: i < engine.moraIndex ? "typed" : "pending" });
      continue;
    }
    const current = i === engine.moraIndex;
    const spelling = spellingForGuide(unit, engine.buffer, current);
    for (let j = 0; j < spelling.length; j += 1) {
      let mark: DisplayMark = "pending";
      if (i < engine.moraIndex) mark = "typed";
      else if (current) {
        if (j < engine.buffer.length) mark = "typed";
        else if (j === engine.buffer.length) mark = "current";
        else mark = "pending";
      }
      out.push({ ch: spelling[j] ?? "", mark });
    }
  }
  return out;
}

export function marksFor(engine: TypingEngine): DisplayMark[] {
  const marks: DisplayMark[] = Array.from(engine.display).map(() => "pending");
  for (let i = 0; i < engine.units.length; i += 1) {
    const unit = engine.units[i]!;
    for (let d = unit.displayFrom; d < unit.displayTo; d += 1) {
      const covering = engine.units.filter((u) => d >= u.displayFrom && d < u.displayTo && !u.skip);
      if (covering.length === 0) {
        marks[d] = "typed";
        continue;
      }
      const first = engine.units.indexOf(covering[0]!);
      const last = engine.units.indexOf(covering[covering.length - 1]!);
      if (engine.moraIndex > last) marks[d] = "typed";
      else if (engine.moraIndex >= first && engine.moraIndex <= last) marks[d] = "current";
      else marks[d] = "pending";
    }
  }
  return marks;
}

export function handleKey(engine: TypingEngine, key: string): KeyOutcome {
  return consumeKey(engine, key, false);
}

function consumeKey(engine: TypingEngine, key: string, replay: boolean): KeyOutcome {
  if (key.length !== 1) return "ignore";
  skipReady(engine);
  if (isComplete(engine)) return "complete";
  if (isSpace(key)) return "ignore";

  const unit = engine.units[engine.moraIndex];
  if (!unit) return "complete";
  const next = engine.buffer + key;
  const matched = matchingSpellings(unit.spellings, next);
  const phys = physicalKey(key);
  const finger = FINGER[phys];

  if (matched.length === 0) {
    const ready = completeSpellings(unit.spellings, engine.buffer);
    if (!replay && ready.length > 0) {
      commitUnit(engine, ready[0]!);
      return consumeKey(engine, key, true);
    }
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

  const finished = completeSpellings(unit.spellings, next);
  const longer = matched.some((spelling) => spelling.length > next.length);
  if (finished.length > 0 && !longer) {
    commitUnit(engine, finished[0]!);
  }
  return isComplete(engine) ? "complete" : "hit";
}

export function typeKeys(engine: TypingEngine, keys: string): KeyOutcome {
  let last: KeyOutcome = "ignore";
  for (const key of keys) {
    last = handleKey(engine, key);
  }
  return last;
}

export function accuracyOf(engine: TypingEngine): number {
  const total = engine.hits + engine.misses;
  if (total === 0) return 1;
  return engine.hits / total;
}

export function guideProgress(engine: TypingEngine): {
  typed: number;
  current: number;
  pending: number;
} {
  const chars = romajiGuideChars(engine);
  return {
    typed: chars.filter((c) => c.mark === "typed").length,
    current: chars.filter((c) => c.mark === "current").length,
    pending: chars.filter((c) => c.mark === "pending").length,
  };
}
