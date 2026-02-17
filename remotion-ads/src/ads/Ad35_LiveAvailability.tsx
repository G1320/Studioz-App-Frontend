import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc"; const SUCCESS = "#10b981"; const RED = "#dc2626";
const RTL: React.CSSProperties = { direction: "rtl" };

const AvailabilityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
  const days = ["א", "ב", "ג", "ד", "ה"];
  // Random availability pattern (seeded)
  const avail = [
    [1,1,0,1,1], [1,0,1,1,0], [0,1,1,0,1], [1,1,0,1,1],
    [0,0,1,1,1], [1,1,1,0,0], [1,0,0,1,1], [0,1,1,1,0],
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 35, ...RTL }}>
      <div style={{ marginTop: 70, textAlign: "center", marginBottom: 15 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: SUCCESS, boxShadow: `0 0 8px ${SUCCESS}`, opacity: interpolate(frame % 30, [0, 15, 30], [1, 0.4, 1]) }} />
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 18, fontWeight: 600, color: SUCCESS }}>LIVE</span>
        </div>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 44, fontWeight: 700, color: LIGHT_TEXT, margin: 0, opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          זמינות <span style={{ color: GOLD }}>בזמן אמת</span>
        </h1>
      </div>

      {/* Day headers */}
      <div style={{ display: "flex", gap: 6, marginBottom: 6, paddingRight: 70 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: SUBTLE_TEXT, fontWeight: 600 }}>{d}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      {hours.map((hour, hi) => {
        const rowDelay = 15 + hi * 8;
        const rowEnter = spring({ frame: frame - rowDelay, fps, config: { damping: 14 } });
        return (
          <div key={hi} style={{ display: "flex", gap: 6, marginBottom: 6, opacity: rowEnter }}>
            <div style={{ width: 64, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingLeft: 6 }}>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: SUBTLE_TEXT, direction: "ltr" }}>{hour}</span>
            </div>
            {days.map((_, di) => {
              const isAvail = avail[hi][di] === 1;
              return (
                <div key={di} style={{ flex: 1, height: 44, borderRadius: 8, backgroundColor: isAvail ? `${SUCCESS}15` : `${RED}10`, border: `1px solid ${isAvail ? SUCCESS : RED}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: isAvail ? SUCCESS : RED }} />
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 15, opacity: interpolate(frame, [80, 95], [0, 1], { extrapolateRight: "clamp" }) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: SUCCESS }} />
          <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>פנוי</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: RED }} />
          <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: SUBTLE_TEXT }}>תפוס</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const AvailCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 10px" }}>
          לקוחות רואים,{"\n"}<span style={{ color: GOLD }}>לקוחות מזמינים</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 25, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>הפעל זמינות חיה</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad35_LiveAvailability: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={145}><AvailabilityScene /></Sequence>
    <Sequence from={145} durationInFrames={95}><AvailCTA /></Sequence>
  </AbsoluteFill>
);
