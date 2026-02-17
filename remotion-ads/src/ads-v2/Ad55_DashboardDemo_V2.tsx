import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { BarChart3, TrendingUp, Calendar, Users, DollarSign, ArrowUpRight } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, ACCENT_BLUE, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad55_DashboardDemo_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const barHeights = [35, 52, 45, 68, 58, 80, 72, 90, 85, 95, 88, 100];
  const kpis = [
    { label: "הכנסות החודש", value: "₪42,350", change: "+18%", color: GOLD, delay: 60 },
    { label: "הזמנות", value: "127", change: "+24%", color: ACCENT_BLUE, delay: 72 },
    { label: "לקוחות חדשים", value: "34", change: "+12%", color: SUCCESS, delay: 84 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 56, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          דשבורד{"\n"}<GoldText>שמספר הכל</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 24px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          כל המספרים במקום אחד
        </p>

        {/* KPI cards */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {kpis.map((k, i) => {
            const enter = spring({ frame: frame - k.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                flex: 1, backgroundColor: DARK_CARD, borderRadius: 16, padding: "18px 14px",
                border: `1px solid ${k.color}12`, opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [15, 0])}px)`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              }}>
                <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: SUBTLE_TEXT, marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 24, fontWeight: 700, color: k.color, marginBottom: 4 }}>{k.value}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <ArrowUpRight size={12} color={SUCCESS} strokeWidth={2.5} />
                  <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: SUCCESS }}>{k.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue chart */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 20, padding: "24px 20px", marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          opacity: spring({ frame: frame - 30, fps, config: SPRING_SMOOTH }),
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BarChart3 size={18} color={GOLD} strokeWidth={1.8} />
              <span style={{ fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 600, color: LIGHT_TEXT }}>הכנסות חודשיות</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <TrendingUp size={14} color={SUCCESS} strokeWidth={2} />
              <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: SUCCESS }}>+18%</span>
            </div>
          </div>

          {/* Bar chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160 }}>
            {barHeights.map((h, i) => {
              const barEnter = interpolate(frame, [40 + i * 3, 55 + i * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={i} style={{
                  flex: 1, height: `${h * barEnter}%`, borderRadius: 4,
                  backgroundColor: i === barHeights.length - 1 ? GOLD : `${GOLD}30`,
                  boxShadow: i === barHeights.length - 1 ? `0 0 12px ${GOLD}25` : "none",
                }} />
              );
            })}
          </div>

          {/* X-axis labels */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 10, color: SUBTLE_TEXT }}>ינו׳</span>
            <span style={{ fontFamily: FONT_BODY, fontSize: 10, color: SUBTLE_TEXT }}>דצמ׳</span>
          </div>
        </div>

        {/* Activity feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {[
            { text: "הזמנה חדשה — סטודיו B", time: "לפני 3 דק׳", delay: 110 },
            { text: "תשלום התקבל — ₪280", time: "לפני 12 דק׳", delay: 120 },
          ].map((a, i) => {
            const enter = spring({ frame: frame - a.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 12, padding: "12px 16px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                border: "1px solid rgba(255,255,255,0.05)",
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [20, 0])}px)`,
              }}>
                <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: LIGHT_TEXT }}>{a.text}</span>
                <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: SUBTLE_TEXT }}>{a.time}</span>
              </div>
            );
          })}
        </div>

        <Badge text="שליטה מלאה בעסק" color={SUCCESS} delay={140} Icon={BarChart3} />
        <div style={{ flex: 1 }} />
        <Footer delay={160} />
      </div>
    </AbsoluteFill>
  );
};
