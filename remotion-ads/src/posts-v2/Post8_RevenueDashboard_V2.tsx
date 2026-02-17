import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { DollarSign, Users, TrendingUp, UserPlus } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post8_RevenueDashboard_V2: React.FC = () => {
  const stats = [
    { label: "הכנסות", value: "₪33.7k", Icon: DollarSign },
    { label: "הזמנות", value: "47", Icon: TrendingUp },
    { label: "ממוצע להזמנה", value: "₪716", Icon: Users },
    { label: "לקוחות חדשים", value: "12", Icon: UserPlus },
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
            כל המספרים
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
            במקום אחד
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
          דשבורד סטטיסטיקות שנותן לך תמונה מלאה
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
              src={staticFile("images/optimized/Dashboard-Statistics.png")}
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </div>

        {/* Stat pills — 2x2 grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                width: "calc(50% - 6px)",
                backgroundColor: DARK_CARD,
                borderRadius: 14,
                padding: "14px 18px",
                border: "1px solid rgba(255,209,102,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <s.Icon size={20} color={GOLD} strokeWidth={1.8} />
              <div>
                <div
                  style={{
                    fontFamily: "'DM Sans', monospace",
                    fontSize: 22,
                    fontWeight: 700,
                    color: LIGHT_TEXT,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                    fontSize: 13,
                    color: SUBTLE_TEXT,
                  }}
                >
                  {s.label}
                </div>
              </div>
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
