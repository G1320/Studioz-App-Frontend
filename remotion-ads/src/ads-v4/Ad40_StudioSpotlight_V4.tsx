/**
 * Ad40_StudioSpotlight_V4
 * Theme: Showcase your studio online — NO fake view counts
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
  Globe,
  Search,
  Image,
  MapPin,
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
  ScreenshotFrame,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Studio Page Screenshot ─── */
const SceneSpotlight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 40px 60px",
          height: "100%",
          gap: 25,
        }}
      >
        <SectionLabel text="SPOTLIGHT" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 42,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          {"הציגו את האולפן שלכם "}
          <GoldText>{"לעולם"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ marginTop: 15 }}>
          <ScreenshotFrame
            src="images/optimized/Studioz-Studio-Details-1-Light.webp"
            delay={12}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Feature Cards ─── */
const SceneFeatures: React.FC = () => {
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
          gap: 24,
        }}
      >
        <SectionLabel text="ONLINE PRESENCE" delay={0} />

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
          {"נוכחות דיגיטלית "}
          <GoldText>{"מלאה"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <FeatureCard Icon={Globe} title="דף אולפן מקצועי" desc="עיצוב מותאם לאולפנים" delay={10} />
          <FeatureCard Icon={Search} title="SEO מובנה" desc="schema.org + sitemap לגוגל" delay={20} />
          <FeatureCard Icon={Image} title="גלריית תמונות" desc="הציגו את האולפן בצורה מרשימה" delay={30} />
          <FeatureCard Icon={MapPin} title="מיקום על מפה" desc="לקוחות ימצאו אתכם בקלות" delay={40} />
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
        {"הביאו את האולפן "}
        <GoldText>{"לאינטרנט"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad40_StudioSpotlight_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneSpotlight />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
