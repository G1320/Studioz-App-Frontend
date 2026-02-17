import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Rocket, Star, Zap, ArrowLeft, Shield, Clock } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, GoldText, GoldButton,
} from "./shared";

export const Ad53_FinalCTA_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const stats = [
    { value: "500+", label: "סטודיואים", delay: 30 },
    { value: "50K+", label: "הזמנות", delay: 42 },
    { value: "4.9", label: "דירוג", delay: 54 },
  ];

  const benefits = [
    { Icon: Zap, text: "הקמה ב-5 דקות", delay: 80 },
    { Icon: Shield, text: "ללא עמלות נסתרות", delay: 92 },
    { Icon: Clock, text: "תמיכה 24/7", delay: 104 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="30%" size={600} opacity={0.1} />
      <RadialGlow x="30%" y="70%" size={400} opacity={0.05} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", padding: "52px 48px 42px" }}>
        {/* Rapid stats */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28, width: "100%" }}>
          {stats.map((s, i) => {
            const enter = spring({ frame: frame - s.delay, fps, config: SPRING_BOUNCY });
            return (
              <div key={i} style={{
                flex: 1, backgroundColor: DARK_CARD, borderRadius: 16, padding: "20px 14px", textAlign: "center",
                border: `1px solid ${GOLD}10`, opacity: enter, transform: `scale(${enter})`,
                boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
              }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 32, fontWeight: 700, color: GOLD, filter: `drop-shadow(0 0 8px ${GOLD}20)` }}>{s.value}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT, marginTop: 4 }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        <h1 style={{
          fontFamily: FONT_HEADING, fontSize: 60, fontWeight: 700, color: LIGHT_TEXT,
          margin: "0 0 12px", lineHeight: 1.15, textAlign: "center",
          opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
        }}>
          הגיע הזמן{"\n"}<GoldText>לשדרג את הסטודיו</GoldText>
        </h1>
        <p style={{
          fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 30px", textAlign: "center",
          opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          הצטרף לאלפי בעלי סטודיואים שכבר בפנים
        </p>

        {/* Benefits */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, width: "100%" }}>
          {benefits.map((b, i) => {
            const enter = spring({ frame: frame - b.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [20, 0])}px)`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, backgroundColor: `${SUCCESS}12`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <b.Icon size={18} color={SUCCESS} strokeWidth={2} />
                </div>
                <span style={{ fontFamily: FONT_BODY, fontSize: 18, color: LIGHT_TEXT }}>{b.text}</span>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <GoldButton text="התחל עכשיו — חינם" delay={125} size="lg" />

        <div style={{ flex: 1 }} />
        <Footer delay={150} />
      </div>
    </AbsoluteFill>
  );
};
