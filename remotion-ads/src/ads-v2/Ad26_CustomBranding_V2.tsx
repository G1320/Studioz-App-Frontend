/**
 * Ad26 — Custom Branding V2
 * Brand customization showcase
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
import { Upload, Palette, Type, Image } from "lucide-react";
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
  SPRING_SNAPPY,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  Headline,
  Subtitle,
  GoldText,
  FeatureCard,
  Footer,
  SceneWrapper,
} from "./shared";

/* ─── Logo Upload Card ─── */
const LogoUploadCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });
  const iconBounce = spring({ frame: frame - delay - 15, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 20,
        padding: "28px 24px",
        border: `2px dashed ${GOLD}30`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.25)`,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          backgroundColor: `${GOLD}12`,
          border: `1px solid ${GOLD}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${iconBounce})`,
        }}
      >
        <Upload size={28} color={GOLD} strokeWidth={1.8} />
      </div>
      <span style={{ fontFamily: FONT_HEADING, fontSize: 20, color: LIGHT_TEXT, fontWeight: 600 }}>
        העלאת לוגו
      </span>
    </div>
  );
};

/* ─── Color Palette Row ─── */
const ColorPaletteRow: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = [GOLD, ACCENT_BLUE, SUCCESS, RED, "#9b59b6"];

  return (
    <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
      {colors.map((color, i) => {
        const enter = spring({ frame: frame - delay - i * 4, fps, config: SPRING_BOUNCY });
        const isSelected = i === 0;
        return (
          <div
            key={i}
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: color,
              transform: `scale(${enter})`,
              opacity: enter,
              boxShadow: isSelected
                ? `0 0 0 3px ${DARK_BG}, 0 0 0 5px ${color}, 0 0 20px ${color}40`
                : `0 4px 12px rgba(0,0,0,0.3)`,
            }}
          />
        );
      })}
    </div>
  );
};

/* ─── Font Selector Card ─── */
const FontSelectorCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: "22px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: `1px solid rgba(255,209,102,0.08)`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)`,
        boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
        <span style={{ fontFamily: FONT_HEADING, fontSize: 42, color: GOLD, fontWeight: 700 }}>
          Aa
        </span>
        <span style={{ fontFamily: FONT_HEADING, fontSize: 28, color: LIGHT_TEXT, fontWeight: 600 }}>
          Aa
        </span>
        <span style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, fontWeight: 400 }}>
          Aa
        </span>
      </div>
      <Type size={22} color={SUBTLE_TEXT} strokeWidth={1.8} />
    </div>
  );
};

/* ─── Main Ad ─── */
export const Ad26_CustomBranding_V2: React.FC = () => {
  return (
    <SceneWrapper glowX="50%" glowY="35%" glowColor={GOLD}>
      {/* Headline */}
      <Sequence from={0} durationInFrames={240}>
        <div style={{ marginBottom: 16 }}>
          <Headline delay={5}>
            {"המותג שלך."}
            {"\n"}
            <GoldText>הסטודיו שלך.</GoldText>
          </Headline>
        </div>
      </Sequence>

      {/* Gold line */}
      <Sequence from={10} durationInFrames={230}>
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "flex-end" }}>
          <GoldLine delay={10} width={120} />
        </div>
      </Sequence>

      {/* Logo upload card */}
      <Sequence from={12} durationInFrames={228} premountFor={8}>
        <div style={{ marginBottom: 24 }}>
          <LogoUploadCard delay={15} />
        </div>
      </Sequence>

      {/* Color palette */}
      <Sequence from={25} durationInFrames={215} premountFor={10}>
        <div style={{ marginBottom: 24 }}>
          <ColorPaletteRow delay={28} />
        </div>
      </Sequence>

      {/* Font selector */}
      <Sequence from={35} durationInFrames={205} premountFor={10}>
        <div style={{ marginBottom: 32 }}>
          <FontSelectorCard delay={38} />
        </div>
      </Sequence>

      {/* Feature cards */}
      <Sequence from={45} durationInFrames={195} premountFor={10}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <FeatureCard Icon={Palette} title="צבעים מותאמים" delay={48} />
          <FeatureCard Icon={Type} title="טיפוגרפיה" delay={54} />
          <FeatureCard Icon={Image} title="לוגו ותמונות" delay={60} />
        </div>
      </Sequence>

      {/* Subtitle */}
      <Sequence from={60} durationInFrames={180} premountFor={10}>
        <div style={{ marginBottom: 20 }}>
          <Subtitle delay={62} align="center" size={20}>
            כל עמוד סטודיו — ייחודי
          </Subtitle>
        </div>
      </Sequence>

      {/* Footer */}
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "center", paddingBottom: 10 }}>
        <Footer delay={70} />
      </div>
    </SceneWrapper>
  );
};

export default Ad26_CustomBranding_V2;
