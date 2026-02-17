/**
 * Ad49_FlexiblePricing_V4
 * Theme: Flexible pricing models — NOT smart/dynamic pricing
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
import { Clock, Music, Briefcase, Calendar } from "lucide-react";
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
  BulletList,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Pricing Models ─── */
const ScenePricingModels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={600} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 25,
        }}
      >
        <SectionLabel text="PRICING" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-30, 0])}px)`,
          }}
        >
          {"תמחור "}
          <GoldText>{"גמיש"}</GoldText>
          {" — אתם קובעים"}
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <FeatureCard
            Icon={Clock}
            title="לפי שעה"
            desc="תעריף שעתי לכל שירות"
            delay={15}
          />
          <FeatureCard
            Icon={Music}
            title="לפי שיר"
            desc="תמחור לפי יחידת עבודה"
            delay={25}
          />
          <FeatureCard
            Icon={Briefcase}
            title="לפי פרויקט"
            desc="מחיר קבוע לפרויקט שלם"
            delay={35}
          />
          <FeatureCard
            Icon={Calendar}
            title="לפי יום"
            desc="תעריף ליום עבודה מלא"
            delay={45}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Service Details ─── */
const SceneDetails: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.07} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <SectionLabel text="SERVICES" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"שירותים "}
          <GoldText>{"ללא הגבלה"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ marginTop: 10 }}>
          <BulletList
            items={[
              "שירותים ללא הגבלה",
              "מחיר שונה לכל שירות",
              "תיאור מותאם לכל שירות",
            ]}
            startDelay={15}
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
        {"קבעו את "}
        <GoldText>{"התמחור שלכם"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad49_FlexiblePricing_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <ScenePricingModels />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneDetails />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
