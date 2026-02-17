/**
 * Ad25 — Mobile-Responsive Website (NOT an app)
 * 240 frames (8s) at 30fps, 1080x1920 (9:16 portrait)
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
import { Smartphone, Monitor, Tablet } from "lucide-react";
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
  PhoneMockup,
  CTAScene,
  Footer,
} from "./shared";

/* ─── Scene 1: Phone Mockup ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="40%" size={550} opacity={0.1} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "100px 40px 60px",
          height: "100%",
        }}
      >
        <SectionLabel text="RESPONSIVE" delay={0} />
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.25,
            margin: "25px 0 10px",
            textAlign: "center",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          {"האתר שלך מושלם\n"}
          <GoldText>בכל מכשיר</GoldText>
        </h1>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 21,
            color: SUBTLE_TEXT,
            margin: "10px 0 30px",
            textAlign: "center",
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
          }}
        >
          אתר רספונסיבי, לא אפליקציה
        </p>
        <PhoneMockup
          src="images/optimized/Studioz-Studio-Details-1-Light.webp"
          delay={12}
          width={380}
        />
        <div style={{ marginTop: "auto" }}>
          <Footer delay={35} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Device Feature Cards ─── */
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="35%" size={450} opacity={0.08} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.3,
            margin: "0 0 40px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          <GoldText>חוויה מושלמת</GoldText> בכל מסך
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FeatureCard
            Icon={Smartphone}
            title="מותאם למובייל"
            desc="ממשק מותאם לכל טלפון"
            delay={10}
          />
          <FeatureCard
            Icon={Monitor}
            title="מושלם בדסקטופ"
            desc="תצוגה מלאה במסך גדול"
            delay={20}
          />
          <FeatureCard
            Icon={Tablet}
            title="עובד בטאבלט"
            desc="נוח ונגיש בכל מכשיר"
            delay={30}
          />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={45} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const Scene3: React.FC = () => (
  <CTAScene
    headline={
      <>
        האתר שלך <GoldText>בכל מקום</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad25_MobileFirst_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={95} premountFor={15}>
      <Scene1 />
    </Sequence>
    <Sequence from={80} durationInFrames={105} premountFor={15}>
      <Scene2 />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <Scene3 />
    </Sequence>
  </AbsoluteFill>
);
