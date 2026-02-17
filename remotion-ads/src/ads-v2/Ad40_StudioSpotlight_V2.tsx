import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Music, MapPin, Star, CalendarDays, Users, TrendingUp } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, GoldButton, Footer, SectionLabel, GoldText,
} from "./shared";

export const Ad40_StudioSpotlight_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardEnter = spring({ frame: frame - 10, fps, config: SPRING_BOUNCY });

  const stats = [
    { Icon: CalendarDays, value: "342", label: "הזמנות", delay: 70 },
    { Icon: Users, value: "89", label: "לקוחות", delay: 82 },
    { Icon: TrendingUp, value: "+45%", label: "צמיחה", delay: 94 },
  ];

  const services = ["הקלטה", "מיקס", "מאסטרינג"];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.1} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <SectionLabel text="סטודיו מומלץ" delay={0} />
        <div style={{ height: 16 }} />

        {/* Profile card */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 22, padding: "32px 28px",
          border: `1px solid ${GOLD}15`, marginBottom: 20,
          boxShadow: `0 8px 40px rgba(0,0,0,0.35), 0 0 30px ${GOLD}08`,
          transform: `scale(${cardEnter})`, opacity: cardEnter,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
            <div style={{
              width: 70, height: 70, borderRadius: 20, backgroundColor: `${GOLD}12`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 20px ${GOLD}15`,
            }}>
              <Music size={32} color={GOLD} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 4 }}>אולפני גולד</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={14} color={SUBTLE_TEXT} strokeWidth={2} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: SUBTLE_TEXT }}>תל אביב</span>
              </div>
            </div>
            <div style={{ marginRight: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <Star size={18} color={GOLD} fill={GOLD} strokeWidth={0} />
              <span style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: 700, color: GOLD }}>4.9</span>
            </div>
          </div>

          {/* Services */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {services.map((s, i) => (
              <div key={i} style={{
                backgroundColor: `${GOLD}10`, borderRadius: 8, padding: "8px 16px",
                border: `1px solid ${GOLD}18`,
              }}>
                <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: GOLD, fontWeight: 500 }}>{s}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 12 }}>
            {stats.map((s, i) => {
              const enter = spring({ frame: frame - s.delay, fps, config: SPRING_SMOOTH });
              return (
                <div key={i} style={{
                  flex: 1, backgroundColor: DARK_BG, borderRadius: 14, padding: "16px 12px",
                  textAlign: "center", opacity: enter, transform: `scale(${enter})`,
                }}>
                  <s.Icon size={18} color={i === 2 ? SUCCESS : GOLD} strokeWidth={1.8} style={{ marginBottom: 6 }} />
                  <div style={{ fontFamily: FONT_MONO, fontSize: 24, fontWeight: 700, color: i === 2 ? SUCCESS : LIGHT_TEXT, marginBottom: 2 }}>{s.value}</div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: SUBTLE_TEXT }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <GoldButton text="צור סטודיו כזה" delay={110} size="md" />

        <div style={{ flex: 1 }} />
        <Footer delay={130} />
      </div>
    </AbsoluteFill>
  );
};
