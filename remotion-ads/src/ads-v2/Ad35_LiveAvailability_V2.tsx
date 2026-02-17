import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Eye, RefreshCw, Lock } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_GENTLE,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, GoldText,
} from "./shared";

export const Ad35_LiveAvailability_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const days = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
  const grid = [
    [1, 0, 1, 0, 1, 0, 2],
    [0, 1, 0, 1, 0, 2, 2],
    [1, 1, 0, 0, 1, 0, 2],
    [0, 0, 1, 1, 0, 2, 2],
    [1, 0, 0, 1, 1, 0, 2],
  ]; // 0=available, 1=booked, 2=past

  const features = [
    { Icon: Eye, text: "הלקוחות רואים מה פנוי", delay: 120 },
    { Icon: RefreshCw, text: "מתעדכן אוטומטית", delay: 132 },
    { Icon: Lock, text: "חסום שעות ידנית", delay: 144 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 60, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          זמינות{"\n"}<GoldText>בזמן אמת</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 24px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          הלקוחות רואים ומזמינים לבד
        </p>

        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 18, padding: "20px 16px", marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          opacity: spring({ frame: frame - 20, fps, config: SPRING_GENTLE }),
        }}>
          {/* Live indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: SUCCESS, boxShadow: `0 0 10px ${SUCCESS}`, opacity: interpolate(Math.sin(frame * 0.1), [-1, 1], [0.5, 1]) }} />
            <span style={{ fontFamily: FONT_HEADING, fontSize: 14, fontWeight: 600, color: SUCCESS }}>LIVE</span>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {days.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", fontFamily: FONT_HEADING, fontSize: 13, fontWeight: 600, color: SUBTLE_TEXT }}>{d}</div>
            ))}
          </div>
          {grid.map((row, ri) => (
            <div key={ri} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              {row.map((cell, ci) => {
                const cellEnter = spring({ frame: frame - 30 - (ri * 7 + ci) * 1.5, fps, config: SPRING_SMOOTH });
                return (
                  <div key={ci} style={{
                    flex: 1, height: 40, borderRadius: 8,
                    backgroundColor: cell === 1 ? `${GOLD}20` : cell === 2 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${cell === 1 ? `${GOLD}30` : cell === 2 ? "transparent" : "rgba(255,255,255,0.08)"}`,
                    opacity: cell === 2 ? 0.4 * cellEnter : cellEnter,
                    transform: `scale(${cellEnter})`,
                  }} />
                );
              })}
            </div>
          ))}

          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 12 }}>
            {[{ color: `${GOLD}20`, label: "תפוס" }, { color: "rgba(255,255,255,0.05)", label: "פנוי" }, { color: "rgba(255,255,255,0.02)", label: "עבר" }].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: l.color }} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: SUBTLE_TEXT }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

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
        <Footer delay={160} />
      </div>
    </AbsoluteFill>
  );
};
