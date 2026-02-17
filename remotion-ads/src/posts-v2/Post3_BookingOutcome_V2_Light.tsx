import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const GOLD = "#d4a843";
const BG = "#f8f9fb";
const CARD = "#ffffff";
const TEXT = "#141820";
const SUB = "#5a6270";
const SUCCESS = "#059669";
const RTL: React.CSSProperties = { direction: "rtl" };
const CARD_SHADOW = "0 1px 4px rgba(0,0,0,0.06)";

export const Post3_BookingOutcome_V2_Light: React.FC = () => {
  const steps = [
    { icon: "🔍", title: "לקוח מחפש סטודיו", desc: "מוצא את העמוד שלך בגוגל" },
    { icon: "📅", title: "בוחר תאריך ושעה", desc: "רואה זמינות בזמן אמת" },
    { icon: "💳", title: "משלם ומאשר", desc: "תשלום מאובטח בקליק" },
    { icon: "✅", title: "ההזמנה נסגרה", desc: "בלי שיחת טלפון אחת" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, ...RTL }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "60px 60px 50px",
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: TEXT,
            margin: "0 0 14px",
            lineHeight: 1.3,
          }}
        >
          מהזמנה ראשונה{"\n"}
          ועד תשלום —{"\n"}
          <span style={{ color: GOLD }}>בלי לגעת בטלפון</span>
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 22,
            color: SUB,
            margin: "0 0 36px",
            lineHeight: 1.6,
          }}
        >
          הלקוחות שלך מזמינים לבד, 24/7.{"\n"}
          אתה רק מגיע לעבוד.
        </p>

        {/* Flow steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 48 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: i === steps.length - 1 ? GOLD : CARD,
                    border: `2px solid ${i === steps.length - 1 ? GOLD : "rgba(212,168,67,0.3)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: CARD_SHADOW,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{step.icon}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 2, height: 14, backgroundColor: "rgba(212,168,67,0.2)", marginTop: 4 }} />
                )}
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: CARD,
                  borderRadius: 14,
                  padding: "18px 24px",
                  boxShadow: CARD_SHADOW,
                  border: i === steps.length - 1 ? `1px solid ${SUCCESS}30` : "none",
                }}
              >
                <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 21, fontWeight: 700, color: TEXT, marginBottom: 3 }}>
                  {step.title}
                </div>
                <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 17, color: SUB }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Badge */}
        <div
          style={{
            backgroundColor: `${SUCCESS}15`,
            borderRadius: 14,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginTop: 24,
          }}
        >
          <span style={{ fontSize: 20 }}>📈</span>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 20, fontWeight: 600, color: SUCCESS }}>
            +35% הזמנות בממוצע אחרי חודש
          </span>
        </div>

        {/* Bottom brand */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 16, color: SUB }}>studioz.co.il</span>
            <Img src={staticFile("logo.png")} style={{ width: 36, height: 36, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
