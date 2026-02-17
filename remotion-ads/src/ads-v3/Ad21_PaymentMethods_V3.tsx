/**
 * Ad21 — Payment Methods V3
 * Accepted payment methods with icons/emoji
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
  Badge,
  CTAScene,
} from "./shared";

/* ─── Payment Method Card ─── */
const PaymentCard: React.FC<{
  emoji: string;
  title: string;
  desc: string;
  delay: number;
  accentColor?: string;
}> = ({ emoji, title, desc, delay, accentColor = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 22,
        padding: "32px 28px",
        border: `1px solid ${accentColor}15`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        flex: 1,
        opacity: enter,
        transform: `scale(${enter}) translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${accentColor}08`,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          backgroundColor: `${accentColor}12`,
          border: `2px solid ${accentColor}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 42 }}>{emoji}</span>
      </div>
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 24,
          fontWeight: 700,
          color: LIGHT_TEXT,
          textAlign: "center",
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 16,
          color: SUBTLE_TEXT,
          textAlign: "center",
        }}
      >
        {desc}
      </span>
    </div>
  );
};

/* ─── Scene 1: Payment Methods Grid ─── */
const PaymentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} color={ACCENT_BLUE} />
      <RadialGlow x="50%" y="30%" size={500} color={GOLD} opacity={0.06} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 20,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
            opacity: headEnter,
          }}
        >
          💳 אמצעי תשלום
        </span>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "16px 50px 0",
            lineHeight: 1.3,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [8, 22], [20, 0], { extrapolateRight: "clamp" })}px)`,
          }}
        >
          קבל תשלום{"\n"}
          <GoldText>בכל דרך</GoldText>
        </h2>
      </div>

      {/* Payment cards 2x2 grid */}
      <div
        style={{
          position: "absolute",
          top: 340,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", gap: 20 }}>
          <PaymentCard
            emoji="💳"
            title="כרטיס אשראי"
            desc="Visa, Mastercard"
            delay={15}
            accentColor={ACCENT_BLUE}
          />
          <PaymentCard
            emoji="🏦"
            title="העברה בנקאית"
            desc="ישירות לחשבון"
            delay={25}
            accentColor={SUCCESS}
          />
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <PaymentCard
            emoji="📱"
            title="Apple Pay"
            desc="תשלום מהיר"
            delay={35}
            accentColor={GOLD}
          />
          <PaymentCard
            emoji="💰"
            title="Bit"
            desc="תשלום מיידי"
            delay={45}
            accentColor={ACCENT_BLUE}
          />
        </div>
      </div>

      {/* Secure badge */}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          ...RTL,
        }}
      >
        <Badge text="🔒 תשלום מאובטח 100%" color={SUCCESS} delay={60} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const PaymentCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        תשלומים פשוטים{"\n"}
        <GoldText>ללא עמלות מיותרות</GoldText>
      </>
    }
    buttonText="התחל לקבל תשלומים"
    freeText="התחל בחינם — ₪0/חודש"
    subText="סליקה מיידית · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad21_PaymentMethods_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <PaymentScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <PaymentCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
