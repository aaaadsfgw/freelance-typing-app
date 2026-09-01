import { useState } from "react";
import { fetchQuestions, savePlay } from "./lib/api";
import { getAnonymousId } from "./lib/anonymousId";
import { AnalysisScreen } from "./screens/AnalysisScreen";
import { GameScreen } from "./screens/GameScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { TitleScreen } from "./screens/TitleScreen";
import type { Difficulty, PlayResult, Question } from "./shared/types";

type Screen = "title" | "game" | "result" | "analysis";

export function App() {
  const [screen, setScreen] = useState<Screen>("title");
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<PlayResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gameKey, setGameKey] = useState(0);

  const start = async () => {
    setLoading(true);
    setError("");
    try {
      const list = await fetchQuestions(difficulty);
      if (list.length === 0) throw new Error("empty");
      setQuestions(list);
      setGameKey((value) => value + 1);
      setScreen("game");
    } catch {
      setError("案件を取得できませんでした。D1 に問題データがあるか確認してください。");
    } finally {
      setLoading(false);
    }
  };

  const finish = (play: PlayResult) => {
    setResult(play);
    setScreen("result");
    void savePlay(getAnonymousId(), play);
  };

  return (
    <>
      {screen === "title" ? (
        <TitleScreen
          difficulty={difficulty}
          onDifficulty={setDifficulty}
          onStart={() => void start()}
          onAnalysis={() => setScreen("analysis")}
        />
      ) : null}
      {screen === "game" ? (
        <GameScreen key={gameKey} difficulty={difficulty} questions={questions} onFinish={finish} />
      ) : null}
      {screen === "result" && result ? (
        <ResultScreen
          result={result}
          onRetry={() => void start()}
          onTitle={() => setScreen("title")}
          onAnalysis={() => setScreen("analysis")}
        />
      ) : null}
      {screen === "analysis" ? (
        <AnalysisScreen
          onTitle={() => setScreen("title")}
          onResult={result ? () => setScreen("result") : undefined}
        />
      ) : null}
      {loading ? (
        <p className="page" style={{ paddingTop: 0 }}>
          案件を準備しています…
        </p>
      ) : null}
      {error ? (
        <p className="page error" style={{ paddingTop: 0 }}>
          {error}
        </p>
      ) : null}
    </>
  );
}
