/**
 * Ad28 — Availability Management (NOT waitlist)
 * 240 frames (8s) at 30fps, 1080x1920 (9:16 portrait)
 * V5: Availability controls + Dashboard-Calendar screenshots.
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
import { Clock, CalendarCheck } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUBTLE_TEXT,
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
  ScreenshotFrame,
  BulletList,
  CTAScene,
  Footer,
  useScale,
} from "./shared";

/* ─── Scene 1: Availability Controls Screenshot ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="30%" size={s(500)} opacity={0.1} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
        }}
      >
        <SectionLabel text="AVAILABILITY" delay={0} />
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(48),
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.25,
            margin: `${s(25)}px ${s(10)}px ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(30), 0])}px)`,
          }}
        >
          {"שליטה מלאה\n"}
          <GoldText>בזמינות</GoldText>
        </h1>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: s(22),
            color: SUBTLE_TEXT,
            margin: `${s(10)}px ${s(10)}px ${s(25)}px`,
            lineHeight: 1.5,
            opacity: interpolate(frame, [8, 22], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
          }}
        >
          תגדיר מתי אתה זמין, המערכת תעשה את השאר
        </p>
        <ScreenshotFrame
          src="images/optimized/Studio-Availability-Controls-desktop-1-V3.webp"
          delay={12}
        />
        <div style={{ marginTop: "auto" }}>
          <Footer delay={35} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Calendar + Bullet List ─── */
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="30%" size={s(450)} opacity={0.08} />
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
            margin: `${s(10)}px ${s(25)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(25), 0])}px)`,
          }}
        >
          <GoldText>לוח שנה</GoldText> מלא
        </h2>
        <ScreenshotFrame
          src="images/optimized/Dashboard-Calendar.png"
            cropTop={13}
          delay={8}
        />
        <GoldLine delay={20} width={100} />
        <div style={{ marginTop: s(25) }}>
          <BulletList
            items={[
              "קבע שעות לכל יום",
              "זמני מעבר בין הזמנות",
              "חסום תאריכים",
              "אישור ידני או אוטומטי",
            ]}
            startDelay={25}
            gap={14}
          />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={50} />
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
        הזמינות שלך, <GoldText>הכללים שלך</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad28_AvailabilityManagement_V5: React.FC = () => (
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
