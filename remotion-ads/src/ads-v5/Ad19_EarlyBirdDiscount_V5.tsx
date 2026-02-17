/**
 * Ad19 — Free Trial / Early Adopter Benefits
 * 240 frames (8s) at 30fps, 1080x1920 (9:16 portrait)
 * V5: New dashboard screenshots, no emojis, Lucide icons only.
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
import { Gift, Zap, CreditCard, Star, ArrowUpCircle } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUBTLE_TEXT,
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
  SectionLabel,
  FeatureCard,
  ScreenshotFrame,
  Badge,
  CTAScene,
  Footer,
  useScale,
} from "./shared";

/* ─── Scene 1: Free Plan Intro ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });
  const subtitleEnter = spring({ frame: frame - 10, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="30%" size={s(500)} opacity={0.1} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(50)}px ${s(60)}px`,
          height: "100%",
        }}
      >
        <SectionLabel text="PRICING" delay={0} />
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(54),
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.25,
            margin: `${s(30)}px ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(30), 0])}px)`,
          }}
        >
          <GoldText>תתחיל בחינם</GoldText>
        </h1>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: s(22),
            color: SUBTLE_TEXT,
            margin: `${s(10)}px ${s(40)}px`,
            lineHeight: 1.5,
            opacity: subtitleEnter,
            transform: `translateY(${interpolate(subtitleEnter, [0, 1], [s(20), 0])}px)`,
          }}
        >
          תוכנית חינמית לנצח, שדרוג בקליק
        </p>
        <GoldLine delay={15} width={120} />
        <div style={{ display: "flex", flexDirection: "column", gap: s(16), marginTop: s(30) }}>
          <FeatureCard Icon={Gift} title="חינם ₪0/חודש" desc="ללא כרטיס אשראי" delay={20} />
          <FeatureCard
            Icon={Zap}
            title="הזמנות מיידיות"
            desc="קבל הזמנות מהיום הראשון"
            delay={28}
          />
          <FeatureCard
            Icon={CreditCard}
            title="ללא התחייבות"
            desc="בטל בכל עת"
            delay={36}
          />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={40} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Trial Badges + Dashboard Screenshot ─── */
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
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
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
            margin: `0 0 ${s(30)}px`,
            textAlign: "center",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(25), 0])}px)`,
          }}
        >
          נסה את כל <GoldText>התכונות</GoldText>
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: s(14),
            alignItems: "center",
            marginBottom: s(25),
          }}
        >
          <Badge Icon={Star} text="7 ימי ניסיון Starter" delay={8} color={GOLD} />
          <Badge Icon={ArrowUpCircle} text="14 ימי ניסיון Pro" delay={16} color={SUCCESS} />
        </div>
        <ScreenshotFrame
          src="images/optimized/Dashboard-Main.png"
            cropTop={13}
          delay={20}
        />
        <div style={{ marginTop: "auto" }}>
          <Footer delay={40} />
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
        התחל עכשיו — <GoldText>₪0</GoldText>
      </>
    }
    buttonText="הרשם בחינם"
    badgeText="התחל בחינם — ₪0/חודש"
    subText="ללא כרטיס אשראי · ללא התחייבות"
  />
);

/* ─── Main Export ─── */
export const Ad19_EarlyBirdDiscount_V5: React.FC = () => (
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
