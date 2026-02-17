/**
 * Ad52_TimeIsMoney_V4
 * Theme: Time is money — general messaging, NO fabricated savings numbers
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
  Phone,
  FileText,
  CalendarX,
  Zap,
  Calendar,
  CreditCard,
} from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  RED,
  RTL,
  FONT_HEADING,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  PainCard,
  FeatureCard,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Time Wasters ─── */
const ScenePain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="30%" size={500} color={RED} opacity={0.06} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 25,
        }}
      >
        <SectionLabel text="TIME" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-30, 0])}px)`,
          }}
        >
          {"הזמן שלך "}
          <GoldText>{"שווה כסף"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <PainCard Icon={Phone} text="שעות על הטלפון עם לקוחות" delay={15} />
          <PainCard Icon={FileText} text="הפקת חשבוניות ידנית" delay={25} />
          <PainCard Icon={CalendarX} text="ניהול יומן ידני ומבולגן" delay={35} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Solution Features ─── */
const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 25,
        }}
      >
        <SectionLabel text="SOLUTION" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"אוטומציה "}
          <GoldText>{"שעובדת"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <FeatureCard
            Icon={Zap}
            title="אוטומציה מלאה"
            desc="הזמנות, אישורים, תזכורות"
            delay={15}
          />
          <FeatureCard
            Icon={Calendar}
            title="יומן חכם"
            desc="סנכרון עם Google Calendar"
            delay={25}
          />
          <FeatureCard
            Icon={CreditCard}
            title="גבייה מיידית"
            desc="כרטיס אשראי, Bit, PayPal"
            delay={35}
          />
          <FeatureCard
            Icon={FileText}
            title="חשבוניות אוטומטיות"
            desc="Sumit / Green Invoice"
            delay={45}
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
        {"תתחילו לחסוך "}
        <GoldText>{"זמן"}</GoldText>
      </>
    }
    buttonText="התחל בחינם"
  />
);

/* ─── Main Export ─── */
export const Ad52_TimeIsMoney_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <ScenePain />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneSolution />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
