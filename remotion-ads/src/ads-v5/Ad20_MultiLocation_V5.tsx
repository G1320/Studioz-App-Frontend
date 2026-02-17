/**
 * Ad20 — Multi-Studio Management (Pro)
 * 240 frames (8s) at 30fps, 1080x1920 (9:16 portrait)
 * V5: Dashboard-Main screenshot showing studio count.
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";
import { Building2, BarChart3, Settings } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  FeatureCard,
  ScreenshotFrame,
  Badge,
  CTAScene,
  Footer,
  useScale,
} from "./shared";

/* ─── Scene 1: Multi-Studio Features ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="25%" size={s(500)} opacity={0.1} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(50)}px ${s(60)}px`,
          height: "100%",
        }}
      >
        <SectionLabel text="PRO PLAN" delay={0} />
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(52),
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.25,
            margin: `${s(30)}px ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(30), 0])}px)`,
          }}
        >
          <GoldText>ניהול מספר אולפנים</GoldText>
        </h1>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: s(22),
            color: SUBTLE_TEXT,
            margin: `${s(10)}px ${s(40)}px`,
            lineHeight: 1.5,
            opacity: interpolate(frame, [8, 22], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
          }}
        >
          ממקום אחד, בלי כאב ראש
        </p>
        <GoldLine delay={12} width={120} />
        <div style={{ display: "flex", flexDirection: "column", gap: s(16), marginTop: s(30) }}>
          <FeatureCard Icon={Building2} title="אולפנים ללא הגבלה" delay={18} />
          <FeatureCard Icon={BarChart3} title="אנליטיקס לכל אולפן" delay={26} />
          <FeatureCard Icon={Settings} title="ניהול מרכזי" delay={34} />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={42} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Screenshot + Badge ─── */
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={s(500)} opacity={0.08} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(42),
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: `0 0 ${s(20)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(20), 0])}px)`,
          }}
        >
          לוח בקרה <GoldText>מרכזי</GoldText>
        </h2>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: s(20) }}>
          <Badge text="בתוכנית Pro" color={GOLD} delay={10} />
        </div>
        <ScreenshotFrame
          src="images/optimized/Dashboard-Main.png"
            cropTop={13}
          delay={15}
        />
        <div style={{ marginTop: "auto" }}>
          <Footer delay={35} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const Scene3: React.FC = () => (
  <CTAScene
    headline={
      <>
        נהל הכל מ<GoldText>מקום אחד</GoldText>
      </>
    }
    badgeText="תוכנית Pro — ₪99/חודש"
  />
);

/* ─── Main Export ─── */
export const Ad20_MultiLocation_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={95} premountFor={15}>
      <Scene1 />
    </Sequence>
    <Sequence from={80} durationInFrames={105} premountFor={15}>
      <Scene2 />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <Scene3 />
    </Sequence>
  </AbsoluteFill>
);
