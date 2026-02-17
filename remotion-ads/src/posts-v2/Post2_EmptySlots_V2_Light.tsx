import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const GOLD = "#d4a843";
const BG = "#f8f9fb";
const CARD = "#ffffff";
const TEXT = "#141820";
const SUB = "#5a6270";
const RED = "#dc2626";
const GREEN = "#059669";
const RTL: React.CSSProperties = { direction: "rtl" };
const CARD_SHADOW = "0 1px 4px rgba(0,0,0,0.06)";

export const Post2_EmptySlots_V2_Light: React.FC = () => {
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
  const hours = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const booked: Record<string, boolean> = {
    "0-0": true, "0-2": true, "0-4": true,
    "1-1": true, "1-3": true,
    "2-0": true,
    "3-2": true, "3-5": true,
    "4-0": true, "4-1": true, "4-4": true,
  };
  const bookedCount = Object.keys(booked).length;
  const emptyCount = days.length * hours.length - bookedCount;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, ...RTL }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "60px 60px 50px",
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 66,
            fontWeight: 700,
            color: TEXT,
            margin: "0 0 14px",
            lineHeight: 1.25,
          }}
        >
          <span style={{ color: GOLD }}>{emptyCount} סלוטים ריקים</span>{"\n"}
          בשבוע אחד
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 22,
            color: SUB,
            margin: "0 0 30px",
            lineHeight: 1.6,
          }}
        >
          כל שעה ריקה ביומן = כסף שנשאר על השולחן.{"\n"}
          <span style={{ color: TEXT, fontWeight: 600 }}>השאלה היא אם הלקוחות מוצאים אתכם.</span>
        </p>

        {/* Stat boxes */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          {[
            { label: "סלוטים מלאים", value: bookedCount, color: GREEN },
            { label: "סלוטים ריקים", value: emptyCount, color: RED },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: CARD,
                borderRadius: 16,
                padding: "22px 24px",
                textAlign: "center",
                boxShadow: CARD_SHADOW,
              }}
            >
              <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 52, fontWeight: 700, color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUB, marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Day headers */}
          <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
            <div style={{ width: 50 }} />
            {days.map((day, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontFamily: "'DM Sans', 'Heebo', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: SUB,
                  padding: "6px 0",
                }}
              >
                {day}
              </div>
            ))}
          </div>
          {/* Grid */}
          {hours.map((hour, hi) => (
            <div key={hi} style={{ display: "flex", gap: 5, marginBottom: 5 }}>
              <div
                style={{
                  width: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingLeft: 6,
                  fontFamily: "'IBM Plex Sans', monospace",
                  fontSize: 13,
                  color: SUB,
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
                      height: 44,
                      borderRadius: 8,
                      backgroundColor: isBooked ? `${GREEN}18` : `${RED}10`,
                      border: `1px solid ${isBooked ? `${GREEN}30` : `${RED}20`}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isBooked ? (
                      <span style={{ fontSize: 14, color: GREEN }}>✓</span>
                    ) : (
                      <span style={{ fontSize: 13, color: `${RED}80` }}>—</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom brand */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 16, color: SUB }}>
              סטודיוז — למלא את היומן אוטומטית
            </span>
            <Img src={staticFile("logo.png")} style={{ width: 36, height: 36, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
