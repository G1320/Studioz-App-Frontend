import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#f1f5f9";
const SUBTLE_TEXT = "#b8c0cc";
const SUCCESS = "#10b981";
const RED = "#dc2626";

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: The problem - no shows ──
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated bar chart showing lost revenue
  const bars = [
    { label: "ינ'", height: 180, lost: 60 },
    { label: "פב'", height: 200, lost: 80 },
    { label: "מרץ", height: 160, lost: 50 },
    { label: "אפר'", height: 220, lost: 90 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 50, ...RTL }}>
      <div style={{ marginTop: 100, textAlign: "center", marginBottom: 50 }}>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            lineHeight: 1.2,
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          כמה הכנסות{"\n"}<span style={{ color: RED }}>אתה מפסיד?</span>
        </h1>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 22,
            color: SUBTLE_TEXT,
            margin: "12px 0 0",
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          ביטולים ו-No Shows הורסים את השורה התחתונה
        </p>
      </div>

      {/* Bar chart */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 30,
          height: 450,
          padding: "0 20px",
          direction: "ltr",
        }}
      >
        {bars.map((bar, i) => {
          const barGrow = interpolate(frame, [20 + i * 8, 50 + i * 8], [0, 1], { extrapolateRight: "clamp" });
          const lostGrow = interpolate(frame, [55 + i * 5, 75 + i * 5], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ position: "relative", width: 80, display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                {/* Lost portion (red) */}
                <div
                  style={{
                    height: bar.lost * lostGrow,
                    backgroundColor: "rgba(220,38,38,0.3)",
                    borderRadius: "12px 12px 0 0",
                    border: "1px solid rgba(220,38,38,0.4)",
                    borderBottom: "none",
                  }}
                />
                {/* Earned portion (gold) */}
                <div
                  style={{
                    height: (bar.height - bar.lost) * barGrow,
                    backgroundColor: "rgba(255,209,102,0.2)",
                    borderRadius: lostGrow > 0 ? "0 0 12px 12px" : 12,
                    border: `1px solid ${GOLD}30`,
                    borderTop: lostGrow > 0 ? "none" : undefined,
                  }}
                />
              </div>
              <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>{bar.label}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 30,
          marginTop: 30,
          opacity: interpolate(frame, [80, 95], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: "rgba(220,38,38,0.4)" }} />
          <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>הפסד מביטולים</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: `${GOLD}40` }} />
          <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>הכנסה בפועל</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: Solution ──
const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { icon: "💳", text: "לקוחות משלמים מראש", delay: 8 },
    { icon: "🔔", text: "תזכורות אוטומטיות לפני סשן", delay: 20 },
    { icon: "📊", text: "פחות הפתעות, יותר ודאות", delay: 32 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 50, ...RTL }}>
      <div style={{ marginTop: 100, textAlign: "center", marginBottom: 40 }}>
        <Img src={staticFile("logo.png")} style={{ width: 65, height: 65, borderRadius: 13, marginBottom: 20, opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }} />
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            lineHeight: 1.2,
            opacity: interpolate(frame, [3, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          פחות ביטולים.{"\n"}<span style={{ color: GOLD }}>יותר ודאות.</span>
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {items.map((item, i) => {
          const enter = spring({ frame: frame - item.delay, fps, config: { damping: 12 } });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                backgroundColor: "rgba(16,185,129,0.04)",
                borderRadius: 18,
                padding: "25px 22px",
                border: "1px solid rgba(16,185,129,0.1)",
                opacity: enter,
                transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)`,
              }}
            >
              <span style={{ fontSize: 34, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 24, color: LIGHT_TEXT, fontWeight: 500 }}>
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>התחל בחינם</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad15_NoShowProtection: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={130}>
        <ProblemScene />
      </Sequence>
      <Sequence from={130} durationInFrames={110}>
        <SolutionScene />
      </Sequence>
    </AbsoluteFill>
  );
};
