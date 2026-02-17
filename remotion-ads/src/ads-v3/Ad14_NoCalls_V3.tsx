/**
 * Ad14 — No More Phone Calls V3
 * Ringing phone → X'd out → Automated booking solution
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
  RED,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  PainCard,
  EmojiFeature,
  CTAScene,
} from "./shared";

/* ─── Scene 1: The Problem + Solution ─── */
const NoCallsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone shake animation
  const shakePhase = frame < 60;
  const shake = shakePhase
    ? Math.sin(frame * 1.5) * interpolate(frame, [0, 10, 50, 60], [0, 8, 8, 0], {
        extrapolateRight: "clamp",
      })
    : 0;

  const phoneScale = spring({ frame, fps, config: { damping: 8, stiffness: 60 } });

  // X animation over phone
  const xEnter = spring({
    frame: frame - 55,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  // Solution section
  const solutionEnter = spring({
    frame: frame - 80,
    fps,
    config: { damping: 14, stiffness: 60 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow
        x="50%"
        y="25%"
        size={400}
        color={frame < 70 ? RED : SUCCESS}
        opacity={0.07}
      />

      <div
        style={{
          padding: "70px 48px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
        }}
      >
        {/* Ringing Phone Icon */}
        <div
          style={{
            position: "relative",
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          <div
            style={{
              fontSize: 100,
              transform: `scale(${phoneScale}) rotate(${shake}deg)`,
              opacity: phoneScale,
            }}
          >
            📞
          </div>

          {/* Ring waves */}
          {shakePhase && (
            <>
              {[0, 1, 2].map((i) => {
                const waveOpacity = interpolate(
                  (frame + i * 10) % 30,
                  [0, 15, 30],
                  [0.5, 0.2, 0]
                );
                const waveScale = interpolate(
                  (frame + i * 10) % 30,
                  [0, 30],
                  [1, 2]
                );
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      border: `2px solid ${RED}`,
                      transform: `translate(-50%, -50%) scale(${waveScale})`,
                      opacity: waveOpacity,
                      pointerEvents: "none",
                    }}
                  />
                );
              })}
            </>
          )}

          {/* X overlay */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${xEnter})`,
              opacity: xEnter,
              fontSize: 120,
              color: RED,
              fontWeight: 900,
              textShadow: `0 0 20px ${RED}60`,
              lineHeight: 1,
            }}
          >
            ✕
          </div>
        </div>

        {/* Problem headline */}
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 6px",
            opacity: interpolate(frame, [5, 20], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {frame < 70 ? (
            "נמאס מהשיחות?"
          ) : (
            <>
              <span style={{ color: RED, textDecoration: "line-through" }}>שיחות</span>
              {" → "}
              <GoldText>אוטומציה</GoldText>
            </>
          )}
        </h2>

        {/* Pain cards (shown first) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: "100%",
            marginTop: 24,
            opacity: interpolate(frame, [0, 10, 70, 85], [0, 1, 1, 0], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <PainCard emoji="📞" text="שיחות בזמן הקלטה" delay={10} strikeDelay={55} />
          <PainCard emoji="😤" text="לקוחות שלא עונים" delay={20} strikeDelay={60} />
          <PainCard emoji="⏰" text="בזבוז שעות על תיאום" delay={30} strikeDelay={65} />
        </div>

        {/* Solution features (appear after X) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: "100%",
            marginTop: 20,
            opacity: solutionEnter,
            transform: `translateY(${interpolate(solutionEnter, [0, 1], [50, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 22,
              fontWeight: 600,
              color: SUCCESS,
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: SUCCESS,
                boxShadow: `0 0 8px ${SUCCESS}`,
              }}
            />
            הפתרון של Studioz:
          </div>
          <EmojiFeature emoji="🤖" label="הזמנות אוטומטיות 24/7" delay={85} />
          <EmojiFeature emoji="💬" label="אישורים והודעות אוטומטיים" delay={95} />
          <EmojiFeature emoji="📱" label="הלקוח מזמין בעצמו" delay={105} />
        </div>

        {/* Bottom stat */}
        <p
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 28,
            fontWeight: 700,
            color: GOLD,
            textAlign: "center",
            marginTop: "auto",
            marginBottom: 20,
            opacity: interpolate(frame, [115, 130], [0, 1], {
              extrapolateRight: "clamp",
            }),
            filter: `drop-shadow(0 0 15px ${GOLD}30)`,
          }}
        >
          -90% שיחות טלפון 🎯
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const NoCallsCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        תפסיק לרדוף{"\n"}
        <GoldText>תתחיל לקבל</GoldText>
      </>
    }
    buttonText="הפעל הזמנות אוטומטיות"
    freeText="התחל בחינם — ₪0/חודש"
    subText="ללא שיחות · ללא טרחה"
  />
);

/* ─── Main Composition ─── */
export const Ad14_NoCalls_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <NoCallsScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <NoCallsCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
