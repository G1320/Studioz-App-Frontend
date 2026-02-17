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

// ── Scene 1: Pricing Cards ──
const PricingCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const plans = [
    {
      name: "חינם",
      price: "₪0",
      period: "/חודש",
      features: ["סטודיו אחד", "יומן דיגיטלי", "עד 3 שירותים", "סשנים ללא הגבלה"],
      highlighted: false,
      delay: 10,
    },
    {
      name: "סטארטר",
      price: "₪49",
      period: "/חודש",
      features: ["שירותים ללא הגבלה", "סנכרון Google Calendar", "חשבוניות אוטומטיות", "7 ימי ניסיון חינם"],
      highlighted: true,
      badge: "פופולרי",
      delay: 25,
    },
    {
      name: "פרו",
      price: "₪99",
      period: "/חודש",
      features: ["ניהול מולטי-סטודיו", "אנליטיקס מתקדם", "200 תשלומי כרטיס", "תמיכה עדיפותית"],
      highlighted: false,
      delay: 40,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 35, ...RTL }}>
      {/* Header */}
      <div style={{ marginTop: 80, textAlign: "center", marginBottom: 30 }}>
        <span
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 18,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          תמחור
        </span>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "10px 0",
            lineHeight: 1.2,
            opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          תמחור פשוט <span style={{ color: GOLD }}>ושקוף</span>
        </h1>
      </div>

      {/* Pricing cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {plans.map((plan, i) => {
          const enter = spring({ frame: frame - plan.delay, fps, config: { damping: 12, stiffness: 80 } });

          return (
            <div
              key={i}
              style={{
                position: "relative",
                backgroundColor: plan.highlighted ? "rgba(255,209,102,0.06)" : DARK_CARD,
                borderRadius: 22,
                padding: "28px 25px",
                border: plan.highlighted ? `2px solid ${GOLD}` : "1px solid rgba(255,255,255,0.06)",
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: GOLD,
                    padding: "4px 20px",
                    borderRadius: 20,
                  }}
                >
                  <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 14, fontWeight: 700, color: DARK_BG }}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 26, fontWeight: 700, color: LIGHT_TEXT }}>
                  {plan.name}
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2, direction: "ltr" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 40, fontWeight: 800, color: plan.highlighted ? GOLD : LIGHT_TEXT }}>
                    {plan.price}
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {plan.features.map((feat, j) => (
                  <div
                    key={j}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      borderRadius: 10,
                      padding: "6px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: SUCCESS, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <p
        style={{
          textAlign: "center",
          fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
          fontSize: 18,
          color: SUBTLE_TEXT,
          marginTop: 30,
          opacity: interpolate(frame, [60, 75], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        ללא כרטיס אשראי · ביטול בכל עת
      </p>
    </AbsoluteFill>
  );
};

// ── Scene 2: CTA ──
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  const pulse = interpolate(frame % 45, [0, 22, 45], [1, 1.05, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,209,102,0.08) 0%, transparent 60%)" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})` }}>
        <Img src={staticFile("logo.png")} style={{ width: 90, height: 90, borderRadius: 18, marginBottom: 25 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 50, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 40px 25px", lineHeight: 1.2 }}>
          התחל <span style={{ color: GOLD }}>בחינם</span> היום
        </h2>
        <div
          style={{
            backgroundColor: GOLD,
            padding: "20px 55px",
            borderRadius: 14,
            transform: `scale(${pulse})`,
            opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }),
            boxShadow: "0 0 50px rgba(255,209,102,0.25)",
          }}
        >
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 26, fontWeight: 700, color: DARK_BG }}>
            התחל ניסיון חינם
          </span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: SUBTLE_TEXT, marginTop: 18, opacity: interpolate(frame, [25, 38], [0, 0.7], { extrapolateRight: "clamp" }) }}>
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad8_PricingTiers: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150}>
        <PricingCards />
      </Sequence>
      <Sequence from={150} durationInFrames={90}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
