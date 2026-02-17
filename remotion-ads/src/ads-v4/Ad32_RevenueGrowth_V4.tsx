/**
 * Ad32_RevenueGrowth_V4
 * Theme: Growing your business — NO specific numbers or fake %
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
  TrendingUp,
  Calendar,
  CreditCard,
  BarChart3,
  Clock,
  Phone,
  FileText,
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
  FeatureCard,
  PainCard,
  ScreenshotCTAScene,
} from "./shared";

/* ─── Scene 1: Pain Points ─── */
const ScenePain: React.FC = () => {
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
          gap: 24,
        }}
      >
        <SectionLabel text="GROWTH" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          {"תנו לעסק שלכם "}
          <GoldText>{"לצמוח"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 10 }}>
          <PainCard Icon={Phone} text="ניהול הזמנות בטלפון" delay={12} strikeDelay={55} />
          <PainCard Icon={Clock} text="בזבוז זמן על תיאומים" delay={22} strikeDelay={60} />
          <PainCard Icon={FileText} text="חשבוניות ידניות" delay={32} strikeDelay={65} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Growth Features ─── */
const SceneGrowth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="45%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 44px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <SectionLabel text="SOLUTIONS" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"הפתרון "}
          <GoldText>{"שיעשה את ההבדל"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <FeatureCard Icon={TrendingUp} title="נוכחות דיגיטלית" desc="דף אולפן מקצועי עם SEO" delay={10} />
          <FeatureCard Icon={Calendar} title="הזמנות 24/7" desc="לקוחות מזמינים מתי שנוח להם" delay={20} />
          <FeatureCard Icon={CreditCard} title="תשלומים מיידיים" desc="אשראי, Bit, PayPal ועוד" delay={30} />
          <FeatureCard Icon={BarChart3} title="מעקב אנליטי" desc="נתונים על ביצועי האולפן" delay={40} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA with Dashboard ─── */
const SceneCTA: React.FC = () => (
  <ScreenshotCTAScene
    screenshotSrc="images/optimized/Studioz-Dashboard-Calendar.webp"
    headline={
      <>
        {"התחילו לצמוח "}
        <span style={{ color: "#ffd166" }}>{"היום"}</span>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad32_RevenueGrowth_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <ScenePain />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneGrowth />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
