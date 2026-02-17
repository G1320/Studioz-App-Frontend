/**
 * Ad26 — Custom Branding V3
 * Color palette swatches animating with branding features
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

/* ─── Color Swatch ─── */
const ColorSwatch: React.FC<{
  color: string;
  label: string;
  delay: number;
  size?: number;
}> = ({ color, label, delay, size = 100 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity: enter,
        transform: `scale(${enter})`,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 22,
          backgroundColor: color,
          border: "3px solid rgba(255,255,255,0.1)",
          boxShadow: `0 8px 30px ${color}30, 0 4px 15px rgba(0,0,0,0.3)`,
        }}
      />
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 14,
          color: SUBTLE_TEXT,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─── Branding Preview Card ─── */
const BrandPreview: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 24,
        padding: "32px",
        border: `1px solid ${GOLD}15`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${GOLD}05`,
        transform: `translateY(${interpolate(enter, [0, 1], [100, 0])}px)`,
        opacity: enter,
        width: 500,
      }}
    >
      {/* Preview header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, ...RTL }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: GOLD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{ width: 40, height: 40, borderRadius: 10 }}
          />
        </div>
        <div>
          <div style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: LIGHT_TEXT }}>
            הסטודיו שלך
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: SUBTLE_TEXT }}>
            studioz.co.il/your-studio
          </div>
        </div>
      </div>

      {/* Color bar preview */}
      <div
        style={{
          height: 8,
          borderRadius: 4,
          background: `linear-gradient(90deg, ${GOLD}, ${ACCENT_BLUE}, ${SUCCESS}, #e879f9)`,
          marginBottom: 20,
        }}
      />

      {/* Mock content blocks */}
      {[1, 0.7, 0.5].map((w, i) => (
        <div
          key={i}
          style={{
            height: 14,
            borderRadius: 7,
            backgroundColor: `${LIGHT_TEXT}10`,
            width: `${w * 100}%`,
            marginBottom: 10,
          }}
        />
      ))}
    </div>
  );
};

/* ─── Scene 1: Branding Features ─── */
const BrandingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} color={GOLD} />
      <RadialGlow x="50%" y="30%" size={500} color={GOLD} opacity={0.06} />

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
          🎨 עיצוב מותאם
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
          מיתוג{"\n"}
          <GoldText>שמשקף אותך</GoldText>
        </h2>
      </div>

      {/* Color palette swatches */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <ColorSwatch color="#ffd166" label="Primary" delay={15} />
        <ColorSwatch color="#5b8fb9" label="Secondary" delay={22} />
        <ColorSwatch color="#10b981" label="Accent" delay={29} />
        <ColorSwatch color="#e879f9" label="Highlight" delay={36} />
      </div>

      {/* Branding preview */}
      <div
        style={{
          position: "absolute",
          top: 520,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <BrandPreview delay={20} />
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
        <EmojiFeature emoji="📝" label="לוגו אישי" delay={50} />
        <EmojiFeature emoji="🔗" label="דומיין מותאם" delay={58} />
        <EmojiFeature emoji="✨" label="עיצוב מקצועי" delay={66} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const BrandingCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        צור חוויה{"\n"}
        <GoldText>ממותגת ומקצועית</GoldText>
      </>
    }
    buttonText="התחל לעצב"
    freeText="התחל בחינם — ₪0/חודש"
    subText="עיצוב מותאם · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad26_CustomBranding_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <BrandingScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <BrandingCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
