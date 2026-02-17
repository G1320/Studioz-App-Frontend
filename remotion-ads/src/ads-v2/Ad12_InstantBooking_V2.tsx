/**
 * Ad12 — Instant Booking V2
 * Speed/efficiency showcase with clock and comparison cards
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
  Clock,
  Phone,
  MessageSquare,
  BookOpen,
  MousePointerClick,
  Wifi,
  CheckCircle2,
  Zap,
} from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RED,
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
  GoldButton,
  Footer,
  Headline,
  GoldText,
  Badge,
  SceneWrapper,
} from "./shared";

/* ─── Comparison Card ─── */
const ComparisonCard: React.FC<{
  title: string;
  items: { Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>; text: string }[];
  accentColor: string;
  delay: number;
  isGold?: boolean;
}> = ({ title, items, accentColor, delay, isGold = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: DARK_CARD,
        borderRadius: 20,
        padding: "24px 18px",
        border: isGold
          ? `2px solid ${GOLD}35`
          : `1px solid rgba(255,255,255,0.05)`,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
        boxShadow: isGold
          ? `0 0 30px ${GOLD}10, 0 8px 32px rgba(0,0,0,0.3)`
          : `0 8px 32px rgba(0,0,0,0.25)`,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 20,
          fontWeight: 700,
          color: accentColor,
          textAlign: "center",
          marginBottom: 20,
          paddingBottom: 12,
          borderBottom: `1px solid ${accentColor}20`,
        }}
      >
        {title}
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((item, i) => {
          const itemEnter = spring({
            frame: frame - delay - 10 - i * 8,
            fps,
            config: SPRING_SNAPPY,
          });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: itemEnter,
                transform: `translateX(${interpolate(itemEnter, [0, 1], [20, 0])}px)`,
              }}
            >
              <item.Icon size={16} color={accentColor} strokeWidth={2} />
              <span
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 15,
                  color: SUBTLE_TEXT,
                  lineHeight: 1.3,
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Animated Clock ─── */
const AnimatedClock: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });
  const glow = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.6, 1]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: `${GOLD}10`,
          border: `2px solid ${GOLD}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 ${40 * glow}px ${GOLD}20, 0 0 ${80 * glow}px ${GOLD}08`,
        }}
      >
        <Clock size={48} color={GOLD} strokeWidth={1.5} />
      </div>
    </div>
  );
};

/* ─── Main Scene ─── */
const MainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const withoutItems = [
    { Icon: Phone, text: "שיחת טלפון 5 דקות" },
    { Icon: MessageSquare, text: "וואטסאפ הלוך-חזור" },
    { Icon: BookOpen, text: "בדיקת יומן ידנית" },
  ];

  const withItems = [
    { Icon: MousePointerClick, text: "בחירה בקליק" },
    { Icon: Wifi, text: "זמינות בזמן אמת" },
    { Icon: CheckCircle2, text: "אישור מיידי" },
  ];

  return (
    <SceneWrapper glowX="50%" glowY="25%" glowColor={GOLD}>
      {/* Clock */}
      <div style={{ marginBottom: 24 }}>
        <AnimatedClock delay={0} />
      </div>

      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <Headline delay={10} size={54} align="center">
          {"הזמנה ב-30 שניות"}
        </Headline>
      </div>

      {/* Comparison Cards */}
      <div
        style={{
          display: "flex",
          gap: 16,
          flex: 1,
          maxHeight: 420,
        }}
      >
        <ComparisonCard
          title="בלי סטודיוז"
          items={withoutItems}
          accentColor={RED}
          delay={40}
        />
        <ComparisonCard
          title="עם סטודיוז"
          items={withItems}
          accentColor={GOLD}
          delay={55}
          isGold
        />
      </div>

      {/* Speed Badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 32,
        }}
      >
        <Badge text="פי 10 יותר מהר" color={SUCCESS} delay={120} Icon={Zap} />
      </div>

      {/* CTA */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 24,
        }}
      >
        <GoldButton text="נסו בחינם" delay={145} size="md" />
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
        <Footer delay={160} />
      </div>
    </SceneWrapper>
  );
};

/* ─── Main Composition ─── */
export const Ad12_InstantBooking_V2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={240}>
        <MainScene />
      </Sequence>
    </AbsoluteFill>
  );
};
