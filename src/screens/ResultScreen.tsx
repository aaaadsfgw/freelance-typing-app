import { RATING } from "../lib/rating";
import { formatYen } from "../lib/reward";
import type { PlayResult, Rank } from "../shared/types";

type Props = {
  result: PlayResult;
  onRetry: () => void;
  onTitle: () => void;
  onAnalysis: () => void;
};

const RANK_TONE: Record<Rank, { bg: string; fg: string }> = {
  SS: { bg: "var(--violet-soft)", fg: "var(--violet)" },
  S: { bg: "var(--amber-soft)", fg: "#92400e" },
  A: { bg: "var(--indigo-soft)", fg: "var(--indigo)" },
  B: { bg: "var(--green-soft)", fg: "var(--green)" },
  C: { bg: "var(--rose-soft)", fg: "var(--rose)" },
};

export function ResultScreen({ result, onRetry, onTitle, onAnalysis }: Props) {
  const tone = RANK_TONE[result.rank];
  return (
    <main className="page">
      <section className="panel">
        <div className="result-hero">
          <div className="kicker">今月の売上</div>
          <div className="amount">{formatYen(result.revenue)}</div>
          <div className="result-rating">
            <div className="result-rank" style={{ background: tone.bg, color: tone.fg }}>
              {result.rank}
            </div>
            <strong className="result-title">{result.title}</strong>
            <span className="result-score">{result.totalScore} / 100</span>
          </div>
          <p className="rank-banner">{result.comment}</p>
        </div>
        <div className="score-split">
          <div>
            <span>速度</span>
            <strong>
              {result.speedScore} / {RATING.speedMax}
            </strong>
          </div>
          <div>
            <span>正確性</span>
            <strong>
              {result.accuracyScore} / {RATING.accuracyMax}
            </strong>
          </div>
          <div>
            <span>案件処理</span>
            <strong>
              {result.jobsScore} / {RATING.jobsMax}
            </strong>
          </div>
        </div>
        <div className="stat-grid">
          <div className="stat">
            <div className="label">入力速度</div>
            <div className="value">{Math.round(result.speed)} 打/分</div>
          </div>
          <div className="stat">
            <div className="label">正確性</div>
            <div className="value">{(result.accuracy * 100).toFixed(1)}%</div>
          </div>
          <div className="stat">
            <div className="label">ミス数</div>
            <div className="value">{result.misses}</div>
          </div>
          <div className="stat">
            <div className="label">最大コンボ</div>
            <div className="value">{result.maxCombo}</div>
          </div>
          <div className="stat">
            <div className="label">完了案件</div>
            <div className="value">{result.jobsCompleted} 件</div>
          </div>
          <div className="stat">
            <div className="label">平均案件報酬</div>
            <div className="value">{formatYen(result.avgReward)}</div>
          </div>
        </div>
        <div className="actions" style={{ paddingTop: 12 }}>
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            同じ難易度で再挑戦
          </button>
          <button type="button" className="btn btn-ghost" onClick={onTitle}>
            難易度を変更
          </button>
          <button type="button" className="btn btn-soft" onClick={onAnalysis}>
            タイピング分析
          </button>
        </div>
      </section>
    </main>
  );
}
