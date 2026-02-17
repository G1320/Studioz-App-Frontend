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
const RED = "#dc2626";

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: Countdown urgency + discount ──
const CountdownScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineEnter = spring({ frame: frame - 5, fps, config: { damping: 12 } });
  const discountNum = Math.round(interpolate(frame, [40, 90], [0, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const clockRotation = interpolate(frame, [0, 140], [0, 720]);
  const urgencyPulse = frame > 100 ? interpolate(frame % 20, [0, 10, 20], [1, 1.08, 1]) : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 45, ...RTL }}>
      {/* Clock icon */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 100, marginBottom: 25 }}>
        <div
          style={{
            width: 120, height: 120, borderRadius: "50%", border: `4px solid ${GOLD}`,
            display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: GOLD, position: "absolute", zIndex: 2 }} />
          <div
            style={{
              position: "absolute", width: 3, height: 40, backgroundColor: GOLD, borderRadius: 2,
              transformOrigin: "bottom center", bottom: "50%", transform: `rotate(${clockRotation}deg)`,
            }}
          />
        </div>
      </div>

      <h1
        style={{
          fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT,
          textAlign: "center", margin: "0 0 10px", lineHeight: 1.2,
          opacity: headlineEnter, transform: `translateY(${interpolate(headlineEnter, [0, 1], [30, 0])}px)`,
        }}
      >
        הנחת <span style={{ color: GOLD }}>Early Bird</span>
      </h1>

      <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: SUBTLE_TEXT, textAlign: "center", margin: "0 0 30px", opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" }) }}>
        מזמינים מוקדם, חוסכים יותר
      </p>

      {/* Discount badge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 30, opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" }), transform: `scale(${urgencyPulse})` }}>
        <div style={{ backgroundColor: DARK_CARD, borderRadius: 24, padding: "30px 50px", border: `2px solid ${GOLD}`, textAlign: "center", boxShadow: "0 0 40px rgba(255,209,102,0.15)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 90, fontWeight: 800, color: GOLD, lineHeight: 1 }}>{discountNum}%</span>
          <br />
          <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 24, color: LIGHT_TEXT, fontWeight: 500 }}>הנחה על הזמנה מוקדמת</span>
        </div>
      </div>

      <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: RED, textAlign: "center", marginTop: 18, fontWeight: 600, opacity: frame > 100 ? interpolate(frame % 30, [0, 15, 30], [0.5, 1, 0.5]) : 0 }}>
        המבצע נגמר בקרוב!
      </p>
    </AbsoluteFill>
  );
};

// ── Scene 2: CTA ──
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  const pulse = interpolate(frame % 45, [0, 22, 45], [1, 1.04, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 100, height: 100, borderRadius: 20, marginBottom: 30 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 8px", lineHeight: 1.2 }}>
          הזמן מוקדם <span style={{ color: GOLD }}>ותחסוך</span>
        </h2>
        <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: SUBTLE_TEXT, textAlign: "center", margin: "0 0 35px", opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" }) }}>
          20% הנחה כשמזמינים מראש
        </p>
        <div style={{ backgroundColor: GOLD, padding: "20px 55px", borderRadius: 14, transform: `scale(${pulse})`, opacity: interpolate(frame, [15, 28], [0, 1], { extrapolateRight: "clamp" }), boxShadow: "0 0 50px rgba(255,209,102,0.25)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 26, fontWeight: 700, color: DARK_BG }}>הזמן עכשיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: SUBTLE_TEXT, marginTop: 20, opacity: interpolate(frame, [25, 36], [0, 0.7], { extrapolateRight: "clamp" }) }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad19_EarlyBirdDiscount: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160}>
        <CountdownScene />
      </Sequence>
      <Sequence from={160} durationInFrames={80}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
