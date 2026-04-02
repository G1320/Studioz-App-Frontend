/**
 * Ad36 — Equipment List V3
 * Grid of studio equipment cards with availability status
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
  Badge,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Equipment Card ─── */
const EquipmentCard: React.FC<{
  emoji: string;
  name: string;
  available: boolean;
  delay: number;
}> = ({ emoji, name, available, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 20,
        padding: "28px 18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        border: `1px solid ${available ? `${SUCCESS}18` : "rgba(255,255,255,0.05)"}`,
        transform: `scale(${enter})`,
        opacity: enter,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
        flex: 1,
        minWidth: 0,
      }}
    >
      <span style={{ fontSize: 44 }}>{emoji}</span>
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 20,
          fontWeight: 600,
          color: LIGHT_TEXT,
          textAlign: "center",
        }}
      >
        {name}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: available ? SUCCESS : SUBTLE_TEXT,
            boxShadow: available ? `0 0 8px ${SUCCESS}60` : "none",
          }}
        />
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: 14,
            color: available ? SUCCESS : SUBTLE_TEXT,
          }}
        >
          {available ? "זמין" : "תפוס"}
        </span>
      </div>
    </div>
  );
};

/* ─── Scene 1: Equipment Grid ─── */
const EquipmentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  const equipment = [
    { emoji: "🎤", name: "מיקרופון", available: true },
    { emoji: "🎸", name: "גיטרה", available: true },
    { emoji: "🎹", name: "פסנתר", available: false },
    { emoji: "🎧", name: "אוזניות", available: true },
    { emoji: "🔊", name: "רמקולים", available: true },
    { emoji: "💡", name: "תאורה", available: true },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />

      <div
        style={{
          padding: "80px 40px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <SectionLabel text="EQUIPMENT" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "16px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          הציוד שלך{"\n"}
          <GoldText>במקום אחד</GoldText>
        </h2>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Equipment Grid - 3x2 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 16 }}>
            {equipment.slice(0, 3).map((eq, i) => (
              <EquipmentCard
                key={i}
                emoji={eq.emoji}
                name={eq.name}
                available={eq.available}
                delay={15 + i * 8}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {equipment.slice(3, 6).map((eq, i) => (
              <EquipmentCard
                key={i + 3}
                emoji={eq.emoji}
                name={eq.name}
                available={eq.available}
                delay={40 + i * 8}
              />
            ))}
          </div>
        </div>

        {/* Status summary */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 30,
            opacity: interpolate(frame, [70, 90], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Badge text="5 פריטים זמינים" color={SUCCESS} delay={70} />
        </div>

        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 22,
            color: SUBTLE_TEXT,
            textAlign: "center",
            marginTop: 20,
            opacity: interpolate(frame, [80, 100], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          לקוחות רואים מה זמין ומזמינים בקליק 🎯
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const EquipmentCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        הצג את הציוד שלך{"\n"}
        <GoldText>באופן מקצועי</GoldText>
      </>
    }
    buttonText="הוסף את הציוד שלך"
    freeText="חינם לתמיד — כל התכונות כלולות"
  />
);

/* ─── Main Composition ─── */
export const Ad36_EquipmentList_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={155} premountFor={10}>
        <EquipmentScene />
      </Sequence>
      <Sequence from={155} durationInFrames={85} premountFor={15}>
        <EquipmentCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
