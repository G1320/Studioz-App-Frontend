import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Clock, DollarSign, ArrowDown, Zap, TrendingUp } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RED, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad52_TimeIsMoney_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const calculations = [
    { label: "שעות ניהול ידני/חודש", value: "120", unit: "שעות", color: RED, delay: 40 },
    { label: "עלות שעת עבודה", value: "₪80", unit: "", color: SUBTLE_TEXT, delay: 52 },
    { label: "עלות חודשית של ניהול ידני", value: "₪9,600", unit: "", color: RED, delay: 64 },
  ];

  const savingsEnter = spring({ frame: frame - 90, fps, config: SPRING_SMOOTH });
  const counterValue = Math.round(interpolate(frame, [90, 140], [0, 8750], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 56, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          זמן = כסף.{"\n"}<GoldText>חסוך את שניהם.</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 28px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          החישוב פשוט
        </p>

        {/* Calculation rows */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 20, padding: "24px 20px", marginBottom: 16,
          border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}>
          {calculations.map((c, i) => {
            const enter = spring({ frame: frame - c.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 0",
                borderBottom: i < calculations.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [25, 0])}px)`,
              }}>
                <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: SUBTLE_TEXT }}>{c.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: 700, color: c.color }}>{c.value}</span>
                  {c.unit && <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT }}>{c.unit}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrow */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, opacity: interpolate(frame, [75, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <ArrowDown size={28} color={GOLD} strokeWidth={2} />
        </div>

        {/* Savings result */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 20, padding: "28px 24px", marginBottom: 24,
          border: `1px solid ${GOLD}15`, textAlign: "center",
          boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 24px ${GOLD}08`,
          opacity: savingsEnter, transform: `scale(${interpolate(savingsEnter, [0, 1], [0.9, 1])})`,
        }}>
          <div style={{ fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 600, color: GOLD, marginBottom: 10 }}>חיסכון חודשי עם סטודיוז</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 56, fontWeight: 700, color: GOLD, filter: `drop-shadow(0 0 14px ${GOLD}25)`, marginBottom: 6 }}>
            ₪{counterValue.toLocaleString()}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}>
            <TrendingUp size={16} color={SUCCESS} strokeWidth={2} />
            <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: SUCCESS }}>91% חיסכון</span>
          </div>
        </div>

        <Badge text="ROI חיובי מהחודש הראשון" color={SUCCESS} delay={150} Icon={Zap} />
        <div style={{ flex: 1 }} />
        <Footer delay={170} />
      </div>
    </AbsoluteFill>
  );
};
