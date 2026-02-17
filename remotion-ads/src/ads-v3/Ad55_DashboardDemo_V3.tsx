/**
 * Ad55 — Dashboard Demo V3
 * Uses Studioz-Dashboard-Calendar.webp screenshot with callout annotations
 * Overlay metric cards: +32% bookings, ₪24,500 revenue, 4.9 rating
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
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
  ScreenshotFrame,
  CTAScene,
  SectionLabel,
} from "./shared";
import { TrendingUp, Star } from "lucide-react";

/* ─── Floating Metric Card ─── */
const MetricCard: React.FC<{
  emoji: string;
  value: string;
  label: string;
  color: string;
  x: number;
  y: number;
  delay: number;
}> = ({ emoji, value, label, color, x, y, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });
  const float = Math.sin(frame * 0.04 + delay) * 4;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: "18px 22px",
        border: `1px solid ${color}25`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        transform: `scale(${enter})`,
        opacity: enter,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${color}10`,
        zIndex: 20,
      }}
    >
      <span style={{ fontSize: 28 }}>{emoji}</span>
      <div>
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 26,
            fontWeight: 700,
            color,
            filter: `drop-shadow(0 0 8px ${color}25)`,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 14,
            color: SUBTLE_TEXT,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

/* ─── Callout Annotation ─── */
const Callout: React.FC<{
  text: string;
  x: number;
  y: number;
  delay: number;
  direction?: "left" | "right";
}> = ({ text, x, y, delay, direction = "right" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        position: "absolute",
        left: direction === "right" ? x : undefined,
        right: direction === "left" ? 1080 - x : undefined,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 8,
        opacity: enter,
        transform: `translateX(${interpolate(
          enter,
          [0, 1],
          [direction === "right" ? -20 : 20, 0]
        )}px)`,
        zIndex: 15,
      }}
    >
      {/* Arrow dot */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: GOLD,
          boxShadow: `0 0 10px ${GOLD}60`,
          flexShrink: 0,
        }}
      />
      {/* Line */}
      <div
        style={{
          width: 30,
          height: 2,
          backgroundColor: `${GOLD}50`,
        }}
      />
      {/* Label */}
      <div
        style={{
          backgroundColor: `${DARK_BG}E0`,
          borderRadius: 10,
          padding: "8px 16px",
          border: `1px solid ${GOLD}20`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 15,
            fontWeight: 600,
            color: GOLD,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

/* ─── Scene 1: Dashboard with Overlays ─── */
const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <NoiseOverlay />
      <AmbientParticles count={10} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.07} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
          ...RTL,
        }}
      >
        <SectionLabel text="דשבורד חכם" delay={0} />
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "14px 50px 0",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          הכל <GoldText>במבט אחד</GoldText>
        </h2>
      </div>

      {/* Dashboard screenshot */}
      <div style={{ position: "absolute", top: 280, left: 30, right: 30 }}>
        <ScreenshotFrame
          src="images/optimized/Studioz-Dashboard-Calendar.webp"
          delay={8}
          borderRadius={22}
        />
      </div>

      {/* Callout annotations */}
      <Callout text="יומן הזמנות" x={50} y={400} delay={30} direction="right" />
      <Callout text="סטטוס בזמן אמת" x={50} y={520} delay={40} direction="right" />
      <Callout text="ניהול זמינות" x={50} y={640} delay={50} direction="right" />

      {/* Floating metric cards */}
      <MetricCard
        emoji="📈"
        value="+32%"
        label="הזמנות החודש"
        color={SUCCESS}
        x={60}
        y={1200}
        delay={55}
      />
      <MetricCard
        emoji="💰"
        value="₪24,500"
        label="הכנסות"
        color={GOLD}
        x={560}
        y={1200}
        delay={63}
      />
      <MetricCard
        emoji="⭐"
        value="4.9"
        label="דירוג ממוצע"
        color={GOLD}
        x={280}
        y={1360}
        delay={71}
      />

      {/* Bottom gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(0deg, ${DARK_BG} 20%, transparent 100%)`,
        }}
      />

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          ...RTL,
        }}
      >
        <p
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 26,
            fontWeight: 600,
            color: GOLD,
            opacity: interpolate(frame, [80, 100], [0, 1], {
              extrapolateRight: "clamp",
            }),
            filter: `drop-shadow(0 0 12px ${GOLD}30)`,
          }}
        >
          כל המידע בקצות האצבעות 📊
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const DashboardCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        קבל שליטה מלאה
        {"\n"}
        <GoldText>על הסטודיו שלך</GoldText>
      </>
    }
    buttonText="גלה את הדשבורד"
    freeText="התחל בחינם — ₪0/חודש"
    subText="הגדרה תוך 5 דקות"
  />
);

/* ─── Main Composition ─── */
export const Ad55_DashboardDemo_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160} premountFor={10}>
        <DashboardScene />
      </Sequence>
      <Sequence from={160} durationInFrames={80} premountFor={15}>
        <DashboardCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
