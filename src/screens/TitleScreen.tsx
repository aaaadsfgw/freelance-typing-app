import { APP_NAME, DIFFICULTY_META } from "../shared/copy";
import type { Difficulty } from "../shared/types";

const ITEMS: Array<{
  id: Difficulty;
  chip: string;
}> = [
  { id: "beginner", chip: "var(--green-soft)" },
  { id: "intermediate", chip: "var(--indigo-soft)" },
  { id: "advanced", chip: "var(--rose-soft)" },
];

const CHIP_COLOR: Record<Difficulty, string> = {
  beginner: "var(--green)",
  intermediate: "var(--indigo)",
  advanced: "var(--rose)",
};

type Props = {
  difficulty: Difficulty;
  onDifficulty: (value: Difficulty) => void;
  onStart: () => void;
  onAnalysis: () => void;
};

export function TitleScreen({ difficulty, onDifficulty, onStart, onAnalysis }: Props) {
  return (
    <main className="page">
      <section className="hero-card">
        <div className="hero-layout">
          <div>
            <div className="brand-row">
              <span className="brand-mark" aria-hidden="true">
                DD
              </span>
              <div>
                <div className="kicker">{APP_NAME}</div>
                <p className="brand-tag">届いたチャットを、ローマ字で返す。</p>
              </div>
            </div>
            <h1>
              タイピングで伸ばす、
              <br />
              忙しい一ヶ月。
            </h1>
            <p className="lead">
              IT 企業の Web
              開発部署に届くチャットへ、提示された返信文をローマ字で打ち返す。速く正確に処理するほど、ゲーム内年収が増えていく。
            </p>
          </div>
          <img
            className="hero-art"
            src="/assets/illustrations/desk-work.svg"
            alt=""
            width={420}
            height={280}
          />
        </div>
        <div className="difficulty-grid">
          {ITEMS.map((item) => {
            const meta = DIFFICULTY_META[item.id];
            return (
              <button
                key={item.id}
                type="button"
                className={`difficulty${difficulty === item.id ? " is-selected" : ""}`}
                onClick={() => onDifficulty(item.id)}
              >
                <span
                  className="chip"
                  style={{ background: item.chip, color: CHIP_COLOR[item.id] }}
                >
                  {meta.label}
                </span>
                <h3>{meta.title}</h3>
                <p>{meta.body}</p>
                <small className="difficulty-hint">{meta.hint}</small>
              </button>
            );
          })}
        </div>
        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={onStart}>
            この難易度で仕事を始める
          </button>
          <button type="button" className="btn btn-ghost" onClick={onAnalysis}>
            タイピング分析を見る
          </button>
        </div>
      </section>
    </main>
  );
}
