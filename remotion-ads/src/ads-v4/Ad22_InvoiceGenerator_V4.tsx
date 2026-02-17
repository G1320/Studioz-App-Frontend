/**
 * Ad22 — Automatic Invoicing
 * 240 frames (8s) at 30fps, 1080x1920 (9:16 portrait)
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { FileX, FileText, Zap, CheckCircle } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  PainCard,
  FeatureCard,
  CTAScene,
  Footer,
} from "./shared";

/* ─── Scene 1: Pain Point ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.1} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
        }}
      >
        <SectionLabel text="INVOICING" delay={0} />
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.25,
            margin: "30px 0 10px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          <GoldText>חשבוניות אוטומטיות</GoldText>
        </h1>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 22,
            color: SUBTLE_TEXT,
            margin: "10px 0 40px",
            lineHeight: 1.5,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
          }}
        >
          בלי לבזבז זמן על ניהול חשבוניות
        </p>
        <GoldLine delay={12} width={120} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 40 }}>
          <PainCard
            Icon={FileX}
            text="מכינים חשבוניות ידנית?"
            delay={18}
            strikeDelay={50}
          />
        </div>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 26,
            color: LIGHT_TEXT,
            margin: "50px 0 0",
            lineHeight: 1.5,
            opacity: interpolate(frame, [55, 70], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
          }}
        >
          Studioz עושה את זה <GoldText>בשבילך</GoldText>
        </p>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={40} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Feature Cards ─── */
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="35%" size={450} opacity={0.08} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.3,
            margin: "0 0 40px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          הכל <GoldText>אוטומטי</GoldText>
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FeatureCard
            Icon={FileText}
            title="חשבונית מס אוטומטית"
            desc="נשלחת אוטומטית ללקוח"
            delay={10}
          />
          <FeatureCard
            Icon={Zap}
            title="חיבור Sumit / Green Invoice"
            desc="אינטגרציה מובנית"
            delay={20}
          />
          <FeatureCard
            Icon={CheckCircle}
            title="תואם רשויות המס"
            desc="חשבוניות מוכרות לפי חוק"
            delay={30}
            accentColor={SUCCESS}
          />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={45} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const Scene3: React.FC = () => (
  <CTAScene
    headline={
      <>
        חשבוניות <GoldText>בלי מאמץ</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad22_InvoiceGenerator_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={95} premountFor={15}>
      <Scene1 />
    </Sequence>
    <Sequence from={80} durationInFrames={105} premountFor={15}>
      <Scene2 />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <Scene3 />
    </Sequence>
  </AbsoluteFill>
);
