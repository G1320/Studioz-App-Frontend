/**
 * Ad38_QuickSetup_V5
 * Theme: Easy onboarding — simple, fast, free
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
import { UserPlus, Sliders, CheckCircle } from "lucide-react";
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
  StepCard,
  ConnectingLine,
  ScreenshotFrame,
  CTAScene,
  useScale,
} from "./shared";

/* ─── Scene 1: Onboarding Steps ─── */
const SceneOnboarding: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="30%" size={s(500)} opacity={0.07} />
      <ConnectingLine x={88} y={420} height={360} startFrame={15} endFrame={60} />

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
        <SectionLabel text="ONBOARDING" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(48),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-30), 0])}px)`,
          }}
        >
          {"פשוט. מהיר. "}
          <GoldText>{"בחינם."}</GoldText>
        </h1>

        <GoldLine delay={10} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(20), marginTop: s(10) }}>
          <StepCard
            num="1"
            title="הרשמה חינם"
            desc="צרו חשבון ב-30 שניות"
            delay={15}
          />
          <StepCard
            num="2"
            title="הגדרת אולפן"
            desc="הוסיפו פרטים, תמונות ומחירים"
            delay={30}
          />
          <StepCard
            num="3"
            title="התחילו לקבל הזמנות"
            desc="הדף שלכם באוויר — הלקוחות מזמינים"
            delay={45}
            isLast
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Screenshot ─── */
const SceneDashboard: React.FC = () => {
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
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(25),
        }}
      >
        <SectionLabel text="DASHBOARD" delay={0} />

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
          {"הדשבורד "}
          <GoldText>{"המסודר שלכם"}</GoldText>
        </h2>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Main.png"
            cropTop={13}
            delay={8}
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
        <GoldText>{"עכשיו"}</GoldText>
      </>
    }
    buttonText="התחל בחינם"
  />
);

/* ─── Main Export ─── */
export const Ad38_QuickSetup_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneOnboarding />
    </Sequence>
    <Sequence from={80} durationInFrames={80} premountFor={15}>
      <SceneDashboard />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
