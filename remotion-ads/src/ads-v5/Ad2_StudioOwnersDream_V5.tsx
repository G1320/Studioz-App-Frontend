/**
 * Ad2_StudioOwnersDream_V5
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
} from "remotion";
import {
  Phone,
  CalendarX,
  FileText,
  RefreshCcw,
  CreditCard,
  CheckCircle,
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
  IconPill,
  ScreenshotFrame,
  BulletList,
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
          gap: s(30),
        }}
      >
        <SectionLabel text="STUDIOZ" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(52),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-30), 0])}px)`,
          }}
        >
          <GoldText>{"נשמע מוכר?"}</GoldText>
        </h1>

        <GoldLine delay={10} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(18), marginTop: s(20) }}>
          <PainCard Icon={Phone} text="שיחות טלפון אין סוף לתיאום" delay={15} strikeDelay={75} />
          <PainCard
            Icon={CalendarX}
            text="כפילויות ובלאגן ביומן"
            delay={25}
            strikeDelay={85}
          />
          <PainCard
            Icon={FileText}
            text="חשבוניות ידניות ובזבוז זמן"
            delay={35}
            strikeDelay={95}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Main ─── */
const SceneDashboard: React.FC = () => {
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
          gap: s(30),
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
          {"הכל במקום אחד"}
        </h2>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Main.png"
            cropTop={13}
            delay={10}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: s(12),
            justifyContent: "center",
            marginTop: s(20),
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

/* ─── Scene 3: Calendar View ─── */
const SceneCalendar: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={s(500)} opacity={0.07} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
          gap: s(25),
        }}
      >
        <SectionLabel text="CALENDAR" delay={0} />

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
          {"ניהול יומן "}
          <GoldText>{"חכם"}</GoldText>
        </h2>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Calendar.png"
            cropTop={13}
            delay={8}
          />
        </div>

        <div style={{ marginTop: s(20) }}>
          <BulletList
            items={["שעות גמישות לכל אולפן", "זמני מעבר בין הזמנות", "סנכרון Google Calendar"]}
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
export const Ad2_StudioOwnersDream_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={110} premountFor={15}>
      <ScenePain />
    </Sequence>
    <Sequence from={110} durationInFrames={80} premountFor={15}>
      <SceneDashboard />
    </Sequence>
    <Sequence from={190} durationInFrames={80} premountFor={15}>
      <SceneCalendar />
    </Sequence>
    <Sequence from={270} durationInFrames={90} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
