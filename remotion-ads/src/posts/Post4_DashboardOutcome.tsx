import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#f1f5f9";
const SUBTLE_TEXT = "#b8c0cc";
const SUCCESS = "#10b981";

const RTL: React.CSSProperties = { direction: "rtl" };

export const Post4_DashboardOutcome: React.FC = () => {
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
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: "flex",
        flexDirection: "column",
        padding: "60px 80px",
        ...RTL,
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Img src={staticFile("logo.png")} style={{ width: 44, height: 44, borderRadius: 10 }} />
          <div>
            <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: LIGHT_TEXT }}>
              הדשבורד שלך
            </div>
            <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>
              הכל במקום אחד. פשוט עובד.
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: GOLD,
            borderRadius: 12,
            padding: "12px 28px",
          }}
        >
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 18, fontWeight: 700, color: DARK_BG }}>
            ניהול חכם מכל מקום
          </span>
        </div>
      </div>

      {/* Metrics row */}
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        {metrics.map((m, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              backgroundColor: DARK_CARD,
              borderRadius: 18,
              padding: "28px 24px",
              border: "1px solid rgba(255,209,102,0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>{m.icon}</span>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', monospace",
                  fontSize: 15,
                  color: SUCCESS,
                  fontWeight: 600,
                  backgroundColor: `${SUCCESS}15`,
                  padding: "4px 10px",
                  borderRadius: 8,
                }}
              >
                {m.change}
              </span>
            </div>
            <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 36, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 4 }}>
              {m.value}
            </div>
            <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom section - recent bookings + mini chart */}
      <div style={{ display: "flex", gap: 20, flex: 1 }}>
        {/* Recent bookings */}
        <div
          style={{
            flex: 1.2,
            backgroundColor: DARK_CARD,
            borderRadius: 18,
            padding: "24px 28px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 20, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 20 }}>
            הזמנות אחרונות
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {recentBookings.map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: DARK_BG,
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
              >
                <div>
                  <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 18, fontWeight: 600, color: LIGHT_TEXT }}>
                    {b.name}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 15, color: SUBTLE_TEXT }}>
                    {b.service}
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 15, color: SUBTLE_TEXT }}>
                    {b.time}
                  </div>
                  <div
                    style={{
                      fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                      fontSize: 14,
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

        {/* Revenue chart mockup */}
        <div
          style={{
            flex: 0.8,
            backgroundColor: DARK_CARD,
            borderRadius: 18,
            padding: "24px 28px",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 20, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 20 }}>
            הכנסות חודשיות
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, flex: 1, padding: "0 10px" }}>
            {[45, 52, 48, 65, 72, 68, 85, 90, 82, 95, 100, 110].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  backgroundColor: i >= 10 ? GOLD : i >= 8 ? `${GOLD}80` : `${GOLD}30`,
                  borderRadius: "6px 6px 0 0",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, padding: "0 10px" }}>
            <span style={{ fontFamily: "'IBM Plex Sans', monospace", fontSize: 12, color: SUBTLE_TEXT }}>ינו׳</span>
            <span style={{ fontFamily: "'IBM Plex Sans', monospace", fontSize: 12, color: SUBTLE_TEXT }}>דצמ׳</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
