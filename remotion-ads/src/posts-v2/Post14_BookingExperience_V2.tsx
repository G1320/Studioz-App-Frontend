import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ChevronLeft } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post14_BookingExperience_V2: React.FC = () => {
  const steps = ["בחירת שירות", "בחירת מועד", "תשלום מאובטח"];

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
            הלקוח מזמין.
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
            אתה מקבל כסף.
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
          תהליך הזמנה חלק ומקצועי — בלי שיחת טלפון אחת
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
              width: 320,
              borderRadius: 24,
              overflow: "hidden",
              border: "2px solid rgba(255,209,102,0.12)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              alignSelf: "center",
              marginBottom: 20,
            }}
          >
            <Img
              src={staticFile("images/optimized/Studioz-Studio-Details-Order-1-Light.webp")}
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </div>

        {/* Feature pills with arrows */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            marginBottom: 28,
          }}
        >
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div
                style={{
                  backgroundColor: DARK_CARD,
                  borderRadius: 20,
                  padding: "10px 18px",
                  border: "1px solid rgba(255,209,102,0.08)",
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 15,
                  color: LIGHT_TEXT,
                  whiteSpace: "nowrap",
                }}
              >
                {step}
              </div>
              {i < steps.length - 1 && (
                <ChevronLeft size={18} color={GOLD} strokeWidth={2} />
              )}
            </React.Fragment>
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
