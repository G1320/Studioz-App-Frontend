/**
 * Ad11 — Dark/Light Theme Showcase V3
 * Side-by-side phone mockups showing both themes with real screenshots
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
  LIGHT_TEXT,
  SUBTLE_TEXT,
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
  CTAScene,
  SectionLabel,
  Footer,
} from "./shared";

/* ─── Scene 1: Studio Details (Dark + Light) ─── */
const ThemeScene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="30%" y="50%" size={400} opacity={0.06} />
      <RadialGlow x="70%" y="50%" size={400} color="#ffffff" opacity={0.04} />

      <div
        style={{
          padding: "70px 40px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Logo header */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16,
            opacity: headEnter,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{ width: 60, height: 60, borderRadius: 14 }}
          />
        </div>

        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <SectionLabel text="עיצוב מותאם" delay={5} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "12px 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [20, 0])}px)`,
          }}
        >
          <GoldText>כהה</GoldText> או <GoldText>בהיר</GoldText>
          {"\n"}הבחירה שלך
        </h2>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
          <GoldLine width={120} delay={10} />
        </div>

        {/* Side by side phone mockups */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            flex: 1,
            alignItems: "center",
          }}
        >
          {/* Dark mode */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <PhoneMockup
              src="images/optimized/Studioz-Studio-Details-1-Dark.webp"
              delay={15}
              width={420}
              height={750}
            />
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 18,
                fontWeight: 600,
                color: SUBTLE_TEXT,
                opacity: interpolate(frame, [40, 55], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            >
              🌙 מצב כהה
            </span>
          </div>

          {/* Light mode */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <PhoneMockup
              src="images/optimized/Studioz-Studio-Details-1-Light.webp"
              delay={25}
              width={420}
              height={750}
            />
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 18,
                fontWeight: 600,
                color: SUBTLE_TEXT,
                opacity: interpolate(frame, [50, 65], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            >
              ☀️ מצב בהיר
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Detail Views (Dark + Light) ─── */
const ThemeScene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="45%" size={500} opacity={0.07} />

      <div
        style={{
          padding: "70px 40px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 40,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
          }}
        >
          עמוד אולפן{"\n"}
          <GoldText>בכל עיצוב</GoldText>
        </h2>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <GoldLine width={120} delay={8} />
        </div>

        {/* Side by side detail mockups */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            flex: 1,
            alignItems: "center",
          }}
        >
          {/* Dark detail */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <PhoneMockup
              src="images/optimized/Studioz-Studio-Details-2-Dark.webp"
              delay={10}
              width={420}
              height={750}
            />
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 18,
                fontWeight: 600,
                color: SUBTLE_TEXT,
                opacity: interpolate(frame, [35, 50], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            >
              🌙 כהה
            </span>
          </div>

          {/* Light detail */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <PhoneMockup
              src="images/optimized/Studioz-Studio-Detail-2-Light.webp"
              delay={20}
              width={420}
              height={750}
            />
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 18,
                fontWeight: 600,
                color: SUBTLE_TEXT,
                opacity: interpolate(frame, [45, 60], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            >
              ☀️ בהיר
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <Footer delay={30} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Main Composition ─── */
export const Ad11_DarkLightShowcase_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={120} premountFor={10}>
        <ThemeScene1 />
      </Sequence>
      <Sequence from={120} durationInFrames={120} premountFor={15}>
        <ThemeScene2 />
      </Sequence>
    </AbsoluteFill>
  );
};
