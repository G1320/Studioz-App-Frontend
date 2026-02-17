/**
 * Ad33_StudioComparison_V4
 * Theme: Before Studioz vs With Studioz comparison — only real features
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
  X,
  Check,
} from "lucide-react";
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
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  ScreenshotCTAScene,
} from "./shared";

/* ─── Comparison Row ─── */
const ComparisonRow: React.FC<{
  before: string;
  after: string;
  delay: number;
}> = ({ before, after, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 90 } });

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
      }}
    >
      {/* Before */}
      <div
        style={{
          flex: 1,
          backgroundColor: DARK_CARD,
          borderRadius: 16,
          padding: "18px 16px",
          border: `1px solid ${RED}15`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <X size={18} color={RED} strokeWidth={2.5} />
        <span style={{ fontFamily: FONT_BODY, fontSize: 19, color: SUBTLE_TEXT }}>
          {before}
        </span>
      </div>

      {/* After */}
      <div
        style={{
          flex: 1,
          backgroundColor: DARK_CARD,
          borderRadius: 16,
          padding: "18px 16px",
          border: `1px solid ${SUCCESS}15`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Check size={18} color={SUCCESS} strokeWidth={2.5} />
        <span style={{ fontFamily: FONT_BODY, fontSize: 19, color: LIGHT_TEXT }}>
          {after}
        </span>
      </div>
    </div>
  );
};

/* ─── Scene 1: Comparison Table ─── */
const SceneComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 36px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 22,
        }}
      >
        <SectionLabel text="COMPARISON" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 6px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          {"לפני "}
          <GoldText>{"ואחרי"}</GoldText>
          {" Studioz"}
        </h1>

        <GoldLine delay={8} width={120} />

        {/* Column Headers */}
        <div
          style={{
            display: "flex",
            gap: 14,
            marginTop: 10,
            opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 600, color: RED }}>
              {"לפני"}
            </span>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 600, color: SUCCESS }}>
              {"עם Studioz"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ComparisonRow before="טלפונים" after="הזמנות אונליין" delay={15} />
          <ComparisonRow before="יומן נייר" after="יומן דיגיטלי + Google Calendar" delay={25} />
          <ComparisonRow before="חשבוניות ידניות" after="חשבוניות אוטומטיות" delay={35} />
          <ComparisonRow before="ביטולים ללא הודעה" after="הגנת מקדמה" delay={45} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Screenshot CTA ─── */
const SceneCTA: React.FC = () => (
  <ScreenshotCTAScene
    screenshotSrc="images/optimized/Studioz-Dashboard-Calendar.webp"
    headline={
      <>
        {"שדרגו את "}
        <span style={{ color: "#ffd166" }}>{"ניהול האולפן"}</span>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad33_StudioComparison_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={120} premountFor={15}>
      <SceneComparison />
    </Sequence>
    <Sequence from={120} durationInFrames={120} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
