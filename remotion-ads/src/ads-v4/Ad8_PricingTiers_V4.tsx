/**
 * Ad8_PricingTiers_V4
 * Theme: Pricing — correct prices only
 * Duration: 240 frames (8s) at 30fps, 1080x1920
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
import { Gift, Zap, Crown } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  ACCENT_BLUE,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  CTAScene,
  type LucideIcon,
} from "./shared";

/* ─── Pricing Card Component ─── */
const PricingCard: React.FC<{
  Icon: LucideIcon;
  name: string;
  price: string;
  period: string;
  features: string[];
  accent: string;
  delay: number;
  highlighted?: boolean;
}> = ({ Icon, name, price, period, features, accent, delay, highlighted = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 22,
        padding: "28px 24px",
        border: `1px solid ${highlighted ? accent : `${accent}15`}`,
        transform: `scale(${enter})`,
        opacity: enter,
        boxShadow: highlighted
          ? `0 8px 40px ${accent}20, 0 0 30px ${accent}08`
          : "0 6px 28px rgba(0,0,0,0.25)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {highlighted && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: `${accent}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={22} color={accent} strokeWidth={1.8} />
        </div>
        <span
          style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 700, color: LIGHT_TEXT }}
        >
          {name}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 16 }}>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 44,
            fontWeight: 700,
            color: accent,
            filter: `drop-shadow(0 0 10px ${accent}18)`,
          }}
        >
          {price}
        </span>
        <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: SUBTLE_TEXT }}>{period}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: accent,
                flexShrink: 0,
              }}
            />
            <span style={{ fontFamily: FONT_BODY, fontSize: 17, color: SUBTLE_TEXT }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Scene 1: Title ─── */
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="50%" size={700} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "60px 50px",
          gap: 20,
        }}
      >
        <SectionLabel text="PRICING" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 56,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-30, 0])}px)`,
          }}
        >
          {"תוכניות "}
          <GoldText>{"מחיר"}</GoldText>
        </h1>

        <GoldLine delay={10} width={140} />

        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 24,
            color: SUBTLE_TEXT,
            textAlign: "center",
            margin: 0,
            opacity: interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {"תוכנית לכל גודל עסק"}
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Pricing Cards ─── */
const SceneCards: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
    <NoiseOverlay />
    <AmbientParticles count={12} />
    <RadialGlow x="50%" y="45%" size={600} opacity={0.07} />

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "80px 40px 60px",
        height: "100%",
        justifyContent: "center",
        gap: 18,
      }}
    >
      <PricingCard
        Icon={Gift}
        name="Free"
        price="₪0"
        period="/חודש"
        features={["1 ליסטינג", "3 שירותים", "יומן בסיסי"]}
        accent={SUCCESS}
        delay={5}
      />

      <PricingCard
        Icon={Zap}
        name="Starter"
        price="₪49"
        period="/חודש"
        features={[
          "שירותים ללא הגבלה",
          "סנכרון Google Calendar",
          "חשבוניות",
          "25 תשלומי כרטיס/חודש",
        ]}
        accent={ACCENT_BLUE}
        delay={15}
      />

      <PricingCard
        Icon={Crown}
        name="Pro"
        price="₪99"
        period="/חודש"
        features={[
          "ליסטינגים ללא הגבלה",
          "אנליטיקס",
          "200 תשלומי כרטיס/חודש",
          "תמיכה עדיפה",
        ]}
        accent={GOLD}
        delay={25}
        highlighted
      />
    </div>
  </AbsoluteFill>
);

/* ─── Scene 3: CTA ─── */
const SceneCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        <GoldText>{"התחל בחינם"}</GoldText>
        {"\n"}
        {"ושדרג כשתצטרך"}
      </>
    }
    badgeText="התחל בחינם — ₪0/חודש"
  />
);

/* ─── Main Export ─── */
export const Ad8_PricingTiers_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneTitle />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneCards />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
