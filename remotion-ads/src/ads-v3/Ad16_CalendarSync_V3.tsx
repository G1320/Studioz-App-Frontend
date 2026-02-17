/**
 * Ad16 — Calendar Sync V3
 * Calendar icons syncing with Studioz + availability screenshot
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
  GoldLine,
  GoldText,
  EmojiFeature,
  ScreenshotFrame,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Calendar Brand Icon ─── */
const CalendarIcon: React.FC<{
  emoji: string;
  label: string;
  delay: number;
  color: string;
}> = ({ emoji, label, delay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  // Float animation
  const float = Math.sin(frame * 0.04 + delay) * 4;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity: enter,
        transform: `scale(${enter}) translateY(${float}px)`,
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 24,
          backgroundColor: DARK_CARD,
          border: `2px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${color}10`,
        }}
      >
        <span style={{ fontSize: 50 }}>{emoji}</span>
      </div>
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 16,
          fontWeight: 600,
          color: SUBTLE_TEXT,
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─── Scene 1: Calendar Sync ─── */
const SyncScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  // Sync arrows animation
  const syncPulse = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.7, 1]
  );

  // Sync arrows rotation
  const arrowRotate = interpolate(frame, [40, 140], [0, 360], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

      <div
        style={{
          padding: "70px 40px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <SectionLabel text="סנכרון יומן" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "14px 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          סנכרון עם{"\n"}
          <GoldText>כל היומנים</GoldText>
        </h2>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
          <GoldLine width={120} delay={8} />
        </div>

        {/* Calendar icons row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 28,
            marginBottom: 24,
          }}
        >
          <CalendarIcon emoji="📅" label="Google" delay={15} color="#4285F4" />
          <CalendarIcon emoji="🍎" label="Apple" delay={25} color="#999" />
          <CalendarIcon emoji="📧" label="Outlook" delay={35} color="#0078D4" />
        </div>

        {/* Sync arrows center */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: `${GOLD}12`,
              border: `2px solid ${GOLD}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: syncPulse,
              boxShadow: `0 0 20px ${GOLD}15`,
            }}
          >
            <span
              style={{
                fontSize: 28,
                display: "inline-block",
                transform: `rotate(${arrowRotate}deg)`,
              }}
            >
              🔄
            </span>
          </div>
        </div>

        {/* Studioz logo destination */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              backgroundColor: DARK_CARD,
              borderRadius: 20,
              padding: "14px 30px",
              border: `2px solid ${GOLD}25`,
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: `0 0 30px ${GOLD}10`,
              opacity: interpolate(frame, [40, 55], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            <Img
              src={staticFile("logo.png")}
              style={{ width: 36, height: 36, borderRadius: 8 }}
            />
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 22,
                fontWeight: 700,
                color: GOLD,
              }}
            >
              Studioz
            </span>
          </div>
        </div>

        {/* Screenshot */}
        <div style={{ flex: 1 }}>
          <ScreenshotFrame
            src="images/optimized/Studio-Availability-Controls-desktop-1-V3.webp"
            delay={30}
            borderRadius={18}
          />
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 20,
          }}
        >
          <EmojiFeature emoji="🔄" label="סנכרון דו-כיווני" delay={60} />
          <EmojiFeature emoji="⚡" label="עדכון מיידי" delay={70} />
          <EmojiFeature emoji="🚫" label="אפס התנגשויות" delay={80} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const SyncCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        יומן אחד{"\n"}
        <GoldText>לכל הפלטפורמות</GoldText>
      </>
    }
    buttonText="חבר את היומן שלך"
    freeText="התחל בחינם — ₪0/חודש"
    subText="Google · Apple · Outlook · ועוד"
  />
);

/* ─── Main Composition ─── */
export const Ad16_CalendarSync_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={155} premountFor={10}>
        <SyncScene />
      </Sequence>
      <Sequence from={155} durationInFrames={85} premountFor={15}>
        <SyncCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
