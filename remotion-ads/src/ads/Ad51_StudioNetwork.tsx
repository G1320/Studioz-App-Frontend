import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc";
const RTL: React.CSSProperties = { direction: "rtl" };

const NetworkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nodes = [
    { x: 240, y: 350, icon: "🎬", label: "סטודיו", size: 70, delay: 10 },
    { x: 100, y: 220, icon: "🎵", label: "הקלטות", size: 54, delay: 25 },
    { x: 380, y: 220, icon: "📸", label: "צילום", size: 54, delay: 30 },
    { x: 60, y: 420, icon: "🎨", label: "אמנות", size: 54, delay: 35 },
    { x: 420, y: 420, icon: "💃", label: "ריקוד", size: 54, delay: 40 },
    { x: 150, y: 530, icon: "🎙️", label: "פודקאסט", size: 54, delay: 45 },
    { x: 340, y: 530, icon: "🏋️", label: "כושר", size: 54, delay: 50 },
  ];
  const connections = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,3],[2,4],[3,5],[4,6]];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <div style={{ textAlign: "center", marginTop: 80, marginBottom: 20, padding: "0 40px" }}>
        <Img src={staticFile("logo.png")} style={{ width: 48, height: 48, borderRadius: 10, marginBottom: 12, opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }} />
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          רשת <span style={{ color: GOLD }}>סטודיוז</span>
        </h1>
      </div>

      {/* Network graph */}
      <svg width="480" height="400" viewBox="0 0 480 400" style={{ margin: "0 auto", display: "block" }}>
        {connections.map(([a, b], i) => {
          const lineEnter = interpolate(frame, [55 + i * 4, 65 + i * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const na = nodes[a]; const nb = nodes[b];
          const ay = na.y - 200; const by = nb.y - 200;
          return (
            <line key={i} x1={na.x} y1={ay} x2={na.x + (nb.x - na.x) * lineEnter} y2={ay + (by - ay) * lineEnter} stroke={`${GOLD}30`} strokeWidth={1.5} />
          );
        })}
      </svg>

      {/* Nodes overlaid */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        {nodes.map((n, i) => {
          const enter = spring({ frame: frame - n.delay, fps, config: { damping: 10 } });
          return (
            <div key={i} style={{ position: "absolute", left: n.x, top: n.y, transform: `translate(-50%, -50%) scale(${enter})`, textAlign: "center" }}>
              <div style={{ width: n.size, height: n.size, borderRadius: "50%", backgroundColor: DARK_CARD, border: `2px solid ${i === 0 ? GOLD : `${GOLD}40`}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                <span style={{ fontSize: i === 0 ? 30 : 22 }}>{n.icon}</span>
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 13, color: SUBTLE_TEXT, marginTop: 4 }}>{n.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", opacity: interpolate(frame, [95, 110], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT }}>מאות סטודיואים. <span style={{ color: GOLD }}>פלטפורמה אחת.</span></span>
      </div>
    </AbsoluteFill>
  );
};

const NetworkCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>הצטרף לרשת</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>הסטודיואים הגדולה</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>הצטרף עכשיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad51_StudioNetwork: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><NetworkScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><NetworkCTA /></Sequence>
  </AbsoluteFill>
);
