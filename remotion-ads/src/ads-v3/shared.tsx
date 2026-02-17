/**
 * Shared Design System for Studioz B2B Ads V3
 * Merges V1 authenticity (screenshots, emoji, bold CTAs) with V2 premium polish
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadIBMPlexSans } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadHeebo } from "@remotion/google-fonts/Heebo";

/* ─── Font Loading ─── */
const dmSans = loadDMSans("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});
const ibmPlexSans = loadIBMPlexSans("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});
const heebo = loadHeebo("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["hebrew"],
});

export const FONT_HEADING = `${dmSans.fontFamily}, ${heebo.fontFamily}, sans-serif`;
export const FONT_BODY = `${ibmPlexSans.fontFamily}, ${heebo.fontFamily}, sans-serif`;
export const FONT_MONO = `${ibmPlexSans.fontFamily}, monospace`;

/* ─── Color Palette ─── */
export const GOLD = "#ffd166";
export const DARK_BG = "#0a0e14";
export const DARK_CARD = "#13171d";
export const DARK_CARD_HOVER = "#1a1f28";
export const LIGHT_TEXT = "#f1f5f9";
export const SUBTLE_TEXT = "#b8c0cc";
export const SUCCESS = "#10b981";
export const RED = "#dc2626";
export const ACCENT_BLUE = "#5b8fb9";
export const RTL: React.CSSProperties = { direction: "rtl" };

/* ─── Spring Presets ─── */
export const SPRING_SMOOTH = { damping: 14, stiffness: 80 };
export const SPRING_SNAPPY = { damping: 18, stiffness: 120 };
export const SPRING_BOUNCY = { damping: 8, stiffness: 50, mass: 1.2 };
export const SPRING_GENTLE = { damping: 20, stiffness: 60 };

/* ─── Noise Texture Overlay ─── */
export const NoiseOverlay: React.FC = () => (
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

/* ─── Ambient Floating Particles ─── */
export const AmbientParticles: React.FC<{
  count?: number;
  color?: string;
  width?: number;
  height?: number;
}> = ({ count = 20, color = GOLD, width = 1080, height = 1920 }) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        x: (i * 137.508) % width,
        y: (i * 89.333) % height,
        size: 2 + (i % 4) * 1.5,
        speed: 0.3 + (i % 5) * 0.12,
        phase: i * 2.39996,
      })),
    [count, width, height]
  );

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x + Math.sin(frame * 0.012 * p.speed + p.phase) * 30,
            top: p.y + Math.cos(frame * 0.01 * p.speed + p.phase) * 25,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: i % 3 === 0 ? color : SUBTLE_TEXT,
            opacity: interpolate(
              Math.sin(frame * 0.018 + p.phase),
              [-1, 1],
              [0.06, 0.3]
            ),
          }}
        />
      ))}
    </>
  );
};

/* ─── Radial Glow ─── */
export const RadialGlow: React.FC<{
  x?: string;
  y?: string;
  size?: number;
  color?: string;
  opacity?: number;
}> = ({ x = "50%", y = "50%", size = 500, color = GOLD, opacity = 0.1 }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame * 0.035), [-1, 1], [0.85, 1.15]);

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

/* ─── Decorative Gold Line ─── */
export const GoldLine: React.FC<{
  width?: number;
  delay?: number;
  vertical?: boolean;
}> = ({ width = 160, delay = 0, vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const expand = spring({ frame: frame - delay, fps, config: SPRING_GENTLE });

  return (
    <div
      style={{
        width: vertical ? 3 : interpolate(expand, [0, 1], [0, width]),
        height: vertical ? interpolate(expand, [0, 1], [0, width]) : 3,
        background: `linear-gradient(${vertical ? "180deg" : "90deg"}, transparent, ${GOLD}, transparent)`,
        borderRadius: 2,
      }}
    />
  );
};

/* ─── Premium CTA Button ─── */
export const GoldButton: React.FC<{
  text: string;
  delay?: number;
  arrow?: boolean;
  size?: "sm" | "md" | "lg";
}> = ({ text, delay = 0, arrow = true, size = "md" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });
  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [1, 1.025]);

  const sizes = {
    sm: { padding: "14px 32px", fontSize: 22, borderRadius: 13 },
    md: { padding: "18px 44px", fontSize: 27, borderRadius: 16 },
    lg: { padding: "22px 56px", fontSize: 32, borderRadius: 18 },
  };
  const s = sizes[size];

  return (
    <div
      style={{
        backgroundColor: GOLD,
        borderRadius: s.borderRadius,
        padding: s.padding,
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        boxShadow: `0 0 50px ${GOLD}25, 0 8px 24px rgba(0,0,0,0.3)`,
        transform: `scale(${enter * pulse})`,
        opacity: enter,
      }}
    >
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: s.fontSize,
          fontWeight: 700,
          color: DARK_BG,
        }}
      >
        {text}
      </span>
      {arrow && (
        <span style={{ fontSize: s.fontSize * 0.8, color: DARK_BG }}>←</span>
      )}
    </div>
  );
};

