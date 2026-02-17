/**
 * Ad8 — Pricing Tiers V2
 * Pricing comparison
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Check, Crown } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  DARK_CARD_HOVER,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  SectionLabel,
  GoldButton,
  Footer,
  GoldText,
} from "./shared";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
  delay: number;
}

const tiers: PricingTier[] = [
  {
    name: "חינם",
    price: "₪0",
    period: "לחודש",
    features: ["עד 10 הזמנות", "לוח שנה בסיסי", "תמיכה במייל"],
    highlighted: false,
    delay: 25,
  },
  {
    name: "סטארטר",
    price: "₪99",
    period: "לחודש",
    features: [
      "הזמנות ללא הגבלה",
      "לוח שנה מתקדם",
      "סליקה מובנית",
      "התראות אוטומטיות",
      "דף סטודיו מותאם",
    ],
    highlighted: true,
    badge: "פופולרי",
    delay: 40,
  },
  {
    name: "פרו",
    price: "₪249",
    period: "לחודש",
    features: [
      "כל תכונות סטארטר",
      "אנליטיקס מתקדם",
      "גישת API",
      "תמיכה בעדיפות",
      "מספר סניפים",
      "דוחות מותאמים",
      "אינטגרציות",
    ],
    highlighted: false,
    delay: 55,
  },
];

export const Ad8_PricingTiers_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaEnter = spring({ frame: frame - 120, fps, config: SPRING_BOUNCY });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.09} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "60px 40px 48px",
          position: "relative",
        }}
      >
        {/* Section label */}
        <div style={{ marginBottom: 16 }}>
          <SectionLabel text="תוכניות מחירים" delay={5} />
        </div>

        {/* Pricing cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {tiers.map((tier, i) => {
            const enter = spring({
              frame: frame - tier.delay,
              fps,
              config: SPRING_SNAPPY,
            });

            return (
              <div
                key={i}
                style={{
                  backgroundColor: tier.highlighted ? DARK_CARD_HOVER : DARK_CARD,
                  borderRadius: 20,
                  padding: tier.highlighted ? "24px 22px" : "20px 22px",
                  border: tier.highlighted
                    ? `1.5px solid ${GOLD}40`
                    : `1px solid rgba(255,209,102,0.07)`,
                  opacity: enter,
                  transform: `translateY(${interpolate(enter, [0, 1], [35, 0])}px) scale(${interpolate(enter, [0, 1], [0.95, 1])})`,
                  boxShadow: tier.highlighted
                    ? `0 8px 36px rgba(0,0,0,0.3), 0 0 40px ${GOLD}08`
                    : "0 6px 28px rgba(0,0,0,0.25)",
                  position: "relative",
                }}
              >
                {/* Popular badge */}
                {tier.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: GOLD,
                      borderRadius: 10,
                      padding: "5px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Crown size={13} color={DARK_BG} strokeWidth={2.2} />
                    <span
                      style={{
                        fontFamily: FONT_HEADING,
                        fontSize: 13,
                        fontWeight: 700,
                        color: DARK_BG,
                      }}
                    >
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Header row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: FONT_HEADING,
                        fontSize: 24,
                        fontWeight: 700,
                        color: tier.highlighted ? GOLD : LIGHT_TEXT,
                      }}
                    >
                      {tier.name}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 36,
                        fontWeight: 700,
                        color: tier.highlighted ? GOLD : LIGHT_TEXT,
                        filter: tier.highlighted
                          ? `drop-shadow(0 0 10px ${GOLD}18)`
                          : "none",
                      }}
                    >
                      {tier.price}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: 14,
                        color: SUBTLE_TEXT,
                      }}
                    >
                      /{tier.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {tier.features.map((feature, j) => {
                    const featureEnter = spring({
                      frame: frame - (tier.delay + 10 + j * 4),
                      fps,
                      config: SPRING_GENTLE,
                    });
                    return (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          opacity: featureEnter,
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 6,
                            backgroundColor: tier.highlighted
                              ? `${GOLD}15`
                              : `${LIGHT_TEXT}08`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Check
                            size={12}
                            color={tier.highlighted ? GOLD : SUBTLE_TEXT}
                            strokeWidth={2.5}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: FONT_BODY,
                            fontSize: 15,
                            color: tier.highlighted ? LIGHT_TEXT : SUBTLE_TEXT,
                          }}
                        >
                          {feature}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          <div style={{ transform: `scale(${ctaEnter})`, opacity: ctaEnter }}>
            <GoldButton text="התחל בחינם" delay={0} size="lg" />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Footer delay={130} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
