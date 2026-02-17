/**
 * Ad4_BookingFlow_V5
 * Theme: 3-step booking flow with StepCards
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

/* ─── Scene 1: 3 Steps ─── */
const SceneSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={s(500)} opacity={0.08} />

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
        <SectionLabel text="BOOKING FLOW" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(50),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(8)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-25), 0])}px)`,
          }}
        >
          {"הזמנה ב-"}
          <GoldText>{"3 צעדים"}</GoldText>
        </h1>

        <GoldLine delay={8} width={100} />

        <ConnectingLine x={80} y={420} height={480} startFrame={15} endFrame={60} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(22), marginTop: s(15) }}>
          <StepCard num="1" title="בחירת שירות" desc="הלקוח בוחר שירות ומחיר" delay={15} />
          <StepCard
            num="2"
            title="בחירת תאריך ושעה"
            desc="יומן חי עם זמינות בזמן אמת"
            delay={30}
          />
          <StepCard
            num="3"
            title="אישור ותשלום"
            desc="תשלום מאובטח ואישור מיידי"
            delay={45}
            isLast
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Screenshots ─── */
const SceneScreenshot: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={s(600)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
          gap: s(25),
        }}
      >
        <SectionLabel text="LIVE PREVIEW" delay={0} />

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
          {"טופס הזמנה "}
          <GoldText>{"פשוט ומהיר"}</GoldText>
        </h2>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Studioz-Studio-Details-Order-1-Light.webp"
            delay={10}
          />
        </div>

        <div style={{ marginTop: s(20) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Activity.png"
            cropTop={13}
            delay={30}
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
        {"הלקוחות שלך מזמינים"}
        {"\n"}
        <GoldText>{"בלי להתקשר"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad4_BookingFlow_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneSteps />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneScreenshot />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
