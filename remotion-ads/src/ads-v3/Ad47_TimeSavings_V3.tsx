/**
 * Ad47 — Time Savings V3
 * Clock/hourglass animation showing dramatic time comparison
 * Before: 6 hours → After: 45 min. "5 שעות חזרו אליך כל יום"
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
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  DARK_CARD_HOVER,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RED,
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
  CTAScene,
  SectionLabel,
} from "./shared";
import { Clock, ArrowDown } from "lucide-react";

/* ─── Animated Clock ─── */
const AnimatedClock: React.FC<{ delay: number; color: string }> = ({
  delay,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });
  const rotation = interpolate(frame, [delay, delay + 60], [0, 360], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        backgroundColor: `${color}12`,
        border: `3px solid ${color}40`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${enter})`,
        opacity: enter,
        boxShadow: `0 0 40px ${color}15`,
        position: "relative",
      }}
    >
      <Clock size={50} color={color} strokeWidth={1.5} />
      {/* Rotating hand overlay */}
      <div
        style={{
          position: "absolute",
          width: 2,
          height: 30,
          backgroundColor: color,
          top: "50%",
          left: "50%",
          transformOrigin: "50% 0%",
          transform: `translate(-50%, 0) rotate(${rotation}deg)`,
          borderRadius: 2,
          opacity: 0.7,
        }}
      />
    </div>
  );
};

/* ─── Time Block ─── */
const TimeBlock: React.FC<{
  value: string;
  label: string;
  color: string;
  delay: number;
  isBig?: boolean;
}> = ({ value, label, color, delay, isBig }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 22,
        padding: isBig ? "36px 40px" : "28px 36px",
        border: `1px solid ${color}20`,
        textAlign: "center",
        opacity: enter,
        transform: `scale(${enter})`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${color}08`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: isBig ? 64 : 52,
          fontWeight: 700,
          color,
          marginBottom: 8,
          filter: `drop-shadow(0 0 12px ${color}25)`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: isBig ? 22 : 18,
          color: SUBTLE_TEXT,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ─── Scene 1: Time Comparison ─── */
const TimeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });
  const arrowEnter = spring({
    frame: frame - 55,
    fps,
    config: SPRING_BOUNCY,
  });
  const highlightEnter = interpolate(frame, [85, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="25%" size={500} color={RED} opacity={0.05} />
      <RadialGlow x="50%" y="75%" size={500} color={SUCCESS} opacity={0.05} />

      <div
        style={{
          padding: "70px 48px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <SectionLabel text="חיסכון בזמן" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "18px 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          זמן = כסף
        </h2>

        <div style={{ marginBottom: 40 }}>
          <GoldLine width={120} delay={8} />
        </div>

        {/* Before - red */}
        <div style={{ marginBottom: 10 }}>
          <span
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 20,
              fontWeight: 600,
              color: RED,
              opacity: interpolate(frame, [12, 22], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            לפני Studioz ❌
          </span>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20 }}>
          <AnimatedClock delay={15} color={RED} />
          <TimeBlock value="6 שעות" label="ניהול ביום" color={RED} delay={20} />
        </div>

        {/* Arrow */}
        <div
          style={{
            margin: "10px 0",
            transform: `scale(${arrowEnter})`,
            opacity: arrowEnter,
          }}
        >
          <ArrowDown size={44} color={GOLD} strokeWidth={2} />
        </div>

        {/* After - green */}
        <div style={{ marginBottom: 10 }}>
          <span
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 20,
              fontWeight: 600,
              color: SUCCESS,
              opacity: interpolate(frame, [50, 62], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            עם Studioz ✅
          </span>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 30 }}>
          <AnimatedClock delay={55} color={SUCCESS} />
          <TimeBlock value="45 דק׳" label="ביום בלבד" color={SUCCESS} delay={60} />
        </div>

        {/* Highlight savings */}
        <div
          style={{
            backgroundColor: `${GOLD}10`,
            border: `2px solid ${GOLD}30`,
            borderRadius: 22,
            padding: "24px 40px",
            textAlign: "center",
            opacity: highlightEnter,
            transform: `scale(${interpolate(highlightEnter, [0, 1], [0.8, 1])})`,
            boxShadow: `0 0 40px ${GOLD}10`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 40,
              fontWeight: 700,
              color: GOLD,
              filter: `drop-shadow(0 0 15px ${GOLD}30)`,
            }}
          >
            5 שעות חזרו אליך
          </div>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 22,
              color: SUBTLE_TEXT,
              marginTop: 6,
            }}
          >
            כל יום. כל יום. כל יום. ⏰
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const TimeCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        תפסיק לבזבז זמן
        {"\n"}
        <GoldText>תתחיל ליצור</GoldText>
      </>
    }
    buttonText="חסוך 5 שעות ביום"
    freeText="התחל בחינם — ₪0/חודש"
    subText="ההרשמה לוקחת 2 דקות"
  />
);

/* ─── Main Composition ─── */
export const Ad47_TimeSavings_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160} premountFor={10}>
        <TimeScene />
      </Sequence>
      <Sequence from={160} durationInFrames={80} premountFor={15}>
        <TimeCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
