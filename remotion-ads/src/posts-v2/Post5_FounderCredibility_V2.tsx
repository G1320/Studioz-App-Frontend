import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post5_FounderCredibility_V2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: "60px 70px 50px",
          textAlign: "center",
        }}
      >
        <Img src={staticFile("logo.png")} style={{ width: 72, height: 72, borderRadius: 16, marginBottom: 36 }} />

        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 68,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 28px",
            lineHeight: 1.3,
          }}
        >
          אנחנו לא עוד סטארטאפ.{"\n"}
          <span style={{ color: GOLD }}>אנחנו בעלי סטודיואים</span>{"\n"}
          בדיוק כמוכם.
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 26,
            color: SUBTLE_TEXT,
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          ניהלנו סטודיואים. סבלנו מאותם כאבים.{"\n"}
          ביטולים, בלגאן ביומן, שעות על הטלפון.{"\n"}
          אז בנינו את הפתרון שתמיד חיפשנו.
        </p>

        <div style={{ flex: 1 }} />

        {/* Bottom brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, alignSelf: "flex-end" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>studioz.co.il</span>
          <Img src={staticFile("logo.png")} style={{ width: 36, height: 36, borderRadius: 8 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
