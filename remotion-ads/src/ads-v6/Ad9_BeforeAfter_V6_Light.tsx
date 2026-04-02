/**
 * Ad9_BeforeAfter_V6_Light (LIGHT MODE)
 * Theme: Before/After transformation — pain points, solution showcase, CTA
 * Duration: 240 frames (8s) at 30fps, 1080×1920
 * V6 Light: Blue/green accents, warm stone neutrals, no gold.
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { PhoneOff, Clock, DollarSign, Zap, TrendingUp } from "lucide-react";
import {
  RTL,
  useScale,
  PremiumBackground,
  SafeZone,
  Headline,
  Subheadline,
  AccentText,
  Label,
  PainPoint,
  PhoneFrame,
  FeatureRow,
  CTAScene,
} from "./shared-light";

/* ─── Scene 1: Before ─── */
const SceneBefore: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="warm" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(20) }}>
        <Label text="TRANSFORMATION" delay={5} />
        <div style={{ marginTop: s(8) }}>
          <Headline delay={10}>
            {"לפני "}
            <AccentText>Studioz</AccentText>
          </Headline>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: s(12), width: "100%", marginTop: s(16) }}>
          <PainPoint Icon={PhoneOff} text="שיחות טלפון אינסופיות" delay={18} />
          <PainPoint Icon={Clock} text="ניהול ידני של הזמנות" delay={26} />
          <PainPoint Icon={DollarSign} text="אין תמונה ברורה על ההכנסות" delay={34} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: After ─── */
const SceneAfter: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="emerald" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(16) }}>
        <Label text="AFTER" delay={5} />
        <Headline delay={8}>
          {"אחרי "}
          <AccentText>Studioz</AccentText>
        </Headline>
        <div style={{ marginTop: s(8), alignSelf: "center" }}>
          <PhoneFrame
            src="images/optimized/Dashboard-Overview-Mobile.png"
            delay={12}
            width={300}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: s(14), width: "100%", marginTop: s(16) }}>
          <FeatureRow Icon={Zap} title="הכל אוטומטי" delay={25} />
          <FeatureRow Icon={TrendingUp} title="צמיחה של 30%+" delay={32} />
          <FeatureRow Icon={Clock} title="חסכון של 15 שעות/שבוע" delay={39} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const SceneCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        {"שדרג את "}
        <AccentText>האולפן שלך</AccentText>
      </>
    }
    variant="emerald"
  />
);

/* ─── Main Export ─── */
export const Ad9_BeforeAfter_V6_Light: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80}>
      <SceneBefore />
    </Sequence>
    <Sequence from={70} durationInFrames={100}>
      <SceneAfter />
    </Sequence>
    <Sequence from={160} durationInFrames={80}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
