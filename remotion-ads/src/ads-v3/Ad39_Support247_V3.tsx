/**
 * Ad39 — Support 24/7 V3
 * Always-on support with clock animation and support channel cards
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
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
  GoldLine,
  GoldText,
  Badge,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Clock Animation ─── */
const AnimatedClock: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  // Rotating clock hand
  const rotation = interpolate(frame, [delay, delay + 120], [0, 720], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: "50%",
        border: `3px solid ${GOLD}`,
        backgroundColor: `${GOLD}08`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        transform: `scale(${enter})`,
        opacity: enter,
        boxShadow: `0 0 50px ${GOLD}15`,
      }}
    >
      {/* Hour markers */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
        (deg, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 3 === 0 ? 4 : 2,
              height: i % 3 === 0 ? 14 : 8,
              backgroundColor: i % 3 === 0 ? GOLD : `${GOLD}60`,
              borderRadius: 2,
              top: 10,
              left: "50%",
              transformOrigin: `50% ${90 - 10}px`,
              transform: `translateX(-50%) rotate(${deg}deg)`,
            }}
          />
        )
      )}

      {/* Clock hand */}
      <div
        style={{
          position: "absolute",
          width: 3,
          height: 55,
          backgroundColor: GOLD,
          borderRadius: 2,
          bottom: "50%",
          transformOrigin: "50% 100%",
          transform: `rotate(${rotation}deg)`,
          boxShadow: `0 0 8px ${GOLD}40`,
        }}
      />

      {/* Center dot */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: GOLD,
          position: "absolute",
          boxShadow: `0 0 12px ${GOLD}60`,
        }}
      />

      {/* 24/7 text */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          fontFamily: FONT_MONO,
          fontSize: 32,
          fontWeight: 700,
          color: GOLD,
          filter: `drop-shadow(0 0 12px ${GOLD}30)`,
        }}
      >
        24/7
      </div>
    </div>
  );
};

/* ─── Support Channel Card ─── */
const ChannelCard: React.FC<{
  emoji: string;
  name: string;
  responseTime: string;
  delay: number;
}> = ({ emoji, name, responseTime, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: "22px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        border: "1px solid rgba(255,209,102,0.08)",
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <span style={{ fontSize: 36, flexShrink: 0 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 22,
            fontWeight: 700,
            color: LIGHT_TEXT,
            marginBottom: 4,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 16,
            color: SUBTLE_TEXT,
          }}
        >
          {responseTime}
        </div>
      </div>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: SUCCESS,
          boxShadow: `0 0 8px ${SUCCESS}60`,
          flexShrink: 0,
        }}
      />
    </div>
  );
};

/* ─── Scene 1: Clock + Channels ─── */
const SupportScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="20%" size={500} opacity={0.08} />

      <div
        style={{
          padding: "80px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <SectionLabel text="SUPPORT" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "18px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          תמיכה{"\n"}
          <GoldText>בכל שעה</GoldText>
        </h2>

        <div style={{ marginBottom: 40 }}>
          <GoldLine width={120} delay={10} />
        </div>

        {/* Clock */}
        <AnimatedClock delay={5} />

        {/* Support channels */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 70,
            width: "100%",
          }}
        >
          <ChannelCard emoji="💬" name="צ׳אט חי" responseTime="זמן תגובה: 2 דקות" delay={35} />
          <ChannelCard emoji="📧" name="אימייל" responseTime="זמן תגובה: שעה" delay={45} />
          <ChannelCard emoji="📞" name="טלפון" responseTime="זמן תגובה: מיידי" delay={55} />
          <ChannelCard emoji="📚" name="מרכז ידע" responseTime="מאות מאמרים ומדריכים" delay={65} />
        </div>

        {/* Badge */}
        <div style={{ marginTop: 30 }}>
          <Badge text="תמיכה מלאה 24/7 ✨" color={SUCCESS} delay={80} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const SupportCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        אנחנו כאן בשבילך{"\n"}
        <GoldText>תמיד</GoldText>
      </>
    }
    buttonText="התחל עם תמיכה מלאה"
    freeText="התחל בחינם — ₪0/חודש"
  />
);

/* ─── Main Composition ─── */
export const Ad39_Support247_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160} premountFor={10}>
        <SupportScene />
      </Sequence>
      <Sequence from={160} durationInFrames={80} premountFor={15}>
        <SupportCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
