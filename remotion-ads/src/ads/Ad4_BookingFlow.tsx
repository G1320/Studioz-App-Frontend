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

// ── Scene 1: 3-Step Booking Flow ──
const BookingSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { num: "01", title: "בחר אולפן", desc: "גלה מרחבים מקצועיים\nעם ציוד מאומת", delay: 5 },
    { num: "02", title: "בחר זמן", desc: "ראה זמינות בזמן אמת\nוהזמן בקליק", delay: 40 },
    { num: "03", title: "ההזמנה בוצעה", desc: "שלם, קבל אישור\nוהגע מוכן", delay: 75 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        padding: 50,
        ...RTL,
      }}
    >
      {/* Header */}
      <div style={{ marginTop: 100, marginBottom: 40, textAlign: "center" }}>
        <span
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 20,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          איך זה עובד
        </span>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 56,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "12px 0 0",
            lineHeight: 1.2,
            opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          הזמנה ב-3 צעדים
        </h1>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 30, marginTop: 20 }}>
        {steps.map((step, i) => {
          const enter = spring({ frame: frame - step.delay, fps, config: { damping: 12, stiffness: 80 } });
          const numberScale = spring({ frame: frame - step.delay - 5, fps, config: { damping: 8, stiffness: 120 } });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 30,
                backgroundColor: DARK_CARD,
                borderRadius: 24,
                padding: "35px 30px",
                border: `1px solid rgba(255,209,102,${0.1 + i * 0.05})`,
                opacity: enter,
                transform: `translateX(${interpolate(enter, [0, 1], [60, 0])}px)`,
              }}
            >
              {/* Number circle */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: i === 2 ? GOLD : "rgba(255,209,102,0.1)",
                  border: `2px solid ${GOLD}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transform: `scale(${numberScale})`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 28,
                    fontWeight: 800,
                    color: i === 2 ? DARK_BG : GOLD,
                  }}
                >
                  {step.num}
                </span>
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: "'DM Sans', 'Heebo', sans-serif",
                    fontSize: 30,
                    fontWeight: 700,
                    color: LIGHT_TEXT,
                    margin: "0 0 8px",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                    fontSize: 20,
                    color: SUBTLE_TEXT,
                    margin: 0,
                    lineHeight: 1.5,
                    whiteSpace: "pre-line",
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connecting line */}
      <div
        style={{
          position: "absolute",
          right: 88,
          top: 370,
          width: 2,
          height: interpolate(frame, [20, 90], [0, 380], { extrapolateRight: "clamp" }),
          backgroundColor: "rgba(255,209,102,0.2)",
        }}
      />
    </AbsoluteFill>
  );
};

// ── Scene 2: Booking Screenshot + CTA ──
const BookingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      {/* Screenshot */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 30,
          right: 30,
          transform: `translateY(${interpolate(slideUp, [0, 1], [150, 0])}px)`,
          opacity: slideUp,
        }}
      >
        <div
          style={{
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(255,209,102,0.2)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        >
          <Img
            src={staticFile("images/optimized/Studioz-Studio-Details-Order-1-Light.webp")}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>

      {/* Bottom overlay with CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "80px 50px 120px",
          background: `linear-gradient(0deg, ${DARK_BG} 40%, transparent 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 15px",
            opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          פשוט, מהיר, <span style={{ color: GOLD }}>ובלי טלפונים</span>
        </h2>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 25,
            opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              backgroundColor: GOLD,
              padding: "16px 40px",
              borderRadius: 14,
              boxShadow: "0 0 40px rgba(255,209,102,0.2)",
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
              הזמן עכשיו
            </span>
          </div>
        </div>

        <span
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 16,
            color: SUBTLE_TEXT,
            marginTop: 18,
            opacity: interpolate(frame, [30, 45], [0, 0.7], { extrapolateRight: "clamp" }),
          }}
        >
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad4_BookingFlow: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={140}>
        <BookingSteps />
      </Sequence>
      <Sequence from={140} durationInFrames={100}>
        <BookingCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
