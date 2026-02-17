import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc";
const RTL: React.CSSProperties = { direction: "rtl" };

const CameraScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shutterFlash = frame > 25 && frame < 35 ? interpolate(frame, [25, 28, 35], [0, 0.6, 0]) : 0;
  const categories = [
    { name: "פורטרט", icon: "👤", delay: 40 },
    { name: "מוצר", icon: "📦", delay: 55 },
    { name: "אירועים", icon: "🎉", delay: 70 },
    { name: "אופנה", icon: "👗", delay: 85 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 50, ...RTL }}>
      {/* Flash */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "white", opacity: shutterFlash, zIndex: 10 }} />

      <div style={{ marginTop: 80, textAlign: "center", marginBottom: 25 }}>
        <div style={{ fontSize: 70, marginBottom: 15, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>📸</div>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 46, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }) }}>
          סטודיו צילום?{"\n"}<span style={{ color: GOLD }}>בנוי בשבילך</span>
        </h1>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
        {categories.map((cat, i) => {
          const enter = spring({ frame: frame - cat.delay, fps, config: { damping: 10, stiffness: 100 } });
          return (
            <div key={i} style={{ width: "45%", backgroundColor: DARK_CARD, borderRadius: 20, padding: "28px 20px", textAlign: "center", border: "1px solid rgba(255,209,102,0.08)", opacity: enter, transform: `scale(${enter})` }}>
              <span style={{ fontSize: 40, display: "block", marginBottom: 10 }}>{cat.icon}</span>
              <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 22, fontWeight: 700, color: LIGHT_TEXT }}>{cat.name}</span>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 25, opacity: interpolate(frame, [95, 110], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT }}>ניהול שירותים, זמינות ותמחור — <span style={{ color: GOLD }}>הכל במקום אחד</span></span>
      </div>
    </AbsoluteFill>
  );
};

const PhotoCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 15px" }}>
          צלמים בוחרים{"\n"}<span style={{ color: GOLD }}>סטודיוז</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 20, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>הצטרף עכשיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad36_ProPhotographers: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={145}><CameraScene /></Sequence>
    <Sequence from={145} durationInFrames={95}><PhotoCTA /></Sequence>
  </AbsoluteFill>
);
