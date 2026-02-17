/**
 * Ad4 — Booking Flow V3
 * 3-step numbered cards with ConnectingLine → Screenshot of booking page
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
  LIGHT_TEXT,
  SUBTLE_TEXT,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  StepCard,
  ConnectingLine,
  ScreenshotCTAScene,
  SectionLabel,
} from "./shared";

/* ─── Scene 1: Booking Steps ─── */
const StepsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="20%" size={500} opacity={0.08} />

      <div
        style={{
          padding: "80px 48px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <SectionLabel text="תהליך הזמנה" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 50,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "16px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          הזמנה ב-<GoldText>3 צעדים</GoldText>
        </h2>

        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Step cards with connecting line */}
        <div style={{ position: "relative", flex: 1, justifyContent: "center", display: "flex", flexDirection: "column", gap: 24 }}>
          <ConnectingLine x={84} y={50} height={420} startFrame={20} endFrame={90} />

          <StepCard
            num="1"
            title="בחירת אולפן"
            desc="הלקוח בוחר אולפן, תאריך ושעה"
            delay={15}
          />
          <StepCard
            num="2"
            title="אישור ותשלום"
            desc="תשלום מיידי ואישור אוטומטי"
            delay={35}
          />
          <StepCard
            num="3"
            title="ההזמנה מאושרת!"
            desc="שני הצדדים מקבלים הודעה"
            delay={55}
            isLast
          />
        </div>

        {/* Bottom hint */}
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 24,
            color: GOLD,
            textAlign: "center",
            marginTop: 40,
            opacity: interpolate(frame, [90, 110], [0, 1], {
              extrapolateRight: "clamp",
            }),
            filter: `drop-shadow(0 0 15px ${GOLD}30)`,
          }}
        >
          פשוט, מהיר, אוטומטי ✨
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Screenshot CTA ─── */
const BookingCTA: React.FC = () => (
  <ScreenshotCTAScene
    screenshotSrc="images/optimized/Studioz-Studio-Details-Order-1-Light.webp"
    headline={
      <>
        חוויית הזמנה <GoldText>חלקה</GoldText>
      </>
    }
    buttonText="התחל לקבל הזמנות"
  />
);

/* ─── Main Composition ─── */
export const Ad4_BookingFlow_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={140} premountFor={10}>
        <StepsScene />
      </Sequence>
      <Sequence from={140} durationInFrames={100} premountFor={15}>
        <BookingCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
