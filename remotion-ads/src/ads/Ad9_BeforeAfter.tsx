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
const RED = "#dc2626";
const SUCCESS = "#10b981";

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: "Before" chaos ──
const BeforeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { text: "וואטסאפ מלקוח א'", x: 80, y: 280, rot: -8, delay: 8 },
    { text: "שכחתי לסגור יומן", x: 520, y: 420, rot: 12, delay: 16 },
    { text: "חשבונית?? 🤦", x: 140, y: 600, rot: -5, delay: 24 },
    { text: "הזמנה כפולה!", x: 480, y: 750, rot: 7, delay: 32 },
    { text: "מתי הלקוח מגיע?", x: 200, y: 920, rot: -10, delay: 40 },
    { text: "איפה התשלום?!", x: 550, y: 1100, rot: 4, delay: 48 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      {/* "Before" label */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: "rgba(220,38,38,0.15)",
            border: "1px solid rgba(220,38,38,0.3)",
            borderRadius: 50,
            padding: "8px 30px",
            marginBottom: 15,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 20, fontWeight: 600, color: RED }}>
            לפני סטודיוז
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 40px",
            lineHeight: 1.2,
            opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          בלאגן. 🫠
        </h1>
      </div>

      {/* Scattered "sticky notes" */}
      {items.map((item, i) => {
        const enter = spring({ frame: frame - item.delay, fps, config: { damping: 10, stiffness: 100 } });
        const shake = Math.sin(frame * 0.15 + i) * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              transform: `rotate(${item.rot + shake}deg) scale(${enter})`,
              opacity: enter,
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(220,38,38,0.08)",
                border: "1px solid rgba(220,38,38,0.2)",
                borderRadius: 14,
                padding: "16px 22px",
                maxWidth: 350,
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 22,
                  color: SUBTLE_TEXT,
                }}
              >
                {item.text}
              </span>
            </div>
          </div>
        );
      })}

      {/* Red X overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: interpolate(frame, [65, 80], [0, 0.25], { extrapolateRight: "clamp" }),
        }}
      >
        <span style={{ fontSize: 400, color: RED, fontWeight: 900 }}>✕</span>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: "After" calm ──
const AfterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { icon: "✅", text: "הזמנות נסגרות אוטומטית", delay: 10 },
    { icon: "📅", text: "יומן מסונכרן תמיד", delay: 22 },
    { icon: "🧾", text: "חשבוניות נשלחות לבד", delay: 34 },
    { icon: "💳", text: "תשלומים נכנסים מראש", delay: 46 },
    { icon: "🔔", text: "התראות ללקוחות", delay: 58 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      {/* "After" label */}
      <div style={{ position: "absolute", top: 100, left: 0, right: 0, textAlign: "center", zIndex: 10 }}>
        <div
          style={{
            display: "inline-block",
            backgroundColor: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 50,
            padding: "8px 30px",
            marginBottom: 15,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 20, fontWeight: 600, color: SUCCESS }}>
            עם סטודיוז
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 40px",
            lineHeight: 1.2,
            opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          שקט. 😌
        </h1>
      </div>

      {/* Clean organized list */}
      <div
        style={{
          position: "absolute",
          top: 350,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {items.map((item, i) => {
          const enter = spring({ frame: frame - item.delay, fps, config: { damping: 12, stiffness: 80 } });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                backgroundColor: "rgba(16,185,129,0.04)",
                borderRadius: 16,
                padding: "22px 24px",
                border: "1px solid rgba(16,185,129,0.1)",
                opacity: enter,
                transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)`,
              }}
            >
              <span style={{ fontSize: 30, flexShrink: 0 }}>{item.icon}</span>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 24,
                  color: LIGHT_TEXT,
                  fontWeight: 500,
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Logo at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <Img src={staticFile("logo.png")} style={{ width: 60, height: 60, borderRadius: 12, marginBottom: 12 }} />
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad9_BeforeAfter: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={110}>
        <BeforeScene />
      </Sequence>
      <Sequence from={110} durationInFrames={130}>
        <AfterScene />
      </Sequence>
    </AbsoluteFill>
  );
};
