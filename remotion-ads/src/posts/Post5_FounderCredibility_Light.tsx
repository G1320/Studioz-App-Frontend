import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const GOLD = "#d4a843";
const LIGHT_BG = "#f8f9fb";
const DARK_TEXT = "#1a1d23";
const SUBTLE_TEXT = "#6b7280";

const RTL: React.CSSProperties = { direction: "rtl" };

export const Post5_FounderCredibility_Light: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: LIGHT_BG,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 160px",
        ...RTL,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <Img src={staticFile("logo.png")} style={{ width: 72, height: 72, borderRadius: 16, marginBottom: 36 }} />

        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 62,
            fontWeight: 700,
            color: DARK_TEXT,
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
      </div>
    </AbsoluteFill>
  );
};