/* ─── Footer / Branding ─── */
export const Footer: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_GENTLE });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: enter }}>
      <Img
        src={staticFile("logo.png")}
        style={{ width: 32, height: 32, borderRadius: 8 }}
      />
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 15,
          color: SUBTLE_TEXT,
          fontWeight: 500,
          letterSpacing: "0.5px",
        }}
      >
        studioz.co.il
      </span>
    </div>
  );
};

/* ─── Section Label ─── */
export const SectionLabel: React.FC<{
  text: string;
  delay?: number;
  color?: string;
}> = ({ text, delay = 0, color = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [-12, 0])}px)`,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 14,
          color: SUBTLE_TEXT,
          fontWeight: 600,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  );
};

/* ─── Gold Accent Text ─── */
export const GoldText: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span style={{ color: GOLD, filter: `drop-shadow(0 0 18px ${GOLD}30)` }}>
    {children}
  </span>
);

/* ─── Feature Card (Lucide icon) ─── */
export const FeatureCard: React.FC<{
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  desc?: string;
  delay?: number;
  accentColor?: string;
}> = ({ Icon, title, desc, delay = 0, accentColor = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: desc ? "24px 22px" : "18px 20px",
        border: `1px solid ${accentColor}12`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 14,
          backgroundColor: `${accentColor}10`,
          border: `1px solid ${accentColor}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={24} color={accentColor} strokeWidth={1.8} />
      </div>
      <div>
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 22,
            fontWeight: 700,
            color: LIGHT_TEXT,
            marginBottom: desc ? 4 : 0,
          }}
        >
          {title}
        </div>
        {desc && (
          <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: SUBTLE_TEXT }}>
            {desc}
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   V3-SPECIFIC COMPONENTS
   Bringing back V1 engagement patterns with V2 premium polish
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Emoji Pain Card (V1-style problem with animated strikethrough) ─── */
export const PainCard: React.FC<{
  emoji: string;
  text: string;
  delay?: number;
  strikeDelay?: number;
}> = ({ emoji, text, delay = 0, strikeDelay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 12 } });
  const strikethrough = strikeDelay
    ? interpolate(frame, [strikeDelay, strikeDelay + 12], [0, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: "22px 24px",
        border: `1px solid ${RED}15`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [60, 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <span style={{ fontSize: 38, flexShrink: 0 }}>{emoji}</span>
      <div style={{ position: "relative" }}>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: 26,
            color: SUBTLE_TEXT,
          }}
        >
          {text}
        </span>
        {strikeDelay != null && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              width: `${strikethrough}%`,
              height: 3,
              backgroundColor: RED,
              borderRadius: 2,
            }}
          />
        )}
      </div>
    </div>
  );
};

