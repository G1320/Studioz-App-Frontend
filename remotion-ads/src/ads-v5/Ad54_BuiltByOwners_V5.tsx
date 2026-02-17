/**
 * Ad54_BuiltByOwners_V5
 * Theme: Built by studio owners
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
  DARK_CARD,
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
  ScreenshotFrame,
  CTAScene,
  useScale,
} from "./shared";

/* ─── Scene 1: Story / Mission ─── */
const SceneStory: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });
  const textEnter = spring({ frame: frame - 15, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={s(550)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(48)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(30),
        }}
      >
        <SectionLabel text="OUR STORY" delay={0} />

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
          {"נבנה על ידי"}
          {"\n"}
          <GoldText>{"בעלי אולפנים"}</GoldText>
        </h1>

        <GoldLine delay={10} width={140} />

        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 20,
            padding: `${s(30)}px ${s(28)}px`,
            border: `1px solid ${GOLD}12`,
            opacity: textEnter,
            transform: `translateY(${interpolate(textEnter, [0, 1], [s(30), 0])}px)`,
            boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
          }}
        >
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: s(24),
              color: SUBTLE_TEXT,
              lineHeight: 1.7,
              margin: 0,
              textAlign: "right",
            }}
          >
            {"אנחנו מכירים את האתגרים שלכם כי עברנו אותם בעצמנו. בנינו את Studioz כדי לפתור את הבעיות האמיתיות של ניהול אולפן הקלטות."}
          </p>
        </div>

        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: s(20),
            color: SUBTLE_TEXT,
            lineHeight: 1.6,
            margin: 0,
            opacity: interpolate(frame, [40, 55], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {"כל פיצ׳ר נבנה מתוך הבנה אמיתית של מה שבעלי אולפנים צריכים."}
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Features + Stats Screenshot ─── */
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
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
          gap: s(22),
        }}
      >
        <SectionLabel text="FOR STUDIOS" delay={0} />

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
          {"כלים שנבנו "}
          <GoldText>{"בשבילכם"}</GoldText>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: s(14) }}>
          <FeatureCard
            Icon={Headphones}
            title="מותאם לאולפנים"
            desc="ציוד, חדרים, סוגי הקלטה"
            delay={10}
          />
          <FeatureCard
            Icon={Code}
            title="טכנולוגיה מתקדמת"
            desc="ממשק מודרני ומהיר"
            delay={20}
          />
          <FeatureCard
            Icon={Heart}
            title="נבנה באהבה"
            desc="עדכונים ושיפורים שוטפים"
            delay={30}
          />
        </div>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Statistics-Charts.png"
            cropTop={13}
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
        {"הצטרפו למהפכה"}
        {"\n"}
        <GoldText>{"של ניהול אולפנים"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad54_BuiltByOwners_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={90} premountFor={15}>
      <SceneStory />
    </Sequence>
    <Sequence from={90} durationInFrames={90} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={180} durationInFrames={90} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
