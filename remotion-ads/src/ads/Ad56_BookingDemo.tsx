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
const SUCCESS = "#10b981";

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: Hook — "Still taking bookings over WhatsApp?" ──
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEnter = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 70 } });
  const subtitleEnter = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" });

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
          width: 70,
          height: 70,
          borderRadius: 14,
          marginBottom: 30,
          opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
        }}
      />
      <h1
        style={{
          fontFamily: "'DM Sans', 'Heebo', sans-serif",
          fontSize: 50,
          fontWeight: 700,
          color: LIGHT_TEXT,
          textAlign: "center",
          margin: 0,
          lineHeight: 1.3,
          opacity: titleEnter,
          transform: `translateY(${interpolate(titleEnter, [0, 1], [25, 0])}px)`,
        }}
      >
        עדיין סוגרים הזמנות{"\n"}
        <span style={{ color: GOLD }}>בוואטסאפ?</span>
      </h1>
      <p
        style={{
          fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
          fontSize: 26,
          color: SUBTLE_TEXT,
          textAlign: "center",
          marginTop: 24,
          opacity: subtitleEnter,
        }}
      >
        תראו איך זה נראה כשלקוח{"\n"}מזמין דרך סטודיוז 👇
      </p>
    </AbsoluteFill>
  );
};

// ── Scene 2: Full booking demo video ──
const BookingFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const videoEnter = spring({ frame: frame - 3, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      {/* "Live demo" badge */}
      <div
        style={{
          position: "absolute",
          top: 25,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 50,
            padding: "6px 22px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: SUCCESS,
              boxShadow: `0 0 8px ${SUCCESS}`,
            }}
          />
          <span
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: SUCCESS,
            }}
          >
            הדגמה חיה
          </span>
        </div>
      </div>

      {/* Video — skip first 3 seconds to jump to the action */}
      <div
        style={{
          position: "absolute",
          top: 65,
          left: 25,
          right: 25,
          opacity: videoEnter,
          transform: `translateY(${interpolate(videoEnter, [0, 1], [60, 0])}px)`,
        }}
      >
        <div
          style={{
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid rgba(255,209,102,0.12)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <OffthreadVideo
            src={staticFile("videos/booking-demo.mp4")}
            startFrom={90}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>

      {/* Bottom gradient with CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "80px 50px 110px",
          background: `linear-gradient(0deg, ${DARK_BG} 40%, transparent 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ...RTL,
        }}
      >
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 6px",
            opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          מגילוי אולפן עד הזמנה —{" "}
          <span style={{ color: GOLD }}>בדקות</span>
        </h2>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 19,
            color: SUBTLE_TEXT,
            textAlign: "center",
            margin: "0 0 22px",
            opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          בלי טלפונים, בלי וואטסאפ, בלי בלאגן
        </p>
        <div
          style={{
            backgroundColor: GOLD,
            padding: "18px 50px",
            borderRadius: 14,
            boxShadow: "0 0 40px rgba(255,209,102,0.2)",
            opacity: interpolate(frame, [35, 50], [0, 1], { extrapolateRight: "clamp" }),
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
            תנו ללקוחות להזמין לבד
          </span>
        </div>
        <span
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 15,
            color: SUBTLE_TEXT,
            marginTop: 14,
            opacity: interpolate(frame, [40, 55], [0, 0.7], { extrapolateRight: "clamp" }),
          }}
        >
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad56_BookingDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={70}>
        <Hook />
      </Sequence>
      <Sequence from={70} durationInFrames={657}>
        <BookingFlow />
      </Sequence>
    </AbsoluteFill>
  );
};