/* ─── Emoji Feature Row (V1-style with emoji + text, V2 polish) ─── */
export const EmojiFeature: React.FC<{
  emoji: string;
  label: string;
  delay?: number;
}> = ({ emoji, label, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        border: "1px solid rgba(255,209,102,0.12)",
        borderRadius: 50,
        padding: "14px 26px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      }}
    >
      <span style={{ fontSize: 24 }}>{emoji}</span>
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 20,
          fontWeight: 600,
          color: LIGHT_TEXT,
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─── Screenshot Frame (with premium border + shadow) ─── */
export const ScreenshotFrame: React.FC<{
  src: string;
  delay?: number;
  borderRadius?: number;
  maxHeight?: number;
}> = ({ src, delay = 0, borderRadius = 20, maxHeight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slideUp = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <div
      style={{
        borderRadius,
        overflow: "hidden",
        border: "1px solid rgba(255,209,102,0.2)",
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${GOLD}06`,
        transform: `translateY(${interpolate(slideUp, [0, 1], [150, 0])}px)`,
        opacity: slideUp,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: maxHeight ? maxHeight : "auto",
          objectFit: maxHeight ? "cover" : undefined,
        }}
      />
    </div>
  );
};

/* ─── Phone Mockup (for app screenshots) ─── */
export const PhoneMockup: React.FC<{
  src: string;
  delay?: number;
  width?: number;
  height?: number;
  tilt?: number;
}> = ({ src, delay = 0, width = 460, height = 920, tilt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slideUp = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 28,
        overflow: "hidden",
        border: "2px solid rgba(255,209,102,0.12)",
        boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 30px ${GOLD}06`,
        transform: `translateY(${interpolate(slideUp, [0, 1], [200, tilt])}px)`,
        opacity: slideUp,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

/* ─── Stat Card ─── */
export const StatCard: React.FC<{
  value: string;
  label: string;
  delay?: number;
  Icon?: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
}> = ({ value, label, delay = 0, Icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: "28px 22px",
        textAlign: "center",
        border: `1px solid rgba(255,209,102,0.08)`,
        transform: `scale(${enter})`,
        opacity: enter,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
        flex: 1,
      }}
    >
      {Icon && (
        <div style={{ marginBottom: 10 }}>
          <Icon size={24} color={GOLD} strokeWidth={1.8} />
        </div>
      )}
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 46,
          fontWeight: 700,
          color: GOLD,
          marginBottom: 6,
          filter: `drop-shadow(0 0 10px ${GOLD}18)`,
        }}
      >
        {value}
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: SUBTLE_TEXT }}>
        {label}
      </div>
    </div>
  );
};

