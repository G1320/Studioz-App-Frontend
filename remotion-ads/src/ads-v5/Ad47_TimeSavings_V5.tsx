/**
 * Ad47_TimeSavings_V5
 * Theme: Save time — no fake stats
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
  CalendarX,
  FileX,
  Clock,
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
  ScreenshotFrame,
  CTAScene,
  useScale,
} from "./shared";

/* ─── Scene 1: Pain Points ─── */
const ScenePain: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="30%" size={s(500)} color={RED} opacity={0.06} />

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
        <SectionLabel text="STUDIOZ" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(50),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(6)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-25), 0])}px)`,
          }}
        >
          {"תפסיקו "}
          <GoldText>{"לבזבז זמן"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(16), marginTop: s(15) }}>
          <PainCard Icon={Phone} text="שיחות טלפון לכל הזמנה" delay={12} />
          <PainCard Icon={CalendarX} text="עדכון יומן ידני" delay={22} />
          <PainCard Icon={FileX} text="הפקת חשבוניות ידנית" delay={32} />
          <PainCard Icon={Clock} text="מעקב תשלומים בווטסאפ" delay={42} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Solution ─── */
const SceneSolution: React.FC = () => {
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
          gap: s(25),
        }}
      >
        <SectionLabel text="THE SOLUTION" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(44),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-20), 0])}px)`,
          }}
        >
          {"הכל "}
          <GoldText>{"באוטומט"}</GoldText>
        </h2>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Main.png"
            cropTop={13}
            delay={10}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: s(14), marginTop: s(20) }}>
          <FeatureCard Icon={Zap} title="הזמנות אוטומטיות" delay={25} />
          <FeatureCard Icon={Calendar} title="יומן מסונכרן" delay={35} />
          <FeatureCard Icon={CreditCard} title="תשלומים ומקדמות" delay={45} />
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
        {"חסכו זמן"}
        {"\n"}
        <GoldText>{"התחילו עכשיו"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad47_TimeSavings_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <ScenePain />
    </Sequence>
    <Sequence from={80} durationInFrames={80} premountFor={15}>
      <SceneSolution />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
