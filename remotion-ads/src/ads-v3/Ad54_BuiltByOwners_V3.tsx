/**
 * Ad54 — Built By Studio Owners V3
 * Credibility ad: "נבנה ע״י בעלי סטודיואים — בשבילכם"
 * Founder story, trust indicators
 * 270 frames / 9s @ 30fps
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
  ACCENT_BLUE,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  EmojiFeature,
  CTAScene,
  SectionLabel,
  Badge,
} from "./shared";
import { Heart, Shield, Users } from "lucide-react";

/* ─── Trust Card ─── */
const TrustCard: React.FC<{
  emoji: string;
  title: string;
  desc: string;
  delay: number;
}> = ({ emoji, title, desc, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 20,
        padding: "28px 24px",
        border: `1px solid ${GOLD}12`,
        display: "flex",
        alignItems: "flex-start",
        gap: 18,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: `${GOLD}10`,
          border: `1px solid ${GOLD}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 28,
        }}
      >
        {emoji}
      </div>
      <div>
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 24,
            fontWeight: 700,
            color: LIGHT_TEXT,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 18,
            color: SUBTLE_TEXT,
            lineHeight: 1.5,
          }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
};

/* ─── Scene 1: Founder Story ─── */
const FounderScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });
  const quoteEnter = spring({ frame: frame - 20, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="25%" size={500} opacity={0.07} />
      <RadialGlow x="30%" y="70%" size={300} color={ACCENT_BLUE} opacity={0.04} />

      <div
        style={{
          padding: "70px 42px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <SectionLabel text="הסיפור שלנו" delay={0} />

        {/* Logo */}
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 80,
            height: 80,
            borderRadius: 18,
            marginTop: 24,
            marginBottom: 24,
            opacity: interpolate(frame, [5, 18], [0, 1], {
              extrapolateRight: "clamp",
            }),
            boxShadow: `0 0 30px ${GOLD}12`,
          }}
        />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 8px",
            lineHeight: 1.35,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          נבנה ע״י
          {"\n"}
          <GoldText>בעלי סטודיואים</GoldText>
          {"\n"}בשבילכם
        </h2>

        <div style={{ marginBottom: 30 }}>
          <GoldLine width={160} delay={10} />
        </div>

        {/* Quote */}
        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 20,
            padding: "28px 30px",
            border: `1px solid ${GOLD}15`,
            borderRight: `4px solid ${GOLD}40`,
            width: "100%",
            marginBottom: 30,
            opacity: quoteEnter,
            transform: `translateY(${interpolate(quoteEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 22,
              color: LIGHT_TEXT,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            ״ניהלנו סטודיו בעצמנו, חווינו את כל הבעיות — ובנינו את הפתרון שתמיד רצינו.״
          </p>
          <p
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 18,
              fontWeight: 600,
              color: GOLD,
              margin: "12px 0 0",
            }}
          >
            — צוות Studioz
          </p>
        </div>

        {/* Trust badges */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <Badge text="מנוסיון אמיתי" color={GOLD} delay={40} Icon={Shield} />
          <Badge text="מבעלי סטודיואים" color={SUCCESS} delay={48} Icon={Users} />
          <Badge text="עם אהבה" color={ACCENT_BLUE} delay={56} Icon={Heart} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Trust Indicators ─── */
const TrustScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.07} />

      <div
        style={{
          padding: "70px 42px 60px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          למה <GoldText>סומכים עלינו</GoldText>?
        </h2>

        <div style={{ textAlign: "center", marginBottom: 35 }}>
          <GoldLine width={140} delay={8} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            flex: 1,
          }}
        >
          <TrustCard
            emoji="🏗️"
            title="נבנה מניסיון אמיתי"
            desc="כל פיצ׳ר נולד מבעיה שחווינו בעצמנו"
            delay={15}
          />
          <TrustCard
            emoji="💡"
            title="פתרון לבעיות שהכרנו"
            desc="מענה לכל אתגר יומיומי בניהול סטודיו"
            delay={30}
          />
          <TrustCard
            emoji="❤️"
            title="עם אהבה לקהילה"
            desc="תמיכה אישית, עדכונים שוטפים, הקשבה"
            delay={45}
          />
          <TrustCard
            emoji="🔒"
            title="אבטחה ופרטיות"
            desc="הנתונים שלך מאובטחים ושייכים רק לך"
            delay={60}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const BuiltCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        הצטרף למשפחה
        {"\n"}
        <GoldText>של בעלי סטודיואים</GoldText>
      </>
    }
    buttonText="התחל את המסע שלך"
    freeText="חינם לנצח — ₪0/חודש"
    subText="נבנה בשבילך, עובד בשבילך"
  />
);

/* ─── Main Composition ─── */
export const Ad54_BuiltByOwners_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={120} premountFor={10}>
        <FounderScene />
      </Sequence>
      <Sequence from={120} durationInFrames={90} premountFor={15}>
        <TrustScene />
      </Sequence>
      <Sequence from={210} durationInFrames={60} premountFor={15}>
        <BuiltCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
