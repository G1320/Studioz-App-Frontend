/**
 * Ad5 — Categories V2
 * Studio category showcase
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
import { Mic, Camera, Music, Headphones, Video, Disc3 } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
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
  SectionLabel,
  GoldButton,
  Footer,
  GoldText,
} from "./shared";

const categories = [
  { Icon: Mic, name: "אולפני הקלטה", desc: "מוזיקה ופודקאסטים" },
  { Icon: Camera, name: "סטודיו צילום", desc: "צילום מקצועי" },
  { Icon: Music, name: "חדרי חזרות", desc: "להקות ואמנים" },
  { Icon: Headphones, name: "פודקאסט", desc: "הקלטה ושידור" },
  { Icon: Video, name: "סטודיו וידאו", desc: "הפקות ותוכן" },
  { Icon: Disc3, name: "אולפני DJ", desc: "אירועים ומיקס" },
];

export const Ad5_Categories_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });
  const headEnter = spring({ frame: frame - 15, fps, config: SPRING_SMOOTH });
  const ctaEnter = spring({ frame: frame - 100, fps, config: SPRING_BOUNCY });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={600} opacity={0.09} />
      <RadialGlow x="70%" y="65%" size={350} color="#5b8fb9" opacity={0.04} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "70px 44px 52px",
          position: "relative",
        }}
      >
        {/* Section label */}
        <div style={{ marginBottom: 16 }}>
          <SectionLabel text="קטגוריות סטודיו" delay={5} />
        </div>

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
            marginBottom: 45,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          כל סוג סטודיו.
          {"\n"}
          <GoldText>במקום אחד.</GoldText>
        </h1>

        {/* 2-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            flex: 1,
          }}
        >
          {categories.map((cat, i) => {
            const enter = spring({
              frame: frame - (30 + i * 8),
              fps,
              config: SPRING_SNAPPY,
            });
            return (
              <div
                key={i}
                style={{
                  backgroundColor: DARK_CARD,
                  borderRadius: 18,
                  padding: "24px 18px",
                  border: `1px solid rgba(255,209,102,0.07)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  opacity: enter,
                  transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
                  boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    backgroundColor: `${GOLD}10`,
                    border: `1px solid ${GOLD}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <cat.Icon size={24} color={GOLD} strokeWidth={1.8} />
                </div>
                <div
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 20,
                    fontWeight: 700,
                    color: LIGHT_TEXT,
                  }}
                >
                  {cat.name}
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 14,
                    color: SUBTLE_TEXT,
                  }}
                >
                  {cat.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 30,
            marginBottom: 20,
          }}
        >
          <div style={{ transform: `scale(${ctaEnter})`, opacity: ctaEnter }}>
            <GoldButton text="גלה סטודיואים" delay={0} size="md" />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Footer delay={110} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
