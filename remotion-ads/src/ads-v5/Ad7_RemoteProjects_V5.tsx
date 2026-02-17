/**
 * Ad7_RemoteProjects_V5
 * Theme: Remote projects (Starter+)
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
import { Laptop, Upload, MessageSquare } from "lucide-react";
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

/* ─── Scene 1: Remote Features ─── */
const SceneRemote: React.FC = () => {
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
        <SectionLabel text="REMOTE" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(50),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(8)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-25), 0])}px)`,
          }}
        >
          {"פרויקטים "}
          <GoldText>{"מרחוק"}</GoldText>
        </h1>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(18), marginTop: s(20) }}>
          <FeatureCard
            Icon={Laptop}
            title="עבודה מרחוק"
            desc="קבל פרויקטים מכל מקום בארץ"
            delay={15}
          />
          <FeatureCard
            Icon={Upload}
            title="העלאת קבצים"
            desc="שיתוף קבצים מאובטח עם לקוחות"
            delay={25}
          />
          <FeatureCard
            Icon={MessageSquare}
            title="תקשורת ישירה"
            desc="ניהול פרויקט מסודר מקצה לקצה"
            delay={35}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Activity Screenshot ─── */
const SceneActivity: React.FC = () => {
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
        <SectionLabel text="ACTIVITY" delay={0} />

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
          {"כל הפרויקטים "}
          <GoldText>{"במקום אחד"}</GoldText>
        </h2>

        <div style={{ marginTop: s(15) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Activity.png"
            cropTop={13}
            delay={10}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: s(20) }}>
          <Badge text="מתחיל מ-Starter" delay={30} />
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
        {"הרחב את העסק"}
        {"\n"}
        <GoldText>{"מעבר לאולפן"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad7_RemoteProjects_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneRemote />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneActivity />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
