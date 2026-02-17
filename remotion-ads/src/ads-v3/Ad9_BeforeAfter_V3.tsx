/**
 * Ad9 — Before/After V3
 * Dramatic split animation: problems (red) vs solutions (green)
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
  RED,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldText,
  CTAScene,
} from "./shared";

/* ─── Problem/Solution Item ─── */
const ComparisonItem: React.FC<{
  emoji: string;
  text: string;
  type: "problem" | "solution";
  delay: number;
}> = ({ emoji, text, type, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 12 } });
  const isProblem = type === "problem";
  const accentColor = isProblem ? RED : SUCCESS;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: "20px 22px",
        border: `1px solid ${accentColor}20`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [isProblem ? 60 : -60, 0])}px)`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 0 30px ${accentColor}05`,
      }}
    >
      <span style={{ fontSize: 34, flexShrink: 0 }}>{emoji}</span>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 22,
          color: LIGHT_TEXT,
          fontWeight: 500,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/* ─── Scene 1: Before/After Split ─── */
const SplitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  // Split line animation
  const splitReveal = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // "After" side slides in
  const afterEnter = spring({
    frame: frame - 70,
    fps,
    config: { damping: 14, stiffness: 60 },
  });

  // Transition flash
  const flashOpacity = interpolate(frame, [65, 70, 75], [0, 0.15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />

      {/* Before glow (red) */}
      <RadialGlow
        x="50%"
        y="35%"
        size={500}
        color={RED}
        opacity={interpolate(frame, [0, 70, 90], [0.06, 0.06, 0], {
          extrapolateRight: "clamp",
        })}
      />

      {/* After glow (green) */}
      <RadialGlow
        x="50%"
        y="65%"
        size={500}
        color={SUCCESS}
        opacity={interpolate(frame, [70, 90], [0, 0.06], {
          extrapolateRight: "clamp",
        })}
      />

      {/* Flash transition */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: GOLD,
          opacity: flashOpacity,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />

      <div
        style={{
          padding: "70px 44px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 50,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 30px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          <span style={{ color: RED }}>לפני</span>
          {" ← → "}
          <span style={{ color: SUCCESS }}>אחרי</span>
        </h2>

        {/* BEFORE section */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 20,
              fontWeight: 600,
              color: RED,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: interpolate(frame, [5, 15], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: RED,
                boxShadow: `0 0 10px ${RED}`,
              }}
            />
            בלי Studioz
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <ComparisonItem
              emoji="📞"
              text="שיחות אינסופיות"
              type="problem"
              delay={10}
            />
            <ComparisonItem
              emoji="📝"
              text="ניהול ידני"
              type="problem"
              delay={20}
            />
            <ComparisonItem
              emoji="😤"
              text="לקוחות מתוסכלים"
              type="problem"
              delay={30}
            />
          </div>
        </div>

        {/* Divider line */}
        <div
          style={{
            width: "100%",
            height: 2,
            background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)`,
            margin: "18px 0",
            opacity: interpolate(frame, [65, 80], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        />

        {/* AFTER section */}
        <div
          style={{
            opacity: afterEnter,
            transform: `translateY(${interpolate(afterEnter, [0, 1], [60, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 20,
              fontWeight: 600,
              color: SUCCESS,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: SUCCESS,
                boxShadow: `0 0 10px ${SUCCESS}`,
              }}
            />
            עם Studioz
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <ComparisonItem
              emoji="🤖"
              text="הזמנות אוטומטיות"
              type="solution"
              delay={80}
            />
            <ComparisonItem
              emoji="📊"
              text="דשבורד חכם"
              type="solution"
              delay={90}
            />
            <ComparisonItem
              emoji="😊"
              text="לקוחות מרוצים"
              type="solution"
              delay={100}
            />
          </div>
        </div>

        {/* Verdict */}
        <p
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 30,
            fontWeight: 700,
            color: GOLD,
            textAlign: "center",
            marginTop: 30,
            opacity: interpolate(frame, [115, 130], [0, 1], {
              extrapolateRight: "clamp",
            }),
            filter: `drop-shadow(0 0 18px ${GOLD}30)`,
          }}
        >
          הבחירה ברורה ✨
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const BeforeAfterCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        עבור ל<GoldText>אחרי</GoldText>
        {"\n"}כבר היום
      </>
    }
    buttonText="שדרג את האולפן שלך"
    freeText="התחל בחינם — ₪0/חודש"
    subText="ההבדל מורגש מיד"
  />
);

/* ─── Main Composition ─── */
export const Ad9_BeforeAfter_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={155} premountFor={10}>
        <SplitScene />
      </Sequence>
      <Sequence from={155} durationInFrames={85} premountFor={15}>
        <BeforeAfterCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
