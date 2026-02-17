/**
 * Ad27 — Team Management V2
 * Staff management showcase with team member cards
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Users, UserPlus, Shield, Calendar } from "lucide-react";
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
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  Headline,
  GoldText,
  Badge,
  FeatureCard,
  Footer,
  SceneWrapper,
} from "./shared";

/* ─── Team Member Card ─── */
const TeamMemberCard: React.FC<{
  name: string;
  role: string;
  online: boolean;
  delay: number;
  offset: number;
}> = ({ name, role, online, delay, offset }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });
  const floatY = interpolate(Math.sin(frame * 0.03 + offset), [-1, 1], [-3, 3]);

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 20,
        padding: "22px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        border: `1px solid rgba(255,209,102,0.07)`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.25)`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [60, offset * 8])}px) translateY(${floatY}px)`,
        position: "relative",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          backgroundColor: `${GOLD}15`,
          border: `2px solid ${GOLD}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <Users size={24} color={GOLD} strokeWidth={1.8} />
        {/* Status dot */}
        <div
          style={{
            position: "absolute",
            bottom: 1,
            right: 1,
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: online ? SUCCESS : SUBTLE_TEXT,
            border: `2px solid ${DARK_CARD}`,
            boxShadow: online ? `0 0 8px ${SUCCESS}60` : "none",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONT_HEADING, fontSize: 20, color: LIGHT_TEXT, fontWeight: 700 }}>
          {name}
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: SUBTLE_TEXT, marginTop: 2 }}>
          {role}
        </div>
      </div>

      {/* Online label */}
      {online && (
        <div
          style={{
            backgroundColor: `${SUCCESS}15`,
            borderRadius: 8,
            padding: "4px 12px",
          }}
        >
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUCCESS, fontWeight: 500 }}>
            מחובר
          </span>
        </div>
      )}
    </div>
  );
};

/* ─── Main Ad ─── */
export const Ad27_TeamManagement_V2: React.FC = () => {
  return (
    <SceneWrapper glowX="60%" glowY="40%" glowColor={GOLD}>
      {/* Headline */}
      <Sequence from={0} durationInFrames={240}>
        <div style={{ marginBottom: 16 }}>
          <Headline delay={5}>
            {"ניהול צוות"}
            {"\n"}
            <GoldText>חכם ופשוט</GoldText>
          </Headline>
        </div>
      </Sequence>

      {/* Gold line */}
      <Sequence from={10} durationInFrames={230}>
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "flex-end" }}>
          <GoldLine delay={10} width={100} />
        </div>
      </Sequence>

      {/* Team member cards */}
      <Sequence from={12} durationInFrames={228} premountFor={8}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          <TeamMemberCard name="יוסי אברהם" role="מנהל סטודיו" online={true} delay={18} offset={0} />
          <TeamMemberCard name="שרה לוי" role="מהנדסת קול" online={true} delay={26} offset={1} />
          <TeamMemberCard name="דני כהן" role="טכנאי" online={false} delay={34} offset={2} />
        </div>
      </Sequence>

      {/* Feature list */}
      <Sequence from={40} durationInFrames={200} premountFor={10}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <FeatureCard Icon={UserPlus} title="הוספת חברי צוות" delay={44} />
          <FeatureCard Icon={Shield} title="הרשאות מותאמות" delay={50} />
          <FeatureCard Icon={Calendar} title="יומן לכל עובד" delay={56} />
        </div>
      </Sequence>

      {/* Badge */}
      <Sequence from={60} durationInFrames={180} premountFor={10}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Badge text="ללא הגבלת משתמשים" delay={62} color={SUCCESS} Icon={Users} />
        </div>
      </Sequence>

      {/* Footer */}
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "center", paddingBottom: 10 }}>
        <Footer delay={70} />
      </div>
    </SceneWrapper>
  );
};

export default Ad27_TeamManagement_V2;
