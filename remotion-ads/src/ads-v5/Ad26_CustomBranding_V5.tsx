/**
 * Ad26 — Studio Profile Page (Custom Branding)
 * 240 frames (8s) at 30fps, 1080x1920 (9:16 portrait)
 * V5: Studio detail screenshot showing profile page.
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
import { Image, FileText, List, MapPin } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUBTLE_TEXT,
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
  ScreenshotFrame,
  CTAScene,
  Footer,
  useScale,
} from "./shared";

/* ─── Scene 1: Studio Profile Screenshot ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="30%" size={s(500)} opacity={0.1} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
        }}
      >
        <SectionLabel text="BRANDING" delay={0} />
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(50),
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.25,
            margin: `${s(25)}px ${s(10)}px ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(30), 0])}px)`,
          }}
        >
          <GoldText>דף אולפן מקצועי</GoldText>
        </h1>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: s(22),
            color: SUBTLE_TEXT,
            margin: `${s(10)}px ${s(10)}px ${s(25)}px`,
            lineHeight: 1.5,
            opacity: interpolate(frame, [8, 22], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
          }}
        >
          הציג את האולפן שלך בצורה הכי טובה
        </p>
        <ScreenshotFrame
          src="images/optimized/Studioz-Studio-Details-1-Light.webp"
          delay={12}
        />
        <div style={{ marginTop: "auto" }}>
          <Footer delay={35} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Profile Feature Cards ─── */
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="35%" size={s(450)} opacity={0.08} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(50)}px ${s(60)}px`,
          height: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(44),
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.3,
            margin: `0 0 ${s(40)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(25), 0])}px)`,
          }}
        >
          מה כולל <GoldText>הדף שלך</GoldText>
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: s(16) }}>
          <FeatureCard
            Icon={Image}
            title="גלריית תמונות"
            desc="הציג את העבודות שלך"
            delay={10}
          />
          <FeatureCard
            Icon={FileText}
            title="תיאור מקצועי"
            desc="ספר על האולפן והציוד"
            delay={20}
          />
          <FeatureCard
            Icon={List}
            title="רשימת שירותים"
            desc="מחירים וחבילות ברורים"
            delay={30}
          />
          <FeatureCard
            Icon={MapPin}
            title="מיקום ונגישות"
            desc="מפה וכתובת מדויקת"
            delay={40}
          />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={50} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const Scene3: React.FC = () => (
  <CTAScene
    headline={
      <>
        צור דף <GoldText>מקצועי</GoldText> לאולפן
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad26_CustomBranding_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={95} premountFor={15}>
      <Scene1 />
    </Sequence>
    <Sequence from={80} durationInFrames={105} premountFor={15}>
      <Scene2 />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <Scene3 />
    </Sequence>
  </AbsoluteFill>
);
