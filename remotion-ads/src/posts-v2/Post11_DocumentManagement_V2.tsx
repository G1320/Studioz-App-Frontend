import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FileText, CreditCard, Download } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post11_DocumentManagement_V2: React.FC = () => {
  const features = [
    { Icon: FileText, text: "חשבוניות אוטומטיות" },
    { Icon: CreditCard, text: "סליקה מובנית" },
    { Icon: Download, text: "ייצוא דו״חות" },
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
            חשבוניות ומסמכים
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
            בלחיצה אחת
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 22,
            color: SUBTLE_TEXT,
            lineHeight: 1.5,
            marginBottom: 32,
          }}
        >
          הפקת חשבוניות, סליקה מהירה, וייצוא דו״חות — הכל מהדשבורד
        </div>

        {/* Phone frame with screenshot */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div
            style={{
              width: 340,
              borderRadius: 24,
              overflow: "hidden",
              border: "2px solid rgba(255,209,102,0.12)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              alignSelf: "center",
              marginBottom: 20,
            }}
          >
            <Img
              src={staticFile("images/optimized/Dashboard-Documents.png")}
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </div>

        {/* Feature cards */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: DARK_CARD,
                borderRadius: 14,
                padding: "18px 16px",
                border: "1px solid rgba(255,209,102,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <f.Icon size={24} color={GOLD} strokeWidth={1.8} />
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 16,
                  color: LIGHT_TEXT,
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                {f.text}
              </span>
            </div>
          ))}
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
