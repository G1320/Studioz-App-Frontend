import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { X, Check } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post16_BeforeAfter_V2: React.FC = () => {
  const rows = [
    { before: "הזמנות בוואטסאפ", after: "הזמנות אוטומטיות" },
    { before: "יומן גוגל ידני", after: "יומן חכם מסונכרן" },
    { before: "חשבוניות ב-Excel", after: "חשבוניות אוטומטיות" },
    { before: "ביטולים ללא פיצוי", after: "הגנה מביטולים" },
    { before: "שיחות טלפון אינסופיות", after: "הלקוחות מזמינים לבד" },
  ];

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
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.15,
              color: LIGHT_TEXT,
            }}
          >
            לפני ואחרי
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
            סטודיוז
          </div>
        </div>

        {/* Column headers */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 14,
            padding: "0 8px",
          }}
        >
          <div
            style={{
              flex: 1,
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: RED,
              textAlign: "center",
            }}
          >
            בלי סטודיוז
          </div>
          <div
            style={{
              flex: 1,
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: SUCCESS,
              textAlign: "center",
            }}
          >
            עם סטודיוז
          </div>
        </div>

        {/* Comparison rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flex: 1,
          }}
        >
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
              }}
            >
              {/* Before */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: DARK_CARD,
                  borderRadius: 14,
                  padding: "16px 18px",
                  border: `1px solid rgba(181,90,90,0.2)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <X size={18} color={RED} strokeWidth={2.5} />
                <span
                  style={{
                    fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                    fontSize: 16,
                    color: LIGHT_TEXT,
                  }}
                >
                  {row.before}
                </span>
              </div>

              {/* After */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: DARK_CARD,
                  borderRadius: 14,
                  padding: "16px 18px",
                  border: `1px solid rgba(107,158,130,0.2)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Check size={18} color={SUCCESS} strokeWidth={2.5} />
                <span
                  style={{
                    fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                    fontSize: 16,
                    color: LIGHT_TEXT,
                  }}
                >
                  {row.after}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom brand */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 24 }}>
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
