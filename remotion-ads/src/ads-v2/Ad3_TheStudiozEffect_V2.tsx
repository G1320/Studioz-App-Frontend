/**
 * Ad3 — The Studioz Effect V2
 * Kinetic stats showcase
 * 270 frames / 9s @ 30fps
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
import { MapPin, Clock, Zap, Timer } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldButton,
  Footer,
  GoldText,
  StatCard,
} from "./shared";

/* ─── Scene 1: Logo + Headline ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEnter = spring({ frame: frame - 3, fps, config: SPRING_BOUNCY });
  const headEnter = spring({ frame: frame - 18, fps, config: SPRING_SMOOTH });
  const lineEnter = spring({ frame: frame - 35, fps, config: SPRING_GENTLE });

  const exitOpacity = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL, opacity: exitOpacity }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="42%" size={650} opacity={0.12} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "0 48px",
          position: "relative",
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${logoEnter})`,
            opacity: logoEnter,
            marginBottom: 45,
            filter: `drop-shadow(0 0 30px ${GOLD}20)`,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{ width: 120, height: 120, borderRadius: 26 }}
          />
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 64,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.2,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          האפקט של
          {"\n"}
          <GoldText>סטודיוז</GoldText>
        </h1>

        {/* Gold line */}
        <div style={{ marginTop: 35, opacity: lineEnter }}>
          <GoldLine width={180} delay={35} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Stats Grid ─── */
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: "15+", label: "ערים", Icon: MapPin, delay: 8 },
    { value: "24/7", label: "זמינות", Icon: Clock, delay: 18 },
    { value: "₪0", label: "עמלת הקמה", Icon: Zap, delay: 28 },
    { value: "5 דק׳", label: "זמן הקמה", Icon: Timer, delay: 38 },
  ];

  const exitOpacity = interpolate(frame, [95, 110], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL, opacity: exitOpacity }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="50%" size={600} opacity={0.09} />
      <RadialGlow x="25%" y="35%" size={350} color="#5b8fb9" opacity={0.04} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "0 44px",
          position: "relative",
        }}
      >
        {/* 2x2 grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            width: "100%",
          }}
        >
          {stats.map((s, i) => (
            <StatCard
              key={i}
              value={s.value}
              label={s.label}
              delay={s.delay}
              Icon={s.Icon}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });
  const ctaEnter = spring({ frame: frame - 25, fps, config: SPRING_BOUNCY });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="45%" size={550} opacity={0.1} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "0 48px",
          gap: 40,
          position: "relative",
        }}
      >
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 58,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.25,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          מוכנים <GoldText>לשדרוג?</GoldText>
        </h1>

        <div style={{ transform: `scale(${ctaEnter})`, opacity: ctaEnter }}>
          <GoldButton text="התחילו עכשיו" delay={0} size="lg" />
        </div>

        <div style={{ position: "absolute", bottom: 52, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Footer delay={30} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Main Composition ─── */
export const Ad3_TheStudiozEffect_V2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={90} premountFor={10}>
        <Scene1 />
      </Sequence>
      <Sequence from={90} durationInFrames={110} premountFor={15}>
        <Scene2 />
      </Sequence>
      <Sequence from={200} durationInFrames={70} premountFor={15}>
        <Scene3 />
      </Sequence>
    </AbsoluteFill>
  );
};
