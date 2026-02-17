/**
 * Ad39_Support_V4
 * Theme: Support — email support (priority for Pro), NOT 24/7
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
  Mail,
  Crown,
  Globe,
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
  BulletList,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Support Feature Cards ─── */
const SceneSupport: React.FC = () => {
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
        <SectionLabel text="SUPPORT" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          {"תמיכה "}
          <GoldText>{"כשצריך"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 10 }}>
          <FeatureCard Icon={Mail} title="תמיכה במייל" desc="נענה לכל שאלה" delay={12} />
          <FeatureCard Icon={Crown} title="תמיכה עדיפה ב-Pro" desc="זמן תגובה מהיר יותר" delay={24} accentColor={GOLD} />
          <FeatureCard Icon={Globe} title="עברית + אנגלית" desc="תמיכה בשתי שפות" delay={36} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Support Bullets ─── */
const SceneBullets: React.FC = () => {
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
          gap: 28,
        }}
      >
        <SectionLabel text="WE GOT YOU" delay={0} />

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
          {"אנחנו כאן "}
          <GoldText>{"בשבילכם"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ marginTop: 10 }}>
          <BulletList
            items={[
              "תמיכה טכנית במייל",
              "עדיפות לחבילת Pro",
              "ממשק בעברית ובאנגלית",
              "מדריכים והסברים",
              "עדכונים ושיפורים שוטפים",
            ]}
            startDelay={12}
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
        {"הצטרפו "}
        <GoldText>{"בביטחון"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad39_Support_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneSupport />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneBullets />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
