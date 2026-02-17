/**
 * Ad2_StudioOwnersDream_V4
 * Theme: Pain points -> Solution -> CTA
 * Duration: 360 frames (12s) at 30fps, 1080x1920
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
import { Phone, CalendarX, FileText, RefreshCcw, CreditCard, CheckCircle } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  RED,
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
  PainCard,
  IconPill,
  ScreenshotFrame,
  BulletList,
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
          gap: 30,
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <SectionLabel text="STUDIOZ" delay={0} />
        </div>

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 10px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-30, 0])}px)`,
          }}
        >
          <GoldText>{"נשמע מוכר?"}</GoldText>
        </h1>

        <GoldLine delay={10} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 20 }}>
          <PainCard Icon={Phone} text="שיחות טלפון אין סוף לתיאום" delay={15} strikeDelay={75} />
          <PainCard Icon={CalendarX} text="כפילויות ובלאגן ביומן" delay={25} strikeDelay={85} />
          <PainCard Icon={FileText} text="חשבוניות ידניות ובזבוז זמן" delay={35} strikeDelay={95} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Solution ─── */
const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 40px 60px",
          height: "100%",
          gap: 30,
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <SectionLabel text="THE SOLUTION" delay={0} />
        </div>

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
          {"הכל במקום אחד"}
        </h2>

        <div style={{ marginTop: 10 }}>
          <ScreenshotFrame
            src="images/optimized/Studioz-Dashboard-Calendar.webp"
            delay={10}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <IconPill Icon={RefreshCcw} label="סנכרון יומן" delay={25} />
          <IconPill Icon={CreditCard} label="תשלומים מיידיים" delay={35} />
          <IconPill Icon={CheckCircle} label="אפס כפילויות" delay={45} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: Availability ─── */
const SceneAvailability: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.07} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 40px 60px",
          height: "100%",
          gap: 25,
        }}
      >
        <SectionLabel text="AVAILABILITY" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 42,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"ניהול זמינות "}
          <GoldText>{"חכם"}</GoldText>
        </h2>

        <div style={{ marginTop: 10 }}>
          <ScreenshotFrame
            src="images/optimized/Studio-Availability-Controls-desktop-1-V3.webp"
            delay={8}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <BulletList
            items={["שעות גמישות", "זמני מעבר", "אישור מיידי / ידני"]}
            startDelay={20}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 4: CTA ─── */
const SceneCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        {"הפוך את האולפן שלך"}
        {"\n"}
        {"ל"}
        <GoldText>{"עסק מתפקד"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad2_StudioOwnersDream_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={110} premountFor={15}>
      <ScenePain />
    </Sequence>
    <Sequence from={110} durationInFrames={80} premountFor={15}>
      <SceneDashboard />
    </Sequence>
    <Sequence from={190} durationInFrames={80} premountFor={15}>
      <SceneAvailability />
    </Sequence>
    <Sequence from={270} durationInFrames={90} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
