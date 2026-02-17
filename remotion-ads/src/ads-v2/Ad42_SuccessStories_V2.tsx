import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Music, MapPin, ArrowLeft, Quote } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RED, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, SectionLabel, GoldText,
} from "./shared";

export const Ad42_SuccessStories_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beforeMetrics = [
    { label: "הזמנות/חודש", value: "52", delay: 50 },
    { label: "הכנסה", value: "₪8,200", delay: 60 },
    { label: "ניהול/יום", value: "6 שעות", delay: 70 },
  ];

  const afterMetrics = [
    { label: "הזמנות/חודש", value: "127", delay: 100 },
    { label: "הכנסה", value: "₪18,400", delay: 110 },
    { label: "ניהול/יום", value: "45 דק׳", delay: 120 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <SectionLabel text="סיפור הצלחה" delay={0} />
        <div style={{ height: 16 }} />

        {/* Profile */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14, marginBottom: 24,
          opacity: spring({ frame: frame - 10, fps, config: SPRING_SMOOTH }),
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: `${GOLD}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Music size={26} color={GOLD} strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: LIGHT_TEXT }}>אולפני הקלטה — אורי כהן</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={12} color={SUBTLE_TEXT} strokeWidth={2} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: SUBTLE_TEXT }}>תל אביב</span>
            </div>
          </div>
        </div>

        {/* Before/After comparison */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {/* Before */}
          <div style={{ flex: 1, backgroundColor: DARK_CARD, borderRadius: 16, padding: "18px 16px", border: `1px solid ${RED}15` }}>
            <div style={{ fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 700, color: RED, marginBottom: 14 }}>לפני</div>
            {beforeMetrics.map((m, i) => {
              const enter = spring({ frame: frame - m.delay, fps, config: SPRING_SMOOTH });
              return (
                <div key={i} style={{ marginBottom: 12, opacity: enter }}>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: SUBTLE_TEXT, marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 24, fontWeight: 700, color: LIGHT_TEXT }}>{m.value}</div>
                </div>
              );
            })}
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", alignItems: "center", opacity: interpolate(frame, [80, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <ArrowLeft size={24} color={GOLD} strokeWidth={2} />
          </div>

          {/* After */}
          <div style={{ flex: 1, backgroundColor: DARK_CARD, borderRadius: 16, padding: "18px 16px", border: `1px solid ${GOLD}20` }}>
            <div style={{ fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 700, color: GOLD, marginBottom: 14 }}>אחרי</div>
            {afterMetrics.map((m, i) => {
              const enter = spring({ frame: frame - m.delay, fps, config: SPRING_SMOOTH });
              return (
                <div key={i} style={{ marginBottom: 12, opacity: enter }}>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: SUBTLE_TEXT, marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 24, fontWeight: 700, color: GOLD, filter: `drop-shadow(0 0 8px ${GOLD}15)` }}>{m.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quote */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 16, padding: "20px 22px",
          borderRight: `3px solid ${GOLD}`, marginBottom: 16,
          opacity: spring({ frame: frame - 140, fps, config: SPRING_SMOOTH }),
        }}>
          <Quote size={18} color={GOLD} strokeWidth={1.5} style={{ marginBottom: 8, opacity: 0.5 }} />
          <p style={{ fontFamily: FONT_BODY, fontSize: 18, color: LIGHT_TEXT, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            סטודיוז שינה לי את העסק
          </p>
        </div>

        <div style={{ flex: 1 }} />
        <Footer delay={160} />
      </div>
    </AbsoluteFill>
  );
};
