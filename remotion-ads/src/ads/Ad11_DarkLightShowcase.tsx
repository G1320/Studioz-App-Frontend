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

// ── Scene 1: Side by side screenshots ──
const PhoneShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftSlide = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 60 } });
  const rightSlide = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      {/* Header */}
      <div style={{ position: "absolute", top: 80, left: 0, right: 0, textAlign: "center", zIndex: 10 }}>
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 55,
            height: 55,
            borderRadius: 11,
            marginBottom: 18,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
          }}
        />
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 40px",
            lineHeight: 1.2,
            opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          נראה מדהים{"\n"}<span style={{ color: GOLD }}>בכל מצב</span>
        </h1>
      </div>

      {/* Two phone mockups */}
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 20,
          padding: "0 30px",
        }}
      >
        {/* Dark mode phone */}
        <div
          style={{
            width: 460,
            height: 920,
            borderRadius: 28,
            overflow: "hidden",
            border: "2px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            transform: `translateY(${interpolate(leftSlide, [0, 1], [200, 0])}px)`,
            opacity: leftSlide,
          }}
        >
          <Img
            src={staticFile("images/optimized/Studioz-Studio-Details-1-Dark.webp")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Light mode phone */}
        <div
          style={{
            width: 460,
            height: 920,
            borderRadius: 28,
            overflow: "hidden",
            border: "2px solid rgba(255,209,102,0.15)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            transform: `translateY(${interpolate(rightSlide, [0, 1], [200, 30])}px)`,
            opacity: rightSlide,
          }}
        >
          <Img
            src={staticFile("images/optimized/Studioz-Studio-Details-1-Light.webp")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Labels */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 130,
          opacity: interpolate(frame, [45, 60], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 22, fontWeight: 600, color: SUBTLE_TEXT }}>
          כהה
        </span>
        <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 22, fontWeight: 600, color: SUBTLE_TEXT }}>
          בהיר
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: Detail screenshots ──
const DetailShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftSlide = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 60 } });
  const rightSlide = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      {/* Header */}
      <div style={{ position: "absolute", top: 80, left: 0, right: 0, textAlign: "center", zIndex: 10 }}>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 40,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 40px",
            lineHeight: 1.3,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          עיצוב שהופך מבקרים{"\n"}<span style={{ color: GOLD }}>ללקוחות משלמים</span>
        </h1>
      </div>

      {/* Two detail screenshots */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 20,
          padding: "0 30px",
        }}
      >
        <div
          style={{
            width: 460,
            height: 920,
            borderRadius: 28,
            overflow: "hidden",
            border: "2px solid rgba(255,209,102,0.12)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            transform: `translateY(${interpolate(leftSlide, [0, 1], [150, 0])}px)`,
            opacity: leftSlide,
          }}
        >
          <Img
            src={staticFile("images/optimized/Studioz-Studio-Details-2-Dark.webp")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div
          style={{
            width: 460,
            height: 920,
            borderRadius: 28,
            overflow: "hidden",
            border: "2px solid rgba(255,209,102,0.15)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            transform: `translateY(${interpolate(rightSlide, [0, 1], [150, 30])}px)`,
            opacity: rightSlide,
          }}
        >
          <Img
            src={staticFile("images/optimized/Studioz-Studio-Detail-2-Light.webp")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* CTA at bottom */}
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
        <div style={{ backgroundColor: GOLD, padding: "16px 45px", borderRadius: 14, boxShadow: "0 0 30px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 22, fontWeight: 700, color: DARK_BG }}>
            פרסם את האולפן שלך
          </span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad11_DarkLightShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={120}>
        <PhoneShowcase />
      </Sequence>
      <Sequence from={120} durationInFrames={120}>
        <DetailShowcase />
      </Sequence>
    </AbsoluteFill>
  );
};
