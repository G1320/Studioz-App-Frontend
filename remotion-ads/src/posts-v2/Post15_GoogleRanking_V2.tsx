import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Search, Globe, TrendingUp } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post15_GoogleRanking_V2: React.FC = () => {
  const features = [
    { Icon: Search, text: "SEO מובנה" },
    { Icon: Globe, text: "עמוד מותאם למובייל" },
    { Icon: TrendingUp, text: "יותר חשיפה = יותר הזמנות" },
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
            הסטודיו שלך
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
            בעמוד הראשון בגוגל
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
          עמוד סטודיו מותאם SEO שמביא לקוחות חדשים מגוגל
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
              width: 440,
              borderRadius: 24,
              overflow: "hidden",
              border: "2px solid rgba(255,209,102,0.12)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              alignSelf: "center",
              marginBottom: 20,
            }}
          >
            <Img
              src={staticFile("images/optimized/For-Owners-Google-Ranking.png")}
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </div>

        {/* Feature items */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                backgroundColor: DARK_CARD,
                borderRadius: 14,
                padding: "12px 18px",
                border: "1px solid rgba(255,209,102,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <f.Icon size={18} color={GOLD} strokeWidth={1.8} />
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 14,
                  color: LIGHT_TEXT,
                  whiteSpace: "nowrap",
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
