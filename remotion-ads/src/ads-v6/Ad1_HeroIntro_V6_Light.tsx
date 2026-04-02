/**
 * Ad1_HeroIntro_V6_Light — LIGHT MODE
 * Theme: Brand intro — hook, dashboard showcase, CTA
 * Duration: 240 frames (8s) at 30fps, 1080×1920
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import {
  RTL,
  PremiumBackground,
  SafeZone,
  Headline,
  Subheadline,
  AccentText,
  Label,
  PhoneFrame,
  Footer,
  CTAScene,
  GoldLine,
} from "./shared-light";

/* ─── Scene 1: Hook ─── */
const SceneHook: React.FC = () => (
  <AbsoluteFill style={{ ...RTL }}>
    <PremiumBackground />
    <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: 20 }}>
      <Label text="STUDIOZ" delay={5} />
      <div style={{ marginTop: 12 }}>
        <Headline delay={10}>
          {"האולפן שלך.\n"}
          <AccentText>הקצב שלנו.</AccentText>
        </Headline>
      </div>
      <div style={{ marginTop: 8 }}>
        <Subheadline delay={20}>ניהול אולפנים חכם. חינם לתמיד.</Subheadline>
      </div>
      <div style={{ marginTop: 16 }}>
        <GoldLine delay={28} width={120} />
      </div>
    </SafeZone>
  </AbsoluteFill>
);

/* ─── Scene 2: Dashboard Phone ─── */
const ScenePhone: React.FC = () => (
  <AbsoluteFill style={{ ...RTL }}>
    <PremiumBackground variant="cool" />
    <SafeZone style={{ alignItems: "center", justifyContent: "center" }}>
      <PhoneFrame
        src="images/optimized/Dashboard-Overview-Mobile.png"
        delay={5}
        width={380}
      />
      <div style={{ marginTop: 30 }}>
        <Footer delay={20} />
      </div>
    </SafeZone>
  </AbsoluteFill>
);

/* ─── Scene 3: CTA ─── */
const SceneCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        {"התחל "}
        <AccentText>בחינם</AccentText>
        {" — לתמיד"}
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad1_HeroIntro_V6_Light: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80}>
      <SceneHook />
    </Sequence>
    <Sequence from={70} durationInFrames={90}>
      <ScenePhone />
    </Sequence>
    <Sequence from={150} durationInFrames={90}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
