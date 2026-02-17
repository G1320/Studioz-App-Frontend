/**
 * Ad19 — Early Bird Discount V2
 * Urgency/discount offer with timer display
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
import { Check } from "lucide-react";
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
  SPRING_SNAPPY,
  SPRING_GENTLE,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldText,
  GoldButton,
  Footer,
  Subtitle,
} from "./shared";

const TimerBlock: React.FC<{ value: string; delay: number }> = ({
  value,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 16,
        padding: "20px 24px",
        border: `1px solid rgba(255,209,102,0.1)`,
        boxShadow: `0 6px 28px rgba(0,0,0,0.3), 0 0 20px ${GOLD}08`,
        transform: `scale(${enter})`,
        opacity: enter,
        minWidth: 90,
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 42,
          fontWeight: 700,
          color: LIGHT_TEXT,
          letterSpacing: "2px",
        }}
      >
        {value}
      </span>
    </div>
  );
};

const CheckFeature: React.FC<{ text: string; delay: number }> = ({
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [30, 0])}px)`,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          backgroundColor: `${SUCCESS}18`,
          border: `1px solid ${SUCCESS}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Check size={16} color={SUCCESS} strokeWidth={2.5} />
      </div>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 20,
          color: LIGHT_TEXT,
          fontWeight: 500,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const Ad19_EarlyBirdDiscount_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Large discount number
  const discountEnter = spring({ frame, fps, config: SPRING_BOUNCY });
  const discountGlow = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [0.4, 0.8]
  );

  // Headline
  const headlineEnter = spring({
    frame: frame - 20,
    fps,
    config: SPRING_SMOOTH,
  });

  // Subtitle
  const subtitleDelay = 100;

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="25%" size={900} opacity={0.14} />
      <RadialGlow x="50%" y="25%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          padding: "50px 44px 42px",
          position: "relative",
        }}
      >
        {/* Large Discount Number */}
        <div
          style={{
            transform: `scale(${discountEnter})`,
            opacity: discountEnter,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 160,
              fontWeight: 700,
              color: GOLD,
              filter: `drop-shadow(0 0 60px ${GOLD}${Math.round(discountGlow * 255).toString(16).padStart(2, "0")})`,
              lineHeight: 1,
            }}
          >
            20%
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            lineHeight: 1.2,
            textAlign: "center",
            opacity: headlineEnter,
            transform: `translateY(${interpolate(headlineEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          {"הנחת Early Bird"}
          {"\n"}
          <GoldText>לנרשמים עכשיו</GoldText>
        </h1>

        {/* Timer Display */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 36,
          }}
        >
          <TimerBlock value="03" delay={50} />
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 36,
              color: GOLD,
              fontWeight: 700,
              opacity: interpolate(
                Math.sin(frame * 0.1),
                [-1, 1],
                [0.3, 1]
              ),
            }}
          >
            :
          </span>
          <TimerBlock value="12" delay={55} />
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 36,
              color: GOLD,
              fontWeight: 700,
              opacity: interpolate(
                Math.sin(frame * 0.1),
                [-1, 1],
                [0.3, 1]
              ),
            }}
          >
            :
          </span>
          <TimerBlock value="45" delay={60} />
        </div>

        {/* Subtitle */}
        <div style={{ marginTop: 24 }}>
          <Subtitle delay={subtitleDelay} size={20} align="center">
            ההצעה מוגבלת בזמן
          </Subtitle>
        </div>

        {/* Feature List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 36,
            alignSelf: "stretch",
            paddingRight: 40,
          }}
        >
          <CheckFeature text="גישה מלאה לכל הכלים" delay={115} />
          <CheckFeature text="ללא התחייבות" delay={125} />
          <CheckFeature text="ביטול בקליק" delay={135} />
        </div>

        {/* CTA */}
        <div style={{ marginTop: 40 }}>
          <GoldButton text="הצטרף עכשיו" delay={155} size="lg" />
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Footer delay={170} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
