import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ShieldCheck, Lock, KeyRound, RefreshCw } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, GoldText,
} from "./shared";

export const Ad23_PaymentSecure_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shieldEnter = spring({ frame: frame - 10, fps, config: SPRING_BOUNCY });
  const headEnter = spring({ frame: frame - 25, fps, config: SPRING_SMOOTH });
  const glowPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.08, 0.2]);

  const badges = [
    { Icon: Lock, title: "הצפנת SSL", subtitle: "256-bit", delay: 60 },
    { Icon: ShieldCheck, title: "תקן PCI DSS", subtitle: "Level 1", delay: 75 },
    { Icon: KeyRound, title: "אימות דו-שלבי", subtitle: "2FA", delay: 90 },
    { Icon: RefreshCw, title: "גיבוי אוטומטי", subtitle: "יומי", delay: 105 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={500} color={GOLD} opacity={glowPulse} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", padding: "52px 48px 42px", textAlign: "center" }}>
        {/* Large shield icon */}
        <div style={{
          width: 100, height: 100, borderRadius: 28,
          backgroundColor: `${GOLD}12`, display: "flex", alignItems: "center", justifyContent: "center",
          transform: `scale(${shieldEnter})`, marginBottom: 28,
          boxShadow: `0 0 60px ${GOLD}20`,
        }}>
          <ShieldCheck size={50} color={GOLD} strokeWidth={1.5} />
        </div>

        <h1 style={{
          fontFamily: FONT_HEADING, fontSize: 60, fontWeight: 700, color: LIGHT_TEXT,
          margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter,
          transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
        }}>
          אבטחה{"\n"}<GoldText>ברמה הגבוהה ביותר</GoldText>
        </h1>

        <p style={{
          fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 32px",
          opacity: interpolate(frame, [35, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          הנתונים שלך מוגנים תמיד
        </p>

        {/* Security badges 2x2 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, width: "100%", marginBottom: 24 }}>
          {badges.map((b, i) => {
            const enter = spring({ frame: frame - b.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                width: "calc(50% - 6px)", backgroundColor: DARK_CARD, borderRadius: 16,
                padding: "24px 18px", textAlign: "center",
                border: `1px solid rgba(255,209,102,0.08)`,
                transform: `scale(${enter})`, opacity: enter,
                boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  backgroundColor: `${GOLD}10`, display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 12px",
                }}>
                  <b.Icon size={24} color={GOLD} strokeWidth={1.8} />
                </div>
                <div style={{ fontFamily: FONT_HEADING, fontSize: 17, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 4 }}>
                  {b.title}
                </div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 14, color: SUBTLE_TEXT, fontWeight: 500 }}>
                  {b.subtitle}
                </div>
              </div>
            );
          })}
        </div>

        <p style={{
          fontFamily: FONT_BODY, fontSize: 17, color: SUBTLE_TEXT, margin: 0,
          opacity: interpolate(frame, [120, 135], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          הנתונים שלך מוגנים בהצפנה מתקדמת
        </p>

        <div style={{ flex: 1 }} />
        <Footer delay={140} />
      </div>
    </AbsoluteFill>
  );
};
