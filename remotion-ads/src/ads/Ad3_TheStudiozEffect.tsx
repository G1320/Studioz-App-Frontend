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

// ── Scene 1: Bold Kinetic Typography Intro ──
const KineticIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = [
    { text: "גלה.", color: GOLD, start: 0 },
    { text: "הזמן.", color: LIGHT_TEXT, start: 15 },
    { text: "צור.", color: GOLD, start: 30 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        justifyContent: "center",
        alignItems: "center",
        ...RTL,
      }}
    >
      {/* Animated grid lines background */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.06 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`h-${i}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${(i + 1) * 8}%`,
              height: 1,
              backgroundColor: GOLD,
              transform: `translateX(${interpolate(frame, [0, 70], [100, 0], { extrapolateRight: "clamp" })}%)`,
              opacity: interpolate(frame, [i * 3, i * 3 + 20], [0, 1], { extrapolateRight: "clamp" }),
            }}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`v-${i}`}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${(i + 1) * 12}%`,
              width: 1,
              backgroundColor: GOLD,
              transform: `translateY(${interpolate(frame, [0, 70], [-100, 0], { extrapolateRight: "clamp" })}%)`,
              opacity: interpolate(frame, [i * 4, i * 4 + 20], [0, 1], { extrapolateRight: "clamp" }),
            }}
          />
        ))}
      </div>

      {/* Logo at top */}
      <div
        style={{
          position: "absolute",
          top: 200,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scale(${spring({ frame, fps, config: { damping: 10 } })})`,
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{ width: 80, height: 80, borderRadius: 16 }}
        />
      </div>

      {/* Kinetic words */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        {words.map((w, i) => {
          const enter = spring({
            frame: frame - w.start,
            fps,
            config: { damping: 8, stiffness: 120 },
          });
          const slideX = interpolate(enter, [0, 1], [i % 2 === 0 ? 300 : -300, 0]);

          return (
            <h1
              key={i}
              style={{
                fontFamily: "'DM Sans', 'Heebo', sans-serif",
                fontSize: 100,
                fontWeight: 800,
                color: w.color,
                margin: 0,
                letterSpacing: -2,
                opacity: enter,
                transform: `translateX(${slideX}px)`,
              }}
            >
              {w.text}
            </h1>
          );
        })}
      </div>

      {/* Subtitle */}
      <p
        style={{
          position: "absolute",
          bottom: 350,
          fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
          fontSize: 28,
          color: SUBTLE_TEXT,
          textAlign: "center",
          opacity: interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        פלטפורמת האולפנים #1 בישראל
      </p>
    </AbsoluteFill>
  );
};

// ── Scene 2: Rapid-Fire Stats ──
const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: "+15", label: "ערים", delay: 0 },
    { value: "24/7", label: "הזמנות", delay: 12 },
    { value: "₪0", label: "להתחלה", delay: 24 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        ...RTL,
      }}
    >
      {/* Background pulse rings */}
      {[0, 1, 2].map((i) => {
        const ringScale = interpolate((frame + i * 25) % 90, [0, 90], [0.5, 2.5]);
        const ringOpacity = interpolate((frame + i * 25) % 90, [0, 90], [0.15, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              border: `2px solid ${GOLD}`,
              opacity: ringOpacity,
              transform: `scale(${ringScale})`,
            }}
          />
        );
      })}

      <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
        {stats.map((stat, i) => {
          const enter = spring({
            frame: frame - stat.delay,
            fps,
            config: { damping: 10, stiffness: 100 },
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: enter,
                transform: `scale(${enter})`,
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 100,
                  fontWeight: 800,
                  color: GOLD,
                  lineHeight: 1,
                  direction: "ltr",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 28,
                  color: SUBTLE_TEXT,
                  marginTop: 8,
                  letterSpacing: 3,
                }}
              >
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Dark/Light Mode Showcase ──
const ThemeShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  const splitPosition = interpolate(frame, [10, 50], [100, 50], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 20,
          ...RTL,
        }}
      >
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 50px",
            lineHeight: 1.3,
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          עיצוב שהופך מבקרים{"\n"}
          <span style={{ color: GOLD }}>ללקוחות משלמים</span>
        </h2>
      </div>

      {/* Split screen: Dark | Light */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 40,
          right: 40,
          height: 1100,
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid rgba(255,209,102,0.2)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Dark screenshot (full width behind) */}
        <Img
          src={staticFile("images/optimized/Studioz-Studio-Details-1-Dark.webp")}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Light screenshot (clipped from right for RTL) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(0 0 0 ${100 - splitPosition}%)`,
          }}
        >
          <Img
            src={staticFile("images/optimized/Studioz-Studio-Details-1-Light.webp")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        {/* Split line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${100 - splitPosition}%`,
            width: 3,
            backgroundColor: GOLD,
            boxShadow: `0 0 20px ${GOLD}`,
            zIndex: 10,
          }}
        />
      </div>

      {/* Labels */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 60,
          opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" }),
          ...RTL,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 24,
            fontWeight: 600,
            color: LIGHT_TEXT,
            padding: "8px 24px",
            borderRadius: 12,
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        >
          בהיר
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 24,
            fontWeight: 600,
            color: LIGHT_TEXT,
            padding: "8px 24px",
            borderRadius: 12,
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        >
          כהה
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Final CTA with Energy ──
const EnergyCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainScale = spring({ frame, fps, config: { damping: 10, stiffness: 80 } });

  // Particle-like dots
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const radius = interpolate(frame, [0, 60], [0, 250 + (i % 3) * 80], {
      extrapolateRight: "clamp",
    });
    const x = Math.cos(angle + frame * 0.02) * radius;
    const y = Math.sin(angle + frame * 0.02) * radius;
    const fadeIn = Math.min(i * 2, 28);
    const holdStart = fadeIn + 20;
    const fadeOutStart = Math.max(holdStart + 1, 50);
    const fadeOutEnd = fadeOutStart + 10;
    const opacity = interpolate(frame, [fadeIn, holdStart, fadeOutStart, fadeOutEnd], [0, 0.6, 0.6, 0.2], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    return { x, y, opacity, size: 4 + (i % 3) * 3 };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        justifyContent: "center",
        alignItems: "center",
        ...RTL,
      }}
    >
      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: GOLD,
            opacity: p.opacity,
            transform: `translate(${p.x}px, ${p.y}px)`,
          }}
        />
      ))}

      {/* Large glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,209,102,0.08) 0%, transparent 60%)",
          transform: `scale(${interpolate(frame, [0, 60], [0.5, 1.5], { extrapolateRight: "clamp" })})`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${mainScale})`,
          zIndex: 10,
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 110,
            height: 110,
            borderRadius: 22,
            marginBottom: 35,
            boxShadow: "0 0 60px rgba(255,209,102,0.3)",
          }}
        />

        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 64,
            fontWeight: 800,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          הסאונד שלך.
        </h1>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 64,
            fontWeight: 800,
            color: GOLD,
            textAlign: "center",
            margin: "5px 0 30px 0",
          }}
        >
          הפלטפורמה שלנו.
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 24,
            color: SUBTLE_TEXT,
            textAlign: "center",
            margin: "0 0 45px 0",
            lineHeight: 1.6,
            opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          הזמן אולפנים. הגדל את העסק.{"\n"}הכל במקום אחד.
        </p>

        {/* Dual CTAs */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "center",
            opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              backgroundColor: GOLD,
              paddingLeft: 50,
              paddingRight: 50,
              paddingTop: 20,
              paddingBottom: 20,
              borderRadius: 14,
              boxShadow: "0 0 40px rgba(255,209,102,0.25)",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', 'Heebo', sans-serif",
                fontSize: 26,
                fontWeight: 700,
                color: DARK_BG,
              }}
            >
              מצא אולפן
            </span>
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              paddingLeft: 50,
              paddingRight: 50,
              paddingTop: 18,
              paddingBottom: 18,
              borderRadius: 14,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', 'Heebo', sans-serif",
                fontSize: 24,
                fontWeight: 600,
                color: LIGHT_TEXT,
              }}
            >
              פרסם את המרחב שלך
            </span>
          </div>
        </div>

        <span
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 18,
            color: SUBTLE_TEXT,
            marginTop: 30,
            opacity: interpolate(frame, [35, 50], [0, 0.7], { extrapolateRight: "clamp" }),
          }}
        >
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── Main Composition ──
export const Ad3_TheStudiozEffect: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={75}>
        <KineticIntro />
      </Sequence>
      <Sequence from={75} durationInFrames={60}>
        <StatsScene />
      </Sequence>
      <Sequence from={135} durationInFrames={65}>
        <ThemeShowcase />
      </Sequence>
      <Sequence from={200} durationInFrames={70}>
        <EnergyCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
