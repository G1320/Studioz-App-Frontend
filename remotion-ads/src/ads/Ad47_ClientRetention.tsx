import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981";
const RTL: React.CSSProperties = { direction: "rtl" };

const RetentionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const retentionPct = Math.round(interpolate(frame, [40, 90], [0, 87], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  const clients = [
    { name: "דניאל כ.", visits: 12, badge: "VIP", delay: 60 },
    { name: "שרה מ.", visits: 8, badge: "חוזר", delay: 72 },
    { name: "יוסי ר.", visits: 5, badge: "חוזר", delay: 84 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      <div style={{ marginTop: 70, textAlign: "center", marginBottom: 25 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          לקוחות <span style={{ color: GOLD }}>חוזרים</span>
        </h1>
      </div>

      {/* Circular progress */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
        <div style={{ position: "relative", width: 160, height: 160 }}>
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="80" cy="80" r="70" fill="none" stroke={DARK_CARD} strokeWidth="12" />
            <circle cx="80" cy="80" r="70" fill="none" stroke={GOLD} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${retentionPct * 4.4} 440`} />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 42, fontWeight: 700, color: GOLD }}>{retentionPct}%</div>
            <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT }}>שימור</div>
          </div>
        </div>
      </div>

      {/* Client list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {clients.map((c, i) => {
          const enter = spring({ frame: frame - c.delay, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, backgroundColor: DARK_CARD, borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.04)", opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)` }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: `${GOLD}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 20 }}>👤</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: LIGHT_TEXT, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: SUBTLE_TEXT }}>{c.visits} ביקורים</div>
              </div>
              <div style={{ backgroundColor: c.badge === "VIP" ? `${GOLD}20` : `${SUCCESS}20`, borderRadius: 20, padding: "4px 14px" }}>
                <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 13, fontWeight: 600, color: c.badge === "VIP" ? GOLD : SUCCESS }}>{c.badge}</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const RetentionCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>לקוח מרוצה</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>חוזר שוב ושוב</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>הצטרף עכשיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad47_ClientRetention: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><RetentionScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><RetentionCTA /></Sequence>
  </AbsoluteFill>
);
