import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981";
const RTL: React.CSSProperties = { direction: "rtl" };

const RecurringScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rotation = interpolate(frame, [0, 120], [0, 360]);
  const days = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
  const recurring = [1, 3]; // Tuesday and Thursday recurring

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 50, ...RTL }}>
      <div style={{ marginTop: 80, textAlign: "center", marginBottom: 20 }}>
        {/* Spinning cycle icon */}
        <div style={{ fontSize: 50, marginBottom: 15, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }), transform: `rotate(${rotation}deg)`, display: "inline-block" }}>🔄</div>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 46, fontWeight: 700, color: LIGHT_TEXT, margin: 0, lineHeight: 1.2, opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          הזמנות קבועות,{"\n"}<span style={{ color: GOLD }}>הכנסה קבועה</span>
        </h1>
      </div>

      {/* Calendar grid - 4 weeks */}
      {[0, 1, 2, 3].map((week) => (
        <div key={week} style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
          {days.map((day, di) => {
            const isRecurring = recurring.includes(di);
            const cellDelay = 25 + week * 12 + di * 2;
            const enter = spring({ frame: frame - cellDelay, fps, config: { damping: 12 } });
            return (
              <div key={di} style={{ width: 62, height: 62, borderRadius: 12, backgroundColor: isRecurring ? `${SUCCESS}15` : DARK_CARD, border: isRecurring ? `2px solid ${SUCCESS}40` : "1px solid rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: enter }}>
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: SUBTLE_TEXT }}>{day}</span>
                {isRecurring && <span style={{ fontSize: 14, color: SUCCESS, marginTop: 2 }}>✓</span>}
              </div>
            );
          })}
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: 20, opacity: interpolate(frame, [85, 100], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT }}>
          <span style={{ color: SUCCESS, fontWeight: 600 }}>8 הזמנות</span> נסגרות אוטומטית כל חודש
        </span>
      </div>
    </AbsoluteFill>
  );
};

const RecurringCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 15px" }}>
          הכנסה שחוזרת{"\n"}<span style={{ color: GOLD }}>כל חודש</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 20, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>הפעל הזמנות קבועות</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad29_RecurringBookings: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={145}><RecurringScene /></Sequence>
    <Sequence from={145} durationInFrames={95}><RecurringCTA /></Sequence>
  </AbsoluteFill>
);
