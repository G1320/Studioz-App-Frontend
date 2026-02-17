import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const GOLD = "#d4a843";
const BG = "#f8f9fb";
const TEXT = "#141820";
const SUB = "#5a6270";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post5_FounderCredibility_V2_Light: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, ...RTL }}>
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
            color: TEXT,
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
            color: SUB,
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
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 16, color: SUB }}>studioz.co.il</span>
          <Img src={staticFile("logo.png")} style={{ width: 36, height: 36, borderRadius: 8 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
