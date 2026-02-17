import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ListOrdered, Bell, RefreshCw, Clock, UserCircle } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, RED, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, GoldText,
} from "./shared";

export const Ad28_WaitlistFeature_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const queuePeople = [
    { name: "דנה לוי", num: 1, delay: 60 },
    { name: "אורי כהן", num: 2, delay: 72 },
    { name: "נועם שמש", num: 3, delay: 84 },
  ];

  const features = [
    { Icon: ListOrdered, text: "רשימת המתנה אוטומטית", delay: 130 },
    { Icon: Bell, text: "התראה בפינוי מקום", delay: 142 },
    { Icon: RefreshCw, text: "עדכון בזמן אמת", delay: 154 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 60, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          תור ממתינים?{"\n"}<GoldText>אוטומטי.</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 28px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          לא מפספסים אף לקוח
        </p>

        {/* Booked slot card */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 16, padding: "18px 20px", marginBottom: 12,
          border: `1px solid ${RED}20`, boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
          opacity: spring({ frame: frame - 25, fps, config: SPRING_SMOOTH }),
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 700, color: LIGHT_TEXT }}>סטודיו A — יום שלישי 14:00</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: SUBTLE_TEXT }}>הקלטה — 3 שעות</div>
            </div>
            <div style={{ backgroundColor: `${RED}20`, borderRadius: 8, padding: "6px 14px" }}>
              <span style={{ fontFamily: FONT_HEADING, fontSize: 13, fontWeight: 700, color: RED }}>תפוס</span>
            </div>
          </div>
        </div>

        {/* Queue */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {queuePeople.map((p, i) => {
            const enter = spring({ frame: frame - p.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 14, padding: "14px 18px",
                border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12,
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [30, 0])}px)`,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", backgroundColor: `${GOLD}12`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700, color: GOLD,
                }}>{p.num}</div>
                <UserCircle size={20} color={SUBTLE_TEXT} strokeWidth={1.5} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: LIGHT_TEXT, flex: 1 }}>{p.name}</span>
                <Clock size={14} color={SUBTLE_TEXT} strokeWidth={2} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT }}>ממתין</span>
              </div>
            );
          })}
        </div>

        {/* Notification animation */}
        <div style={{
          backgroundColor: `${SUCCESS}12`, borderRadius: 14, padding: "14px 20px",
          border: `1px solid ${SUCCESS}25`, display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
          opacity: interpolate(frame, [100, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [100, 115], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}>
          <Bell size={18} color={SUCCESS} strokeWidth={2} />
          <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: SUCCESS }}>דנה לוי קיבלה התראה — מקום התפנה!</span>
        </div>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {features.map((f, i) => {
            const enter = spring({ frame: frame - f.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [20, 0])}px)` }}>
                <f.Icon size={16} color={GOLD} strokeWidth={2} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: LIGHT_TEXT }}>{f.text}</span>
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
