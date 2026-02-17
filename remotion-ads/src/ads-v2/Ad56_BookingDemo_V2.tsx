import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { CalendarDays, Clock, Check, ChevronLeft, User, CreditCard } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad56_BookingDemo_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const step1Enter = spring({ frame: frame - 25, fps, config: SPRING_SMOOTH });
  const step2Enter = spring({ frame: frame - 65, fps, config: SPRING_SMOOTH });
  const step3Enter = spring({ frame: frame - 105, fps, config: SPRING_SMOOTH });
  const successEnter = spring({ frame: frame - 145, fps, config: SPRING_BOUNCY });

  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
  const selectedSlot = 3; // 14:00

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 56, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          הזמנה{"\n"}<GoldText>ב-3 צעדים</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 24px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          פשוט, מהיר, אוטומטי
        </p>

        {/* Step 1: Choose date */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 18, padding: "20px 18px", marginBottom: 12,
          border: `1px solid ${step1Enter > 0.5 ? `${GOLD}15` : "rgba(255,255,255,0.06)"}`,
          opacity: step1Enter, transform: `translateX(${interpolate(step1Enter, [0, 1], [30, 0])}px)`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CalendarDays size={14} color={GOLD} strokeWidth={2} />
            </div>
            <span style={{ fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 700, color: LIGHT_TEXT }}>1. בחר תאריך</span>
          </div>
          {/* Mini calendar */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{
                width: 40, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                backgroundColor: i === 3 ? `${GOLD}20` : "rgba(255,255,255,0.04)",
                border: i === 3 ? `1px solid ${GOLD}40` : "none",
              }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: i === 3 ? GOLD : SUBTLE_TEXT }}>{15 + i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Choose time */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 18, padding: "20px 18px", marginBottom: 12,
          border: `1px solid ${step2Enter > 0.5 ? `${GOLD}15` : "rgba(255,255,255,0.06)"}`,
          opacity: step2Enter, transform: `translateX(${interpolate(step2Enter, [0, 1], [30, 0])}px)`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={14} color={GOLD} strokeWidth={2} />
            </div>
            <span style={{ fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 700, color: LIGHT_TEXT }}>2. בחר שעה</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {timeSlots.map((t, i) => (
              <div key={i} style={{
                borderRadius: 8, padding: "8px 14px",
                backgroundColor: i === selectedSlot ? GOLD : "rgba(255,255,255,0.04)",
                border: i === selectedSlot ? "none" : "1px solid rgba(255,255,255,0.06)",
              }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: i === selectedSlot ? DARK_BG : SUBTLE_TEXT, fontWeight: i === selectedSlot ? 700 : 400 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Confirm */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 18, padding: "20px 18px", marginBottom: 16,
          border: `1px solid ${step3Enter > 0.5 ? `${GOLD}15` : "rgba(255,255,255,0.06)"}`,
          opacity: step3Enter, transform: `translateX(${interpolate(step3Enter, [0, 1], [30, 0])}px)`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CreditCard size={14} color={GOLD} strokeWidth={2} />
            </div>
            <span style={{ fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 700, color: LIGHT_TEXT }}>3. אישור ותשלום</span>
          </div>
          <div style={{
            backgroundColor: GOLD, borderRadius: 10, padding: "12px 18px", textAlign: "center",
            transform: `scale(${interpolate(step3Enter, [0.8, 1], [0.95, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
          }}>
            <span style={{ fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 700, color: DARK_BG }}>אשר הזמנה</span>
          </div>
        </div>

        {/* Success state */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          opacity: successEnter, transform: `scale(${successEnter})`,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, backgroundColor: `${SUCCESS}15`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Check size={22} color={SUCCESS} strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 700, color: SUCCESS }}>ההזמנה אושרה!</span>
        </div>

        <div style={{ flex: 1 }} />
        <Footer delay={170} />
      </div>
    </AbsoluteFill>
  );
};
