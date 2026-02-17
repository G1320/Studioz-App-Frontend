import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc";
const RTL: React.CSSProperties = { direction: "rtl" };

const DanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const classes = [
    { name: "היפ הופ", time: "18:00", spots: 4, delay: 50 },
    { name: "בלט קלאסי", time: "19:30", spots: 2, delay: 62 },
    { name: "סלסה", time: "20:00", spots: 7, delay: 74 },
    { name: "ג׳אז מודרני", time: "21:00", spots: 5, delay: 86 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      <div style={{ marginTop: 70, textAlign: "center", marginBottom: 20 }}>
        <Img src={staticFile("logo.png")} style={{ width: 48, height: 48, borderRadius: 10, marginBottom: 12, opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }} />
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 44, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          סטודיו <span style={{ color: GOLD }}>ריקוד</span>?
        </h1>
      </div>

      {/* Rhythmic dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 30, height: 60, alignItems: "center" }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const bounce = Math.abs(Math.sin((frame * 0.15) + i * 0.9)) * 30;
          const dotEnter = interpolate(frame, [20 + i * 3, 30 + i * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: i % 2 === 0 ? GOLD : "#e879f9", transform: `translateY(${-bounce}px)`, opacity: dotEnter }} />
          );
        })}
      </div>

      {/* Class schedule */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {classes.map((cls, i) => {
          const enter = spring({ frame: frame - cls.delay, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, backgroundColor: DARK_CARD, borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(255,255,255,0.04)", opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)` }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${GOLD}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 20 }}>💃</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: LIGHT_TEXT, fontWeight: 600 }}>{cls.name}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: SUBTLE_TEXT }}>{cls.time} · {cls.spots} מקומות פנויים</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 20, opacity: interpolate(frame, [95, 110], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: SUBTLE_TEXT }}>שיעורים, זמינות ורישום — <span style={{ color: GOLD }}>הכל אוטומטי</span></span>
      </div>
    </AbsoluteFill>
  );
};

const DanceCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>הסטודיו שלך,</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>הבמה שלנו</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>הצטרף עכשיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad40_DanceStudios: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><DanceScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><DanceCTA /></Sequence>
  </AbsoluteFill>
);
