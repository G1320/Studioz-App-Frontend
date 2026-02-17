import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import {
  MessageCircle,
  Table2,
  Calculator,
  UserX,
  Rocket,
  BarChart3,
  CreditCard,
  ShieldCheck,
  ArrowDown,
  X,
  Check,
} from "lucide-react";
import { FONT_HEADING, FONT_BODY } from "./fonts";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const RED = "#b55a5a";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post6_WhyWeBuilt_V4: React.FC = () => {
  const before = [
    { Icon: MessageCircle, text: "הזמנות בוואטסאפ" },
    { Icon: Table2, text: "יומן בגוגל" },
    { Icon: Calculator, text: "חשבוניות ידניות" },
    { Icon: UserX, text: "ביטולים בלי פיצוי" },
  ];
  const after = [
    { Icon: Rocket, text: "הזמנות אוטומטיות 24/7" },
    { Icon: BarChart3, text: "דשבורד חכם בזמן אמת" },
    { Icon: CreditCard, text: "סליקה ותשלומים מובנים" },
    { Icon: ShieldCheck, text: "הגנה אוטומטית מביטולים" },
  ];

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
          padding: "48px 50px 42px",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Img src={staticFile("logo.png")} style={{ width: 42, height: 42, borderRadius: 10, marginBottom: 14 }} />
          <h1
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 66,
              fontWeight: 700,
              color: LIGHT_TEXT,
              margin: "0 0 8px",
              lineHeight: 1.2,
            }}
          >
            למה בנינו את <span style={{ color: GOLD, filter: `drop-shadow(0 0 18px ${GOLD}30)` }}>סטודיוז</span>?
          </h1>
          <p style={{ fontFamily: FONT_BODY, fontSize: 21, color: SUBTLE_TEXT, margin: 0 }}>
            כי ידענו שאפשר טוב יותר.
          </p>
        </div>

        {/* Before vs After */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          {/* Before */}
          <div
            style={{
              flex: 1,
              backgroundColor: DARK_CARD,
              borderRadius: 18,
              padding: "20px 24px",
              border: `1px solid ${RED}15`,
            }}
          >
            <div
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 23,
                fontWeight: 700,
                color: RED,
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <X size={17} color={RED} strokeWidth={3} /> לפני סטודיוז
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {before.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 11,
                      backgroundColor: `${RED}12`,
                      border: `1px solid ${RED}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <item.Icon size={19} color={RED} strokeWidth={1.8} />
                  </div>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 19, color: LIGHT_TEXT }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: GOLD,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 28px ${GOLD}35`,
              }}
            >
              <ArrowDown size={24} color={DARK_BG} strokeWidth={2.5} />
            </div>
          </div>

          {/* After */}
          <div
            style={{
              flex: 1,
              backgroundColor: DARK_CARD,
              borderRadius: 18,
              padding: "20px 24px",
              border: `1px solid ${GOLD}20`,
            }}
          >
            <div
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 23,
                fontWeight: 700,
                color: GOLD,
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Check size={17} color={GOLD} strokeWidth={3} /> אחרי סטודיוז
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {after.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 11,
                      backgroundColor: `${GOLD}12`,
                      border: `1px solid ${GOLD}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <item.Icon size={19} color={GOLD} strokeWidth={1.8} />
                  </div>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 19, color: LIGHT_TEXT }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
