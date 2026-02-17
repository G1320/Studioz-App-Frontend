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

// ── Scene 1: What owners say ──
const TestimonialsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const testimonials = [
    {
      quote: "מאז שעברנו לסטודיוז, ההזמנות עלו ב-40% והפסקתי לענות לטלפונים",
      name: "בעל אולפן, תל אביב",
      stars: 5,
      delay: 10,
    },
    {
      quote: "הלקוחות מזמינים לבד, משלמים מראש, ואני מקבל התראה. פשוט עובד",
      name: "מפיק מוזיקלי, ירושלים",
      stars: 5,
      delay: 45,
    },
    {
      quote: "הפרויקטים מרחוק הכפילו לי את ההכנסות בלי להגדיל שעות עבודה",
      name: "מהנדס סאונד, חיפה",
      stars: 5,
      delay: 80,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 45, ...RTL }}>
      {/* Header */}
      <div style={{ marginTop: 80, textAlign: "center", marginBottom: 35 }}>
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 55,
            height: 55,
            borderRadius: 11,
            marginBottom: 18,
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
          }}
        />
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 5px",
            lineHeight: 1.2,
            opacity: interpolate(frame, [3, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          בעלי אולפנים{"\n"}<span style={{ color: GOLD }}>כבר שם</span>
        </h1>
      </div>

      {/* Testimonial cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {testimonials.map((t, i) => {
          const enter = spring({ frame: frame - t.delay, fps, config: { damping: 12, stiffness: 70 } });

          return (
            <div
              key={i}
              style={{
                backgroundColor: DARK_CARD,
                borderRadius: 20,
                padding: "25px 22px",
                border: "1px solid rgba(255,255,255,0.05)",
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
              }}
            >
              {/* Stars */}
              <div style={{ marginBottom: 10 }}>
                {Array.from({ length: t.stars }).map((_, j) => (
                  <span key={j} style={{ fontSize: 18, color: GOLD }}>★</span>
                ))}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 22,
                  color: LIGHT_TEXT,
                  margin: "0 0 12px",
                  lineHeight: 1.4,
                  fontStyle: "italic",
                }}
              >
                "{t.quote}"
              </p>

              {/* Attribution */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,209,102,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 16 }}>🎵</span>
                </div>
                <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT, fontWeight: 500 }}>
                  {t.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom stat */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [110, 125], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 22, color: GOLD, fontWeight: 600 }}>
          הצטרף לקהילה הגדלה של בעלי אולפנים
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: CTA ──
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  const pulse = interpolate(frame % 45, [0, 22, 45], [1, 1.04, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,209,102,0.08) 0%, transparent 60%)" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 100, height: 100, borderRadius: 20, marginBottom: 30 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 50, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 8px", lineHeight: 1.2 }}>
          מוכן לצמוח?
        </h2>
        <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: SUBTLE_TEXT, textAlign: "center", margin: "0 0 35px", opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" }) }}>
          הצטרף לבעלי אולפנים שסומכים על סטודיוז
        </p>
        <div
          style={{
            backgroundColor: GOLD,
            padding: "20px 55px",
            borderRadius: 14,
            transform: `scale(${pulse})`,
            opacity: interpolate(frame, [15, 28], [0, 1], { extrapolateRight: "clamp" }),
            boxShadow: "0 0 50px rgba(255,209,102,0.25)",
          }}
        >
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 26, fontWeight: 700, color: DARK_BG }}>
            פרסם את האולפן שלך
          </span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: SUBTLE_TEXT, marginTop: 20, opacity: interpolate(frame, [25, 36], [0, 0.7], { extrapolateRight: "clamp" }) }}>
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad18_SocialProof: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160}>
        <TestimonialsScene />
      </Sequence>
      <Sequence from={160} durationInFrames={80}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
