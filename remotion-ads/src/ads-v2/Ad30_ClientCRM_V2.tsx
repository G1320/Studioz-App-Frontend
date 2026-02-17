import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { UserCircle, Search, Filter, Star } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, GoldText,
} from "./shared";

export const Ad30_ClientCRM_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const clients = [
    { name: "אורי כהן", visits: 12, room: "סטודיו A", spending: "₪4,200", delay: 35 },
    { name: "דנה לוי", visits: 8, room: "סטודיו B", spending: "₪2,800", delay: 50 },
    { name: "יוסי מזרחי", visits: 15, room: "סטודיו C", spending: "₪5,100", delay: 65 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 60, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          הכר את{"\n"}<GoldText>הלקוחות שלך</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 28px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          מערכת ניהול לקוחות חכמה
        </p>

        {/* Client cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {clients.map((c, i) => {
            const enter = spring({ frame: frame - c.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 16, padding: "20px 20px",
                border: "1px solid rgba(255,209,102,0.07)", display: "flex", alignItems: "center", gap: 16,
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)`,
                boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, backgroundColor: `${GOLD}10`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <UserCircle size={28} color={GOLD} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT }}>{c.visits} ביקורים</span>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT }}>{c.room}</span>
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, color: GOLD, filter: `drop-shadow(0 0 8px ${GOLD}15)` }}>{c.spending}</div>
                  <div style={{ display: "flex", gap: 2, justifyContent: "flex-end", marginTop: 4 }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={10} color={GOLD} fill={GOLD} strokeWidth={0} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature badges */}
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { Icon: Search, text: "חיפוש מתקדם", delay: 100 },
            { Icon: Filter, text: "סינון וסגמנטציה", delay: 112 },
          ].map((f, i) => {
            const enter = spring({ frame: frame - f.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 12, padding: "12px 18px",
                border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8,
                opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [10, 0])}px)`,
              }}>
                <f.Icon size={16} color={GOLD} strokeWidth={1.8} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: LIGHT_TEXT }}>{f.text}</span>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />
        <Footer delay={130} />
      </div>
    </AbsoluteFill>
  );
};
