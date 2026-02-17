import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { CalendarDays, Wallet, RefreshCw, TrendingUp } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, SectionLabel, Badge, GoldText,
} from "./shared";

export const Ad24_StudioAnalytics_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headEnter = spring({ frame: frame - 8, fps, config: SPRING_SMOOTH });

  const metrics = [
    { Icon: CalendarDays, value: "127", label: "הזמנות", delay: 30 },
    { Icon: Wallet, value: "₪18,400", label: "הכנסות", delay: 40 },
    { Icon: RefreshCw, value: "89%", label: "שימור", delay: 50 },
  ];

  const barData = [35, 42, 38, 55, 62, 58, 70, 78, 72, 85, 92, 100];
  const maxBar = Math.max(...barData);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />

      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <SectionLabel text="אנליטיקס" delay={0} />

        <h1 style={{
          fontFamily: FONT_HEADING, fontSize: 58, fontWeight: 700, color: LIGHT_TEXT,
          margin: "12px 0 10px", lineHeight: 1.18, opacity: headEnter,
          transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
        }}>
          הנתונים שלך.{"\n"}<GoldText>בזמן אמת.</GoldText>
        </h1>

        <p style={{
          fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 24px",
          opacity: interpolate(frame, [18, 33], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          דשבורד ניהולי חכם שעובד בשבילך
        </p>

        {/* Metric cards */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {metrics.map((m, i) => {
            const enter = spring({ frame: frame - m.delay, fps, config: SPRING_BOUNCY });
            return (
              <div key={i} style={{
                flex: 1, backgroundColor: DARK_CARD, borderRadius: 16, padding: "20px 14px",
                textAlign: "center", border: "1px solid rgba(255,209,102,0.08)",
                transform: `scale(${enter})`, opacity: enter,
                boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
              }}>
                <m.Icon size={20} color={GOLD} strokeWidth={1.8} style={{ marginBottom: 8 }} />
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 32, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 4,
                  filter: m.value.includes("₪") ? `drop-shadow(0 0 8px ${GOLD}15)` : "none",
                }}>{m.value}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT }}>{m.label}</div>
              </div>
            );
          })}
        </div>

        {/* Bar chart */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 16, padding: "20px 18px 14px",
          border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16,
          boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
          opacity: spring({ frame: frame - 60, fps, config: SPRING_SMOOTH }),
        }}>
          <div style={{ fontFamily: FONT_HEADING, fontSize: 16, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 14 }}>
            הכנסות חודשיות
          </div>
          <svg width="100%" height="120" viewBox="0 0 984 120" preserveAspectRatio="none">
            {barData.map((h, i) => {
              const barW = 984 / barData.length - 8;
              const barEnter = spring({ frame: frame - 70 - i * 3, fps, config: SPRING_SMOOTH });
              const barH = (h / maxBar) * 100 * barEnter;
              const x = i * (984 / barData.length) + 4;
              const fill = i >= 10 ? GOLD : i >= 8 ? `${GOLD}80` : `${GOLD}30`;
              return (
                <rect key={i} x={x} y={120 - barH} width={barW} height={barH} rx={4} fill={fill} />
              );
            })}
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, padding: "0 4px" }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: SUBTLE_TEXT }}>ינו׳</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: SUBTLE_TEXT }}>דצמ׳</span>
          </div>
        </div>

        <Badge text="+31% הכנסות החודש" color={SUCCESS} delay={120} Icon={TrendingUp} />

        <div style={{ flex: 1 }} />
        <Footer delay={140} />
      </div>
    </AbsoluteFill>
  );
};
