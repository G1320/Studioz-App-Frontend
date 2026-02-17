import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Search, CalendarDays, CreditCard, CheckCircle2, TrendingUp } from "lucide-react";
import { FONT_HEADING, FONT_BODY } from "./fonts";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post3_BookingOutcome_V4: React.FC = () => {
  const steps = [
    { Icon: Search, title: "לקוח מחפש סטודיו", desc: "מוצא את העמוד שלך בגוגל" },
    { Icon: CalendarDays, title: "בוחר תאריך ושעה", desc: "רואה זמינות בזמן אמת" },
    { Icon: CreditCard, title: "משלם ומאשר", desc: "תשלום מאובטח בקליק" },
    { Icon: CheckCircle2, title: "ההזמנה נסגרה", desc: "בלי שיחת טלפון אחת" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      {/* Noise texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "52px 56px 42px",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 70,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 12px",
            lineHeight: 1.2,
          }}
        >
          מהזמנה ראשונה{"\n"}
          ועד תשלום —{"\n"}
          <span style={{ color: GOLD, filter: `drop-shadow(0 0 18px ${GOLD}30)` }}>בלי לגעת בטלפון</span>
        </h1>

        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 22,
            color: SUBTLE_TEXT,
            margin: "0 0 28px",
            lineHeight: 1.55,
          }}
        >
          הלקוחות שלך מזמינים לבד, 24/7.{"\n"}
          אתה רק מגיע לעבוד.
        </p>

        {/* Flow steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 46 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    backgroundColor: i === steps.length - 1 ? GOLD : DARK_CARD,
                    border: `2px solid ${i === steps.length - 1 ? GOLD : "rgba(255,209,102,0.2)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: i === steps.length - 1 ? `0 0 20px ${GOLD}30` : "none",
                  }}
                >
                  <step.Icon size={21} color={i === steps.length - 1 ? DARK_BG : GOLD} strokeWidth={2} />
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 2, height: 12, backgroundColor: "rgba(255,209,102,0.15)", marginTop: 3 }} />
                )}
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: DARK_CARD,
                  borderRadius: 14,
                  padding: "16px 22px",
                  border: `1px solid ${i === steps.length - 1 ? `${SUCCESS}30` : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <div style={{ fontFamily: FONT_HEADING, fontSize: 21, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 2 }}>
                  {step.title}
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: SUBTLE_TEXT }}>
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
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginTop: 18,
          }}
        >
          <TrendingUp size={20} color={SUCCESS} strokeWidth={2.5} />
          <span style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: SUCCESS }}>
            +35%
          </span>
          <span style={{ fontFamily: FONT_HEADING, fontSize: 19, fontWeight: 600, color: SUCCESS }}>
            הזמנות בממוצע אחרי חודש
          </span>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 14 }}>
          <Img src={staticFile("logo.png")} style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontFamily: FONT_HEADING, fontSize: 14, color: SUBTLE_TEXT }}>
            studioz.co.il
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
