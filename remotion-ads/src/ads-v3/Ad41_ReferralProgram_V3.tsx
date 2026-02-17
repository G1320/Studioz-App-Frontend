/**
 * Ad41 — Referral Program V3
 * Referral flow: invite → both earn → get credit with gift animation
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
import { Gift } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  Badge,
  ConnectingLine,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Referral Step Card ─── */
const ReferralStep: React.FC<{
  emoji: string;
  title: string;
  desc: string;
  delay: number;
  highlight?: boolean;
}> = ({ emoji, title, desc, delay, highlight = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });
  const emojiScale = spring({
    frame: frame - delay - 5,
    fps,
    config: { damping: 6, stiffness: 80 },
  });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 22,
        padding: "32px 28px",
        display: "flex",
        alignItems: "center",
        gap: 22,
        border: `1px solid ${highlight ? `${GOLD}30` : "rgba(255,209,102,0.08)"}`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [60, 0])}px)`,
        boxShadow: highlight
          ? `0 8px 36px rgba(0,0,0,0.35), 0 0 30px ${GOLD}08`
          : "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          fontSize: 50,
          flexShrink: 0,
          transform: `scale(${emojiScale})`,
        }}
      >
        {emoji}
      </div>
      <div>
        <h3
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 26,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 6px",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 18,
            color: SUBTLE_TEXT,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
};

/* ─── Gift Reward Animation ─── */
const RewardBurst: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });
  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [1, 1.06]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        transform: `scale(${enter * pulse})`,
        opacity: enter,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: `${GOLD}12`,
          border: `3px solid ${GOLD}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 50px ${GOLD}20`,
        }}
      >
        <Gift size={52} color={GOLD} strokeWidth={1.8} />
      </div>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 48,
          fontWeight: 700,
          color: GOLD,
          filter: `drop-shadow(0 0 15px ${GOLD}30)`,
        }}
      >
        ₪200
      </span>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 20,
          color: SUBTLE_TEXT,
        }}
      >
        לכל הפניה מוצלחת
      </span>
    </div>
  );
};

/* ─── Scene 1: Referral Flow ─── */
const ReferralScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} color={GOLD} />
      <RadialGlow x="50%" y="20%" size={500} opacity={0.08} />

      <div
        style={{
          padding: "80px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <SectionLabel text="REFERRAL PROGRAM" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "18px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          הזמן חבר,{"\n"}
          <GoldText>הרוויח ביחד</GoldText>
        </h2>

        <div style={{ marginBottom: 30 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Reward burst */}
        <RewardBurst delay={10} />

        {/* Referral steps */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 40,
            width: "100%",
          }}
        >
          <ReferralStep
            emoji="🤝"
            title="הזמן חבר"
            desc="שלח לינק הזמנה אישי"
            delay={25}
          />
          <ReferralStep
            emoji="🎁"
            title="שניכם מרוויחים"
            desc="הנחה לחבר + קרדיט לך"
            delay={40}
          />
          <ReferralStep
            emoji="💰"
            title="קבל קרדיט"
            desc="₪200 לכל הפניה שמצטרפת"
            delay={55}
            highlight
          />
        </div>

        {/* Badge */}
        <div style={{ marginTop: 30 }}>
          <Badge text="₪200 לכל הפניה 🎉" color={SUCCESS} delay={75} Icon={Gift} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const ReferralCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        התחל להרוויח{"\n"}
        <GoldText>מהפניות</GoldText>
      </>
    }
    buttonText="הזמן חברים עכשיו"
    freeText="₪200 לכל חבר שמצטרף"
    subText="ללא הגבלה · ככל שתזמין יותר, תרוויח יותר"
  />
);

/* ─── Main Composition ─── */
export const Ad41_ReferralProgram_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={155} premountFor={10}>
        <ReferralScene />
      </Sequence>
      <Sequence from={155} durationInFrames={85} premountFor={15}>
        <ReferralCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
