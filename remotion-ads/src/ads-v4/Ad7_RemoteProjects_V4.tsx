/**
 * Ad7_RemoteProjects_V4
 * Theme: Remote projects feature (Starter+)
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
import { Laptop, Upload, MessageSquare, Zap, CreditCard } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
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
  FeatureCard,
  Badge,
  BulletList,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Remote Features ─── */
const SceneRemote: React.FC = () => {
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
          gap: 28,
        }}
      >
        <SectionLabel text="REMOTE" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 50,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          {"פרויקטים "}
          <GoldText>{"מרחוק"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 15 }}>
          <FeatureCard Icon={Laptop} title="עבודה ללא מיקום" desc="קבל פרויקטים מכל מקום" delay={15} />
          <FeatureCard Icon={Upload} title="העלאת קבצים" desc="שיתוף קבצים מאובטח" delay={25} />
          <FeatureCard Icon={MessageSquare} title="תקשורת עם לקוח" desc="הכל במקום אחד" delay={35} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Badge + Benefits ─── */
const SceneBenefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="45%" size={600} opacity={0.08} />

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
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Badge text="מתחיל מ-Starter" Icon={Zap} delay={5} />
        </div>

        <h2
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
          {"הרחב את העסק שלך"}
          {"\n"}
          <GoldText>{"מעבר לגבולות האולפן"}</GoldText>
        </h2>

        <div style={{ marginTop: 15 }}>
          <BulletList
            items={[
              "הגדלת בסיס הלקוחות",
              "הכנסות נוספות ללא מיקום פיזי",
              "תשלום מאובטח מרחוק",
              "ניהול פרויקטים מלא",
            ]}
            startDelay={20}
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
        {"הגיע הזמן לעבוד"}
        {"\n"}
        <GoldText>{"גם מרחוק"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad7_RemoteProjects_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneRemote />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneBenefits />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
