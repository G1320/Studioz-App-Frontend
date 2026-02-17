/**
 * Ad53 — Final Powerful CTA V3
 * Recap of key benefits with emoji checkmarks, then big CTA
 * 270 frames / 9s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  GoldButton,
  Footer,
  SectionLabel,
  Badge,
} from "./shared";
import { Check, Zap } from "lucide-react";

/* ─── Animated Checkmark Row ─── */
const CheckRow: React.FC<{
  text: string;
  delay: number;
}> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });
  const checkScale = spring({
    frame: frame - delay - 3,
    fps,
    config: SPRING_BOUNCY,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)`,
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: "22px 26px",
        border: `1px solid ${SUCCESS}12`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: `${SUCCESS}15`,
          border: `1px solid ${SUCCESS}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transform: `scale(${checkScale})`,
        }}
      >
        <Check size={24} color={SUCCESS} strokeWidth={2.5} />
      </div>
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 24,
          fontWeight: 600,
          color: LIGHT_TEXT,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/* ─── Scene 1: Benefits Recap ─── */
const RecapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  const benefits = [
    { text: "✅ הזמנות אוטומטיות", delay: 15 },
    { text: "✅ תשלומים מובטחים", delay: 28 },
    { text: "✅ דשבורד חכם", delay: 41 },
    { text: "✅ אפס שיחות טלפון", delay: 54 },
    { text: "✅ דף סטודיו מקצועי", delay: 67 },
    { text: "✅ תזכורות אוטומטיות", delay: 80 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="20%" size={500} opacity={0.07} />
      <RadialGlow x="50%" y="80%" size={400} color={SUCCESS} opacity={0.04} />

      <div
        style={{
          padding: "70px 42px 60px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <SectionLabel text="סיכום" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "12px 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          הכל ב<GoldText>מקום אחד</GoldText>
        </h2>

        <div style={{ textAlign: "center", marginBottom: 35 }}>
          <GoldLine width={140} delay={8} />
        </div>

        {/* Benefits list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            flex: 1,
          }}
        >
          {benefits.map((b, i) => (
            <CheckRow key={i} text={b.text} delay={b.delay} />
          ))}
        </div>

        {/* Bottom tease */}
        <p
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 28,
            fontWeight: 600,
            color: GOLD,
            textAlign: "center",
            marginTop: 30,
            opacity: interpolate(frame, [95, 115], [0, 1], {
              extrapolateRight: "clamp",
            }),
            filter: `drop-shadow(0 0 15px ${GOLD}30)`,
          }}
        >
          וזה רק ההתחלה... ⚡
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Big CTA ─── */
const BigCTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scaleIn = spring({ frame, fps, config: { damping: 12 } });
  const buttonPulse = interpolate(frame % 40, [0, 20, 40], [1, 1.05, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="45%" size={700} opacity={0.1} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "60px 48px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `scale(${scaleIn})`,
          }}
        >
          {/* Logo */}
          <Img
            src={staticFile("logo.png")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 22,
              marginBottom: 30,
              boxShadow: `0 0 40px ${GOLD}15`,
            }}
          />

          <h2
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 52,
              fontWeight: 700,
              color: LIGHT_TEXT,
              textAlign: "center",
              margin: "0 0 10px",
              lineHeight: 1.3,
            }}
          >
            הצטרף ל-<GoldText>Studioz</GoldText>
            {"\n"}היום
          </h2>

          <div style={{ marginBottom: 25 }}>
            <GoldLine width={180} delay={10} />
          </div>

          {/* Free badge */}
          <div style={{ marginBottom: 20 }}>
            <Badge text="חינם לנצח — ₪0/חודש" color={SUCCESS} delay={15} Icon={Zap} />
          </div>

          {/* CTA Button */}
          <div
            style={{
              backgroundColor: GOLD,
              paddingLeft: 56,
              paddingRight: 56,
              paddingTop: 24,
              paddingBottom: 24,
              borderRadius: 18,
              transform: `scale(${buttonPulse})`,
              opacity: interpolate(frame, [25, 40], [0, 1], {
                extrapolateRight: "clamp",
              }),
              boxShadow: `0 0 60px ${GOLD}30, 0 12px 40px rgba(0,0,0,0.4)`,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 30,
                fontWeight: 700,
                color: DARK_BG,
              }}
            >
              פרסם את האולפן שלך עכשיו ←
            </span>
          </div>

          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 20,
              color: SUBTLE_TEXT,
              textAlign: "center",
              margin: "0 0 10px",
              opacity: interpolate(frame, [35, 50], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            ללא כרטיס אשראי · ללא התחייבות · הגדרה תוך 5 דקות
          </p>

          <Footer delay={40} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Main Composition ─── */
export const Ad53_FinalCTA_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <RecapScene />
      </Sequence>
      <Sequence from={150} durationInFrames={120} premountFor={15}>
        <BigCTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
