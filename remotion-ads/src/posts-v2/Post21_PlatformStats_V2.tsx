import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { MapPin, Clock, Zap, CreditCard } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";

const RTL: React.CSSProperties = { direction: "rtl" };

const stats = [
  { value: "15+", label: "ערים", icon: MapPin },
  { value: "24/7", label: "זמינות", icon: Clock },
  { value: "5 דק׳", label: "זמן הקמה", icon: Zap },
  { value: "₪0", label: "עמלת הקמה", icon: CreditCard },
];

export const Post21_PlatformStats_V2: React.FC = () => {
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
        המספרים
        <br />
        <span style={{ color: GOLD }}>מדברים</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 22,
          color: SUBTLE_TEXT,
          marginBottom: 40,
        }}
      >
        הפלטפורמה שבעלי סטודיו סומכים עליה
      </div>

      {/* 2x2 Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          flex: 1,
        }}
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{
                backgroundColor: DARK_CARD,
                borderRadius: 18,
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Icon top-right */}
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                }}
              >
                <Icon size={24} color={GOLD} />
              </div>

              {/* Value */}
              <span
                style={{
                  fontFamily: "'DM Sans', 'Heebo', sans-serif",
                  fontSize: 48,
                  fontWeight: 800,
                  color: GOLD,
                  marginBottom: 8,
                }}
              >
                {stat.value}
              </span>

              {/* Label */}
              <span
                style={{
                  fontSize: 18,
                  color: SUBTLE_TEXT,
                }}
              >
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Gold divider */}
      <div
        style={{
          height: 2,
          backgroundColor: GOLD,
          opacity: 0.3,
          borderRadius: 1,
          marginTop: 32,
          marginBottom: 20,
        }}
      />

      {/* CTA button */}
      <div
        style={{
          backgroundColor: GOLD,
          borderRadius: 14,
          padding: "18px 32px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 24,
            fontWeight: 800,
            color: DARK_BG,
          }}
        >
          הצטרף עכשיו — בחינם
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
