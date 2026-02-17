import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc";
const RTL: React.CSSProperties = { direction: "rtl" };

const MicScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const episodes = [
    { title: "פרק 42: עתיד הפודקאסטים", dur: "45:12", delay: 50 },
    { title: "פרק 41: ראיון עם יוצר תוכן", dur: "38:05", delay: 62 },
    { title: "פרק 40: טיפים להקלטה", dur: "52:30", delay: 74 },
    { title: "פרק 39: ציוד למתחילים", dur: "29:48", delay: 86 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 45, ...RTL }}>
      <div style={{ marginTop: 60, textAlign: "center", marginBottom: 15 }}>
        <Img src={staticFile("logo.png")} style={{ width: 48, height: 48, borderRadius: 10, marginBottom: 12, opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }} />
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          פודקאסט <span style={{ color: GOLD }}>סטודיו</span>
        </h1>
      </div>

      {/* Mic with waves */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 160, position: "relative", marginBottom: 10 }}>
        {[0, 1, 2].map((i) => {
          const scale = interpolate((frame + i * 20) % 60, [0, 60], [1, 3]);
          const opacity = interpolate((frame + i * 20) % 60, [0, 30, 60], [0.4, 0.1, 0]);
          return <div key={i} style={{ position: "absolute", width: 80, height: 80, borderRadius: "50%", border: `2px solid ${GOLD}`, opacity, transform: `scale(${scale})` }} />;
        })}
        <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: DARK_CARD, border: `2px solid ${GOLD}50`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
          <span style={{ fontSize: 36 }}>🎙️</span>
        </div>
        {/* REC indicator */}
        <div style={{ position: "absolute", top: 10, right: "30%", display: "flex", alignItems: "center", gap: 6, opacity: interpolate(frame % 40, [0, 20, 40], [1, 0.3, 1]) }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#dc2626" }} />
          <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 14, color: "#dc2626", fontWeight: 700 }}>REC</span>
        </div>
      </div>

      {/* Episode list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {episodes.map((ep, i) => {
          const enter = spring({ frame: frame - ep.delay, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, backgroundColor: DARK_CARD, borderRadius: 14, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.04)", opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)` }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: `${GOLD}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 16, color: GOLD }}>▶</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 17, color: LIGHT_TEXT, fontWeight: 600 }}>{ep.title}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: SUBTLE_TEXT }}>{ep.dur}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const PodCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>פודקאסט סטודיו?</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>הזמנות בקליק</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>פרסם את הסטודיו שלך</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad38_PodcastStudios: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><MicScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><PodCTA /></Sequence>
  </AbsoluteFill>
);
