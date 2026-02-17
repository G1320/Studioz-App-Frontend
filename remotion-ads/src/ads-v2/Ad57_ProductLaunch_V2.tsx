import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { Rocket, Star, Zap, Shield, Clock, BarChart3, CalendarDays, Users, ArrowLeft } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, ACCENT_BLUE, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, GoldText, GoldButton, Badge,
} from "./shared";

export const Ad57_ProductLaunch_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene transitions (300 frames total, ~10s)
  const scene1 = interpolate(frame, [0, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scene2 = interpolate(frame, [50, 70, 130, 150], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scene3 = interpolate(frame, [140, 160, 220, 240], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scene4 = interpolate(frame, [230, 250, 300, 300], [0, 1, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const features = [
    { Icon: CalendarDays, text: "הזמנות אוטומטיות", delay: 160 },
    { Icon: BarChart3, text: "דשבורד חכם", delay: 172 },
    { Icon: Shield, text: "הגנה מביטולים", delay: 184 },
    { Icon: Users, text: "ניהול לקוחות", delay: 196 },
  ];

  const stats = [
    { value: "500+", label: "סטודיואים", delay: 165 },
    { value: "50K+", label: "הזמנות", delay: 177 },
    { value: "4.9", label: "דירוג", delay: 189 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />

      {/* Scene 1: Logo Reveal (frames 0-60) */}
      {scene1 > 0 && (
        <AbsoluteFill style={{ opacity: scene1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <RadialGlow x="50%" y="50%" size={700} opacity={0.12} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <div style={{
              transform: `scale(${spring({ frame, fps, config: SPRING_BOUNCY })})`,
            }}>
              <Img src={staticFile("logo.png")} style={{ width: 120, height: 120, borderRadius: 28 }} />
            </div>
            <div style={{
              fontFamily: FONT_HEADING, fontSize: 52, fontWeight: 700, color: LIGHT_TEXT,
              opacity: spring({ frame: frame - 15, fps, config: SPRING_SMOOTH }),
              transform: `translateY(${interpolate(spring({ frame: frame - 15, fps, config: SPRING_SMOOTH }), [0, 1], [20, 0])}px)`,
            }}>
              <GoldText>סטודיוז</GoldText>
            </div>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 22, color: SUBTLE_TEXT,
              opacity: spring({ frame: frame - 25, fps, config: SPRING_SMOOTH }),
            }}>
              הפלטפורמה לניהול סטודיואים
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 2: Problem (frames 50-150) */}
      {scene2 > 0 && (
        <AbsoluteFill style={{ opacity: scene2, ...RTL }}>
          <RadialGlow x="50%" y="35%" size={500} opacity={0.06} />
          <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "80px 48px 42px" }}>
            <h1 style={{ fontFamily: FONT_HEADING, fontSize: 54, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 20px", lineHeight: 1.18 }}>
              נמאס לנהל{"\n"}הכל ידנית?
            </h1>
            <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 32px", lineHeight: 1.6 }}>
              שיחות טלפון, הודעות וואטסאפ,{"\n"}אקסלים, ביטולים של הרגע האחרון...
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["ניהול יומן ידני", "מעקב תשלומים באקסל", "ביטולים ללא הגנה"].map((t, i) => {
                const enter = spring({ frame: frame - 70 - i * 10, fps, config: SPRING_SMOOTH });
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [25, 0])}px)`,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: `${SUBTLE_TEXT}60` }} />
                    <span style={{ fontFamily: FONT_BODY, fontSize: 18, color: SUBTLE_TEXT }}>{t}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: Features + Stats (frames 140-240) */}
      {scene3 > 0 && (
        <AbsoluteFill style={{ opacity: scene3, ...RTL }}>
          <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />
          <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "60px 48px 42px" }}>
            <h1 style={{ fontFamily: FONT_HEADING, fontSize: 52, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 24px", lineHeight: 1.18 }}>
              <GoldText>סטודיוז</GoldText> עושה{"\n"}את הכל בשבילך
            </h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
              {features.map((f, i) => {
                const enter = spring({ frame: frame - f.delay, fps, config: SPRING_SMOOTH });
                return (
                  <div key={i} style={{
                    width: "calc(50% - 5px)", backgroundColor: DARK_CARD, borderRadius: 14, padding: "16px 14px",
                    border: `1px solid ${GOLD}10`, display: "flex", alignItems: "center", gap: 10,
                    opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [12, 0])}px)`,
                  }}>
                    <f.Icon size={20} color={GOLD} strokeWidth={1.8} />
                    <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: LIGHT_TEXT }}>{f.text}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {stats.map((s, i) => {
                const enter = spring({ frame: frame - s.delay, fps, config: SPRING_BOUNCY });
                return (
                  <div key={i} style={{
                    flex: 1, backgroundColor: DARK_CARD, borderRadius: 16, padding: "20px 12px", textAlign: "center",
                    border: `1px solid ${GOLD}10`, opacity: enter, transform: `scale(${enter})`,
                  }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 28, fontWeight: 700, color: GOLD }}>{s.value}</div>
                    <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: SUBTLE_TEXT, marginTop: 4 }}>{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: CTA (frames 230-300) */}
      {scene4 > 0 && (
        <AbsoluteFill style={{ opacity: scene4, display: "flex", alignItems: "center", justifyContent: "center", ...RTL }}>
          <RadialGlow x="50%" y="40%" size={700} opacity={0.12} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "0 48px" }}>
            <Rocket size={48} color={GOLD} strokeWidth={1.5} style={{
              opacity: spring({ frame: frame - 240, fps, config: SPRING_SMOOTH }),
              filter: `drop-shadow(0 0 16px ${GOLD}30)`,
            }} />
            <h1 style={{
              fontFamily: FONT_HEADING, fontSize: 58, fontWeight: 700, color: LIGHT_TEXT,
              textAlign: "center", margin: 0, lineHeight: 1.15,
              opacity: spring({ frame: frame - 245, fps, config: SPRING_SMOOTH }),
            }}>
              הצטרף{"\n"}<GoldText>עכשיו</GoldText>
            </h1>
            <p style={{
              fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, textAlign: "center", margin: 0,
              opacity: spring({ frame: frame - 255, fps, config: SPRING_SMOOTH }),
            }}>
              חינם לתקופת ניסיון
            </p>
            <GoldButton text="התחל עכשיו" delay={260} size="lg" />
            <Footer delay={270} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