/* ─── Badge (pill) ─── */
export const Badge: React.FC<{
  text: string;
  color?: string;
  delay?: number;
  Icon?: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
}> = ({ text, color = SUCCESS, delay = 0, Icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: `${color}15`,
        border: `1px solid ${color}30`,
        borderRadius: 50,
        padding: "12px 26px",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [12, 0])}px)`,
      }}
    >
      {Icon && <Icon size={18} color={color} strokeWidth={2.2} />}
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 20,
          fontWeight: 600,
          color,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/* ─── CTA Scene (Logo + headline + button + free badge) ─── */
export const CTAScene: React.FC<{
  headline: React.ReactNode;
  goldLine?: React.ReactNode;
  buttonText?: string;
  freeText?: string;
  subText?: string;
}> = ({
  headline,
  goldLine,
  buttonText = "פרסם את האולפן שלך עכשיו",
  freeText = "התחל בחינם — ₪0/חודש",
  subText = "ללא כרטיס אשראי · ללא התחייבות",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scaleIn = spring({ frame, fps, config: { damping: 12 } });
  const buttonPulse = interpolate(frame % 50, [0, 25, 50], [1, 1.04, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="50%" size={600} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "60px 48px",
          position: "relative",
        }}
      >
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
              width: 90,
              height: 90,
              borderRadius: 20,
              marginBottom: 30,
            }}
          />

          {goldLine}

          <h2
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 48,
              fontWeight: 700,
              color: LIGHT_TEXT,
              textAlign: "center",
              margin: "0 0 10px 0",
              lineHeight: 1.3,
            }}
          >
            {headline}
          </h2>

          {/* Free badge */}
          <div
            style={{
              backgroundColor: `${SUCCESS}15`,
              border: `1px solid ${SUCCESS}30`,
              borderRadius: 50,
              padding: "10px 30px",
              margin: "20px 0",
              opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 22,
                fontWeight: 600,
                color: SUCCESS,
              }}
            >
              {freeText}
            </span>
          </div>

          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 22,
              color: SUBTLE_TEXT,
              textAlign: "center",
              margin: "0 0 35px 0",
              lineHeight: 1.6,
              opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            {subText}
          </p>

          {/* CTA Button */}
          <div
            style={{
              backgroundColor: GOLD,
              paddingLeft: 50,
              paddingRight: 50,
              paddingTop: 22,
              paddingBottom: 22,
              borderRadius: 16,
              transform: `scale(${buttonPulse})`,
              opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
              boxShadow: `0 0 50px ${GOLD}25`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 26,
                fontWeight: 700,
                color: DARK_BG,
              }}
            >
              {buttonText}
            </span>
          </div>

          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: 18,
              color: SUBTLE_TEXT,
              marginTop: 25,
              opacity: interpolate(frame, [45, 60], [0, 0.7], { extrapolateRight: "clamp" }),
            }}
          >
            studioz.co.il
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Screenshot + CTA Scene (V1-style with product screenshot and overlay) ─── */
export const ScreenshotCTAScene: React.FC<{
  screenshotSrc: string;
  headline: React.ReactNode;
  buttonText?: string;
}> = ({ screenshotSrc, headline, buttonText = "הזמן עכשיו" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slideUp = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      {/* Screenshot */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 30,
          right: 30,
          transform: `translateY(${interpolate(slideUp, [0, 1], [150, 0])}px)`,
          opacity: slideUp,
        }}
      >
        <div
          style={{
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(255,209,102,0.2)",
            boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${GOLD}06`,
          }}
        >
          <Img
            src={staticFile(screenshotSrc)}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>

      {/* Bottom overlay with CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "100px 50px 120px",
          background: `linear-gradient(0deg, ${DARK_BG} 50%, transparent 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 25px",
            opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {headline}
        </h2>

        <div
          style={{
            opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <GoldButton text={buttonText} delay={0} size="md" />
        </div>

        <Footer delay={35} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Bullet List (V1-style with green dots) ─── */
export const BulletList: React.FC<{
  items: string[];
  startDelay?: number;
  gap?: number;
}> = ({ items, startDelay = 30, gap = 8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {items.map((text, i) => {
        const enter = spring({
          frame: frame - startDelay - i * 8,
          fps,
          config: { damping: 12 },
        });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: enter,
              transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: SUCCESS,
                flexShrink: 0,
                boxShadow: `0 0 8px ${SUCCESS}40`,
              }}
            />
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize: 22,
                color: LIGHT_TEXT,
              }}
            >
              {text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Connecting Line (animated vertical/horizontal) ─── */
export const ConnectingLine: React.FC<{
  x?: number;
  y?: number;
  height?: number;
  startFrame?: number;
  endFrame?: number;
}> = ({ x = 88, y = 370, height = 380, startFrame = 20, endFrame = 90 }) => {
  const frame = useCurrentFrame();
  const lineHeight = interpolate(frame, [startFrame, endFrame], [0, height], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        right: x,
        top: y,
        width: 2,
        height: lineHeight,
        background: `linear-gradient(180deg, ${GOLD}40, ${GOLD}10)`,
      }}
    />
  );
};

/* ─── Numbered Step Card (V1-style with circle numbers) ─── */
export const StepCard: React.FC<{
  num: string;
  title: string;
  desc: string;
  delay?: number;
  isLast?: boolean;
}> = ({ num, title, desc, delay = 0, isLast = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } });
  const numberScale = spring({ frame: frame - delay - 5, fps, config: { damping: 8, stiffness: 120 } });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        backgroundColor: DARK_CARD,
        borderRadius: 22,
        padding: "32px 28px",
        border: `1px solid rgba(255,209,102,${isLast ? 0.2 : 0.1})`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [60, 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          backgroundColor: isLast ? GOLD : `${GOLD}10`,
          border: `2px solid ${GOLD}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transform: `scale(${numberScale})`,
          boxShadow: isLast ? `0 0 30px ${GOLD}30` : "none",
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 26,
            fontWeight: 800,
            color: isLast ? DARK_BG : GOLD,
          }}
        >
          {num}
        </span>
      </div>
      <div>
        <h3
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 28,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 6px",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 18,
            color: SUBTLE_TEXT,
            margin: 0,
            lineHeight: 1.5,
            whiteSpace: "pre-line",
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
};
