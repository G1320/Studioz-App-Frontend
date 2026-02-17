/**
 * Ad51_StudioNetwork_V5
 * Theme: Join the platform — no fake stats
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
import { Globe, Search, Users, Zap } from "lucide-react";
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

/* ─── Scene 1: Platform Landing ─── */
const ScenePlatform: React.FC = () => {
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
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
          gap: s(25),
        }}
      >
        <SectionLabel text="PLATFORM" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(48),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(6)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-25), 0])}px)`,
          }}
        >
          {"הצטרפו"}
          {"\n"}
          <GoldText>{"לפלטפורמה"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Landing-Studio1320-1.webp"
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
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={s(500)} opacity={0.08} />

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
        <SectionLabel text="BENEFITS" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(44),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-20), 0])}px)`,
          }}
        >
          {"למה "}
          <GoldText>{"Studioz?"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(16), marginTop: s(15) }}>
          <FeatureCard
            Icon={Globe}
            title="נוכחות דיגיטלית"
            desc="עמוד אולפן מקצועי באינטרנט"
            delay={12}
          />
          <FeatureCard
            Icon={Search}
            title="חשיפה בגוגל"
            desc="SEO מובנה — מופיעים בחיפוש"
            delay={22}
          />
          <FeatureCard
            Icon={Users}
            title="לקוחות חדשים"
            desc="גולשים מגלים את האולפן שלך"
            delay={32}
          />
          <FeatureCard
            Icon={Zap}
            title="ניהול אוטומטי"
            desc="הזמנות, תשלומים וחשבוניות"
            delay={42}
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
        {"פרסמו את האולפן"}
        {"\n"}
        <GoldText>{"בחינם"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad51_StudioNetwork_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <ScenePlatform />
    </Sequence>
    <Sequence from={80} durationInFrames={80} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
