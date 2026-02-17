import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { XCircle, CheckCircle2, X, Check } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";

const RTL: React.CSSProperties = { direction: "rtl" };

const stopItems = [
  "לענות לטלפון כל 5 דקות",
  "לנהל יומן בראש",
  "לרדוף אחרי תשלומים",
  "להפסיד כסף על ביטולים",
  "לבזבז שעות על חשבוניות",
];

const startItems = [
  "לתת ללקוחות להזמין לבד",
  "יומן חכם שמנהל את עצמו",
  "סליקה אוטומטית",
  "הגנה מביטולים מובנית",
  "חשבוניות בלחיצה",
];

export const Post26_StopStart_V2: React.FC = () => {
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
          marginBottom: 24,
        }}
      >
        תפסיק.{"\n"}
        <span style={{ color: GOLD }}>תתחיל.</span>
      </div>

      {/* Two columns */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Stop section */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <XCircle size={22} color={RED} />
            <span
              style={{
                fontFamily: "'DM Sans', 'Heebo', sans-serif",
                fontSize: 26,
                fontWeight: 800,
                color: RED,
              }}
            >
              תפסיק
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stopItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  backgroundColor: DARK_CARD,
                  borderRadius: 10,
                  padding: "10px 14px",
                }}
              >
                <X size={16} color={RED} style={{ flexShrink: 0 }} />
                <span style={{ color: LIGHT_TEXT, fontSize: 16 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start section */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <CheckCircle2 size={22} color={SUCCESS} />
            <span
              style={{
                fontFamily: "'DM Sans', 'Heebo', sans-serif",
                fontSize: 26,
                fontWeight: 800,
                color: SUCCESS,
              }}
            >
              תתחיל
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {startItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  backgroundColor: DARK_CARD,
                  borderRadius: 10,
                  padding: "10px 14px",
                }}
              >
                <Check size={16} color={SUCCESS} style={{ flexShrink: 0 }} />
                <span style={{ color: LIGHT_TEXT, fontSize: 16 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          textAlign: "center",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        <span style={{ color: GOLD, fontSize: 22, fontWeight: 700 }}>
          הצטרף לסטודיוז — בחינם
        </span>
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
