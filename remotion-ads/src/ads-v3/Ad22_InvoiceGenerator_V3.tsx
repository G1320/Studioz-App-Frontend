/**
 * Ad22 — Invoice Generator V3
 * Invoice mockup appearing with animation
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  DARK_CARD_HOVER,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldText,
  EmojiFeature,
  Badge,
  CTAScene,
} from "./shared";

/* ─── Invoice Mockup ─── */
const InvoiceMockup: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slideUp = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 60 } });
  const stampEnter = spring({ frame: frame - delay - 50, fps, config: { damping: 8, stiffness: 100 } });

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: "40px 36px",
        width: 520,
        transform: `translateY(${interpolate(slideUp, [0, 1], [200, 0])}px)`,
        opacity: slideUp,
        boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 40px ${GOLD}06`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 30 }}>
        <div>
          <div style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 700, color: "#0a0e14" }}>
            חשבונית מס / קבלה
          </div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 16, color: "#64748b", marginTop: 4 }}>
            #INV-2024-0847
          </div>
        </div>
        <Img
          src={staticFile("logo.png")}
          style={{ width: 48, height: 48, borderRadius: 12 }}
        />
      </div>

      {/* Line items */}
      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 20 }}>
        {[
          { item: "השכרת אולפן — 3 שעות", price: "₪450" },
          { item: "ציוד נוסף", price: "₪120" },
        ].map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <span style={{ fontFamily: FONT_BODY, fontSize: 18, color: "#334155", direction: "rtl" }}>
              {row.item}
            </span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 600, color: "#0f172a" }}>
              {row.price}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
          paddingTop: 16,
          borderTop: "2px solid #0a0e14",
        }}
      >
        <span style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: "#0a0e14" }}>
          סה״כ
        </span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: "#0a0e14" }}>
          ₪570
        </span>
      </div>

      {/* Paid stamp */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 40,
          transform: `scale(${stampEnter}) rotate(-12deg)`,
          opacity: stampEnter,
        }}
      >
        <div
          style={{
            border: `4px solid ${SUCCESS}`,
            borderRadius: 12,
            padding: "8px 20px",
            fontFamily: FONT_HEADING,
            fontSize: 24,
            fontWeight: 800,
            color: SUCCESS,
            letterSpacing: 3,
          }}
        >
          שולם ✓
        </div>
      </div>
    </div>
  );
};

/* ─── Scene 1: Invoice Feature ─── */
const InvoiceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={10} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.07} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 20,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
            opacity: headEnter,
          }}
        >
          🧾 חשבוניות אוטומטיות
        </span>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "16px 50px 0",
            lineHeight: 1.3,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          חשבוניות{"\n"}
          <GoldText>בלחיצה אחת</GoldText>
        </h2>
      </div>

      {/* Invoice mockup */}
      <div style={{ position: "absolute", top: 320, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <InvoiceMockup delay={10} />
      </div>

      {/* Features at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          padding: "0 30px",
          ...RTL,
        }}
      >
        <EmojiFeature emoji="✉️" label="שליחה ללקוח" delay={55} />
        <EmojiFeature emoji="📊" label="מעקב תשלומים" delay={63} />
        <EmojiFeature emoji="🔄" label="חשבוניות חוזרות" delay={71} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const InvoiceCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        הפסק לעקוב{"\n"}
        <GoldText>אחרי חשבוניות</GoldText>
      </>
    }
    buttonText="התחל לשלוח חשבוניות"
    freeText="התחל בחינם — ₪0/חודש"
    subText="חשבוניות אוטומטיות · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad22_InvoiceGenerator_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <InvoiceScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <InvoiceCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
