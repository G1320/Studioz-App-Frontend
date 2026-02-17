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

// ── Scene 1: Google ranking reveal ──
const RankingReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 60 } });
  const highlightOpacity = interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp" });
  const highlightPulse = interpolate(frame % 50, [0, 25, 50], [0.8, 1, 0.8]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      {/* Header */}
      <div style={{ position: "absolute", top: 80, left: 0, right: 0, textAlign: "center", zIndex: 10 }}>
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
          נראות בגוגל
        </span>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "10px 40px 0",
            lineHeight: 1.2,
            opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          העמוד שלך{"\n"}<span style={{ color: GOLD }}>בראש תוצאות החיפוש</span>
        </h1>
      </div>

      {/* Google ranking screenshot */}
      <div
        style={{
          position: "absolute",
          top: 340,
          left: 30,
          right: 30,
          transform: `translateY(${interpolate(slideUp, [0, 1], [200, 0])}px)`,
          opacity: slideUp,
        }}
      >
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(255,209,102,0.15)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        >
          <Img
            src={staticFile("images/optimized/For-Owners-Google-Ranking.png")}
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Highlight glow overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: -5,
            right: -5,
            height: 120,
            borderRadius: 20,
            border: `2px solid ${GOLD}`,
            opacity: highlightOpacity * highlightPulse,
            boxShadow: `0 0 30px rgba(255,209,102,0.3)`,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Bottom stats */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 30,
          padding: "0 40px",
        }}
      >
        {[
          { label: "SEO מותאם", icon: "🔍" },
          { label: "מעל Google Business", icon: "📈" },
          { label: "חשיפה מקסימלית", icon: "🌍" },
        ].map((item, i) => {
          const pillEnter = spring({ frame: frame - 60 - i * 10, fps, config: { damping: 12 } });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                opacity: pillEnter,
                transform: `translateY(${interpolate(pillEnter, [0, 1], [20, 0])}px)`,
              }}
            >
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <span
                style={{
                  fontFamily: "'DM Sans', 'Heebo', sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: LIGHT_TEXT,
                  textAlign: "center",
                }}
              >
                {item.label}
              </span>
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

  return (
    <AbsoluteFill
      style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}
    >
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,209,102,0.08) 0%, transparent 60%)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})` }}>
        <Img src={staticFile("logo.png")} style={{ width: 90, height: 90, borderRadius: 18, marginBottom: 30 }} />
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 40px 10px",
            lineHeight: 1.2,
          }}
        >
          שהלקוחות <span style={{ color: GOLD }}>ימצאו אותך</span>
        </h2>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 22,
            color: SUBTLE_TEXT,
            textAlign: "center",
            margin: "0 0 35px",
            opacity: interpolate(frame, [12, 25], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          רישום חינמי · ללא התחייבות
        </p>
        <div
          style={{
            backgroundColor: GOLD,
            padding: "18px 50px",
            borderRadius: 14,
            opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" }),
            boxShadow: "0 0 40px rgba(255,209,102,0.2)",
          }}
        >
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>
            פרסם את האולפן שלך
          </span>
        </div>
        <span
          style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: SUBTLE_TEXT, marginTop: 18, opacity: interpolate(frame, [30, 42], [0, 0.7], { extrapolateRight: "clamp" }) }}
        >
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad6_GoogleRanking: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150}>
        <RankingReveal />
      </Sequence>
      <Sequence from={150} durationInFrames={90}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
