import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#f1f5f9";
const SUBTLE_TEXT = "#b8c0cc";
const RED = "#ef4444";

const RTL: React.CSSProperties = { direction: "rtl" };

export const Post2_EmptySlots: React.FC = () => {
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
  const hours = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

  // Which slots are "booked" vs "empty"
  const booked: Record<string, boolean> = {
    "0-0": true, "0-2": true, "0-4": true,
    "1-1": true, "1-3": true,
    "2-0": true,
    "3-2": true, "3-5": true,
    "4-0": true, "4-1": true, "4-4": true,
  };

  const totalSlots = days.length * hours.length;
  const bookedCount = Object.keys(booked).length;
  const emptyCount = totalSlots - bookedCount;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "60px 100px",
        ...RTL,
      }}
    >
      {/* Right side - text */}
      <div style={{ flex: 1, paddingLeft: 60 }}>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 60,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 24px",
            lineHeight: 1.25,
          }}
        >
          <span style={{ color: GOLD }}>{emptyCount} סלוטים ריקים</span>{"\n"}
          בשבוע אחד
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 24,
            color: SUBTLE_TEXT,
            margin: "0 0 30px",
            lineHeight: 1.6,
          }}
        >
          כל שעה ריקה ביומן = כסף שנשאר על השולחן.{"\n"}
          השאלה היא לא אם יש לכם לקוחות פוטנציאליים —{"\n"}
          <span style={{ color: LIGHT_TEXT, fontWeight: 600 }}>
            השאלה היא אם הם מוצאים אתכם.
          </span>
        </p>

        <div
          style={{
            display: "flex",
            gap: 24,
            marginBottom: 30,
          }}
        >
          {[
            { label: "סלוטים מלאים", value: bookedCount, color: "#10b981" },
            { label: "סלוטים ריקים", value: emptyCount, color: RED },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                backgroundColor: DARK_CARD,
                borderRadius: 16,
                padding: "20px 30px",
                textAlign: "center",
                border: `1px solid ${stat.color}20`,
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Sans', monospace",
                  fontSize: 42,
                  fontWeight: 700,
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 16,
                  color: SUBTLE_TEXT,
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Img src={staticFile("logo.png")} style={{ width: 40, height: 40, borderRadius: 8 }} />
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT }}>
            סטודיוז — למלא את היומן אוטומטית
          </span>
        </div>
      </div>

      {/* Left side - calendar grid */}
      <div style={{ flex: 0.85, display: "flex", flexDirection: "column" }}>
        {/* Header row */}
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <div style={{ width: 60 }} />
          {days.map((day, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                fontFamily: "'DM Sans', 'Heebo', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: SUBTLE_TEXT,
                padding: "8px 0",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid rows */}
        {hours.map((hour, hi) => (
          <div key={hi} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <div
              style={{
                width: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingLeft: 8,
                fontFamily: "'IBM Plex Sans', monospace",
                fontSize: 14,
                color: SUBTLE_TEXT,
              }}
            >
              {hour}
            </div>
            {days.map((_, di) => {
              const isBooked = booked[`${di}-${hi}`];
              return (
                <div
                  key={di}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 10,
                    backgroundColor: isBooked ? "#10b98118" : `${RED}10`,
                    border: `1px solid ${isBooked ? "#10b98130" : `${RED}20`}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isBooked ? (
                    <span style={{ fontSize: 16, color: "#10b981" }}>✓</span>
                  ) : (
                    <span style={{ fontSize: 14, color: `${RED}80` }}>—</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
