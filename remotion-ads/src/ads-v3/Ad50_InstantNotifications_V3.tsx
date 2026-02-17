/**
 * Ad50 — Instant Notifications V3
 * Stack of notification cards appearing with stacking animation
 * Types: new booking, payment, reminder, review
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
  GOLD,
  DARK_BG,
  DARK_CARD,
  DARK_CARD_HOVER,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  ACCENT_BLUE,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  CTAScene,
  SectionLabel,
} from "./shared";
import { Bell } from "lucide-react";

/* ─── Notification Card ─── */
const NotificationCard: React.FC<{
  emoji: string;
  title: string;
  subtitle: string;
  time: string;
  delay: number;
  accentColor: string;
  stackIndex: number;
}> = ({ emoji, title, subtitle, time, delay, accentColor, stackIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SNAPPY });
  const shake = stackIndex === 0 && frame > delay && frame < delay + 15
    ? Math.sin((frame - delay) * 1.5) * 4
    : 0;

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 20,
        padding: "22px 24px",
        border: `1px solid ${accentColor}20`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [-60, 0])}px) translateX(${shake}px)`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 15px ${accentColor}08`,
        borderRight: `4px solid ${accentColor}`,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: `${accentColor}12`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 28,
        }}
      >
        {emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 22,
            fontWeight: 700,
            color: LIGHT_TEXT,
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 17,
            color: SUBTLE_TEXT,
          }}
        >
          {subtitle}
        </div>
      </div>
      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: 14,
          color: `${SUBTLE_TEXT}80`,
          flexShrink: 0,
        }}
      >
        {time}
      </div>
    </div>
  );
};

/* ─── Notification Badge Counter ─── */
const NotifBadge: React.FC<{ count: number; delay: number }> = ({
  count,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SNAPPY });
  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [1, 1.15]);

  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        backgroundColor: "#ef4444",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${enter * pulse})`,
        opacity: enter,
        boxShadow: "0 0 12px rgba(239,68,68,0.5)",
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 18,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        {count}
      </span>
    </div>
  );
};

/* ─── Scene 1: Notification Stack ─── */
const NotificationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  const notifications = [
    {
      emoji: "📥",
      title: "הזמנה חדשה!",
      subtitle: "סטודיו A · יום שלישי 14:00",
      time: "עכשיו",
      accentColor: ACCENT_BLUE,
      delay: 20,
    },
    {
      emoji: "💰",
      title: "₪350 התקבל",
      subtitle: "תשלום עבור הזמנה #1284",
      time: "לפני 2 דק׳",
      accentColor: SUCCESS,
      delay: 38,
    },
    {
      emoji: "⏰",
      title: "תזכורת: הזמנה בעוד שעה",
      subtitle: "דניאל כהן · סטודיו הקלטות",
      time: "לפני 5 דק׳",
      accentColor: GOLD,
      delay: 56,
    },
    {
      emoji: "⭐",
      title: "ביקורת חדשה: 5 כוכבים",
      subtitle: '״סטודיו מדהים, אחזור בטוח!״',
      time: "לפני 12 דק׳",
      accentColor: GOLD,
      delay: 74,
    },
    {
      emoji: "🔄",
      title: "הזמנה חוזרת",
      subtitle: "יעל לוי · הזמנה שבועית קבועה",
      time: "לפני 30 דק׳",
      accentColor: ACCENT_BLUE,
      delay: 90,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.07} />

      <div
        style={{
          padding: "70px 42px 60px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header with bell + badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginBottom: 10,
          }}
        >
          <div style={{ position: "relative" }}>
            <Bell
              size={36}
              color={GOLD}
              strokeWidth={1.8}
              style={{
                opacity: interpolate(frame, [0, 15], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            />
            <div style={{ position: "absolute", top: -8, right: -8 }}>
              <NotifBadge count={5} delay={15} />
            </div>
          </div>
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "14px 0 6px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          <GoldText>התראות</GoldText> בזמן אמת
        </h2>

        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <GoldLine width={120} delay={8} />
        </div>

        {/* Notification stack */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            flex: 1,
          }}
        >
          {notifications.map((n, i) => (
            <NotificationCard key={i} {...n} stackIndex={i} />
          ))}
        </div>

        {/* Bottom text */}
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 22,
            color: GOLD,
            textAlign: "center",
            marginTop: 20,
            opacity: interpolate(frame, [100, 115], [0, 1], {
              extrapolateRight: "clamp",
            }),
            filter: `drop-shadow(0 0 12px ${GOLD}30)`,
          }}
        >
          אף הזמנה לא תפספס אותך 🔔
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const NotifCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        תמיד מעודכן
        {"\n"}
        <GoldText>תמיד בשליטה</GoldText>
      </>
    }
    buttonText="הפעל התראות חכמות"
    freeText="התחל בחינם — ₪0/חודש"
    subText="התראות למייל, SMS ואפליקציה"
  />
);

/* ─── Main Composition ─── */
export const Ad50_InstantNotifications_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160} premountFor={10}>
        <NotificationScene />
      </Sequence>
      <Sequence from={160} durationInFrames={80} premountFor={15}>
        <NotifCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
