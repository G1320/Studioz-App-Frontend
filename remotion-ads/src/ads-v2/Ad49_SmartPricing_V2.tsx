import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { DollarSign, TrendingUp, Zap, Clock, SlidersHorizontal } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad49_SmartPricing_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const strategies = [
    { label: "שעות שיא", price: "₪180", boost: "+35%", delay: 70 },
    { label: "ימי חול", price: "₪120", boost: "בסיס", delay: 82 },
    { label: "מבצע לילה", price: "₪85", boost: "-30%", delay: 94 },
  ];

  const sliderProgress = interpolate(frame, [30, 90], [0.3, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 56, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          תמחור חכם.{"\n"}<GoldText>רווח מקסימלי.</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 28px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          מחירים דינמיים שעובדים בשבילך
        </p>

        {/* Pricing slider mockup */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 20, padding: "24px 22px", marginBottom: 20,
          border: `1px solid ${GOLD}12`, boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          opacity: spring({ frame: frame - 20, fps, config: SPRING_SMOOTH }),
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <SlidersHorizontal size={18} color={GOLD} strokeWidth={1.8} />
            <span style={{ fontFamily: FONT_HEADING, fontSize: 16, fontWeight: 600, color: LIGHT_TEXT }}>התאמת מחיר אוטומטית</span>
          </div>
          {/* Slider track */}
          <div style={{ position: "relative", height: 8, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 12 }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${sliderProgress * 100}%`, backgroundColor: GOLD, borderRadius: 4, boxShadow: `0 0 12px ${GOLD}30` }} />
            <div style={{
              position: "absolute", left: `${sliderProgress * 100}%`, top: "50%", transform: "translate(-50%, -50%)",
              width: 22, height: 22, borderRadius: "50%", backgroundColor: GOLD, border: `3px solid ${DARK_BG}`,
              boxShadow: `0 0 10px ${GOLD}40`,
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: SUBTLE_TEXT }}>נמוך</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 24, fontWeight: 700, color: GOLD }}>₪{Math.round(80 + sliderProgress * 120)}</span>
            <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: SUBTLE_TEXT }}>גבוה</span>
          </div>
        </div>

        {/* Strategy cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {strategies.map((s, i) => {
            const enter = spring({ frame: frame - s.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 14, padding: "16px 18px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                border: "1px solid rgba(255,255,255,0.06)",
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [30, 0])}px)`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Clock size={16} color={GOLD} strokeWidth={1.8} />
                  <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: LIGHT_TEXT }}>{s.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: GOLD }}>{s.price}</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: s.boost.includes("+") ? SUCCESS : SUBTLE_TEXT }}>{s.boost}</span>
                </div>
              </div>
            );
          })}
        </div>

        <Badge text="הגדל הכנסות ב-25%" color={SUCCESS} delay={120} Icon={TrendingUp} />
        <div style={{ flex: 1 }} />
        <Footer delay={140} />
      </div>
    </AbsoluteFill>
  );
};
