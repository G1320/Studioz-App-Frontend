import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc";
const RTL: React.CSSProperties = { direction: "rtl" };

const OrbitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const platforms = [
    { icon: "▶", label: "YouTube", color: "#FF0000", angle: 0 },
    { icon: "♪", label: "TikTok", color: "#69C9D0", angle: 120 },
    { icon: "📷", label: "Instagram", color: "#E1306C", angle: 240 },
  ];
  const radius = 110;
  const counters = [
    { label: "צפיות", target: 125400 },
    { label: "עוקבים", target: 48200 },
    { label: "הזמנות", target: 312 },
  ];
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <div style={{ textAlign: "center", marginTop: 50, padding: "0 40px", opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
        <Img src={staticFile("logo.png")} style={{ width: 48, height: 48, borderRadius: 10, marginBottom: 12 }} />
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, margin: 0 }}>
          יוצרי <span style={{ color: GOLD }}>תוכן</span>
        </h1>
      </div>

      {/* Orbit */}
      <div style={{ position: "relative", width: 300, height: 300, margin: "20px auto" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: radius * 2, height: radius * 2, borderRadius: "50%", border: `1px dashed ${SUBTLE_TEXT}30`, transform: "translate(-50%, -50%)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 70, height: 70, borderRadius: "50%", backgroundColor: DARK_CARD, border: `2px solid ${GOLD}50`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
          <span style={{ fontSize: 30 }}>🎬</span>
        </div>
        {platforms.map((p, i) => {
          const angle = (p.angle + frame * 1.2) * (Math.PI / 180);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const enter = spring({ frame: frame - 15 - i * 10, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ position: "absolute", top: `calc(50% + ${y}px)`, left: `calc(50% + ${x}px)`, transform: "translate(-50%, -50%)", opacity: enter }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: `${p.color}25`, border: `2px solid ${p.color}60`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 20, color: p.color }}>{p.icon}</span>
              </div>
              <div style={{ textAlign: "center", marginTop: 4, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: SUBTLE_TEXT }}>{p.label}</div>
            </div>
          );
        })}
      </div>

      {/* Counters */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "0 30px" }}>
        {counters.map((c, i) => {
          const enter = spring({ frame: frame - 60 - i * 12, fps, config: { damping: 12 } });
          const val = Math.round(interpolate(frame - 60 - i * 12, [0, 40], [0, c.target], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
          return (
            <div key={i} style={{ backgroundColor: DARK_CARD, borderRadius: 14, padding: "14px 18px", textAlign: "center", flex: 1, border: "1px solid rgba(255,255,255,0.05)", opacity: enter }}>
              <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 28, fontWeight: 700, color: GOLD }}>{fmt(val)}</div>
              <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT, marginTop: 4 }}>{c.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CreatorCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>יוצרי תוכן,</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>הנה הבית שלכם</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>מצא סטודיו עכשיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad39_ContentCreators: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><OrbitScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><CreatorCTA /></Sequence>
  </AbsoluteFill>
);
