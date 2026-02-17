import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#f1f5f9";
const SUBTLE_TEXT = "#b8c0cc";
const SUCCESS = "#10b981";

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: Animated bar chart + stats ──
const AnalyticsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bars = [
    { label: "ינו", h: 0.4 }, { label: "פבר", h: 0.55 }, { label: "מרץ", h: 0.7 },
    { label: "אפר", h: 0.6 }, { label: "מאי", h: 0.85 }, { label: "יוני", h: 1.0 },
  ];

  const stats = [
    { label: "הכנסות", value: 48500, prefix: "₪", delay: 60 },
    { label: "הזמנות", value: 312, prefix: "", delay: 72 },
    { label: "לקוחות חוזרים", value: 78, prefix: "", suffix: "%", delay: 84 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 45, ...RTL }}>
      <div style={{ marginTop: 80, textAlign: "center", marginBottom: 30 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT, margin: 0, lineHeight: 1.2, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          דע את <span style={{ color: GOLD }}>המספרים שלך</span>
        </h1>
      </div>

      {/* Bar chart */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 16, height: 300, padding: "0 20px", marginBottom: 30 }}>
        {bars.map((bar, i) => {
          const grow = interpolate(frame, [10 + i * 8, 50 + i * 8], [0, bar.h], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ width: "100%", height: grow * 280, backgroundColor: i === bars.length - 1 ? GOLD : "rgba(255,209,102,0.3)", borderRadius: "10px 10px 0 0", transition: "height 0.1s" }} />
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: SUBTLE_TEXT, marginTop: 8 }}>{bar.label}</span>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
        {stats.map((stat, i) => {
          const enter = spring({ frame: frame - stat.delay, fps, config: { damping: 12 } });
          const val = Math.round(interpolate(frame - stat.delay, [0, 30], [0, stat.value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
          const fmt = val >= 1000 ? `${(val / 1000).toFixed(1)}K` : `${val}`;
          return (
            <div key={i} style={{ backgroundColor: DARK_CARD, borderRadius: 16, padding: "18px 16px", flex: 1, textAlign: "center", border: "1px solid rgba(255,209,102,0.08)", opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)` }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 700, color: SUCCESS }}>{stat.prefix}{fmt}{stat.suffix || ""}</div>
              <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT, marginTop: 4 }}>{stat.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: CTA ──
const AnalyticsCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 15px" }}>
          תובנות שמניבות{"\n"}<span style={{ color: GOLD }}>תוצאות</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 20, boxShadow: "0 0 40px rgba(255,209,102,0.2)", opacity: interpolate(frame, [15, 28], [0, 1], { extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>ראה את הנתונים שלך</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad24_StudioAnalytics: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={145}>
        <AnalyticsScene />
      </Sequence>
      <Sequence from={145} durationInFrames={95}>
        <AnalyticsCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
