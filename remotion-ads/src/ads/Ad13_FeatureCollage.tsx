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

// ── Scene 1: Feature bento grid ──
const BentoGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tiles = [
    { title: "יומן חכם", icon: "📅", desc: "סנכרון עם Google Calendar", span: "wide", delay: 5 },
    { title: "תשלומים", icon: "💳", desc: "סליקה מאובטחת", span: "normal", delay: 15 },
    { title: "חשבוניות", icon: "🧾", desc: "אוטומטי לחלוטין", span: "normal", delay: 22 },
    { title: "פרויקטים מרחוק", icon: "🌍", desc: "הרוויח מכל מקום", span: "normal", delay: 30 },
    { title: "אנליטיקס", icon: "📊", desc: "מעקב הכנסות וצמיחה", span: "normal", delay: 38 },
    { title: "עיצוב פרימיום", icon: "✨", desc: "עמוד אולפן מקצועי בהיר/כהה", span: "wide", delay: 46 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      {/* Header */}
      <div style={{ marginTop: 80, textAlign: "center", marginBottom: 30 }}>
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 55,
            height: 55,
            borderRadius: 11,
            marginBottom: 18,
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
          }}
        />
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 5px",
            lineHeight: 1.2,
            opacity: interpolate(frame, [3, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          הכל <span style={{ color: GOLD }}>במקום אחד</span>
        </h1>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 22,
            color: SUBTLE_TEXT,
            margin: 0,
            opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          כל מה שצריך לנהל את האולפן
        </p>
      </div>

      {/* Bento tiles */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        {tiles.map((tile, i) => {
          const enter = spring({ frame: frame - tile.delay, fps, config: { damping: 12, stiffness: 90 } });
          const isWide = tile.span === "wide";

          return (
            <div
              key={i}
              style={{
                width: isWide ? "100%" : "calc(50% - 7px)",
                backgroundColor: DARK_CARD,
                borderRadius: 20,
                padding: isWide ? "28px 25px" : "25px 20px",
                border: "1px solid rgba(255,255,255,0.05)",
                opacity: enter,
                transform: `scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
                display: "flex",
                flexDirection: isWide ? "row" : "column",
                alignItems: isWide ? "center" : "flex-start",
                gap: isWide ? 20 : 10,
              }}
            >
              <div
                style={{
                  width: isWide ? 58 : 52,
                  height: isWide ? 58 : 52,
                  borderRadius: 16,
                  backgroundColor: "rgba(255,209,102,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: isWide ? 28 : 26 }}>{tile.icon}</span>
              </div>
              <div>
                <h3 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: isWide ? 24 : 22, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 4px" }}>
                  {tile.title}
                </h3>
                <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: isWide ? 18 : 16, color: SUBTLE_TEXT, margin: 0 }}>
                  {tile.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: CTA ──
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  const pulse = interpolate(frame % 45, [0, 22, 45], [1, 1.04, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,209,102,0.08) 0%, transparent 60%)" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 50, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 8px", lineHeight: 1.2 }}>
          פחות כאבי ראש.
        </h2>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 50, fontWeight: 700, color: GOLD, textAlign: "center", margin: "0 0 30px" }}>
          יותר סשנים.
        </h2>
        <div
          style={{
            backgroundColor: GOLD,
            padding: "20px 55px",
            borderRadius: 14,
            transform: `scale(${pulse})`,
            opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }),
            boxShadow: "0 0 50px rgba(255,209,102,0.25)",
          }}
        >
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 26, fontWeight: 700, color: DARK_BG }}>
            פרסם את האולפן שלך
          </span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: SUBTLE_TEXT, marginTop: 20, opacity: interpolate(frame, [25, 38], [0, 0.7], { extrapolateRight: "clamp" }) }}>
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad13_FeatureCollage: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150}>
        <BentoGrid />
      </Sequence>
      <Sequence from={150} durationInFrames={90}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
