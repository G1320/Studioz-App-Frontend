/**
 * Ad6_GoogleRanking_V5
 * Theme: SEO / Google visibility
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
import { Search, Globe, BarChart3 } from "lucide-react";
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

/* ─── Scene 1: SEO Features ─── */
const SceneSEO: React.FC = () => {
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
        <SectionLabel text="SEO" delay={0} />

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
          {"להופיע ב"}
          <GoldText>{"ראש גוגל"}</GoldText>
        </h1>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(18), marginTop: s(20) }}>
          <FeatureCard
            Icon={Search}
            title="SEO מובנה"
            desc="עמוד אולפן מותאם למנועי חיפוש"
            delay={15}
          />
          <FeatureCard
            Icon={Globe}
            title="נוכחות דיגיטלית"
            desc="עמוד מקצועי עם גלריה ומחירון"
            delay={25}
          />
          <FeatureCard
            Icon={BarChart3}
            title="חשיפה אורגנית"
            desc="לקוחות חדשים מוצאים אותך בגוגל"
            delay={35}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Google Ranking Screenshot ─── */
const SceneRanking: React.FC = () => {
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
        <SectionLabel text="GOOGLE" delay={0} />

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
          {"האולפן שלך "}
          <GoldText>{"בתוצאות הראשונות"}</GoldText>
        </h2>

        <div style={{ marginTop: s(15) }}>
          <ScreenshotFrame
            src="images/optimized/For-Owners-Google-Ranking.png"
            delay={10}
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
        <GoldText>{"למצוא אותך"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad6_GoogleRanking_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneSEO />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneRanking />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
