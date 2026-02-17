import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc";
const RTL: React.CSSProperties = { direction: "rtl" };

const ArtScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const splashColors = ["#ffd166", "#e879f9", "#38bdf8", "#10b981", "#f97316"];
  const workshops = [
    { name: "ציור שמן", icon: "🎨", delay: 65 },
    { name: "פיסול", icon: "🗿", delay: 77 },
    { name: "קרמיקה", icon: "🏺", delay: 89 },
    { name: "צילום אמנותי", icon: "📸", delay: 101 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      <div style={{ marginTop: 70, textAlign: "center", marginBottom: 15 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 44, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          סטודיו <span style={{ color: GOLD }}>אמנות</span>?
        </h1>
      </div>

      {/* Paint splashes */}
      <div style={{ position: "relative", height: 160, marginBottom: 15 }}>
        {splashColors.map((color, i) => {
          const delay = 15 + i * 10;
          const enter = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 80 } });
          const x = 80 + i * 70 + Math.sin(i * 2.1) * 30;
          const y = 40 + Math.cos(i * 1.7) * 40;
          const size = 50 + (i % 3) * 20;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", backgroundColor: `${color}40`, border: `2px solid ${color}60`, transform: `scale(${enter})`, opacity: enter }} />
          );
        })}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 2 }}>
          <span style={{ fontSize: 50 }}>🖌️</span>
        </div>
      </div>

      {/* Workshops */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
        {workshops.map((w, i) => {
          const enter = spring({ frame: frame - w.delay, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ width: "44%", backgroundColor: DARK_CARD, borderRadius: 16, padding: "22px 16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.04)", opacity: enter, transform: `scale(${enter})` }}>
              <span style={{ fontSize: 34, display: "block", marginBottom: 8 }}>{w.icon}</span>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: LIGHT_TEXT, fontWeight: 600 }}>{w.name}</span>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 20, opacity: interpolate(frame, [110, 125], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: SUBTLE_TEXT }}>סדנאות, הרשמה ותשלום — <span style={{ color: GOLD }}>במקום אחד</span></span>
      </div>
    </AbsoluteFill>
  );
};

const ArtCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>אמנים בוחרים</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>סטודיוז</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>פרסם את הסטודיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad41_ArtStudios: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><ArtScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><ArtCTA /></Sequence>
  </AbsoluteFill>
);
