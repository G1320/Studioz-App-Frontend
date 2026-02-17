import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc";
const RTL: React.CSSProperties = { direction: "rtl" };

const TeamScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const members = [
    { name: "דני", role: "מנהל", color: GOLD, delay: 15 },
    { name: "מיכל", role: "טכנאית", color: "#3b82f6", delay: 30 },
    { name: "יוסי", role: "מפיק", color: "#10b981", delay: 45 },
    { name: "שירה", role: "עורכת", color: "#ec4899", delay: 60 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 50, ...RTL }}>
      <div style={{ marginTop: 100, textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          הצוות שלך,{"\n"}<span style={{ color: GOLD }}>מסונכרן</span>
        </h1>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
        {members.map((m, i) => {
          const enter = spring({ frame: frame - m.delay, fps, config: { damping: 10, stiffness: 120 } });
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: enter, transform: `scale(${enter})` }}>
              <div style={{ width: 100, height: 100, borderRadius: "50%", backgroundColor: `${m.color}20`, border: `3px solid ${m.color}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 36, fontWeight: 700, color: m.color }}>{m.name.charAt(0)}</span>
              </div>
              <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 22, fontWeight: 700, color: LIGHT_TEXT }}>{m.name}</span>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>{m.role}</span>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", marginTop: 40, opacity: interpolate(frame, [75, 90], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 26, color: SUBTLE_TEXT }}>צוות מסונכרן = <span style={{ color: GOLD }}>אולפן מצליח</span></span>
      </div>
    </AbsoluteFill>
  );
};

const TeamCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 15px" }}>
          נהל את הצוות{"\n"}<span style={{ color: GOLD }}>בקלות</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 20, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>התחל בחינם</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad27_TeamManagement: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={145}><TeamScene /></Sequence>
    <Sequence from={145} durationInFrames={95}><TeamCTA /></Sequence>
  </AbsoluteFill>
);
