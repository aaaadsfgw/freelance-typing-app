import type { Difficulty, PlayResult, Question, SavedPlay } from "../shared/types";

export async function fetchQuestions(difficulty: Difficulty): Promise<Question[]> {
  const res = await fetch(`/api/questions?difficulty=${difficulty}`);
  if (!res.ok) throw new Error("questions");
  return res.json() as Promise<Question[]>;
}

export async function savePlay(anonymousId: string, play: PlayResult): Promise<void> {
  await fetch("/api/plays", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ anonymousId, ...play }),
  });
}

export async function fetchPlays(anonymousId: string): Promise<SavedPlay[]> {
  const res = await fetch(`/api/plays?anonymousId=${encodeURIComponent(anonymousId)}`);
  if (!res.ok) throw new Error("plays");
  return res.json() as Promise<SavedPlay[]>;
}
