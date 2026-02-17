import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981";
const RTL: React.CSSProperties = { direction: "rtl" };

const WeekendScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const days = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
  const bookings = [3, 5, 4, 6, 5, 12, 14];
  const maxBooking = 14;

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      <div style={{ marginTop: 70, textAlign: "center", marginBottom: 25 }}>
        <Img src={staticFile("logo.png")} style={{ width: 48, height: 48, borderRadius: 10, marginBottom: 12, opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }} />
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          סופ״ש = <span style={{ color: GOLD }}>שיא הזמנות</span>
        </h1>
      </div>

      {/* Bar chart */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 12, height: 280, marginBottom: 25, padding: "0 10px" }}>
        {days.map((day, i) => {
          const barHeight = (bookings[i] / maxBooking) * 240;
          const enter = interpolate(frame, [20 + i * 8, 40 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const isWeekend = i >= 5;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 16, fontWeight: 700, color: isWeekend ? GOLD : SUBTLE_TEXT, marginBottom: 6, opacity: enter }}>{bookings[i]}</div>
              <div style={{ width: "100%", height: barHeight * enter, borderRadius: 8, background: isWeekend ? `linear-gradient(0deg, ${GOLD}60, ${GOLD})` : `linear-gradient(0deg, ${SUBTLE_TEXT}20, ${SUBTLE_TEXT}50)` }} />
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: isWeekend ? GOLD : SUBTLE_TEXT, marginTop: 8, fontWeight: isWeekend ? 700 : 400 }}>{day}</div>
            </div>
          );
        })}
      </div>

      {/* Insight */}
      <div style={{ backgroundColor: DARK_CARD, borderRadius: 14, padding: "16px 20px", textAlign: "center", border: `1px solid ${GOLD}20`, opacity: interpolate(frame, [85, 100], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: LIGHT_TEXT }}>
          <span style={{ color: GOLD, fontWeight: 700 }}>+180%</span> הזמנות בסופ״ש — מוכן לזה?
        </span>
      </div>
    </AbsoluteFill>
  );
};

const WeekendCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>אל תפספס</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>את השיא הבא</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>פרסם סטודיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad48_WeekendWarrior: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><WeekendScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><WeekendCTA /></Sequence>
  </AbsoluteFill>
);
