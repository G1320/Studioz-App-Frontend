/**
 * Ad38 — Quick Setup V3
 * Fast-paced step-by-step onboarding with StepCard
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Rocket } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUCCESS,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  StepCard,
  ConnectingLine,
  Badge,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Scene 1: Steps Flow ─── */
const OnboardingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="20%" size={500} opacity={0.08} />

      <div
        style={{
          padding: "80px 48px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <SectionLabel text="ONBOARDING" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "16px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          <GoldText>4 צעדים</GoldText> פשוטים{"\n"}וזה עובד
        </h2>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Steps with connecting line */}
        <div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            justifyContent: "center",
          }}
        >
          <ConnectingLine x={84} y={30} height={480} startFrame={15} endFrame={90} />

          <StepCard
            num="1"
            title="הרשם"
            desc="פתח חשבון חינמי תוך דקה"
            delay={12}
          />
          <StepCard
            num="2"
            title="הגדר שירותים"
            desc="הוסף חדרים, ציוד ומחירון"
            delay={28}
          />
          <StepCard
            num="3"
            title="פרסם"
            desc="העמוד שלך באוויר — מוכן ללקוחות"
            delay={44}
          />
          <StepCard
            num="4"
            title="קבל הזמנות"
            desc="הלקוחות מזמינים ומשלמים אונליין"
            delay={60}
            isLast
          />
        </div>

        {/* Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 30,
          }}
        >
          <Badge text="5 דקות בלבד 🚀" color={SUCCESS} delay={80} Icon={Rocket} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const OnboardingCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        מתחילים{"\n"}
        <GoldText>עכשיו</GoldText>
      </>
    }
    buttonText="הרשם בחינם"
    freeText="התחל בחינם — 5 דקות הקמה"
  />
);

/* ─── Main Composition ─── */
export const Ad38_QuickSetup_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={155} premountFor={10}>
        <OnboardingScene />
      </Sequence>
      <Sequence from={155} durationInFrames={85} premountFor={15}>
        <OnboardingCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
