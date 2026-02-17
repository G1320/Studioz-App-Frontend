/**
 * Ad48 — Professional Studio Presence V3
 * Uses studio detail screenshot to show professional look
 * Features: עיצוב מודרני, גלריה מקצועית, ביקורות, מיקום
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
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  ScreenshotFrame,
  EmojiFeature,
  CTAScene,
  SectionLabel,
  Badge,
} from "./shared";
import { Star } from "lucide-react";

/* ─── Scene 1: Professional Screenshot ─── */
const ProfessionalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />

      <div
        style={{
          padding: "70px 48px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SectionLabel text="נוכחות מקצועית" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "18px 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          דף סטודיו
          {"\n"}
          <GoldText>שעושה רושם</GoldText>
        </h2>

        <div style={{ marginBottom: 30 }}>
          <GoldLine width={140} delay={10} />
        </div>
      </div>

      {/* Screenshot */}
      <div style={{ position: "absolute", top: 370, left: 35, right: 35 }}>
        <ScreenshotFrame
          src="images/optimized/Studioz-Studio-Details-1-Light.webp"
          delay={10}
          borderRadius={22}
        />
      </div>

      {/* Floating badges */}
      <div
        style={{
          position: "absolute",
          top: 340,
          right: 20,
          opacity: interpolate(frame, [40, 55], [0, 1], {
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(
            frame,
            [40, 55],
            [20, 0],
            { extrapolateRight: "clamp" }
          )}px)`,
        }}
      >
        <Badge text="מעוצב מקצועית" color={GOLD} delay={40} Icon={Star} />
      </div>

      {/* Feature pills at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 12,
          padding: "0 30px",
          ...RTL,
        }}
      >
        {[
          { emoji: "🎨", label: "עיצוב מודרני" },
          { emoji: "📸", label: "גלריה מקצועית" },
          { emoji: "⭐", label: "ביקורות" },
          { emoji: "📍", label: "מיקום" },
        ].map((f, i) => (
          <EmojiFeature key={i} emoji={f.emoji} label={f.label} delay={45 + i * 8} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const ProfessionalCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        תראה מקצועי
        {"\n"}
        <GoldText>תמשוך לקוחות</GoldText>
      </>
    }
    buttonText="צור את דף הסטודיו שלך"
    freeText="חינם לחלוטין"
    subText="עמוד מקצועי תוך 5 דקות"
  />
);

/* ─── Main Composition ─── */
export const Ad48_ProfessionalLook_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160} premountFor={10}>
        <ProfessionalScene />
      </Sequence>
      <Sequence from={160} durationInFrames={80} premountFor={15}>
        <ProfessionalCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
