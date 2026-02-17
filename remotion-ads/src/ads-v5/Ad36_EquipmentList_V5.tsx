/**
 * Ad36_EquipmentList_V5
 * Theme: Equipment listing — showcase your gear
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
import { Mic, Headphones, Speaker, Monitor } from "lucide-react";
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
  CTAScene,
  useScale,
} from "./shared";

/* ─── Scene 1: Equipment Feature Cards ─── */
const SceneEquipment: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="30%" size={s(500)} opacity={0.07} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(50)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(28),
        }}
      >
        <SectionLabel text="EQUIPMENT" delay={0} />

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
          <GoldText>{"הציגו את הציוד"}</GoldText>
        </h1>

        <GoldLine delay={10} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(16), marginTop: s(10) }}>
          <FeatureCard Icon={Mic} title="מיקרופונים" desc="פרטו את כל המיקרופונים" delay={15} />
          <FeatureCard Icon={Headphones} title="אוזניות" desc="מוניטורים ואוזניות סטודיו" delay={25} />
          <FeatureCard Icon={Speaker} title="מוניטורים" desc="רמקולי סטודיו ומגברים" delay={35} />
          <FeatureCard Icon={Monitor} title="ציוד נוסף" desc="מסכים, כרטיסי קול ועוד" delay={45} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Studio Details Screenshot ─── */
const SceneStudioPage: React.FC = () => {
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
          justifyContent: "center",
          gap: s(25),
        }}
      >
        <SectionLabel text="STUDIO PAGE" delay={0} />

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
          {"הלקוחות רואים "}
          <GoldText>{"הכל"}</GoldText>
        </h2>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Studioz-Studio-Details-1-Light.webp"
            delay={8}
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
        {"הציגו את הציוד "}
        <GoldText>{"שלכם"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad36_EquipmentList_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneEquipment />
    </Sequence>
    <Sequence from={80} durationInFrames={80} premountFor={15}>
      <SceneStudioPage />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
