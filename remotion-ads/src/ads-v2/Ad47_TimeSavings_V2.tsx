import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Clock, Phone, Calculator, CalendarDays, ArrowLeft } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, RED, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad47_TimeSavings_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const savings = [
    { Icon: Phone, text: "שיחות טלפון", saved: "0 שעות", delay: 80 },
    { Icon: Calculator, text: "חשבוניות", saved: "אוטומטי", delay: 92 },
    { Icon: CalendarDays, text: "ניהול יומן", saved: "אוטומטי", delay: 104 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 58, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          חסוך{"\n"}<GoldText>שעות כל שבוע</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 28px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          תן לסטודיוז לעבוד בשבילך
        </p>

        {/* Time comparison */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div style={{
            flex: 1, backgroundColor: DARK_CARD, borderRadius: 20, padding: "28px 20px",
            border: `1px solid ${RED}15`, textAlign: "center",
            opacity: spring({ frame: frame - 25, fps, config: SPRING_SMOOTH }),
            boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
          }}>
            <Clock size={32} color={RED} strokeWidth={1.5} style={{ marginBottom: 12 }} />
            <div style={{ fontFamily: FONT_MONO, fontSize: 52, fontWeight: 700, color: RED, marginBottom: 4 }}>6</div>
            <div style={{ fontFamily: FONT_HEADING, fontSize: 16, fontWeight: 600, color: RED }}>שעות</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT, marginTop: 8 }}>ניהול ידני/יום</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", opacity: interpolate(frame, [50, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <ArrowLeft size={24} color={GOLD} strokeWidth={2} />
          </div>

          <div style={{
            flex: 1, backgroundColor: DARK_CARD, borderRadius: 20, padding: "28px 20px",
            border: `1px solid ${GOLD}20`, textAlign: "center",
            opacity: spring({ frame: frame - 40, fps, config: SPRING_SMOOTH }),
            boxShadow: `0 6px 24px rgba(0,0,0,0.25), 0 0 20px ${GOLD}08`,
          }}>
            <Clock size={32} color={GOLD} strokeWidth={1.5} style={{ marginBottom: 12 }} />
            <div style={{ fontFamily: FONT_MONO, fontSize: 52, fontWeight: 700, color: GOLD, filter: `drop-shadow(0 0 10px ${GOLD}20)` }}>45</div>
            <div style={{ fontFamily: FONT_HEADING, fontSize: 16, fontWeight: 600, color: GOLD }}>דק׳</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT, marginTop: 8 }}>עם סטודיוז/יום</div>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {savings.map((s, i) => {
            const enter = spring({ frame: frame - s.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 14, padding: "14px 18px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                border: "1px solid rgba(255,255,255,0.06)",
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [30, 0])}px)`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <s.Icon size={18} color={GOLD} strokeWidth={1.8} />
                  <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: LIGHT_TEXT }}>{s.text}</span>
                </div>
                <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: SUCCESS, fontWeight: 600 }}>{s.saved}</span>
              </div>
            );
          })}
        </div>

        <Badge text="חיסכון של 25+ שעות בחודש" color={SUCCESS} delay={130} Icon={Clock} />
        <div style={{ flex: 1 }} />
        <Footer delay={150} />
      </div>
    </AbsoluteFill>
  );
};
