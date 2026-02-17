/**
 * Ad4 — Booking Flow V2
 * 3-step booking visualization with vertical timeline
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Search, CalendarDays, CreditCard, CheckCircle2 } from "lucide-react";
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
  GoldText,
  Footer,
  Headline,
  Badge,
} from "./shared";

const steps = [
  {
    Icon: Search,
    title: "חפש סטודיו",
    desc: "מצא את הסטודיו המושלם",
    delay: 20,
  },
  {
    Icon: CalendarDays,
    title: "בחר תאריך",
    desc: "רואה זמינות בזמן אמת",
    delay: 35,
  },
  {
    Icon: CreditCard,
    title: "שלם ואשר",
    desc: "תשלום מאובטח בקליק",
    delay: 50,
  },
];

export const Ad4_BookingFlow_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  // Gold connecting line grows with progress
  const lineProgress = interpolate(frame, [20, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeEnter = spring({ frame: frame - 100, fps, config: SPRING_BOUNCY });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="60%" y="40%" size={550} opacity={0.09} />
      <RadialGlow x="30%" y="70%" size={350} color="#5b8fb9" opacity={0.04} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "70px 48px 52px",
          position: "relative",
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 56,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "right",
            margin: 0,
            lineHeight: 1.2,
            marginBottom: 60,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          הזמן סטודיו
          {"\n"}
          <GoldText>ב-3 צעדים</GoldText>
        </h1>

        {/* Timeline */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            paddingRight: 50,
          }}
        >
          {/* Vertical gold connecting line */}
          <div
            style={{
              position: "absolute",
              right: 23,
              top: 35,
              width: 3,
              height: interpolate(lineProgress, [0, 1], [0, 450]),
              background: `linear-gradient(180deg, ${GOLD}, ${GOLD}40)`,
              borderRadius: 2,
            }}
          />

          {steps.map((step, i) => {
            const enter = spring({ frame: frame - step.delay, fps, config: SPRING_SNAPPY });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 24,
                  marginBottom: 45,
                  opacity: enter,
                  transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)`,
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: `${GOLD}15`,
                    border: `2px solid ${GOLD}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: `0 0 20px ${GOLD}12`,
                  }}
                >
                  <step.Icon size={22} color={GOLD} strokeWidth={1.8} />
                </div>

                {/* Content card */}
                <div
                  style={{
                    backgroundColor: DARK_CARD,
                    borderRadius: 18,
                    padding: "24px 22px",
                    border: `1px solid rgba(255,209,102,0.08)`,
                    boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
                    flex: 1,
                    marginRight: 16,
                  }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      fontFamily: FONT_HEADING,
                      fontSize: 13,
                      fontWeight: 600,
                      color: GOLD,
                      marginBottom: 8,
                      letterSpacing: "1px",
                    }}
                  >
                    שלב {i + 1}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_HEADING,
                      fontSize: 26,
                      fontWeight: 700,
                      color: LIGHT_TEXT,
                      marginBottom: 6,
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 17,
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

        {/* Success badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 20,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              backgroundColor: `${SUCCESS}12`,
              border: `1.5px solid ${SUCCESS}30`,
              borderRadius: 16,
              padding: "16px 32px",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              opacity: badgeEnter,
              transform: `scale(${badgeEnter})`,
              boxShadow: `0 0 30px ${SUCCESS}10`,
            }}
          >
            <CheckCircle2 size={24} color={SUCCESS} strokeWidth={2} />
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 22,
                fontWeight: 700,
                color: SUCCESS,
              }}
            >
              ההזמנה נסגרה!
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Footer delay={90} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
