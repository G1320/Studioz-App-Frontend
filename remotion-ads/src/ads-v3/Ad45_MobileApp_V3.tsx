/**
 * Ad45 — Mobile App Showcase V3
 * Phone mockup center stage with mobile features
 * "הסטודיו שלך בכיס" headline, download badges
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
  GoldLine,
  GoldText,
  PhoneMockup,
  EmojiFeature,
  CTAScene,
  SectionLabel,
  Badge,
} from "./shared";
import { Smartphone } from "lucide-react";

/* ─── Scene 1: Phone Showcase ─── */
const PhoneScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  const features = [
    { emoji: "🔔", label: "התראות בזמן אמת" },
    { emoji: "📅", label: "יומן בנייד" },
    { emoji: "📊", label: "נתונים בקצות האצבעות" },
    { emoji: "💬", label: "צ׳אט עם לקוחות" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="45%" size={600} color={ACCENT_BLUE} opacity={0.06} />
      <RadialGlow x="50%" y="20%" size={400} opacity={0.06} />

      <div
        style={{
          padding: "70px 48px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <SectionLabel text="אפליקציה לנייד" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "18px 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          <GoldText>הסטודיו שלך</GoldText>
          {"\n"}בכיס
        </h2>

        <div style={{ marginBottom: 30 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Phone mockup */}
        <div style={{ marginBottom: 30 }}>
          <PhoneMockup
            src="images/optimized/Studioz-Studio-Details-1-Light.webp"
            delay={8}
            width={380}
            height={720}
          />
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
            marginBottom: 30,
          }}
        >
          {features.map((f, i) => (
            <EmojiFeature key={i} emoji={f.emoji} label={f.label} delay={35 + i * 8} />
          ))}
        </div>

        {/* Download badges */}
        <div
          style={{
            display: "flex",
            gap: 16,
            opacity: interpolate(frame, [75, 90], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {["App Store", "Google Play"].map((store, i) => (
            <div
              key={i}
              style={{
                backgroundColor: DARK_CARD,
                border: `1px solid ${GOLD}15`,
                borderRadius: 14,
                padding: "14px 24px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Smartphone size={20} color={GOLD} strokeWidth={1.8} />
              <span
                style={{
                  fontFamily: FONT_HEADING,
                  fontSize: 17,
                  fontWeight: 600,
                  color: LIGHT_TEXT,
                }}
              >
                {store}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const MobileCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        נהל את הסטודיו
        {"\n"}
        <GoldText>מכל מקום</GoldText>
      </>
    }
    buttonText="הורד את האפליקציה"
    freeText="חינם לחלוטין"
    subText="זמין ב-iOS וב-Android"
  />
);

/* ─── Main Composition ─── */
export const Ad45_MobileApp_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160} premountFor={10}>
        <PhoneScene />
      </Sequence>
      <Sequence from={160} durationInFrames={80} premountFor={15}>
        <MobileCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
