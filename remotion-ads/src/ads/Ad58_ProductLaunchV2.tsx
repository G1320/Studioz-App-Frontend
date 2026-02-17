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
  Easing,
} from "remotion";
import { Video } from "@remotion/media";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
// LightLeak removed — WebGL not available in headless rendering
import {
  CalendarDays,
  CreditCard,
  BarChart3,
  ShieldCheck,
  MessageCircle,
  Table2,
  Calculator,
  UserX,
  Rocket,
  Globe,
  Bell,
  Smartphone,
  TrendingUp,
  Star,
  Play,
  ArrowLeft,
} from "lucide-react";
import { FONT_HEADING, FONT_BODY, FONT_MONO } from "../posts-v4/fonts";

/* ─── Design Tokens ─── */
const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";
const RTL: React.CSSProperties = { direction: "rtl" };

/* ─── Shared: Noise Texture Overlay ─── */
const NoiseOverlay: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
      backgroundSize: "128px 128px",
      opacity: 0.4,
      pointerEvents: "none",
    }}
  />
);

/* ─── Shared: Ambient Particles ─── */
const AmbientParticles: React.FC<{ count?: number; color?: string }> = ({
  count = 25,
  color = GOLD,
}) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        x: ((i * 137.508) % 1920),
        y: ((i * 89.333) % 1080),
        size: 2 + (i % 4) * 1.5,
        speed: 0.3 + (i % 5) * 0.15,
        phase: i * 2.39996,
      })),
    [count]
  );

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x + Math.sin(frame * 0.012 * p.speed + p.phase) * 40,
            top: p.y + Math.cos(frame * 0.01 * p.speed + p.phase) * 30,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: i % 3 === 0 ? color : SUBTLE_TEXT,
            opacity: interpolate(
              Math.sin(frame * 0.02 + p.phase),
              [-1, 1],
              [0.08, 0.35]
            ),
          }}
        />
      ))}
    </>
  );
};

/* ─── Shared: Radial Glow ─── */
const RadialGlow: React.FC<{
  x?: string;
  y?: string;
  size?: number;
  color?: string;
  opacity?: number;
}> = ({ x = "50%", y = "50%", size = 600, color = GOLD, opacity = 0.12 }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.8, 1.2]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size * pulse,
        height: size * pulse,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    />
  );
};

/* ═══════════════════════════════════════════════════════════════
   Scene 1: Cinematic Logo Reveal (120 frames / 4s)
   ═══════════════════════════════════════════════════════════════ */
const LogoRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame: frame - 15, fps, config: { damping: 8, stiffness: 50, mass: 1.2 } });
  const logoRotate = interpolate(logoScale, [0, 1], [8, 0]);
  const titleEnter = spring({ frame: frame - 40, fps, config: { damping: 14, stiffness: 80 } });
  const subtitleEnter = spring({ frame: frame - 58, fps, config: { damping: 14 } });
  const lineExpand = spring({ frame: frame - 70, fps, config: { damping: 20, stiffness: 100 } });
  const glowPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.06, 0.2]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <NoiseOverlay />
      <AmbientParticles count={30} />

      {/* Multi-layered radial glow */}
      <RadialGlow size={800} opacity={glowPulse} />
      <RadialGlow size={400} color={`${GOLD}`} opacity={glowPulse * 0.5} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          ...RTL,
        }}
      >
        {/* Logo with shadow and rotation */}
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 180,
            height: 180,
            borderRadius: 36,
            transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
            boxShadow: `0 0 120px ${GOLD}25, 0 20px 60px rgba(0,0,0,0.5)`,
            marginBottom: 40,
          }}
        />

        {/* Title */}
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 96,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [40, 0])}px)`,
            textAlign: "center",
            letterSpacing: "-1px",
          }}
        >
          סטודיוז
        </h1>

        {/* Decorative line */}
        <div
          style={{
            width: interpolate(lineExpand, [0, 1], [0, 200]),
            height: 3,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            borderRadius: 2,
            marginTop: 20,
            marginBottom: 20,
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 32,
            fontWeight: 500,
            color: SUBTLE_TEXT,
            margin: 0,
            opacity: subtitleEnter,
            transform: `translateY(${interpolate(subtitleEnter, [0, 1], [25, 0])}px)`,
            textAlign: "center",
          }}
        >
          הפלטפורמה המלאה לניהול סטודיואים
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Scene 2: The Problem (150 frames / 5s)
   ═══════════════════════════════════════════════════════════════ */
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const problems = [
    { Icon: MessageCircle, text: "הודעות וואטסאפ אינסופיות", delay: 15 },
    { Icon: Table2, text: "יומן ידני שתמיד מתפספס", delay: 30 },
    { Icon: Calculator, text: "חשבוניות ידניות כל חודש", delay: 45 },
    { Icon: UserX, text: "ביטולים בלי פיצוי", delay: 60 },
  ];

  const headlineEnter = spring({ frame: frame - 5, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <RadialGlow x="75%" y="50%" size={700} color={RED} opacity={0.06} />

      <div
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          padding: "0 120px",
        }}
      >
        {/* Left: Text content */}
        <div style={{ flex: 1, paddingLeft: 60 }}>
          <h2
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 72,
              fontWeight: 700,
              color: LIGHT_TEXT,
              margin: "0 0 12px",
              lineHeight: 1.15,
              opacity: headlineEnter,
              transform: `translateY(${interpolate(headlineEnter, [0, 1], [30, 0])}px)`,
            }}
          >
            מכירים את זה?
          </h2>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 26,
              color: SUBTLE_TEXT,
              margin: "0 0 50px",
              opacity: interpolate(frame, [12, 28], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
            }}
          >
            ניהול סטודיו לא צריך להיות כזה מסובך
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {problems.map((p, i) => {
              const enter = spring({ frame: frame - p.delay, fps, config: { damping: 12 } });
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    opacity: enter,
                    transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      backgroundColor: `${RED}15`,
                      border: `1px solid ${RED}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <p.Icon size={28} color={RED} strokeWidth={1.8} />
                  </div>
                  <span
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 28,
                      color: LIGHT_TEXT,
                      fontWeight: 500,
                    }}
                  >
                    {p.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Chaotic floating cards */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i - 2) * 18 + Math.sin(frame * 0.025 + i) * 5;
            const enter = spring({ frame: frame - 10 - i * 8, fps, config: { damping: 10 } });
            const shake = Math.sin(frame * 0.06 + i * 1.5) * 3;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 320,
                  height: 72,
                  backgroundColor: DARK_CARD,
                  borderRadius: 14,
                  border: `1px solid ${RED}15`,
                  transform: `rotate(${angle}deg) translateY(${(i - 2) * 55 + shake}px)`,
                  opacity: enter * 0.75,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 20px",
                  gap: 12,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: RED }} />
                <div style={{ height: 10, flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 5 }} />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Scene 3: Solution Intro (90 frames / 3s)
   ═══════════════════════════════════════════════════════════════ */
const SolutionIntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEnter = spring({ frame: frame - 8, fps, config: { damping: 10, stiffness: 60 } });
  const subtitleEnter = spring({ frame: frame - 30, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={15} />
      <RadialGlow size={900} opacity={0.1} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 80,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 16px",
            lineHeight: 1.2,
            opacity: titleEnter,
            transform: `scale(${interpolate(titleEnter, [0, 1], [0.85, 1])})`,
          }}
        >
          הכל ב<span style={{ color: GOLD, filter: `drop-shadow(0 0 20px ${GOLD}40)` }}>פלטפורמה אחת</span>
        </h2>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 30,
            color: SUBTLE_TEXT,
            margin: 0,
            opacity: subtitleEnter,
            transform: `translateY(${interpolate(subtitleEnter, [0, 1], [20, 0])}px)`,
          }}
        >
          בואו נראה איך זה עובד
        </p>

        {/* Animated play indicator */}
        <div
          style={{
            marginTop: 50,
            opacity: interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
            transform: `scale(${interpolate(
              Math.sin(frame * 0.1),
              [-1, 1],
              [0.95, 1.05]
            )})`,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: GOLD,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 50px ${GOLD}40`,
            }}
          >
            <Play size={32} color={DARK_BG} strokeWidth={2.5} fill={DARK_BG} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Scene 4: Booking Demo (360 frames / 12s)
   ═══════════════════════════════════════════════════════════════ */
const BookingDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const deviceEnter = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 60 } });
  const labelEnter = spring({ frame: frame - 25, fps, config: { damping: 14 } });

  const captions = [
    { text: "הלקוח בוחר סטודיו", from: 0, to: 90 },
    { text: "בוחר תאריך ושעה", from: 90, to: 180 },
    { text: "משלם ומאשר בקליק", from: 180, to: 270 },
    { text: "ההזמנה נסגרה — אוטומטית", from: 270, to: 360 },
  ];

  const activeCaption = captions.find((c) => frame >= c.from && frame < c.to);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <RadialGlow x="50%" y="55%" size={1000} opacity={0.08} />

      {/* Section label */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 80,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: labelEnter,
          transform: `translateY(${interpolate(labelEnter, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: SUCCESS,
            boxShadow: `0 0 12px ${SUCCESS}`,
          }}
        />
        <span style={{ fontFamily: FONT_HEADING, fontSize: 18, color: SUBTLE_TEXT, fontWeight: 600, letterSpacing: "2px" }}>
          תהליך ההזמנה
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 30,
        }}
      >
        {/* Device frame with video */}
        <div
          style={{
            transform: `scale(${deviceEnter}) perspective(1200px) rotateY(${interpolate(
              deviceEnter,
              [0, 1],
              [-8, 0]
            )}deg)`,
            position: "relative",
          }}
        >
          {/* Browser chrome frame */}
          <div
            style={{
              width: 1100,
              backgroundColor: "#1a1f28",
              borderRadius: "18px 18px 0 0",
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 -4px 30px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", gap: 7 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "6px 14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Globe size={13} color={SUBTLE_TEXT} strokeWidth={2} />
              <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: SUBTLE_TEXT }}>
                studioz.co.il/book
              </span>
            </div>
          </div>

          {/* Video container */}
          <div
            style={{
              width: 1100,
              height: 620,
              overflow: "hidden",
              borderRadius: "0 0 18px 18px",
              backgroundColor: DARK_CARD,
              boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)`,
            }}
          >
            <Video
              src={staticFile("videos/booking-demo.mp4")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              muted
              loop
            />
          </div>
        </div>

        {/* Dynamic caption */}
        {activeCaption && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: interpolate(
                frame - activeCaption.from,
                [0, 12, 75, 90],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
              transform: `translateY(${interpolate(
                frame - activeCaption.from,
                [0, 12],
                [15, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )}px)`,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: `${GOLD}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CalendarDays size={22} color={GOLD} strokeWidth={1.8} />
            </div>
            <span style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 600, color: LIGHT_TEXT }}>
              {activeCaption.text}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Scene 5: Dashboard Demo (360 frames / 12s)
   ═══════════════════════════════════════════════════════════════ */
const DashboardDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const deviceEnter = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 60 } });
  const labelEnter = spring({ frame: frame - 25, fps, config: { damping: 14 } });

  const captions = [
    { text: "דשבורד בזמן אמת", from: 0, to: 90 },
    { text: "ניהול הזמנות חכם", from: 90, to: 180 },
    { text: "סליקה ותשלומים מובנים", from: 180, to: 270 },
    { text: "הגנה מביטולים אוטומטית", from: 270, to: 360 },
  ];

  const activeCaption = captions.find((c) => frame >= c.from && frame < c.to);
  const captionIcons = [BarChart3, CalendarDays, CreditCard, ShieldCheck];
  const captionIdx = captions.findIndex((c) => frame >= c.from && frame < c.to);
  const CaptionIcon = captionIdx >= 0 ? captionIcons[captionIdx] : BarChart3;

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <RadialGlow x="50%" y="55%" size={1000} opacity={0.08} />

      {/* Section label */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 80,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: labelEnter,
          transform: `translateY(${interpolate(labelEnter, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: GOLD,
            boxShadow: `0 0 12px ${GOLD}`,
          }}
        />
        <span style={{ fontFamily: FONT_HEADING, fontSize: 18, color: SUBTLE_TEXT, fontWeight: 600, letterSpacing: "2px" }}>
          לוח הבקרה
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 30,
        }}
      >
        {/* Device frame */}
        <div
          style={{
            transform: `scale(${deviceEnter}) perspective(1200px) rotateY(${interpolate(
              deviceEnter,
              [0, 1],
              [8, 0]
            )}deg)`,
            position: "relative",
          }}
        >
          {/* Browser chrome */}
          <div
            style={{
              width: 1100,
              backgroundColor: "#1a1f28",
              borderRadius: "18px 18px 0 0",
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 -4px 30px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", gap: 7 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "6px 14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Globe size={13} color={SUBTLE_TEXT} strokeWidth={2} />
              <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: SUBTLE_TEXT }}>
                studioz.co.il/dashboard
              </span>
            </div>
          </div>

          {/* Video */}
          <div
            style={{
              width: 1100,
              height: 620,
              overflow: "hidden",
              borderRadius: "0 0 18px 18px",
              backgroundColor: DARK_CARD,
              boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)`,
            }}
          >
            <Video
              src={staticFile("videos/dashboard-demo.mp4")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              muted
              loop
            />
          </div>
        </div>

        {/* Dynamic caption */}
        {activeCaption && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: interpolate(
                frame - activeCaption.from,
                [0, 12, 75, 90],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
              transform: `translateY(${interpolate(
                frame - activeCaption.from,
                [0, 12],
                [15, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )}px)`,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: `${GOLD}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CaptionIcon size={22} color={GOLD} strokeWidth={1.8} />
            </div>
            <span style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 600, color: LIGHT_TEXT }}>
              {activeCaption.text}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Scene 6: Features Grid (150 frames / 5s)
   ═══════════════════════════════════════════════════════════════ */
const FeaturesGridScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { Icon: Rocket, title: "הזמנות אוטומטיות", desc: "24/7, בלי שיחת טלפון", delay: 15 },
    { Icon: BarChart3, title: "דשבורד חכם", desc: "כל המספרים במקום אחד", delay: 25 },
    { Icon: CreditCard, title: "סליקה מובנית", desc: "תשלום מאובטח בקליק", delay: 35 },
    { Icon: Bell, title: "התראות חכמות", desc: "הזמנות, ביטולים, תזכורות", delay: 45 },
    { Icon: Globe, title: "עמוד סטודיו", desc: "נוכחות דיגיטלית מקצועית", delay: 55 },
    { Icon: Smartphone, title: "מובייל פירסט", desc: "עובד מושלם מכל מכשיר", delay: 65 },
  ];

  const headlineEnter = spring({ frame: frame - 5, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow size={700} opacity={0.08} />

      <div style={{ textAlign: "center", paddingTop: 100 }}>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 68,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: headlineEnter,
            transform: `translateY(${interpolate(headlineEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          הכלים ש<span style={{ color: GOLD, filter: `drop-shadow(0 0 18px ${GOLD}30)` }}>מייצרים תוצאות</span>
        </h2>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", padding: "50px 140px 0" }}>
        {features.map((f, i) => {
          const enter = spring({ frame: frame - f.delay, fps, config: { damping: 10, stiffness: 80 } });
          return (
            <div
              key={i}
              style={{
                width: "calc(33.33% - 16px)",
                backgroundColor: DARK_CARD,
                borderRadius: 20,
                padding: "36px 28px",
                textAlign: "center",
                border: `1px solid rgba(255,209,102,0.08)`,
                transform: `scale(${enter}) translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
                opacity: enter,
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  backgroundColor: `${GOLD}12`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <f.Icon size={28} color={GOLD} strokeWidth={1.8} />
              </div>
              <div
                style={{
                  fontFamily: FONT_HEADING,
                  fontSize: 24,
                  fontWeight: 700,
                  color: LIGHT_TEXT,
                  marginBottom: 6,
                }}
              >
                {f.title}
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 18, color: SUBTLE_TEXT }}>
                {f.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Scene 7: Stats & Social Proof (150 frames / 5s)
   ═══════════════════════════════════════════════════════════════ */
const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: "500+", label: "סטודיואים פעילים", delay: 10 },
    { value: "10K+", label: "הזמנות בוצעו", delay: 22 },
    { value: "87%", label: "שימור לקוחות", delay: 34 },
    { value: "4.9", label: "דירוג ממוצע", delay: 46, icon: true },
  ];

  const headlineEnter = spring({ frame: frame - 3, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow size={800} opacity={0.1} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: "0 120px",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 68,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 60px",
            opacity: headlineEnter,
            transform: `translateY(${interpolate(headlineEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          המספרים <span style={{ color: GOLD, filter: `drop-shadow(0 0 18px ${GOLD}30)` }}>מדברים</span>
        </h2>

        <div style={{ display: "flex", gap: 32, width: "100%", justifyContent: "center" }}>
          {stats.map((s, i) => {
            const enter = spring({ frame: frame - s.delay, fps, config: { damping: 10 } });
            const countUp = interpolate(frame - s.delay, [0, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: DARK_CARD,
                  borderRadius: 22,
                  padding: "44px 24px",
                  textAlign: "center",
                  border: `1px solid rgba(255,209,102,0.1)`,
                  transform: `scale(${enter})`,
                  opacity: enter,
                  boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 64,
                    fontWeight: 700,
                    color: GOLD,
                    marginBottom: 10,
                    filter: `drop-shadow(0 0 12px ${GOLD}20)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  {s.value}
                  {s.icon && <Star size={24} color={GOLD} fill={GOLD} strokeWidth={0} />}
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Growth badge */}
        <div
          style={{
            marginTop: 50,
            display: "flex",
            alignItems: "center",
            gap: 12,
            backgroundColor: `${SUCCESS}12`,
            border: `1px solid ${SUCCESS}25`,
            borderRadius: 14,
            padding: "16px 32px",
            opacity: interpolate(frame, [70, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [70, 85], [15, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px)`,
          }}
        >
          <TrendingUp size={22} color={SUCCESS} strokeWidth={2.5} />
          <span style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 700, color: SUCCESS }}>
            +35% הזמנות בממוצע אחרי חודש
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Scene 8: Final CTA (150 frames / 5s)
   ═══════════════════════════════════════════════════════════════ */
const FinalCTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEnter = spring({ frame: frame - 5, fps, config: { damping: 8, stiffness: 50 } });
  const textEnter = spring({ frame: frame - 25, fps, config: { damping: 12 } });
  const ctaEnter = spring({ frame: frame - 45, fps, config: { damping: 12 } });
  const urlEnter = spring({ frame: frame - 65, fps, config: { damping: 14 } });
  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [1, 1.035]);
  const glowPulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.08, 0.18]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={25} />
      <RadialGlow size={900} opacity={glowPulse} />
      <RadialGlow x="30%" y="60%" size={500} color={GOLD} opacity={glowPulse * 0.3} />
      <RadialGlow x="70%" y="40%" size={400} color={GOLD} opacity={glowPulse * 0.2} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 160,
            height: 160,
            borderRadius: 32,
            transform: `scale(${logoEnter})`,
            boxShadow: `0 0 120px ${GOLD}20, 0 20px 60px rgba(0,0,0,0.4)`,
            marginBottom: 44,
          }}
        />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 80,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 10px",
            opacity: textEnter,
            transform: `translateY(${interpolate(textEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          הסטודיו שלך
        </h2>
        <p
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 52,
            fontWeight: 600,
            color: GOLD,
            textAlign: "center",
            margin: "0 0 50px",
            opacity: textEnter,
            filter: `drop-shadow(0 0 20px ${GOLD}30)`,
          }}
        >
          מחכה לשדרוג
        </p>

        {/* CTA button */}
        <div
          style={{
            backgroundColor: GOLD,
            padding: "22px 72px",
            borderRadius: 18,
            boxShadow: `0 0 60px ${GOLD}30, 0 8px 32px rgba(0,0,0,0.3)`,
            transform: `scale(${ctaEnter * pulse})`,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 34,
              fontWeight: 700,
              color: DARK_BG,
            }}
          >
            הצטרף עכשיו — בחינם
          </span>
          <ArrowLeft size={24} color={DARK_BG} strokeWidth={3} />
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 30,
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: urlEnter,
          }}
        >
          <Globe size={18} color={SUBTLE_TEXT} strokeWidth={2} />
          <span style={{ fontFamily: FONT_MONO, fontSize: 22, color: SUBTLE_TEXT }}>
            studioz.co.il
          </span>
        </div>

        {/* Trust badges */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 30,
            opacity: urlEnter,
          }}
        >
          {[
            "בלי כרטיס אשראי",
            "הקמה ב-5 דקות",
            "ללא התחייבות",
          ].map((text, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: SUCCESS,
                }}
              />
              <span style={{ fontFamily: FONT_BODY, fontSize: 17, color: SUBTLE_TEXT }}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Main Composition — TransitionSeries with Light Leaks
   ═══════════════════════════════════════════════════════════════ */
export const Ad58_ProductLaunchV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <TransitionSeries>
        {/* Scene 1: Logo Reveal */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <LogoRevealScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* Scene 2: Problem */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 22 })}
        />

        {/* Scene 3: Solution Intro */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <SolutionIntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: 18 })}
        />

        {/* Scene 4: Booking Demo */}
        <TransitionSeries.Sequence durationInFrames={360}>
          <BookingDemoScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: 18 })}
        />

        {/* Scene 5: Dashboard Demo */}
        <TransitionSeries.Sequence durationInFrames={360}>
          <DashboardDemoScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* Scene 6: Features Grid */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <FeaturesGridScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* Scene 7: Stats */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <StatsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 22 })}
        />

        {/* Scene 8: Final CTA */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <FinalCTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
