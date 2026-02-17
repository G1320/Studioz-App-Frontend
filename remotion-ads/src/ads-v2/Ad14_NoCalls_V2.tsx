import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, RED, RTL,
  FONT_HEADING, FONT_BODY, SPRING_SMOOTH, SPRING_BOUNCY, SPRING_SNAPPY,
  NoiseOverlay, AmbientParticles, RadialGlow, GoldButton, Footer, Headline, Subtitle, GoldText,
} from "./shared";

const ChaosScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneShake = Math.sin(frame * 0.4) * 6;
  const phoneEnter = spring({ frame, fps, config: SPRING_BOUNCY });

  // Scene exit
  const exitOpacity = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bubbles = [
    { text: "אפשר להזמין?", x: 140, y: 520, delay: 15, rot: -8 },
    { text: "מה המחיר?", x: 620, y: 380, delay: 25, rot: 5 },
    { text: "יש פנוי מחר?", x: 180, y: 780, delay: 35, rot: -4 },
    { text: "בוטל לי...", x: 580, y: 680, delay: 45, rot: 7 },
    { text: "אפשר לשנות שעה?", x: 300, y: 950, delay: 55, rot: -6 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL, opacity: exitOpacity }}>
      <NoiseOverlay />
      <RadialGlow x="50%" y="45%" size={500} color={RED} opacity={0.06} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 64, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 40px", textAlign: "center", lineHeight: 1.18, opacity: phoneEnter }}>
          עדיין עונה{"\n"}<span style={{ color: RED }}>לטלפון?</span>
        </h1>

        <div style={{ position: "relative", width: 300, height: 500 }}>
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: `translate(-50%, -50%) rotate(${phoneShake}deg) scale(${phoneEnter})`,
            width: 100, height: 100, borderRadius: 28,
            backgroundColor: `${RED}15`, border: `2px solid ${RED}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Phone size={44} color={RED} strokeWidth={1.8} />
          </div>

          {bubbles.map((b, i) => {
            const enter = spring({ frame: frame - b.delay, fps, config: SPRING_SMOOTH });
            const float = Math.sin(frame * 0.03 + i) * 5;
            return (
              <div key={i} style={{
                position: "absolute", left: b.x - 200, top: b.y - 400,
                backgroundColor: DARK_CARD, borderRadius: 14, padding: "10px 18px",
                border: `1px solid ${RED}20`, opacity: enter * 0.85,
                transform: `rotate(${b.rot}deg) translateY(${float}px) scale(${enter})`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MessageCircle size={14} color={RED} strokeWidth={2} />
                  <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: LIGHT_TEXT }}>{b.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardEnter = spring({ frame: frame - 10, fps, config: SPRING_BOUNCY });
  const textEnter = spring({ frame: frame - 30, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.1} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "52px 48px 42px", textAlign: "center" }}>
        <div style={{
          width: 100, height: 100, borderRadius: 24, backgroundColor: `${GOLD}12`,
          border: `2px solid ${GOLD}25`, display: "flex", alignItems: "center", justifyContent: "center",
          transform: `scale(${cardEnter})`, marginBottom: 36,
          boxShadow: `0 0 40px ${GOLD}15`,
        }}>
          <CheckCircle2 size={48} color={GOLD} strokeWidth={1.8} />
        </div>

        <h1 style={{
          fontFamily: FONT_HEADING, fontSize: 58, fontWeight: 700, color: LIGHT_TEXT,
          margin: "0 0 16px", lineHeight: 1.2, opacity: textEnter,
          transform: `translateY(${interpolate(textEnter, [0, 1], [20, 0])}px)`,
        }}>
          הלקוחות מזמינים לבד.{"\n"}אתה רק <span style={{ color: GOLD, filter: `drop-shadow(0 0 18px ${GOLD}30)` }}>מגיע לעבוד.</span>
        </h1>

        <p style={{
          fontFamily: FONT_BODY, fontSize: 22, color: SUBTLE_TEXT, margin: "0 0 40px", lineHeight: 1.55,
          opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          הזמנות אוטומטיות, 24/7.{"\n"}בלי שיחת טלפון אחת.
        </p>

        <GoldButton text="התחל עכשיו — בחינם" delay={50} />

        <div style={{ flex: 1 }} />
        <Footer delay={60} />
      </div>
    </AbsoluteFill>
  );
};

export const Ad14_NoCalls_V2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={120} premountFor={30}>
      <ChaosScene />
    </Sequence>
    <Sequence from={120} durationInFrames={120} premountFor={30}>
      <SolutionScene />
    </Sequence>
  </AbsoluteFill>
);
