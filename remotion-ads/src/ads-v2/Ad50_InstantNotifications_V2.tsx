import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Bell, MessageSquare, CalendarCheck, CreditCard, Smartphone } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad50_InstantNotifications_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const notifications = [
    { Icon: CalendarCheck, title: "הזמנה חדשה!", desc: "סטודיו A — מחר 14:00", time: "עכשיו", delay: 35 },
    { Icon: CreditCard, title: "תשלום התקבל", desc: "₪350 — יוסי כהן", time: "2 דק׳", delay: 55 },
    { Icon: MessageSquare, title: "הודעה מלקוח", desc: "״אפשר לשנות ל-16:00?״", time: "5 דק׳", delay: 75 },
    { Icon: Bell, title: "תזכורת", desc: "הקלטה מתחילה בעוד שעה", time: "12 דק׳", delay: 95 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 56, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          תמיד מעודכן.{"\n"}<GoldText>בזמן אמת.</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 28px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          התראות חכמות ישירות לנייד
        </p>

        {/* Phone frame with notifications */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 28, padding: "20px 16px",
          border: `2px solid rgba(255,255,255,0.08)`, marginBottom: 20,
          boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 20px ${GOLD}06`,
          position: "relative", overflow: "hidden",
        }}>
          {/* Status bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "0 4px" }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: SUBTLE_TEXT }}>9:41</span>
            <div style={{ display: "flex", gap: 4 }}>
              <Smartphone size={12} color={SUBTLE_TEXT} strokeWidth={2} />
            </div>
          </div>

          {/* Notification stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notifications.map((n, i) => {
              const enter = spring({ frame: frame - n.delay, fps, config: SPRING_BOUNCY });
              return (
                <div key={i} style={{
                  backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "14px 16px",
                  border: i === 0 ? `1px solid ${GOLD}20` : "1px solid rgba(255,255,255,0.06)",
                  opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px) scale(${interpolate(enter, [0, 1], [0.95, 1])})`,
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, backgroundColor: i === 0 ? `${GOLD}15` : "rgba(255,255,255,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <n.Icon size={18} color={i === 0 ? GOLD : SUBTLE_TEXT} strokeWidth={1.8} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontFamily: FONT_HEADING, fontSize: 14, fontWeight: 700, color: LIGHT_TEXT }}>{n.title}</span>
                        <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: SUBTLE_TEXT }}>{n.time}</span>
                      </div>
                      <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT }}>{n.desc}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Badge text="אף הזמנה לא תתפספס" color={SUCCESS} delay={120} Icon={Bell} />
        <div style={{ flex: 1 }} />
        <Footer delay={140} />
      </div>
    </AbsoluteFill>
  );
};
