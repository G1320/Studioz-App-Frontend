import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981";
const RTL: React.CSSProperties = { direction: "rtl" };

const SplitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalAmount = 600;
  const splits = [
    { name: "דני", amount: 200, delay: 50, emoji: "👤" },
    { name: "שרה", amount: 200, delay: 65, emoji: "👤" },
    { name: "אור", amount: 200, delay: 80, emoji: "👤" },
  ];
  const paidCount = splits.filter((s) => frame > s.delay + 30).length;

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      <div style={{ marginTop: 70, textAlign: "center", marginBottom: 25 }}>
        <Img src={staticFile("logo.png")} style={{ width: 48, height: 48, borderRadius: 10, marginBottom: 12, opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }} />
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          תשלום <span style={{ color: GOLD }}>מפוצל</span>
        </h1>
      </div>

      {/* Total */}
      <div style={{ backgroundColor: DARK_CARD, borderRadius: 16, padding: "20px 24px", textAlign: "center", marginBottom: 25, border: `1px solid ${GOLD}20`, opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" }) }}>
        <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT, marginBottom: 6 }}>סה״כ לתשלום</div>
        <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 48, fontWeight: 700, color: GOLD }}>₪{totalAmount}</div>
        <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT, marginTop: 6 }}>÷ {splits.length} משתתפים = ₪{totalAmount / splits.length} כל אחד</div>
      </div>

      {/* Split cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {splits.map((s, i) => {
          const enter = spring({ frame: frame - s.delay, fps, config: { damping: 12 } });
          const paid = frame > s.delay + 30;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, backgroundColor: DARK_CARD, borderRadius: 14, padding: "16px 18px", border: `1px solid ${paid ? SUCCESS : "rgba(255,255,255,0.04)"}`, opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)` }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", backgroundColor: `${GOLD}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 18 }}>{s.emoji}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: LIGHT_TEXT, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 14, color: SUBTLE_TEXT }}>₪{s.amount}</div>
              </div>
              {paid && (
                <div style={{ backgroundColor: `${SUCCESS}20`, borderRadius: 20, padding: "6px 14px" }}>
                  <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, fontWeight: 600, color: SUCCESS }}>שולם ✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div style={{ textAlign: "center", marginTop: 20, opacity: interpolate(frame, [90, 105], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: SUCCESS, fontWeight: 600 }}>{paidCount}/{splits.length} שילמו</span>
      </div>
    </AbsoluteFill>
  );
};

const SplitCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 5px" }}>כל אחד משלם</h2>
        <p style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 600, color: GOLD, textAlign: "center", margin: "0 0 25px" }}>את החלק שלו</p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>נסה עכשיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad50_SplitPayment: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={150}><SplitScene /></Sequence>
    <Sequence from={150} durationInFrames={90}><SplitCTA /></Sequence>
  </AbsoluteFill>
);
