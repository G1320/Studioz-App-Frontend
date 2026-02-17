/**
 * Ad13 — Feature Collage V2
 * Bento grid feature showcase with staggered animations
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
import {
  CalendarDays,
  CreditCard,
  FileText,
  Globe,
  BarChart3,
  Palette,
} from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  DARK_CARD_HOVER,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  ACCENT_BLUE,
  SUCCESS,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  Footer,
  Headline,
  GoldText,
  SceneWrapper,
} from "./shared";

/* ─── Large Bento Card ─── */
const LargeBentoCard: React.FC<{
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  desc: string;
  delay: number;
  accentColor?: string;
}> = ({ Icon, title, desc, delay, accentColor = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });
  const iconFloat = interpolate(
    Math.sin(frame * 0.04 + delay),
    [-1, 1],
    [-3, 3]
  );

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 22,
        padding: "28px 24px",
        border: `1px solid rgba(255,209,102,0.08)`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [35, 0])}px) scale(${interpolate(enter, [0, 1], [0.95, 1])})`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.25), 0 0 20px ${accentColor}05`,
        flex: 1,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          backgroundColor: `${accentColor}12`,
          border: `1.5px solid ${accentColor}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transform: `translateY(${iconFloat}px)`,
        }}
      >
        <Icon size={28} color={accentColor} strokeWidth={1.8} />
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 22,
            fontWeight: 700,
            color: LIGHT_TEXT,
            marginBottom: 5,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 15,
            color: SUBTLE_TEXT,
            lineHeight: 1.4,
          }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
};

/* ─── Small Bento Card ─── */
const SmallBentoCard: React.FC<{
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  delay: number;
  accentColor?: string;
}> = ({ Icon, title, delay, accentColor = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SNAPPY });
  const iconPulse = interpolate(
    Math.sin(frame * 0.05 + delay * 0.3),
    [-1, 1],
    [0.94, 1.06]
  );

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: "24px 16px",
        border: `1px solid rgba(255,209,102,0.06)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.8, 1])})`,
        boxShadow: `0 6px 24px rgba(0,0,0,0.2)`,
        flex: 1,
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 14,
          backgroundColor: `${accentColor}12`,
          border: `1px solid ${accentColor}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${iconPulse})`,
        }}
      >
        <Icon size={24} color={accentColor} strokeWidth={1.8} />
      </div>
      <div
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 17,
          fontWeight: 600,
          color: LIGHT_TEXT,
          textAlign: "center",
        }}
      >
        {title}
      </div>
    </div>
  );
};

/* ─── Main Scene ─── */
const MainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneWrapper glowX="50%" glowY="45%" glowColor={GOLD}>
      {/* Headline */}
      <div style={{ marginBottom: 36, textAlign: "center" }}>
        <Headline delay={0} size={56} align="center">
          {"הכלים שאתה צריך"}
        </Headline>
      </div>

      {/* Bento Grid */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          justifyContent: "center",
        }}
      >
        {/* Top row: 2 large cards */}
        <LargeBentoCard
          Icon={CalendarDays}
          title="ניהול יומן חכם"
          desc="הזמנות אוטומטיות 24/7"
          delay={20}
          accentColor={GOLD}
        />
        <LargeBentoCard
          Icon={CreditCard}
          title="סליקה מובנית"
          desc="תשלומים מאובטחים"
          delay={35}
          accentColor={SUCCESS}
        />

        {/* Bottom rows: 2x2 small cards */}
        <div style={{ display: "flex", gap: 14 }}>
          <SmallBentoCard
            Icon={FileText}
            title="חשבוניות"
            delay={55}
            accentColor={ACCENT_BLUE}
          />
          <SmallBentoCard
            Icon={Globe}
            title="עמוד סטודיו"
            delay={70}
            accentColor={GOLD}
          />
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <SmallBentoCard
            Icon={BarChart3}
            title="אנליטיקס"
            delay={85}
            accentColor={SUCCESS}
          />
          <SmallBentoCard
            Icon={Palette}
            title="עיצוב מותאם"
            delay={100}
            accentColor={ACCENT_BLUE}
          />
        </div>
      </div>

      {/* Gold Line */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
        <GoldLine width={200} delay={130} />
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 42,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Footer delay={140} />
      </div>
    </SceneWrapper>
  );
};

/* ─── Main Composition ─── */
export const Ad13_FeatureCollage_V2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={240}>
        <MainScene />
      </Sequence>
    </AbsoluteFill>
  );
};
