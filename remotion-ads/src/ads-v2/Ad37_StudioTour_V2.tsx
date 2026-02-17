import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Image, Video, Eye, Music, Mic, Camera } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, RTL,
  FONT_HEADING, FONT_BODY, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, GoldText,
} from "./shared";

export const Ad37_StudioTour_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const studios = [
    { Icon: Mic, label: "סטודיו A — אולפן הקלטה", delay: 30, rot: -4 },
    { Icon: Music, label: "סטודיו B — חדר חזרות", delay: 42, rot: 2 },
    { Icon: Camera, label: "סטודיו C — צילום", delay: 54, rot: -1 },
  ];

  const features = [
    { Icon: Image, text: "גלריית תמונות", delay: 110 },
    { Icon: Video, text: "סיור וירטואלי", delay: 122 },
    { Icon: Eye, text: "תצוגה מקצועית", delay: 134 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 58, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          הסטודיו שלך{"\n"}<GoldText>בתצוגה מושלמת</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 32px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          גלריה מקצועית שמוכרת בשבילך
        </p>

        {/* Stacked photo cards */}
        <div style={{ position: "relative", height: 380, marginBottom: 24 }}>
          {studios.map((s, i) => {
            const enter = spring({ frame: frame - s.delay, fps, config: SPRING_BOUNCY });
            const float = Math.sin(frame * 0.02 + i * 2) * 4;
            return (
              <div key={i} style={{
                position: "absolute", left: 40 + i * 20, top: 20 + i * 100,
                width: "calc(100% - 80px - " + (i * 40) + "px)",
                backgroundColor: DARK_CARD, borderRadius: 18, padding: "60px 24px 20px",
                border: `1px solid rgba(255,209,102,0.08)`,
                transform: `rotate(${s.rot}deg) translateY(${float}px) scale(${enter})`,
                opacity: enter, boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                zIndex: 3 - i,
              }}>
                <div style={{
                  position: "absolute", top: 20, right: 20,
                  width: 40, height: 40, borderRadius: 10, backgroundColor: `${GOLD}10`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <s.Icon size={20} color={GOLD} strokeWidth={1.8} />
                </div>
                <div style={{
                  width: "100%", height: 120, borderRadius: 12,
                  backgroundColor: "rgba(255,255,255,0.03)", display: "flex",
                  alignItems: "center", justifyContent: "center", marginBottom: 14,
                  border: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <Image size={32} color={SUBTLE_TEXT} strokeWidth={1.2} style={{ opacity: 0.4 }} />
                </div>
                <div style={{ fontFamily: FONT_HEADING, fontSize: 16, fontWeight: 600, color: LIGHT_TEXT }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Navigation dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: i === 0 ? 24 : 8, height: 8, borderRadius: 4,
              backgroundColor: i === 0 ? GOLD : `rgba(255,255,255,0.15)`,
            }} />
          ))}
        </div>

        {/* Features */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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

        <div style={{ flex: 1 }} />
        <Footer delay={150} />
      </div>
    </AbsoluteFill>
  );
};
