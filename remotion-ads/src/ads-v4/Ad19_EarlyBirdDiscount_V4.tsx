/**
 * Ad19 — Free Trial / Early Adopter Benefits
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
import { Gift, Zap, CreditCard, Star, ArrowUpCircle } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  FeatureCard,
  Badge,
  BulletList,
  CTAScene,
  Footer,
} from "./shared";

/* ─── Scene 1: Free Plan Intro ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });
  const subtitleEnter = spring({ frame: frame - 10, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.1} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
        }}
      >
        <SectionLabel text="PRICING" delay={0} />
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
          {"תתחיל בחינם,\n"}
          <GoldText>שדרג כשתרצה</GoldText>
        </h1>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 22,
            color: SUBTLE_TEXT,
            margin: "10px 0 40px",
            lineHeight: 1.5,
            opacity: subtitleEnter,
            transform: `translateY(${interpolate(subtitleEnter, [0, 1], [20, 0])}px)`,
          }}
        >
          תוכנית חינמית לנצח, שדרוג בקליק
        </p>
        <GoldLine delay={15} width={120} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 30 }}>
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

/* ─── Scene 2: Trial Benefits ─── */
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="40%" size={450} opacity={0.08} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
        }}
      >
        <SectionLabel text="TRIAL" delay={0} />
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.3,
            margin: "30px 0 35px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          נסה את כל <GoldText>התכונות</GoldText>
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 30 }}>
          <Badge Icon={Star} text="7 ימי ניסיון ב-Starter" delay={10} color={GOLD} />
          <Badge Icon={ArrowUpCircle} text="14 ימי ניסיון ב-Pro" delay={18} color={SUCCESS} />
        </div>
        <GoldLine delay={20} width={100} />
        <div style={{ marginTop: 30 }}>
          <BulletList
            items={[
              "סנכרון Google Calendar",
              "חשבוניות אוטומטיות",
              "ניהול זמינות מתקדם",
              "אנליטיקס מלא (Pro)",
              "תמיכת אימייל עדיפה (Pro)",
            ]}
            startDelay={25}
          />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={50} />
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
export const Ad19_EarlyBirdDiscount_V4: React.FC = () => (
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
