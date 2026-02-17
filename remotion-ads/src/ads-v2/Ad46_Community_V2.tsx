import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Users, UserCircle, MessageCircle, Share2, Award, TrendingUp } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad46_Community_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });
  const centerEnter = spring({ frame: frame - 20, fps, config: SPRING_BOUNCY });

  const nodes = Array.from({ length: 6 }).map((_, i) => ({
    angle: (i / 6) * Math.PI * 2 - Math.PI / 2,
    delay: 40 + i * 10,
  }));
  const radius = 130;

  const features = [
    { Icon: MessageCircle, text: "פורום מקצועי", delay: 110 },
    { Icon: Share2, text: "שיתוף ידע", delay: 120 },
    { Icon: Award, text: "אירועי נטוורקינג", delay: 130 },
    { Icon: TrendingUp, text: "צמיחה משותפת", delay: 140 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.1} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px", alignItems: "center" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 58, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, textAlign: "center", opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          קהילה של{"\n"}<GoldText>בעלי סטודיואים</GoldText>
        </h1>

        {/* Network graph */}
        <div style={{ position: "relative", width: 320, height: 320, marginBottom: 20 }}>
          {/* Center node */}
          <div style={{
            position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${centerEnter})`,
            width: 72, height: 72, borderRadius: 20, backgroundColor: `${GOLD}15`,
            border: `2px solid ${GOLD}40`, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 30px ${GOLD}15`, zIndex: 2,
          }}>
            <Users size={32} color={GOLD} strokeWidth={1.5} />
          </div>

          {/* Outer nodes */}
          {nodes.map((n, i) => {
            const enter = spring({ frame: frame - n.delay, fps, config: SPRING_SMOOTH });
            const x = Math.cos(n.angle) * radius;
            const y = Math.sin(n.angle) * radius;
            const pulse = interpolate(Math.sin(frame * 0.03 + i), [-1, 1], [0.3, 0.6]);
            return (
              <React.Fragment key={i}>
                <div style={{
                  position: "absolute", left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`,
                  width: 2, height: radius, transformOrigin: "0 0",
                  transform: `rotate(${n.angle + Math.PI}rad)`,
                  background: `linear-gradient(${GOLD}${Math.round(pulse * 255).toString(16).padStart(2, "0")}, transparent)`,
                  opacity: enter, zIndex: 1,
                }} />
                <div style={{
                  position: "absolute", left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) scale(${enter})`, opacity: enter, zIndex: 2,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, backgroundColor: DARK_CARD,
                    border: "1px solid rgba(255,209,102,0.15)", display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                  }}>
                    <UserCircle size={22} color={SUBTLE_TEXT} strokeWidth={1.5} />
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Features */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16, width: "100%" }}>
          {features.map((f, i) => {
            const enter = spring({ frame: frame - f.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                width: "calc(50% - 5px)", backgroundColor: DARK_CARD, borderRadius: 12, padding: "12px 14px",
                border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8,
                opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [10, 0])}px)`,
              }}>
                <f.Icon size={16} color={GOLD} strokeWidth={1.8} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: LIGHT_TEXT }}>{f.text}</span>
              </div>
            );
          })}
        </div>

        <Badge text="500+ חברים פעילים" color={SUCCESS} delay={155} Icon={Users} />
        <div style={{ flex: 1 }} />
        <Footer delay={170} />
      </div>
    </AbsoluteFill>
  );
};
