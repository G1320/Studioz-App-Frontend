import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

const GOLD = "#ffd166"; const DARK_BG = "#0a0e14"; const DARK_CARD = "#13171d"; const LIGHT_TEXT = "#f1f5f9"; const SUBTLE_TEXT = "#b8c0cc";
const RTL: React.CSSProperties = { direction: "rtl" };

const BrandMorphScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brands = [
    { name: "אולפן הזהב", color: "#ffd166", delay: 0 },
    { name: "סאונד כחול", color: "#3b82f6", delay: 50 },
    { name: "רד רום", color: "#ef4444", delay: 100 },
  ];
  const activeIdx = frame < 50 ? 0 : frame < 100 ? 1 : 2;
  const brand = brands[activeIdx];
  const morphEnter = spring({ frame: frame - brand.delay, fps, config: { damping: 14, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 40, ...RTL }}>
      <div style={{ textAlign: "center", marginTop: 60, marginBottom: 30 }}>
        <Img src={staticFile("logo.png")} style={{ width: 50, height: 50, borderRadius: 10, marginBottom: 15, opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }} />
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 8px", lineHeight: 1.2, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          העמוד שלך, <span style={{ color: GOLD }}>המותג שלך</span>
        </h1>
      </div>
      <div style={{ backgroundColor: DARK_CARD, borderRadius: 24, padding: 30, border: `2px solid ${brand.color}`, opacity: morphEnter, transform: `scale(${interpolate(morphEnter, [0, 1], [0.9, 1])})`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, backgroundColor: brand.color }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, marginTop: 10 }}>
          <div style={{ width: 55, height: 55, borderRadius: 14, backgroundColor: brand.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: DARK_BG }}>{brand.name.charAt(0)}</span>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: LIGHT_TEXT }}>{brand.name}</div>
            <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT }}>אולפן הקלטות מקצועי</div>
          </div>
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, opacity: interpolate(frame - brand.delay - i * 8, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
            <div style={{ width: 80, height: 55, borderRadius: 10, backgroundColor: `${brand.color}22`, border: `1px solid ${brand.color}44` }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 12, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.08)", marginBottom: 8, width: `${80 - i * 15}%` }} />
              <div style={{ height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.04)", width: "60%" }} />
            </div>
          </div>
        ))}
        <div style={{ backgroundColor: brand.color, borderRadius: 12, padding: "12px 0", textAlign: "center", marginTop: 18 }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 18, fontWeight: 700, color: DARK_BG }}>הזמן עכשיו</span>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 25, opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" }) }}>
        <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT }}>צבעים, לוגו ועיצוב — <span style={{ color: GOLD, fontWeight: 600 }}>הכל בשליטה שלך</span></span>
      </div>
    </AbsoluteFill>
  );
};

const BrandingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  const features = [
    { icon: "🎨", text: "צבעים וגופנים מותאמים אישית", delay: 5 },
    { icon: "🖼️", text: "העלאת לוגו ותמונות גלריה", delay: 15 },
    { icon: "🔗", text: "כתובת URL ייחודית לאולפן", delay: 25 },
    { icon: "📱", text: "עמוד מותאם לנייד אוטומטית", delay: 35 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 45, width: "100%" }}>
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 44, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 30px", lineHeight: 1.2 }}>
          מיתוג <span style={{ color: GOLD }}>מקצועי</span>{"\n"}בקליק אחד
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", paddingRight: 30, paddingLeft: 30, marginBottom: 35 }}>
          {features.map((f, i) => {
            const fEnter = spring({ frame: frame - f.delay, fps, config: { damping: 13, stiffness: 90 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, backgroundColor: DARK_CARD, borderRadius: 14, padding: "14px 18px", opacity: fEnter, transform: `translateX(${interpolate(fEnter, [0, 1], [60, 0])}px)` }}>
                <span style={{ fontSize: 22 }}>{f.icon}</span>
                <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 19, color: LIGHT_TEXT }}>{f.text}</span>
              </div>
            );
          })}
        </div>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, boxShadow: "0 0 50px rgba(255,209,102,0.25)", opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>עצב את העמוד שלך</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: SUBTLE_TEXT, marginTop: 18, opacity: interpolate(frame, [50, 62], [0, 0.7], { extrapolateRight: "clamp" }) }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad26_CustomBranding: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={155}><BrandMorphScene /></Sequence>
    <Sequence from={155} durationInFrames={85}><BrandingCTA /></Sequence>
  </AbsoluteFill>
);
