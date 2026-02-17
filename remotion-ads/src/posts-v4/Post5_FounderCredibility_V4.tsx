import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT_HEADING, FONT_BODY } from "./fonts";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post5_FounderCredibility_V4: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      {/* Noise texture */}
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
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: "52px 64px 42px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Img src={staticFile("logo.png")} style={{ width: 68, height: 68, borderRadius: 16, marginBottom: 32 }} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 74,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 24px",
            lineHeight: 1.2,
          }}
        >
          אנחנו לא עוד סטארטאפ.{"\n"}
          <span style={{ color: GOLD, filter: `drop-shadow(0 0 18px ${GOLD}30)` }}>אנחנו בעלי סטודיואים</span>{"\n"}
          בדיוק כמוכם.
        </h1>

        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 26,
            color: SUBTLE_TEXT,
            margin: 0,
            lineHeight: 1.65,
          }}
        >
          ניהלנו סטודיואים. סבלנו מאותם כאבים.{"\n"}
          ביטולים, בלגאן ביומן, שעות על הטלפון.{"\n"}
          אז בנינו את הפתרון שתמיד חיפשנו.
        </p>

        <div style={{ flex: 1 }} />

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, alignSelf: "flex-start" }}>
          <Img src={staticFile("logo.png")} style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontFamily: FONT_HEADING, fontSize: 14, color: SUBTLE_TEXT }}>
            studioz.co.il
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
