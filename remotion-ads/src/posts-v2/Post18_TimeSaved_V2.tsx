import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Clock, Zap } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";

const RTL: React.CSSProperties = { direction: "rtl" };

const timeWasters = [
  { text: "שיחות טלפון לתיאום", hours: "3 שעות" },
  { text: "ניהול יומן ידני", hours: "2 שעות" },
  { text: "מעקב תשלומים", hours: "2 שעות" },
  { text: "הפקת חשבוניות", hours: "1.5 שעות" },
  { text: "טיפול בביטולים", hours: "1.5 שעות" },
];

export const Post18_TimeSaved_V2: React.FC = () => {
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
        כמה שעות{"\n"}
        <span>אתה </span>
        <span style={{ color: GOLD }}>מבזבז בשבוע?</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 22,
          color: SUBTLE_TEXT,
          marginBottom: 28,
        }}
      >
        חישוב מהיר לבעלי סטודיו
      </div>

      {/* Time waster list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {timeWasters.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: DARK_CARD,
              borderRadius: 12,
              padding: "14px 20px",
              borderRight: `4px solid ${RED}`,
              gap: 14,
            }}
          >
            <Clock size={20} color={RED} style={{ flexShrink: 0 }} />
            <span style={{ color: LIGHT_TEXT, fontSize: 19, flex: 1 }}>{item.text}:</span>
            <span style={{ color: RED, fontSize: 19, fontWeight: 700 }}>{item.hours}</span>
          </div>
        ))}
      </div>

      {/* Total card */}
      <div
        style={{
          backgroundColor: DARK_CARD,
          borderRadius: 14,
          padding: "18px 24px",
          textAlign: "center",
          marginBottom: 14,
        }}
      >
        <span style={{ color: RED, fontSize: 28, fontWeight: 800 }}>
          10 שעות בשבוע = 40 שעות בחודש
        </span>
      </div>

      {/* Studioz card */}
      <div
        style={{
          backgroundColor: DARK_CARD,
          borderRadius: 14,
          padding: "18px 24px",
          border: `2px solid ${GOLD}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
        }}
      >
        <Zap size={24} color={GOLD} fill={GOLD} />
        <span style={{ fontSize: 24, fontWeight: 800, color: GOLD }}>עם סטודיוז: 0 שעות.</span>
        <span style={{ fontSize: 20, color: SUCCESS, fontWeight: 600 }}>הכל אוטומטי.</span>
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
