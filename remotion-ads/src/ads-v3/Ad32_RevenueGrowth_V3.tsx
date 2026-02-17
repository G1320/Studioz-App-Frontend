/**
 * Ad32 — Revenue Growth V3
 * Animated bar chart growing upward + stat cards + before/after revenue comparison
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TrendingUp, DollarSign, ShoppingCart } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
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
  StatCard,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Animated Bar ─── */
const AnimatedBar: React.FC<{
  height: number;
  label: string;
  value: string;
  delay: number;
  color: string;
  maxHeight: number;
}> = ({ height, label, value, delay, color, maxHeight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 60 } });
  const barHeight = interpolate(grow, [0, 1], [0, height]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        flex: 1,
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 22,
          fontWeight: 700,
          color,
          opacity: grow,
          filter: `drop-shadow(0 0 8px ${color}30)`,
        }}
      >
        {value}
      </span>
      <div
        style={{
          width: 80,
          height: maxHeight,
          borderRadius: 14,
          backgroundColor: `${color}10`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: barHeight,
            borderRadius: 14,
            background: `linear-gradient(180deg, ${color}, ${color}80)`,
            boxShadow: `0 0 20px ${color}25`,
          }}
        />
      </div>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 16,
          color: SUBTLE_TEXT,
          opacity: grow,
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─── Scene 1: Revenue Chart ─── */
const ChartScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  const months = [
    { label: "ינואר", value: "₪8K", height: 120, color: SUBTLE_TEXT },
    { label: "פברואר", value: "₪10K", height: 150, color: SUBTLE_TEXT },
    { label: "מרץ", value: "₪12K", height: 180, color: GOLD },
    { label: "אפריל", value: "₪14K", height: 220, color: GOLD },
    { label: "מאי", value: "₪18K", height: 300, color: SUCCESS },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

      <div
        style={{
          padding: "80px 48px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <SectionLabel text="REVENUE GROWTH" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "16px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          ההכנסות שלך{"\n"}
          <GoldText>צומחות כל חודש</GoldText>
        </h2>

        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Bar Chart */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 16,
            flex: 1,
            direction: "ltr",
          }}
        >
          {months.map((m, i) => (
            <AnimatedBar
              key={i}
              height={m.height}
              label={m.label}
              value={m.value}
              delay={15 + i * 10}
              color={m.color}
              maxHeight={320}
            />
          ))}
        </div>

        {/* Growth indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            marginTop: 40,
            opacity: interpolate(frame, [80, 100], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <TrendingUp size={28} color={SUCCESS} strokeWidth={2.2} />
          <span
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 30,
              fontWeight: 700,
              color: SUCCESS,
              filter: `drop-shadow(0 0 12px ${SUCCESS}30)`,
            }}
          >
            +125% צמיחה ב-5 חודשים
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Stats ─── */
const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.08} />

      <div
        style={{
          padding: "80px 48px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 40px",
            lineHeight: 1.3,
            opacity: headEnter,
          }}
        >
          הנתונים מדברים{"\n"}
          <GoldText>בעד עצמם</GoldText>
        </h2>

        <div style={{ display: "flex", gap: 18 }}>
          <StatCard
            value="₪18,400"
            label="הכנסות חודשיות"
            delay={10}
            Icon={DollarSign}
          />
          <StatCard
            value="+45%"
            label="צמיחה חודשית"
            delay={20}
            Icon={TrendingUp}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <StatCard
            value="127"
            label="הזמנות החודש"
            delay={30}
            Icon={ShoppingCart}
          />
        </div>

        {/* Before / After */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 20,
            opacity: interpolate(frame, [50, 70], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* Before */}
          <div
            style={{
              flex: 1,
              backgroundColor: DARK_CARD,
              borderRadius: 18,
              padding: "24px 20px",
              border: "1px solid rgba(220,38,38,0.15)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: 16,
                color: SUBTLE_TEXT,
                marginBottom: 10,
              }}
            >
              לפני Studioz
            </div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 36,
                fontWeight: 700,
                color: SUBTLE_TEXT,
              }}
            >
              ₪8,200
            </div>
          </div>

          {/* Arrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 36,
            }}
          >
            ←
          </div>

          {/* After */}
          <div
            style={{
              flex: 1,
              backgroundColor: DARK_CARD,
              borderRadius: 18,
              padding: "24px 20px",
              border: `1px solid ${SUCCESS}20`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: 16,
                color: SUCCESS,
                marginBottom: 10,
              }}
            >
              אחרי Studioz
            </div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 36,
                fontWeight: 700,
                color: SUCCESS,
                filter: `drop-shadow(0 0 10px ${SUCCESS}30)`,
              }}
            >
              ₪18,400
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const RevenueCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        הגדל את ההכנסות שלך{"\n"}
        <GoldText>עם Studioz</GoldText>
      </>
    }
    buttonText="התחל להרוויח יותר"
    freeText="התחל בחינם — ₪0/חודש"
  />
);

/* ─── Main Composition ─── */
export const Ad32_RevenueGrowth_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={120} premountFor={10}>
        <ChartScene />
      </Sequence>
      <Sequence from={120} durationInFrames={120} premountFor={15}>
        <StatsScene />
      </Sequence>
      <Sequence from={200} durationInFrames={40} premountFor={15}>
        <RevenueCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
