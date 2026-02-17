/**
 * Ad22 — Automatic Invoicing (Sumit / Green Invoice)
 * 240 frames (8s) at 30fps, 1080x1920 (9:16 portrait)
 * V5: Dashboard-Documents screenshot showing income and invoices.
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";
import { FileText, Zap, Receipt, Clock } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUBTLE_TEXT,
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
  SectionLabel,
  FeatureCard,
  PainCard,
  ScreenshotFrame,
  CTAScene,
  Footer,
  useScale,
} from "./shared";

/* ─── Scene 1: Pain + Title ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="25%" size={s(500)} opacity={0.1} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(50)}px ${s(60)}px`,
          height: "100%",
        }}
      >
        <SectionLabel text="INVOICING" delay={0} />
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(50),
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.25,
            margin: `${s(30)}px ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(30), 0])}px)`,
          }}
        >
          <GoldText>חשבוניות אוטומטיות</GoldText>
        </h1>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: s(22),
            color: SUBTLE_TEXT,
            margin: `${s(10)}px ${s(35)}px`,
            lineHeight: 1.5,
            opacity: interpolate(frame, [8, 22], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
          }}
        >
          בלי לרדוף אחרי חשבוניות ידניות
        </p>
        <GoldLine delay={12} width={120} />
        <div style={{ display: "flex", flexDirection: "column", gap: s(16), marginTop: s(30) }}>
          <PainCard Icon={Clock} text="הפקת חשבוניות ידנית" delay={18} strikeDelay={55} />
          <PainCard Icon={FileText} text="מעקב ידני אחרי מסמכים" delay={26} strikeDelay={60} />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={40} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Documents Dashboard + Features ─── */
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={s(500)} opacity={0.08} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(42),
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: `0 0 ${s(25)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(20), 0])}px)`,
          }}
        >
          הכל <GoldText>אוטומטי</GoldText>
        </h2>
        <ScreenshotFrame
          src="images/optimized/Dashboard-Documents-Table.png"
            cropTop={13}
          delay={8}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: s(14), marginTop: s(25) }}>
          <FeatureCard Icon={Zap} title="Sumit / Green Invoice" desc="חיבור ישיר" delay={25} />
          <FeatureCard Icon={Receipt} title="חשבונית אוטומטית" desc="אחרי כל הזמנה" delay={33} />
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
export const Ad22_InvoiceGenerator_V5: React.FC = () => (
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
