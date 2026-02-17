/**
 * Ad7 — Remote Projects V3
 * Remote project management features with emoji cards
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
  ACCENT_BLUE,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  EmojiFeature,
  ScreenshotFrame,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Feature Card with Emoji (larger, more prominent) ─── */
const RemoteFeatureCard: React.FC<{
  emoji: string;
  title: string;
  desc: string;
  delay: number;
}> = ({ emoji, title, desc, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 22,
        padding: "28px 24px",
        border: `1px solid ${ACCENT_BLUE}15`,
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [60, 0])}px) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <span style={{ fontSize: 44, flexShrink: 0 }}>{emoji}</span>
      <div>
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 26,
            fontWeight: 700,
            color: LIGHT_TEXT,
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 18,
            color: SUBTLE_TEXT,
            lineHeight: 1.4,
          }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
};

/* ─── Scene 1: Remote Features ─── */
const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} color={ACCENT_BLUE} />
      <RadialGlow x="50%" y="25%" size={500} color={ACCENT_BLUE} opacity={0.07} />

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
          <SectionLabel text="ניהול מרחוק" delay={0} color={ACCENT_BLUE} />
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
          נהל את האולפן{"\n"}
          <GoldText>מכל מקום בעולם</GoldText>
        </h2>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Feature cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <RemoteFeatureCard
            emoji="🌐"
            title="ניהול מרחוק"
            desc="שלוט באולפן מכל מקום בעולם"
            delay={15}
          />
          <RemoteFeatureCard
            emoji="📱"
            title="גישה מכל מקום"
            desc="ממשק מותאם לנייד ולדסקטופ"
            delay={30}
          />
          <RemoteFeatureCard
            emoji="🔔"
            title="התראות בזמן אמת"
            desc="קבל עדכון על כל הזמנה חדשה"
            delay={45}
          />
          <RemoteFeatureCard
            emoji="📊"
            title="מעקב פרויקטים"
            desc="סטטיסטיקות והכנסות בזמן אמת"
            delay={60}
          />
        </div>

        {/* Globe floating icon */}
        <div
          style={{
            textAlign: "center",
            fontSize: 60,
            marginTop: 20,
            opacity: interpolate(frame, [80, 100], [0, 1], {
              extrapolateRight: "clamp",
            }),
            transform: `scale(${interpolate(frame, [80, 100], [0.5, 1], { extrapolateRight: "clamp" })})`,
          }}
        >
          🌍
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const RemoteCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        האולפן שלך,{"\n"}
        <GoldText>בכיס שלך</GoldText>
      </>
    }
    buttonText="התחל לנהל מרחוק"
    freeText="התחל בחינם — ₪0/חודש"
    subText="גישה מלאה מכל מכשיר"
  />
);

/* ─── Main Composition ─── */
export const Ad7_RemoteProjects_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <FeaturesScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <RemoteCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
