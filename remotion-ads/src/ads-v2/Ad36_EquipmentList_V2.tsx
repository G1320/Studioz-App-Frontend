import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Mic, Headphones, Speaker, Guitar, Camera, Lightbulb, CheckSquare } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, SPRING_SMOOTH,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad36_EquipmentList_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const equipment = [
    { Icon: Mic, name: "מיקרופון Neumann U87", delay: 30 },
    { Icon: Headphones, name: "אוזניות Sony MDR", delay: 42 },
    { Icon: Speaker, name: "מוניטורים Yamaha HS8", delay: 54 },
    { Icon: Guitar, name: "מגבר Marshall", delay: 66 },
    { Icon: Camera, name: "מצלמה Sony A7III", delay: 78 },
    { Icon: Lightbulb, name: "תאורת LED", delay: 90 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 58, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          ציוד הסטודיו{"\n"}<GoldText>מנוהל ומוכן</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 28px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          הלקוח רואה בדיוק מה כלול
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {equipment.map((e, i) => {
            const enter = spring({ frame: frame - e.delay, fps, config: SPRING_SMOOTH });
            const checked = frame > e.delay + 20;
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 14, padding: "16px 18px",
                border: `1px solid ${checked ? `${GOLD}20` : "rgba(255,255,255,0.06)"}`,
                display: "flex", alignItems: "center", gap: 14,
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 11, backgroundColor: `${GOLD}10`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <e.Icon size={20} color={GOLD} strokeWidth={1.8} />
                </div>
                <span style={{ fontFamily: FONT_BODY, fontSize: 17, color: LIGHT_TEXT, fontWeight: 500, flex: 1 }}>{e.name}</span>
                <CheckSquare size={20} color={checked ? SUCCESS : SUBTLE_TEXT} strokeWidth={2} style={{ opacity: checked ? 1 : 0.3 }} />
              </div>
            );
          })}
        </div>

        <Badge text="הלקוח רואה מה כלול" color={SUCCESS} delay={120} Icon={CheckSquare} />

        <div style={{ flex: 1 }} />
        <Footer delay={140} />
      </div>
    </AbsoluteFill>
  );
};
