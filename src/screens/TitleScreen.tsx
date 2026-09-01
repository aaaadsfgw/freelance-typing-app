import type { Difficulty } from "../shared/types";

const ITEMS: Array<{
  id: Difficulty;
  label: string;
  title: string;
  body: string;
  hint: string;
  chip: string;
}> = [
  {
    id: "beginner",
    label: "初級",
    title: "駆け出しフリーランス",
    body: "短い丁寧な返信。日本語中心で、日程確認や軽い修正から始める。",
    hint: "1〜2文 / 記号少なめ",
    chip: "var(--green-soft)",
  },
  {
    id: "intermediate",
    label: "中級",
    title: "売れっ子フリーランス",
    body: "API や PR、数字を含む標準業務。状況判断も少し入る。",
    hint: "2〜3文 / Issue・v1.2",
    chip: "var(--indigo-soft)",
  },
  {
    id: "advanced",
    label: "上級",
    title: "つよつよフリーランス",
    body: "長文・記号・障害対応。知識クイズではなく、打つ量と記号が難しい。",
    hint: "複数文 / リリース判断",
    chip: "var(--rose-soft)",
  },
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
                FD
              </span>
              <div>
                <div className="kicker">Freelance Desk</div>
                <p className="brand-tag">届いた依頼を、ローマ字で返す。</p>
              </div>
            </div>
            <h1>
              タイピングで稼ぐ、
              <br />
              忙しい一ヶ月。
            </h1>
            <p className="lead">
              クライアントから届く業務連絡に、提示された返信文をローマ字で打ち返す。速く正確に処理するほど、今月の売上が増えていく。
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
          {ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`difficulty${difficulty === item.id ? " is-selected" : ""}`}
              onClick={() => onDifficulty(item.id)}
            >
              <span className="chip" style={{ background: item.chip, color: CHIP_COLOR[item.id] }}>
                {item.label}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <small className="difficulty-hint">{item.hint}</small>
            </button>
          ))}
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
