import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981"; const RED = "#dc2626";
const RTL: React.CSSProperties = { direction: "rtl" };

const NotificationsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const notifications = [
    { icon: "🔔", text: "תזכורת: הזמנה מחר ב-10:00", color: GOLD, time: "עכשיו", delay: 10 },
    { icon: "✅", text: "הזמנה חדשה אושרה — דני מ.", color: SUCCESS, time: "לפני 5 דק׳", delay: 28 },
    { icon: "💳", text: "תשלום ₪350 התקבל", color: SUCCESS, time: "לפני 12 דק׳", delay: 46 },
    { icon: "❌", text: "ביטול הזמנה — שירה כ.", color: RED, time: "לפני 30 דק׳", delay: 64 },
    { icon: "📅", text: "3 הזמנות חדשות השבוע", color: GOLD, time: "לפני שעה", delay: 82 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 45, ...RTL }}>
      <div style={{ marginTop: 90, textAlign: "center", marginBottom: 30 }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT, margin: 0, lineHeight: 1.2, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          תמיד <span style={{ color: GOLD }}>בשליטה</span>
        </h1>
        <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT, marginTop: 10, opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }) }}>
          התראות חכמות שלא מפספסות כלום
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifications.map((n, i) => {
          const enter = spring({ frame: frame - n.delay, fps, config: { damping: 12, stiffness: 90 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, backgroundColor: DARK_CARD, borderRadius: 16, padding: "18px 18px", borderRight: `4px solid ${n.color}`, opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)` }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{n.icon}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 19, color: LIGHT_TEXT }}>{n.text}</span>
              </div>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: SUBTLE_TEXT, flexShrink: 0 }}>{n.time}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const NotifCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 15px" }}>
          אל תפספס{"\n"}<span style={{ color: GOLD }}>שום דבר</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 20, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>הפעל התראות חכמות</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad31_SmartNotifications: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={145}><NotificationsScene /></Sequence>
    <Sequence from={145} durationInFrames={95}><NotifCTA /></Sequence>
  </AbsoluteFill>
);
