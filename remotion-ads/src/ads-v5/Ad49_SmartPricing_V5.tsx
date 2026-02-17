/**
 * Ad49_FlexiblePricing_V5
 * Theme: Flexible pricing — NOT smart/dynamic
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
  ScreenshotFrame,
  BulletList,
  CTAScene,
  useScale,
} from "./shared";

/* ─── Scene 1: Pricing Options ─── */
const ScenePricing: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={s(550)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(44)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(28),
        }}
      >
        <SectionLabel text="PRICING" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(46),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(6)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-25), 0])}px)`,
          }}
        >
          {"תמחור גמיש"}
          {"\n"}
          <GoldText>{"אתם קובעים"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(16), marginTop: s(15) }}>
          <FeatureCard
            Icon={Clock}
            title="לפי שעה"
            desc="תעריף שעתי גמיש"
            delay={12}
          />
          <FeatureCard
            Icon={Music}
            title="לפי שיר"
            desc="מחיר קבוע לכל שיר"
            delay={22}
          />
          <FeatureCard
            Icon={Briefcase}
            title="לפי פרויקט"
            desc="חבילה מותאמת ללקוח"
            delay={32}
          />
          <FeatureCard
            Icon={Calendar}
            title="לפי יום"
            desc="תעריף יומי מלא"
            delay={42}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Revenue Screenshot + Bullets ─── */
const SceneRevenue: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={s(500)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
          gap: s(25),
        }}
      >
        <SectionLabel text="REVENUE" delay={0} />

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
          {"הכנסות "}
          <GoldText>{"מסודרות"}</GoldText>
        </h2>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Documents.png"
            cropTop={13}
            delay={10}
          />
        </div>

        <div style={{ marginTop: s(20) }}>
          <BulletList
            items={[
              "מקדמות אוטומטיות",
              "חשבוניות דיגיטליות",
              "מעקב הכנסות בזמן אמת",
            ]}
            startDelay={25}
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
        {"קבעו את המחיר"}
        {"\n"}
        <GoldText>{"שלכם"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad49_FlexiblePricing_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <ScenePricing />
    </Sequence>
    <Sequence from={80} durationInFrames={80} premountFor={15}>
      <SceneRevenue />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
