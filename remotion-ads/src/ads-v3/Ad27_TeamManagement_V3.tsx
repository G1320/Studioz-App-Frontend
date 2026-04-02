/**
 * Ad27 — Team Management V3
 * Team grid with roles and animated avatars
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
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldText,
  EmojiFeature,
  CTAScene,
} from "./shared";

/* ─── Team Member Avatar Card ─── */
const AvatarCard: React.FC<{
  initials: string;
  name: string;
  role: string;
  color: string;
  delay: number;
}> = ({ initials, name, role, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 20,
        padding: "28px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        border: `1px solid ${color}15`,
        opacity: enter,
        transform: `scale(${enter})`,
        boxShadow: "0 8px 28px rgba(0,0,0,0.3)",
        flex: 1,
      }}
    >
      {/* Avatar circle */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          backgroundColor: `${color}18`,
          border: `3px solid ${color}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 20px ${color}10`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 26,
            fontWeight: 700,
            color,
          }}
        >
          {initials}
        </span>
      </div>
      <span style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: LIGHT_TEXT }}>
        {name}
      </span>
      <div
        style={{
          backgroundColor: `${color}12`,
          borderRadius: 30,
          padding: "6px 16px",
          border: `1px solid ${color}25`,
        }}
      >
        <span style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, color }}>
          {role}
        </span>
      </div>
    </div>
  );
};

/* ─── Scene 1: Team Grid ─── */
const TeamScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.07} />

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
          👥 ניהול צוות
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
          הצוות שלך{"\n"}
          <GoldText>מסונכרן ומנוהל</GoldText>
        </h2>
      </div>

      {/* Avatar grid 2x2 */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", gap: 18 }}>
          <AvatarCard initials="דכ" name="דניאל כהן" role="מנהל" color={GOLD} delay={15} />
          <AvatarCard initials="של" name="שירה לוי" role="סאונד" color={ACCENT_BLUE} delay={25} />
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          <AvatarCard initials="יב" name="יוסי ביטון" role="הקלטה" color={SUCCESS} delay={35} />
          <AvatarCard initials="מא" name="מיכל אברהם" role="מיקס" color="#e879f9" delay={45} />
        </div>
      </div>

      {/* Feature pills */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          padding: "0 30px",
          ...RTL,
        }}
      >
        <EmojiFeature emoji="🔑" label="הרשאות מותאמות" delay={55} />
        <EmojiFeature emoji="📅" label="לו״ז לכל עובד" delay={63} />
        <EmojiFeature emoji="📊" label="ביצועי צוות" delay={71} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const TeamCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        נהל את הצוות{"\n"}
        <GoldText>בקלות מלאה</GoldText>
      </>
    }
    buttonText="הוסף את הצוות שלך"
    freeText="חינם לתמיד — כל התכונות כלולות"
    subText="ניהול צוות מתקדם · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad27_TeamManagement_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <TeamScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <TeamCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
