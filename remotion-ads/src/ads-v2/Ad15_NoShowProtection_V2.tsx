import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ShieldCheck, Lock, CreditCard, Bell, TrendingDown } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RED, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, GoldButton, Footer, Badge, GoldText,
} from "./shared";

export const Ad15_NoShowProtection_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });
  const shieldEnter = spring({ frame: frame - 60, fps, config: SPRING_BOUNCY });

  const barData = [
    { month: "ינו׳", total: 85, lost: 22 },
    { month: "פבר׳", total: 92, lost: 18 },
    { month: "מרץ", total: 78, lost: 25 },
    { month: "אפר׳", total: 95, lost: 8 },
  ];
  const maxBar = 100;

  const features = [
    { Icon: Lock, text: "מדיניות ביטולים", delay: 100 },
    { Icon: CreditCard, text: "גבייה מראש", delay: 112 },
    { Icon: Bell, text: "תזכורות אוטומטיות", delay: 124 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />

      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px", position: "relative" }}>
        <h1 style={{
          fontFamily: FONT_HEADING, fontSize: 62, fontWeight: 700, color: LIGHT_TEXT,
          margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter,
          transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
        }}>
          ביטולים?{"\n"}<GoldText>כבר לא בעיה.</GoldText>
        </h1>

        <p style={{
          fontFamily: FONT_BODY, fontSize: 21, color: SUBTLE_TEXT, margin: "0 0 28px", lineHeight: 1.5,
          opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          הגנה אוטומטית על ההכנסות שלך
        </p>

        {/* Bar chart */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 18, padding: "24px 24px 16px",
          border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20, position: "relative",
          boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
        }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end", height: 180, marginBottom: 12 }}>
            {barData.map((d, i) => {
              const barEnter = spring({ frame: frame - 25 - i * 8, fps, config: SPRING_SMOOTH });
              const totalH = (d.total / maxBar) * 160 * barEnter;
              const lostH = (d.lost / maxBar) * 160 * barEnter;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "80%", height: totalH, borderRadius: 8, backgroundColor: `${GOLD}25`, position: "relative", overflow: "hidden" }}>
                    <div style={{
                      position: "absolute", bottom: 0, width: "100%", height: lostH,
                      backgroundColor: `${RED}40`, borderRadius: "0 0 8px 8px",
                    }} />
                  </div>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: SUBTLE_TEXT }}>{d.month}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: `${GOLD}25` }} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: SUBTLE_TEXT }}>הזמנות</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: `${RED}40` }} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: SUBTLE_TEXT }}>הפסד מביטולים</span>
            </div>
          </div>

          {/* Shield overlay */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: `translate(-50%, -50%) scale(${shieldEnter})`,
            opacity: shieldEnter * 0.95,
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              backgroundColor: `${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 50px ${GOLD}25`,
            }}>
              <ShieldCheck size={40} color={GOLD} strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* Protection features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {features.map((f, i) => {
            const enter = spring({ frame: frame - f.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                backgroundColor: DARK_CARD, borderRadius: 14, padding: "14px 18px",
                border: `1px solid rgba(255,209,102,0.07)`, display: "flex", alignItems: "center", gap: 12,
                opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [30, 0])}px)`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, backgroundColor: `${GOLD}10`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <f.Icon size={20} color={GOLD} strokeWidth={1.8} />
                </div>
                <span style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 600, color: LIGHT_TEXT }}>{f.text}</span>
              </div>
            );
          })}
        </div>

        <Badge text="85% פחות ביטולים" color={SUCCESS} delay={140} Icon={TrendingDown} />

        <div style={{ flex: 1 }} />
        <Footer delay={150} />
      </div>
    </AbsoluteFill>
  );
};
