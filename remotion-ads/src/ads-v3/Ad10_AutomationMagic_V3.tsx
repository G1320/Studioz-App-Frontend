/**
 * Ad10 — Automation Magic V3
 * Animated automation flow: order → confirm → pay → remind
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
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
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
  ScreenshotFrame,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Flow Step ─── */
const FlowStep: React.FC<{
  emoji: string;
  label: string;
  delay: number;
  showArrow?: boolean;
}> = ({ emoji, label, delay, showArrow = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  const arrowEnter = spring({
    frame: frame - delay - 5,
    fps,
    config: { damping: 18 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      {/* Emoji circle */}
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          backgroundColor: DARK_CARD,
          border: `2px solid ${GOLD}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: enter,
          transform: `scale(${enter})`,
          boxShadow: `0 0 25px ${GOLD}10`,
        }}
      >
        <span style={{ fontSize: 40 }}>{emoji}</span>
      </div>

      {/* Label */}
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 17,
          fontWeight: 600,
          color: LIGHT_TEXT,
          textAlign: "center",
          opacity: enter,
          maxWidth: 120,
        }}
      >
        {label}
      </span>

      {/* Arrow */}
      {showArrow && (
        <div
          style={{
            fontSize: 30,
            color: GOLD,
            opacity: arrowEnter,
            transform: `translateY(${interpolate(arrowEnter, [0, 1], [10, 0])}px)`,
            marginTop: 4,
          }}
        >
          ↓
        </div>
      )}
    </div>
  );
};

/* ─── Scene 1: Automation Flow ─── */
const AutomationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  // Connecting line that grows between steps
  const lineProgress = interpolate(frame, [20, 100], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "All automatic" badge
  const badgeEnter = spring({
    frame: frame - 95,
    fps,
    config: SPRING_BOUNCY,
  });

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
          <SectionLabel text="אוטומציה מלאה" delay={0} />
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
          הכל קורה{"\n"}
          <GoldText>אוטומטית</GoldText>
        </h2>

        <div
          style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
        >
          <GoldLine width={140} delay={10} />
        </div>

        {/* Flow steps in a vertical chain */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            flex: 1,
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Connecting vertical line */}
          <div
            style={{
              position: "absolute",
              top: "8%",
              width: 2,
              height: `${lineProgress * 0.84}%`,
              background: `linear-gradient(180deg, ${GOLD}40, ${GOLD}10)`,
              zIndex: 0,
            }}
          />

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <FlowStep emoji="📥" label="הזמנה נכנסת" delay={15} />
            <FlowStep emoji="✅" label="אישור אוטומטי" delay={35} />
            <FlowStep emoji="💳" label="תשלום מאובטח" delay={55} />
            <FlowStep emoji="🔔" label="תזכורת ללקוח" delay={75} showArrow={false} />
          </div>
        </div>

        {/* "All automatic" badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 20,
            opacity: badgeEnter,
            transform: `scale(${badgeEnter})`,
          }}
        >
          <div
            style={{
              backgroundColor: `${SUCCESS}15`,
              border: `1px solid ${SUCCESS}30`,
              borderRadius: 50,
              padding: "14px 30px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 22 }}>🤖</span>
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 22,
                fontWeight: 600,
                color: SUCCESS,
              }}
            >
              100% אוטומטי — בלי מגע יד
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Screenshot + CTA ─── */
const AutomationCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const screenshotEnter = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 60 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={10} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

      {/* Dashboard screenshot */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 30,
          right: 30,
          transform: `translateY(${interpolate(screenshotEnter, [0, 1], [120, 0])}px)`,
          opacity: screenshotEnter,
        }}
      >
        <ScreenshotFrame
          src="images/optimized/Studioz-Dashboard-Calendar.webp"
          delay={0}
          borderRadius={20}
        />
      </div>

      {/* Bottom overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "100px 50px 120px",
          background: `linear-gradient(0deg, ${DARK_BG} 50%, transparent 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 42,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 20px",
            opacity: interpolate(frame, [15, 30], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          הדשבורד שעובד <GoldText>בשבילך</GoldText>
        </h2>

        <div
          style={{
            backgroundColor: GOLD,
            padding: "18px 44px",
            borderRadius: 16,
            opacity: interpolate(frame, [30, 45], [0, 1], {
              extrapolateRight: "clamp",
            }),
            boxShadow: `0 0 50px ${GOLD}25`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 26,
              fontWeight: 700,
              color: DARK_BG,
            }}
          >
            התחל עכשיו ←
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Main Composition ─── */
export const Ad10_AutomationMagic_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <AutomationScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <AutomationCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
