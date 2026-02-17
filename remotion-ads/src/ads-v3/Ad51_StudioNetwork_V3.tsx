/**
 * Ad51 — Studio Network / Directory V3
 * Map with pins showing studio locations across Israel
 * Stats: 500+ studios, 15+ cities, 50K+ bookings
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
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
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  StatCard,
  CTAScene,
  SectionLabel,
} from "./shared";
import { MapPin, Building2, Calendar } from "lucide-react";

/* ─── Map Pin ─── */
const MapPinDot: React.FC<{
  x: number;
  y: number;
  size?: number;
  delay: number;
  label?: string;
  color?: string;
}> = ({ x, y, size = 16, delay, label, color = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });
  const ringPulse = interpolate(
    Math.sin(frame * 0.05 + delay),
    [-1, 1],
    [1, 1.8]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${enter})`,
        opacity: enter,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Pulse ring */}
      <div
        style={{
          position: "absolute",
          width: size * 2.5,
          height: size * 2.5,
          borderRadius: "50%",
          border: `1px solid ${color}30`,
          transform: `scale(${ringPulse})`,
          opacity: interpolate(ringPulse, [1, 1.8], [0.6, 0]),
        }}
      />
      {/* Pin dot */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 12px ${color}60, 0 0 24px ${color}20`,
        }}
      />
      {label && (
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 13,
            fontWeight: 600,
            color: LIGHT_TEXT,
            marginTop: 6,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

/* ─── Israel Map Outline (simplified) ─── */
const IsraelMapOutline: React.FC = () => {
  const frame = useCurrentFrame();
  const drawProgress = interpolate(frame, [5, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      viewBox="0 0 200 500"
      style={{
        width: 300,
        height: 700,
        opacity: 0.15,
      }}
    >
      <path
        d="M100 20 L130 60 L140 120 L145 180 L140 220 L130 260 L120 300 L110 350 L100 400 L95 430 L100 460 L105 480 L90 480 L80 460 L75 430 L70 400 L65 350 L60 300 L55 260 L50 220 L55 180 L60 120 L70 60 Z"
        fill="none"
        stroke={GOLD}
        strokeWidth={2}
        strokeDasharray={1500}
        strokeDashoffset={1500 * (1 - drawProgress)}
      />
    </svg>
  );
};

/* ─── Scene 1: Map with Pins ─── */
const MapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  const cities = [
    { x: 460, y: 380, delay: 15, label: "תל אביב", size: 20, color: GOLD },
    { x: 500, y: 440, delay: 22, label: "ירושלים", size: 18, color: GOLD },
    { x: 430, y: 320, delay: 28, label: "חיפה", size: 16, color: ACCENT_BLUE },
    { x: 520, y: 460, delay: 33, label: "באר שבע", size: 14, color: SUCCESS },
    { x: 475, y: 395, delay: 38, label: "רמת גן", size: 12, color: ACCENT_BLUE },
    { x: 445, y: 365, delay: 42, label: "הרצליה", size: 12, color: SUCCESS },
    { x: 490, y: 410, delay: 46, label: "ראשון", size: 12, color: GOLD },
    { x: 455, y: 350, delay: 50, label: "נתניה", size: 11, color: ACCENT_BLUE },
    { x: 440, y: 400, delay: 54, label: "חולון", size: 11, color: SUCCESS },
    { x: 510, y: 425, delay: 58, label: "פ״ת", size: 10, color: GOLD },
    { x: 470, y: 340, delay: 62, label: "כ״ס", size: 10, color: ACCENT_BLUE },
    { x: 420, y: 490, delay: 66, label: "אילת", size: 10, color: GOLD },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.06} />

      <div
        style={{
          padding: "70px 48px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SectionLabel text="רשת סטודיואים" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "18px 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          הצטרף לרשת
          {"\n"}
          <GoldText>הגדולה בישראל</GoldText>
        </h2>

        <GoldLine width={140} delay={10} />
      </div>

      {/* Map area with outline */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -45%)",
        }}
      >
        <IsraelMapOutline />
      </div>

      {/* City pins */}
      {cities.map((city, i) => (
        <MapPinDot key={i} {...city} />
      ))}

      {/* Stats row at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 36,
          right: 36,
          display: "flex",
          gap: 14,
          ...RTL,
        }}
      >
        <StatCard
          value="500+"
          label="סטודיואים"
          delay={70}
          Icon={Building2}
        />
        <StatCard
          value="15+"
          label="ערים"
          delay={78}
          Icon={MapPin}
        />
        <StatCard
          value="50K+"
          label="הזמנות"
          delay={86}
          Icon={Calendar}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const NetworkCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        הסטודיו שלך
        {"\n"}
        <GoldText>על המפה</GoldText>
      </>
    }
    buttonText="הוסף את הסטודיו שלך"
    freeText="חינם · בלי התחייבות"
    subText="חשיפה ל-50,000+ לקוחות פוטנציאליים"
  />
);

/* ─── Main Composition ─── */
export const Ad51_StudioNetwork_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160} premountFor={10}>
        <MapScene />
      </Sequence>
      <Sequence from={160} durationInFrames={80} premountFor={15}>
        <NetworkCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
