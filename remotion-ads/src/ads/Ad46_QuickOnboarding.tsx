import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981";
const RTL: React.CSSProperties = { direction: "rtl" };

const OnboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    { num: 1, text: "הרשמה מהירה", icon: "✉️", delay: 25 },
    { num: 2, text: "פרטי הסטודיו", icon: "🏠", delay: 50 },
    { num: 3, text: "הגדרת שירותים", icon: "🎯", delay: 75 },
    { num: 4, text: "מוכן ללקוחות!", icon: "🚀", delay: 100 },
  ];
  const progressWidth = interpolate(frame, [25, 120], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const timer = interpolate(frame, [25, 120], [300, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const minutes = Math.floor(timer / 60);
  const seconds = Math.floor(timer % 60);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      <div style={{ marginTop: 70, textAlign: "center", marginBottom: 20 }}>
        <Img src={staticFile("logo.png")} style={{ width: 48, height: 48, borderRadius: 10, marginBottom: 12, opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }} />
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 40, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          מהרשמה ללקוחות{"\n"}<span style={{ color: GOLD }}>תוך דקות</span>
        </h1>
      </div>

      {/* Timer */}
      <div style={{ textAlign: "center", marginBottom: 20, opacity: interpolate(frame, [20, 30], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 52, fontWeight: 700, color: GOLD }}>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, backgroundColor: DARK_CARD, borderRadius: 4, marginBottom: 30, overflow: "hidden" }}>
        <div style={{ width: `${progressWidth}%`, height: "100%", backgroundColor: GOLD, borderRadius: 4 }} />
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {steps.map((s, i) => {
          const enter = spring({ frame: frame - s.delay, fps, config: { damping: 12 } });
          const isDone = frame > s.delay + 20;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, backgroundColor: DARK_CARD, borderRadius: 14, padding: "16px 18px", border: `1px solid ${isDone ? SUCCESS : "rgba(255,255,255,0.04)"}`, opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)` }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: isDone ? `${SUCCESS}20` : `${GOLD}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {isDone ? (
                  <span style={{ fontSize: 18, color: SUCCESS }}>✓</span>
                ) : (
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: GOLD }}>{s.num}</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 19, color: LIGHT_TEXT, fontWeight: 600 }}>{s.text}</span>
              </div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const OnboardCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>5 דקות.</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>זה כל מה שצריך.</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>התחל עכשיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad46_QuickOnboarding: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><OnboardScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><OnboardCTA /></Sequence>
  </AbsoluteFill>
);
