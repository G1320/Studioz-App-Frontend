import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Search, CalendarDays, CreditCard, CheckCircle2, TrendingUp } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post3_BookingOutcome_V2: React.FC = () => {
  const steps = [
    { Icon: Search, title: "לקוח מחפש סטודיו", desc: "מוצא את העמוד שלך בגוגל" },
    { Icon: CalendarDays, title: "בוחר תאריך ושעה", desc: "רואה זמינות בזמן אמת" },
    { Icon: CreditCard, title: "משלם ומאשר", desc: "תשלום מאובטח בקליק" },
    { Icon: CheckCircle2, title: "ההזמנה נסגרה", desc: "בלי שיחת טלפון אחת" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
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
            color: LIGHT_TEXT,
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
            color: SUBTLE_TEXT,
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
                    backgroundColor: i === steps.length - 1 ? GOLD : DARK_CARD,
                    border: `2px solid ${i === steps.length - 1 ? GOLD : "rgba(255,209,102,0.2)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <step.Icon size={22} color={i === steps.length - 1 ? DARK_BG : GOLD} strokeWidth={2} />
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 2, height: 14, backgroundColor: "rgba(255,209,102,0.15)", marginTop: 4 }} />
                )}
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: DARK_CARD,
                  borderRadius: 14,
                  padding: "18px 24px",
                  border: `1px solid ${i === steps.length - 1 ? `${SUCCESS}30` : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 21, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 3 }}>
                  {step.title}
                </div>
                <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 17, color: SUBTLE_TEXT }}>
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
            border: `1px solid ${SUCCESS}30`,
            borderRadius: 14,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginTop: 24,
          }}
        >
          <TrendingUp size={20} color={SUCCESS} strokeWidth={2.5} />
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 20, fontWeight: 600, color: SUCCESS }}>
            +35% הזמנות בממוצע אחרי חודש
          </span>
        </div>

        {/* Bottom brand */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>studioz.co.il</span>
            <Img src={staticFile("logo.png")} style={{ width: 36, height: 36, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
