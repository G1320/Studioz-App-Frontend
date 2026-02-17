import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Heart, Lightbulb, Users, Code, Music, Wrench } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad54_BuiltByOwners_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const timeline = [
    { Icon: Lightbulb, title: "הרעיון", desc: "בעלי סטודיו שרצו משהו טוב יותר", delay: 30 },
    { Icon: Wrench, title: "הפיתוח", desc: "בנינו את הכלי שחלמנו עליו", delay: 50 },
    { Icon: Users, title: "הקהילה", desc: "500+ סטודיואים הצטרפו", delay: 70 },
    { Icon: Heart, title: "המשימה", desc: "להעצים כל בעל סטודיו בישראל", delay: 90 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 56, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          נבנה על ידי{"\n"}<GoldText>בעלי סטודיואים</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 32px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          אנחנו מבינים אתכם — כי אנחנו כמוכם
        </p>

        {/* Timeline */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", right: 23, top: 20, bottom: 20, width: 2,
            background: `linear-gradient(${GOLD}30, ${GOLD}05)`,
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {timeline.map((t, i) => {
              const enter = spring({ frame: frame - t.delay, fps, config: SPRING_SMOOTH });
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 18,
                  opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [30, 0])}px)`,
                }}>
                  {/* Node */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, backgroundColor: DARK_CARD,
                    border: `1px solid ${GOLD}20`, display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, boxShadow: `0 0 16px ${GOLD}08`, zIndex: 1,
                  }}>
                    <t.Icon size={22} color={GOLD} strokeWidth={1.8} />
                  </div>
                  {/* Content */}
                  <div style={{
                    backgroundColor: DARK_CARD, borderRadius: 16, padding: "16px 18px", flex: 1,
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  }}>
                    <div style={{ fontFamily: FONT_HEADING, fontSize: 17, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 4 }}>{t.title}</div>
                    <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: SUBTLE_TEXT, lineHeight: 1.5 }}>{t.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quote */}
        <div style={{
          backgroundColor: `${GOLD}08`, borderRadius: 16, padding: "18px 22px",
          borderRight: `3px solid ${GOLD}40`, marginBottom: 20,
          opacity: spring({ frame: frame - 110, fps, config: SPRING_SMOOTH }),
        }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: LIGHT_TEXT, margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>
            ״בנינו את סטודיוז כי לא מצאנו כלי שבאמת מבין את הצרכים שלנו כבעלי סטודיואים.״
          </p>
          <div style={{ fontFamily: FONT_HEADING, fontSize: 13, color: GOLD, marginTop: 8, fontWeight: 600 }}>— צוות סטודיוז</div>
        </div>

        <Badge text="מבעלי סטודיו, לבעלי סטודיו" color={GOLD} delay={130} Icon={Heart} />
        <div style={{ flex: 1 }} />
        <Footer delay={150} />
      </div>
    </AbsoluteFill>
  );
};
