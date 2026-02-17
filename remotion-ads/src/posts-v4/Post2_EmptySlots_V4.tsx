import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT_HEADING, FONT_BODY, FONT_MONO } from "./fonts";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const RED = "#b55a5a";
const GREEN = "#6b9e82";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post2_EmptySlots_V4: React.FC = () => {
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
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      {/* Noise texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "52px 56px 42px",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 72,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 12px",
            lineHeight: 1.18,
          }}
        >
          <span style={{ color: GOLD, filter: `drop-shadow(0 0 18px ${GOLD}30)` }}>{emptyCount} סלוטים ריקים</span>{"\n"}
          בשבוע אחד
        </h1>

        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 22,
            color: SUBTLE_TEXT,
            margin: "0 0 24px",
            lineHeight: 1.55,
          }}
        >
          כל שעה ריקה ביומן = כסף שנשאר על השולחן.{"\n"}
          <span style={{ color: LIGHT_TEXT, fontWeight: 600 }}>השאלה היא אם הלקוחות מוצאים אתכם.</span>
        </p>

        {/* Stat boxes */}
        <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
          {[
            { label: "סלוטים מלאים", value: bookedCount, color: GREEN },
            { label: "סלוטים ריקים", value: emptyCount, color: RED },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: DARK_CARD,
                borderRadius: 16,
                padding: "20px 22px",
                textAlign: "center",
                border: `1px solid ${stat.color}20`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 60,
                  fontWeight: 700,
                  color: stat.color,
                  filter: `drop-shadow(0 0 10px ${stat.color}20)`,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: SUBTLE_TEXT, marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 5, marginBottom: 5 }}>
            <div style={{ width: 48 }} />
            {days.map((day, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontFamily: FONT_HEADING,
                  fontSize: 13,
                  fontWeight: 600,
                  color: SUBTLE_TEXT,
                  padding: "5px 0",
                }}
              >
                {day}
              </div>
            ))}
          </div>
          {hours.map((hour, hi) => (
            <div key={hi} style={{ display: "flex", gap: 5, marginBottom: 4 }}>
              <div
                style={{
                  width: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingLeft: 4,
                  fontFamily: FONT_MONO,
                  fontSize: 12,
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
                      height: 42,
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

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12 }}>
          <Img src={staticFile("logo.png")} style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontFamily: FONT_HEADING, fontSize: 14, color: SUBTLE_TEXT }}>
            studioz.co.il
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
