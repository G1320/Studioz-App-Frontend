/**
 * Shared Design System for Studioz B2B Ads V5
 * V5: No emojis — Lucide icons only. Only REAL features. Accurate stats.
 *     New dashboard screenshots per feature tab. cropTop support.
 *     AdaptiveLayout for multi-aspect-ratio (9:16, 4:5, 1:1).
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

/* ─── Responsive scaling for multi-aspect-ratio support ─── */
/**
 * useScale() — hook that returns a scaling function for pixel values.
 *
 * All components designed for 9:16 (1080×1920) call useScale() and
 * multiply their padding, font-size, gap, margin, and size values
 * through the returned function `s(px)`.
 *
 * Uses damped scaling so smaller ratios don't get too tiny:
 *  - 9:16 (1920): scale 1.00  → s(54) = 54
 *  - 4:5  (1350): scale 0.82  → s(54) = 44
 *  - 1:1  (1080): scale 0.74  → s(54) = 40
 *
 * Exported for use in both shared components AND individual ad files.
 */
export const useScale = (): ((px: number) => number) => {
  const { height } = useVideoConfig();
  const ratio = height / 1920;
  // Damped scale — more aggressive for very short viewports (1:1)
  // 9:16 (1920) → 1.00 | 4:5 (1350) → 0.82 | 1:1 (1080) → 0.65
  const scale = Math.min(1, ratio >= 0.7
    ? 0.4 + 0.6 * ratio   // 4:5 and above — gentle reduction
    : 0.2 + 0.8 * ratio   // 1:1 — more compact to avoid overflow
  );
  return (px: number) => Math.round(px * scale);
};

/** Keep AdaptiveLayout as a no-op alias for backwards compatibility */
export const AdaptiveLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
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

/* ─── Lucide Icon Type ─── */
export type LucideIcon = React.FC<{ size?: number; color?: string; strokeWidth?: number }>;

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
}> = ({ count = 20, color = GOLD }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
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
  const s = useScale();
  const expand = spring({ frame: frame - delay, fps, config: SPRING_GENTLE });

  return (
    <div
      style={{
        width: vertical ? s(3) : interpolate(expand, [0, 1], [0, s(width)]),
        height: vertical ? interpolate(expand, [0, 1], [0, s(width)]) : s(3),
        background: `linear-gradient(${vertical ? "180deg" : "90deg"}, transparent, ${GOLD}, transparent)`,
        borderRadius: 2,
      }}
    />
  );
};

/* ─── Gold Accent Text ─── */
export const GoldText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: GOLD, filter: `drop-shadow(0 0 18px ${GOLD}30)` }}>
    {children}
  </span>
);

/* ─── Section Label ─── */
export const SectionLabel: React.FC<{
  text: string;
  delay?: number;
  color?: string;
}> = ({ text, delay = 0, color = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: s(10),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [-s(12), 0])}px)`,
      }}
    >
      <div
        style={{
          width: s(6),
          height: s(6),
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 ${s(8)}px ${color}`,
        }}
      />
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: s(14),
          color: SUBTLE_TEXT,
          fontWeight: 600,
          letterSpacing: `${s(2.5)}px`,
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
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
  const sc = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });
  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [1, 1.025]);

  const sizes = {
    sm: { py: 14, px: 32, fontSize: 22, borderRadius: 13 },
    md: { py: 18, px: 44, fontSize: 27, borderRadius: 16 },
    lg: { py: 22, px: 56, fontSize: 32, borderRadius: 18 },
  };
  const sz = sizes[size];

  return (
    <div
      style={{
        backgroundColor: GOLD,
        borderRadius: sc(sz.borderRadius),
        padding: `${sc(sz.py)}px ${sc(sz.px)}px`,
        display: "inline-flex",
        alignItems: "center",
        gap: sc(12),
        boxShadow: `0 0 50px ${GOLD}25, 0 8px 24px rgba(0,0,0,0.3)`,
        transform: `scale(${enter * pulse})`,
        opacity: enter,
      }}
    >
      <span
        style={{ fontFamily: FONT_HEADING, fontSize: sc(sz.fontSize), fontWeight: 700, color: DARK_BG }}
      >
        {text}
      </span>
      {arrow && <span style={{ fontSize: sc(sz.fontSize) * 0.8, color: DARK_BG }}>←</span>}
    </div>
  );
};

/* ─── Footer / Branding ─── */
export const Footer: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_GENTLE });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: s(10), opacity: enter }}>
      <Img src={staticFile("logo.png")} style={{ width: s(32), height: s(32), borderRadius: s(8) }} />
      <span
        style={{ fontFamily: FONT_HEADING, fontSize: s(15), color: SUBTLE_TEXT, fontWeight: 500, letterSpacing: "0.5px" }}
      >
        studioz.co.il
      </span>
    </div>
  );
};

