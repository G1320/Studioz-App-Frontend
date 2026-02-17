import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { RefreshCw, Eye, Lock, Zap, Calendar } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_GENTLE,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad16_CalendarSync_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });
  const calEnter = spring({ frame: frame - 25, fps, config: SPRING_GENTLE });
  const syncRotation = interpolate(frame, [0, 240], [0, 720]);

  const days = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
  const slots = [
    [0, 1, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 1, 1, 0],
    [1, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0],
  ]; // 1 = booked, 0 = available

  const integrations = [
    { name: "Google Calendar", delay: 100 },
    { name: "Apple Calendar", delay: 112 },
    { name: "Outlook", delay: 124 },
  ];

  const features = [
    { Icon: Eye, text: "הלקוחות רואים מה פנוי", delay: 140 },
    { Icon: RefreshCw, text: "מתעדכן אוטומטית", delay: 150 },
    { Icon: Lock, text: "חסום שעות ידנית", delay: 160 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.08} />

      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{
          fontFamily: FONT_HEADING, fontSize: 60, fontWeight: 700, color: LIGHT_TEXT,
          margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter,
          transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
        }}>
          יומן אחד.{"\n"}<GoldText>הכל מסונכרן.</GoldText>
        </h1>

        <p style={{
          fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 24px",
          opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          סנכרון אוטומטי עם כל היומנים שלך
        </p>

        {/* Calendar grid */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 18, padding: "20px 16px",
          border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16,
          boxShadow: "0 6px 28px rgba(0,0,0,0.25)", opacity: calEnter,
          transform: `scale(${interpolate(calEnter, [0, 1], [0.95, 1])})`,
        }}>
          {/* Day headers */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {days.map((d, i) => (
              <div key={i} style={{
                flex: 1, textAlign: "center", fontFamily: FONT_HEADING,
                fontSize: 13, fontWeight: 600, color: SUBTLE_TEXT,
              }}>{d}</div>
            ))}
          </div>
          {/* Time slots */}
          {slots.map((row, ri) => (
            <div key={ri} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              {row.map((booked, ci) => {
                const slotEnter = spring({ frame: frame - 35 - (ri * 7 + ci) * 2, fps, config: SPRING_SMOOTH });
                return (
                  <div key={ci} style={{
                    flex: 1, height: 36, borderRadius: 8,
                    backgroundColor: booked ? `${GOLD}20` : `rgba(255,255,255,0.04)`,
                    border: `1px solid ${booked ? `${GOLD}30` : "rgba(255,255,255,0.06)"}`,
                    opacity: slotEnter, transform: `scale(${slotEnter})`,
                  }} />
                );
              })}
            </div>
          ))}

          {/* Sync indicator */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <RefreshCw size={16} color={SUCCESS} strokeWidth={2} style={{ transform: `rotate(${syncRotation}deg)` }} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUCCESS, fontWeight: 500 }}>מסונכרן</span>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: SUCCESS, boxShadow: `0 0 8px ${SUCCESS}` }} />
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, justifyContent: "center" }}>
          {integrations.map((int, i) => {
            const enter = spring({ frame: frame - int.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 10, padding: "10px 16px",
                border: "1px solid rgba(255,255,255,0.06)", opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [10, 0])}px)`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Calendar size={14} color={GOLD} strokeWidth={1.8} />
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: LIGHT_TEXT }}>{int.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {features.map((f, i) => {
            const enter = spring({ frame: frame - f.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, opacity: enter,
                transform: `translateX(${interpolate(enter, [0, 1], [25, 0])}px)`,
              }}>
                <f.Icon size={16} color={GOLD} strokeWidth={2} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: LIGHT_TEXT }}>{f.text}</span>
              </div>
            );
          })}
        </div>

        <Badge text="סנכרון בזמן אמת" color={SUCCESS} delay={170} Icon={Zap} />

        <div style={{ flex: 1 }} />
        <Footer delay={180} />
      </div>
    </AbsoluteFill>
  );
};
