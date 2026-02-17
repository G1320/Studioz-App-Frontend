/**
 * Ad10_AutomationMagic_V5
 * Theme: Automation features
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
import { Zap, FileText, Bell, RefreshCcw } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  RTL,
  FONT_HEADING,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  FeatureCard,
  ScreenshotFrame,
  CTAScene,
  useScale,
} from "./shared";

/* ─── Scene 1: Automation Features ─── */
const SceneAutomation: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={s(500)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(44)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(26),
        }}
      >
        <SectionLabel text="AUTOMATION" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(46),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(8)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-25), 0])}px)`,
          }}
        >
          {"אוטומציה ש"}
          <GoldText>{"עובדת בשבילך"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(16), marginTop: s(15) }}>
          <FeatureCard
            Icon={Zap}
            title="אישור הזמנות אוטומטי"
            desc="הלקוח מזמין, המערכת מאשרת"
            delay={15}
          />
          <FeatureCard
            Icon={FileText}
            title="חשבוניות אוטומטיות"
            desc="חשבונית נוצרת אוטומטית עם כל תשלום"
            delay={25}
          />
          <FeatureCard
            Icon={Bell}
            title="התראות בזמן אמת"
            desc="קבל עדכון על כל הזמנה חדשה"
            delay={35}
          />
          <FeatureCard
            Icon={RefreshCcw}
            title="סנכרון יומן"
            desc="Google Calendar מתעדכן לבד"
            delay={45}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Documents Screenshot ─── */
const SceneDocuments: React.FC = () => {
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
        <SectionLabel text="INVOICES" delay={0} />

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
          {"חשבוניות "}
          <GoldText>{"אוטומטיות"}</GoldText>
        </h2>

        <div style={{ marginTop: s(15) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Documents.png"
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
        {"תן למערכת "}
        <GoldText>{"לעבוד"}</GoldText>
        {"\n"}
        {"בשבילך"}
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad10_AutomationMagic_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneAutomation />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneDocuments />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
