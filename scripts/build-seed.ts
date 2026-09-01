import { QUESTIONS } from "../src/shared/questions.ts";

function esc(value: string): string {
  return value.replaceAll("'", "''");
}

const lines = ["DELETE FROM questions;"];
for (const q of QUESTIONS) {
  lines.push(
    `INSERT INTO questions (id, difficulty, category, client_name, client_role, client_icon, project_name, request_text, reply_text, reply_reading, reply_chunks) VALUES ('${esc(q.id)}', '${esc(q.difficulty)}', '${esc(q.category)}', '${esc(q.clientName)}', '${esc(q.clientRole)}', '${esc(q.clientIcon)}', '${esc(q.projectName)}', '${esc(q.requestText)}', '${esc(q.replyText)}', '${esc(q.replyReading)}', '${esc(JSON.stringify(q.chunks))}');`,
  );
}
process.stdout.write(`${lines.join("\n")}\n`);
