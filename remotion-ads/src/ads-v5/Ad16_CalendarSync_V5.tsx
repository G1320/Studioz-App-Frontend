/**
 * Ad16_CalendarSync_V5
 * Theme: Google Calendar sync — ONLY Google
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
import { RefreshCcw, Calendar, Shield } from "lucide-react";
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
  ScreenshotFrame,
  Badge,
  CTAScene,
  useScale,
} from "./shared";

/* ─── Scene 1: Calendar Sync Features ─── */
const SceneSync: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={s(500)} opacity={0.08} />

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
        <SectionLabel text="SYNC" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(44),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(8)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-25), 0])}px)`,
          }}
        >
          {"סנכרון "}
          <GoldText>{"Google Calendar"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(18), marginTop: s(20) }}>
          <FeatureCard
            Icon={RefreshCcw}
            title="סנכרון דו-כיווני"
            desc="הזמנות מופיעות אוטומטית ביומן Google"
            delay={15}
          />
          <FeatureCard
            Icon={Calendar}
            title="מניעת כפילויות"
            desc="יומן אחד מסונכרן, אפס התנגשויות"
            delay={25}
          />
          <FeatureCard
            Icon={Shield}
            title="גיבוי אוטומטי"
            desc="כל ההזמנות מגובות ב-Google Calendar"
            delay={35}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Calendar Screenshot + Badge ─── */
const SceneCalendar: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
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
          {"יומן "}
          <GoldText>{"מסונכרן"}</GoldText>
        </h2>

        <div style={{ marginTop: s(15) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Calendar.png"
            cropTop={13}
            delay={10}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: s(20) }}>
          <Badge text="מ-Starter ומעלה" delay={30} />
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
        {"יומן אחד"}
        {"\n"}
        <GoldText>{"מסונכרן תמיד"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad16_CalendarSync_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneSync />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneCalendar />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
