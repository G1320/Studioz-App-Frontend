/**
 * Ad2 — Studio Owners Dream V3
 * V1 engagement (screenshots, emoji, strikethrough) + V2 premium polish
 * 360 frames / 12s @ 30fps
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
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  PainCard,
  EmojiFeature,
  ScreenshotFrame,
  GoldButton,
  Footer,
  GoldText,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Problem Statement (V1-style with emoji + strikethrough) ─── */
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} color={RED} />
      <RadialGlow x="50%" y="25%" size={500} color={RED} opacity={0.06} />

      <div style={{ padding: "80px 48px", display: "flex", flexDirection: "column", height: "100%" }}>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 54,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            marginBottom: 50,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          נשמע מוכר?
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, justifyContent: "center" }}>
          <PainCard emoji="📞" text="רודף אחרי לקוחות להזמנות" delay={15} strikeDelay={80} />
          <PainCard emoji="📅" text="הזמנות כפולות ביומן" delay={30} strikeDelay={88} />
          <PainCard emoji="🧾" text="חשבוניות באמצע הלילה" delay={45} strikeDelay={96} />
        </div>

        {/* Transition text */}
        <p
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 40,
            fontWeight: 600,
            color: GOLD,
            marginTop: 40,
            textAlign: "center",
            opacity: interpolate(frame, [85, 100], [0, 1], { extrapolateRight: "clamp" }),
            transform: `scale(${interpolate(frame, [85, 100], [0.8, 1], { extrapolateRight: "clamp" })})`,
            filter: `drop-shadow(0 0 20px ${GOLD}30)`,
          }}
        >
          יש דרך טובה יותר.
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Screenshot (V1 real product shots) ─── */
const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <NoiseOverlay />
      <AmbientParticles count={10} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 80,
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
            fontSize: 18,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
          }}
        >
          מרכז הבקרה שלך
        </span>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "12px 60px 0",
            lineHeight: 1.2,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          ניהול מרכזי
        </h2>
      </div>

      {/* Dashboard screenshot */}
      <div style={{ position: "absolute", top: 300, left: 40, right: 40 }}>
        <ScreenshotFrame
          src="images/optimized/Studioz-Dashboard-Calendar.webp"
          delay={5}
          borderRadius={20}
        />
      </div>

      {/* Feature pills at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 14,
          flexWrap: "wrap",
          padding: "0 40px",
          ...RTL,
        }}
      >
        <EmojiFeature emoji="🔄" label="סנכרון יומן אוטומטי" delay={30} />
        <EmojiFeature emoji="💳" label="תשלומים מיידיים" delay={38} />
        <EmojiFeature emoji="✅" label="אפס הזמנות כפולות" delay={46} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: Availability Controls Screenshot ─── */
const AvailabilityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <NoiseOverlay />
      <AmbientParticles count={10} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

      <div
        style={{
          position: "absolute",
          top: 80,
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
            fontSize: 18,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          שליטה בלו״ז
        </span>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "12px 50px 0",
            lineHeight: 1.3,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          קבל הזמנות{"\n"}
          <GoldText>רק כשזה מתאים לך</GoldText>
        </h2>
      </div>

      {/* Availability controls screenshot */}
      <div style={{ position: "absolute", top: 360, left: 30, right: 30 }}>
        <ScreenshotFrame
          src="images/optimized/Studio-Availability-Controls-desktop-1-V3.webp"
          delay={5}
          borderRadius={20}
        />
      </div>

      {/* Bottom bullets */}
      <div style={{ position: "absolute", bottom: 110, left: 60, right: 60, ...RTL }}>
        {["שעות גמישות לכל יום", "זמני מעבר אוטומטיים", "אישור מיידי או ידני"].map(
          (text, i) => {
            const itemEnter = spring({
              frame: frame - 35 - i * 8,
              fps,
              config: { damping: 12 },
            });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 18,
                  opacity: itemEnter,
                  transform: `translateX(${interpolate(itemEnter, [0, 1], [40, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: SUCCESS,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${SUCCESS}40`,
                  }}
                />
                <span style={{ fontFamily: FONT_BODY, fontSize: 22, color: LIGHT_TEXT }}>
                  {text}
                </span>
              </div>
            );
          }
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 4: CTA (V1-style with logo + free badge) ─── */
const PricingCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        הפוך את האולפן שלך
        {"\n"}
        <GoldText>לעסק מתפקד</GoldText>
      </>
    }
    buttonText="פרסם את האולפן שלך עכשיו"
    freeText="חינם לתמיד — כל התכונות כלולות"
    subText="ללא כרטיס אשראי · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad2_StudioOwnersDream_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={110} premountFor={10}>
        <ProblemScene />
      </Sequence>
      <Sequence from={110} durationInFrames={80} premountFor={15}>
        <DashboardScene />
      </Sequence>
      <Sequence from={190} durationInFrames={80} premountFor={15}>
        <AvailabilityScene />
      </Sequence>
      <Sequence from={270} durationInFrames={90} premountFor={15}>
        <PricingCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
