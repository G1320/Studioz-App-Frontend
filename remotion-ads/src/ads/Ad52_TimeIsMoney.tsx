import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981";
const RTL: React.CSSProperties = { direction: "rtl" };

const TimeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clockAngle = (frame / 150) * 360;
  const savings = [
    { task: "תיאום טלפוני", before: "45 דק׳", after: "0 דק׳", delay: 45 },
    { task: "ניהול יומן", before: "30 דק׳", after: "2 דק׳", delay: 60 },
    { task: "הנהלת חשבונות", before: "60 דק׳", after: "5 דק׳", delay: 75 },
    { task: "מעקב לקוחות", before: "20 דק׳", after: "אוטומטי", delay: 90 },
  ];
  const totalSaved = Math.round(interpolate(frame, [50, 110], [0, 148], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      <div style={{ marginTop: 60, textAlign: "center", marginBottom: 15 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          זמן = <span style={{ color: GOLD }}>כסף</span>
        </h1>
      </div>

      {/* Clock */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{ position: "relative", width: 120, height: 120 }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }) }}>
            <circle cx="60" cy="60" r="55" fill={DARK_CARD} stroke={`${GOLD}40`} strokeWidth="2" />
            {[0,1,2,3,4,5,6,7,8,9,10,11].map((h) => {
              const a = (h * 30 - 90) * (Math.PI / 180);
              return <circle key={h} cx={60 + Math.cos(a) * 45} cy={60 + Math.sin(a) * 45} r="2" fill={SUBTLE_TEXT} />;
            })}
            <line x1="60" y1="60" x2={60 + Math.cos((clockAngle - 90) * Math.PI / 180) * 35} y2={60 + Math.sin((clockAngle - 90) * Math.PI / 180) * 35} stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Saved counter */}
      <div style={{ textAlign: "center", marginBottom: 20, opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 44, fontWeight: 700, color: GOLD }}>{totalSaved}</span>
        <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT }}> דק׳ נחסכות ביום</span>
      </div>

      {/* Savings list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {savings.map((s, i) => {
          const enter = spring({ frame: frame - s.delay, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, backgroundColor: DARK_CARD, borderRadius: 12, padding: "12px 16px", border: "1px solid rgba(255,255,255,0.04)", opacity: enter }}>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: LIGHT_TEXT, flex: 1 }}>{s.task}</span>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#dc2626", textDecoration: "line-through" }}>{s.before}</span>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: SUCCESS, fontWeight: 600 }}>{s.after}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const TimeCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>תפסיק לבזבז זמן</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>תתחיל להרוויח</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>חסוך זמן עכשיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad52_TimeIsMoney: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><TimeScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><TimeCTA /></Sequence>
  </AbsoluteFill>
);
