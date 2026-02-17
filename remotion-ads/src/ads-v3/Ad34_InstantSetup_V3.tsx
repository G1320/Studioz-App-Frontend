/**
 * Ad34 — Instant Setup V3
 * 5-minute setup with countdown timer and 3-step flow
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Timer, Zap } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  Badge,
  EmojiFeature,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Countdown Timer Component ─── */
const CountdownTimer: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  // Countdown from 5:00 to 0:00
  const countdownFrame = Math.max(0, frame - delay - 15);
  const minutes = Math.max(0, 5 - Math.floor(countdownFrame / 15));
  const seconds = Math.max(0, 59 - ((countdownFrame * 4) % 60));
  const displayMin = minutes > 0 ? minutes : 0;
  const displaySec = minutes > 0 ? seconds : 0;
  const timeStr = `${displayMin}:${String(displaySec).padStart(2, "0")}`;

  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [1, 1.04]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: "50%",
          border: `4px solid ${GOLD}`,
          backgroundColor: `${GOLD}08`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 60px ${GOLD}15, inset 0 0 30px ${GOLD}05`,
          transform: `scale(${pulse})`,
        }}
      >
        <Timer size={32} color={GOLD} strokeWidth={1.8} />
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 56,
            fontWeight: 700,
            color: GOLD,
            marginTop: 8,
            filter: `drop-shadow(0 0 15px ${GOLD}30)`,
          }}
        >
          {timeStr}
        </span>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: 16,
            color: SUBTLE_TEXT,
          }}
        >
          דקות
        </span>
      </div>
    </div>
  );
};

/* ─── Scene 1: Timer + Steps ─── */
const SetupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="25%" size={500} opacity={0.08} />

      <div
        style={{
          padding: "80px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <SectionLabel text="QUICK SETUP" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "20px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          מוכן תוך{"\n"}
          <GoldText>5 דקות</GoldText>
        </h2>

        <div style={{ marginBottom: 40 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Timer */}
        <CountdownTimer delay={10} />

        {/* Steps */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 50,
            width: "100%",
          }}
        >
          <EmojiFeature emoji="1️⃣" label="הרשם לפלטפורמה" delay={30} />
          <EmojiFeature emoji="2️⃣" label="הוסף שירותים ומחירון" delay={42} />
          <EmojiFeature emoji="3️⃣" label="קבל הזמנות אונליין" delay={54} />
        </div>

        {/* Badge */}
        <div style={{ marginTop: 40 }}>
          <Badge text="מוכן תוך 5 דקות ⚡" color={SUCCESS} delay={70} Icon={Zap} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const SetupCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        אל תחכה.{"\n"}
        <GoldText>התחל עכשיו.</GoldText>
      </>
    }
    buttonText="הרשם ב-5 דקות"
    freeText="הרשמה חינמית — 0 זמן המתנה"
  />
);

/* ─── Main Composition ─── */
export const Ad34_InstantSetup_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={155} premountFor={10}>
        <SetupScene />
      </Sequence>
      <Sequence from={155} durationInFrames={85} premountFor={15}>
        <SetupCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