/* ─── Feature Card (Lucide icon) ─── */
export const FeatureCard: React.FC<{
  Icon: LucideIcon;
  title: string;
  desc?: string;
  delay?: number;
  accentColor?: string;
}> = ({ Icon, title, desc, delay = 0, accentColor = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: s(18),
        padding: desc ? `${s(24)}px ${s(22)}px` : `${s(18)}px ${s(20)}px`,
        border: `1px solid ${accentColor}12`,
        display: "flex",
        alignItems: "center",
        gap: s(16),
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [s(50), 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          width: s(50),
          height: s(50),
          borderRadius: s(14),
          backgroundColor: `${accentColor}10`,
          border: `1px solid ${accentColor}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={s(24)} color={accentColor} strokeWidth={1.8} />
      </div>
      <div>
        <div
          style={{ fontFamily: FONT_HEADING, fontSize: s(22), fontWeight: 700, color: LIGHT_TEXT, marginBottom: desc ? s(4) : 0 }}
        >
          {title}
        </div>
        {desc && (
          <div style={{ fontFamily: FONT_BODY, fontSize: s(15), color: SUBTLE_TEXT }}>{desc}</div>
        )}
      </div>
    </div>
  );
};

/* ─── Pain Card (Lucide icon + optional strikethrough) ─── */
export const PainCard: React.FC<{
  Icon: LucideIcon;
  text: string;
  delay?: number;
  strikeDelay?: number;
}> = ({ Icon, text, delay = 0, strikeDelay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
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
        gap: s(18),
        backgroundColor: DARK_CARD,
        borderRadius: s(18),
        padding: `${s(22)}px ${s(24)}px`,
        border: `1px solid ${RED}15`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [s(60), 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          width: s(48),
          height: s(48),
          borderRadius: s(14),
          backgroundColor: `${RED}12`,
          border: `1px solid ${RED}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={s(24)} color={RED} strokeWidth={1.8} />
      </div>
      <div style={{ position: "relative" }}>
        <span style={{ fontFamily: FONT_BODY, fontSize: s(24), color: SUBTLE_TEXT }}>{text}</span>
        {strikeDelay != null && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              width: `${strikethrough}%`,
              height: s(3),
              backgroundColor: RED,
              borderRadius: 2,
            }}
          />
        )}
      </div>
    </div>
  );
};

/* ─── Icon Pill (like EmojiFeature but with Lucide icon) ─── */
export const IconPill: React.FC<{
  Icon: LucideIcon;
  label: string;
  delay?: number;
  color?: string;
}> = ({ Icon, label, delay = 0, color = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        border: `1px solid ${color}15`,
        borderRadius: 50,
        padding: `${s(14)}px ${s(26)}px`,
        display: "flex",
        alignItems: "center",
        gap: s(12),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [s(20), 0])}px)`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      }}
    >
      <Icon size={s(22)} color={color} strokeWidth={1.8} />
      <span style={{ fontFamily: FONT_HEADING, fontSize: s(20), fontWeight: 600, color: LIGHT_TEXT }}>
        {label}
      </span>
    </div>
  );
};

/* ─── Screenshot Frame (optional cropTop to hide navigation bar) ─── */
export const ScreenshotFrame: React.FC<{
  src: string;
  delay?: number;
  borderRadius?: number;
  cropTop?: number; // percentage of image height to crop from top (e.g. 13)
}> = ({ src, delay = 0, borderRadius = 20, cropTop = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, height: vh } = useVideoConfig();
  const s = useScale();
  const slideUp = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 60 } });
  // Scale down screenshots in shorter viewports so the full image is visible
  // 9:16 → 1.0 | 4:5 → 0.79 | 1:1 → 0.55
  const vRatio = vh / 1920;
  const imgScale = Math.min(1, vRatio >= 0.7
    ? 0.3 + 0.7 * vRatio     // 4:5  slightly smaller
    : 0.1 + 0.8 * vRatio     // 1:1  compact — show full screenshot
  );

  return (
    <div
      style={{
        borderRadius: s(borderRadius),
        overflow: "hidden",
        border: "1px solid rgba(255,209,102,0.2)",
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${GOLD}06`,
        transform: `translateY(${interpolate(slideUp, [0, 1], [s(150), 0])}px) scale(${imgScale})`,
        transformOrigin: "top center",
        opacity: slideUp,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          marginTop: cropTop ? `${-cropTop}%` : undefined,
        }}
      />
    </div>
  );
};

