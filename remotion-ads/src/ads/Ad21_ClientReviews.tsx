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

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: Star ratings + reviews ──
const ReviewsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stars = [0, 1, 2, 3, 4];
  const reviews = [
    { text: "״האולפן המושלם, הזמנתי בשניות!״", name: "דני מ.", delay: 40 },
    { text: "״שירות מעולה, ממליץ בחום״", name: "יעל כ.", delay: 60 },
    { text: "״סוף סוף פלטפורמה שעובדת״", name: "אור ל.", delay: 80 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 50, ...RTL }}>
      <div style={{ marginTop: 100, textAlign: "center", marginBottom: 30 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 20px", opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          מה הלקוחות אומרים
        </h1>
        {/* Stars */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {stars.map((i) => {
            const starEnter = spring({ frame: frame - 10 - i * 5, fps, config: { damping: 8, stiffness: 150 } });
            return (
              <span key={i} style={{ fontSize: 44, transform: `scale(${starEnter})`, opacity: starEnter, color: GOLD }}>★</span>
            );
          })}
        </div>
        <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT, marginTop: 10, opacity: interpolate(frame, [30, 42], [0, 1], { extrapolateRight: "clamp" }) }}>
          4.9 מתוך 5 | 320+ ביקורות
        </p>
      </div>

      {/* Review cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
        {reviews.map((review, i) => {
          const enter = spring({ frame: frame - review.delay, fps, config: { damping: 12, stiffness: 80 } });
          return (
            <div key={i} style={{ backgroundColor: DARK_CARD, borderRadius: 18, padding: "24px 22px", border: "1px solid rgba(255,209,102,0.08)", opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)` }}>
              <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.5 }}>{review.text}</p>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: GOLD, fontWeight: 600 }}>{review.name}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: CTA ──
const ReviewCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 44, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 10px" }}>
          הדירוגים מדברים{"\n"}<span style={{ color: GOLD }}>בעד עצמם</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 25, boxShadow: "0 0 40px rgba(255,209,102,0.2)", opacity: interpolate(frame, [15, 28], [0, 1], { extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>הצטרף עכשיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad21_ClientReviews: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150}>
        <ReviewsScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90}>
        <ReviewCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
