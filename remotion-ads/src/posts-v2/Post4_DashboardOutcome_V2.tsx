import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CalendarDays, Wallet, RefreshCw, Star } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RTL: React.CSSProperties = { direction: "rtl" };

export const Post4_DashboardOutcome_V2: React.FC = () => {
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

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
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
              <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 22, fontWeight: 700, color: LIGHT_TEXT }}>
                הדשבורד שלך
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT }}>
                הכל במקום אחד. פשוט עובד.
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: GOLD, borderRadius: 10, padding: "10px 22px" }}>
            <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 15, fontWeight: 700, color: DARK_BG }}>
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
                backgroundColor: DARK_CARD,
                borderRadius: 16,
                padding: "22px 20px",
                border: "1px solid rgba(255,209,102,0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <m.Icon size={22} color={GOLD} strokeWidth={1.8} />
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
              <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 38, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 2 }}>
                {m.value}
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT }}>
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
            borderRadius: 16,
            padding: "20px 22px",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 18, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 14 }}>
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
                  backgroundColor: DARK_BG,
                  borderRadius: 10,
                  padding: "14px 18px",
                }}
              >
                <div>
                  <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 16, fontWeight: 600, color: LIGHT_TEXT }}>
                    {b.name}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT }}>
                    {b.service}
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT }}>
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
            backgroundColor: DARK_CARD,
            borderRadius: 16,
            padding: "20px 22px 14px",
            border: "1px solid rgba(255,255,255,0.06)",
            marginTop: 14,
          }}
        >
          <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 18, fontWeight: 700, color: LIGHT_TEXT, marginBottom: 14 }}>
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
            <span style={{ fontFamily: "'IBM Plex Sans', monospace", fontSize: 11, color: SUBTLE_TEXT }}>ינו׳</span>
            <span style={{ fontFamily: "'IBM Plex Sans', monospace", fontSize: 11, color: SUBTLE_TEXT }}>דצמ׳</span>
          </div>
        </div>

        {/* Bottom brand */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT }}>studioz.co.il</span>
            <Img src={staticFile("logo.png")} style={{ width: 32, height: 32, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
