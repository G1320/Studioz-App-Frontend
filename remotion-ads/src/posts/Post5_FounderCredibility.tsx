import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const LIGHT_TEXT = "#f1f5f9";
const SUBTLE_TEXT = "#b8c0cc";

const RTL: React.CSSProperties = { direction: "rtl" };

export const Post5_FounderCredibility: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
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
      </div>
    </AbsoluteFill>
  );
};
