/**
 * Ad17 — Studio Hero V2
 * Hero brand statement with centered premium layout
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CalendarDays, CreditCard, BarChart3 } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  SPRING_SNAPPY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldButton,
  GoldText,
  Footer,
} from "./shared";

const FeaturePill: React.FC<{
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  delay: number;
}> = ({ Icon, label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SNAPPY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 14,
        padding: "16px 22px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        border: `1px solid rgba(255,209,102,0.08)`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
      }}
    >
      <Icon size={22} color={GOLD} strokeWidth={1.8} />
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 18,
          fontWeight: 600,
          color: LIGHT_TEXT,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const Ad17_StudioHero_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation
  const logoScale = spring({ frame, fps, config: SPRING_BOUNCY });
  const logoOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoGlow = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.15, 0.35]
  );

  // Headline
  const headlineEnter = spring({
    frame: frame - 18,
    fps,
    config: SPRING_SMOOTH,
  });

  // Gold line
  const lineDelay = 40;

  // Subtitle
  const subtitleEnter = spring({
    frame: frame - 55,
    fps,
    config: SPRING_GENTLE,
  });

  // CTA
  const ctaDelay = 130;

  // Footer
  const footerDelay = 150;

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="35%" size={800} opacity={0.1} />
      <RadialGlow x="30%" y="70%" size={400} color="#5b8fb9" opacity={0.04} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "60px 48px 42px",
          position: "relative",
          gap: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            marginBottom: 36,
            filter: `drop-shadow(0 0 30px ${GOLD}${Math.round(logoGlow * 255).toString(16).padStart(2, "0")})`,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{ width: 100, height: 100, borderRadius: 24 }}
          />
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 62,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            lineHeight: 1.2,
            textAlign: "center",
            opacity: headlineEnter,
            transform: `translateY(${interpolate(headlineEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          {"הסטודיו שלך."}
          {"\n"}
          <GoldText>ברמה אחרת.</GoldText>
        </h1>

        {/* Gold Line */}
        <div style={{ marginTop: 28, marginBottom: 28 }}>
          <GoldLine width={180} delay={lineDelay} />
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 24,
            color: SUBTLE_TEXT,
            margin: 0,
            lineHeight: 1.6,
            textAlign: "center",
            opacity: subtitleEnter,
            transform: `translateY(${interpolate(subtitleEnter, [0, 1], [18, 0])}px)`,
          }}
        >
          {"הפלטפורמה המלאה לניהול,"}
          {"\n"}
          {"הזמנות, ותשלומים."}
        </p>

        {/* Feature Pills */}
        <div
          style={{
            display: "flex",
            gap: 14,
            marginTop: 40,
            justifyContent: "center",
          }}
        >
          <FeaturePill Icon={CalendarDays} label="הזמנות" delay={80} />
          <FeaturePill Icon={CreditCard} label="תשלומים" delay={90} />
          <FeaturePill Icon={BarChart3} label="אנליטיקס" delay={100} />
        </div>

        {/* CTA */}
        <div style={{ marginTop: 48 }}>
          <GoldButton text="התחל עכשיו" delay={ctaDelay} />
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Footer delay={footerDelay} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
