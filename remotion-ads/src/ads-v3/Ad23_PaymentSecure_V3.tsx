/**
 * Ad23 — Secure Payments V3
 * Shield animation with lock icon and trust badges
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
  SUCCESS,
  ACCENT_BLUE,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldText,
  EmojiFeature,
  Badge,
  CTAScene,
} from "./shared";

/* ─── Animated Shield ─── */
const ShieldIcon: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scaleIn = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 80 } });
  const glowPulse = interpolate(Math.sin((frame - delay) * 0.06), [-1, 1], [0.6, 1]);
  const lockEnter = spring({ frame: frame - delay - 20, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        position: "relative",
        width: 200,
        height: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scaleIn})`,
      }}
    >
      {/* Glow ring */}
      <div
        style={{
          position: "absolute",
          width: 240,
          height: 240,
          borderRadius: "50%",
          border: `3px solid ${SUCCESS}20`,
          opacity: glowPulse,
          boxShadow: `0 0 60px ${SUCCESS}15, inset 0 0 40px ${SUCCESS}05`,
        }}
      />
      {/* Shield shape */}
      <svg width="160" height="190" viewBox="0 0 160 190">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={SUCCESS} stopOpacity="0.3" />
            <stop offset="100%" stopColor={SUCCESS} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          d="M80 10 L150 50 L150 110 Q150 170 80 185 Q10 170 10 110 L10 50 Z"
          fill="url(#shieldGrad)"
          stroke={SUCCESS}
          strokeWidth="2.5"
        />
      </svg>
      {/* Lock icon */}
      <div
        style={{
          position: "absolute",
          fontSize: 64,
          opacity: lockEnter,
          transform: `scale(${lockEnter})`,
        }}
      >
        🔒
      </div>
    </div>
  );
};

/* ─── Trust Badge ─── */
const TrustBadge: React.FC<{
  emoji: string;
  text: string;
  delay: number;
}> = ({ emoji, text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        border: `1px solid ${SUCCESS}15`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <span style={{ fontSize: 34, flexShrink: 0 }}>{emoji}</span>
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 22,
          fontWeight: 600,
          color: LIGHT_TEXT,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/* ─── Scene 1: Security Features ─── */
const SecurityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} color={SUCCESS} />
      <RadialGlow x="50%" y="25%" size={500} color={SUCCESS} opacity={0.06} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 50px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [20, 0])}px)`,
          }}
        >
          תשלומים{"\n"}
          <GoldText>מאובטחים לגמרי</GoldText>
        </h2>
      </div>

      {/* Shield */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ShieldIcon delay={10} />
      </div>

      {/* Trust features */}
      <div
        style={{
          position: "absolute",
          top: 580,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          ...RTL,
        }}
      >
        <TrustBadge emoji="🔒" text="הצפנה מלאה" delay={30} />
        <TrustBadge emoji="🛡️" text="PCI תואם" delay={40} />
        <TrustBadge emoji="✅" text="עמלות שקופות" delay={50} />
        <TrustBadge emoji="💳" text="סליקה מיידית" delay={60} />
      </div>

      {/* Bottom badge */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Badge text="אבטחה ברמה הגבוהה ביותר" color={SUCCESS} delay={75} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const SecureCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        קבל תשלומים{"\n"}
        <GoldText>בביטחון מלא</GoldText>
      </>
    }
    buttonText="התחל לסלוק עכשיו"
    freeText="חינם לתמיד — כל התכונות כלולות"
    subText="אבטחה מקסימלית · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad23_PaymentSecure_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <SecurityScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <SecureCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
