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

// ── Scene 1: Phone mockup ──
const PhoneScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneEnter = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 60 } });

  const screens = [
    { label: "חיפוש אולפן", delay: 20 },
    { label: "בחירת שירות", delay: 45 },
    { label: "תשלום", delay: 70 },
    { label: "אישור!", delay: 95 },
  ];

  const activeScreen = screens.reduce((acc, s, i) => (frame >= s.delay ? i : acc), 0);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <div style={{ position: "absolute", top: 80, left: 0, right: 0, textAlign: "center" }}>
        <h1 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 48, fontWeight: 700, color: LIGHT_TEXT, margin: 0, lineHeight: 1.2, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
          הכל <span style={{ color: GOLD }}>בכף היד</span>
        </h1>
      </div>

      {/* Phone frame */}
      <div style={{ position: "absolute", top: 250, left: "50%", transform: `translateX(-50%) translateY(${interpolate(phoneEnter, [0, 1], [100, 0])}px)`, opacity: phoneEnter }}>
        <div style={{ width: 340, height: 680, borderRadius: 40, border: `3px solid ${GOLD}40`, backgroundColor: DARK_CARD, overflow: "hidden", position: "relative" }}>
          {/* Notch */}
          <div style={{ width: 120, height: 28, backgroundColor: DARK_BG, borderRadius: "0 0 16px 16px", margin: "0 auto" }} />

          {/* Screen content */}
          <div style={{ padding: 24, marginTop: 10 }}>
            {screens.map((screen, i) => {
              const isActive = i === activeScreen;
              const screenEnter = spring({ frame: frame - screen.delay, fps, config: { damping: 12 } });
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, opacity: screenEnter, transform: `translateX(${interpolate(screenEnter, [0, 1], [30, 0])}px)` }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: isActive ? GOLD : "rgba(255,209,102,0.1)", border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: isActive ? DARK_BG : GOLD }}>{i + 1}</span>
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: isActive ? LIGHT_TEXT : SUBTLE_TEXT, fontWeight: isActive ? 600 : 400 }}>{screen.label}</span>
                </div>
              );
            })}

            {/* Mock screenshot area */}
            <div style={{ marginTop: 20, backgroundColor: "rgba(255,209,102,0.05)", borderRadius: 16, height: 280, border: "1px solid rgba(255,209,102,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Img src={staticFile("logo.png")} style={{ width: 50, height: 50, borderRadius: 10, opacity: 0.3 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tap indicator */}
      <div style={{ position: "absolute", bottom: 100, left: 0, right: 0, textAlign: "center", opacity: interpolate(frame % 60, [0, 30, 60], [0.3, 1, 0.3]) }}>
        <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT }}>👆 הזמנה בלחיצה</span>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: CTA ──
const MobileCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center", ...RTL }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${enter})`, padding: 50 }}>
        <Img src={staticFile("logo.png")} style={{ width: 70, height: 70, borderRadius: 14, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 42, fontWeight: 700, color: LIGHT_TEXT, textAlign: "center", margin: "0 0 10px" }}>
          חוויה מושלמת{"\n"}<span style={{ color: GOLD }}>בכל מכשיר</span>
        </h2>
        <div style={{ backgroundColor: GOLD, padding: "18px 50px", borderRadius: 14, marginTop: 25, boxShadow: "0 0 40px rgba(255,209,102,0.2)", opacity: interpolate(frame, [15, 28], [0, 1], { extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>נסה עכשיו</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>studioz.co.il</span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad25_MobileFirst: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={145}>
        <PhoneScene />
      </Sequence>
      <Sequence from={145} durationInFrames={95}>
        <MobileCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
