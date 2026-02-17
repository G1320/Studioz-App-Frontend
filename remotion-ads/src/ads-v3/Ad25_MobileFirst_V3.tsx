/**
 * Ad25 — Mobile First Management V3
 * Phone mockup as central element with management features
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
  PhoneMockup,
  CTAScene,
} from "./shared";

/* ─── Floating Feature Bubble ─── */
const FeatureBubble: React.FC<{
  emoji: string;
  label: string;
  x: number;
  y: number;
  delay: number;
  side: "left" | "right";
}> = ({ emoji, label, x, y, delay, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });
  const float = Math.sin((frame - delay) * 0.04) * 6;

  return (
    <div
      style={{
        position: "absolute",
        left: side === "left" ? x : undefined,
        right: side === "right" ? x : undefined,
        top: y + float,
        backgroundColor: DARK_CARD,
        borderRadius: 16,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        border: `1px solid ${GOLD}15`,
        opacity: enter,
        transform: `scale(${enter}) translateX(${interpolate(enter, [0, 1], [side === "left" ? -40 : 40, 0])}px)`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.35), 0 0 15px ${GOLD}06`,
        zIndex: 10,
        ...RTL,
      }}
    >
      <span style={{ fontSize: 26 }}>{emoji}</span>
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 18,
          fontWeight: 600,
          color: LIGHT_TEXT,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─── Scene 1: Phone Mockup ─── */
const MobileScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <NoiseOverlay />
      <AmbientParticles count={14} color={ACCENT_BLUE} />
      <RadialGlow x="50%" y="45%" size={600} color={ACCENT_BLUE} opacity={0.06} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
          ...RTL,
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
          📱 ניהול מהנייד
        </span>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "16px 50px 0",
            lineHeight: 1.3,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          הסטודיו שלך{"\n"}
          <GoldText>בכף היד</GoldText>
        </h2>
      </div>

      {/* Phone mockup centered */}
      <div
        style={{
          position: "absolute",
          top: 350,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
      >
        <PhoneMockup
          src="images/optimized/Studioz-Dashboard-Calendar.webp"
          delay={10}
          width={380}
          height={760}
        />
      </div>

      {/* Floating feature bubbles around phone */}
      <FeatureBubble emoji="📱" label="ניהול מהנייד" x={30} y={400} delay={25} side="left" />
      <FeatureBubble emoji="🔔" label="התראות פוש" x={30} y={540} delay={35} side="right" />
      <FeatureBubble emoji="📊" label="נתונים בקצות האצבעות" x={20} y={680} delay={45} side="left" />
      <FeatureBubble emoji="📅" label="יומן בנייד" x={30} y={820} delay={55} side="right" />
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const MobileCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        נהל את הסטודיו{"\n"}
        <GoldText>מכל מקום</GoldText>
      </>
    }
    buttonText="התחל לנהל מהנייד"
    freeText="התחל בחינם — ₪0/חודש"
    subText="זמין בכל מכשיר · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad25_MobileFirst_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <MobileScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <MobileCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
