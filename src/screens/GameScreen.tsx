import { useEffect, useMemo, useRef, useState } from "react";
import { absorbEngineStats } from "../lib/analysis";
import {
  accuracyOf,
  cloneEngine,
  createEngine,
  handleKey,
  marksFor,
  romajiGuideChars,
  type TypingEngine,
} from "../lib/romaji";
import { evaluatePlay } from "../lib/rating";
import { calcReward, formatTime, formatYen } from "../lib/reward";
import type { Difficulty, PlayResult, Question } from "../shared/types";

const SESSION_SEC = 90;

type Feedback = {
  reward: number;
  accuracy: number;
  combo: number;
};

type Props = {
  difficulty: Difficulty;
  questions: Question[];
  onFinish: (result: PlayResult) => void;
};

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  return next;
}

export function GameScreen({ difficulty, questions, onFinish }: Props) {
  const queue = useMemo(() => shuffle(questions), [questions]);
  const [index, setIndex] = useState(0);
  const [engine, setEngine] = useState<TypingEngine>(() => createEngine(queue[0]?.chunks ?? []));
  const [left, setLeft] = useState(SESSION_SEC);
  const [revenue, setRevenue] = useState(0);
  const [jobs, setJobs] = useState(0);
  const [guideOn, setGuideOn] = useState(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const totals = useRef({
    hits: 0,
    misses: 0,
    maxCombo: 0,
    revenue: 0,
    jobs: 0,
    keyStats: {} as PlayResult["keyStats"],
    fingerStats: {} as PlayResult["fingerStats"],
    bigramStats: {} as PlayResult["bigramStats"],
  });
  const jobStarted = useRef(Date.now());
  const finished = useRef(false);
  const indexRef = useRef(0);
  const engineRef = useRef(engine);
  const question = queue[index % Math.max(queue.length, 1)];

  useEffect(() => {
    engineRef.current = engine;
  }, [engine]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === " ") event.preventDefault();
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length !== 1 || finished.current) return;
      const next = cloneEngine(engineRef.current);
      const result = handleKey(next, event.key);
      const currentQuestion = queue[indexRef.current % Math.max(queue.length, 1)];
      if (result === "complete" && currentQuestion) {
        const elapsed = Date.now() - jobStarted.current;
        const reward = calcReward({
          difficulty,
          charCount: currentQuestion.replyText.length,
          hits: next.hits,
          misses: next.misses,
          elapsedMs: elapsed,
        });
        absorbEngineStats(totals.current, next, { reward, completedJob: true });
        setRevenue(totals.current.revenue);
        setJobs(totals.current.jobs);
        setFeedback({
          reward,
          accuracy: accuracyOf(next),
          combo: next.maxCombo,
        });
        window.setTimeout(() => setFeedback(null), 900);
        indexRef.current += 1;
        setIndex(indexRef.current);
        const nextQ = queue[indexRef.current % queue.length];
        jobStarted.current = Date.now();
        const fresh = createEngine(nextQ?.chunks ?? []);
        engineRef.current = fresh;
        setEngine(fresh);
        return;
      }
      engineRef.current = next;
      setEngine(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [difficulty, queue]);

  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, SESSION_SEC - (Date.now() - started) / 1000);
      setLeft(Math.ceil(remaining));
      if (remaining <= 0 && !finished.current) {
        finished.current = true;
        absorbEngineStats(totals.current, engineRef.current);
        const hits = totals.current.hits;
        const misses = totals.current.misses;
        const speed = (hits / SESSION_SEC) * 60;
        const accuracy = hits + misses === 0 ? 1 : hits / (hits + misses);
        const avgReward =
          totals.current.jobs === 0 ? 0 : Math.round(totals.current.revenue / totals.current.jobs);
        const rating = evaluatePlay({
          difficulty,
          speed,
          accuracy,
          jobsCompleted: totals.current.jobs,
          maxCombo: totals.current.maxCombo,
        });
        onFinish({
          difficulty,
          revenue: totals.current.revenue,
          speed,
          accuracy,
          misses,
          maxCombo: totals.current.maxCombo,
          jobsCompleted: totals.current.jobs,
          avgReward,
          totalScore: rating.totalScore,
          rank: rating.rank,
          title: rating.title,
          comment: rating.comment,
          speedScore: rating.speedScore,
          accuracyScore: rating.accuracyScore,
          jobsScore: rating.jobsScore,
          keyStats: totals.current.keyStats,
          fingerStats: totals.current.fingerStats,
          bigramStats: totals.current.bigramStats,
        });
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, [difficulty, onFinish]);

  if (!question) {
    return <main className="page">案件を読み込めませんでした。</main>;
  }

  const marks = marksFor(engine);
  const chars = Array.from(engine.display);
  const guide = romajiGuideChars(engine);

  return (
    <main className="c-stage">
      <section className="c-top">
        <div className="c-money">
          <small>今月の売上</small>
          {formatYen(revenue)}
        </div>
        <div className="c-timer">
          <small>残り</small>
          {formatTime(left)}
        </div>
        <div className="c-side-stats">
          <strong className="c-combo">{engine.combo} COMBO</strong>
          <span>完了 {jobs} 件</span>
        </div>
      </section>

      <section className="c-client">
        <div className="avatar">{question.clientIcon}</div>
        <div className="c-client-meta">
          <strong>
            {question.clientName} / {question.clientRole.split(" / ")[0]}
          </strong>
          <span className="role" style={{ color: "var(--muted)", fontSize: 13 }}>
            {question.clientRole}
          </span>
          <span className="chip" style={{ background: "var(--cyan-soft)", color: "var(--cyan)" }}>
            {question.projectName}
          </span>
        </div>
      </section>

      <div className="c-thread">
        <article className="c-request">
          <div className="meta">{question.clientRole.split(" / ")[0]} · 依頼</div>
          <p>{question.requestText}</p>
        </article>

        <section className="c-type-board">
          <div className="c-reply-label">
            <span>あなた · 返信中</span>
            <span>ローマ字で送信</span>
          </div>
          <div className="c-type">
            {chars.map((ch, i) => {
              const mark = marks[i];
              const className =
                mark === "typed"
                  ? "typed"
                  : mark === "current"
                    ? `caret${engine.missFlash ? " miss" : ""}`
                    : "pending";
              return (
                <span key={`${ch}-${i}`} className={className}>
                  {ch}
                </span>
              );
            })}
          </div>
          {guideOn ? (
            <div className="c-romaji-full" aria-label="ローマ字ガイド">
              {guide.map((item, i) => (
                <span key={`${item.ch}-${i}`} className={`guide-${item.mark}`}>
                  {item.ch}
                </span>
              ))}
            </div>
          ) : null}
          <div className="c-romaji-row">
            <span />
            <button type="button" className="chip btn-soft" onClick={() => setGuideOn((v) => !v)}>
              ローマ字ガイド {guideOn ? "ON" : "OFF"}
            </button>
          </div>
        </section>
      </div>

      {feedback ? (
        <section className="c-pop">
          <div>
            <span>案件報酬</span>
            <strong>{formatYen(feedback.reward)}</strong>
          </div>
          <div>
            <span>正確性</span>
            <strong style={{ color: "#93c5fd" }}>{(feedback.accuracy * 100).toFixed(1)}%</strong>
          </div>
          <div>
            <span>コンボ</span>
            <strong style={{ color: "#fda4af" }}>{feedback.combo}</strong>
          </div>
        </section>
      ) : null}
    </main>
  );
}
