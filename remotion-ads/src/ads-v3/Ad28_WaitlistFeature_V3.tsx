/**
 * Ad28 — Waitlist Feature V3
 * Full booking → waitlist notification → spot opens flow
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
  RED,
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
  ConnectingLine,
  CTAScene,
} from "./shared";

/* ─── Flow Step ─── */
const FlowStep: React.FC<{
  emoji: string;
  title: string;
  subtitle: string;
  delay: number;
  color: string;
  isActive?: boolean;
}> = ({ emoji, title, subtitle, delay, color, isActive = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });
  const pulse = isActive
    ? interpolate(Math.sin((frame - delay) * 0.08), [-1, 1], [0.97, 1.03])
    : 1;

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 22,
        padding: "30px 28px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        border: `2px solid ${color}${isActive ? "40" : "15"}`,
        opacity: enter,
        transform: `scale(${enter * pulse}) translateX(${interpolate(enter, [0, 1], [60, 0])}px)`,
        boxShadow: isActive
          ? `0 8px 32px rgba(0,0,0,0.35), 0 0 30px ${color}15`
          : "0 6px 28px rgba(0,0,0,0.25)",
        ...RTL,
      }}
    >
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: 20,
          backgroundColor: `${color}15`,
          border: `2px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 36 }}>{emoji}</span>
      </div>
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
        <div style={{ fontFamily: FONT_BODY, fontSize: 17, color: SUBTLE_TEXT }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
};

/* ─── Animated Arrow between steps ─── */
const FlowArrow: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        opacity: enter,
        transform: `scaleY(${enter})`,
      }}
    >
      <div
        style={{
          width: 3,
          height: 40,
          background: `linear-gradient(180deg, ${GOLD}40, ${GOLD}10)`,
          borderRadius: 2,
        }}
      />
    </div>
  );
};

/* ─── Scene 1: Waitlist Flow ─── */
const WaitlistScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.07} />

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
          ⏳ רשימת המתנה
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
          אף לקוח{"\n"}
          <GoldText>לא הולך לאיבוד</GoldText>
        </h2>
      </div>

      {/* Flow steps */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <FlowStep
          emoji="📅"
          title="מלא"
          subtitle="כל המשבצות תפוסות"
          delay={15}
          color={RED}
        />
        <FlowArrow delay={30} />
        <FlowStep
          emoji="⏳"
          title="רשימת המתנה"
          subtitle="הלקוח נרשם אוטומטית"
          delay={35}
          color={GOLD}
        />
        <FlowArrow delay={50} />
        <FlowStep
          emoji="🎉"
          title="מקום התפנה!"
          subtitle="הלקוח מקבל הודעה מיידית"
          delay={55}
          color={SUCCESS}
          isActive
        />
      </div>

      {/* Badge */}
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
        <Badge text="⚡ אוטומטי לגמרי" color={SUCCESS} delay={75} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const WaitlistCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        הגדל הכנסות{"\n"}
        <GoldText>עם רשימת המתנה חכמה</GoldText>
      </>
    }
    buttonText="הפעל רשימת המתנה"
    freeText="התחל בחינם — ₪0/חודש"
    subText="אוטומציה מלאה · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad28_WaitlistFeature_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <WaitlistScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <WaitlistCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
