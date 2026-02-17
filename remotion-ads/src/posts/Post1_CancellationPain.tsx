import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#f1f5f9";
const SUBTLE_TEXT = "#b8c0cc";
const RED = "#ef4444";

const RTL: React.CSSProperties = { direction: "rtl" };

export const Post1_CancellationPain: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "80px 100px",
        ...RTL,
      }}
    >
      {/* Right side - text content */}
      <div style={{ flex: 1, paddingLeft: 60 }}>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 24px",
            lineHeight: 1.25,
          }}
        >
          ביטול ברגע האחרון{"\n"}
          <span style={{ color: GOLD }}>= הפסד כסף אמיתי</span>
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 26,
            color: SUBTLE_TEXT,
            margin: "0 0 40px",
            lineHeight: 1.6,
          }}
        >
          לקוח מבטל שעה לפני ההקלטה.{"\n"}
          הסלוט ריק. ההכנסה הלכה. אין מה לעשות.{"\n"}
          <span style={{ color: LIGHT_TEXT, fontWeight: 600 }}>או שיש?</span>
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{ width: 40, height: 40, borderRadius: 8 }}
          />
          <span
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 20,
              color: SUBTLE_TEXT,
            }}
          >
            סטודיוז — הגנה מביטולים מובנית
          </span>
        </div>
      </div>

      {/* Left side - visual */}
      <div
        style={{
          flex: 0.8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Notification cards */}
        {[
          { time: "09:42", msg: "״היי, אני צריך לבטל את ההקלטה של היום...״" },
          { time: "11:15", msg: "״משהו צץ, לא אוכל להגיע. סליחה!״" },
          { time: "14:30", msg: "״אפשר להזיז למחר? אה, לא משנה, ביטול.״" },
        ].map((notif, i) => (
          <div
            key={i}
            style={{
              backgroundColor: DARK_CARD,
              borderRadius: 20,
              padding: "24px 30px",
              width: "100%",
              border: `1px solid ${RED}20`,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              transform: `rotate(${(i - 1) * 2}deg)`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 16, color: SUBTLE_TEXT, fontFamily: "'IBM Plex Sans', monospace" }}>
                {notif.time}
              </span>
              <span style={{ fontSize: 14, color: RED, fontWeight: 600, fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif" }}>
                ביטול
              </span>
            </div>
            <span
              style={{
                fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                fontSize: 20,
                color: LIGHT_TEXT,
                lineHeight: 1.4,
              }}
            >
              {notif.msg}
            </span>
          </div>
        ))}

        {/* Loss indicator */}
        <div
          style={{
            backgroundColor: `${RED}15`,
            border: `1px solid ${RED}30`,
            borderRadius: 14,
            padding: "16px 30px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 28 }}>💸</span>
          <span
            style={{
              fontFamily: "'DM Sans', monospace",
              fontSize: 28,
              fontWeight: 700,
              color: RED,
            }}
          >
            ₪1,200 הפסד היום
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
