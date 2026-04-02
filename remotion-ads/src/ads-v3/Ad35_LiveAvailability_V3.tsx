/**
 * Ad35 — Live Availability V3
 * Live availability calendar with screenshot + feature pills
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
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  EmojiFeature,
  ScreenshotFrame,
  Badge,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Scene 1: Availability Screenshot ─── */
const AvailabilityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          padding: "0 48px",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <SectionLabel text="LIVE AVAILABILITY" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "18px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          זמינות <GoldText>בזמן אמת</GoldText>
        </h2>

        <GoldLine width={120} delay={10} />
      </div>

      {/* Screenshot */}
      <div style={{ position: "absolute", top: 340, left: 35, right: 35 }}>
        <ScreenshotFrame
          src="images/optimized/Studio-Availability-Controls-desktop-1-V3.webp"
          delay={8}
          borderRadius={20}
        />
      </div>

      {/* Live indicator */}
      <div
        style={{
          position: "absolute",
          top: 310,
          left: 60,
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity: interpolate(frame, [15, 30], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: SUCCESS,
            boxShadow: `0 0 12px ${SUCCESS}`,
            animation: "pulse 2s infinite",
          }}
        />
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: 14,
            fontWeight: 600,
            color: SUCCESS,
            letterSpacing: 1.5,
          }}
        >
          LIVE
        </span>
      </div>

      {/* Feature pills */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          padding: "0 40px",
        }}
      >
        <EmojiFeature emoji="👁️" label="הלקוחות רואים מה פנוי" delay={35} />
        <EmojiFeature emoji="🔄" label="מתעדכן אוטומטית" delay={45} />
        <EmojiFeature emoji="🔒" label="חסום שעות ידנית" delay={55} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const AvailabilityCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        שליטה מלאה{"\n"}
        <GoldText>בזמינות שלך</GoldText>
      </>
    }
    buttonText="נהל זמינות חכמה"
    freeText="חינם לתמיד — כל התכונות כלולות"
  />
);

/* ─── Main Composition ─── */
export const Ad35_LiveAvailability_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={155} premountFor={10}>
        <AvailabilityScene />
      </Sequence>
      <Sequence from={155} durationInFrames={85} premountFor={15}>
        <AvailabilityCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
