import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
  OffthreadVideo,
} from "remotion";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const LIGHT_TEXT = "#f1f5f9";
const SUBTLE_TEXT = "#b8c0cc";

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: Teaser headline ──
const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEnter = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 70 } });
  const subtitleOpacity = interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        ...RTL,
      }}
    >
      <Img
        src={staticFile("logo.png")}
        style={{
          width: 80,
          height: 80,
          borderRadius: 16,
          marginBottom: 30,
          opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
        }}
      />
      <h1
        style={{
          fontFamily: "'DM Sans', 'Heebo', sans-serif",
          fontSize: 54,
          fontWeight: 700,
          color: LIGHT_TEXT,
          textAlign: "center",
          margin: 0,
          lineHeight: 1.25,
          opacity: titleEnter,
          transform: `translateY(${interpolate(titleEnter, [0, 1], [30, 0])}px)`,
        }}
      >
        הנה איך נראה{"\n"}
        <span style={{ color: GOLD }}>הדשבורד שלך</span>
      </h1>
      <p
        style={{
          fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
          fontSize: 24,
          color: SUBTLE_TEXT,
          textAlign: "center",
          marginTop: 20,
          opacity: subtitleOpacity,
        }}
      >
        הכל במקום אחד. פשוט עובד.
      </p>
    </AbsoluteFill>
  );
};

// ── Scene 2: Live dashboard video ──
const DashboardVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const videoEnter = spring({ frame: frame - 3, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      {/* Video in a device frame */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 30,
          right: 30,
          opacity: videoEnter,
          transform: `translateY(${interpolate(videoEnter, [0, 1], [80, 0])}px)`,
        }}
      >
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: "2px solid rgba(255,209,102,0.15)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        >
          <OffthreadVideo
            src={staticFile("videos/dashboard-demo.mp4")}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>

      {/* Bottom gradient overlay with CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "100px 50px 120px",
          background: `linear-gradient(0deg, ${DARK_BG} 35%, transparent 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ...RTL,
        }}
      >
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 40,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 20px",
            opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          ניהול <span style={{ color: GOLD }}>חכם</span> מכל מקום
        </h2>
        <div
          style={{
            backgroundColor: GOLD,
            padding: "18px 50px",
            borderRadius: 14,
            boxShadow: "0 0 40px rgba(255,209,102,0.2)",
            opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 24,
              fontWeight: 700,
              color: DARK_BG,
            }}
          >
            נסה בחינם
          </span>
        </div>
        <span
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 15,
            color: SUBTLE_TEXT,
            marginTop: 14,
            opacity: interpolate(frame, [35, 50], [0, 0.7], { extrapolateRight: "clamp" }),
          }}
        >
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad55_DashboardInAction: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={80}>
        <Headline />
      </Sequence>
      <Sequence from={80} durationInFrames={828}>
        <DashboardVideo />
      </Sequence>
    </AbsoluteFill>
  );
};
