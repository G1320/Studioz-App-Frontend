/**
 * Ad31 — Smart Notifications V3
 * Phone with notification popups stacking animation
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
  DARK_CARD_HOVER,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RED,
  ACCENT_BLUE,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldText,
  CTAScene,
} from "./shared";

/* ─── Notification Popup ─── */
const NotificationPopup: React.FC<{
  emoji: string;
  title: string;
  subtitle: string;
  time: string;
  color: string;
  delay: number;
  index: number;
}> = ({ emoji, title, subtitle, time, color, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
  const slideOffset = index * 4; // Stack effect

  return (
    <div
      style={{
        backgroundColor: `${DARK_CARD}f5`,
        borderRadius: 20,
        padding: "20px 22px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        border: `1px solid ${color}20`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [300, 0])}px) translateY(${slideOffset}px)`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), -4px 0 20px ${color}08`,
        backdropFilter: "blur(12px)",
        ...RTL,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          backgroundColor: `${color}15`,
          border: `1px solid ${color}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 28 }}>{emoji}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 20,
            fontWeight: 700,
            color: LIGHT_TEXT,
            marginBottom: 3,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 15,
            color: SUBTLE_TEXT,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Time */}
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 13,
          color: `${SUBTLE_TEXT}80`,
          flexShrink: 0,
        }}
      >
        {time}
      </span>
    </div>
  );
};

/* ─── Phone Frame ─── */
const PhoneNotifications: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneEnter = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <div
      style={{
        width: 520,
        height: 1000,
        borderRadius: 40,
        backgroundColor: DARK_CARD,
        border: `2px solid ${GOLD}12`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 40px ${GOLD}04`,
        transform: `translateY(${interpolate(phoneEnter, [0, 1], [200, 0])}px)`,
        opacity: phoneEnter,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Status bar */}
      <div
        style={{
          height: 50,
          backgroundColor: `${DARK_BG}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid rgba(255,255,255,0.05)`,
        }}
      >
        <div
          style={{
            width: 80,
            height: 6,
            borderRadius: 3,
            backgroundColor: `${LIGHT_TEXT}15`,
          }}
        />
      </div>

      {/* App header */}
      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          borderBottom: `1px solid rgba(255,255,255,0.05)`,
          ...RTL,
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{ width: 36, height: 36, borderRadius: 10 }}
        />
        <span style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: LIGHT_TEXT }}>
          Studioz
        </span>
        <div
          style={{
            marginRight: "auto",
            backgroundColor: `${RED}20`,
            borderRadius: 12,
            padding: "4px 12px",
          }}
        >
          <span style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 700, color: RED }}>
            4
          </span>
        </div>
      </div>

      {/* Notifications list */}
      <div
        style={{
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <NotificationPopup
          emoji="🔔"
          title="הזמנה חדשה"
          subtitle="נועם כהן · אולפן A · 14:00"
          time="עכשיו"
          color={GOLD}
          delay={delay + 15}
          index={0}
        />
        <NotificationPopup
          emoji="💰"
          title="תשלום התקבל"
          subtitle="₪360 · דנה לוי"
          time="2 דק׳"
          color={SUCCESS}
          delay={delay + 30}
          index={1}
        />
        <NotificationPopup
          emoji="⏰"
          title="תזכורת ללקוח"
          subtitle="הזמנה מחר ב-10:00 · אורי ביטון"
          time="5 דק׳"
          color={ACCENT_BLUE}
          delay={delay + 45}
          index={2}
        />
        <NotificationPopup
          emoji="❌"
          title="ביטול"
          subtitle="שירה לוי ביטלה ליום רביעי"
          time="12 דק׳"
          color={RED}
          delay={delay + 60}
          index={3}
        />
      </div>
    </div>
  );
};

/* ─── Scene 1: Notifications ─── */
const NotificationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} color={ACCENT_BLUE} />
      <RadialGlow x="50%" y="40%" size={500} color={ACCENT_BLUE} opacity={0.06} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 20,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
            opacity: headEnter,
          }}
        >
          🔔 התראות חכמות
        </span>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "16px 50px 0",
            lineHeight: 1.3,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          תמיד בתמונה{"\n"}
          <GoldText>בזמן אמת</GoldText>
        </h2>
      </div>

      {/* Phone with notifications */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <PhoneNotifications delay={5} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const NotificationCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        אל תפספס{"\n"}
        <GoldText>שום דבר</GoldText>
      </>
    }
    buttonText="הפעל התראות חכמות"
    freeText="התחל בחינם — ₪0/חודש"
    subText="התראות בזמן אמת · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad31_SmartNotifications_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <NotificationScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <NotificationCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
