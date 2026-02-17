import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981"; const RED = "#dc2626";
const RTL: React.CSSProperties = { direction: "rtl" };

const CancelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shieldScale = spring({ frame: frame - 10, fps, config: { damping: 8, stiffness: 80 } });
  const policies = [
    { text: "ביטול חינם עד 24 שעות", icon: "✓", color: SUCCESS, delay: 55 },
    { text: "50% החזר עד 12 שעות", icon: "✓", color: SUCCESS, delay: 67 },
    { text: "ללא החזר תוך 6 שעות", icon: "✕", color: RED, delay: 79 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      <div style={{ marginTop: 70, textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 40, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          מדיניות ביטול{"\n"}<span style={{ color: GOLD }}>שמגנה עליך</span>
        </h1>
      </div>

      {/* Shield */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
        <div style={{ width: 120, height: 140, position: "relative", transform: `scale(${shieldScale})` }}>
          <svg width="120" height="140" viewBox="0 0 120 140">
            <path d="M60 10 L110 35 L110 85 Q110 130 60 135 Q10 130 10 85 L10 35 Z" fill={`${GOLD}20`} stroke={GOLD} strokeWidth="2" />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -55%)" }}>
            <span style={{ fontSize: 44 }}>🛡️</span>
          </div>
        </div>
      </div>

      {/* Policies */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {policies.map((p, i) => {
          const enter = spring({ frame: frame - p.delay, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, backgroundColor: DARK_CARD, borderRadius: 14, padding: "18px 20px", border: `1px solid ${p.color}20`, opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)` }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: `${p.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 18, color: p.color, fontWeight: 700 }}>{p.icon}</span>
              </div>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: LIGHT_TEXT, fontWeight: 500 }}>{p.text}</span>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 30, opacity: interpolate(frame, [90, 105], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: SUBTLE_TEXT }}>אתה קובע את הכללים. <span style={{ color: GOLD }}>אנחנו אוכפים.</span></span>
      </div>
    </AbsoluteFill>
  );
};

const CancelCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>בלי הפתעות,</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>בלי הפסדים</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>הגדר מדיניות</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad43_CancelProtection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={145}><CancelScene /></Sequence>
    <Sequence from={145} durationInFrames={95}><CancelCTA /></Sequence>
  </AbsoluteFill>
);
