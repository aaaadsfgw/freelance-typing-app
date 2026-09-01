import type { Difficulty } from "../shared/types";

const BASE: Record<Difficulty, number> = {
  beginner: 8000,
  intermediate: 14000,
  advanced: 22000,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calcReward(input: {
  difficulty: Difficulty;
  charCount: number;
  hits: number;
  misses: number;
  elapsedMs: number;
}): number {
  const elapsedSec = Math.max(input.elapsedMs / 1000, 0.8);
  const kpm = (input.hits / elapsedSec) * 60;
  const accuracy = input.hits + input.misses === 0 ? 1 : input.hits / (input.hits + input.misses);
  const lengthFactor = clamp(0.7 + input.charCount / 70, 0.75, 1.55);
  const speedFactor = clamp(0.8 + (kpm - 200) / 500, 0.8, 1.3);
  const accuracyFactor = 0.75 + accuracy * 0.3;
  const raw = BASE[input.difficulty] * lengthFactor * speedFactor * accuracyFactor;
  return Math.max(2000, Math.round(raw / 500) * 500);
}

export function formatYen(value: number): string {
  return `¥${value.toLocaleString("ja-JP")}`;
}

export function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
