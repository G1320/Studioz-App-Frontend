import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc";
const RTL: React.CSSProperties = { direction: "rtl" };

const CRMScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clients = [
    { name: "דני מ.", visits: 12, fav: "חדר A", spent: "₪4,200", delay: 15 },
    { name: "שירה כ.", visits: 8, fav: "חדר הקלטות", spent: "₪2,800", delay: 35 },
    { name: "אור ל.", visits: 23, fav: "סטודיו ראשי", spent: "₪8,100", delay: 55 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 45, ...RTL }}>
      <div style={{ marginTop: 100, textAlign: "center", marginBottom: 35 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT, margin: 0, lineHeight: 1.2, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          הכר את <span style={{ color: GOLD }}>הלקוחות שלך</span>
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {clients.map((client, i) => {
          const enter = spring({ frame: frame - client.delay, fps, config: { damping: 12, stiffness: 80 } });
          return (
            <div key={i} style={{ backgroundColor: DARK_CARD, borderRadius: 20, padding: "22px 20px", border: "1px solid rgba(255,209,102,0.06)", opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <div style={{ width: 50, height: 50, borderRadius: "50%", backgroundColor: "rgba(255,209,102,0.1)", border: `2px solid ${GOLD}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, color: GOLD }}>{client.name.charAt(0)}</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 22, fontWeight: 700, color: LIGHT_TEXT }}>{client.name}</div>
                  <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 15, color: SUBTLE_TEXT }}>{client.visits} ביקורים</div>
                </div>
                <div style={{ marginRight: "auto", textAlign: "left" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, color: GOLD }}>{client.spent}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ backgroundColor: "rgba(255,209,102,0.06)", borderRadius: 8, padding: "4px 12px" }}>
                  <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT }}>חדר מועדף: {client.fav}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CRMcta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 15px" }}>
          נהל קשרי לקוחות{"\n"}<span style={{ color: GOLD }}>כמו מקצוען</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 20, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>התחל בחינם</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad30_ClientCRM: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={145}><CRMScene /></Sequence>
    <Sequence from={145} durationInFrames={95}><CRMcta /></Sequence>
  </AbsoluteFill>
);
