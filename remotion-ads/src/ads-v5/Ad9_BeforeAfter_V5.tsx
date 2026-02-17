/**
 * Ad9_BeforeAfter_V5
 * Theme: Before vs After
 * Duration: 240 frames (8s) at 30fps, 1080x1920
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  Phone,
  CalendarX,
  FileText,
  Calendar,
  CreditCard,
  Bell,
} from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  RED,
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
  PainCard,
  FeatureCard,
  ScreenshotFrame,
  CTAScene,
  useScale,
} from "./shared";

/* ─── Scene 1: Before vs After ─── */
const SceneCompare: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });
  const afterEnter = spring({ frame: frame - 55, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="30%" y="30%" size={s(400)} color={RED} opacity={0.05} />
      <RadialGlow x="70%" y="70%" size={s(400)} color={GOLD} opacity={0.05} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(44)}px ${s(60)}px`,
          height: "100%",
          gap: s(22),
        }}
      >
        {/* Before */}
        <div
          style={{
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-20), 0])}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: s(12), marginBottom: s(16) }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: RED,
                boxShadow: `0 0 8px ${RED}`,
              }}
            />
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: s(28),
                fontWeight: 700,
                color: RED,
              }}
            >
              {"לפני"}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: s(12) }}>
            <PainCard Icon={Phone} text="שיחות טלפון אין סוף" delay={10} />
            <PainCard Icon={CalendarX} text="בלאגן ביומן" delay={18} />
            <PainCard Icon={FileText} text="חשבוניות ידניות" delay={26} />
          </div>
        </div>

        {/* After */}
        <div
          style={{
            opacity: afterEnter,
            transform: `translateY(${interpolate(afterEnter, [0, 1], [s(30), 0])}px)`,
            marginTop: s(20),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: s(12), marginBottom: s(16) }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: SUCCESS,
                boxShadow: `0 0 8px ${SUCCESS}`,
              }}
            />
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: s(28),
                fontWeight: 700,
                color: SUCCESS,
              }}
            >
              {"אחרי"}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: s(12) }}>
            <FeatureCard
              Icon={Calendar}
              title="הזמנות אוטומטיות"
              delay={60}
              accentColor={SUCCESS}
            />
            <FeatureCard
              Icon={CreditCard}
              title="תשלומים מיידיים"
              delay={68}
              accentColor={SUCCESS}
            />
            <FeatureCard
              Icon={Bell}
              title="התראות בזמן אמת"
              delay={76}
              accentColor={SUCCESS}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Screenshot ─── */
const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={s(600)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
          gap: s(25),
        }}
      >
        <SectionLabel text="DASHBOARD" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(42),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-20), 0])}px)`,
          }}
        >
          {"הכל "}
          <GoldText>{"מסודר"}</GoldText>
        </h2>

        <div style={{ marginTop: s(15) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Main.png"
            cropTop={13}
            delay={10}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const SceneCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        {"עבור מבלאגן"}
        {"\n"}
        {"ל"}
        <GoldText>{"שליטה מלאה"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad9_BeforeAfter_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={100} premountFor={15}>
      <SceneCompare />
    </Sequence>
    <Sequence from={100} durationInFrames={70} premountFor={15}>
      <SceneDashboard />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
