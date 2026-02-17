import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { FileText, Zap, Mail, Archive, Check } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_GENTLE,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad22_InvoiceGenerator_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const lineItems = [
    { service: "הקלטה — סטודיו A", hours: "3 שעות", price: "₪450", delay: 50 },
    { service: "מיקס — סטודיו B", hours: "2 שעות", price: "₪300", delay: 65 },
    { service: "מאסטרינג", hours: "1 שעה", price: "₪200", delay: 80 },
  ];

  const features = [
    { Icon: Zap, text: "יוצאת אוטומטית", delay: 130 },
    { Icon: Mail, text: "נשלחת ללקוח", delay: 142 },
    { Icon: Archive, text: "נשמרת בענן", delay: 154 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />

      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{
          fontFamily: FONT_HEADING, fontSize: 60, fontWeight: 700, color: LIGHT_TEXT,
          margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter,
          transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
        }}>
          חשבוניות?{"\n"}<GoldText>אוטומטי לגמרי.</GoldText>
        </h1>

        <p style={{
          fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 24px",
          opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          חשבונית מס נוצרת ונשלחת לבד
        </p>

        {/* Invoice mockup */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 18, padding: "24px", marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          opacity: spring({ frame: frame - 20, fps, config: SPRING_GENTLE }),
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FileText size={22} color={GOLD} strokeWidth={1.8} />
              <span style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: LIGHT_TEXT }}>
                חשבונית מס / קבלה
              </span>
            </div>
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: SUBTLE_TEXT }}>#1042</span>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, padding: "0 4px" }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT, flex: 2 }}>שירות</span>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT, flex: 1, textAlign: "center" }}>כמות</span>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT, flex: 1, textAlign: "left" }}>מחיר</span>
            </div>

            {lineItems.map((item, i) => {
              const enter = spring({ frame: frame - item.delay, fps, config: SPRING_SMOOTH });
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  backgroundColor: `rgba(255,255,255,0.03)`, borderRadius: 10, padding: "12px 12px",
                  marginBottom: 6, opacity: enter,
                  transform: `translateX(${interpolate(enter, [0, 1], [30, 0])}px)`,
                }}>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: LIGHT_TEXT, flex: 2 }}>{item.service}</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: SUBTLE_TEXT, flex: 1, textAlign: "center" }}>{item.hours}</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 15, color: LIGHT_TEXT, flex: 1, textAlign: "left", fontWeight: 600 }}>{item.price}</span>
                </div>
              );
            })}

            {/* Total */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              borderTop: `2px solid ${GOLD}30`, marginTop: 12, paddingTop: 14,
              opacity: spring({ frame: frame - 95, fps, config: SPRING_SMOOTH }),
            }}>
              <span style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 700, color: LIGHT_TEXT }}>סה״כ</span>
              <span style={{
                fontFamily: FONT_MONO, fontSize: 28, fontWeight: 700, color: GOLD,
                filter: `drop-shadow(0 0 10px ${GOLD}20)`,
              }}>₪950</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {features.map((f, i) => {
            const enter = spring({ frame: frame - f.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 12, padding: "12px 16px",
                border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8,
                opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [10, 0])}px)`,
              }}>
                <f.Icon size={16} color={GOLD} strokeWidth={1.8} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: LIGHT_TEXT }}>{f.text}</span>
              </div>
            );
          })}
        </div>

        <Badge text="עומד בדרישות מס הכנסה" color={SUCCESS} delay={170} Icon={Check} />

        <div style={{ flex: 1 }} />
        <Footer delay={180} />
      </div>
    </AbsoluteFill>
  );
};
