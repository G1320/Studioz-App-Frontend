import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981";
const RTL: React.CSSProperties = { direction: "rtl" };

const FitnessScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bpm = Math.sin(frame * 0.3) > 0 ? 1.05 : 1;
  const stats = [
    { label: "שיעורים השבוע", value: "32", icon: "🏋️", delay: 55 },
    { label: "תלמידים פעילים", value: "180", icon: "👥", delay: 67 },
    { label: "שעות פעילות", value: "14", icon: "⏰", delay: 79 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      <div style={{ marginTop: 70, textAlign: "center", marginBottom: 20 }}>
        <Img src={staticFile("logo.png")} style={{ width: 48, height: 48, borderRadius: 10, marginBottom: 12, opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }} />
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 44, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          סטודיו <span style={{ color: GOLD }}>כושר</span>?
        </h1>
      </div>

      {/* Heart rate */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 140, marginBottom: 20 }}>
        <div style={{ position: "relative" }}>
          <span style={{ fontSize: 70, display: "block", transform: `scale(${bpm})`, transition: "transform 0.1s" }}>❤️</span>
          <div style={{ position: "absolute", top: -8, right: -20, backgroundColor: SUCCESS, borderRadius: 20, padding: "4px 12px" }}>
            <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 16, fontWeight: 700, color: "white" }}>
              {Math.round(72 + Math.sin(frame * 0.2) * 8)} BPM
            </span>
          </div>
        </div>
      </div>

      {/* Heart rate line */}
      <svg width="100%" height="60" viewBox="0 0 500 60" style={{ marginBottom: 20, opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" }) }}>
        <polyline
          fill="none"
          stroke={SUCCESS}
          strokeWidth={2}
          points={Array.from({ length: 50 }).map((_, i) => {
            const x = i * 10;
            const t = (frame * 0.1 + i * 0.3);
            const y = 30 + (i % 5 === 3 ? -20 : i % 5 === 4 ? 15 : Math.sin(t) * 8);
            return `${x},${y}`;
          }).join(" ")}
        />
      </svg>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        {stats.map((s, i) => {
          const enter = spring({ frame: frame - s.delay, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ flex: 1, backgroundColor: DARK_CARD, borderRadius: 14, padding: "18px 12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.04)", opacity: enter }}>
              <span style={{ fontSize: 26, display: "block", marginBottom: 6 }}>{s.icon}</span>
              <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 28, fontWeight: 700, color: GOLD }}>{s.value}</div>
              <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 13, color: SUBTLE_TEXT, marginTop: 4 }}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const FitCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>ניהול חכם</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>לסטודיו כושר</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>התחל בחינם</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad42_FitnessStudios: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><FitnessScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><FitCTA /></Sequence>
  </AbsoluteFill>
);
