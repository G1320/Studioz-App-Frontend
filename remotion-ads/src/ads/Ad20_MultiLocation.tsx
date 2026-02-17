import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#f1f5f9";
const SUBTLE_TEXT = "#b8c0cc";

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: Map pins dropping ──
const MapPinsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cities = [
    { name: "תל אביב", x: 520, y: 480, delay: 15 },
    { name: "ירושלים", x: 680, y: 620, delay: 35 },
    { name: "חיפה", x: 550, y: 300, delay: 55 },
    { name: "באר שבע", x: 600, y: 820, delay: 75 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <div style={{ position: "absolute", top: 100, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 20, fontWeight: 600, color: GOLD, letterSpacing: 3, opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>
          מיקומים מרובים
        </span>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 52, fontWeight: 700, color: LIGHT_TEXT, margin: "12px 0 0", lineHeight: 1.2, opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          כל הסניפים,{"\n"}<span style={{ color: GOLD }}>לוח אחד</span>
        </h1>
      </div>

      {/* Map pins */}
      {cities.map((city, i) => {
        const drop = spring({ frame: frame - city.delay, fps, config: { damping: 8, stiffness: 120 } });
        const bounce = spring({ frame: frame - city.delay - 5, fps, config: { damping: 6, stiffness: 200 } });
        return (
          <div key={i} style={{ position: "absolute", left: city.x - 40, top: city.y - 60, opacity: drop, transform: `translateY(${interpolate(drop, [0, 1], [-100, 0])}px)` }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 40, transform: `scale(${bounce})` }}>📍</div>
              <div style={{ backgroundColor: DARK_CARD, borderRadius: 10, padding: "6px 14px", marginTop: 4, border: "1px solid rgba(255,209,102,0.15)" }}>
                <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 16, color: LIGHT_TEXT, fontWeight: 600 }}>{city.name}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Counter */}
      <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", opacity: interpolate(frame, [90, 105], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, color: SUBTLE_TEXT }}>
          <span style={{ color: GOLD, fontWeight: 700 }}>{Math.min(4, Math.round(interpolate(frame, [15, 90], [0, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })))}</span> סניפים פעילים
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: Dashboard + CTA ──
const DashboardCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 25 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 44, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 10px" }}>
          נהל הכל{"\n"}<span style={{ color: GOLD }}>ממקום אחד</span>
        </h2>
        <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT, textAlign: "center", margin: "0 0 30px", opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" }) }}>
          יומן, הזמנות וסטטיסטיקות לכל הסניפים
        </p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)", opacity: interpolate(frame, [18, 30], [0, 1], { extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>התחל בחינם</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14, opacity: interpolate(frame, [25, 36], [0, 0.7], { extrapolateRight: "clamp" }) }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad20_MultiLocation: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150}>
        <MapPinsScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90}>
        <DashboardCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
