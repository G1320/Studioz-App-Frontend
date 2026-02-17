import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981";
const RTL: React.CSSProperties = { direction: "rtl" };

const SetupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    { label: "פרטים", delay: 10 },
    { label: "שירותים", delay: 35 },
    { label: "זמינות", delay: 60 },
    { label: "מחירים", delay: 85 },
    { label: "פרסום!", delay: 110 },
  ];

  const timerSec = Math.max(0, Math.round(interpolate(frame, [0, 140], [300, 0], { extrapolateRight: "clamp" })));
  const min = Math.floor(timerSec / 60);
  const sec = timerSec % 60;
  const progressWidth = interpolate(frame, [0, 140], [0, 100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 50, ...RTL }}>
      <div style={{ marginTop: 80, textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 46, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          תוך <span style={{ color: GOLD }}>5 דקות</span>{"\n"}אתה באוויר
        </h1>
      </div>

      {/* Timer */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <span style={{ fontFamily: "'DM Sans', monospace, sans-serif", fontSize: 70, fontWeight: 800, color: GOLD }}>
          {min}:{String(sec).padStart(2, "0")}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ backgroundColor: DARK_CARD, borderRadius: 10, height: 12, marginBottom: 30, overflow: "hidden" }}>
        <div style={{ width: `${progressWidth}%`, height: "100%", backgroundColor: GOLD, borderRadius: 10 }} />
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {steps.map((step, i) => {
          const done = frame >= step.delay + 20;
          const enter = spring({ frame: frame - step.delay, fps, config: { damping: 12, stiffness: 80 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [30, 0])}px)` }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: done ? SUCCESS : DARK_CARD, border: `2px solid ${done ? SUCCESS : GOLD}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {done && <span style={{ color: LIGHT_TEXT, fontSize: 18, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: done ? LIGHT_TEXT : SUBTLE_TEXT, fontWeight: done ? 600 : 400 }}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SetupCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  const pulse = interpolate(frame % 40, [0, 20, 40], [1, 1.05, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 80, height: 80, borderRadius: 16, marginBottom: 25 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 10px" }}>
          🎉 <span style={{ color: GOLD }}>באוויר!</span>
        </h2>
        <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT, textAlign: "center", margin: "0 0 30px" }}>הגדרה מהירה, תוצאות מיידיות</p>
        <div style={{ backgroundColor: GOLD, padding: "20px 55px", borderRadius: 14, transform: `scale(${pulse})`, boxShadow: "0 0 50px rgba(255,209,102,0.25)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 26, fontWeight: 700, color: DARK_BG }}>התחל עכשיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad34_InstantSetup: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={155}><SetupScene /></Sequence>
    <Sequence from={155} durationInFrames={85}><SetupCTA /></Sequence>
  </AbsoluteFill>
);
