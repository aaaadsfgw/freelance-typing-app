import { useEffect, useState } from "react";
import { topWeak } from "../lib/analysis";
import { fetchPlays } from "../lib/api";
import { getAnonymousId } from "../lib/anonymousId";
import { mergeStats } from "../lib/analysis";
import type { KeyStat, SavedPlay } from "../shared/types";

type Props = {
  onTitle: () => void;
  onResult?: () => void;
};

export function AnalysisScreen({ onTitle, onResult }: Props) {
  const [plays, setPlays] = useState<SavedPlay[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlays(getAnonymousId())
      .then(setPlays)
      .catch(() => setError("分析データを取得できませんでした。"));
  }, []);

  const keys = plays.reduce<Record<string, KeyStat>>(
    (acc, play) => mergeStats(acc, play.keyStats),
    {},
  );
  const fingers = plays.reduce<Record<string, KeyStat>>(
    (acc, play) => mergeStats(acc, play.fingerStats),
    {},
  );
  const bigrams = plays.reduce<Record<string, KeyStat>>(
    (acc, play) => mergeStats(acc, play.bigramStats),
    {},
  );
  const hits = Object.values(keys).reduce((sum, row) => sum + row.hits, 0);
  const misses = Object.values(keys).reduce((sum, row) => sum + row.misses, 0);
  const accuracy = hits + misses === 0 ? 0 : hits / (hits + misses);
  const avgSpeed =
    plays.length === 0 ? 0 : plays.reduce((sum, play) => sum + play.speed, 0) / plays.length;
  const weakKeys = topWeak(keys);
  const weakFingers = topWeak(fingers, 4);
  const weakMoves = topWeak(bigrams, 4);
  const maxFinger = Math.max(...weakFingers.map((row) => row.rate), 0.01);

  return (
    <main className="page">
      <section className="panel" style={{ marginBottom: 16 }}>
        <div className="kicker">直近プレイ + 累計</div>
        <h1 style={{ margin: "6px 0 8px", fontSize: 32 }}>タイピング分析</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          どのキー、どの指、どの組み合わせでミスしやすいかを確認します。
        </p>
        {error ? <p className="error">{error}</p> : null}
        <div className="stat-grid">
          <div className="stat">
            <div className="label">累計入力</div>
            <div className="value">{hits.toLocaleString("ja-JP")}</div>
          </div>
          <div className="stat">
            <div className="label">累計正確性</div>
            <div className="value">{(accuracy * 100).toFixed(1)}%</div>
          </div>
          <div className="stat">
            <div className="label">平均速度</div>
            <div className="value">{Math.round(avgSpeed)} 打/分</div>
          </div>
        </div>
      </section>
      <div className="analysis-grid">
        <section className="panel">
          <h2>苦手キー</h2>
          <table>
            <thead>
              <tr>
                <th>キー</th>
                <th>入力</th>
                <th>ミス</th>
                <th>ミス率</th>
              </tr>
            </thead>
            <tbody>
              {weakKeys.length === 0 ? (
                <tr>
                  <td colSpan={4}>まだミスがありません。</td>
                </tr>
              ) : (
                weakKeys.map((row) => (
                  <tr key={row.key}>
                    <td className="mono">{row.key}</td>
                    <td>{row.hits + row.misses}</td>
                    <td>{row.misses}</td>
                    <td>{(row.rate * 100).toFixed(1)}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
        <section className="panel">
          <h2>苦手な指</h2>
          {weakFingers.length === 0 ? <p>データはまだありません。</p> : null}
          {weakFingers.map((row) => (
            <div key={row.key} style={{ marginBottom: 10 }}>
              <div className="row-item">
                <span>{row.key}</span>
                <strong>{(row.rate * 100).toFixed(1)}%</strong>
              </div>
              <div className="bar">
                <span style={{ width: `${(row.rate / maxFinger) * 100}%` }} />
              </div>
            </div>
          ))}
        </section>
        <section className="panel" style={{ gridColumn: "1 / -1" }}>
          <h2>苦手なキー遷移</h2>
          <div className="stat-grid">
            {weakMoves.length === 0 ? <p>データはまだありません。</p> : null}
            {weakMoves.map((row) => (
              <div className="stat" key={row.key}>
                <div className="label">遷移</div>
                <div className="value mono">{row.key}</div>
                <div className="label">
                  ミス {row.misses} / 率 {(row.rate * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="actions" style={{ marginTop: 18 }}>
        <button type="button" className="btn btn-primary" onClick={onTitle}>
          タイトルへ戻る
        </button>
        {onResult ? (
          <button type="button" className="btn btn-ghost" onClick={onResult}>
            結果画面を見る
          </button>
        ) : null}
      </div>
    </main>
  );
}
