import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc";
const RTL: React.CSSProperties = { direction: "rtl" };

const NightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stars = Array.from({ length: 12 }).map((_, i) => ({
    x: 40 + (i * 73) % 400,
    y: 30 + (i * 47) % 200,
    size: 3 + (i % 3) * 2,
    delay: i * 5,
  }));
  const lateSlots = [
    { time: "20:00", service: "הקלטת שיר", delay: 55 },
    { time: "22:00", service: "מיקס ומאסטרינג", delay: 67 },
    { time: "00:00", service: "סשן לילה", delay: 79 },
    { time: "02:00", service: "הפקה מוזיקלית", delay: 91 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      {/* Stars */}
      {stars.map((s, i) => {
        const twinkle = interpolate(Math.sin(frame * 0.1 + i * 1.5), [-1, 1], [0.2, 1]);
        const enter = interpolate(frame, [s.delay, s.delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ position: "absolute", left: s.x, top: s.y, width: s.size, height: s.size, borderRadius: "50%", backgroundColor: GOLD, opacity: twinkle * enter }} />
        );
      })}

      <div style={{ marginTop: 70, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 60, marginBottom: 10, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>🌙</div>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 44, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }) }}>
          סשנים <span style={{ color: GOLD }}>עד הלילה</span>
        </h1>
      </div>

      {/* Late slots */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
        {lateSlots.map((slot, i) => {
          const enter = spring({ frame: frame - slot.delay, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, backgroundColor: DARK_CARD, borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(255,209,102,0.06)", opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)` }}>
              <div style={{ width: 60, backgroundColor: `${GOLD}15`, borderRadius: 10, padding: "8px 0", textAlign: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 18, fontWeight: 700, color: GOLD }}>{slot.time}</span>
              </div>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: LIGHT_TEXT }}>{slot.service}</span>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 25, opacity: interpolate(frame, [100, 115], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: SUBTLE_TEXT }}>הלקוחות שלך לא ישנים — <span style={{ color: GOLD }}>גם הסטודיו שלך לא</span></span>
      </div>
    </AbsoluteFill>
  );
};

const NightCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>הזמנות 24/7</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>גם כשאתה ישן</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>הפעל הזמנות</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad49_NightOwl: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><NightScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><NightCTA /></Sequence>
  </AbsoluteFill>
);
