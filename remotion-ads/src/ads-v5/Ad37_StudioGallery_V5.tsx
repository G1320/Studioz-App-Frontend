/**
 * Ad37_StudioGallery_V5
 * Theme: Professional photo gallery — NOT virtual tour
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
import { Image, Eye, Users } from "lucide-react";
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
  useScale,
} from "./shared";

/* ─── Scene 1: Gallery Screenshot ─── */
const SceneGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={s(500)} opacity={0.07} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(25),
        }}
      >
        <SectionLabel text="GALLERY" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(44),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-30), 0])}px)`,
          }}
        >
          {"גלריית תמונות "}
          <GoldText>{"מקצועית"}</GoldText>
        </h1>

        <GoldLine delay={10} width={120} />

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Studioz-Studio-Details-1-Light.webp"
            delay={12}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Feature Cards ─── */
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={s(600)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(50)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(28),
        }}
      >
        <SectionLabel text="FEATURES" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(42),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-20), 0])}px)`,
          }}
        >
          {"הציגו את האולפן "}
          <GoldText>{"בצורה הטובה ביותר"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(16), marginTop: s(10) }}>
          <FeatureCard
            Icon={Image}
            title="העלאת תמונות"
            desc="העלו תמונות באיכות גבוהה של האולפן"
            delay={15}
          />
          <FeatureCard
            Icon={Eye}
            title="תצוגה מרשימה"
            desc="גלריה מעוצבת בדף האולפן שלכם"
            delay={25}
          />
          <FeatureCard
            Icon={Users}
            title="משיכת לקוחות"
            desc="תמונות מקצועיות מגדילות הזמנות"
            delay={35}
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
        {"הראו ללקוחות "}
        <GoldText>{"מה שמחכה להם"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad37_StudioGallery_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneGallery />
    </Sequence>
    <Sequence from={80} durationInFrames={80} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
