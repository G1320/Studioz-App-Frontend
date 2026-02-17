/**
 * Ad14_NoCalls_V4
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
import { PhoneOff, Globe, Calendar, Bell } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  RED,
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
  PainCard,
  FeatureCard,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Pain — No More Calls ─── */
const ScenePain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });
  const iconScale = spring({ frame: frame - 10, fps, config: { damping: 8, stiffness: 50 } });
  const strikeProgress = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} color={RED} opacity={0.07} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 50px 60px",
          height: "100%",
          gap: 30,
        }}
      >
        <SectionLabel text="NO MORE CALLS" delay={0} color={RED} />

        {/* Big phone icon with strikethrough */}
        <div
          style={{
            position: "relative",
            width: 140,
            height: 140,
            borderRadius: 40,
            backgroundColor: `${RED}12`,
            border: `2px solid ${RED}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${iconScale})`,
          }}
        >
          <PhoneOff size={64} color={RED} strokeWidth={1.5} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "10%",
              width: `${strikeProgress * 80}%`,
              height: 4,
              backgroundColor: RED,
              borderRadius: 2,
              transform: "rotate(-45deg)",
              transformOrigin: "left center",
            }}
          />
        </div>

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"אין עוד "}
          <span style={{ color: RED }}>{"שיחות אין סוף"}</span>
        </h1>

        <GoldLine delay={15} width={100} />

        <div style={{ width: "100%", marginTop: 10 }}>
          <PainCard Icon={PhoneOff} text="אין עוד שיחות אין סוף" delay={20} strikeDelay={60} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Online Alternative ─── */
const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={600} color={SUCCESS} opacity={0.06} />

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
        <SectionLabel text="THE ALTERNATIVE" delay={0} color={SUCCESS} />

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
          {"הלקוחות מזמינים "}
          <GoldText>{"לבד"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <FeatureCard Icon={Globe} title="דף הזמנות 24/7" desc="תמיד פתוח, תמיד זמין" delay={15} accentColor={SUCCESS} />
          <FeatureCard Icon={Calendar} title="יומן חי" desc="זמינות בזמן אמת" delay={25} accentColor={SUCCESS} />
          <FeatureCard Icon={Bell} title="אישור אוטומטי" desc="הלקוח מקבל אישור מיידי" delay={35} accentColor={SUCCESS} />
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
        {"תפסיק לענות לטלפון"}
        {"\n"}
        <GoldText>{"תתחיל ליצור"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad14_NoCalls_V4: React.FC = () => (
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
