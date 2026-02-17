/**
 * Ad31_SmartNotifications_V4
 * Theme: Notification system — automated alerts for bookings
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
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Smartphone,
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
  ACCENT_BLUE,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  FeatureCard,
  CTAScene,
} from "./shared";

/* ─── Notification Card ─── */
const NotificationCard: React.FC<{
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  text: string;
  color: string;
  delay: number;
}> = ({ Icon, text, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: "22px 26px",
        border: `1px solid ${color}20`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [80, 0])}px)`,
        boxShadow: `0 6px 28px rgba(0,0,0,0.25), 0 0 20px ${color}08`,
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 14,
          backgroundColor: `${color}12`,
          border: `1px solid ${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={24} color={color} strokeWidth={1.8} />
      </div>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 24,
          fontWeight: 600,
          color: LIGHT_TEXT,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/* ─── Scene 1: Notification Cards ─── */
const SceneNotifications: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 44px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <SectionLabel text="NOTIFICATIONS" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          <GoldText>{"התראות חכמות"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 10 }}>
          <NotificationCard Icon={Bell} text="הזמנה חדשה" color={GOLD} delay={12} />
          <NotificationCard Icon={CheckCircle} text="הזמנה אושרה" color={SUCCESS} delay={22} />
          <NotificationCard Icon={XCircle} text="ביטול" color={RED} delay={32} />
          <NotificationCard Icon={Clock} text="תזכורת" color={ACCENT_BLUE} delay={42} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Feature Cards ─── */
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="45%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 44px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <SectionLabel text="STAY UPDATED" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"תמיד "}
          <GoldText>{"בשליטה"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 10 }}>
          <FeatureCard Icon={Mail} title="התראות במייל" desc="על כל הזמנה ושינוי" delay={10} />
          <FeatureCard Icon={Smartphone} title="התראות ללקוח" desc="אישורים ותזכורות אוטומטיות" delay={20} />
          <FeatureCard Icon={Zap} title="באופן אוטומטי" desc="בלי מאמץ מצדכם" delay={30} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const SceneCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        {"אל תפספסו "}
        <GoldText>{"אף הזמנה"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad31_SmartNotifications_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneNotifications />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
