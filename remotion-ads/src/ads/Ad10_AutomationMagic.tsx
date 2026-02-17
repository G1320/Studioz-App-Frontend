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

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: Automation chain ──
const AutomationChain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chain = [
    { icon: "👤", text: "לקוח מזמין סשן", color: "#2563eb", delay: 5 },
    { icon: "📅", text: "הזמנה נכנסת ליומן", color: "#7c3aed", delay: 30 },
    { icon: "✉️", text: "אישור נשלח ללקוח", color: "#059669", delay: 55 },
    { icon: "💳", text: "תשלום מתקבל", color: "#d97706", delay: 80 },
    { icon: "🧾", text: "חשבונית נוצרת אוטומטית", color: "#dc2626", delay: 105 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 45, ...RTL }}>
      {/* Header */}
      <div style={{ marginTop: 80, textAlign: "center", marginBottom: 40 }}>
        <span
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 18,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          אוטומציה
        </span>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "10px 0 0",
            lineHeight: 1.2,
            opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          העסק רץ <span style={{ color: GOLD }}>לבד</span>
        </h1>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 22,
            color: SUBTLE_TEXT,
            margin: "8px 0 0",
            opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          בלי שתרים אצבע
        </p>
      </div>

      {/* Chain items with connecting line */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Connecting line */}
        <div
          style={{
            position: "absolute",
            right: 38,
            top: 40,
            width: 3,
            height: interpolate(frame, [10, 120], [0, 800], { extrapolateRight: "clamp" }),
            background: `linear-gradient(180deg, ${GOLD}40 0%, ${GOLD}10 100%)`,
            borderRadius: 2,
          }}
        />

        {chain.map((item, i) => {
          const enter = spring({ frame: frame - item.delay, fps, config: { damping: 12, stiffness: 80 } });
          const checkDelay = item.delay + 15;
          const checked = interpolate(frame, [checkDelay, checkDelay + 8], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: enter,
                transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)`,
              }}
            >
              {/* Circle with icon */}
              <div
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: "50%",
                  backgroundColor: checked > 0.5 ? "rgba(16,185,129,0.15)" : `${item.color}15`,
                  border: `2px solid ${checked > 0.5 ? SUCCESS : item.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  zIndex: 2,
                  transition: "all 0.3s",
                }}
              >
                <span style={{ fontSize: checked > 0.5 ? 22 : 24 }}>
                  {checked > 0.5 ? "✓" : item.icon}
                </span>
              </div>

              {/* Card */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: DARK_CARD,
                  borderRadius: 16,
                  padding: "18px 22px",
                  border: `1px solid ${checked > 0.5 ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)"}`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                    fontSize: 22,
                    color: LIGHT_TEXT,
                    fontWeight: 500,
                  }}
                >
                  {item.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* "All automatic" badge */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [130, 145], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255,209,102,0.08)",
            border: `1px solid ${GOLD}30`,
            borderRadius: 50,
            padding: "12px 35px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 22 }}>⚡</span>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 20, fontWeight: 600, color: GOLD }}>
            הכל אוטומטי
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: CTA ──
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,209,102,0.08) 0%, transparent 60%)" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 90, height: 90, borderRadius: 18, marginBottom: 25 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 8px", lineHeight: 1.2 }}>
          תן למערכת
        </h2>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: GOLD, textAlign: "center", margin: "0 0 30px" }}>
          לעבוד בשבילך
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }), boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>התחל בחינם</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: SUBTLE_TEXT, marginTop: 18, opacity: interpolate(frame, [25, 38], [0, 0.7], { extrapolateRight: "clamp" }) }}>
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad10_AutomationMagic: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={170}>
        <AutomationChain />
      </Sequence>
      <Sequence from={170} durationInFrames={80}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
