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

// ── Scene 1: Speed counter ──
const SpeedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Count up from 0 to "seconds"
  const countValue = Math.min(Math.floor(frame / 3), 30);
  const showCheck = frame > 95;

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      {/* Pulsing rings */}
      {showCheck &&
        [0, 1, 2].map((i) => {
          const ringFrame = frame - 95;
          const ringScale = interpolate(
            (ringFrame + i * 20) % 80,
            [0, 80],
            [0.8, 3]
          );
          const ringOpacity = interpolate(
            (ringFrame + i * 20) % 80,
            [0, 80],
            [0.2, 0]
          );
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 200,
                height: 200,
                borderRadius: "50%",
                border: `2px solid ${SUCCESS}`,
                opacity: ringOpacity,
                transform: `scale(${ringScale})`,
              }}
            />
          );
        })}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 70,
            height: 70,
            borderRadius: 14,
            marginBottom: 40,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
          }}
        />

        <span
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 22,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
            marginBottom: 15,
            opacity: interpolate(frame, [5, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          זמן הזמנה
        </span>

        {/* Big counter */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, direction: "ltr" }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: showCheck ? 140 : 160,
              fontWeight: 800,
              color: showCheck ? SUCCESS : LIGHT_TEXT,
              lineHeight: 1,
            }}
          >
            {showCheck ? "✓" : countValue}
          </span>
          {!showCheck && (
            <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 40, color: SUBTLE_TEXT }}>
              שניות
            </span>
          )}
        </div>

        {showCheck && (
          <span
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 36,
              fontWeight: 700,
              color: LIGHT_TEXT,
              marginTop: 20,
              opacity: interpolate(frame, [98, 110], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            ההזמנה בוצעה!
          </span>
        )}

        {/* Comparison */}
        <div
          style={{
            marginTop: 60,
            display: "flex",
            flexDirection: "column",
            gap: 15,
            alignItems: "center",
            opacity: interpolate(frame, [15, 28], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT, textDecoration: "line-through" }}>
              ☎️ טלפון — 5 דקות
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT, textDecoration: "line-through" }}>
              💬 וואטסאפ — 10 דקות
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 5 }}>
            <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 24, color: GOLD, fontWeight: 600 }}>
              ⚡ סטודיוז — 30 שניות
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: Screenshot + CTA ──
const BookingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slideUp = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 30,
          right: 30,
          transform: `translateY(${interpolate(slideUp, [0, 1], [100, 0])}px)`,
          opacity: slideUp,
        }}
      >
        <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,209,102,0.15)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
          <Img src={staticFile("images/optimized/Studioz-Studio-Details-Order-1-Light.webp")} style={{ width: "100%", height: "auto" }} />
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "100px 50px 120px",
          background: `linear-gradient(0deg, ${DARK_BG} 50%, transparent 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 20px", opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" }) }}>
          הזמנה <span style={{ color: GOLD }}>בלחיצה</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, opacity: interpolate(frame, [18, 32], [0, 1], { extrapolateRight: "clamp" }), boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>מצא אולפן</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: SUBTLE_TEXT, marginTop: 15, opacity: interpolate(frame, [25, 38], [0, 0.7], { extrapolateRight: "clamp" }) }}>
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad12_InstantBooking: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150}>
        <SpeedScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90}>
        <BookingCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
