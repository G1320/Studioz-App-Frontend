import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const RED = "#dc2626"; const SUCCESS = "#10b981";
const RTL: React.CSSProperties = { direction: "rtl" };

const WaitlistScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const soldOutEnter = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 100 } });
  const queue = [
    { name: "דני מ.", pos: 1, delay: 40 },
    { name: "שירה כ.", pos: 2, delay: 52 },
    { name: "אור ל.", pos: 3, delay: 64 },
    { name: "יעל ב.", pos: 4, delay: 76 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 50, ...RTL }}>
      <div style={{ marginTop: 80, textAlign: "center", marginBottom: 25 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 46, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 15px", opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          סלוט מלא?{"\n"}<span style={{ color: GOLD }}>רשימת המתנה!</span>
        </h1>
      </div>

      {/* Sold out badge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 25, transform: `scale(${soldOutEnter})`, opacity: soldOutEnter }}>
        <div style={{ backgroundColor: "rgba(220,38,38,0.12)", border: `1px solid ${RED}40`, borderRadius: 12, padding: "12px 30px" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 22, fontWeight: 700, color: RED }}>🔴 הסלוט מלא</span>
        </div>
      </div>

      {/* Waitlist queue */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {queue.map((person, i) => {
          const enter = spring({ frame: frame - person.delay, fps, config: { damping: 12, stiffness: 80 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, backgroundColor: DARK_CARD, borderRadius: 16, padding: "18px 20px", border: "1px solid rgba(255,209,102,0.06)", opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)` }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(255,209,102,0.1)", border: `2px solid ${GOLD}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: GOLD }}>#{person.pos}</span>
              </div>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: LIGHT_TEXT }}>{person.name}</span>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT, marginRight: "auto" }}>ממתין</span>
            </div>
          );
        })}
      </div>

      {/* Notification */}
      <div style={{ textAlign: "center", marginTop: 30, opacity: interpolate(frame, [90, 105], [0, 1], { extrapolateRight: "clamp" }) }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: `${SUCCESS}15`, border: `1px solid ${SUCCESS}30`, borderRadius: 50, padding: "8px 24px" }}>
          <span style={{ fontSize: 18 }}>🔔</span>
          <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: SUCCESS, fontWeight: 600 }}>מקום התפנה! דני מ. קיבל הודעה</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const WaitlistCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 10px" }}>
          אף לקוח{"\n"}<span style={{ color: GOLD }}>לא הולך לאיבוד</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 25, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>הפעל רשימת המתנה</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad28_WaitlistFeature: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><WaitlistScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><WaitlistCTA /></Sequence>
  </AbsoluteFill>
);
