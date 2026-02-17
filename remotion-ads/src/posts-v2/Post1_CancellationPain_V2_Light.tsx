import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const GOLD = "#d4a843";
const BG = "#f8f9fb";
const CARD = "#ffffff";
const TEXT = "#141820";
const SUB = "#5a6270";
const RED = "#dc2626";
const RTL: React.CSSProperties = { direction: "rtl" };
const CARD_SHADOW = "0 1px 4px rgba(0,0,0,0.06)";

export const Post1_CancellationPain_V2_Light: React.FC = () => {
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
            fontSize: 70,
            fontWeight: 700,
            color: TEXT,
            margin: "0 0 16px",
            lineHeight: 1.25,
          }}
        >
          ביטול ברגע האחרון{"\n"}
          <span style={{ color: GOLD }}>= הפסד כסף אמיתי</span>
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 24,
            color: SUB,
            margin: "0 0 36px",
            lineHeight: 1.6,
          }}
        >
          לקוח מבטל שעה לפני ההקלטה.{"\n"}
          הסלוט ריק. ההכנסה הלכה. אין מה לעשות.{"\n"}
          <span style={{ color: TEXT, fontWeight: 600 }}>או שיש?</span>
        </p>

        {/* Notification cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
          {[
            { time: "09:42", msg: "״היי, אני צריך לבטל את ההקלטה של היום...״" },
            { time: "11:15", msg: "״משהו צץ, לא אוכל להגיע. סליחה!״" },
            { time: "14:30", msg: "״אפשר להזיז למחר? אה, לא משנה, ביטול.״" },
          ].map((notif, i) => (
            <div
              key={i}
              style={{
                backgroundColor: CARD,
                borderRadius: 18,
                padding: "20px 26px",
                boxShadow: CARD_SHADOW,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 19,
                  color: TEXT,
                  lineHeight: 1.4,
                  flex: 1,
                }}
              >
                {notif.msg}
              </span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                <span style={{ fontSize: 14, color: RED, fontWeight: 600, fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif" }}>
                  ביטול
                </span>
                <span style={{ fontSize: 14, color: SUB, fontFamily: "'IBM Plex Sans', monospace" }}>
                  {notif.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Loss indicator */}
        <div
          style={{
            backgroundColor: `${RED}15`,
            borderRadius: 14,
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', monospace",
              fontSize: 42,
              fontWeight: 700,
              color: RED,
            }}
          >
            ₪1,200
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
              fontSize: 22,
              color: RED,
            }}
          >
            הפסד היום
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Bottom brand */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 16, color: SUB }}>
              סטודיוז — הגנה מביטולים מובנית
            </span>
            <Img src={staticFile("logo.png")} style={{ width: 36, height: 36, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
