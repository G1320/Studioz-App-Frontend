import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc";
const RTL: React.CSSProperties = { direction: "rtl" };

const KineticScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = [
    { text: "500+", sub: "סטודיואים", color: GOLD, delay: 0 },
    { text: "10,000+", sub: "הזמנות", color: LIGHT_TEXT, delay: 20 },
    { text: "₪2M+", sub: "הכנסות לבעלים", color: GOLD, delay: 40 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, padding: 50 }}>
        {lines.map((l, i) => {
          const enter = spring({ frame: frame - l.delay, fps, config: { damping: 10, stiffness: 80 } });
          return (
            <div key={i} style={{ textAlign: "center", transform: `scale(${enter})`, opacity: enter }}>
              <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 72, fontWeight: 700, color: l.color, lineHeight: 1 }}>{l.text}</div>
              <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: SUBTLE_TEXT, marginTop: 6 }}>{l.sub}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const UrgencyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  const pulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [1, 1.05]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 80, height: 80, borderRadius: 16, marginBottom: 25 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 8px" }}>
          הסטודיו שלך
        </h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 32, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 30px" }}>
          צריך להיות כאן
        </p>
        <div style={{ backgroundColor: GOLD, padding: "20px 60px", borderRadius: 16, boxShadow: "0 0 50px rgba(255,209,102,0.25)", transform: `scale(${pulse})` }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 26, fontWeight: 700, color: DARK_BG }}>הצטרף עכשיו — בחינם</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 17, color: SUBTLE_TEXT, marginTop: 18 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad53_FinalCTA: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={120}><KineticScene /></Sequence>
    <Sequence from={120} durationInFrames={120}><UrgencyScene /></Sequence>
  </AbsoluteFill>
);
