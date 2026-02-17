/**
 * Ad40 — Studio Spotlight V3
 * Studio profile card with avatar, rating, location, services, and stats
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
import { MapPin, Music } from "lucide-react";
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
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  StatCard,
  Badge,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Service Tag ─── */
const ServiceTag: React.FC<{ text: string; delay: number }> = ({
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: `${ACCENT_BLUE}15`,
        border: `1px solid ${ACCENT_BLUE}25`,
        borderRadius: 50,
        padding: "8px 18px",
        opacity: enter,
        transform: `scale(${enter})`,
      }}
    >
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 16,
          color: ACCENT_BLUE,
          fontWeight: 500,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/* ─── Scene 1: Studio Profile Card ─── */
const ProfileScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardEnter = spring({ frame: frame - 5, fps, config: SPRING_BOUNCY });
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

      <div
        style={{
          padding: "80px 40px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <SectionLabel text="STUDIO SPOTLIGHT" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "14px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
          }}
        >
          הפרופיל שלך{"\n"}
          <GoldText>מרשים מהרגע הראשון</GoldText>
        </h2>

        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Profile Card */}
        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 24,
            padding: "36px 30px",
            border: `1px solid ${GOLD}12`,
            boxShadow: `0 12px 48px rgba(0,0,0,0.35), 0 0 30px ${GOLD}05`,
            transform: `scale(${cardEnter})`,
            opacity: cardEnter,
          }}
        >
          {/* Studio header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 20,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                overflow: "hidden",
                border: `2px solid ${GOLD}30`,
                flexShrink: 0,
              }}
            >
              <Img
                src={staticFile("logo.png")}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div>
              <h3
                style={{
                  fontFamily: FONT_HEADING,
                  fontSize: 28,
                  fontWeight: 700,
                  color: LIGHT_TEXT,
                  margin: "0 0 6px",
                }}
              >
                אולפן הסאונד
              </h3>

              {/* Rating + Location */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 18,
                    color: GOLD,
                  }}
                >
                  ⭐ 4.9
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={14} color={SUBTLE_TEXT} />
                  <span
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 16,
                      color: SUBTLE_TEXT,
                    }}
                  >
                    📍 תל אביב
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <ServiceTag text="🎤 הקלטות" delay={25} />
            <ServiceTag text="🎛️ מיקסינג" delay={30} />
            <ServiceTag text="🎵 הפקה" delay={35} />
            <ServiceTag text="🎧 מאסטרינג" delay={40} />
          </div>

          {/* Verified badge */}
          <Badge text="אולפן מאומת ✓" color={SUCCESS} delay={45} />
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
          <StatCard value="342" label="הזמנות" delay={50} />
          <StatCard value="89" label="לקוחות" delay={58} />
          <StatCard value="+45%" label="צמיחה" delay={66} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const SpotlightCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        צור פרופיל{"\n"}
        <GoldText>שמושך לקוחות</GoldText>
      </>
    }
    buttonText="בנה את הפרופיל שלך"
    freeText="התחל בחינם — ₪0/חודש"
  />
);

/* ─── Main Composition ─── */
export const Ad40_StudioSpotlight_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={155} premountFor={10}>
        <ProfileScene />
      </Sequence>
      <Sequence from={155} durationInFrames={85} premountFor={15}>
        <SpotlightCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
