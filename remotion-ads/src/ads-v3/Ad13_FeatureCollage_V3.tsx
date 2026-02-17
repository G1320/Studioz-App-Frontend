/**
 * Ad13 — Feature Collage V3
 * 2x3 grid of feature cards with staggered bounce animation
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
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_BOUNCY,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  CTAScene,
  SectionLabel,
} from "./shared";

const FEATURES = [
  { emoji: "📅", title: "הזמנות", desc: "ניהול הזמנות חכם" },
  { emoji: "💳", title: "תשלומים", desc: "גבייה אוטומטית" },
  { emoji: "📊", title: "אנליטיקס", desc: "נתונים בזמן אמת" },
  { emoji: "🔔", title: "התראות", desc: "עדכונים מיידיים" },
  { emoji: "👥", title: "CRM", desc: "ניהול לקוחות" },
  { emoji: "🎨", title: "מיתוג", desc: "עיצוב מותאם אישית" },
];

/* ─── Emoji Feature Card (grid variant) ─── */
const GridFeatureCard: React.FC<{
  emoji: string;
  title: string;
  desc: string;
  delay: number;
  index: number;
}> = ({ emoji, title, desc, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  // Hover-like pulse for visual interest
  const hoverPulse = interpolate(
    Math.sin(frame * 0.04 + index * 1.2),
    [-1, 1],
    [0.98, 1.02]
  );

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 22,
        padding: "28px 20px",
        border: `1px solid ${GOLD}10`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity: enter,
        transform: `scale(${enter * hoverPulse}) translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
        flex: 1,
      }}
    >
      <span style={{ fontSize: 48 }}>{emoji}</span>
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 24,
          fontWeight: 700,
          color: LIGHT_TEXT,
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 16,
          color: SUBTLE_TEXT,
          textAlign: "center",
        }}
      >
        {desc}
      </span>
    </div>
  );
};

/* ─── Scene 1: Feature Grid ─── */
const CollageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="50%" size={600} opacity={0.07} />

      <div
        style={{
          padding: "70px 40px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <SectionLabel text="הכל במקום אחד" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "14px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          כל מה שצריך{"\n"}
          <GoldText>בפלטפורמה אחת</GoldText>
        </h2>

        <div
          style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}
        >
          <GoldLine width={140} delay={10} />
        </div>

        {/* 2x3 Grid */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Row 1 */}
          <div style={{ display: "flex", gap: 16 }}>
            {FEATURES.slice(0, 2).map((f, i) => (
              <GridFeatureCard
                key={i}
                {...f}
                delay={15 + i * 12}
                index={i}
              />
            ))}
          </div>
          {/* Row 2 */}
          <div style={{ display: "flex", gap: 16 }}>
            {FEATURES.slice(2, 4).map((f, i) => (
              <GridFeatureCard
                key={i + 2}
                {...f}
                delay={39 + i * 12}
                index={i + 2}
              />
            ))}
          </div>
          {/* Row 3 */}
          <div style={{ display: "flex", gap: 16 }}>
            {FEATURES.slice(4, 6).map((f, i) => (
              <GridFeatureCard
                key={i + 4}
                {...f}
                delay={63 + i * 12}
                index={i + 4}
              />
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 22,
            color: GOLD,
            textAlign: "center",
            marginTop: 24,
            opacity: interpolate(frame, [100, 118], [0, 1], {
              extrapolateRight: "clamp",
            }),
            filter: `drop-shadow(0 0 12px ${GOLD}25)`,
          }}
        >
          ועוד הרבה יותר... ✨
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const CollageCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        פלטפורמה אחת,{"\n"}
        <GoldText>אינסוף אפשרויות</GoldText>
      </>
    }
    buttonText="התחל בחינם"
    freeText="6 כלים בחינם — ₪0/חודש"
    subText="ללא כרטיס אשראי · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad13_FeatureCollage_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <CollageScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <CollageCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
