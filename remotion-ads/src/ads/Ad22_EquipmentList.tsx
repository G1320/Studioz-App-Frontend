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

// ── Scene 1: Equipment cards cascading ──
const EquipmentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { icon: "🎤", name: "מיקרופון", spec: "Neumann TLM 102", delay: 10 },
    { icon: "📷", name: "מצלמה", spec: "Sony A7III", delay: 25 },
    { icon: "💡", name: "תאורה", spec: "Aputure 300D II", delay: 40 },
    { icon: "🎚️", name: "מיקסר", spec: "Apollo Twin X", delay: 55 },
    { icon: "🟩", name: "מסך ירוק", spec: "Elgato Green Screen", delay: 70 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 45, ...RTL }}>
      <div style={{ marginTop: 100, textAlign: "center", marginBottom: 35 }}>
        <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 20, fontWeight: 600, color: GOLD, letterSpacing: 3, opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>
          ציוד סטודיו
        </span>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT, margin: "12px 0 0", lineHeight: 1.2, opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          הציוד שלך,{"\n"}<span style={{ color: GOLD }}>מפורט ומוכן</span>
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((item, i) => {
          const enter = spring({ frame: frame - item.delay, fps, config: { damping: 12, stiffness: 80 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, backgroundColor: DARK_CARD, borderRadius: 18, padding: "22px 20px", border: "1px solid rgba(255,209,102,0.08)", opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)` }}>
              <div style={{ width: 55, height: 55, borderRadius: 14, backgroundColor: "rgba(255,209,102,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 28 }}>{item.icon}</span>
              </div>
              <div>
                <h3 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 4px" }}>{item.name}</h3>
                <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 17, color: SUBTLE_TEXT, margin: 0, direction: "ltr", textAlign: "right" }}>{item.spec}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: CTA ──
const EquipmentCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 10px" }}>
          לקוחות יודעים{"\n"}<span style={{ color: GOLD }}>מה מחכה להם</span>
        </h2>
        <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT, textAlign: "center", margin: "0 0 30px", opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: "clamp" }) }}>
          פרסם את הציוד שלך וקבל הזמנות מלקוחות שמחפשים בדיוק את זה
        </p>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 40px rgba(255,209,102,0.2)" }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>הוסף את הציוד שלך</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad22_EquipmentList: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={145}>
        <EquipmentScene />
      </Sequence>
      <Sequence from={145} durationInFrames={95}>
        <EquipmentCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
