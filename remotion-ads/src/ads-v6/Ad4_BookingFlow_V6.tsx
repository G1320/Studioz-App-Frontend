/**
 * Ad4_BookingFlow_V6
 * Theme: 3-step booking flow — how it works
 * Duration: 240 frames (8s) at 30fps, 1080×1920
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import {
  COLORS,
  FONT,
  RTL,
  SPRING,
  useScale,
  PremiumBackground,
  SafeZone,
  Headline,
  AccentText,
  Label,
  GlassCard,
  CTAScene,
} from "./shared";

/* ─── Step Card (numbered glass card) ─── */
const StepCard: React.FC<{
  num: number;
  title: string;
  desc: string;
  delay: number;
}> = ({ num, title, desc, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING.smooth });

  return (
    <GlassCard delay={delay} style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: s(18), ...RTL }}>
        <div
          style={{
            width: s(48),
            height: s(48),
            borderRadius: "50%",
            background: `${COLORS.accent}18`,
            border: `1.5px solid ${COLORS.accent}35`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: s(22),
              fontWeight: 800,
              color: COLORS.accent,
            }}
          >
            {num}
          </span>
        </div>
        <div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: s(22),
              fontWeight: 700,
              color: COLORS.text,
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: s(16),
              color: COLORS.textSecondary,
              marginTop: s(4),
              lineHeight: 1.4,
            }}
          >
            {desc}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

/* ─── Scene 1: Hook ─── */
const SceneHook: React.FC = () => (
  <AbsoluteFill style={{ ...RTL }}>
    <PremiumBackground variant="emerald" />
    <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: 20 }}>
      <Label text="HOW IT WORKS" delay={5} />
      <div style={{ marginTop: 12 }}>
        <Headline delay={10}>
          {"שלושה צעדים\nל"}
          <AccentText>אולפן מנוהל</AccentText>
        </Headline>
      </div>
    </SafeZone>
  </AbsoluteFill>
);

/* ─── Scene 2: Steps ─── */
const SceneSteps: React.FC = () => (
  <AbsoluteFill style={{ ...RTL }}>
    <PremiumBackground variant="emerald" />
    <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: 18 }}>
      <StepCard
        num={1}
        title="פרסם את האולפן"
        desc="צור דף אולפן מקצועי תוך דקות"
        delay={5}
      />
      <StepCard
        num={2}
        title="קבל הזמנות"
        desc="לקוחות מזמינים ישירות מהעמוד"
        delay={15}
      />
      <StepCard
        num={3}
        title="קבל תשלום"
        desc="תשלום אוטומטי + חשבונית"
        delay={25}
      />
    </SafeZone>
  </AbsoluteFill>
);

/* ─── Scene 3: CTA ─── */
const SceneCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        {"פשוט, מהיר, "}
        <AccentText>חינם</AccentText>
      </>
    }
    variant="emerald"
  />
);

/* ─── Main Export ─── */
export const Ad4_BookingFlow_V6: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80}>
      <SceneHook />
    </Sequence>
    <Sequence from={70} durationInFrames={100}>
      <SceneSteps />
    </Sequence>
    <Sequence from={160} durationInFrames={80}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
