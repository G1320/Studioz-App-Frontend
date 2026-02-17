import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const GOLD = "#d4a843";
const LIGHT_BG = "#f8f9fb";
const LIGHT_CARD = "#ffffff";
const DARK_TEXT = "#1a1d23";
const SUBTLE_TEXT = "#6b7280";
const SUCCESS = "#059669";

const RTL: React.CSSProperties = { direction: "rtl" };

export const Post3_BookingOutcome_Light: React.FC = () => {
  const steps = [
    { icon: "🔍", title: "לקוח מחפש סטודיו", desc: "מוצא את העמוד שלך בגוגל" },
    { icon: "📅", title: "בוחר תאריך ושעה", desc: "רואה זמינות בזמן אמת" },
    { icon: "💳", title: "משלם ומאשר", desc: "תשלום מאובטח בקליק" },
    { icon: "✅", title: "ההזמנה נסגרה", desc: "בלי שיחת טלפון אחת" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: LIGHT_BG,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "60px 100px",
        ...RTL,
      }}
    >
      {/* Right side - headline */}
      <div style={{ flex: 1, paddingLeft: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <Img src={staticFile("logo.png")} style={{ width: 48, height: 48, borderRadius: 10 }} />
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 22, color: SUBTLE_TEXT, fontWeight: 500 }}>
            סטודיוז
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 58,
            fontWeight: 700,
            color: DARK_TEXT,
            margin: "0 0 20px",
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
            fontSize: 24,
            color: SUBTLE_TEXT,
            margin: "0 0 30px",
            lineHeight: 1.6,
          }}
        >
          הלקוחות שלך מזמינים לבד, 24/7.{"\n"}
          אתה רק מגיע לעבוד.
        </p>

        <div
          style={{
            backgroundColor: `${SUCCESS}10`,
            border: `1px solid ${SUCCESS}25`,
            borderRadius: 14,
            padding: "16px 24px",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 22 }}>📈</span>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 20, fontWeight: 600, color: SUCCESS }}>
            +35% הזמנות בממוצע אחרי חודש
          </span>
        </div>
      </div>

      {/* Left side - flow steps */}
      <div style={{ flex: 0.85, display: "flex", flexDirection: "column", gap: 20 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 50 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: i === steps.length - 1 ? GOLD : LIGHT_CARD,
                  border: `2px solid ${i === steps.length - 1 ? GOLD : "#e5e7eb"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                }}
              >
                <span style={{ fontSize: 24 }}>{step.icon}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 2, height: 20, backgroundColor: "#e5e7eb", marginTop: 4 }} />
              )}
            </div>

            <div
              style={{
                flex: 1,
                backgroundColor: LIGHT_CARD,
                borderRadius: 16,
                padding: "22px 28px",
                border: `1px solid ${i === steps.length - 1 ? `${SUCCESS}25` : "#e5e7eb"}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 22, fontWeight: 700, color: DARK_TEXT, marginBottom: 4 }}>
                {step.title}
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: SUBTLE_TEXT }}>
                {step.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
