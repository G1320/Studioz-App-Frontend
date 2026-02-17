/**
 * Ad14_NoCalls_V5
 * Theme: No more phone tag
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
import { PhoneOff, Calendar, CreditCard, Bell } from "lucide-react";
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

/* ─── Scene 1: Pain Point ─── */
const ScenePain: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={s(500)} color={RED} opacity={0.06} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(44)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(30),
          alignItems: "center",
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
            textAlign: "center",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-30), 0])}px)`,
          }}
        >
          <GoldText>{"נמאס מהטלפונים?"}</GoldText>
        </h1>

        <GoldLine delay={10} width={140} />

        <div style={{ width: "100%", marginTop: s(20) }}>
          <PainCard Icon={PhoneOff} text="אין עוד שיחות אין סוף" delay={20} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Solution + Activity Screenshot ─── */
const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={s(600)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
          gap: s(22),
        }}
      >
        <SectionLabel text="ONLINE BOOKINGS" delay={0} />

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
          {"הזמנות נכנסות "}
          <GoldText>{"אוטומטית"}</GoldText>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: s(14), marginTop: s(10) }}>
          <FeatureCard Icon={Calendar} title="הזמנות אונליין 24/7" delay={12} />
          <FeatureCard Icon={CreditCard} title="תשלום מיידי" delay={20} />
          <FeatureCard Icon={Bell} title="התראה על כל הזמנה" delay={28} />
        </div>

        <div style={{ marginTop: s(15) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Activity.png"
            cropTop={13}
            delay={35}
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
        {"תן ללקוחות"}
        {"\n"}
        <GoldText>{"להזמין לבד"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad14_NoCalls_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={100} premountFor={15}>
      <ScenePain />
    </Sequence>
    <Sequence from={100} durationInFrames={70} premountFor={15}>
      <SceneSolution />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
