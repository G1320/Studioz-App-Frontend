import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Moon, Sun, Sunrise } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";

const RTL: React.CSSProperties = { direction: "rtl" };

const bookings = [
  {
    time: "02:30",
    text: "הזמנה חדשה — סטודיו הקלטה",
    icon: Moon,
    isNight: true,
  },
  {
    time: "06:15",
    text: "הזמנה חדשה — חדר חזרות",
    icon: Sunrise,
    isNight: false,
  },
  {
    time: "11:00",
    text: "הזמנה חדשה — אולפן מיקס",
    icon: Sun,
    isNight: false,
  },
  {
    time: "19:45",
    text: "הזמנה חדשה — סטודיו צילום",
    icon: Moon,
    isNight: false,
  },
  {
    time: "23:30",
    text: "הזמנה חדשה — חדר הקלטה",
    icon: Moon,
    isNight: true,
  },
];

export const Post27_AlwaysOpen_V2: React.FC = () => {
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
        הסטודיו שלך{"\n"}
        <span style={{ color: GOLD }}>פתוח 24/7</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 22,
          color: SUBTLE_TEXT,
          marginBottom: 32,
        }}
      >
        גם כשאתה ישן, הלקוחות מזמינים
      </div>

      {/* Timeline rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {bookings.map((booking, i) => {
          const Icon = booking.icon;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              {/* Time */}
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                  fontSize: 22,
                  fontWeight: 700,
                  color: GOLD,
                  width: 80,
                  textAlign: "center",
                  flexShrink: 0,
                  direction: "ltr",
                }}
              >
                {booking.time}
              </div>

              {/* Card */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: DARK_CARD,
                  borderRadius: 12,
                  padding: "14px 18px",
                  border: booking.isNight
                    ? "1.5px solid rgba(100,140,200,0.25)"
                    : "1.5px solid rgba(255,209,102,0.08)",
                }}
              >
                <Icon
                  size={20}
                  color={booking.isNight ? "#8ab4f8" : GOLD}
                  style={{ flexShrink: 0 }}
                />
                <span style={{ color: LIGHT_TEXT, fontSize: 18 }}>
                  {booking.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gold badge */}
      <div
        style={{
          textAlign: "center",
          backgroundColor: "rgba(255,209,102,0.08)",
          border: `1.5px solid ${GOLD}`,
          borderRadius: 12,
          padding: "14px 24px",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        <span style={{ color: GOLD, fontSize: 20, fontWeight: 700 }}>
          אפס הזמנות שהתפספסו — כי אתה תמיד פתוח
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
