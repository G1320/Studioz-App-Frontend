/**
 * Ad24 — Studio Analytics V3
 * Dashboard screenshot with overlay stats
 * 240 frames / 8s @ 30fps
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
  ACCENT_BLUE,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldText,
  ScreenshotFrame,
  StatCard,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Dashboard Screenshot ─── */
const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={10} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.07} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 20,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
            opacity: headEnter,
          }}
        >
          📊 אנליטיקס
        </span>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "16px 50px 0",
            lineHeight: 1.3,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          הנתונים שלך{"\n"}
          <GoldText>בזמן אמת</GoldText>
        </h2>
      </div>

      {/* Dashboard screenshot */}
      <div style={{ position: "absolute", top: 300, left: 35, right: 35 }}>
        <ScreenshotFrame
          src="images/optimized/Studioz-Dashboard-Calendar.webp"
          delay={8}
          borderRadius={20}
          maxHeight={550}
        />
      </div>

      {/* Floating stat overlays */}
      <div
        style={{
          position: "absolute",
          bottom: 320,
          left: 50,
          display: "flex",
          gap: 14,
          ...RTL,
        }}
      >
        {[
          { emoji: "📈", value: "+32%", label: "הכנסות" },
          { emoji: "📊", value: "89%", label: "תפוסה" },
        ].map((stat, i) => {
          const enter = spring({ frame: frame - 40 - i * 10, fps, config: SPRING_BOUNCY });
          return (
            <div
              key={i}
              style={{
                backgroundColor: `${DARK_CARD}ee`,
                borderRadius: 16,
                padding: "16px 20px",
                border: `1px solid ${GOLD}20`,
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: enter,
                transform: `scale(${enter})`,
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}
            >
              <span style={{ fontSize: 28 }}>{stat.emoji}</span>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 24, fontWeight: 700, color: GOLD }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: SUBTLE_TEXT }}>
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom metric pills */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 14,
          flexWrap: "wrap",
          padding: "0 40px",
          ...RTL,
        }}
      >
        {[
          { emoji: "👥", label: "לקוחות חדשים" },
          { emoji: "⭐", label: "דירוג ממוצע" },
        ].map((item, i) => {
          const enter = spring({ frame: frame - 55 - i * 8, fps, config: SPRING_SMOOTH });
          return (
            <div
              key={i}
              style={{
                backgroundColor: DARK_CARD,
                border: "1px solid rgba(255,209,102,0.12)",
                borderRadius: 50,
                padding: "14px 26px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}
            >
              <span style={{ fontSize: 24 }}>{item.emoji}</span>
              <span style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 600, color: LIGHT_TEXT }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Stats Detail + CTA ─── */
const StatsCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        קבל החלטות{"\n"}
        <GoldText>מבוססות נתונים</GoldText>
      </>
    }
    buttonText="גלה את הנתונים שלך"
    freeText="התחל בחינם — ₪0/חודש"
    subText="דוחות בזמן אמת · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad24_StudioAnalytics_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <DashboardScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <StatsCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
