import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Bell, CheckCircle2, FileText, CalendarDays, TrendingUp } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";

const RTL: React.CSSProperties = { direction: "rtl" };

const timeline = [
  {
    time: "07:00",
    text: "הודעה: ״3 הזמנות חדשות ממתינות״",
    icon: Bell,
    color: GOLD,
  },
  {
    time: "08:00",
    text: "הלקוח הראשון מגיע — הכל מאושר מראש",
    icon: CheckCircle2,
    color: GOLD,
  },
  {
    time: "10:00",
    text: "חשבונית נשלחה אוטומטית",
    icon: FileText,
    color: GOLD,
  },
  {
    time: "12:00",
    text: "הזמנה חדשה נכנסה — בלי שיחת טלפון",
    icon: CalendarDays,
    color: GOLD,
  },
  {
    time: "17:00",
    text: "סיכום יום: ₪3,200 הכנסה",
    icon: TrendingUp,
    color: SUCCESS,
  },
];

export const Post19_DailyRoutine_V2: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        ...RTL,
        backgroundColor: DARK_BG,
        fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
        padding: "60px 60px 50px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Headline */}
      <div
        style={{
          fontFamily: "'DM Sans', 'Heebo', sans-serif",
          fontSize: 52,
          fontWeight: 800,
          lineHeight: 1.2,
          color: LIGHT_TEXT,
          marginBottom: 8,
        }}
      >
        הבוקר שלך
        <br />
        <span style={{ color: GOLD }}>עם סטודיוז</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 22,
          color: SUBTLE_TEXT,
          marginBottom: 32,
        }}
      >
        ככה נראה יום עבודה כשהכל אוטומטי
      </div>

      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
        {timeline.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: 18,
                direction: "ltr",
              }}
            >
              {/* Left column: time + line */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 70,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', monospace",
                    fontSize: 18,
                    fontWeight: 700,
                    color: GOLD,
                    marginBottom: 8,
                  }}
                >
                  {step.time}
                </span>
                {i < timeline.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      backgroundColor: GOLD,
                      opacity: 0.3,
                      minHeight: 16,
                    }}
                  />
                )}
              </div>

              {/* Right column: card */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: DARK_CARD,
                  borderRadius: 12,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: i < timeline.length - 1 ? 10 : 0,
                  direction: "rtl",
                }}
              >
                <Icon size={22} color={step.color} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    color: step.color === SUCCESS ? SUCCESS : LIGHT_TEXT,
                    fontSize: 18,
                    fontWeight: step.color === SUCCESS ? 700 : 400,
                  }}
                >
                  {step.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 20,
        }}
      >
        <span style={{ color: SUBTLE_TEXT, fontSize: 18 }}>studioz.co.il</span>
        <Img
          src={staticFile("logo.png")}
          style={{ width: 36, height: 36, borderRadius: 8 }}
        />
      </div>
    </AbsoluteFill>
  );
};
