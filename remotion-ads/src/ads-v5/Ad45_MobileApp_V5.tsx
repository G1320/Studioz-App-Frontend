/**
 * Ad45_MobileResponsive_V5
 * Theme: Responsive website — NOT app
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
import { Smartphone, Monitor, Globe } from "lucide-react";
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
  PhoneMockup,
  CTAScene,
  useScale,
} from "./shared";

/* ─── Scene 1: Phone Mockup ─── */
const ScenePhone: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="45%" size={s(600)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: `${s(100)}px ${s(44)}px ${s(60)}px`,
          height: "100%",
          gap: s(28),
        }}
      >
        <SectionLabel text="RESPONSIVE" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(48),
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-25), 0])}px)`,
          }}
        >
          {"האתר שלך עובד"}
          {"\n"}
          <GoldText>{"מכל מכשיר"}</GoldText>
        </h1>

        <GoldLine delay={8} width={100} />

        <div style={{ marginTop: s(10) }}>
          <PhoneMockup
            src="images/optimized/Studioz-Studio-Details-1-Light.webp"
            delay={12}
            width={380}
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
        <SectionLabel text="EVERY DEVICE" delay={0} />

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
          {"חוויה מושלמת "}
          <GoldText>{"בכל מסך"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(18), marginTop: s(15) }}>
          <FeatureCard
            Icon={Smartphone}
            title="מותאם לנייד"
            desc="הלקוחות מזמינים ישירות מהטלפון"
            delay={12}
          />
          <FeatureCard
            Icon={Monitor}
            title="מושלם בדסקטופ"
            desc="תצוגה מלאה עם כל הפרטים"
            delay={22}
          />
          <FeatureCard
            Icon={Globe}
            title="אתר רספונסיבי"
            desc="עיצוב שמתאים את עצמו אוטומטית"
            delay={32}
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
        {"האולפן שלך"}
        {"\n"}
        <GoldText>{"בכל מקום"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad45_MobileResponsive_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <ScenePhone />
    </Sequence>
    <Sequence from={80} durationInFrames={80} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
