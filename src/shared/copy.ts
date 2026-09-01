import type { Difficulty } from "./types";

export const APP_NAME = "Dev Desk";
export const CHANNEL_NAME = "#web-app-dev";

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; title: string; body: string; hint: string }
> = {
  beginner: {
    label: "初級",
    title: "新米エンジニア",
    body: "短い返信と簡単なやり取り。まだ少し初々しい。",
    hint: "1〜2文 / 記号少なめ",
  },
  intermediate: {
    label: "中級",
    title: "慣れてきたエンジニア",
    body: "PR / Issue / API などが増える。仕事にも慣れて、ちょっと調子に乗り始める。",
    hint: "2〜3文 / Issue・v1.2",
  },
  advanced: {
    label: "上級",
    title: "つよつよエンジニア",
    body: "長文・技術用語・記号・障害対応。自分の技術力に絶対的な自信がある。",
    hint: "複数文 / リリース判断",
  },
};
