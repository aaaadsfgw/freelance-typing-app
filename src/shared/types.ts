export type Difficulty = "beginner" | "intermediate" | "advanced";

export type ReplyChunk = {
  text: string;
  kana: string;
};

export type Question = {
  id: string;
  difficulty: Difficulty;
  category: string;
  clientName: string;
  clientRole: string;
  clientIcon: string;
  projectName: string;
  requestText: string;
  replyText: string;
  replyReading: string;
  chunks: ReplyChunk[];
};

export type KeyStat = {
  hits: number;
  misses: number;
};

export type PlayResult = {
  difficulty: Difficulty;
  revenue: number;
  speed: number;
  accuracy: number;
  misses: number;
  maxCombo: number;
  jobsCompleted: number;
  avgReward: number;
  rankLabel: string;
  comment: string;
  keyStats: Record<string, KeyStat>;
  fingerStats: Record<string, KeyStat>;
  bigramStats: Record<string, KeyStat>;
};

export type SavedPlay = PlayResult & {
  id: string;
  createdAt: string;
};
