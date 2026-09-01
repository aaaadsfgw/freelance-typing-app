import { RATING } from "../lib/rating";
import { formatYen } from "../lib/reward";
import type { PlayResult, Rank } from "../shared/types";

type Props = {
  result: PlayResult;
  onRetry: () => void;
  onTitle: () => void;
  onAnalysis: () => void;
};

const RANK_TONE: Record<Rank, { bg: string; fg: string; note: string }> = {
  SS: {
    bg: "var(--violet-soft)",
    fg: "var(--violet)",
    note: "難しい仕事も、チームが任せてきます。",
  },
  S: { bg: "var(--amber-soft)", fg: "#92400e", note: "自信どおり、現場が回っています。" },
  A: {
    bg: "var(--indigo-soft)",
    fg: "var(--indigo)",
    note: "次の大きなアサインが見えてきました。",
  },
  B: { bg: "var(--green-soft)", fg: "var(--green)", note: "戦力として、堅実な一ヶ月でした。" },
  C: { bg: "var(--rose-soft)", fg: "var(--rose)", note: "来月はもう一段、速度を上げましょう。" },
};

export function ResultScreen({ result, onRetry, onTitle, onAnalysis }: Props) {
  const tone = RANK_TONE[result.rank];
  return (
    <main className="page">
      <section className={`panel result-panel rank-${result.rank}`}>
        <div className="result-hero">
          <img
            className="result-art"
            src="/assets/illustrations/month-done.svg"
            alt=""
            width={420}
            height={200}
          />
          <div className="kicker">ゲーム内年収</div>
          <div className="amount">{formatYen(result.revenue)}</div>
          <div className="result-rating">
            <div className="result-rank" style={{ background: tone.bg, color: tone.fg }}>
              {result.rank}
            </div>
            <strong className="result-title">{result.title}</strong>
            <span className="result-score">{result.totalScore} / 100</span>
          </div>
          <p className="rank-banner">{result.comment}</p>
          <p className="result-note">{tone.note}</p>
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
            <span>対応数</span>
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
            <div className="label">返信完了</div>
            <div className="value">{result.jobsCompleted} 件</div>
          </div>
          <div className="stat">
            <div className="label">平均年収UP額</div>
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
