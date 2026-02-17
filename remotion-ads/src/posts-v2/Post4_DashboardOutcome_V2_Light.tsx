import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const GOLD = "#d4a843";
const BG = "#f8f9fb";
const CARD = "#ffffff";
const TEXT = "#141820";
const SUB = "#5a6270";
const SUCCESS = "#059669";
const RTL: React.CSSProperties = { direction: "rtl" };
const CARD_SHADOW = "0 1px 4px rgba(0,0,0,0.06)";

export const Post4_DashboardOutcome_V2_Light: React.FC = () => {
  const metrics = [
    { label: "הזמנות החודש", value: "127", change: "+23%", icon: "📅" },
    { label: "הכנסות", value: "₪18,400", change: "+31%", icon: "💰" },
    { label: "שימור לקוחות", value: "89%", change: "+12%", icon: "🔄" },
    { label: "דירוג ממוצע", value: "4.9", change: "★★★★★", icon: "⭐" },
  ];

  const recentBookings = [
    { name: "אורי כהן", service: "הקלטה — סטודיו A", time: "היום, 14:00", status: "מאושר" },
    { name: "דנה לוי", service: "מיקס — סטודיו B", time: "היום, 16:30", status: "מאושר" },
    { name: "יוסי מזרחי", service: "צילום — סטודיו C", time: "מחר, 10:00", status: "ממתין" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, ...RTL }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "50px 50px 44px",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Img src={staticFile("logo.png")} style={{ width: 40, height: 40, borderRadius: 10 }} />
            <div>
              <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 22, fontWeight: 700, color: TEXT }}>
                הדשבורד שלך
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUB }}>
                הכל במקום אחד. פשוט עובד.
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: GOLD, borderRadius: 10, padding: "10px 22px" }}>
            <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 15, fontWeight: 700, color: "#ffffff" }}>
              ניהול חכם
            </span>
          </div>
        </div>

        {/* Metrics — 2x2 grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
          {metrics.map((m, i) => (
            <div
              key={i}
              style={{
                width: "calc(50% - 7px)",
                backgroundColor: CARD,
                borderRadius: 16,
                padding: "22px 20px",
                boxShadow: CARD_SHADOW,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{m.icon}</span>
                <span
                  style={{
                    fontFamily: "'IBM Plex Sans', monospace",
                    fontSize: 13,
                    color: SUCCESS,
                    fontWeight: 600,
                    backgroundColor: `${SUCCESS}15`,
                    padding: "3px 8px",
                    borderRadius: 6,
                  }}
                >
                  {m.change}
                </span>
              </div>
              <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 38, fontWeight: 700, color: TEXT, marginBottom: 2 }}>
                {m.value}
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUB }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Recent bookings */}
        <div
          style={{
            flex: 1,
            backgroundColor: CARD,
            borderRadius: 16,
            padding: "20px 22px",
            boxShadow: CARD_SHADOW,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 14 }}>
            הזמנות אחרונות
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            {recentBookings.map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: BG,
                  borderRadius: 10,
                  padding: "14px 18px",
                }}
              >
                <div>
                  <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 16, fontWeight: 600, color: TEXT }}>
                    {b.name}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUB }}>
                    {b.service}
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUB }}>
                    {b.time}
                  </div>
                  <div
                    style={{
                      fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                      fontSize: 13,
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

        {/* Revenue chart */}
        <div
          style={{
            backgroundColor: CARD,
            borderRadius: 16,
            padding: "20px 22px 14px",
            boxShadow: CARD_SHADOW,
            marginTop: 14,
          }}
        >
          <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 14 }}>
            הכנסות חודשיות
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120, padding: "0 8px" }}>
            {[45, 52, 48, 65, 72, 68, 85, 90, 82, 95, 100, 110].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  backgroundColor: i >= 10 ? GOLD : i >= 8 ? `${GOLD}80` : `${GOLD}30`,
                  borderRadius: "4px 4px 0 0",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, padding: "0 8px" }}>
            <span style={{ fontFamily: "'IBM Plex Sans', monospace", fontSize: 11, color: SUB }}>ינו׳</span>
            <span style={{ fontFamily: "'IBM Plex Sans', monospace", fontSize: 11, color: SUB }}>דצמ׳</span>
          </div>
        </div>

        {/* Bottom brand */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 14, color: SUB }}>studioz.co.il</span>
            <Img src={staticFile("logo.png")} style={{ width: 32, height: 32, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
