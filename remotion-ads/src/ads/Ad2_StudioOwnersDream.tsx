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

// ── Scene 1: Problem Statement ──
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const problems = [
    { text: "רודף אחרי לקוחות להזמנות", icon: "📞", delay: 15 },
    { text: "הזמנות כפולות ביומן", icon: "📅", delay: 30 },
    { text: "חשבוניות באמצע הלילה", icon: "🧾", delay: 45 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        ...RTL,
      }}
    >
      <h2
        style={{
          fontFamily: "'DM Sans', 'Heebo', sans-serif",
          fontSize: 52,
          fontWeight: 700,
          color: LIGHT_TEXT,
          textAlign: "center",
          marginBottom: 60,
          opacity: spring({ frame, fps, config: { damping: 14 } }),
          transform: `translateY(${interpolate(
            spring({ frame, fps, config: { damping: 14 } }),
            [0, 1],
            [30, 0]
          )}px)`,
        }}
      >
        נשמע מוכר?
      </h2>

      {problems.map((p, i) => {
        const enter = spring({ frame: frame - p.delay, fps, config: { damping: 12 } });
        const strikethrough = interpolate(frame, [70 + i * 5, 80 + i * 5], [0, 100], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 30,
              opacity: enter,
              transform: `translateX(${interpolate(enter, [0, 1], [80, 0])}px)`,
            }}
          >
            <span style={{ fontSize: 42 }}>{p.icon}</span>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 30,
                  color: SUBTLE_TEXT,
                }}
              >
                {p.text}
              </span>
              {/* Strikethrough line */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 0,
                  width: `${strikethrough}%`,
                  height: 3,
                  backgroundColor: "#dc2626",
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Transition text */}
      <p
        style={{
          fontFamily: "'DM Sans', 'Heebo', sans-serif",
          fontSize: 38,
          fontWeight: 600,
          color: GOLD,
          marginTop: 50,
          textAlign: "center",
          opacity: interpolate(frame, [85, 100], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(frame, [85, 100], [0.8, 1], { extrapolateRight: "clamp" })})`,
        }}
      >
        יש דרך טובה יותר.
      </p>
    </AbsoluteFill>
  );
};

// ── Scene 2: Dashboard & Calendar Feature ──
const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 60 } });

  const features = [
    { label: "סנכרון יומן אוטומטי", icon: "🔄" },
    { label: "תשלומים מיידיים", icon: "💳" },
    { label: "אפס הזמנות כפולות", icon: "✅" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
          ...RTL,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 18,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
          }}
        >
          מרכז הבקרה שלך
        </span>
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "12px 60px 0",
            lineHeight: 1.2,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          ניהול מרכזי
        </h2>
      </div>

      {/* Dashboard screenshot */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 40,
          right: 40,
          transform: `translateY(${interpolate(slideUp, [0, 1], [200, 0])}px)`,
          opacity: slideUp,
        }}
      >
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(255,209,102,0.2)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        >
          <Img
            src={staticFile("images/optimized/Studioz-Dashboard-Calendar.webp")}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>

      {/* Feature pills at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 16,
          flexWrap: "wrap",
          padding: "0 40px",
          ...RTL,
        }}
      >
        {features.map((f, i) => {
          const pillEnter = spring({ frame: frame - 30 - i * 8, fps, config: { damping: 12 } });
          return (
            <div
              key={i}
              style={{
                backgroundColor: DARK_CARD,
                border: "1px solid rgba(255,209,102,0.15)",
                borderRadius: 50,
                padding: "14px 24px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: pillEnter,
                transform: `translateY(${interpolate(pillEnter, [0, 1], [20, 0])}px)`,
              }}
            >
              <span style={{ fontSize: 22 }}>{f.icon}</span>
              <span
                style={{
                  fontFamily: "'DM Sans', 'Heebo', sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: LIGHT_TEXT,
                }}
              >
                {f.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Availability Controls ──
const AvailabilityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
          ...RTL,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 18,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          שליטה בלו״ז
        </span>
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "12px 50px 0",
            lineHeight: 1.3,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          קבל הזמנות{"\n"}
          <span style={{ color: GOLD }}>רק כשזה מתאים לך</span>
        </h2>
      </div>

      {/* Availability controls screenshot */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 30,
          right: 30,
          transform: `translateY(${interpolate(slideIn, [0, 1], [150, 0])}px)`,
          opacity: slideIn,
        }}
      >
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(255,209,102,0.2)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        >
          <Img
            src={staticFile("images/optimized/Studio-Availability-Controls-desktop-1-V3.webp")}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>

      {/* Bottom bullets */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 60,
          right: 60,
          ...RTL,
        }}
      >
        {["שעות גמישות לכל יום", "זמני מעבר אוטומטיים", "אישור מיידי או ידני"].map(
          (text, i) => {
            const itemEnter = spring({ frame: frame - 35 - i * 8, fps, config: { damping: 12 } });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 18,
                  opacity: itemEnter,
                  transform: `translateX(${interpolate(itemEnter, [0, 1], [40, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: SUCCESS,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                    fontSize: 22,
                    color: LIGHT_TEXT,
                  }}
                >
                  {text}
                </span>
              </div>
            );
          }
        )}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Pricing CTA ──
const PricingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleIn = spring({ frame, fps, config: { damping: 12 } });
  const buttonPulse = interpolate(frame % 50, [0, 25, 50], [1, 1.04, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        ...RTL,
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,209,102,0.1) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${scaleIn})`,
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 100,
            height: 100,
            borderRadius: 20,
            marginBottom: 35,
          }}
        />

        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 50,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 10px 0",
            lineHeight: 1.3,
          }}
        >
          הפוך את האולפן שלך
        </h2>
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 50,
            fontWeight: 700,
            color: GOLD,
            textAlign: "center",
            margin: "0 0 30px 0",
          }}
        >
          לעסק מתפקד
        </h2>

        {/* Free badge */}
        <div
          style={{
            backgroundColor: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 50,
            padding: "10px 30px",
            marginBottom: 30,
            opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 22,
              fontWeight: 600,
              color: SUCCESS,
            }}
          >
            התחל בחינם — ₪0/חודש
          </span>
        </div>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 22,
            color: SUBTLE_TEXT,
            textAlign: "center",
            margin: "0 0 40px 0",
            lineHeight: 1.6,
            opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          ללא כרטיס אשראי{"\n"}ללא התחייבות
        </p>

        {/* CTA Button */}
        <div
          style={{
            backgroundColor: GOLD,
            paddingLeft: 50,
            paddingRight: 50,
            paddingTop: 22,
            paddingBottom: 22,
            borderRadius: 16,
            transform: `scale(${buttonPulse})`,
            opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
            boxShadow: "0 0 50px rgba(255,209,102,0.25)",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 26,
              fontWeight: 700,
              color: DARK_BG,
            }}
          >
            פרסם את האולפן שלך עכשיו
          </span>
        </div>

        <span
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 18,
            color: SUBTLE_TEXT,
            marginTop: 25,
            opacity: interpolate(frame, [45, 60], [0, 0.7], { extrapolateRight: "clamp" }),
          }}
        >
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── Main Composition ──
export const Ad2_StudioOwnersDream: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={110}>
        <ProblemScene />
      </Sequence>
      <Sequence from={110} durationInFrames={80}>
        <DashboardScene />
      </Sequence>
      <Sequence from={190} durationInFrames={80}>
        <AvailabilityScene />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <PricingCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
