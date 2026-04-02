/**
 * Ad8_FreeForever_V6_Light (LIGHT MODE)
 * Theme: Free forever pricing — zero subscription, progressive fees, CTA
 * Duration: 240 frames (8s) at 30fps, 1080×1920
 * V6 Light: Blue/green accents, warm stone neutrals, no gold.
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import {
  COLORS,
  FONT,
  RTL,
  SPRING,
  useScale,
  PremiumBackground,
  SafeZone,
  Headline,
  Subheadline,
  AccentText,
  Label,
  GlassCard,
  CTAScene,
} from "./shared-light";

/* ─── Scene 1: Free Forever ─── */
const SceneFree: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const priceEnter = spring({ frame: frame - 25, fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="emerald" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(12) }}>
        <Label text="PRICING" delay={5} />
        <div style={{ marginTop: s(12) }}>
          <Headline delay={10}>
            {"חינם.\n"}
            <AccentText>לתמיד.</AccentText>
          </Headline>
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: s(100),
            fontWeight: 900,
            color: COLORS.accent,
            textAlign: "center",
            letterSpacing: "-0.03em",
            filter: `drop-shadow(0 0 30px ${COLORS.accent}30)`,
            opacity: priceEnter,
            transform: `scale(${interpolate(priceEnter, [0, 1], [0.7, 1])})`,
            marginTop: s(8),
          }}
        >
          ₪0
        </div>
        <Subheadline delay={30} size={26}>דמי מנוי</Subheadline>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ─── Fee Tier Card ─── */
const FeeTierCard: React.FC<{
  rate: string;
  label: string;
  range: string;
  color: string;
  delay: number;
}> = ({ rate, label, range, color, delay }) => {
  const s = useScale();

  return (
    <GlassCard delay={delay} style={{ display: "flex", alignItems: "center", gap: s(24), padding: `${s(22)}px ${s(28)}px` }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: s(52),
          fontWeight: 900,
          color,
          letterSpacing: "-0.02em",
          filter: `drop-shadow(0 0 15px ${color}25)`,
          flexShrink: 0,
          minWidth: s(90),
          textAlign: "center",
        }}
      >
        {rate}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: s(4) }}>
        <span style={{ fontFamily: FONT, fontSize: s(22), fontWeight: 700, color: COLORS.text }}>
          {label}
        </span>
        <span style={{ fontFamily: FONT, fontSize: s(17), color: COLORS.textSecondary }}>
          {range}
        </span>
      </div>
    </GlassCard>
  );
};

/* ─── Scene 2: Progressive Fees ─── */
const SceneFees: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(18) }}>
        <Subheadline delay={5} size={22}>
          עמלות פרוגרסיביות — אנחנו מרוויחים רק כשאתה מרוויח
        </Subheadline>
        <div style={{ display: "flex", flexDirection: "column", gap: s(14), width: "100%", marginTop: s(12) }}>
          <FeeTierCard rate="9%" label="בהתחלה" range="₪0 – ₪15,000" color={COLORS.accent} delay={12} />
          <FeeTierCard rate="7%" label="בצמיחה" range="₪15,001 – ₪40,000" color={COLORS.blue} delay={22} />
          <FeeTierCard rate="5%" label="בשיא" range="₪40,001+" color={COLORS.green} delay={32} />
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
        <AccentText>חינם לתמיד</AccentText>
        {"\n"}
        כל התכונות כלולות
      </>
    }
    badgeText="₪0 דמי מנוי"
    buttonText="התחל עכשיו"
    variant="emerald"
  />
);

/* ─── Main Export ─── */
export const Ad8_FreeForever_V6_Light: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={90}>
      <SceneFree />
    </Sequence>
    <Sequence from={80} durationInFrames={90}>
      <SceneFees />
    </Sequence>
    <Sequence from={160} durationInFrames={80}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
