import { useState } from "react";

const DIAGNOSIS_URL = "https://lciq-diagnosis.com/home?agent_id=1834263";
const LINE_URL = "https://lin.ee/xwXMZta";

const AXES = [
  { name: "認識力", icon: "🪞", color: "#8b7ba8", desc: "場の空気・相手の変化を読む力" },
  { name: "表現力", icon: "🗣️", color: "#7a9e87", desc: "気持ちと考えを言葉に乗せる力" },
  { name: "共感力", icon: "👂", color: "#b8956a", desc: "相手の立場に立ち、聴き切る力" },
  { name: "楽転力", icon: "🍵", color: "#c4834a", desc: "重い空気を軽やかに変える力" },
  { name: "魅了力", icon: "✨", color: "#c4a84a", desc: "存在感で自然に選ばれる力" },
  { name: "継続力", icon: "🌱", color: "#6a8ab8", desc: "縁を育て、関係を深め続ける力" },
];

function buildPrompt(scores) {
  const filled = AXES.filter(a => scores[a.name] !== undefined);
  if (filled.length === 0) return null;
  const lines = AXES.map(a => `・${a.name}：${scores[a.name] ?? "未入力"}点`).join("\n");
  const weakest = filled.reduce((a, b) => scores[a.name] < scores[b.name] ? a : b);
  const strongest = filled.reduce((a, b) => scores[a.name] > scores[b.name] ? a : b);
  return `あなたはLCIQ®の診断AIアシスタント「デジタル師範」です。
みずっちさんのAIクローンとして、30年の経営・人間関係支援の知見を持って語ります。
語り口は温かく核心をつき、押しつけがましくない。「ですます調」で220字以内。

診断スコア（100点満点）：
${lines}

最も強い軸：${strongest.name}（${scores[strongest.name]}点）
最も伸ばせる軸：${weakest.name}（${scores[weakest.name]}点）

以下の順で個別フィードバックをください：
1. この人の強みを一言で（1文）
2. 最も伸ばすべき軸とその具体的理由（2文）
3. LCIQ®講座で得られる変化への自然な誘い（1文）`;
}

const petalData = Array.from({ length: 10 }, (_, i) => ({
  left: `${(i * 41 + 7) % 88}%`,
  top: `${(i * 57 + 5) % 75}%`,
  size: `${10 + (i % 4) * 5}px`,
  delay: `${i * 0.5}s`,
  color: ["#c8a4b8", "#8b7ba8", "#6a8ab8", "#7a9e87"][i % 4],
}));

