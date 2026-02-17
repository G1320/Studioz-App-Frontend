import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Repeat, CalendarDays, CreditCard } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad29_RecurringBookings_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });
  const repeatRotation = interpolate(frame, [0, 240], [0, 360]);

  const weeks = [
    { label: "שבוע 1", day: "יום ג׳ 14:00", delay: 40 },
    { label: "שבוע 2", day: "יום ג׳ 14:00", delay: 52 },
    { label: "שבוע 3", day: "יום ג׳ 14:00", delay: 64 },
    { label: "שבוע 4", day: "יום ג׳ 14:00", delay: 76 },
  ];

  const features = [
    { Icon: Repeat, text: "הגדרה חד-פעמית", delay: 110 },
    { Icon: CalendarDays, text: "חזרה שבועית/חודשית", delay: 122 },
    { Icon: CreditCard, text: "חיוב אוטומטי", delay: 134 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 58, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          הזמנות חוזרות{"\n"}<GoldText>בהגדרה אחת</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 24px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          הלקוחות הקבועים שלך — על אוטומט
        </p>

        {/* Repeat icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{
            width: 70, height: 70, borderRadius: "50%", backgroundColor: `${GOLD}12`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 30px ${GOLD}15`,
            transform: `scale(${spring({ frame: frame - 20, fps, config: SPRING_BOUNCY })})`,
          }}>
            <Repeat size={32} color={GOLD} strokeWidth={1.8} style={{ transform: `rotate(${repeatRotation}deg)` }} />
          </div>
        </div>

        {/* Weekly slots */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {weeks.map((w, i) => {
            const enter = spring({ frame: frame - w.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 14, padding: "14px 18px",
                border: `1px solid ${GOLD}10`, display: "flex", alignItems: "center", justifyContent: "space-between",
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [30, 0])}px)`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", backgroundColor: GOLD,
                    boxShadow: `0 0 8px ${GOLD}`,
                  }} />
                  <span style={{ fontFamily: FONT_HEADING, fontSize: 16, fontWeight: 600, color: LIGHT_TEXT }}>{w.label}</span>
                </div>
                <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: SUBTLE_TEXT }}>{w.day}</span>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {features.map((f, i) => {
            const enter = spring({ frame: frame - f.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 12, padding: "12px 16px",
                border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10,
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [20, 0])}px)`,
              }}>
                <f.Icon size={18} color={GOLD} strokeWidth={1.8} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: LIGHT_TEXT }}>{f.text}</span>
              </div>
            );
          })}
        </div>

        <Badge text="40% מההזמנות — חוזרות" color={SUCCESS} delay={150} Icon={Repeat} />
        <div style={{ flex: 1 }} />
        <Footer delay={170} />
      </div>
    </AbsoluteFill>
  );
};
