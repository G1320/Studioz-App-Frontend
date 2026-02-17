/**
 * Ad33_StudioComparison_V5
 * Theme: Before/After comparison — real features only
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
import { X, Check } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RED,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  ScreenshotCTAScene,
  useScale,
} from "./shared";

/* ─── Comparison Row ─── */
const CompRow: React.FC<{
  text: string;
  isBefore: boolean;
  delay: number;
}> = ({ text, isBefore, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SNAPPY });
  const color = isBefore ? RED : SUCCESS;
  const Icon = isBefore ? X : Check;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: s(14),
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [isBefore ? 40 : -40, 0])}px)`,
      }}
    >
      <div
        style={{
          width: s(36),
          height: s(36),
          borderRadius: 10,
          backgroundColor: `${color}15`,
          border: `1px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={color} strokeWidth={2.5} />
      </div>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: s(21),
          color: isBefore ? SUBTLE_TEXT : LIGHT_TEXT,
          textDecoration: isBefore ? "line-through" : "none",
        }}
      >
        {text}
      </span>
    </div>
  );
};

/* ─── Scene 1: Before vs After ─── */
const SceneComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="30%" y="40%" size={s(400)} color={RED} opacity={0.05} />
      <RadialGlow x="70%" y="60%" size={s(400)} color={SUCCESS} opacity={0.05} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(50)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(30),
        }}
      >
        <SectionLabel text="COMPARISON" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(46),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-30), 0])}px)`,
          }}
        >
          {"לפני "}
          <GoldText>{"ואחרי"}</GoldText>
        </h1>

        <GoldLine delay={8} width={100} />

        {/* Before column */}
        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 20,
            padding: `${s(24)}px ${s(28)}px`,
            border: `1px solid ${RED}15`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontSize: s(20),
              fontWeight: 700,
              color: RED,
              marginBottom: s(18),
            }}
          >
            {"לפני Studioz"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: s(14) }}>
            <CompRow text="תיאום טלפוני" isBefore delay={15} />
            <CompRow text="יומן נייר" isBefore delay={22} />
            <CompRow text="חשבוניות ידניות" isBefore delay={29} />
            <CompRow text="הפסדים מ-No Show" isBefore delay={36} />
          </div>
        </div>

        {/* After column */}
        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 20,
            padding: `${s(24)}px ${s(28)}px`,
            border: `1px solid ${SUCCESS}15`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontSize: s(20),
              fontWeight: 700,
              color: SUCCESS,
              marginBottom: s(18),
            }}
          >
            {"אחרי Studioz"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: s(14) }}>
            <CompRow text="הזמנות אונליין" isBefore={false} delay={45} />
            <CompRow text="יומן דיגיטלי" isBefore={false} delay={52} />
            <CompRow text="חשבוניות אוטומטיות" isBefore={false} delay={59} />
            <CompRow text="הגנת מקדמה" isBefore={false} delay={66} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Screenshot + CTA ─── */
const SceneDashboardCTA: React.FC = () => (
  <ScreenshotCTAScene
    screenshotSrc="images/optimized/Dashboard-Main.png"
    screenshotCropTop={13}
    headline={
      <>
        {"עברו ל"}
        <GoldText>{"ניהול חכם"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad33_StudioComparison_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={120} premountFor={15}>
      <SceneComparison />
    </Sequence>
    <Sequence from={120} durationInFrames={120} premountFor={15}>
      <SceneDashboardCTA />
    </Sequence>
  </AbsoluteFill>
);
