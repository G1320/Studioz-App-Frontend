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

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: Category Grid ──
const CategoryGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const categories = [
    { name: "הפקה מוזיקלית", icon: "🎹", color: "#7c3aed" },
    { name: "הקלטת פודקאסט", icon: "🎙️", color: "#2563eb" },
    { name: "מיקס", icon: "🎚️", color: "#059669" },
    { name: "מאסטרינג", icon: "💿", color: "#d97706" },
    { name: "הקלטת שירה וכלים", icon: "🎤", color: "#dc2626" },
    { name: "חזרות להרכבים", icon: "🥁", color: "#8b5cf6" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        padding: 50,
        ...RTL,
      }}
    >
      {/* Header */}
      <div style={{ marginTop: 100, textAlign: "center" }}>
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            marginBottom: 25,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
          }}
        />
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 50,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            lineHeight: 1.2,
            opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          מה אתה <span style={{ color: GOLD }}>מחפש?</span>
        </h1>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 22,
            color: SUBTLE_TEXT,
            margin: "0 0 40px",
            opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          מצא את המרחב המושלם לפרויקט שלך
        </p>
      </div>

      {/* Category cards in 2-column grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 18,
          justifyContent: "center",
        }}
      >
        {categories.map((cat, i) => {
          const delay = 15 + i * 8;
          const enter = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 90 } });

          return (
            <div
              key={i}
              style={{
                width: "45%",
                backgroundColor: DARK_CARD,
                borderRadius: 20,
                padding: "30px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                opacity: enter,
                transform: `scale(${interpolate(enter, [0, 1], [0.7, 1])}) translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
              }}
            >
              {/* Icon with colored glow */}
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 20,
                  backgroundColor: `${cat.color}20`,
                  border: `1px solid ${cat.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 36 }}>{cat.icon}</span>
              </div>
              <span
                style={{
                  fontFamily: "'DM Sans', 'Heebo', sans-serif",
                  fontSize: 20,
                  fontWeight: 600,
                  color: LIGHT_TEXT,
                  textAlign: "center",
                }}
              >
                {cat.name}
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
      style={{
        backgroundColor: DARK_BG,
        justifyContent: "center",
        alignItems: "center",
        ...RTL,
      }}
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${enter})`,
        }}
      >
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 40px 10px",
            lineHeight: 1.2,
          }}
        >
          6 קטגוריות.
        </h1>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: GOLD,
            textAlign: "center",
            margin: "0 0 25px",
          }}
        >
          אינסוף אפשרויות.
        </h1>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 24,
            color: SUBTLE_TEXT,
            textAlign: "center",
            margin: "0 0 40px",
            opacity: interpolate(frame, [12, 25], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          חפש, השווה והזמן — הכל במקום אחד
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
          <span
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 26,
              fontWeight: 700,
              color: DARK_BG,
            }}
          >
            מצא אולפן
          </span>
        </div>
        <span
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 16,
            color: SUBTLE_TEXT,
            marginTop: 20,
            opacity: interpolate(frame, [30, 42], [0, 0.7], { extrapolateRight: "clamp" }),
          }}
        >
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad5_Categories: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150}>
        <CategoryGrid />
      </Sequence>
      <Sequence from={150} durationInFrames={90}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
