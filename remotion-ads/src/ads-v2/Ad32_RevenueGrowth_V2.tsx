import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { TrendingUp, Users, Repeat } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH, SPRING_BOUNCY,
  NoiseOverlay, AmbientParticles, RadialGlow, GoldButton, Footer, GoldText,
} from "./shared";

export const Ad32_RevenueGrowth_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });
  const chartEnter = spring({ frame: frame - 30, fps, config: { damping: 18, stiffness: 80 } });

  const dataPoints = [20, 28, 25, 35, 42, 38, 50, 58, 55, 68, 78, 92];
  const maxVal = Math.max(...dataPoints);
  const chartW = 984;
  const chartH = 220;

  const stats = [
    { Icon: TrendingUp, text: "+31% הכנסות", delay: 110 },
    { Icon: Users, text: "+23% לקוחות", delay: 122 },
    { Icon: Repeat, text: "89% שימור", delay: 134 },
  ];

  // Build SVG path for smooth curve
  const points = dataPoints.map((v, i) => ({
    x: (i / (dataPoints.length - 1)) * chartW,
    y: chartH - (v / maxVal) * (chartH - 20),
  }));
  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `${acc} C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
  }, "");
  const areaD = `${pathD} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 58, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          הכנסות שגדלות{"\n"}<GoldText>כל חודש</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 24px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          צמיחה עקבית עם הכלים הנכונים
        </p>

        {/* Line chart */}
        <div style={{
          backgroundColor: DARK_CARD, borderRadius: 18, padding: "24px 20px 16px",
          border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          opacity: chartEnter, transform: `scale(${interpolate(chartEnter, [0, 1], [0.95, 1])})`,
        }}>
          <div style={{ fontFamily: FONT_HEADING, fontSize: 16, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 14 }}>
            הכנסות חודשיות
          </div>
          <svg width="100%" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GOLD} stopOpacity="0.3" />
                <stop offset="100%" stopColor={GOLD} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#goldGrad)" />
            <path d={pathD} fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
            {/* End dot */}
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="6" fill={GOLD}>
              <animate attributeName="r" values="6;9;6" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, padding: "0 4px" }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: SUBTLE_TEXT }}>ינו׳</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: SUBTLE_TEXT }}>דצמ׳</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {stats.map((s, i) => {
            const enter = spring({ frame: frame - s.delay, fps, config: SPRING_SMOOTH });
            return (
              <div key={i} style={{
                flex: 1, backgroundColor: DARK_CARD, borderRadius: 14, padding: "14px 12px",
                textAlign: "center", border: "1px solid rgba(255,209,102,0.08)",
                opacity: enter, transform: `scale(${enter})`,
              }}>
                <s.Icon size={18} color={SUCCESS} strokeWidth={2} style={{ marginBottom: 6 }} />
                <div style={{ fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 600, color: SUCCESS }}>{s.text}</div>
              </div>
            );
          })}
        </div>

        <GoldButton text="התחל לגדול" delay={150} size="sm" />

        <div style={{ flex: 1 }} />
        <Footer delay={170} />
      </div>
    </AbsoluteFill>
  );
};
