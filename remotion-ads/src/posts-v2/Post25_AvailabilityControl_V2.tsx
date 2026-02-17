import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Lock, Eye, RefreshCw } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";

const RTL: React.CSSProperties = { direction: "rtl" };

const features = [
  { icon: Lock, label: "חסום שעות ידנית" },
  { icon: Eye, label: "הלקוחות רואים מה פנוי" },
  { icon: RefreshCw, label: "מתעדכן אוטומטי" },
];

export const Post25_AvailabilityControl_V2: React.FC = () => {
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
        שליטה מלאה{"\n"}
        <span style={{ color: GOLD }}>על הזמינות שלך</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 22,
          color: SUBTLE_TEXT,
          marginBottom: 28,
        }}
      >
        חסום שעות, הגדר זמינות, ותן ללקוחות לראות מה פנוי
      </div>

      {/* Desktop frame with screenshot */}
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
            width: 520,
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: DARK_CARD,
            border: "2px solid rgba(255,209,102,0.12)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            alignSelf: "center",
            marginBottom: 20,
          }}
        >
          <Img
            src={staticFile(
              "images/optimized/Studio-Availability-Controls-desktop-1-V3.webp"
            )}
            style={{ width: "100%", display: "block" }}
          />
        </div>
      </div>

      {/* Features row */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {features.map((f, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: DARK_CARD,
              borderRadius: 10,
              padding: "10px 16px",
            }}
          >
            <f.icon size={18} color={GOLD} />
            <span style={{ color: LIGHT_TEXT, fontSize: 16, fontWeight: 600 }}>
              {f.label}
            </span>
          </div>
        ))}
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
