import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Moon, Sun } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post13_StudioPageShowcase_V2: React.FC = () => {
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
            העמוד שלך.
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.15,
              color: LIGHT_TEXT,
            }}
          >
            הלקוחות שלך.
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
            ההזמנות שלך.
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 22,
            color: SUBTLE_TEXT,
            lineHeight: 1.5,
            marginBottom: 36,
          }}
        >
          עמוד סטודיו מקצועי שמוכר בשבילך, 24/7
        </div>

        {/* Two phone frames side by side */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Dark mode phone */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 220,
                borderRadius: 20,
                overflow: "hidden",
                border: "2px solid rgba(255,209,102,0.12)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              <Img
                src={staticFile("images/optimized/Studioz-Studio-Details-1-Dark.webp")}
                style={{ width: "100%", display: "block" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                fontSize: 14,
                color: SUBTLE_TEXT,
              }}
            >
              <Moon size={14} color={SUBTLE_TEXT} strokeWidth={1.8} />
              <span>מצב כהה</span>
            </div>
          </div>

          {/* Light mode phone */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 220,
                borderRadius: 20,
                overflow: "hidden",
                border: "2px solid rgba(255,209,102,0.12)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              <Img
                src={staticFile("images/optimized/Studioz-Studio-Details-1-Light.webp")}
                style={{ width: "100%", display: "block" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                fontSize: 14,
                color: SUBTLE_TEXT,
              }}
            >
              <Sun size={14} color={SUBTLE_TEXT} strokeWidth={1.8} />
              <span>מצב בהיר</span>
            </div>
          </div>
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
