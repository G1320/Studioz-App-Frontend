import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#f1f5f9";
const SUBTLE_TEXT = "#b8c0cc";
const SUCCESS = "#10b981";

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: Shield + trust indicators ──
const SecurityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shieldEnter = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 100 } });

  const badges = [
    { icon: "🔒", text: "הצפנת SSL", delay: 30 },
    { icon: "💳", text: "מאושר PCI DSS", delay: 42 },
    { icon: "🛡️", text: "אימות דו-שלבי", delay: 54 },
    { icon: "✅", text: "החזר כספי מובטח", delay: 66 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 50, ...RTL }}>
      {/* Shield icon */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 100, marginBottom: 20 }}>
        <div style={{ fontSize: 80, transform: `scale(${shieldEnter})`, opacity: shieldEnter }}>🛡️</div>
      </div>

      <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 10px", lineHeight: 1.2, opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" }) }}>
        תשלומים{"\n"}<span style={{ color: GOLD }}>מאובטחים</span>
      </h1>
      <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT, textAlign: "center", margin: "0 0 30px", opacity: interpolate(frame, [18, 30], [0, 1], { extrapolateRight: "clamp" }) }}>
        הלקוחות שלך בידיים בטוחות
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {badges.map((badge, i) => {
          const enter = spring({ frame: frame - badge.delay, fps, config: { damping: 12, stiffness: 80 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, backgroundColor: DARK_CARD, borderRadius: 16, padding: "20px 22px", border: "1px solid rgba(16,185,129,0.1)", opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)` }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{badge.icon}</span>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: LIGHT_TEXT, fontWeight: 500 }}>{badge.text}</span>
              <span style={{ fontSize: 20, marginRight: "auto", color: SUCCESS }}>✓</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: CTA ──
const PaymentCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 15px" }}>
          ללא דאגות,{"\n"}<span style={{ color: GOLD }}>רק הכנסות</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 20, boxShadow: "0 0 40px rgba(255,209,102,0.2)", opacity: interpolate(frame, [15, 28], [0, 1], { extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>התחל לקבל תשלומים</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad23_PaymentSecure: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={140}>
        <SecurityScene />
      </Sequence>
      <Sequence from={140} durationInFrames={100}>
        <PaymentCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
