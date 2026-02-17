/**
 * Ad45_MobileResponsive_V4
 * Theme: Responsive website on all devices — NOT an app
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
import { Smartphone, Monitor, Globe } from "lucide-react";
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
  PhoneMockup,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Phone Mockup ─── */
const ScenePhone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="50%" size={600} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "100px 50px 60px",
          height: "100%",
          gap: 25,
        }}
      >
        <SectionLabel text="RESPONSIVE" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            textAlign: "center",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-30, 0])}px)`,
          }}
        >
          {"האתר שלך עובד "}
          <GoldText>{"מכל מכשיר"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ marginTop: 10 }}>
          <PhoneMockup
            src="images/optimized/Studioz-Studio-Details-1-Light.webp"
            delay={12}
            width={380}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Features ─── */
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.07} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 25,
        }}
      >
        <SectionLabel text="ALL DEVICES" delay={0} />

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
          {"אתר "}
          <GoldText>{"רספונסיבי"}</GoldText>
          {" מלא"}
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 20 }}>
          <FeatureCard
            Icon={Smartphone}
            title="מותאם למובייל"
            desc="חווית משתמש מושלמת בנייד"
            delay={15}
          />
          <FeatureCard
            Icon={Monitor}
            title="נראה מעולה בדסקטופ"
            desc="עיצוב מקצועי בכל מסך"
            delay={25}
          />
          <FeatureCard
            Icon={Globe}
            title="נגיש מכל מקום"
            desc="בעברית ובאנגלית"
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
        {"האולפן שלך "}
        <GoldText>{"אונליין"}</GoldText>
        {"\n"}
        {"בכל מסך"}
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad45_MobileResponsive_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <ScenePhone />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
