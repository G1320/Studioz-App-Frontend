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
const BLUE = "#2563eb";

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: Remote Projects Features ──
const RemoteFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { icon: "🕐", title: "עבודה א-סינכרונית", desc: "עבוד בקצב שלך, לקוחות מעלים קבצים — אתה מספק תוצאות", delay: 15 },
    { icon: "💰", title: "תמחור לפי פרויקט", desc: "קבע מחירים מותאמים לפרויקטים שלמים", delay: 40 },
    { icon: "💬", title: "צ'אט משולב", desc: "נהל פידבק והיסטוריית קבצים בשרשור מקצועי", delay: 65 },
    { icon: "🔒", title: "תשלומים מאובטחים", desc: "מקדמות אוטומטיות ותשלום עם סיום הפרויקט", delay: 90 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 45, ...RTL }}>
      {/* Header */}
      <div style={{ marginTop: 80, textAlign: "center", marginBottom: 30 }}>
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
          פרויקטים מרחוק
        </span>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "10px 0 0",
            lineHeight: 1.2,
            opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          הגדל הכנסות{"\n"}<span style={{ color: GOLD }}>מעבר לקירות האולפן</span>
        </h1>
      </div>

      {/* Feature cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {features.map((f, i) => {
          const enter = spring({ frame: frame - f.delay, fps, config: { damping: 12, stiffness: 80 } });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 18,
                backgroundColor: DARK_CARD,
                borderRadius: 18,
                padding: "22px 20px",
                border: "1px solid rgba(255,255,255,0.05)",
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: "rgba(255,209,102,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 26 }}>{f.icon}</span>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "'DM Sans', 'Heebo', sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: LIGHT_TEXT,
                    margin: "0 0 5px",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                    fontSize: 17,
                    color: SUBTLE_TEXT,
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 35,
          opacity: interpolate(frame, [100, 115], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {[
          { value: "+100%", label: "קיבולת" },
          { value: "ארצי", label: "טווח לקוחות" },
          { value: "גמיש", label: "לו״ז" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 36, fontWeight: 800, color: GOLD, direction: "ltr" }}>
              {s.value}
            </span>
            <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT, marginTop: 4 }}>
              {s.label}
            </span>
          </div>
        ))}
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
        <Img src={staticFile("logo.png")} style={{ width: 90, height: 90, borderRadius: 18, marginBottom: 30 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 8px", lineHeight: 1.2 }}>
          הרוויח יותר.
        </h2>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: GOLD, textAlign: "center", margin: "0 0 30px" }}>
          עבוד חכם.
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

export const Ad7_RemoteProjects: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160}>
        <RemoteFeatures />
      </Sequence>
      <Sequence from={160} durationInFrames={80}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
