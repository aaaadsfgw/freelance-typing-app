CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_role TEXT NOT NULL,
  client_icon TEXT NOT NULL,
  project_name TEXT NOT NULL,
  request_text TEXT NOT NULL,
  reply_text TEXT NOT NULL,
  reply_reading TEXT NOT NULL,
  reply_chunks TEXT NOT NULL
);

CREATE TABLE plays (
  id TEXT PRIMARY KEY,
  anonymous_id TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  revenue INTEGER NOT NULL,
  speed REAL NOT NULL,
  accuracy REAL NOT NULL,
  misses INTEGER NOT NULL,
  max_combo INTEGER NOT NULL,
  jobs_completed INTEGER NOT NULL,
  avg_reward INTEGER NOT NULL,
  rank_label TEXT NOT NULL,
  comment TEXT NOT NULL,
  key_stats TEXT NOT NULL,
  finger_stats TEXT NOT NULL,
  bigram_stats TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX plays_anonymous_id ON plays (anonymous_id, created_at);
