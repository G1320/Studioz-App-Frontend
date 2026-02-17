import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Bell, CreditCard, AlertTriangle, Clock } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RED, ACCENT_BLUE, RTL,
  FONT_HEADING, FONT_BODY, SPRING_SMOOTH,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, GoldText,
} from "./shared";

export const Ad31_SmartNotifications_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const notifications = [
    { Icon: Bell, text: "הזמנה חדשה — סטודיו A, מחר 14:00", time: "לפני 2 דק׳", color: GOLD, delay: 35 },
    { Icon: CreditCard, text: "תשלום התקבל — ₪350", time: "לפני 8 דק׳", color: SUCCESS, delay: 50 },
    { Icon: AlertTriangle, text: "ביטול — דנה לוי, יום שלישי", time: "לפני 15 דק׳", color: RED, delay: 65 },
    { Icon: Clock, text: "תזכורת — הזמנה בעוד שעה", time: "לפני 30 דק׳", color: ACCENT_BLUE, delay: 80 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 58, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          התראות חכמות.{"\n"}<GoldText>תמיד בשליטה.</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 28px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          כל מה שקורה — ישר אליך
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {notifications.map((n, i) => {
            const enter = spring({ frame: frame - n.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 16, padding: "18px 20px",
                borderRight: `3px solid ${n.color}`, display: "flex", alignItems: "center", gap: 14,
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)`,
                boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, backgroundColor: `${n.color}12`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <n.Icon size={22} color={n.color} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: LIGHT_TEXT, fontWeight: 500, marginBottom: 3 }}>{n.text}</div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: SUBTLE_TEXT }}>{n.time}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
          opacity: interpolate(frame, [110, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <Bell size={14} color={SUBTLE_TEXT} strokeWidth={2} />
          <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: SUBTLE_TEXT }}>בזמן אמת, לנייד ולמייל</span>
        </div>

        <div style={{ flex: 1 }} />
        <Footer delay={130} />
      </div>
    </AbsoluteFill>
  );
};
