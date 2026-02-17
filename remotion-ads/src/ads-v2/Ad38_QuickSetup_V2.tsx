import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { UserPlus, Settings, Palette, Rocket, Sparkles } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, GoldButton, Footer, Badge, GoldText,
} from "./shared";

export const Ad38_QuickSetup_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const steps = [
    { Icon: UserPlus, title: "הירשם בחינם", time: "30 שניות", delay: 30 },
    { Icon: Settings, title: "הגדר שירותים", time: "2 דקות", delay: 48 },
    { Icon: Palette, title: "התאם עיצוב", time: "1 דקה", delay: 66 },
    { Icon: Rocket, title: "קבל הזמנות!", time: "מיידי", delay: 84, success: true },
  ];

  const progressWidth = interpolate(frame, [30, 120], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 58, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          הקמה פשוטה.{"\n"}<GoldText>תוצאות מיידיות.</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 28px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          מוכן לקבל הזמנות תוך 5 דקות
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {steps.map((s, i) => {
            const enter = spring({ frame: frame - s.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 16, padding: "18px 20px",
                border: `1px solid ${s.success ? `${SUCCESS}25` : "rgba(255,209,102,0.07)"}`,
                display: "flex", alignItems: "center", gap: 16,
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)`,
                boxShadow: s.success ? `0 0 20px ${SUCCESS}10` : "0 4px 16px rgba(0,0,0,0.2)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  backgroundColor: s.success ? `${SUCCESS}15` : `${GOLD}10`,
                  border: `2px solid ${s.success ? SUCCESS : `${GOLD}25`}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  boxShadow: s.success ? `0 0 16px ${SUCCESS}20` : "none",
                }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 700, color: s.success ? SUCCESS : GOLD }}>{i + 1}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 700, color: LIGHT_TEXT }}>{s.title}</div>
                </div>
                <div style={{
                  backgroundColor: `rgba(255,255,255,0.05)`, borderRadius: 8, padding: "6px 12px",
                }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: s.success ? SUCCESS : SUBTLE_TEXT, fontWeight: 500 }}>{s.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ width: "100%", height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.06)" }}>
            <div style={{ width: `${progressWidth}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${GOLD}, ${SUCCESS})`, boxShadow: `0 0 12px ${GOLD}30` }} />
          </div>
        </div>

        <Badge text="מוכן!" color={SUCCESS} delay={130} Icon={Sparkles} />

        <div style={{ flex: 1 }} />
        <GoldButton text="התחל עכשיו" delay={140} size="sm" />
        <div style={{ height: 16 }} />
        <Footer delay={150} />
      </div>
    </AbsoluteFill>
  );
};
