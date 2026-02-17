import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Building2, CalendarCheck, MapPin, Star, TrendingUp } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad43_PlatformStats_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const stats = [
    { Icon: Building2, value: "500+", label: "סטודיואים פעילים", delay: 25 },
    { Icon: CalendarCheck, value: "10K+", label: "הזמנות בוצעו", delay: 38 },
    { Icon: MapPin, value: "15+", label: "ערים בישראל", delay: 51 },
    { Icon: Star, value: "4.9", label: "דירוג ממוצע", delay: 64 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.1} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px", alignItems: "center" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 60, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, textAlign: "center", opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          המספרים של{"\n"}<GoldText>סטודיוז</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 32px", textAlign: "center", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          פלטפורמה שגדלה כל יום
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, width: "100%", marginBottom: 28 }}>
          {stats.map((s, i) => {
            const enter = spring({ frame: frame - s.delay, fps, config: SPRING_BOUNCY });
            return (
              <div key={i} style={{
                width: "calc(50% - 7px)", backgroundColor: DARK_CARD, borderRadius: 20, padding: "32px 20px",
                textAlign: "center", border: `1px solid rgba(255,209,102,0.08)`,
                transform: `scale(${enter})`, opacity: enter,
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, backgroundColor: `${GOLD}10`,
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
                }}>
                  <s.Icon size={26} color={GOLD} strokeWidth={1.8} />
                </div>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 48, fontWeight: 700, color: GOLD, marginBottom: 6,
                  filter: `drop-shadow(0 0 12px ${GOLD}20)`,
                }}>{s.value}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: SUBTLE_TEXT }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        <Badge text="והמספרים עולים כל יום" color={SUCCESS} delay={90} Icon={TrendingUp} />

        <div style={{ flex: 1 }} />
        <Footer delay={110} />
      </div>
    </AbsoluteFill>
  );
};
