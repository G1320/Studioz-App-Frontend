import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981";
const RTL: React.CSSProperties = { direction: "rtl" };

const GroupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const people = 8;
  const filledCount = Math.min(Math.floor(interpolate(frame, [40, 100], [0, people], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), people);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      <div style={{ marginTop: 70, textAlign: "center", marginBottom: 25 }}>
        <Img src={staticFile("logo.png")} style={{ width: 48, height: 48, borderRadius: 10, marginBottom: 12, opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }} />
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 40, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          הזמנות קבוצתיות?{"\n"}<span style={{ color: GOLD }}>קל כמו אחד</span>
        </h1>
      </div>

      {/* People grid */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 30, padding: "0 20px" }}>
        {Array.from({ length: people }).map((_, i) => {
          const filled = i < filledCount;
          const enter = spring({ frame: frame - 30 - i * 4, fps, config: { damping: 10 } });
          return (
            <div key={i} style={{ width: 70, height: 70, borderRadius: "50%", backgroundColor: filled ? `${GOLD}25` : `${DARK_CARD}`, border: `2px solid ${filled ? GOLD : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${enter})` }}>
              <span style={{ fontSize: 28, opacity: filled ? 1 : 0.3 }}>👤</span>
            </div>
          );
        })}
      </div>

      {/* Counter */}
      <div style={{ textAlign: "center", marginBottom: 25 }}>
        <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 48, fontWeight: 700, color: GOLD }}>{filledCount}</span>
        <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT }}>/{people}</span>
        <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: SUBTLE_TEXT, marginTop: 6 }}>נרשמו לסשן</div>
      </div>

      {/* Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { text: "קישור הרשמה קבוצתי", delay: 85 },
          { text: "מגבלת משתתפים אוטומטית", delay: 95 },
          { text: "תשלום פר אדם", delay: 105 },
        ].map((f, i) => {
          const enter = spring({ frame: frame - f.delay, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: enter, padding: "0 10px" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: `${SUCCESS}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: SUCCESS }}>✓</span>
              </div>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: LIGHT_TEXT }}>{f.text}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const GroupCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>קבוצות? בודדים?</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>סטודיוז מנהל הכל</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>נסה עכשיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad44_GroupBooking: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><GroupScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><GroupCTA /></Sequence>
  </AbsoluteFill>
);
