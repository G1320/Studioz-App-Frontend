import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CheckCircle2 } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";

const RTL: React.CSSProperties = { direction: "rtl" };

export const Post24_InvoiceTable_V2: React.FC = () => {
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
        כל החשבוניות.{"\n"}
        <span style={{ color: GOLD }}>מסודר ומדויק.</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 22,
          color: SUBTLE_TEXT,
          marginBottom: 28,
        }}
      >
        מעקב מלא אחרי כל מסמך — סטטוס, סכום, תאריך ולקוח
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
            src={staticFile("images/optimized/Dashboard-Documents-Table.png")}
            style={{ width: "100%", display: "block" }}
          />
        </div>
      </div>

      {/* Success badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          backgroundColor: "rgba(107,158,130,0.12)",
          border: `1.5px solid ${SUCCESS}`,
          borderRadius: 12,
          padding: "12px 24px",
          marginBottom: 10,
        }}
      >
        <CheckCircle2 size={22} color={SUCCESS} />
        <span style={{ color: SUCCESS, fontSize: 22, fontWeight: 700 }}>
          0₪ ממתין לתשלום
        </span>
      </div>

      {/* Sync text */}
      <div
        style={{
          textAlign: "center",
          fontSize: 18,
          color: SUBTLE_TEXT,
          marginBottom: 10,
        }}
      >
        כל התשלומים מסונכרנים אוטומטית
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
