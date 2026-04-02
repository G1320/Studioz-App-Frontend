/**
 * Ad7 — Payments (LIGHT MODE)
 * 240 frames (8s) at 30fps, 1080×1920 (9:16 portrait)
 * V6 Light: Blue/green accents, warm stone neutrals, no gold.
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { CreditCard, Receipt, Shield } from "lucide-react";
import {
  RTL,
  useScale,
  PremiumBackground,
  SafeZone,
  Label,
  Headline,
  Subheadline,
  AccentText,
  PhoneFrame,
  GlassCard,
  FeatureRow,
  GoldLine,
  Footer,
  CTAScene,
  COLORS,
} from "./shared-light";

/* ─── Scene 1: Payments Intro ─── */
const Scene1: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={RTL}>
      <PremiumBackground variant="warm" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(20) }}>
        <Label text="PAYMENTS" delay={0} />
        <Headline delay={5}>
          תשלומים{"\n"}
          <AccentText>אוטומטיים</AccentText>
        </Headline>
        <GoldLine delay={15} width={120} />
        <Subheadline delay={12}>
          כרטיס אשראי, bit, Google Pay — הכל בקליק
        </Subheadline>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={20} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Phone + Feature Rows ─── */
const Scene2: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={RTL}>
      <PremiumBackground variant="warm" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(20) }}>
        <PhoneFrame
          src="images/optimized/Dashboard-Overview-Mobile.png"
          delay={5}
          width={320}
        />
        <GlassCard delay={18} style={{ width: "100%", display: "flex", flexDirection: "column" as const, gap: s(18) }}>
          <FeatureRow
            Icon={CreditCard}
            title="כרטיסי אשראי"
            desc="Visa, Mastercard, AMEX"
            delay={22}
            color={COLORS.accent}
          />
          <FeatureRow
            Icon={Receipt}
            title="חשבוניות אוטומטיות"
            desc="הנפקה מיידית ללקוח"
            delay={28}
            color={COLORS.green}
          />
          <FeatureRow
            Icon={Shield}
            title="תשלומים מאובטחים"
            desc="הצפנה מקצה לקצה"
            delay={34}
            color={COLORS.blue}
          />
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
        קבל <AccentText>תשלום</AccentText> בלי מאמץ
      </>
    }
    variant="warm"
  />
);

/* ─── Main Export ─── */
export const Ad7_Payments_V6_Light: React.FC = () => (
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
