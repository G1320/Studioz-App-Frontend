/**
 * Ad1 — Book Your Session V2
 * Cinematic studio booking experience
 * 300 frames / 10s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Search, CalendarDays, CreditCard, CheckCircle2, TrendingUp } from "lucide-react";
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
  SPRING_SNAPPY,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldButton,
  Footer,
  GoldText,
  Badge,
} from "./shared";

/* ─── Scene 1: Logo Reveal ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: SPRING_BOUNCY });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleEnter = spring({ frame: frame - 25, fps, config: SPRING_SMOOTH });
  const subtitleEnter = spring({ frame: frame - 40, fps, config: SPRING_GENTLE });
  const lineEnter = spring({ frame: frame - 55, fps, config: SPRING_GENTLE });

  // Scene exit
  const exitOpacity = interpolate(frame, [85, 100], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        ...RTL,
        opacity: exitOpacity,
      }}
    >
      <NoiseOverlay />
      <AmbientParticles count={20} />
      <RadialGlow x="50%" y="40%" size={700} opacity={0.12} />
      <RadialGlow x="30%" y="60%" size={400} color="#5b8fb9" opacity={0.05} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "0 48px",
          position: "relative",
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            marginBottom: 50,
            filter: `drop-shadow(0 0 40px ${GOLD}20)`,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{
              width: 160,
              height: 160,
              borderRadius: 32,
            }}
          />
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 72,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.2,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          הזמן סטודיו
          {"\n"}
          <GoldText>בקליק</GoldText>
        </h1>

        {/* Subtitle line */}
        <div
          style={{
            marginTop: 30,
            opacity: subtitleEnter,
            transform: `translateY(${interpolate(subtitleEnter, [0, 1], [15, 0])}px)`,
          }}
        >
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 24,
              color: SUBTLE_TEXT,
              textAlign: "center",
              margin: 0,
            }}
          >
            הפלטפורמה המובילה להזמנת סטודיו בישראל
          </p>
        </div>

        {/* Gold accent line */}
        <div style={{ marginTop: 35, opacity: lineEnter }}>
          <GoldLine width={200} delay={55} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Booking Steps ─── */
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { Icon: Search, title: "חפש סטודיו", desc: "מאגר סטודיואים מכל הסוגים", delay: 10 },
    { Icon: CalendarDays, title: "בחר תאריך ושעה", desc: "זמינות בזמן אמת", delay: 25 },
    { Icon: CreditCard, title: "שלם מאובטח", desc: "סליקה מיידית ומאובטחת", delay: 40 },
    { Icon: CheckCircle2, title: "ההזמנה אושרה!", desc: "אישור אוטומטי למייל", delay: 55 },
  ];

  // Scene exit
  const exitOpacity = interpolate(frame, [85, 100], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        ...RTL,
        opacity: exitOpacity,
      }}
    >
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="70%" y="30%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          padding: "0 52px",
          gap: 24,
          position: "relative",
        }}
      >
        {steps.map((step, i) => {
          const enter = spring({ frame: frame - step.delay, fps, config: SPRING_SNAPPY });
          const stepNum = i + 1;
          return (
            <div
              key={i}
              style={{
                backgroundColor: DARK_CARD,
                borderRadius: 20,
                padding: "28px 24px",
                border: `1px solid rgba(255,209,102,0.08)`,
                display: "flex",
                alignItems: "center",
                gap: 18,
                opacity: enter,
                transform: `translateX(${interpolate(enter, [0, 1], [80, 0])}px)`,
                boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
              }}
            >
              {/* Step number */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: `${GOLD}15`,
                  border: `1.5px solid ${GOLD}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_HEADING,
                  fontSize: 18,
                  fontWeight: 700,
                  color: GOLD,
                  flexShrink: 0,
                }}
              >
                {stepNum}
              </div>

              {/* Icon */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: `${GOLD}10`,
                  border: `1px solid ${GOLD}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <step.Icon size={26} color={GOLD} strokeWidth={1.8} />
              </div>

              {/* Text */}
              <div>
                <div
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 24,
                    fontWeight: 700,
                    color: LIGHT_TEXT,
                    marginBottom: 4,
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 16,
                    color: SUBTLE_TEXT,
                  }}
                >
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });
  const badgeEnter = spring({ frame: frame - 30, fps, config: SPRING_SMOOTH });
  const ctaEnter = spring({ frame: frame - 45, fps, config: SPRING_BOUNCY });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="45%" size={600} opacity={0.1} />
      <RadialGlow x="50%" y="65%" size={350} color="#6b9e82" opacity={0.04} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "0 48px",
          gap: 40,
          position: "relative",
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 58,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.25,
            opacity: headlineEnter,
            transform: `translateY(${interpolate(headlineEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          מוכנים להתחיל?
        </h1>

        {/* Stats badge */}
        <div
          style={{
            opacity: badgeEnter,
            transform: `translateY(${interpolate(badgeEnter, [0, 1], [15, 0])}px)`,
          }}
        >
          <Badge text="+35% הזמנות" color={SUCCESS} delay={0} Icon={TrendingUp} />
        </div>

        {/* CTA */}
        <div
          style={{
            transform: `scale(${ctaEnter})`,
            opacity: ctaEnter,
          }}
        >
          <GoldButton text="התחל עכשיו — בחינם" delay={0} size="lg" />
        </div>

        {/* Footer */}
        <div style={{ position: "absolute", bottom: 52, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Footer delay={50} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Main Composition ─── */
export const Ad1_BookYourSession_V2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={100} premountFor={10}>
        <Scene1 />
      </Sequence>
      <Sequence from={100} durationInFrames={100} premountFor={15}>
        <Scene2 />
      </Sequence>
      <Sequence from={200} durationInFrames={100} premountFor={15}>
        <Scene3 />
      </Sequence>
    </AbsoluteFill>
  );
};
