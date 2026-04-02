/**
 * Ad3_ProductShowcase_V6
 * Theme: Solution showcase — dashboard + feature pills
 * Duration: 240 frames (8s) at 30fps, 1080×1920
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Calendar, CreditCard, BarChart3 } from "lucide-react";
import {
  COLORS,
  RTL,
  PremiumBackground,
  SafeZone,
  Headline,
  Subheadline,
  AccentText,
  Label,
  PhoneFrame,
  FeaturePill,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Intro ─── */
const SceneIntro: React.FC = () => (
  <AbsoluteFill style={{ ...RTL }}>
    <PremiumBackground variant="cool" />
    <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: 20 }}>
      <Label text="THE SOLUTION" delay={5} />
      <div style={{ marginTop: 12 }}>
        <Headline delay={10}>
          {"הכל במקום "}
          <AccentText>אחד</AccentText>
        </Headline>
      </div>
      <div style={{ marginTop: 8 }}>
        <Subheadline delay={18}>דשבורד חכם שעובד בשבילך</Subheadline>
      </div>
    </SafeZone>
  </AbsoluteFill>
);

/* ─── Scene 2: Phone + Feature Pills ─── */
const SceneShowcase: React.FC = () => (
  <AbsoluteFill style={{ ...RTL }}>
    <PremiumBackground variant="cool" />
    <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: 24 }}>
      <PhoneFrame
        src="images/optimized/Dashboard-Overview-Mobile.png"
        delay={5}
        width={340}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        <FeaturePill Icon={Calendar} text="הזמנות" delay={20} color={COLORS.blue} />
        <FeaturePill Icon={CreditCard} text="תשלומים" delay={28} color={COLORS.green} />
        <FeaturePill Icon={BarChart3} text="אנליטיקס" delay={36} color={COLORS.purple} />
      </div>
    </SafeZone>
  </AbsoluteFill>
);

/* ─── Scene 3: CTA ─── */
const SceneCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        {"ניהול אולפן "}
        <AccentText>ברמה אחרת</AccentText>
      </>
    }
    variant="cool"
  />
);

/* ─── Main Export ─── */
export const Ad3_ProductShowcase_V6: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80}>
      <SceneIntro />
    </Sequence>
    <Sequence from={70} durationInFrames={100}>
      <SceneShowcase />
    </Sequence>
    <Sequence from={160} durationInFrames={80}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
