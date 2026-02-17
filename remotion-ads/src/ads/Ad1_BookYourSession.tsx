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
const LIGHT_TEXT = "#f1f5f9";
const SUBTLE_TEXT = "#b8c0cc";

const RTL: React.CSSProperties = { direction: "rtl" };

// ── Scene 1: Cinematic Studio Reveal ──
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = interpolate(frame, [0, 90], [1.15, 1], { extrapolateRight: "clamp" });
  const overlayOpacity = interpolate(frame, [0, 30], [1, 0.45], { extrapolateRight: "clamp" });
  const titleY = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 80 } });
  const subtitleOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const lineWidth = interpolate(frame, [50, 80], [0, 200], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Studio background image with slow zoom */}
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <Img
          src={staticFile("images/original/Landing-Studio1320-1.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
          }}
        />
      </div>

      {/* Dark gradient overlay */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(10,14,20,${overlayOpacity}) 0%, rgba(10,14,20,0.85) 60%, ${DARK_BG} 100%)`,
        }}
      />

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
          ...RTL,
        }}
      >
        {/* Logo pulse */}
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 90,
            height: 90,
            borderRadius: 18,
            marginBottom: 50,
            opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
            transform: `scale(${spring({ frame: frame - 10, fps, config: { damping: 12 } })})`,
          }}
        />

        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 72,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            lineHeight: 1.2,
            margin: 0,
            transform: `translateY(${interpolate(titleY, [0, 1], [60, 0])}px)`,
            opacity: titleY,
          }}
        >
          צור את{"\n"}
          <span style={{ color: GOLD }}>היצירה שלך</span>
        </h1>

        {/* Gold accent line */}
        <div
          style={{
            width: lineWidth,
            height: 4,
            backgroundColor: GOLD,
            borderRadius: 2,
            marginTop: 30,
            marginBottom: 30,
          }}
        />

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 28,
            color: SUBTLE_TEXT,
            textAlign: "center",
            lineHeight: 1.6,
            opacity: subtitleOpacity,
            maxWidth: 700,
          }}
        >
          גלה והזמן את אולפני ההקלטה{"\n"}והפודקאסט הטובים בישראל
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: App Screenshots Carousel ──
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const screenshots = [
    "images/optimized/Studioz-Studio-Details-1-Dark.webp",
    "images/optimized/Studioz-Studio-Details-Order-1-Light.webp",
    "images/optimized/Studioz-Studio-Detail-2-Light.webp",
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      {/* Floating label */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
          ...RTL,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 20,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          גלה
        </span>
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "15px 0 0 0",
            opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          אולפנים מאומתים
        </h2>
      </div>

      {/* Stacked phone screenshots with 3D perspective */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          height: 1200,
          perspective: "1200px",
        }}
      >
        {screenshots.map((src, i) => {
          const delay = i * 12;
          const slideUp = spring({ frame: frame - delay - 10, fps, config: { damping: 14, stiffness: 60 } });
          const xOffset = (i - 1) * 80;
          const rotation = (i - 1) * -4;
          const zOffset = -i * 30;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                transform: `
                  translateX(${xOffset}px)
                  translateY(${interpolate(slideUp, [0, 1], [400, 0])}px)
                  translateZ(${zOffset}px)
                  rotateY(${rotation}deg)
                `,
                opacity: slideUp,
                zIndex: 3 - i,
              }}
            >
              <div
                style={{
                  width: 380,
                  height: 780,
                  borderRadius: 30,
                  overflow: "hidden",
                  border: `2px solid rgba(255,209,102,${0.3 - i * 0.1})`,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                <Img
                  src={staticFile(src)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: CTA / Finale ──
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleIn = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const buttonPulse = interpolate(frame % 40, [0, 20, 40], [1, 1.05, 1]);
  const glowIntensity = interpolate(frame, [0, 30, 60], [0, 1, 0.7], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        justifyContent: "center",
        alignItems: "center",
        ...RTL,
      }}
    >
      {/* Radial glow behind logo */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,209,102,${glowIntensity * 0.15}) 0%, transparent 70%)`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${scaleIn})`,
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 120,
            height: 120,
            borderRadius: 24,
            marginBottom: 40,
          }}
        />

        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 56,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 20px 0",
            lineHeight: 1.2,
          }}
        >
          מוכנים ליצור?
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 24,
            color: SUBTLE_TEXT,
            textAlign: "center",
            margin: "0 0 50px 0",
            maxWidth: 600,
            lineHeight: 1.6,
            opacity: interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          פלטפורמת המרחבים היצירתיים{"\n"}המובילה בישראל
        </p>

        {/* CTA Button */}
        <div
          style={{
            backgroundColor: GOLD,
            paddingLeft: 60,
            paddingRight: 60,
            paddingTop: 22,
            paddingBottom: 22,
            borderRadius: 16,
            transform: `scale(${buttonPulse})`,
            opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" }),
            boxShadow: "0 0 40px rgba(255,209,102,0.3)",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: DARK_BG,
            }}
          >
            מצא אולפן
          </span>
        </div>

        <span
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 18,
            color: SUBTLE_TEXT,
            marginTop: 20,
            opacity: interpolate(frame, [40, 60], [0, 0.7], { extrapolateRight: "clamp" }),
          }}
        >
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── Main Composition ──
export const Ad1_BookYourSession: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={100}>
        <Scene1 />
      </Sequence>
      <Sequence from={100} durationInFrames={110}>
        <Scene2 />
      </Sequence>
      <Sequence from={210} durationInFrames={90}>
        <Scene3 />
      </Sequence>
    </AbsoluteFill>
  );
};