/* ─── Phone Mockup (optional cropTop to hide navigation bar) ─── */
export const PhoneMockup: React.FC<{
  src: string;
  delay?: number;
  width?: number;
  cropTop?: number; // percentage of image height to crop from top
}> = ({ src, delay = 0, width = 420, cropTop = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, height: vh } = useVideoConfig();
  const s = useScale();
  const slideUp = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 60 } });
  // No extra imgScale for phones — useScale() already sizes them down.
  // This avoids double-shrinking on shorter viewports.

  return (
    <div
      style={{
        width: s(width),
        borderRadius: s(28),
        overflow: "hidden",
        border: "2px solid rgba(255,209,102,0.12)",
        boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 30px ${GOLD}06`,
        transform: `translateY(${interpolate(slideUp, [0, 1], [s(200), 0])}px)`,
        transformOrigin: "top center",
        opacity: slideUp,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          marginTop: cropTop ? `${-cropTop}%` : undefined,
        }}
      />
    </div>
  );
};

/* ─── Stat Card ─── */
export const StatCard: React.FC<{
  value: string;
  label: string;
  delay?: number;
  Icon?: LucideIcon;
}> = ({ value, label, delay = 0, Icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: s(18),
        padding: `${s(28)}px ${s(22)}px`,
        textAlign: "center",
        border: `1px solid rgba(255,209,102,0.08)`,
        transform: `scale(${enter})`,
        opacity: enter,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
        flex: 1,
      }}
    >
      {Icon && (
        <div style={{ marginBottom: s(10) }}>
          <Icon size={s(24)} color={GOLD} strokeWidth={1.8} />
        </div>
      )}
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: s(46),
          fontWeight: 700,
          color: GOLD,
          marginBottom: s(6),
          filter: `drop-shadow(0 0 10px ${GOLD}18)`,
        }}
      >
        {value}
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: s(15), color: SUBTLE_TEXT }}>{label}</div>
    </div>
  );
};

/* ─── Badge (pill) ─── */
export const Badge: React.FC<{
  text: string;
  color?: string;
  delay?: number;
  Icon?: LucideIcon;
}> = ({ text, color = SUCCESS, delay = 0, Icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: `${color}15`,
        border: `1px solid ${color}30`,
        borderRadius: 50,
        padding: `${s(12)}px ${s(26)}px`,
        display: "inline-flex",
        alignItems: "center",
        gap: s(10),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [s(12), 0])}px)`,
      }}
    >
      {Icon && <Icon size={s(18)} color={color} strokeWidth={2.2} />}
      <span style={{ fontFamily: FONT_HEADING, fontSize: s(20), fontWeight: 600, color }}>{text}</span>
    </div>
  );
};

/* ─── Bullet List (green dots) ─── */
export const BulletList: React.FC<{
  items: string[];
  startDelay?: number;
  gap?: number;
}> = ({ items, startDelay = 30, gap: gapProp = 8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: s(gapProp) }}>
      {items.map((text, i) => {
        const enter = spring({ frame: frame - startDelay - i * 8, fps, config: { damping: 12 } });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: s(14),
              opacity: enter,
              transform: `translateX(${interpolate(enter, [0, 1], [s(40), 0])}px)`,
            }}
          >
            <div
              style={{
                width: s(10),
                height: s(10),
                borderRadius: "50%",
                backgroundColor: SUCCESS,
                flexShrink: 0,
                boxShadow: `0 0 ${s(8)}px ${SUCCESS}40`,
              }}
            />
            <span style={{ fontFamily: FONT_BODY, fontSize: s(22), color: LIGHT_TEXT }}>{text}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Numbered Step Card ─── */
export const StepCard: React.FC<{
  num: string;
  title: string;
  desc: string;
  delay?: number;
  isLast?: boolean;
}> = ({ num, title, desc, delay = 0, isLast = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } });
  const numberScale = spring({ frame: frame - delay - 5, fps, config: { damping: 8, stiffness: 120 } });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: s(26),
        backgroundColor: DARK_CARD,
        borderRadius: s(22),
        padding: `${s(32)}px ${s(28)}px`,
        border: `1px solid rgba(255,209,102,${isLast ? 0.2 : 0.1})`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [s(60), 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          width: s(72),
          height: s(72),
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
          style={{ fontFamily: FONT_HEADING, fontSize: s(26), fontWeight: 800, color: isLast ? DARK_BG : GOLD }}
        >
          {num}
        </span>
      </div>
      <div>
        <h3 style={{ fontFamily: FONT_HEADING, fontSize: s(28), fontWeight: 700, color: LIGHT_TEXT, margin: `0 0 ${s(6)}px` }}>
          {title}
        </h3>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: s(18),
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

/* ─── Connecting Line ─── */
export const ConnectingLine: React.FC<{
  x?: number;
  y?: number;
  height?: number;
  startFrame?: number;
  endFrame?: number;
}> = ({ x = 88, y = 370, height = 380, startFrame = 20, endFrame = 90 }) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const lineHeight = interpolate(frame, [startFrame, endFrame], [0, s(height)], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        right: s(x),
        top: s(y),
        width: 2,
        height: lineHeight,
        background: `linear-gradient(180deg, ${GOLD}40, ${GOLD}10)`,
      }}
    />
  );
};

