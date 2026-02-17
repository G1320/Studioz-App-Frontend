/**
 * Ad46 — Community V3
 * Studio owners community with network graph visualization
 * 240 frames / 8s @ 30fps
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
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  ACCENT_BLUE,
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
  EmojiFeature,
  CTAScene,
  SectionLabel,
  StatCard,
} from "./shared";

/* ─── Network Node ─── */
const NetworkNode: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  label?: string;
}> = ({ x, y, size, color, delay, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });
  const pulse = interpolate(Math.sin(frame * 0.04 + delay), [-1, 1], [0.9, 1.1]);

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: `${color}25`,
        border: `2px solid ${color}60`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${enter * pulse})`,
        opacity: enter,
        boxShadow: `0 0 20px ${color}20`,
      }}
    >
      {label && (
        <span style={{ fontSize: size * 0.45 }}>{label}</span>
      )}
    </div>
  );
};

/* ─── Network Connection Line ─── */
const ConnectionLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}> = ({ x1, y1, x2, y2, delay }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div
      style={{
        position: "absolute",
        left: x1,
        top: y1,
        width: length * progress,
        height: 2,
        backgroundColor: `${GOLD}20`,
        transformOrigin: "0 50%",
        transform: `rotate(${angle}deg)`,
      }}
    />
  );
};

/* ─── Scene 1: Network Graph ─── */
const NetworkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  const nodes = [
    { x: 540, y: 620, size: 80, color: GOLD, delay: 10, label: "🎵" },
    { x: 300, y: 500, size: 60, color: ACCENT_BLUE, delay: 18, label: "🎤" },
    { x: 780, y: 500, size: 60, color: SUCCESS, delay: 22, label: "🎸" },
    { x: 220, y: 720, size: 55, color: GOLD, delay: 26, label: "🎹" },
    { x: 860, y: 720, size: 55, color: ACCENT_BLUE, delay: 30, label: "🥁" },
    { x: 400, y: 840, size: 50, color: SUCCESS, delay: 34, label: "🎧" },
    { x: 680, y: 840, size: 50, color: GOLD, delay: 38, label: "🎬" },
    { x: 540, y: 940, size: 45, color: ACCENT_BLUE, delay: 42, label: "📸" },
  ];

  const connections = [
    { x1: 540, y1: 620, x2: 300, y2: 500, delay: 15 },
    { x1: 540, y1: 620, x2: 780, y2: 500, delay: 20 },
    { x1: 300, y1: 500, x2: 220, y2: 720, delay: 25 },
    { x1: 780, y1: 500, x2: 860, y2: 720, delay: 28 },
    { x1: 540, y1: 620, x2: 400, y2: 840, delay: 32 },
    { x1: 540, y1: 620, x2: 680, y2: 840, delay: 36 },
    { x1: 400, y1: 840, x2: 540, y2: 940, delay: 40 },
    { x1: 680, y1: 840, x2: 540, y2: 940, delay: 42 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.07} />

      <div
        style={{
          padding: "70px 48px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          position: "relative",
        }}
      >
        <SectionLabel text="קהילה" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "18px 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          <GoldText>קהילה</GoldText> של בעלי סטודיואים
        </h2>

        <div style={{ marginBottom: 20 }}>
          <GoldLine width={140} delay={10} />
        </div>
      </div>

      {/* Network visualization */}
      <div style={{ position: "absolute", inset: 0 }}>
        {connections.map((c, i) => (
          <ConnectionLine key={i} {...c} />
        ))}
        {nodes.map((n, i) => (
          <NetworkNode key={i} {...n} />
        ))}
      </div>

      {/* Feature pills at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 12,
          padding: "0 36px",
          ...RTL,
        }}
      >
        {[
          { emoji: "💬", label: "פורום מקצועי" },
          { emoji: "🤝", label: "שיתוף ידע" },
          { emoji: "🏆", label: "אירועי נטוורקינג" },
          { emoji: "📈", label: "צמיחה משותפת" },
        ].map((f, i) => (
          <EmojiFeature key={i} emoji={f.emoji} label={f.label} delay={50 + i * 8} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const CommunityCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        הצטרף לקהילה
        {"\n"}
        <GoldText>הגדולה בישראל</GoldText>
      </>
    }
    buttonText="הצטרף לקהילה"
    freeText="חינם · פתוח לכולם"
    subText="500+ בעלי סטודיואים כבר בפנים"
  />
);

/* ─── Main Composition ─── */
export const Ad46_Community_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160} premountFor={10}>
        <NetworkScene />
      </Sequence>
      <Sequence from={160} durationInFrames={80} premountFor={15}>
        <CommunityCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
