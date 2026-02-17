/**
 * Ad39_Support_V5
 * Theme: Support — email support, NOT 24/7
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
import { Mail, Crown, Globe } from "lucide-react";
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
  useScale,
} from "./shared";

/* ─── Scene 1: Support Feature Cards ─── */
const SceneSupport: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="30%" size={s(500)} opacity={0.07} />

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
        <SectionLabel text="SUPPORT" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(52),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-30), 0])}px)`,
          }}
        >
          {"תמיכה "}
          <GoldText>{"כשצריך"}</GoldText>
        </h1>

        <GoldLine delay={10} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(16), marginTop: s(10) }}>
          <FeatureCard
            Icon={Mail}
            title="תמיכה במייל"
            desc="מענה מקצועי לכל שאלה"
            delay={15}
          />
          <FeatureCard
            Icon={Crown}
            title="תמיכה עדיפה ב-Pro"
            desc="עדיפות במענה למנויי Pro"
            delay={25}
          />
          <FeatureCard
            Icon={Globe}
            title="עברית + אנגלית"
            desc="תמיכה בשתי השפות"
            delay={35}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Bullet List ─── */
const SceneDetails: React.FC = () => {
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
        <SectionLabel text="DETAILS" delay={0} />

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
          {"מה כולל "}
          <GoldText>{"הסיוע?"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ marginTop: s(10) }}>
          <BulletList
            items={[
              "תמיכה במייל לכל המנויים",
              "זמן תגובה מהיר",
              "עזרה בהגדרת האולפן",
              "הדרכה לשימוש בפלטפורמה",
              "תמיכה עדיפה למנויי Pro",
              "עברית ואנגלית",
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
        {"אנחנו כאן "}
        <GoldText>{"בשבילכם"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad39_Support_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneSupport />
    </Sequence>
    <Sequence from={80} durationInFrames={80} premountFor={15}>
      <SceneDetails />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
