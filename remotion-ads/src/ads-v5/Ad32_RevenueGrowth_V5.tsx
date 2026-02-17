/**
 * Ad32_RevenueGrowth_V5
 * Theme: Business growth — let your studio business grow
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
  BarChart3,
  CreditCard,
  Calendar,
  Globe,
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
          padding: `${s(120)}px ${s(50)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(28),
        }}
      >
        <SectionLabel text="STUDIOZ" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(48),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-30), 0])}px)`,
          }}
        >
          <GoldText>{"תנו לעסק שלכם לצמוח"}</GoldText>
        </h1>

        <GoldLine delay={10} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(18), marginTop: s(10) }}>
          <PainCard Icon={Phone} text="ניהול ידני של הזמנות" delay={15} />
          <PainCard Icon={CalendarX} text="יומן לא מסונכרן" delay={25} />
          <PainCard Icon={FileText} text="חשבוניות ידניות" delay={35} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Statistics Screenshot + Features ─── */
const SceneStats: React.FC = () => {
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
        <SectionLabel text="ANALYTICS" delay={0} />

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
          {"תמונת מצב "}
          <GoldText>{"ברורה"}</GoldText>
        </h2>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Statistics-Charts.png"
            cropTop={13}
            delay={8}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: s(14), marginTop: s(20) }}>
          <FeatureCard Icon={BarChart3} title="סטטיסטיקות בזמן אמת" delay={20} />
          <FeatureCard Icon={CreditCard} title="מעקב הכנסות" delay={30} />
          <FeatureCard Icon={Calendar} title="ניתוח הזמנות" delay={40} />
          <FeatureCard Icon={Globe} title="נתוני ביצועים" delay={50} />
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
        {"הגיע הזמן "}
        <GoldText>{"לצמוח"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad32_RevenueGrowth_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <ScenePain />
    </Sequence>
    <Sequence from={80} durationInFrames={80} premountFor={15}>
      <SceneStats />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
