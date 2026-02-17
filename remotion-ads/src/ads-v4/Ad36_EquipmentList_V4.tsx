/**
 * Ad36_EquipmentList_V4
 * Theme: Equipment listing feature
 * Duration: 240 frames (8s) at 30fps, 1080x1920
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  Mic,
  Headphones,
  Speaker,
  Monitor,
} from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  RTL,
  FONT_HEADING,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  FeatureCard,
  ScreenshotFrame,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Equipment Feature Cards ─── */
const SceneEquipment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 44px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <SectionLabel text="EQUIPMENT" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          {"הציגו את "}
          <GoldText>{"הציוד שלכם"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <FeatureCard Icon={Mic} title="מיקרופונים" desc="פרטו את הדגמים שלכם" delay={12} />
          <FeatureCard Icon={Headphones} title="אוזניות" desc="ציוד מוניטור מקצועי" delay={22} />
          <FeatureCard Icon={Speaker} title="רמקולים" desc="מערכת ההאזנה באולפן" delay={32} />
          <FeatureCard Icon={Monitor} title="מסכים" desc="ציוד נלווה ומסכים" delay={42} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Studio Details Screenshot ─── */
const SceneScreenshot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="45%" size={600} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 40px 60px",
          height: "100%",
          gap: 25,
        }}
      >
        <SectionLabel text="STUDIO PAGE" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 42,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"הכל "}
          <GoldText>{"מוצג ללקוח"}</GoldText>
        </h2>

        <div style={{ marginTop: 15 }}>
          <ScreenshotFrame
            src="images/optimized/Studioz-Studio-Details-1-Light.webp"
            delay={10}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const SceneCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        {"הציגו את הציוד "}
        <GoldText>{"שמבדיל אתכם"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad36_EquipmentList_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneEquipment />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneScreenshot />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
