/**
 * Ad47_TimeSavings_V4
 * Theme: Save time with automation — NO fake "X hours saved" stats
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
  Bell,
  RefreshCcw,
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

/* ─── Scene 1: Pain Points ─── */
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
        <SectionLabel text="MANUAL WORK" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-30, 0])}px)`,
          }}
        >
          {"תפסיקו לבזבז זמן "}
          <GoldText>{"על ניהול"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <PainCard Icon={Phone} text="תיאום ידני מול כל לקוח" delay={15} />
          <PainCard Icon={FileText} text="הפקת חשבוניות ידנית" delay={25} />
          <PainCard Icon={CalendarX} text="עדכון יומן ידני" delay={35} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Automation Features ─── */
const SceneAutomation: React.FC = () => {
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
        <SectionLabel text="AUTOMATION" delay={0} />

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
          {"הכל "}
          <GoldText>{"אוטומטי"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <FeatureCard
            Icon={Zap}
            title="הזמנות אוטומטיות"
            desc="לקוחות מזמינים לבד 24/7"
            delay={15}
          />
          <FeatureCard
            Icon={FileText}
            title="חשבוניות אוטומטיות"
            desc="Sumit / Green Invoice"
            delay={25}
          />
          <FeatureCard
            Icon={Bell}
            title="תזכורות אוטומטיות"
            desc="התראות מייל ללקוח ולבעלים"
            delay={35}
          />
          <FeatureCard
            Icon={RefreshCcw}
            title="סנכרון יומן"
            desc="Google Calendar סנכרון"
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
        {"תנו ל-Studioz "}
        <GoldText>{"לעבוד בשבילכם"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad47_TimeSavings_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <ScenePain />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneAutomation />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
