import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc";
const RTL: React.CSSProperties = { direction: "rtl" };

const PortfolioScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const images = [
    { color: "#e879f9", icon: "📸", delay: 20 },
    { color: "#38bdf8", icon: "🎬", delay: 30 },
    { color: "#10b981", icon: "🎵", delay: 40 },
    { color: "#f97316", icon: "🎨", delay: 50 },
    { color: "#ffd166", icon: "🎭", delay: 60 },
    { color: "#dc2626", icon: "💡", delay: 70 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      <div style={{ marginTop: 70, textAlign: "center", marginBottom: 25 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 40, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          הפורטפוליו שלך,{"\n"}<span style={{ color: GOLD }}>הרושם הראשון שלהם</span>
        </h1>
      </div>

      {/* Gallery grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 25 }}>
        {images.map((img, i) => {
          const enter = spring({ frame: frame - img.delay, fps, config: { damping: 10, stiffness: 100 } });
          const isLarge = i === 0 || i === 3;
          return (
            <div key={i} style={{ width: isLarge ? "60%" : "35%", height: isLarge ? 180 : 140, backgroundColor: `${img.color}15`, borderRadius: 16, border: `1px solid ${img.color}30`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${enter})`, opacity: enter }}>
              <span style={{ fontSize: isLarge ? 50 : 36 }}>{img.icon}</span>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", opacity: interpolate(frame, [80, 95], [0, 1], { extrapolateRight: "clamp" }) }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: DARK_CARD, borderRadius: 30, padding: "10px 22px" }}>
          <span style={{ fontSize: 16 }}>👁️</span>
          <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>לקוחות רואים את העבודות שלך <span style={{ color: GOLD }}>לפני שמזמינים</span></span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PortfolioCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>תן לעבודות</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>לדבר בשבילך</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>העלה פורטפוליו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad45_StudioPortfolio: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={145}><PortfolioScene /></Sequence>
    <Sequence from={145} durationInFrames={95}><PortfolioCTA /></Sequence>
  </AbsoluteFill>
);
