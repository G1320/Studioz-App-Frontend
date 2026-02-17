/**
 * Ad54_BuiltByOwners_V4
 * Theme: Built by studio owners, for studio owners
 * Duration: 270 frames (9s) at 30fps, 1080x1920
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
import { Headphones, Code, Heart } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  FeatureCard,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Mission / Story ─── */
const SceneStory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });
  const textEnter = spring({ frame: frame - 15, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "140px 55px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <SectionLabel text="OUR STORY" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            lineHeight: 1.3,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-30, 0])}px)`,
          }}
        >
          {"נבנה על ידי "}
          <GoldText>{"בעלי אולפנים"}</GoldText>
        </h1>

        <GoldLine delay={10} width={140} />

        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 28,
            color: SUBTLE_TEXT,
            margin: 0,
            lineHeight: 1.7,
            opacity: textEnter,
            transform: `translateY(${interpolate(textEnter, [0, 1], [20, 0])}px)`,
          }}
        >
          {"הכרנו את הכאב של ניהול אולפן בלי כלים מתאימים. שעות על הטלפון, יומן מבולגן, חשבוניות ידניות. בנינו את Studioz כדי לפתור בדיוק את הבעיות שחווינו בעצמנו."}
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: What We Understand ─── */
const SceneUnderstand: React.FC = () => {
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
        <SectionLabel text="BY OWNERS, FOR OWNERS" delay={0} />

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
          {"אנחנו "}
          <GoldText>{"מבינים אתכם"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 10 }}>
          <FeatureCard
            Icon={Headphones}
            title="מבינים את הצרכים שלכם"
            desc="כי גם אנחנו מנהלים אולפנים"
            delay={15}
          />
          <FeatureCard
            Icon={Code}
            title="פיצ'רים שבאמת צריך"
            desc="בלי ניפוח — רק מה שעובד"
            delay={25}
          />
          <FeatureCard
            Icon={Heart}
            title="נבנה עם אהבה"
            desc="לקהילת האולפנים בישראל"
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
        {"הצטרפו "}
        <GoldText>{"למהפכה"}</GoldText>
        {"\n"}
        {"של ניהול אולפנים"}
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad54_BuiltByOwners_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={90} premountFor={15}>
      <SceneStory />
    </Sequence>
    <Sequence from={90} durationInFrames={90} premountFor={15}>
      <SceneUnderstand />
    </Sequence>
    <Sequence from={180} durationInFrames={90} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
