/**
 * Ad6 — Google Ranking V3
 * Google ranking reveal with screenshot + pulsing gold highlight
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
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
  EmojiFeature,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Scene 1: Google Ranking Reveal ─── */
const RankingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });
  const screenshotEnter = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 60 },
  });

  // Pulsing gold border
  const pulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.15, 0.45]
  );

  const borderGlow = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [10, 30]
  );

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.08} />

      <div
        style={{
          padding: "80px 48px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <SectionLabel text="חשיפה מקסימלית" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "16px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          האולפן שלך{"\n"}
          <GoldText>בראש גוגל</GoldText>
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <GoldLine width={140} delay={10} />
        </div>

        {/* Screenshot with pulsing gold highlight border */}
        <div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              borderRadius: 20,
              overflow: "hidden",
              border: `3px solid rgba(255, 209, 102, ${pulse})`,
              boxShadow: `0 0 ${borderGlow}px ${GOLD}40, 0 30px 80px rgba(0,0,0,0.6)`,
              transform: `translateY(${interpolate(screenshotEnter, [0, 1], [150, 0])}px) scale(${interpolate(screenshotEnter, [0, 1], [0.9, 1])})`,
              opacity: screenshotEnter,
              maxWidth: "100%",
            }}
          >
            <Img
              src={staticFile("images/optimized/For-Owners-Google-Ranking.png")}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />

            {/* Gold highlight overlay on top result */}
            <div
              style={{
                position: "absolute",
                top: "18%",
                left: "5%",
                right: "5%",
                height: "22%",
                borderRadius: 12,
                border: `2px solid ${GOLD}`,
                backgroundColor: `${GOLD}08`,
                opacity: interpolate(frame, [50, 65], [0, pulse], {
                  extrapolateRight: "clamp",
                }),
                boxShadow: `0 0 ${borderGlow}px ${GOLD}20`,
              }}
            />
          </div>
        </div>

        {/* Emoji stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap",
            marginTop: 30,
          }}
        >
          <EmojiFeature emoji="🔍" label="SEO מותאם" delay={60} />
          <EmojiFeature emoji="📈" label="דירוג גבוה" delay={70} />
          <EmojiFeature emoji="🌍" label="חשיפה רחבה" delay={80} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const RankingCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        תופיע <GoldText>במקום הראשון</GoldText>
        {"\n"}בחיפושי אולפנים
      </>
    }
    buttonText="שפר את הדירוג שלך"
    freeText="התחל בחינם — ₪0/חודש"
    subText="SEO אוטומטי · דף אולפן מותאם"
  />
);

/* ─── Main Composition ─── */
export const Ad6_GoogleRanking_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <RankingScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <RankingCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
