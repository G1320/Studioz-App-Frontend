/**
 * Ad5 — Analytics Dashboard
 * 240 frames (8s) at 30fps, 1080×1920 (9:16 portrait)
 * V6: Premium glass morphism, safe zone aware, device frames.
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  RTL,
  COLORS,
  useScale,
  PremiumBackground,
  SafeZone,
  Label,
  Headline,
  Subheadline,
  AccentText,
  PhoneFrame,
  GlassCard,
  StatDisplay,
  GoldLine,
  Footer,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Analytics Intro ─── */
const Scene1: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={RTL}>
      <PremiumBackground variant="cool" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(20) }}>
        <Label text="ANALYTICS" delay={0} />
        <Headline delay={5}>
          תמונה <AccentText>מלאה</AccentText>
          {"\n"}על האולפן
        </Headline>
        <GoldLine delay={15} width={120} />
        <Subheadline delay={12}>
          מעקב הכנסות, תחזיות, והתנהגות לקוחות
        </Subheadline>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={20} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Screenshot + Stats ─── */
const Scene2: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={RTL}>
      <PremiumBackground variant="cool" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(20) }}>
        <PhoneFrame
          src="images/optimized/Dashboard-Analytics-Mobile.png"
          delay={5}
          width={340}
        />
        <GlassCard delay={20} style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <StatDisplay value="₪18K" label="הכנסות חודשיות" delay={25} color={COLORS.accent} />
            <StatDisplay value="94%" label="שביעות רצון" delay={30} color={COLORS.green} />
            <StatDisplay value="↑23%" label="צמיחה" delay={35} color={COLORS.blue} />
          </div>
        </GlassCard>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={40} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const Scene3: React.FC = () => (
  <CTAScene
    headline={
      <>
        נתונים <AccentText>שעובדים</AccentText> בשבילך
      </>
    }
    variant="cool"
  />
);

/* ─── Main Export ─── */
export const Ad5_Analytics_V6: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <Scene1 />
    </Sequence>
    <Sequence from={70} durationInFrames={100} premountFor={15}>
      <Scene2 />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <Scene3 />
    </Sequence>
  </AbsoluteFill>
);
