import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Globe, MapPin, Mic, Music, Radio, Headphones } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, ACCENT_BLUE, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad51_StudioNetwork_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const studioTypes = [
    { Icon: Mic, name: "הקלטה", count: "84", color: GOLD },
    { Icon: Music, name: "מוזיקה", count: "62", color: ACCENT_BLUE },
    { Icon: Radio, name: "פודקאסט", count: "45", color: SUCCESS },
    { Icon: Headphones, name: "מיקס", count: "38", color: GOLD },
  ];

  const cities = [
    { name: "תל אביב", count: 87, x: 55, y: 45 },
    { name: "ירושלים", count: 42, x: 70, y: 60 },
    { name: "חיפה", count: 35, x: 45, y: 25 },
    { name: "באר שבע", count: 21, x: 60, y: 80 },
    { name: "רמת גן", count: 29, x: 48, y: 48 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 56, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          רשת סטודיואים{"\n"}<GoldText>ברחבי הארץ</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 24px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          הלקוחות מוצאים אותך בקלות
        </p>

        {/* Map visualization */}
        <div style={{
          position: "relative", height: 320, backgroundColor: DARK_CARD, borderRadius: 20, marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          opacity: spring({ frame: frame - 20, fps, config: SPRING_SMOOTH }),
        }}>
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: 0, right: 0, top: `${(i + 1) * 20}%`, height: 1, backgroundColor: "rgba(255,255,255,0.03)" }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, left: `${(i + 1) * 20}%`, width: 1, backgroundColor: "rgba(255,255,255,0.03)" }} />
            </React.Fragment>
          ))}

          {/* City dots */}
          {cities.map((c, i) => {
            const enter = spring({ frame: frame - 35 - i * 12, fps, config: SPRING_BOUNCY });
            const pulse = interpolate(Math.sin(frame * 0.04 + i * 2), [-1, 1], [0.7, 1]);
            return (
              <div key={i} style={{
                position: "absolute", left: `${c.x}%`, top: `${c.y}%`, transform: `translate(-50%, -50%) scale(${enter})`,
              }}>
                {/* Pulse ring */}
                <div style={{
                  position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
                  width: 40 * pulse, height: 40 * pulse, borderRadius: "50%",
                  border: `1px solid ${GOLD}20`, opacity: pulse,
                }} />
                {/* Dot */}
                <div style={{
                  width: 14, height: 14, borderRadius: "50%", backgroundColor: GOLD,
                  boxShadow: `0 0 12px ${GOLD}40`,
                }} />
                {/* Label */}
                <div style={{
                  position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap",
                  fontFamily: FONT_BODY, fontSize: 11, color: SUBTLE_TEXT,
                }}>{c.name}</div>
                <div style={{
                  position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)",
                  fontFamily: FONT_MONO, fontSize: 11, color: GOLD, fontWeight: 600,
                }}>{c.count}</div>
              </div>
            );
          })}
        </div>

        {/* Studio type cards */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {studioTypes.map((s, i) => {
            const enter = spring({ frame: frame - 90 - i * 10, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                flex: 1, backgroundColor: DARK_CARD, borderRadius: 14, padding: "14px 10px", textAlign: "center",
                border: `1px solid ${s.color}10`, opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [15, 0])}px)`,
              }}>
                <s.Icon size={20} color={s.color} strokeWidth={1.8} style={{ marginBottom: 6 }} />
                <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, color: s.color }}>{s.count}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: SUBTLE_TEXT }}>{s.name}</div>
              </div>
            );
          })}
        </div>

        <Badge text="230+ סטודיואים פעילים" color={SUCCESS} delay={140} Icon={Globe} />
        <div style={{ flex: 1 }} />
        <Footer delay={160} />
      </div>
    </AbsoluteFill>
  );
};
