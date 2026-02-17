import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981";
const RTL: React.CSSProperties = { direction: "rtl" };

const CompareScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const features = [
    { label: "מחיר לשעה", a: "₪120", b: "₪85", delay: 20 },
    { label: "ציוד", a: "בסיסי", b: "מקצועי", delay: 35 },
    { label: "מיקום", a: "תל אביב", b: "ירושלים", delay: 50 },
    { label: "דירוג", a: "4.2 ★", b: "4.8 ★", delay: 65 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      <div style={{ marginTop: 80, textAlign: "center", marginBottom: 25 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 46, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          השווה <span style={{ color: GOLD }}>ובחר</span>
        </h1>
      </div>
      {/* Headers */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12, padding: "0 10px" }}>
        <div style={{ flex: 1 }} />
        <div style={{ width: 140, textAlign: "center", opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 18, fontWeight: 700, color: SUBTLE_TEXT }}>אולפן A</span>
        </div>
        <div style={{ width: 140, textAlign: "center", opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 18, fontWeight: 700, color: GOLD }}>אולפן B</span>
        </div>
      </div>
      {features.map((f, i) => {
        const enter = spring({ frame: frame - f.delay, fps, config: { damping: 12, stiffness: 80 } });
        return (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)` }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT }}>{f.label}</span>
            </div>
            <div style={{ width: 140, backgroundColor: DARK_CARD, borderRadius: 12, padding: "14px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: LIGHT_TEXT }}>{f.a}</span>
            </div>
            <div style={{ width: 140, backgroundColor: DARK_CARD, borderRadius: 12, padding: "14px 8px", textAlign: "center", border: `1px solid ${GOLD}20` }}>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: LIGHT_TEXT, fontWeight: 600 }}>{f.b}</span>
            </div>
          </div>
        );
      })}
      <div style={{ textAlign: "center", marginTop: 30, opacity: interpolate(frame, [80, 95], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 22, color: SUBTLE_TEXT }}>הלקוחות שלך <span style={{ color: GOLD }}>משווים ובוחרים</span> את המושלם</span>
      </div>
    </AbsoluteFill>
  );
};

const CompareCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 15px" }}>
          השווה ובחר{"\n"}<span style={{ color: GOLD }}>את המושלם</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 20, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>גלה אולפנים</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad33_StudioComparison: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={145}><CompareScene /></Sequence>
    <Sequence from={145} durationInFrames={95}><CompareCTA /></Sequence>
  </AbsoluteFill>
);
