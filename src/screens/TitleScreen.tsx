import type { Difficulty } from "../shared/types";

const ITEMS: Array<{ id: Difficulty; label: string; title: string; body: string; chip: string }> = [
  {
    id: "beginner",
    label: "初級",
    title: "駆け出しフリーランス",
    body: "短い丁寧な返信。日本語中心で、タイピング初心者向け。",
    chip: "var(--green-soft)",
  },
  {
    id: "intermediate",
    label: "中級",
    title: "売れっ子フリーランス",
    body: "PR 番号や API など、業務らしい語彙が増える標準難易度。",
    chip: "var(--indigo-soft)",
  },
  {
    id: "advanced",
    label: "上級",
    title: "つよつよフリーランス",
    body: "長文・複数行・記号多め。知識ではなく入力の難しさ。",
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
        <div className="kicker">フリーランス IT エンジニア体験</div>
        <h1>
          タイピングで稼ぐ、
          <br />
          忙しい一ヶ月。
        </h1>
        <p className="lead">
          クライアントから届く業務連絡に、提示された返信文をローマ字で打ち返す。速く正確に処理するほど、今月の売上が増えていく。
        </p>
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
