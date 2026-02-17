/**
 * Ad31_SmartNotifications_V5
 * Theme: Smart notifications — stay on top of every booking
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
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  LucideIcon,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  FeatureCard,
  ScreenshotFrame,
  CTAScene,
  useScale,
} from "./shared";

/* ─── Notification Card ─── */
const NotificationCard: React.FC<{
  Icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  delay: number;
}> = ({ Icon, title, desc, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SNAPPY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: `${s(22)}px ${s(24)}px`,
        border: `1px solid ${color}18`,
        display: "flex",
        alignItems: "center",
        gap: s(16),
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [s(60), 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          width: s(50),
          height: s(50),
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
      <div>
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(22),
            fontWeight: 700,
            color: LIGHT_TEXT,
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: s(15), color: SUBTLE_TEXT }}>
          {desc}
        </div>
      </div>
    </div>
  );
};

/* ─── Scene 1: Notification Cards ─── */
const SceneNotifications: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="30%" size={s(500)} opacity={0.07} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(50)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(28),
        }}
      >
        <SectionLabel text="NOTIFICATIONS" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(52),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-30), 0])}px)`,
          }}
        >
          <GoldText>{"התראות חכמות"}</GoldText>
        </h1>

        <GoldLine delay={10} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(16), marginTop: s(10) }}>
          <NotificationCard
            Icon={Bell}
            title="הזמנה חדשה"
            desc="לקוח חדש הזמין את האולפן"
            color={GOLD}
            delay={15}
          />
          <NotificationCard
            Icon={CheckCircle}
            title="אישור הזמנה"
            desc="ההזמנה אושרה ונשלח מייל"
            color={SUCCESS}
            delay={25}
          />
          <NotificationCard
            Icon={XCircle}
            title="ביטול הזמנה"
            desc="הלקוח ביטל — הזמן התפנה"
            color={RED}
            delay={35}
          />
          <NotificationCard
            Icon={Clock}
            title="תזכורת"
            desc="הזמנה מתחילה בעוד שעה"
            color={SUBTLE_TEXT}
            delay={45}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Activity Feed Screenshot + Features ─── */
const SceneActivityFeed: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={s(600)} opacity={0.08} />

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
          {"כל הפעילות "}
          <GoldText>{"במקום אחד"}</GoldText>
        </h2>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Activity.png"
            cropTop={13}
            delay={8}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: s(14), marginTop: s(20) }}>
          <FeatureCard Icon={Mail} title="התראות במייל" delay={20} />
          <FeatureCard Icon={Smartphone} title="עדכון בזמן אמת" delay={30} />
          <FeatureCard Icon={Zap} title="תגובה מהירה" delay={40} />
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
export const Ad31_SmartNotifications_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneNotifications />
    </Sequence>
    <Sequence from={80} durationInFrames={80} premountFor={15}>
      <SceneActivityFeed />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
