import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const RED = "#b55a5a";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post1_CancellationPain_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      {/* Subtle noise texture overlay */}
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
        {/* Headline */}
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 76,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 14px",
            lineHeight: 1.18,
          }}
        >
          ביטול ברגע האחרון{"\n"}
          <span style={{ color: GOLD, filter: `drop-shadow(0 0 18px ${GOLD}30)` }}>=  הפסד כסף אמיתי</span>
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 24,
            color: SUBTLE_TEXT,
            margin: "0 0 30px",
            lineHeight: 1.55,
          }}
        >
          לקוח מבטל שעה לפני ההקלטה.{"\n"}
          הסלוט ריק. ההכנסה הלכה. אין מה לעשות.{"\n"}
          <span style={{ color: LIGHT_TEXT, fontWeight: 600 }}>או שיש?</span>
        </p>

        {/* Notification cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
          {[
            { time: "09:42", msg: "״היי, אני צריך לבטל את ההקלטה של היום...״" },
            { time: "11:15", msg: "״משהו צץ, לא אוכל להגיע. סליחה!״" },
            { time: "14:30", msg: "״אפשר להזיז למחר? אה, לא משנה, ביטול.״" },
          ].map((notif, i) => (
            <div
              key={i}
              style={{
                backgroundColor: DARK_CARD,
                borderRadius: 16,
                padding: "18px 24px",
                border: `1px solid ${RED}20`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 19,
                  color: LIGHT_TEXT,
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
                <span style={{ fontSize: 14, color: SUBTLE_TEXT, fontFamily: "'IBM Plex Sans', monospace" }}>
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
            border: `1px solid ${RED}30`,
            borderRadius: 14,
            padding: "22px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', monospace",
              fontSize: 50,
              fontWeight: 700,
              color: RED,
              filter: `drop-shadow(0 0 12px ${RED}25)`,
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

        {/* Footer — consistent */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12 }}>
          <Img src={staticFile("logo.png")} style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT }}>
            studioz.co.il
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
