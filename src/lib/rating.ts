import type { Difficulty, Rank } from "../shared/types";

export const RATING = {
  speedMax: 45,
  accuracyMax: 40,
  jobsMax: 15,
  speedTarget: {
    beginner: 300,
    intermediate: 270,
    advanced: 240,
  } satisfies Record<Difficulty, number>,
  speedFloor: {
    beginner: 50,
    intermediate: 45,
    advanced: 40,
  } satisfies Record<Difficulty, number>,
  jobsTarget: {
    beginner: 10,
    intermediate: 7,
    advanced: 5,
  } satisfies Record<Difficulty, number>,
  rankThresholds: {
    SS: 90,
    S: 80,
    A: 68,
    B: 55,
  },
  accuracyCurve: [
    [0, 0],
    [0.8, 3],
    [0.85, 8],
    [0.9, 22],
    [0.92, 27],
    [0.94, 32],
    [0.96, 36],
    [0.98, 39],
    [1, 40],
  ] as Array<[number, number]>,
  titles: {
    C: "新米エンジニア",
    B: "戦力化エンジニア",
    A: "頼れるエンジニア",
    S: "つよつよエンジニア",
    SS: "フルスタックエース",
  } satisfies Record<Rank, string>,
  comment: {
    fastScore: 32,
    slowScore: 18,
    highAccuracy: 0.96,
    lowAccuracy: 0.9,
  },
} as const;

export type RatingBreakdown = {
  totalScore: number;
  speedScore: number;
  accuracyScore: number;
  jobsScore: number;
  rank: Rank;
  title: string;
  comment: string;
};

export type RatingInput = {
  difficulty: Difficulty;
  speed: number;
  accuracy: number;
  jobsCompleted: number;
  maxCombo?: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

function alongCurve(value: number, points: ReadonlyArray<[number, number]>): number {
  if (points.length === 0) return 0;
  const first = points[0]!;
  const last = points[points.length - 1]!;
  if (value <= first[0]) return first[1];
  if (value >= last[0]) return last[1];
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]!;
    const next = points[i]!;
    if (value <= next[0]) {
      const t = (value - prev[0]) / (next[0] - prev[0] || 1);
      return lerp(prev[1], next[1], t);
    }
  }
  return last[1];
}

export function speedScoreOf(difficulty: Difficulty, speed: number): number {
  const floor = RATING.speedFloor[difficulty];
  const target = RATING.speedTarget[difficulty];
  const ratio = clamp((speed - floor) / (target - floor), 0, 1);
  return Math.round(ratio * RATING.speedMax * 10) / 10;
}

export function accuracyScoreOf(accuracy: number): number {
  const score = alongCurve(clamp(accuracy, 0, 1), RATING.accuracyCurve);
  return Math.round(Math.min(score, RATING.accuracyMax) * 10) / 10;
}

export function jobsScoreOf(difficulty: Difficulty, jobsCompleted: number): number {
  const target = RATING.jobsTarget[difficulty];
  const ratio = clamp(jobsCompleted / target, 0, 1);
  return Math.round(ratio * RATING.jobsMax * 10) / 10;
}

export function rankForScore(totalScore: number): Rank {
  if (totalScore >= RATING.rankThresholds.SS) return "SS";
  if (totalScore >= RATING.rankThresholds.S) return "S";
  if (totalScore >= RATING.rankThresholds.A) return "A";
  if (totalScore >= RATING.rankThresholds.B) return "B";
  return "C";
}

export function commentFor(
  input: RatingInput,
  scores: Pick<RatingBreakdown, "speedScore" | "accuracyScore">,
): string {
  const fast = scores.speedScore >= RATING.comment.fastScore;
  const slow = scores.speedScore <= RATING.comment.slowScore;
  const precise = input.accuracy >= RATING.comment.highAccuracy;
  const sloppy = input.accuracy < RATING.comment.lowAccuracy;
  const busy = input.jobsCompleted >= RATING.jobsTarget[input.difficulty];
  const combo = (input.maxCombo ?? 0) >= 40;

  if (fast && precise) {
    return combo
      ? "高速かつ正確。コンボも安定していて、チームからの信頼が止まりません。"
      : "高速かつ正確。チームからの信頼が止まりません。";
  }
  if (fast && sloppy) {
    return "処理速度は一級品。ミスを減らせばさらに年収を伸ばせそうです。";
  }
  if (slow && precise) {
    return "丁寧で安定した仕事ぶり。次は返信速度を上げてみましょう。";
  }
  if (slow && sloppy) {
    return "まずは正確な入力を意識して、安定して返信をこなしていきましょう。";
  }
  if (fast) {
    return "速い仕事は魅力的です。正確性を整えれば、次のランクが見えてきます。";
  }
  if (precise) {
    return busy
      ? "丁寧に返信を回せています。もう少し早めると、年収の伸びしろがあります。"
      : "正確な仕事は信頼されます。もう少し返信を早めてみましょう。";
  }
  if (sloppy) {
    return "処理は進んでいます。ミスを減らすと、評価も年収も一気に安定します。";
  }
  return "速度と正確性のバランスを整えれば、もっと安定して伸ばせるはずです。";
}

export function evaluatePlay(input: RatingInput): RatingBreakdown {
  const speedScore = speedScoreOf(input.difficulty, input.speed);
  const accuracyScore = accuracyScoreOf(input.accuracy);
  const jobsScore = jobsScoreOf(input.difficulty, input.jobsCompleted);
  const totalScore = Math.round((speedScore + accuracyScore + jobsScore) * 10) / 10;
  const clamped = clamp(totalScore, 0, 100);
  const rank = rankForScore(clamped);
  return {
    totalScore: clamped,
    speedScore,
    accuracyScore,
    jobsScore,
    rank,
    title: RATING.titles[rank],
    comment: commentFor(input, { speedScore, accuracyScore }),
  };
}
