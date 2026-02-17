import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981";
const RTL: React.CSSProperties = { direction: "rtl" };

const RevenueScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Revenue line chart points
  const points = [0, 0.15, 0.25, 0.2, 0.4, 0.55, 0.5, 0.65, 0.75, 0.7, 0.85, 1.0];
  const chartWidth = 900; const chartHeight = 350; const chartTop = 400; const chartLeft = 90;

  const progress = interpolate(frame, [15, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const visiblePoints = Math.floor(progress * points.length);

  const milestones = [
    { value: "₪10K", y: 0.33, delay: 50 },
    { value: "₪50K", y: 0.66, delay: 75 },
    { value: "₪100K", y: 1.0, delay: 100 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <div style={{ position: "absolute", top: 80, left: 0, right: 0, textAlign: "center" }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT, margin: 0, lineHeight: 1.2, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          הגדל את <span style={{ color: GOLD }}>ההכנסות שלך</span>
        </h1>
      </div>

      {/* Chart */}
      <svg style={{ position: "absolute", top: chartTop, left: chartLeft }} width={chartWidth} height={chartHeight}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((h, i) => (
          <line key={i} x1={0} y1={chartHeight * (1 - h)} x2={chartWidth} y2={chartHeight * (1 - h)} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        ))}
        {/* Line */}
        {points.slice(0, visiblePoints).map((p, i) => {
          if (i === 0) return null;
          const x1 = ((i - 1) / (points.length - 1)) * chartWidth;
          const y1 = chartHeight * (1 - points[i - 1]);
          const x2 = (i / (points.length - 1)) * chartWidth;
          const y2 = chartHeight * (1 - p);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={SUCCESS} strokeWidth={3} strokeLinecap="round" />;
        })}
        {/* Dots */}
        {points.slice(0, visiblePoints).map((p, i) => {
          const x = (i / (points.length - 1)) * chartWidth;
          const y = chartHeight * (1 - p);
          return <circle key={i} cx={x} cy={y} r={5} fill={SUCCESS} />;
        })}
      </svg>

      {/* Milestone markers */}
      {milestones.map((m, i) => {
        const enter = spring({ frame: frame - m.delay, fps, config: { damping: 12 } });
        return (
          <div key={i} style={{ position: "absolute", left: chartLeft + chartWidth + 10, top: chartTop + chartHeight * (1 - m.y) - 14, opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [20, 0])}px)` }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: GOLD }}>{m.value}</span>
          </div>
        );
      })}

      {/* Growth stat */}
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", opacity: interpolate(frame, [110, 125], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 60, fontWeight: 800, color: SUCCESS }}>+340%</span>
        <br />
        <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: SUBTLE_TEXT }}>גידול בהכנסות תוך 6 חודשים</span>
      </div>
    </AbsoluteFill>
  );
};

const RevenueCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 15px" }}>
          מוכן לגדול?{"\n"}<span style={{ color: GOLD }}>אנחנו פה</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 20, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>התחל לגדול</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad32_RevenueGrowth: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><RevenueScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><RevenueCTA /></Sequence>
  </AbsoluteFill>
);
