import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { MessageCircle, Mail, Phone, Clock } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, DARK_CARD_HOVER, LIGHT_TEXT, SUBTLE_TEXT, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad39_Support247_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const messages = [
    { text: "יש לי שאלה על הגדרות", isUser: true, delay: 50 },
    { text: "בטח! אשמח לעזור.\nמה ההגדרה שמעניינת אותך?", isUser: false, delay: 70 },
    { text: "תודה רבה, נפתר!", isUser: true, delay: 95 },
  ];

  const contacts = [
    { Icon: MessageCircle, text: "צ׳אט", delay: 140 },
    { Icon: Mail, text: "אימייל", delay: 150 },
    { Icon: Phone, text: "טלפון", delay: 160 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 58, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 8px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          תמיכה{"\n"}<GoldText>בכל שעה</GoldText>
        </h1>

        {/* 24/7 display */}
        <div style={{
          fontFamily: FONT_MONO, fontSize: 100, fontWeight: 700, color: GOLD,
          textAlign: "center", margin: "16px 0 8px",
          filter: `drop-shadow(0 0 30px ${GOLD}25)`,
          opacity: spring({ frame: frame - 15, fps, config: SPRING_BOUNCY }),
        }}>
          24/7
        </div>

        {/* Chat mockup */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {messages.map((m, i) => {
            const enter = spring({ frame: frame - m.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                alignSelf: m.isUser ? "flex-start" : "flex-end",
                maxWidth: "80%", opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [15, 0])}px)`,
              }}>
                <div style={{
                  backgroundColor: m.isUser ? DARK_CARD : `${GOLD}12`,
                  borderRadius: 16, padding: "14px 18px",
                  border: `1px solid ${m.isUser ? "rgba(255,255,255,0.06)" : `${GOLD}20`}`,
                  borderBottomRight: m.isUser ? "16px" : "4px",
                  borderBottomLeft: m.isUser ? "4px" : "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: LIGHT_TEXT, whiteSpace: "pre-line" }}>{m.text}</span>
                </div>
              </div>
            );
          })}
        </div>

        <Badge text="זמן תגובה ממוצע: 3 דק׳" delay={120} Icon={Clock} />

        <div style={{ height: 20 }} />

        {/* Contact options */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {contacts.map((c, i) => {
            const enter = spring({ frame: frame - c.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 12, padding: "12px 20px",
                border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8,
                opacity: enter, transform: `scale(${enter})`,
              }}>
                <c.Icon size={16} color={GOLD} strokeWidth={1.8} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: LIGHT_TEXT }}>{c.text}</span>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />
        <Footer delay={170} />
      </div>
    </AbsoluteFill>
  );
};
