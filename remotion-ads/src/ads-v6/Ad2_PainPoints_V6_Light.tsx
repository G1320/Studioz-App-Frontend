/**
 * Ad2_PainPoints_V6_Light — LIGHT MODE
 * Theme: Pain points with strikethrough → solution CTA
 * Duration: 240 frames (8s) at 30fps, 1080×1920
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { PhoneOff, Clock, DollarSign } from "lucide-react";
import {
  RTL,
  PremiumBackground,
  SafeZone,
  Headline,
  AccentText,
  Label,
  PainPoint,
  CTAScene,
  GoldLine,
} from "./shared-light";

/* ─── Scene 1: Hook ─── */
const SceneHook: React.FC = () => (
  <AbsoluteFill style={{ ...RTL }}>
    <PremiumBackground variant="warm" />
    <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: 20 }}>
      <Label text="THE PROBLEM" delay={5} />
      <div style={{ marginTop: 12 }}>
        <Headline delay={10}>
          <AccentText>עדיין</AccentText>
          {" מנהל\nאת האולפן ידנית?"}
        </Headline>
      </div>
      <div style={{ marginTop: 16 }}>
        <GoldLine delay={25} width={120} />
      </div>
    </SafeZone>
  </AbsoluteFill>
);

/* ─── Scene 2: Pain Points ─── */
const ScenePains: React.FC = () => (
  <AbsoluteFill style={{ ...RTL }}>
    <PremiumBackground variant="warm" />
    <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
        <PainPoint
          Icon={PhoneOff}
          text="שיחות טלפון אינסופיות"
          delay={5}
          strikeFrame={40}
        />
        <PainPoint
          Icon={Clock}
          text="ביטולים ברגע האחרון"
          delay={12}
          strikeFrame={50}
        />
        <PainPoint
          Icon={DollarSign}
          text="הזמנות שנופלות בין הכיסאות"
          delay={19}
          strikeFrame={60}
        />
      </div>
    </SafeZone>
  </AbsoluteFill>
);

/* ─── Scene 3: CTA ─── */
const SceneCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        {"יש דרך "}
        <AccentText>טובה יותר</AccentText>
      </>
    }
    variant="warm"
  />
);

/* ─── Main Export ─── */
export const Ad2_PainPoints_V6_Light: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80}>
      <SceneHook />
    </Sequence>
    <Sequence from={70} durationInFrames={100}>
      <ScenePains />
    </Sequence>
    <Sequence from={160} durationInFrames={80}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
