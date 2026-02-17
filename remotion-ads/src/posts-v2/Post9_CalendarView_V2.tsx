import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CalendarDays, Clock, Plus } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post9_CalendarView_V2: React.FC = () => {
  const features = [
    { Icon: CalendarDays, text: "תצוגת חודש/שבוע/יום" },
    { Icon: Clock, text: "עדכון בזמן אמת" },
    { Icon: Plus, text: "הוספת אירוע בקליק" },
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
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.15,
              color: LIGHT_TEXT,
            }}
          >
            היומן שלך
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.15,
              color: GOLD,
            }}
          >
            תמיד מעודכן
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 22,
            color: SUBTLE_TEXT,
            lineHeight: 1.5,
            marginBottom: 32,
          }}
        >
          יומן סטודיו חכם — תפוסה, הזמנות וזמינות בתצוגה אחת
        </div>

        {/* Phone frame with screenshot */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div
            style={{
              width: 340,
              borderRadius: 24,
              overflow: "hidden",
              border: "2px solid rgba(255,209,102,0.12)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              alignSelf: "center",
              marginBottom: 20,
            }}
          >
            <Img
              src={staticFile("images/optimized/Dashboard-Calendar.png")}
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </div>

        {/* Feature bullets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: DARK_CARD,
                  border: "1px solid rgba(255,209,102,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <f.Icon size={20} color={GOLD} strokeWidth={1.8} />
              </div>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 20,
                  color: LIGHT_TEXT,
                  fontWeight: 500,
                }}
              >
                {f.text}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom brand */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: "'DM Sans', 'Heebo', sans-serif",
                fontSize: 14,
                color: SUBTLE_TEXT,
              }}
            >
              studioz.co.il
            </span>
            <Img
              src={staticFile("logo.png")}
              style={{ width: 36, height: 36, borderRadius: 8 }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
