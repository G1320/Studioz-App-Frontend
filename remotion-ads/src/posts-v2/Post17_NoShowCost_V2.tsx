import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ShieldCheck } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post17_NoShowCost_V2: React.FC = () => {
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
            כמה עולה לך
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
            No-Show?
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 22,
            color: SUBTLE_TEXT,
            lineHeight: 1.5,
            marginBottom: 40,
          }}
        >
          חישוב מהיר שכדאי לעשות
        </div>

        {/* Calculator layout */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              width: "100%",
              backgroundColor: DARK_CARD,
              borderRadius: 16,
              padding: "22px 28px",
              border: "1px solid rgba(255,209,102,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                fontSize: 20,
                color: SUBTLE_TEXT,
              }}
            >
              ממוצע הזמנה
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', monospace",
                fontSize: 28,
                fontWeight: 700,
                color: LIGHT_TEXT,
              }}
            >
              ₪500
            </span>
          </div>

          {/* Card 2 */}
          <div
            style={{
              width: "100%",
              backgroundColor: DARK_CARD,
              borderRadius: 16,
              padding: "22px 28px",
              border: "1px solid rgba(255,209,102,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                fontSize: 20,
                color: SUBTLE_TEXT,
              }}
            >
              No-Shows בחודש
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', monospace",
                fontSize: 28,
                fontWeight: 700,
                color: LIGHT_TEXT,
              }}
            >
              4
            </span>
          </div>

          {/* Divider with = */}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "4px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "rgba(255,209,102,0.15)",
              }}
            />
            <span
              style={{
                fontFamily: "'DM Sans', monospace",
                fontSize: 28,
                fontWeight: 700,
                color: GOLD,
              }}
            >
              =
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "rgba(255,209,102,0.15)",
              }}
            />
          </div>

          {/* Result card */}
          <div
            style={{
              width: "100%",
              backgroundColor: DARK_CARD,
              borderRadius: 16,
              padding: "28px 28px",
              border: `2px solid ${GOLD}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', monospace",
                fontSize: 44,
                fontWeight: 800,
                color: RED,
              }}
            >
              ₪2,000
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                fontSize: 18,
                color: SUBTLE_TEXT,
              }}
            >
              הפסד חודשי
            </span>
          </div>

          {/* Annual loss */}
          <div
            style={{
              fontFamily: "'DM Sans', monospace",
              fontSize: 22,
              fontWeight: 700,
              color: RED,
              opacity: 0.8,
              textAlign: "center",
            }}
          >
            ₪24,000 הפסד שנתי
          </div>

          {/* Success badge */}
          <div
            style={{
              marginTop: 8,
              backgroundColor: "rgba(107,158,130,0.12)",
              borderRadius: 14,
              padding: "16px 24px",
              border: `1px solid rgba(107,158,130,0.25)`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ShieldCheck size={22} color={SUCCESS} strokeWidth={1.8} />
            <span
              style={{
                fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                fontSize: 16,
                color: SUCCESS,
                lineHeight: 1.5,
              }}
            >
              עם סטודיוז — הגנה מביטולים מובנית. אפס הפסדים.
            </span>
          </div>
        </div>

        {/* Bottom brand */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 24 }}>
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
