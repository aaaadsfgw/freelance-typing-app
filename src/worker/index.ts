import { Hono } from "hono";
import type { Difficulty, Question, ReplyChunk } from "../shared/types";

type Bindings = { DB: D1Database };

type QuestionRow = {
  id: string;
  difficulty: Difficulty;
  category: string;
  client_name: string;
  client_role: string;
  client_icon: string;
  project_name: string;
  request_text: string;
  reply_text: string;
  reply_reading: string;
  reply_chunks: string;
};

type PlayBody = {
  anonymousId: string;
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
  keyStats: unknown;
  fingerStats: unknown;
  bigramStats: unknown;
};

const app = new Hono<{ Bindings: Bindings }>();

function mapQuestion(row: QuestionRow): Question {
  return {
    id: row.id,
    difficulty: row.difficulty,
    category: row.category,
    clientName: row.client_name,
    clientRole: row.client_role,
    clientIcon: row.client_icon,
    projectName: row.project_name,
    requestText: row.request_text,
    replyText: row.reply_text,
    replyReading: row.reply_reading,
    chunks: JSON.parse(row.reply_chunks) as ReplyChunk[],
  };
}

app.get("/api/questions", async (c) => {
  const difficulty = (c.req.query("difficulty") ?? "beginner") as Difficulty;
  const result = await c.env.DB.prepare("SELECT * FROM questions WHERE difficulty = ? ORDER BY id")
    .bind(difficulty)
    .all<QuestionRow>();
  return c.json(result.results.map(mapQuestion));
});

app.post("/api/plays", async (c) => {
  const body = await c.req.json<PlayBody>();
  if (!body.anonymousId || !body.difficulty) {
    return c.json({ error: "invalid" }, 400);
  }
  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO plays (
      id, anonymous_id, difficulty, revenue, speed, accuracy, misses, max_combo,
      jobs_completed, avg_reward, rank_label, comment, key_stats, finger_stats, bigram_stats, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      body.anonymousId,
      body.difficulty,
      body.revenue,
      body.speed,
      body.accuracy,
      body.misses,
      body.maxCombo,
      body.jobsCompleted,
      body.avgReward,
      body.rankLabel,
      body.comment,
      JSON.stringify(body.keyStats ?? {}),
      JSON.stringify(body.fingerStats ?? {}),
      JSON.stringify(body.bigramStats ?? {}),
      new Date().toISOString(),
    )
    .run();
  return c.json({ id });
});

app.get("/api/plays", async (c) => {
  const anonymousId = c.req.query("anonymousId");
  if (!anonymousId) return c.json({ error: "anonymousId required" }, 400);
  const result = await c.env.DB.prepare(
    "SELECT * FROM plays WHERE anonymous_id = ? ORDER BY created_at DESC LIMIT 30",
  )
    .bind(anonymousId)
    .all();
  return c.json(
    result.results.map((row) => ({
      id: row.id,
      difficulty: row.difficulty,
      revenue: row.revenue,
      speed: row.speed,
      accuracy: row.accuracy,
      misses: row.misses,
      maxCombo: row.max_combo,
      jobsCompleted: row.jobs_completed,
      avgReward: row.avg_reward,
      rankLabel: row.rank_label,
      comment: row.comment,
      keyStats: JSON.parse(String(row.key_stats)),
      fingerStats: JSON.parse(String(row.finger_stats)),
      bigramStats: JSON.parse(String(row.bigram_stats)),
      createdAt: row.created_at,
    })),
  );
});

export default app;
