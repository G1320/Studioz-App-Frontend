import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { UserCircle, UserPlus, Share2, Users, Wallet, Gift } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad41_ReferralProgram_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });
  const centerEnter = spring({ frame: frame - 25, fps, config: SPRING_BOUNCY });

  const referrals = [
    { name: "חבר 1", x: 200, y: 0, delay: 50 },
    { name: "חבר 2", x: -200, y: -80, delay: 62 },
    { name: "חבר 3", x: -200, y: 80, delay: 74 },
  ];

  const steps = [
    { Icon: Share2, text: "שתף קישור", delay: 110 },
    { Icon: Users, text: "חבר נרשם", delay: 122 },
    { Icon: Wallet, text: "קבל קרדיט", delay: 134 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 60, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          הזמן חבר.{"\n"}<GoldText>קבל הנחה.</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 24px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          תוכנית הפניות שמשתלמת לכולם
        </p>

        {/* Referral diagram */}
        <div style={{ position: "relative", height: 260, display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
          {/* Center user */}
          <div style={{
            width: 80, height: 80, borderRadius: 20, backgroundColor: `${GOLD}15`,
            border: `2px solid ${GOLD}40`, display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${centerEnter})`, boxShadow: `0 0 30px ${GOLD}15`, zIndex: 2,
          }}>
            <UserCircle size={36} color={GOLD} strokeWidth={1.5} />
          </div>

          {/* Referral nodes */}
          {referrals.map((r, i) => {
            const enter = spring({ frame: frame - r.delay, fps, config: SPRING_SMOOTH });
            const lineProgress = interpolate(enter, [0, 1], [0, 1]);
            return (
              <React.Fragment key={i}>
                {/* Connection line */}
                <div style={{
                  position: "absolute", left: "50%", top: "50%",
                  width: Math.sqrt(r.x * r.x + r.y * r.y),
                  height: 2, backgroundColor: `${GOLD}30`,
                  transformOrigin: "0 50%",
                  transform: `rotate(${Math.atan2(r.y, r.x)}rad) scaleX(${lineProgress})`,
                  zIndex: 1,
                }} />
                {/* Node */}
                <div style={{
                  position: "absolute", left: `calc(50% + ${r.x}px)`, top: `calc(50% + ${r.y}px)`,
                  transform: `translate(-50%, -50%) scale(${enter})`,
                  opacity: enter, zIndex: 2,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16, backgroundColor: DARK_CARD,
                    border: `1px solid ${GOLD}20`, display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                  }}>
                    <UserPlus size={24} color={GOLD} strokeWidth={1.5} />
                  </div>
                  <div style={{
                    position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                    backgroundColor: `${SUCCESS}20`, borderRadius: 6, padding: "3px 8px",
                  }}>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: SUCCESS, fontWeight: 600 }}>₪50</span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <Badge text="עד ₪500 קרדיט" color={GOLD} delay={90} Icon={Gift} />
        <div style={{ height: 16 }} />

        {/* Steps */}
        <div style={{ display: "flex", gap: 10 }}>
          {steps.map((s, i) => {
            const enter = spring({ frame: frame - s.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                flex: 1, backgroundColor: DARK_CARD, borderRadius: 14, padding: "14px 12px",
                textAlign: "center", border: "1px solid rgba(255,255,255,0.06)",
                opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [10, 0])}px)`,
              }}>
                <s.Icon size={18} color={GOLD} strokeWidth={1.8} style={{ marginBottom: 6 }} />
                <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: LIGHT_TEXT }}>{s.text}</div>
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
