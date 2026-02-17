import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CalendarDays, Wallet, RefreshCw, Star } from "lucide-react";
import { FONT_HEADING, FONT_BODY, FONT_MONO } from "./fonts";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post4_DashboardOutcome_V4: React.FC = () => {
  const metrics = [
    { label: "הזמנות החודש", value: "127", change: "+23%", Icon: CalendarDays },
    { label: "הכנסות", value: "₪18,400", change: "+31%", Icon: Wallet },
    { label: "שימור לקוחות", value: "89%", change: "+12%", Icon: RefreshCw },
    { label: "דירוג ממוצע", value: "4.9", change: "★★★★★", Icon: Star },
  ];

  const recentBookings = [
    { name: "אורי כהן", service: "הקלטה — סטודיו A", time: "היום, 14:00", status: "מאושר" },
    { name: "דנה לוי", service: "מיקס — סטודיו B", time: "היום, 16:30", status: "מאושר" },
    { name: "יוסי מזרחי", service: "צילום — סטודיו C", time: "מחר, 10:00", status: "ממתין" },
  ];

  const barData = [45, 52, 48, 65, 72, 68, 85, 90, 82, 95, 100, 110];
  const maxBar = Math.max(...barData);

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
          padding: "44px 46px 38px",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Img src={staticFile("logo.png")} style={{ width: 38, height: 38, borderRadius: 10 }} />
            <div>
              <div style={{ fontFamily: FONT_HEADING, fontSize: 21, fontWeight: 700, color: LIGHT_TEXT, lineHeight: 1.2 }}>
                הדשבורד שלך
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT }}>
                הכל במקום אחד. פשוט עובד.
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: GOLD, borderRadius: 10, padding: "9px 20px", boxShadow: `0 0 20px ${GOLD}20` }}>
            <span style={{ fontFamily: FONT_HEADING, fontSize: 14, fontWeight: 700, color: DARK_BG }}>
              ניהול חכם
            </span>
          </div>
        </div>

        {/* Metrics 2x2 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          {metrics.map((m, i) => (
            <div
              key={i}
              style={{
                width: "calc(50% - 6px)",
                backgroundColor: DARK_CARD,
                borderRadius: 14,
                padding: "18px 18px",
                border: "1px solid rgba(255,209,102,0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <m.Icon size={20} color={GOLD} strokeWidth={1.8} />
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 12,
                    color: SUCCESS,
                    fontWeight: 600,
                    backgroundColor: `${SUCCESS}15`,
                    padding: "2px 7px",
                    borderRadius: 5,
                  }}
                >
                  {m.change}
                </span>
              </div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 44,
                  fontWeight: 700,
                  color: LIGHT_TEXT,
                  marginBottom: 2,
                  filter: m.value.includes("₪") ? `drop-shadow(0 0 8px ${GOLD}15)` : "none",
                }}
              >
                {m.value}
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Recent bookings */}
        <div
          style={{
            flex: 1,
            backgroundColor: DARK_CARD,
            borderRadius: 14,
            padding: "16px 18px",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontFamily: FONT_HEADING, fontSize: 17, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 10 }}>
            הזמנות אחרונות
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            {recentBookings.map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: DARK_BG,
                  borderRadius: 10,
                  padding: "12px 16px",
                }}
              >
                <div>
                  <div style={{ fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 600, color: LIGHT_TEXT }}>
                    {b.name}
                  </div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT }}>
                    {b.service}
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT }}>
                    {b.time}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 12,
                      fontWeight: 600,
                      color: b.status === "מאושר" ? SUCCESS : GOLD,
                    }}
                  >
                    {b.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue chart — SVG */}
        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 14,
            padding: "16px 18px 12px",
            border: "1px solid rgba(255,255,255,0.06)",
            marginTop: 12,
          }}
        >
          <div style={{ fontFamily: FONT_HEADING, fontSize: 17, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 10 }}>
            הכנסות חודשיות
          </div>
          <svg width="100%" height="110" viewBox="0 0 960 110" preserveAspectRatio="none">
            {barData.map((h, i) => {
              const barW = 960 / barData.length - 10;
              const barH = (h / maxBar) * 100;
              const x = i * (960 / barData.length) + 5;
              const fill = i >= 10 ? GOLD : i >= 8 ? `${GOLD}80` : `${GOLD}30`;
              return (
                <rect
                  key={i}
                  x={x}
                  y={110 - barH}
                  width={barW}
                  height={barH}
                  rx={4}
                  fill={fill}
                />
              );
            })}
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, padding: "0 6px" }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: SUBTLE_TEXT }}>ינו׳</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: SUBTLE_TEXT }}>דצמ׳</span>
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
