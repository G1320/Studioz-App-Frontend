/**
 * Ad21 — Payment Methods
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
import { CreditCard, Smartphone, Globe, Building, Apple } from "lucide-react";
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
  ScreenshotFrame,
  CTAScene,
  Footer,
} from "./shared";

/* ─── Scene 1: Payment Options ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="25%" size={500} opacity={0.1} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
        }}
      >
        <SectionLabel text="PAYMENTS" delay={0} />
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 54,
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.25,
            margin: "30px 0 10px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          <GoldText>כל דרכי התשלום</GoldText>
        </h1>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 22,
            color: SUBTLE_TEXT,
            margin: "10px 0 35px",
            lineHeight: 1.5,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
          }}
        >
          הלקוחות שלך ישלמו איך שנוח להם
        </p>
        <GoldLine delay={12} width={120} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 28 }}>
          <FeatureCard Icon={CreditCard} title="כרטיס אשראי" delay={18} />
          <FeatureCard Icon={Smartphone} title="Bit" delay={24} />
          <FeatureCard Icon={Globe} title="PayPal" delay={30} />
          <FeatureCard Icon={Building} title="העברה בנקאית" delay={36} />
          <FeatureCard Icon={Apple} title="Apple Pay" desc="דרך Sumit" delay={42} />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={48} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Order Screenshot ─── */
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 40px 60px",
          height: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 42,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 30px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [20, 0])}px)`,
          }}
        >
          חוויית תשלום <GoldText>חלקה</GoldText>
        </h2>
        <ScreenshotFrame
          src="images/optimized/Studioz-Studio-Details-Order-1-Light.webp"
          delay={10}
        />
        <div style={{ marginTop: "auto" }}>
          <Footer delay={30} />
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
        קבל תשלומים <GoldText>בקלות</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad21_PaymentMethods_V4: React.FC = () => (
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
