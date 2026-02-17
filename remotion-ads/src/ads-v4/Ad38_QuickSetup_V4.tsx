/**
 * Ad38_QuickSetup_V4
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
import {
  UserPlus,
  Palette,
  Megaphone,
} from "lucide-react";
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
} from "./shared";

/* ─── Scene 1: Steps ─── */
const SceneSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 44px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <SectionLabel text="ONBOARDING" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 50,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          {"פשוט. מהיר. "}
          <GoldText>{"בחינם."}</GoldText>
        </h1>

        <GoldLine delay={8} width={100} />

        <ConnectingLine x={80} y={420} height={420} startFrame={15} endFrame={60} />

        <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 15 }}>
          <StepCard num="1" title="צרו חשבון" desc="הרשמה חינמית תוך שניות" delay={15} />
          <StepCard num="2" title="עצבו את דף האולפן" desc="תמונות, שירותים ומחירים" delay={30} />
          <StepCard
            num="3"
            title="פרסמו וקבלו הזמנות"
            desc="האולפן שלכם אונליין"
            delay={45}
            isLast
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Screenshot ─── */
const SceneScreenshot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="45%" size={600} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 40px 60px",
          height: "100%",
          gap: 25,
        }}
      >
        <SectionLabel text="DASHBOARD" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 42,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"ככה זה "}
          <GoldText>{"נראה"}</GoldText>
        </h2>

        <div style={{ marginTop: 15 }}>
          <ScreenshotFrame
            src="images/optimized/Studioz-Dashboard-Calendar.webp"
            delay={10}
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
        {"התחילו "}
        <GoldText>{"בחינם"}</GoldText>
        {" עוד היום"}
      </>
    }
    buttonText="צרו חשבון חינם"
  />
);

/* ─── Main Export ─── */
export const Ad38_QuickSetup_V4: React.FC = () => (
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
