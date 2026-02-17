/**
 * Ad11 — Dark/Light Theme Showcase V2
 * Two phone mockups showcasing dark and light modes with actual screenshots
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
import {
  Sun,
  Moon,
  Palette,
  Accessibility,
} from "lucide-react";
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
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  Footer,
  Headline,
  GoldText,
  Badge,
  SceneWrapper,
} from "./shared";

/* ─── Phone Mockup with Screenshot ─── */
const PhoneMockup: React.FC<{
  isDark: boolean;
  label: string;
  LabelIcon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  imageSrc: string;
  delay: number;
  fromX: number;
}> = ({ isDark, label, LabelIcon, imageSrc, delay, fromX }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });
  const tiltY = interpolate(enter, [0, 1], [fromX > 0 ? 15 : -15, 0]);
  const floatY = interpolate(
    Math.sin(frame * 0.04 + (isDark ? 0 : Math.PI)),
    [-1, 1],
    [-4, 4]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [fromX, 0])}px) translateY(${floatY}px) perspective(800px) rotateY(${tiltY}deg)`,
      }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: 280,
          height: 560,
          borderRadius: 28,
          backgroundColor: isDark ? "#0a0a14" : "#f8f9fa",
          border: isDark
            ? `2px solid rgba(255,209,102,0.12)`
            : `2px solid rgba(0,0,0,0.1)`,
          padding: 6,
          boxShadow: isDark
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${GOLD}08`
            : `0 20px 60px rgba(0,0,0,0.15), 0 0 30px rgba(255,255,255,0.1)`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Screenshot */}
        <Img
          src={staticFile(imageSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            borderRadius: 22,
          }}
        />
      </div>

      {/* Label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <LabelIcon size={18} color={GOLD} strokeWidth={2} />
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 18,
            fontWeight: 600,
            color: LIGHT_TEXT,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

/* ─── Main Scene ─── */
const MainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgesEnter = spring({ frame: frame - 130, fps, config: SPRING_SMOOTH });

  return (
    <SceneWrapper glowX="50%" glowY="40%" glowColor={GOLD}>
      {/* Headline */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <Headline delay={0} size={58} align="center">
          {"עיצוב שנראה"}
          {"\n"}
          <GoldText>{"מושלם"}</GoldText>
        </Headline>
      </div>

      {/* Phone mockups */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 28,
        }}
      >
        <PhoneMockup
          isDark={true}
          label="מצב כהה"
          LabelIcon={Moon}
          imageSrc="images/optimized/Studioz-Studio-Details-1-Dark.webp"
          delay={25}
          fromX={-120}
        />
        <PhoneMockup
          isDark={false}
          label="מצב בהיר"
          LabelIcon={Sun}
          imageSrc="images/optimized/Studioz-Studio-Details-1-Light.webp"
          delay={40}
          fromX={120}
        />
      </div>

      {/* Feature badges */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginTop: 28,
          opacity: badgesEnter,
          transform: `translateY(${interpolate(badgesEnter, [0, 1], [20, 0])}px)`,
        }}
      >
        <Badge text="מותאם למותג שלך" color={GOLD} delay={140} Icon={Palette} />
        <Badge text="נגיש ומקצועי" color={SUCCESS} delay={155} Icon={Accessibility} />
      </div>

      {/* Gold Line */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <GoldLine width={180} delay={170} />
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 42,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Footer delay={175} />
      </div>
    </SceneWrapper>
  );
};

/* ─── Main Composition ─── */
export const Ad11_DarkLightShowcase_V2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={240}>
        <MainScene />
      </Sequence>
    </AbsoluteFill>
  );
};
