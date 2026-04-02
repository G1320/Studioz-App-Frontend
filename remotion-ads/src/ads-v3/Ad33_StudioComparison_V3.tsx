/**
 * Ad33 — Studio Comparison V3
 * Studioz vs "ניהול ידני" comparison table with check/cross marks
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
  DARK_CARD_HOVER,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RED,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  Badge,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Comparison Row ─── */
const ComparisonRow: React.FC<{
  feature: string;
  studiozHas: boolean;
  manualHas: boolean;
  delay: number;
  isLast?: boolean;
}> = ({ feature, studiozHas, manualHas, delay, isLast = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 12 } });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: DARK_CARD,
        borderRadius: 16,
        padding: "20px 24px",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
        border: `1px solid rgba(255,209,102,0.06)`,
        borderBottom: isLast ? undefined : `1px solid rgba(255,255,255,0.04)`,
      }}
    >
      {/* Feature name */}
      <div
        style={{
          flex: 1,
          fontFamily: FONT_BODY,
          fontSize: 22,
          color: LIGHT_TEXT,
          fontWeight: 500,
        }}
      >
        {feature}
      </div>

      {/* Studioz column */}
      <div
        style={{
          width: 100,
          textAlign: "center",
          fontSize: 30,
        }}
      >
        {studiozHas ? "✅" : "❌"}
      </div>

      {/* Manual column */}
      <div
        style={{
          width: 100,
          textAlign: "center",
          fontSize: 30,
        }}
      >
        {manualHas ? "✅" : "❌"}
      </div>
    </div>
  );
};

/* ─── Scene 1: Comparison Table ─── */
const ComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  const features = [
    { feature: "הזמנות אונליין", studioz: true, manual: false },
    { feature: "סליקה אוטומטית", studioz: true, manual: false },
    { feature: "אנליטיקס מתקדם", studioz: true, manual: false },
    { feature: "SEO מובנה", studioz: true, manual: false },
    { feature: "CRM לקוחות", studioz: true, manual: false },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="30%" y="20%" size={400} opacity={0.08} />
      <RadialGlow x="70%" y="80%" size={400} color={SUCCESS} opacity={0.05} />

      <div
        style={{
          padding: "80px 40px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <SectionLabel text="COMPARISON" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "16px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          <GoldText>Studioz</GoldText> לעומת{"\n"}ניהול ידני
        </h2>

        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Column Headers */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 24px 16px",
            opacity: interpolate(frame, [10, 25], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ flex: 1 }} />
          <div
            style={{
              width: 100,
              textAlign: "center",
            }}
          >
            <Img
              src={staticFile("logo.png")}
              style={{ width: 36, height: 36, borderRadius: 8 }}
            />
          </div>
          <div
            style={{
              width: 100,
              textAlign: "center",
              fontFamily: FONT_BODY,
              fontSize: 15,
              color: SUBTLE_TEXT,
            }}
          >
            ידני 📋
          </div>
        </div>

        {/* Comparison Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {features.map((f, i) => (
            <ComparisonRow
              key={i}
              feature={f.feature}
              studiozHas={f.studioz}
              manualHas={f.manual}
              delay={15 + i * 10}
              isLast={i === features.length - 1}
            />
          ))}
        </div>

        {/* Winner badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 30,
            opacity: interpolate(frame, [85, 105], [0, 1], {
              extrapolateRight: "clamp",
            }),
            transform: `scale(${interpolate(frame, [85, 105], [0.8, 1], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          <Badge text="Studioz מנצח בכל הקטגוריות 🏆" color={SUCCESS} delay={85} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const ComparisonCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        למה להתפשר?{"\n"}
        <GoldText>עבור ל-Studioz</GoldText>
      </>
    }
    buttonText="שדרג את הניהול שלך"
    freeText="חינם לתמיד — כל התכונות כלולות"
  />
);

/* ─── Main Composition ─── */
export const Ad33_StudioComparison_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160} premountFor={10}>
        <ComparisonScene />
      </Sequence>
      <Sequence from={160} durationInFrames={80} premountFor={15}>
        <ComparisonCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
