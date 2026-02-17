/**
 * Shared Design System for Studioz B2B Ads V2
 * Premium boutique animation studio quality
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
export const LIGHT_TEXT = "#e2e8f0";
export const SUBTLE_TEXT = "#aab2be";
export const SUCCESS = "#6b9e82";
export const RED = "#b55a5a";
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

/* ─── Decorative Line ─── */
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
        boxShadow: `0 0 40px ${GOLD}25, 0 8px 24px rgba(0,0,0,0.3)`,
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: enter,
      }}
    >
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

/* ─── Section Label (e.g. "BOOKING FLOW") ─── */
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

/* ─── Feature Card ─── */
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
        borderRadius: 16,
        padding: desc ? "22px 20px" : "16px 18px",
        border: `1px solid rgba(255,209,102,0.07)`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          backgroundColor: `${accentColor}10`,
          border: `1px solid ${accentColor}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={22} color={accentColor} strokeWidth={1.8} />
      </div>
      <div>
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 19,
            fontWeight: 700,
            color: LIGHT_TEXT,
            marginBottom: desc ? 3 : 0,
          }}
        >
          {title}
        </div>
        {desc && (
          <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: SUBTLE_TEXT }}>
            {desc}
          </div>
        )}
      </div>
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
          fontSize: 48,
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
        backgroundColor: `${color}12`,
        border: `1px solid ${color}25`,
        borderRadius: 12,
        padding: "12px 24px",
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
          fontSize: 17,
          fontWeight: 600,
          color,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/* ─── Animated Headline ─── */
export const Headline: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  align?: "center" | "right" | "left";
}> = ({ children, delay = 0, size = 64, align = "right" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <h1
      style={{
        fontFamily: FONT_HEADING,
        fontSize: size,
        fontWeight: 700,
        color: LIGHT_TEXT,
        margin: 0,
        lineHeight: 1.18,
        textAlign: align,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [25, 0])}px)`,
      }}
    >
      {children}
    </h1>
  );
};

/* ─── Animated Subtitle ─── */
export const Subtitle: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  align?: "center" | "right" | "left";
}> = ({ children, delay = 8, size = 22, align = "right" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_GENTLE });

  return (
    <p
      style={{
        fontFamily: FONT_BODY,
        fontSize: size,
        color: SUBTLE_TEXT,
        margin: 0,
        lineHeight: 1.55,
        textAlign: align,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [15, 0])}px)`,
      }}
    >
      {children}
    </p>
  );
};

/* ─── Gold Accent Text ─── */
export const GoldText: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span
    style={{
      color: GOLD,
      filter: `drop-shadow(0 0 18px ${GOLD}30)`,
    }}
  >
    {children}
  </span>
);

/* ─── Standard Scene Wrapper ─── */
export const SceneWrapper: React.FC<{
  children: React.ReactNode;
  padding?: string;
  particles?: boolean;
  glowX?: string;
  glowY?: string;
  glowColor?: string;
}> = ({
  children,
  padding = "52px 48px 42px",
  particles = true,
  glowX,
  glowY,
  glowColor,
}) => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
    <NoiseOverlay />
    {particles && <AmbientParticles count={16} />}
    {glowX && (
      <RadialGlow
        x={glowX}
        y={glowY || "50%"}
        color={glowColor || GOLD}
        opacity={0.08}
      />
    )}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding,
        position: "relative",
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);
