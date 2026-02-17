import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Bell, CalendarDays, BarChart3, Download, Smartphone } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, GoldText,
} from "./shared";

export const Ad45_MobileApp_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });
  const phoneEnter = spring({ frame: frame - 20, fps, config: SPRING_BOUNCY });

  const features = [
    { Icon: Bell, text: "התראות בזמן אמת", delay: 100 },
    { Icon: CalendarDays, text: "יומן בנייד", delay: 112 },
    { Icon: BarChart3, text: "נתונים בקצות האצבעות", delay: 124 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="45%" size={600} opacity={0.1} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 60, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, textAlign: "center", opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          הסטודיו שלך{"\n"}<GoldText>בכיס</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 28px", textAlign: "center", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          ניהול מלא מהנייד
        </p>

        {/* Phone mockup */}
        <div style={{
          width: 280, height: 500, backgroundColor: DARK_CARD, borderRadius: 32,
          border: `2px solid rgba(255,255,255,0.1)`, padding: "16px 14px",
          transform: `scale(${phoneEnter}) perspective(800px) rotateY(${interpolate(phoneEnter, [0, 1], [-10, 0])}deg)`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${GOLD}08`,
          marginBottom: 24, position: "relative", overflow: "hidden",
        }}>
          {/* Notch */}
          <div style={{ width: 100, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.1)", margin: "0 auto 14px" }} />

          {/* Mini UI inside phone */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Notification */}
            <div style={{ backgroundColor: `${GOLD}12`, borderRadius: 12, padding: "10px 14px", border: `1px solid ${GOLD}15` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Bell size={12} color={GOLD} strokeWidth={2} />
                <span style={{ fontFamily: FONT_HEADING, fontSize: 11, color: GOLD, fontWeight: 600 }}>הזמנה חדשה</span>
              </div>
              <span style={{ fontFamily: FONT_BODY, fontSize: 10, color: SUBTLE_TEXT }}>סטודיו A — מחר 14:00</span>
            </div>

            {/* Calendar mini */}
            <div style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "12px" }}>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} style={{
                    width: 28, height: 24, borderRadius: 6,
                    backgroundColor: [3, 7, 11].includes(i) ? `${GOLD}20` : "rgba(255,255,255,0.04)",
                    border: [3, 7, 11].includes(i) ? `1px solid ${GOLD}30` : "none",
                  }} />
                ))}
              </div>
            </div>

            {/* Stats mini */}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: GOLD }}>127</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 9, color: SUBTLE_TEXT }}>הזמנות</div>
              </div>
              <div style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 700, color: GOLD }}>₪18K</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 9, color: SUBTLE_TEXT }}>הכנסות</div>
              </div>
            </div>
          </div>
        </div>

        {/* App store buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {["App Store", "Google Play"].map((store, i) => (
            <div key={i} style={{
              backgroundColor: DARK_CARD, borderRadius: 12, padding: "12px 20px",
              border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 8,
              opacity: spring({ frame: frame - 80 - i * 10, fps, config: SPRING_SMOOTH }),
            }}>
              <Download size={16} color={LIGHT_TEXT} strokeWidth={2} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: LIGHT_TEXT }}>{store}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
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
        <Footer delay={140} />
      </div>
    </AbsoluteFill>
  );
};