export default function LCIQEntrance() {
  const [phase, setPhase] = useState("top");
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  function handleScore(axisName, val) {
    const n = Math.min(100, Math.max(0, Number(val)));
    setScores(prev => ({ ...prev, [axisName]: n }));
  }

  async function handleSubmit() {
    const prompt = buildPrompt(scores);
    if (!prompt) { setError("スコアを入力してください"); return; }
    setPhase("loading");
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      ;setFeedback(data.text || data.error || "フィードバックを取得できませんでした。");      setPhase("result");
    } catch {
      setError("通信エラーが発生しました。");
      setPhase("after");
    }
  }

  const s = {
    wrap: {
      minHeight: "100vh",
      background: "linear-gradient(160deg,#1a1218 0%,#0f1a14 55%,#12141a 100%)",
      fontFamily: "'Hiragino Mincho ProN','Yu Mincho',Georgia,serif",
      padding: "32px 20px",
      display: "flex", flexDirection: "column", alignItems: "center",
      position: "relative", overflow: "hidden",
    },
    card: {
      width: "100%", maxWidth: "500px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(200,164,184,0.22)",
      borderRadius: "22px", padding: "36px 28px",
      backdropFilter: "blur(12px)", position: "relative", zIndex: 1,
    },
    eyebrow: {
      fontSize: "10px", letterSpacing: "4px",
      color: "#c8a4b8", textTransform: "uppercase",
      fontFamily: "sans-serif", marginBottom: "12px",
    },
    h1: {
      fontSize: "clamp(22px,5vw,32px)", fontWeight: 400,
      color: "#f0e8e0", letterSpacing: "1px", lineHeight: 1.45, margin: "0 0 14px",
    },
    body: { fontSize: "13px", color: "#8a7a6a", lineHeight: 1.85 },
    divider: {
      width: "50px", height: "1px",
      background: "linear-gradient(to right,transparent,#c8a4b8,transparent)",
      margin: "18px auto",
    },
    primaryBtn: {
      display: "block", width: "100%", padding: "18px",
      background: "linear-gradient(135deg,#c8a4b8,#8b7ba8)",
      border: "none", borderRadius: "14px",
      color: "#fff", fontSize: "16px",
      fontFamily: "'Hiragino Mincho ProN',Georgia,serif",
      letterSpacing: "1px", cursor: "pointer", textDecoration: "none",
      textAlign: "center", marginTop: "24px",
    },
    ghostBtn: {
      display: "block", width: "100%", padding: "14px",
      background: "transparent",
      border: "1px solid rgba(200,164,184,0.25)",
      borderRadius: "12px", color: "#8a7a6a",
      fontSize: "13px", cursor: "pointer",
      fontFamily: "sans-serif", marginTop: "10px", textAlign: "center",
    },
    lineBtn: {
      display: "block", width: "100%", padding: "18px",
      background: "linear-gradient(135deg,#06c755,#00a040)",
      border: "none", borderRadius: "14px",
      color: "#fff", fontSize: "16px",
      fontFamily: "'Hiragino Mincho ProN',Georgia,serif",
      letterSpacing: "1px", cursor: "pointer",
      textDecoration: "none", textAlign: "center", marginTop: "20px",
    },
    axisRow: {
      display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px",
    },
    scoreInput: {
      width: "62px", padding: "8px 10px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(200,164,184,0.25)",
      borderRadius: "8px", color: "#f0e8e0",
      fontSize: "15px", fontFamily: "sans-serif", textAlign: "center",
    },
  };

  return (
    <div style={s.wrap}>
      <style>{`
        @keyframes float{from{transform:translateY(0) rotate(0deg)}to{transform:translateY(-14px) rotate(18deg)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {petalData.map((p, i) => (
        <div key={i} style={{
          position: "fixed", left: p.left, top: p.top,
          width: p.size, height: p.size,
          borderRadius: "50% 0 50% 0",
          background: p.color, opacity: 0.12,
          animation: `float ${3.5 + i * 0.3}s ease-in-out ${p.delay} infinite alternate`,
          pointerEvents: "none",
        }} />
      ))}

      {/* TOP */}
      {phase === "top" && (
        <div style={{ ...s.card, animation: "fadeUp 0.6s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <div style={{ fontSize: "22px" }}>🌸</div>
            <div style={s.eyebrow}>LCIQ® Metaverse Experience</div>
          </div>
          <h1 style={s.h1}>あなたの縁力を、<br />今日、知る。</h1>
          <p style={s.body}>
            LCIQ®とは、人と人との縁を生み出す力——
            コミュニケーションIQを6つの軸で測定する、
            一般社団法人日本ブライダルソムリエ協会が提供する診断です。
          </p>
          <div style={s.divider} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "4px" }}>
            {AXES.map(a => (
              <div key={a.name} style={{
                padding: "10px 12px",
                border: `1px solid ${a.color}44`,
                borderRadius: "10px",
                background: `${a.color}0a`,
              }}>
                <div style={{ fontSize: "16px", marginBottom: "4px" }}>{a.icon}</div>
                <div style={{ fontSize: "13px", color: a.color, marginBottom: "2px" }}>{a.name}</div>
                <div style={{ fontSize: "10px", color: "#6a5a4a", lineHeight: 1.4, fontFamily: "sans-serif" }}>{a.desc}</div>
              </div>
            ))}
          </div>
          <div style={s.divider} />
          <p style={{ ...s.body, fontSize: "12px", textAlign: "center" }}>
            診断は協会の公式ツールで行います。所要時間：約5分
          </p>
          <a href={DIAGNOSIS_URL} target="_blank" rel="noopener noreferrer" style={s.primaryBtn}>
            LCIQ®診断を受ける →
          </a>
          <button style={s.ghostBtn} onClick={() => setPhase("after")}>
            診断が終わったら → デジタル師範に相談する
          </button>
          <div style={{ textAlign: "center", marginTop: "18px", fontSize: "10px", color: "#4a3a3a", fontFamily: "sans-serif" }}>
            Powered by 一般社団法人日本ブライダルソムリエ協会 LCIQ®
          </div>
        </div>
      )}

      {/* AFTER */}
      {phase === "after" && (
        <div style={{ ...s.card, animation: "fadeUp 0.5s ease" }}>
          <div style={s.eyebrow}>Step 2 — デジタル師範に相談する</div>
          <h2 style={{ ...s.h1, fontSize: "clamp(17px,4vw,22px)", marginBottom: "8px" }}>
            診断結果のスコアを<br />入力してください
          </h2>
          <p style={{ ...s.body, fontSize: "12px", marginBottom: "24px" }}>
            各軸のスコア（0〜100点）を入力すると、
            デジタル師範があなただけのフィードバックをお届けします。
          </p>
          {AXES.map(a => (
            <div key={a.name} style={s.axisRow}>
              <span style={{ fontSize: "18px", width: "24px" }}>{a.icon}</span>
              <span style={{ flex: 1, fontSize: "14px", color: "#d4c8b8" }}>{a.name}</span>
              <input
                type="number" min="0" max="100" placeholder="—"
                style={s.scoreInput}
                value={scores[a.name] ?? ""}
                onChange={e => handleScore(a.name, e.target.value)}
              />
              <span style={{ fontSize: "11px", color: "#6a5a4a", fontFamily: "sans-serif" }}>点</span>
            </div>
          ))}
          {error && <div style={{ fontSize: "12px", color: "#c8a4b8", marginTop: "8px", fontFamily: "sans-serif" }}>{error}</div>}
          <button style={s.primaryBtn} onClick={handleSubmit}>デジタル師範に分析してもらう →</button>
          <button style={s.ghostBtn} onClick={() => setPhase("top")}>← 戻る</button>
        </div>
      )}

      {/* LOADING */}
      {phase === "loading" && (
        <div style={{ ...s.card, textAlign: "center", padding: "60px 28px" }}>
          <div style={{
            width: "52px", height: "52px",
            border: "2px solid rgba(200,164,184,0.15)",
            borderTop: "2px solid #c8a4b8",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 28px",
          }} />
          <div style={s.eyebrow}>Digital Shihan</div>
          <div style={{ fontSize: "15px", color: "#d4c8b8", lineHeight: 1.8 }}>
            デジタル師範が<br />あなたの結果を読み解いています…
          </div>
        </div>
      )}

      {/* RESULT */}
      {phase === "result" && (
        <div style={{ ...s.card, animation: "fadeUp 0.6s ease" }}>
          <div style={s.eyebrow}>デジタル水間 — フィードバック</div>
          <h2 style={{ ...s.h1, fontSize: "clamp(17px,4vw,22px)", marginBottom: "20px" }}>あなたへのメッセージ</h2>
          <div style={{ marginBottom: "24px" }}>
            {AXES.map(a => scores[a.name] !== undefined && (
              <div key={a.name} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontSize: "12px", color: "#d4c8b8" }}>{a.icon} {a.name}</span>
                  <span style={{ fontSize: "12px", color: a.color, fontFamily: "sans-serif" }}>{scores[a.name]}点</span>
                </div>
                <div style={{ height: "5px", background: "rgba(255,255,255,0.07)", borderRadius: "3px" }}>
                  <div style={{
                    height: "100%", borderRadius: "3px",
                    background: `linear-gradient(to right,${a.color},${a.color}88)`,
                    width: `${scores[a.name]}%`, transition: "width 0.9s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{
            border: "1px solid rgba(200,164,184,0.22)",
            borderRadius: "14px", padding: "20px",
            background: "rgba(200,164,184,0.06)", marginBottom: "4px",
          }}>
            <div style={{ ...s.eyebrow, marginBottom: "12px" }}>🤖 デジタル師範より</div>
            <div style={{ fontSize: "14px", color: "#d4c8b8", lineHeight: 1.95 }}>{feedback}</div>
          </div>
          <div style={s.divider} />
          <p style={{ ...s.body, fontSize: "12px", textAlign: "center" }}>
            LCIQ®講座で、あなたの縁力をさらに伸ばしませんか。
          </p>
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" style={s.lineBtn}>
            LCIQ®講座を相談する（LINE）
          </a>
          <button style={s.ghostBtn} onClick={() => { setPhase("top"); setScores({}); setFeedback(""); }}>
            最初からやり直す
          </button>
        </div>
      )}
    </div>
  );
}