/* ─── CTA Scene (Logo + headline + button + badge) ─── */
export const CTAScene: React.FC<{
  headline: React.ReactNode;
  buttonText?: string;
  badgeText?: string;
  subText?: string;
}> = ({
  headline,
  buttonText = "פרסם את האולפן שלך עכשיו",
  badgeText = "התחל בחינם — ₪0/חודש",
  subText = "ללא כרטיס אשראי · ללא התחייבות",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const scaleIn = spring({ frame, fps, config: { damping: 12 } });
  const buttonPulse = interpolate(frame % 50, [0, 25, 50], [1, 1.04, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="50%" size={s(600)} opacity={0.08} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: `${s(60)}px ${s(48)}px`,
          position: "relative",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${scaleIn})` }}
        >
          <Img src={staticFile("logo.png")} style={{ width: s(90), height: s(90), borderRadius: s(20), marginBottom: s(30) }} />
          <h2
            style={{
              fontFamily: FONT_HEADING,
              fontSize: s(48),
              fontWeight: 700,
              color: LIGHT_TEXT,
              textAlign: "center",
              margin: `0 0 ${s(10)}px 0`,
              lineHeight: 1.3,
            }}
          >
            {headline}
          </h2>
          <div
            style={{
              backgroundColor: `${SUCCESS}15`,
              border: `1px solid ${SUCCESS}30`,
              borderRadius: 50,
              padding: `${s(10)}px ${s(30)}px`,
              margin: `${s(20)}px 0`,
              opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <span style={{ fontFamily: FONT_HEADING, fontSize: s(22), fontWeight: 600, color: SUCCESS }}>
              {badgeText}
            </span>
          </div>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: s(22),
              color: SUBTLE_TEXT,
              textAlign: "center",
              margin: `0 0 ${s(35)}px 0`,
              lineHeight: 1.6,
              opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            {subText}
          </p>
          <div
            style={{
              backgroundColor: GOLD,
              paddingLeft: s(50),
              paddingRight: s(50),
              paddingTop: s(22),
              paddingBottom: s(22),
              borderRadius: s(16),
              transform: `scale(${buttonPulse})`,
              opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
              boxShadow: `0 0 50px ${GOLD}25`,
            }}
          >
            <span style={{ fontFamily: FONT_HEADING, fontSize: s(26), fontWeight: 700, color: DARK_BG }}>
              {buttonText}
            </span>
          </div>
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: s(18),
              color: SUBTLE_TEXT,
              marginTop: s(25),
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

/* ─── Screenshot + CTA Scene ─── */
export const ScreenshotCTAScene: React.FC<{
  screenshotSrc: string;
  headline: React.ReactNode;
  buttonText?: string;
  screenshotCropTop?: number; // percentage to crop from top
}> = ({ screenshotSrc, headline, buttonText = "פרסם את האולפן שלך", screenshotCropTop = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, height: vh } = useVideoConfig();
  const s = useScale();
  const slideUp = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 60 } });
  const vRatio = vh / 1920;
  const imgScale = Math.min(1, vRatio >= 0.7
    ? 0.3 + 0.7 * vRatio
    : 0.1 + 0.8 * vRatio
  );

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <div
        style={{
          position: "absolute",
          top: s(80),
          left: s(30),
          right: s(30),
          transform: `translateY(${interpolate(slideUp, [0, 1], [s(150), 0])}px) scale(${imgScale})`,
          transformOrigin: "top center",
          opacity: slideUp,
        }}
      >
        <div
          style={{
            borderRadius: s(24),
            overflow: "hidden",
            border: "1px solid rgba(255,209,102,0.2)",
            boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${GOLD}06`,
          }}
        >
          <Img
            src={staticFile(screenshotSrc)}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              marginTop: screenshotCropTop ? `${-screenshotCropTop}%` : undefined,
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: `${s(100)}px ${s(50)}px ${s(120)}px`,
          background: `linear-gradient(0deg, ${DARK_BG} 50%, transparent 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(44),
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: `0 0 ${s(25)}px`,
            opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {headline}
        </h2>
        <div style={{ opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" }) }}>
          <GoldButton text={buttonText} delay={0} size="md" />
        </div>
        <div style={{ marginTop: s(20) }}>
          <Footer delay={35} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
