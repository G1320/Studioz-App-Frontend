/**
 * Ad20 — Multi-Location Management V3
 * Map-like visualization with multiple studio pins
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  ACCENT_BLUE,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldText,
  EmojiFeature,
  CTAScene,
} from "./shared";

/* ─── Map Pin Component ─── */
const MapPin: React.FC<{
  x: number;
  y: number;
  label: string;
  delay: number;
  color?: string;
  active?: boolean;
}> = ({ x, y, label, delay, color = GOLD, active = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 120 } });
  const pulse = active
    ? interpolate(Math.sin((frame - delay) * 0.1), [-1, 1], [0.9, 1.1])
    : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -100%) scale(${drop * pulse})`,
        opacity: drop,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Pin head */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: `${color}20`,
          border: `3px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: active ? `0 0 30px ${color}40` : `0 0 15px ${color}15`,
        }}
      >
        <span style={{ fontSize: 24 }}>🏢</span>
      </div>
      {/* Pin stem */}
      <div
        style={{
          width: 3,
          height: 20,
          backgroundColor: color,
          borderRadius: 2,
        }}
      />
      {/* Label */}
      <div
        style={{
          marginTop: 8,
          backgroundColor: DARK_CARD,
          borderRadius: 10,
          padding: "6px 14px",
          border: `1px solid ${color}25`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: 16,
            fontWeight: 600,
            color: LIGHT_TEXT,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

/* ─── Scene 1: Map Concept ─── */
const MapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} color={ACCENT_BLUE} />
      <RadialGlow x="50%" y="40%" size={600} color={ACCENT_BLUE} opacity={0.06} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 20,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
            opacity: headEnter,
          }}
        >
          📍 ניהול מרחוק
        </span>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "16px 50px 0",
            lineHeight: 1.3,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [8, 22], [20, 0], { extrapolateRight: "clamp" })}px)`,
          }}
        >
          כל הסניפים{"\n"}
          <GoldText>במקום אחד</GoldText>
        </h2>
      </div>

      {/* Map grid lines */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 40,
          right: 40,
          bottom: 380,
          borderRadius: 24,
          border: `1px solid ${ACCENT_BLUE}15`,
          backgroundColor: `${DARK_CARD}80`,
          overflow: "hidden",
        }}
      >
        {/* Grid pattern */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`h-${i}`}
            style={{
              position: "absolute",
              top: `${(i + 1) * 16.6}%`,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: `${ACCENT_BLUE}08`,
            }}
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`v-${i}`}
            style={{
              position: "absolute",
              left: `${(i + 1) * 20}%`,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: `${ACCENT_BLUE}08`,
            }}
          />
        ))}

        {/* Connection lines between pins */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <line
            x1="25%"
            y1="30%"
            x2="60%"
            y2="50%"
            stroke={`${GOLD}20`}
            strokeWidth={2}
            strokeDasharray="8,6"
            style={{
              opacity: interpolate(frame, [40, 55], [0, 1], {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              }),
            }}
          />
          <line
            x1="60%"
            y1="50%"
            x2="75%"
            y2="25%"
            stroke={`${GOLD}20`}
            strokeWidth={2}
            strokeDasharray="8,6"
            style={{
              opacity: interpolate(frame, [50, 65], [0, 1], {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              }),
            }}
          />
          <line
            x1="25%"
            y1="30%"
            x2="40%"
            y2="75%"
            stroke={`${GOLD}20`}
            strokeWidth={2}
            strokeDasharray="8,6"
            style={{
              opacity: interpolate(frame, [55, 70], [0, 1], {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              }),
            }}
          />
        </svg>

        {/* Studio pins */}
        <MapPin x={240} y={240} label="סטודיו תל אביב" delay={20} active />
        <MapPin x={580} y={380} label="סטודיו ירושלים" delay={30} color={ACCENT_BLUE} />
        <MapPin x={720} y={200} label="סטודיו חיפה" delay={40} color={SUCCESS} />
        <MapPin x={380} y={560} label="סטודיו באר שבע" delay={50} color={GOLD} />
      </div>

      {/* Feature row */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 14,
          flexWrap: "wrap",
          padding: "0 40px",
          ...RTL,
        }}
      >
        <EmojiFeature emoji="📊" label="דוחות לכל סניף" delay={60} />
        <EmojiFeature emoji="👥" label="צוות לכל מיקום" delay={70} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const LocationCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        נהל את כל הסניפים{"\n"}
        <GoldText>ממסך אחד</GoldText>
      </>
    }
    buttonText="התחל לנהל עכשיו"
    freeText="התחל בחינם — ₪0/חודש"
    subText="ללא כרטיס אשראי · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad20_MultiLocation_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <MapScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <LocationCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
