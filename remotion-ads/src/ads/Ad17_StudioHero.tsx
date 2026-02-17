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
const LIGHT_TEXT = "#f1f5f9";
const SUBTLE_TEXT = "#b8c0cc";

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: Full-bleed studio image with floating text ──
const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = interpolate(frame, [0, 150], [1.1, 1], { extrapolateRight: "clamp" });
  const overlayDarken = interpolate(frame, [0, 40], [0.3, 0.65], { extrapolateRight: "clamp" });

  const words = ["מרחבים", "מקצועיים", "ליוצרים", "מקצועיים."];

  return (
    <AbsoluteFill>
      {/* Full bleed studio image */}
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <Img
          src={staticFile("images/original/Landing-Studio1320-1.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
          }}
        />
      </div>

      {/* Gradient overlay */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(10,14,20,${overlayDarken * 0.8}) 0%, rgba(10,14,20,${overlayDarken}) 50%, ${DARK_BG} 90%)`,
        }}
      />

      {/* Logo at top */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <Img src={staticFile("logo.png")} style={{ width: 65, height: 65, borderRadius: 13 }} />
      </div>

      {/* Words stacking one by one */}
      <div
        style={{
          position: "absolute",
          bottom: 350,
          left: 60,
          right: 60,
          ...RTL,
        }}
      >
        {words.map((word, i) => {
          const enter = spring({ frame: frame - 20 - i * 12, fps, config: { damping: 10, stiffness: 100 } });
          return (
            <h1
              key={i}
              style={{
                fontFamily: "'DM Sans', 'Heebo', sans-serif",
                fontSize: 68,
                fontWeight: 800,
                color: i === words.length - 1 ? GOLD : LIGHT_TEXT,
                margin: 0,
                lineHeight: 1.15,
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
              }}
            >
              {word}
            </h1>
          );
        })}
      </div>

      {/* Tagline */}
      <p
        style={{
          position: "absolute",
          bottom: 200,
          left: 60,
          right: 60,
          fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
          fontSize: 24,
          color: SUBTLE_TEXT,
          lineHeight: 1.5,
          opacity: interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" }),
          ...RTL,
        }}
      >
        גלה והזמן את אולפני ההקלטה והפודקאסט הטובים בישראל
      </p>

      {/* CTA pill */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [85, 100], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ backgroundColor: GOLD, padding: "16px 45px", borderRadius: 14, boxShadow: "0 0 30px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>מצא אולפן</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: Screenshots spread ──
const ScreenshotSpread: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const screenshots = [
    { src: "images/optimized/Studioz-Studio-Details-1-Light.webp", y: 0, delay: 5 },
    { src: "images/optimized/Studioz-Studio-Details-Order-1-Light.webp", y: 40, delay: 15 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      {/* Header */}
      <div style={{ position: "absolute", top: 80, left: 0, right: 0, textAlign: "center", zIndex: 10 }}>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 42,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 40px",
            lineHeight: 1.2,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          חווית הזמנה{"\n"}<span style={{ color: GOLD }}>ברמה אחרת</span>
        </h1>
      </div>

      {/* Side-by-side screenshots */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 20,
          right: 20,
          display: "flex",
          gap: 16,
          justifyContent: "center",
        }}
      >
        {screenshots.map((s, i) => {
          const enter = spring({ frame: frame - s.delay, fps, config: { damping: 14, stiffness: 60 } });
          return (
            <div
              key={i}
              style={{
                width: 470,
                height: 960,
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255,209,102,0.12)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                transform: `translateY(${interpolate(enter, [0, 1], [150, s.y])}px)`,
                opacity: enter,
              }}
            >
              <Img src={staticFile(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: interpolate(frame, [35, 50], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad17_StudioHero: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={140}>
        <HeroScene />
      </Sequence>
      <Sequence from={140} durationInFrames={100}>
        <ScreenshotSpread />
      </Sequence>
    </AbsoluteFill>
  );
};
