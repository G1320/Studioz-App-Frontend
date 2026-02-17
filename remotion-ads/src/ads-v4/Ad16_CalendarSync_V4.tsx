/**
 * Ad16_CalendarSync_V4
 * Theme: Google Calendar sync — ONLY Google Calendar
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
import { RefreshCcw, Calendar, Shield, Zap } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  ACCENT_BLUE,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  FeatureCard,
  Badge,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Calendar Sync Hero ─── */
const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });
  const iconRotation = interpolate(frame, [0, 90], [0, 360], {
    extrapolateRight: "clamp",
  });
  const iconScale = spring({ frame: frame - 5, fps, config: SPRING_BOUNCY });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={500} color={ACCENT_BLUE} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 50px 60px",
          height: "100%",
          gap: 25,
        }}
      >
        <SectionLabel text="CALENDAR SYNC" delay={0} />

        {/* Animated sync icon */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 36,
            backgroundColor: `${ACCENT_BLUE}12`,
            border: `2px solid ${ACCENT_BLUE}25`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${iconScale})`,
            boxShadow: `0 0 40px ${ACCENT_BLUE}10`,
          }}
        >
          <div style={{ transform: `rotate(${iconRotation}deg)` }}>
            <RefreshCcw size={52} color={ACCENT_BLUE} strokeWidth={1.5} />
          </div>
        </div>

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"סנכרון"}
          {"\n"}
          <GoldText>{"Google Calendar"}</GoldText>
        </h1>

        <GoldLine delay={10} width={120} />

        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 22,
            color: SUBTLE_TEXT,
            textAlign: "center",
            margin: 0,
            opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {"היומן שלך תמיד מעודכן"}
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Sync Features ─── */
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.07} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 44px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 26,
        }}
      >
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
          {"סנכרון "}
          <GoldText>{"חכם ואוטומטי"}</GoldText>
        </h2>

        <GoldLine delay={5} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <FeatureCard Icon={RefreshCcw} title="סנכרון דו-כיווני" desc="שינויים מתעדכנים בשני הכיוונים" delay={10} accentColor={ACCENT_BLUE} />
          <FeatureCard Icon={Calendar} title="עדכון אוטומטי" desc="כל הזמנה חדשה מופיעה ביומן" delay={20} accentColor={ACCENT_BLUE} />
          <FeatureCard Icon={Shield} title="אפס כפילויות" desc="מניעת הזמנות כפולות" delay={30} accentColor={ACCENT_BLUE} />
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 15 }}>
          <Badge text="מ-Starter ומעלה" Icon={Zap} delay={40} color={SUCCESS} />
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
        {"סנכרן את היומן"}
        {"\n"}
        <GoldText>{"ותשכח מכפילויות"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad16_CalendarSync_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneHero />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
