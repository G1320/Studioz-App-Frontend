/**
 * Ad33 — Studio Comparison V2
 * With vs Without Studioz — dramatic two-column comparison table
 * 240 frames / 8s @ 30fps · 1080×1920
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { X, Check } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  RED,
  FONT_HEADING,
  FONT_BODY,
  RTL,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  Footer,
  Headline,
  GoldText,
  SceneWrapper,
} from "./shared";

/* ─── Comparison Row ─── */
const ComparisonRow: React.FC<{
  leftText: string;
  rightText: string;
  index: number;
  delay: number;
}> = ({ leftText, rightText, index, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rowEnter = spring({
    frame: frame - delay,
    fps,
    config: SPRING_SNAPPY,
  });
  const checkEnter = spring({
    frame: frame - delay - 8,
    fps,
    config: SPRING_BOUNCY,
  });
  const xEnter = spring({
    frame: frame - delay - 4,
    fps,
    config: SPRING_SMOOTH,
  });

  const isEven = index % 2 === 0;

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        opacity: rowEnter,
        transform: `translateY(${interpolate(rowEnter, [0, 1], [30, 0])}px)`,
      }}
    >
      {/* Without column */}
      <div
        style={{
          flex: 1,
          backgroundColor: `${RED}0a`,
          border: `1px solid ${RED}18`,
          borderRadius: 14,
          padding: "16px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: `${RED}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transform: `scale(${xEnter})`,
          }}
        >
          <X size={16} color={RED} strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: 17,
            color: SUBTLE_TEXT,
            fontWeight: 500,
          }}
        >
          {leftText}
        </span>
      </div>

      {/* With column */}
      <div
        style={{
          flex: 1,
          backgroundColor: `${GOLD}0a`,
          border: `1px solid ${GOLD}18`,
          borderRadius: 14,
          padding: "16px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: `${GOLD}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transform: `scale(${checkEnter})`,
          }}
        >
          <Check size={16} color={GOLD} strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: 17,
            color: LIGHT_TEXT,
            fontWeight: 600,
          }}
        >
          {rightText}
        </span>
      </div>
    </div>
  );
};

/* ─── Column Headers ─── */
const ColumnHeaders: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [15, 0])}px)`,
      }}
    >
      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontFamily: FONT_HEADING,
          fontSize: 20,
          fontWeight: 700,
          color: RED,
          paddingBottom: 8,
          borderBottom: `2px solid ${RED}30`,
        }}
      >
        {"בלי סטודיוז"}
      </div>
      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontFamily: FONT_HEADING,
          fontSize: 20,
          fontWeight: 700,
          color: GOLD,
          paddingBottom: 8,
          borderBottom: `2px solid ${GOLD}30`,
        }}
      >
        {"עם סטודיוז"}
      </div>
    </div>
  );
};

/* ─── Main Scene ─── */
const MainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rows = [
    { left: "הזמנות ידניות", right: "אוטומטיות" },
    { left: "יומן גוגל", right: "דשבורד מלא" },
    { left: "וואטסאפ", right: "עמוד הזמנות" },
    { left: "חשבוניות ידניות", right: "אוטומטיות" },
    { left: "ביטולים ללא פיצוי", right: "הגנה מלאה" },
  ];

  return (
    <SceneWrapper glowX="50%" glowY="40%" glowColor={GOLD}>
      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <Headline delay={0} size={54} align="center">
          {"בלי סטודיוז"}
          {"\n"}
          {"מול "}
          <GoldText>{"עם סטודיוז"}</GoldText>
        </Headline>
      </div>

      {/* Column Headers */}
      <ColumnHeaders delay={18} />

      {/* Comparison Rows */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 14,
          marginTop: 20,
        }}
      >
        {rows.map((row, i) => (
          <ComparisonRow
            key={i}
            leftText={row.left}
            rightText={row.right}
            index={i}
            delay={40 + i * 18}
          />
        ))}
      </div>

      {/* Gold Line */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 28,
        }}
      >
        <GoldLine width={200} delay={160} />
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
        <Footer delay={170} />
      </div>
    </SceneWrapper>
  );
};

/* ─── Main Composition ─── */
export const Ad33_StudioComparison_V2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={240}>
        <MainScene />
      </Sequence>
    </AbsoluteFill>
  );
};
