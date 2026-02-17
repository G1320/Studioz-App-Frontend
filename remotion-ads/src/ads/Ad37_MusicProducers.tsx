import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc";
const RTL: React.CSSProperties = { direction: "rtl" };

const EqualizerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const barCount = 20;
  const features = [
    { icon: "🎹", text: "ניהול חדרי הקלטה", delay: 60 },
    { icon: "📅", text: "הזמנת סשנים בקליק", delay: 72 },
    { icon: "🎛️", text: "פרסום ציוד ותוכנות", delay: 84 },
    { icon: "💰", text: "חבילות מחירים גמישות", delay: 96 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 45, ...RTL }}>
      <div style={{ marginTop: 80, textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 46, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          אולפן הקלטות?{"\n"}<span style={{ color: GOLD }}>ניהול שמגיע לך</span>
        </h1>
      </div>

      {/* Equalizer bars */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 6, height: 200, marginBottom: 30 }}>
        {Array.from({ length: barCount }).map((_, i) => {
          const h = interpolate(Math.sin(frame * 0.12 + i * 0.8), [-1, 1], [30, 180]);
          const barEnter = interpolate(frame, [i * 2, i * 2 + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ width: 20, height: h * barEnter, borderRadius: 4, background: i % 2 === 0 ? `linear-gradient(0deg, ${GOLD}40, ${GOLD})` : `linear-gradient(0deg, #10b98140, #10b981)` }} />
          );
        })}
      </div>

      {/* Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {features.map((f, i) => {
          const enter = spring({ frame: frame - f.delay, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, backgroundColor: DARK_CARD, borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(255,255,255,0.04)", opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)` }}>
              <span style={{ fontSize: 24 }}>{f.icon}</span>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: LIGHT_TEXT }}>{f.text}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const MusicCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 15px" }}>
          מפיקים מוזיקליים{"\n"}<span style={{ color: GOLD }}>בוחרים סטודיוז</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 20, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>פרסם את האולפן שלך</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad37_MusicProducers: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><EqualizerScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><MusicCTA /></Sequence>
  </AbsoluteFill>
);
