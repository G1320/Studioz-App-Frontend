/**
 * Ad44 — Studio Comparison 2 V3
 * Extended three-column comparison: Studioz vs WhatsApp vs Excel
 * ✅/❌/⚠️ indicators, detailed feature categories
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
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Comparison Row ─── */
const ComparisonRow: React.FC<{
  label: string;
  studioz: "✅" | "❌" | "⚠️";
  whatsapp: "✅" | "❌" | "⚠️";
  excel: "✅" | "❌" | "⚠️";
  delay?: number;
}> = ({ label, studioz, whatsapp, excel, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)`,
      }}
    >
      <div
        style={{
          flex: 2.2,
          fontFamily: FONT_BODY,
          fontSize: 20,
          color: LIGHT_TEXT,
          paddingRight: 10,
        }}
      >
        {label}
      </div>
      {[studioz, whatsapp, excel].map((val, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 28,
            filter:
              val === "✅"
                ? `drop-shadow(0 0 6px ${SUCCESS}60)`
                : val === "❌"
                ? `drop-shadow(0 0 6px ${RED}60)`
                : "none",
          }}
        >
          {val}
        </div>
      ))}
    </div>
  );
};

/* ─── Scene 1: Comparison Table ─── */
const ComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  const rows: {
    label: string;
    studioz: "✅" | "❌" | "⚠️";
    whatsapp: "✅" | "❌" | "⚠️";
    excel: "✅" | "❌" | "⚠️";
  }[] = [
    { label: "הזמנות אוטומטיות", studioz: "✅", whatsapp: "❌", excel: "❌" },
    { label: "תשלום אונליין", studioz: "✅", whatsapp: "❌", excel: "❌" },
    { label: "סנכרון יומן", studioz: "✅", whatsapp: "❌", excel: "⚠️" },
    { label: "תזכורות אוטומטיות", studioz: "✅", whatsapp: "❌", excel: "❌" },
    { label: "דף סטודיו מקצועי", studioz: "✅", whatsapp: "❌", excel: "❌" },
    { label: "ניהול לקוחות", studioz: "✅", whatsapp: "⚠️", excel: "⚠️" },
    { label: "דוחות והכנסות", studioz: "✅", whatsapp: "❌", excel: "⚠️" },
    { label: "גישה מהנייד", studioz: "✅", whatsapp: "✅", excel: "❌" },
    { label: "ביטולים אוטומטיים", studioz: "✅", whatsapp: "❌", excel: "❌" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="30%" y="15%" size={400} opacity={0.06} />

      <div
        style={{
          padding: "70px 36px 60px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <SectionLabel text="השוואה מלאה" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "10px 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          למה <GoldText>Studioz</GoldText>?
        </h2>

        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <GoldLine width={120} delay={8} />
        </div>

        {/* Column headers */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            marginBottom: 16,
            opacity: interpolate(frame, [10, 22], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ flex: 2.2 }} />
          {[
            { name: "Studioz", color: GOLD },
            { name: "WhatsApp", color: SUBTLE_TEXT },
            { name: "Excel", color: SUBTLE_TEXT },
          ].map((col, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                fontFamily: FONT_HEADING,
                fontSize: 16,
                fontWeight: 700,
                color: col.color,
                letterSpacing: 0.5,
              }}
            >
              {col.name}
            </div>
          ))}
        </div>

        {/* Separator */}
        <div
          style={{
            height: 1,
            backgroundColor: `${GOLD}15`,
            marginBottom: 12,
          }}
        />

        {/* Rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            flex: 1,
          }}
        >
          {rows.map((row, i) => (
            <ComparisonRow
              key={i}
              label={row.label}
              studioz={row.studioz}
              whatsapp={row.whatsapp}
              excel={row.excel}
              delay={14 + i * 6}
            />
          ))}
        </div>

        {/* Bottom verdict */}
        <p
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 30,
            fontWeight: 600,
            color: GOLD,
            textAlign: "center",
            marginTop: 30,
            opacity: interpolate(frame, [90, 110], [0, 1], {
              extrapolateRight: "clamp",
            }),
            filter: `drop-shadow(0 0 15px ${GOLD}30)`,
          }}
        >
          הבחירה ברורה 🏆
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const ComparisonCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        עבור לפלטפורמה
        {"\n"}
        <GoldText>שעובדת בשבילך</GoldText>
      </>
    }
    buttonText="התחל עם Studioz בחינם"
    freeText="חינם לחלוטין — ₪0/חודש"
    subText="ללא כרטיס אשראי · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad44_StudioComparison2_V3: React.FC = () => {
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
