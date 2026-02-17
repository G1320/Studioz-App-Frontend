/**
 * Ad37 — Studio Tour V3
 * Virtual studio tour with gallery cards and screenshot
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
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  EmojiFeature,
  ScreenshotFrame,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Gallery Card (placeholder) ─── */
const GalleryCard: React.FC<{
  label: string;
  delay: number;
  color: string;
  emoji: string;
}> = ({ label, delay, color, emoji }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: DARK_CARD,
        borderRadius: 20,
        overflow: "hidden",
        border: `1px solid ${color}18`,
        transform: `scale(${enter})`,
        opacity: enter,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 16px",
        gap: 12,
      }}
    >
      <span style={{ fontSize: 48 }}>{emoji}</span>
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 18,
          fontWeight: 600,
          color: LIGHT_TEXT,
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─── Scene 1: Gallery Showcase ─── */
const GalleryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="25%" size={500} opacity={0.08} />

      <div
        style={{
          padding: "80px 40px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <SectionLabel text="STUDIO TOUR" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "16px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          הציגו את האולפן{"\n"}
          <GoldText>בצורה מרשימה</GoldText>
        </h2>

        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Gallery cards row */}
        <div style={{ display: "flex", gap: 14, height: 180, marginBottom: 20 }}>
          <GalleryCard emoji="🎙️" label="חדר הקלטות" delay={15} color={GOLD} />
          <GalleryCard emoji="🎛️" label="חדר מיקסינג" delay={25} color={GOLD} />
          <GalleryCard emoji="🎶" label="חדר לייב" delay={35} color={GOLD} />
        </div>

        {/* Screenshot */}
        <div style={{ flex: 1 }}>
          <ScreenshotFrame
            src="images/optimized/Studioz-Studio-Details-1-Dark.webp"
            delay={20}
            borderRadius={20}
            maxHeight={500}
          />
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            marginTop: 24,
          }}
        >
          <EmojiFeature emoji="📸" label="גלריית תמונות מקצועית" delay={45} />
          <EmojiFeature emoji="🎥" label="סיור וירטואלי" delay={55} />
          <EmojiFeature emoji="👁️" label="תצוגה מקצועית ללקוחות" delay={65} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const TourCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        תנו ללקוחות{"\n"}
        <GoldText>לראות ולהתרשם</GoldText>
      </>
    }
    buttonText="צור עמוד אולפן"
    freeText="התחל בחינם — ₪0/חודש"
  />
);

/* ─── Main Composition ─── */
export const Ad37_StudioTour_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={155} premountFor={10}>
        <GalleryScene />
      </Sequence>
      <Sequence from={155} durationInFrames={85} premountFor={15}>
        <TourCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
