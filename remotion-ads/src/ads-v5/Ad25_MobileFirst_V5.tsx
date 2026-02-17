/**
 * Ad25 — Responsive Website (NOT an app)
 * 240 frames (8s) at 30fps, 1080x1920 (9:16 portrait)
 * V5: PhoneMockup with studio detail screenshot, Globe icon for web.
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";
import { Smartphone, Monitor, Globe } from "lucide-react";
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
  useScale,
} from "./shared";

/* ─── Scene 1: Phone Mockup ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="40%" size={s(550)} opacity={0.1} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
        }}
      >
        <SectionLabel text="RESPONSIVE" delay={0} />
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(48),
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.25,
            margin: `${s(25)}px ${s(10)}px`,
            textAlign: "center",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(30), 0])}px)`,
          }}
        >
          {"האתר שלך מושלם\n"}
          <GoldText>בכל מכשיר</GoldText>
        </h1>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: s(21),
            color: SUBTLE_TEXT,
            margin: `${s(10)}px ${s(30)}px`,
            textAlign: "center",
            opacity: interpolate(frame, [8, 22], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
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
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="35%" size={s(450)} opacity={0.08} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(50)}px ${s(60)}px`,
          height: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(44),
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.3,
            margin: `0 0 ${s(40)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(25), 0])}px)`,
          }}
        >
          <GoldText>חוויה מושלמת</GoldText> בכל מסך
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: s(16) }}>
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
            Icon={Globe}
            title="אתר רספונסיבי"
            desc="נגיש מכל מקום בעולם"
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
export const Ad25_MobileFirst_V5: React.FC = () => (
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
