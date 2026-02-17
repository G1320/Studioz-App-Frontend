/**
 * Ad50_Notifications_V4
 * Theme: Email notifications — NOT push/app notifications
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
import { Bell, Check, X, Clock, Mail, Users, Zap } from "lucide-react";
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
  SPRING_SNAPPY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  FeatureCard,
  CTAScene,
  type LucideIcon,
} from "./shared";

/* ─── Notification Type Card ─── */
const NotificationCard: React.FC<{
  Icon: LucideIcon;
  label: string;
  color: string;
  delay: number;
}> = ({ Icon, label, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SNAPPY });

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
        transform: `translateX(${interpolate(enter, [0, 1], [60, 0])}px) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 14,
          backgroundColor: `${color}12`,
          border: `1px solid ${color}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={24} color={color} strokeWidth={1.8} />
      </div>
      <span style={{ fontFamily: FONT_BODY, fontSize: 24, fontWeight: 600, color: LIGHT_TEXT }}>
        {label}
      </span>
    </div>
  );
};

/* ─── Scene 1: Notification Types ─── */
const SceneNotifications: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={600} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 25,
        }}
      >
        <SectionLabel text="NOTIFICATIONS" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-30, 0])}px)`,
          }}
        >
          {"תמיד "}
          <GoldText>{"בתמונה"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <NotificationCard Icon={Bell} label="הזמנה חדשה" color={GOLD} delay={15} />
          <NotificationCard Icon={Check} label="אישור הזמנה" color={SUCCESS} delay={25} />
          <NotificationCard Icon={X} label="ביטול הזמנה" color={RED} delay={35} />
          <NotificationCard Icon={Clock} label="תזכורת" color={ACCENT_BLUE} delay={45} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Features ─── */
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.07} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 25,
        }}
      >
        <SectionLabel text="EMAIL ALERTS" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"התראות "}
          <GoldText>{"במייל"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 10 }}>
          <FeatureCard
            Icon={Mail}
            title="התראות במייל"
            desc="על כל הזמנה, שינוי או ביטול"
            delay={15}
          />
          <FeatureCard
            Icon={Users}
            title="גם ללקוח"
            desc="הלקוח מקבל אישור ותזכורת"
            delay={25}
          />
          <FeatureCard
            Icon={Zap}
            title="אוטומטי לגמרי"
            desc="בלי לעשות כלום — הכל עובד"
            delay={35}
          />
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
        {"לא תפספסו "}
        <GoldText>{"שום הזמנה"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad50_Notifications_V4: React.FC = () => (
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
