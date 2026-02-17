/**
 * Ad50_Notifications_V5
 * Theme: Email notifications — no app mention
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
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  FeatureCard,
  ScreenshotFrame,
  CTAScene,
  type LucideIcon,
  useScale,
} from "./shared";

/* ─── Notification Type Card ─── */
const NotificationCard: React.FC<{
  Icon: LucideIcon;
  title: string;
  color: string;
  delay: number;
}> = ({ Icon, title, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: `${s(20)}px ${s(22)}px`,
        border: `1px solid ${color}18`,
        display: "flex",
        alignItems: "center",
        gap: s(16),
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [s(50), 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          width: s(48),
          height: s(48),
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
          fontFamily: FONT_HEADING,
          fontSize: s(22),
          fontWeight: 700,
          color: LIGHT_TEXT,
        }}
      >
        {title}
      </span>
    </div>
  );
};

/* ─── Scene 1: Notification Types ─── */
const SceneNotifications: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={s(550)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(44)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(28),
        }}
      >
        <SectionLabel text="NOTIFICATIONS" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(50),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(6)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-25), 0])}px)`,
          }}
        >
          {"תמיד "}
          <GoldText>{"בתמונה"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(14), marginTop: s(15) }}>
          <NotificationCard
            Icon={Bell}
            title="הזמנה חדשה התקבלה"
            color={GOLD}
            delay={12}
          />
          <NotificationCard
            Icon={Check}
            title="תשלום אושר"
            color={SUCCESS}
            delay={22}
          />
          <NotificationCard
            Icon={X}
            title="ביטול הזמנה"
            color={RED}
            delay={32}
          />
          <NotificationCard
            Icon={Clock}
            title="תזכורת להזמנה"
            color={ACCENT_BLUE}
            delay={42}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Activity Feed + Features ─── */
const SceneActivity: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={s(500)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
          gap: s(25),
        }}
      >
        <SectionLabel text="ACTIVITY" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(42),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-20), 0])}px)`,
          }}
        >
          {"פיד פעילות "}
          <GoldText>{"חי"}</GoldText>
        </h2>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Activity.png"
            cropTop={13}
            delay={10}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: s(14), marginTop: s(20) }}>
          <FeatureCard
            Icon={Mail}
            title="התראות במייל"
            desc="על כל הזמנה, תשלום וביטול"
            delay={25}
          />
          <FeatureCard
            Icon={Users}
            title="מעקב לקוחות"
            desc="כל הפעילות במקום אחד"
            delay={35}
          />
          <FeatureCard
            Icon={Zap}
            title="עדכונים מיידיים"
            desc="תמיד יודעים מה קורה"
            delay={45}
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
        {"אל תפספסו"}
        {"\n"}
        <GoldText>{"שום הזמנה"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad50_Notifications_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneNotifications />
    </Sequence>
    <Sequence from={80} durationInFrames={80} premountFor={15}>
      <SceneActivity />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
