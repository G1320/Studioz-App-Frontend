import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Check, X } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RED, RTL,
  FONT_HEADING, FONT_BODY, SPRING_SMOOTH,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad44_StudioComparison2_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const rows = [
    { feature: "הזמנות אוטומטיות", delay: 35 },
    { feature: "סליקה מובנית", delay: 47 },
    { feature: "הגנה מביטולים", delay: 59 },
    { feature: "עמוד סטודיו", delay: 71 },
    { feature: "תמיכה בעברית", delay: 83 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 56, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          למה סטודיוז?{"\n"}<GoldText>ההשוואה מדברת.</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 28px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          ההבדל ברור
        </p>

        {/* Table */}
        <div style={{ backgroundColor: DARK_CARD, borderRadius: 18, overflow: "hidden", marginBottom: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          {/* Header */}
          <div style={{ display: "flex", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ flex: 2, fontFamily: FONT_HEADING, fontSize: 14, fontWeight: 600, color: SUBTLE_TEXT }}>תכונה</div>
            <div style={{ flex: 1, textAlign: "center", fontFamily: FONT_HEADING, fontSize: 14, fontWeight: 700, color: GOLD }}>סטודיוז</div>
            <div style={{ flex: 1, textAlign: "center", fontFamily: FONT_HEADING, fontSize: 14, fontWeight: 600, color: SUBTLE_TEXT }}>אחרים</div>
          </div>

          {rows.map((r, i) => {
            const enter = spring({ frame: frame - r.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                display: "flex", padding: "16px 20px", alignItems: "center",
                borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [30, 0])}px)`,
              }}>
                <div style={{ flex: 2, fontFamily: FONT_BODY, fontSize: 16, color: LIGHT_TEXT }}>{r.feature}</div>
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, backgroundColor: `${SUCCESS}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Check size={18} color={SUCCESS} strokeWidth={2.5} />
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, backgroundColor: `${RED}12`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <X size={18} color={RED} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Badge text="הבחירה הברורה" color={GOLD} delay={110} Icon={Check} />

        <div style={{ flex: 1 }} />
        <Footer delay={130} />
      </div>
    </AbsoluteFill>
  );
};
