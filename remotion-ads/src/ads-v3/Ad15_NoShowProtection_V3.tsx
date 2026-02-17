/**
 * Ad15 — No-Show Protection V3
 * Problem (lost revenue) → Solution (deposits, reminders, policy)
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
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  EmojiFeature,
  StatCard,
  ScreenshotFrame,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Scene 1: No-Show Problem + Solution ─── */
const NoShowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  // Problem reveal
  const problemEnter = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12 },
  });

  // Money lost counter animation
  const moneyCounter = Math.floor(
    interpolate(frame, [15, 50], [0, 12500], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Solution transition
  const solutionEnter = spring({
    frame: frame - 65,
    fps,
    config: { damping: 14, stiffness: 60 },
  });

  // Stat appear
  const statEnter = spring({
    frame: frame - 110,
    fps,
    config: SPRING_BOUNCY,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow
        x="50%"
        y="30%"
        size={500}
        color={frame < 60 ? RED : SUCCESS}
        opacity={0.07}
      />

      <div
        style={{
          padding: "70px 48px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <SectionLabel text="הגנה מביטולים" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "14px 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          ביטולים עולים{"\n"}
          <span style={{ color: RED }}>ביוקר</span>
        </h2>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <GoldLine width={120} delay={8} />
        </div>

        {/* Problem: Money lost counter */}
        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 22,
            padding: "30px 24px",
            border: `1px solid ${RED}20`,
            textAlign: "center",
            marginBottom: 20,
            opacity: problemEnter,
            transform: `scale(${problemEnter})`,
            boxShadow: `0 0 30px ${RED}10`,
          }}
        >
          <span style={{ fontSize: 44 }}>💸</span>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 52,
              fontWeight: 700,
              color: RED,
              marginTop: 8,
              filter: `drop-shadow(0 0 12px ${RED}30)`,
            }}
          >
            -₪{moneyCounter.toLocaleString()}
          </div>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 18,
              color: SUBTLE_TEXT,
              marginTop: 6,
            }}
          >
            הפסד ממוצע מביטולים בחודש
          </div>
        </div>

        {/* Solution features */}
        <div
          style={{
            opacity: solutionEnter,
            transform: `translateY(${interpolate(solutionEnter, [0, 1], [50, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 28,
              fontWeight: 700,
              color: SUCCESS,
              textAlign: "center",
              marginBottom: 18,
            }}
          >
            ✅ הפתרון:
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <EmojiFeature emoji="💳" label="גביית מקדמה אוטומטית" delay={70} />
            <EmojiFeature emoji="🔔" label="תזכורות אוטומטיות" delay={80} />
            <EmojiFeature emoji="📋" label="מדיניות ביטולים ברורה" delay={90} />
          </div>
        </div>

        {/* Stat */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "auto",
            marginBottom: 10,
            opacity: statEnter,
            transform: `scale(${statEnter})`,
          }}
        >
          <div
            style={{
              backgroundColor: `${SUCCESS}12`,
              border: `2px solid ${SUCCESS}30`,
              borderRadius: 20,
              padding: "20px 40px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 50,
                fontWeight: 700,
                color: SUCCESS,
                filter: `drop-shadow(0 0 10px ${SUCCESS}20)`,
              }}
            >
              -85%
            </div>
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: 18,
                color: LIGHT_TEXT,
                marginTop: 4,
              }}
            >
              ביטולים
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard CTA ─── */
const NoShowCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const screenshotEnter = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 60 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={10} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

      {/* Dashboard screenshot */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 30,
          right: 30,
          transform: `translateY(${interpolate(screenshotEnter, [0, 1], [120, 0])}px)`,
          opacity: screenshotEnter,
        }}
      >
        <ScreenshotFrame
          src="images/optimized/Studioz-Dashboard-Calendar.webp"
          delay={0}
          borderRadius={20}
        />
      </div>

      {/* Bottom overlay with CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "100px 50px 120px",
          background: `linear-gradient(0deg, ${DARK_BG} 50%, transparent 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 42,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 20px",
            opacity: interpolate(frame, [15, 30], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          הגן על <GoldText>ההכנסות שלך</GoldText>
        </h2>

        <div
          style={{
            backgroundColor: GOLD,
            padding: "18px 44px",
            borderRadius: 16,
            opacity: interpolate(frame, [30, 45], [0, 1], {
              extrapolateRight: "clamp",
            }),
            boxShadow: `0 0 50px ${GOLD}25`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 26,
              fontWeight: 700,
              color: DARK_BG,
            }}
          >
            הפעל הגנה מביטולים ←
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Main Composition ─── */
export const Ad15_NoShowProtection_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <NoShowScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <NoShowCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
