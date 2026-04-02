/**
 * Shared Design System for Studioz B2B Ads V6
 * V6: Premium motion design — safe zone aware, device frames,
 *     depth layers, parallax, glass morphism, smooth professional motion.
 *     All important content inside center 1080×1080 safe zone.
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
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadHeebo } from "@remotion/google-fonts/Heebo";

/* ─── Font Loading ─── */
const inter = loadInter("normal", {
  weights: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const heebo = loadHeebo("normal", {
  weights: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["hebrew"],
});

export const FONT = `${inter.fontFamily}, ${heebo.fontFamily}, -apple-system, sans-serif`;

/* ─── Color Palette (Apple/Stripe-inspired) ─── */
export const COLORS = {
  bg: "#050507",
  bgSubtle: "#0c0c10",
  card: "#111116",
  cardBorder: "rgba(255,255,255,0.06)",
  cardHover: "#18181f",
  text: "#f5f5f7",
  textSecondary: "#86868b",
  textMuted: "#6e6e73",
  accent: "#ffd166",
  accentGlow: "rgba(255,209,102,0.15)",
  blue: "#2997ff",
  green: "#30d158",
  red: "#ff453a",
  purple: "#bf5af2",
  gradient1: "#1a1a2e",
  gradient2: "#16213e",
} as const;

export const RTL: React.CSSProperties = { direction: "rtl" };

/* ─── Safe Zone Constants ─── */
const CANVAS_W = 1080;
const CANVAS_H = 1920;
const SAFE_H = 1080;
const SAFE_TOP = (CANVAS_H - SAFE_H) / 2; // 420px

/* ─── Responsive Scaling ─── */
export const useScale = (): ((px: number) => number) => {
  const { height } = useVideoConfig();
  const ratio = height / CANVAS_H;
  const scale = Math.min(1, ratio >= 0.7 ? 0.4 + 0.6 * ratio : 0.2 + 0.8 * ratio);
  return (px: number) => Math.round(px * scale);
};

/* ─── Spring Presets ─── */
export const SPRING = {
  smooth: { damping: 18, stiffness: 80 },
  snappy: { damping: 14, stiffness: 140, mass: 0.8 },
  gentle: { damping: 24, stiffness: 60 },
  bouncy: { damping: 10, stiffness: 80, mass: 1.1 },
  slow: { damping: 30, stiffness: 40 },
} as const;

/* ─── Lucide Icon Type ─── */
export type LucideIcon = React.FC<{ size?: number; color?: string; strokeWidth?: number }>;

/* ──────────────────────────────────────────────────────────────── */
/*  BACKGROUND LAYERS                                               */
/* ──────────────────────────────────────────────────────────────── */

export const PremiumBackground: React.FC<{
  variant?: "default" | "warm" | "cool" | "emerald";
}> = ({ variant = "default" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const drift = Math.sin(frame * 0.008) * 20;

  const gradients: Record<string, [string, string, string]> = {
    default: [COLORS.accent, COLORS.blue, COLORS.purple],
    warm: [COLORS.accent, "#ff6b35", COLORS.red],
    cool: [COLORS.blue, COLORS.purple, "#5856d6"],
    emerald: [COLORS.green, "#34d399", COLORS.blue],
  };
  const [c1, c2, c3] = gradients[variant];

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Mesh gradient orbs */}
      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "15%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c1}12 0%, transparent 70%)`,
          filter: "blur(80px)",
          transform: `translate(${drift}px, ${drift * 0.6}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "10%",
          top: "45%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c2}10 0%, transparent 70%)`,
          filter: "blur(100px)",
          transform: `translate(${-drift * 0.7}px, ${drift * 0.4}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "40%",
          bottom: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c3}08 0%, transparent 70%)`,
          filter: "blur(120px)",
          transform: `translate(${drift * 0.5}px, ${-drift * 0.3}px)`,
        }}
      />
      {/* Noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  SAFE ZONE WRAPPER                                               */
/* ──────────────────────────────────────────────────────────────── */

export const SafeZone: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  padding?: number;
}> = ({ children, style, padding = 60 }) => {
  const s = useScale();
  const { height } = useVideoConfig();
  const safeTop = (height - Math.min(height, s(SAFE_H))) / 2;

  return (
    <div
      style={{
        position: "absolute",
        top: safeTop,
        left: 0,
        right: 0,
        height: Math.min(height, s(SAFE_H)),
        display: "flex",
        flexDirection: "column",
        padding: `${s(padding)}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  TYPOGRAPHY                                                      */
/* ──────────────────────────────────────────────────────────────── */

export const Headline: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  align?: "center" | "right";
}> = ({ children, delay = 0, size = 64, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING.smooth });

  return (
    <h1
      style={{
        fontFamily: FONT,
        fontSize: s(size),
        fontWeight: 800,
        color: COLORS.text,
        margin: 0,
        textAlign: align,
        lineHeight: 1.15,
        letterSpacing: "-0.02em",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [s(40), 0])}px)`,
      }}
    >
      {children}
    </h1>
  );
};

export const Subheadline: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  align?: "center" | "right";
}> = ({ children, delay = 5, size = 28, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING.gentle });

  return (
    <p
      style={{
        fontFamily: FONT,
        fontSize: s(size),
        fontWeight: 400,
        color: COLORS.textSecondary,
        margin: 0,
        textAlign: align,
        lineHeight: 1.5,
        letterSpacing: "-0.01em",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [s(25), 0])}px)`,
      }}
    >
      {children}
    </p>
  );
};

export const AccentText: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = COLORS.accent,
}) => (
  <span
    style={{
      color,
      filter: `drop-shadow(0 0 20px ${color}25)`,
    }}
  >
    {children}
  </span>
);

export const Label: React.FC<{
  text: string;
  delay?: number;
  color?: string;
}> = ({ text, delay = 0, color = COLORS.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING.snappy });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s(8),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [-s(10), 0])}px)`,
      }}
    >
      <div
        style={{
          width: s(6),
          height: s(6),
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 ${s(10)}px ${color}60`,
        }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontSize: s(13),
          color: COLORS.textMuted,
          fontWeight: 600,
          letterSpacing: `${s(3)}px`,
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  DEVICE FRAMES                                                   */
/* ──────────────────────────────────────────────────────────────── */

export const PhoneFrame: React.FC<{
  src: string;
  delay?: number;
  width?: number;
  parallaxStrength?: number;
  shadow?: boolean;
}> = ({ src, delay = 0, width = 380, parallaxStrength = 0.3, shadow = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING.smooth });
  const parallax = Math.sin(frame * 0.015) * parallaxStrength * s(8);
  const bezel = s(12);
  const radius = s(40);

  return (
    <div
      style={{
        width: s(width),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [s(120), 0]) + parallax}px) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
        transformOrigin: "center center",
      }}
    >
      {/* Shadow layer */}
      {shadow && (
        <div
          style={{
            position: "absolute",
            inset: s(10),
            borderRadius: radius,
            background: "rgba(0,0,0,0.5)",
            filter: `blur(${s(40)}px)`,
            transform: `translateY(${s(20)}px)`,
          }}
        />
      )}
      {/* Phone body */}
      <div
        style={{
          position: "relative",
          borderRadius: radius,
          padding: bezel,
          background: "linear-gradient(145deg, #2a2a2e, #1a1a1e)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: `
            0 ${s(2)}px ${s(4)}px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `,
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: bezel,
            left: "50%",
            transform: "translateX(-50%)",
            width: s(120),
            height: s(28),
            borderRadius: `0 0 ${s(16)}px ${s(16)}px`,
            background: "#1a1a1e",
            zIndex: 10,
          }}
        />
        {/* Screen */}
        <div
          style={{
            borderRadius: radius - bezel,
            overflow: "hidden",
            background: "#000",
          }}
        >
          <Img
            src={staticFile(src)}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  GLASS CARD                                                      */
/* ──────────────────────────────────────────────────────────────── */

export const GlassCard: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: "left" | "right" | "up";
  style?: React.CSSProperties;
}> = ({ children, delay = 0, direction = "up", style: extraStyle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING.smooth });

  const offsets = {
    left: { x: s(-50), y: 0 },
    right: { x: s(50), y: 0 },
    up: { x: 0, y: s(40) },
  };
  const offset = offsets[direction];

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: s(20),
        border: "1px solid rgba(255,255,255,0.08)",
        padding: `${s(24)}px`,
        opacity: enter,
        transform: `translate(${interpolate(enter, [0, 1], [offset.x, 0])}px, ${interpolate(enter, [0, 1], [offset.y, 0])}px)`,
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  FEATURE PILL                                                    */
/* ──────────────────────────────────────────────────────────────── */

export const FeaturePill: React.FC<{
  Icon: LucideIcon;
  text: string;
  delay?: number;
  color?: string;
}> = ({ Icon, text, delay = 0, color = COLORS.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING.snappy });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: s(12),
        background: `${color}08`,
        border: `1px solid ${color}18`,
        borderRadius: s(50),
        padding: `${s(14)}px ${s(24)}px`,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [s(20), 0])}px) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
      }}
    >
      <Icon size={s(20)} color={color} strokeWidth={1.8} />
      <span style={{ fontFamily: FONT, fontSize: s(19), fontWeight: 600, color: COLORS.text }}>
        {text}
      </span>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  FEATURE ROW (icon + title + desc)                               */
/* ──────────────────────────────────────────────────────────────── */

export const FeatureRow: React.FC<{
  Icon: LucideIcon;
  title: string;
  desc?: string;
  delay?: number;
  color?: string;
}> = ({ Icon, title, desc, delay = 0, color = COLORS.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING.smooth });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: s(18),
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [s(40), 0])}px)`,
      }}
    >
      <div
        style={{
          width: s(52),
          height: s(52),
          borderRadius: s(14),
          background: `${color}10`,
          border: `1px solid ${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={s(24)} color={color} strokeWidth={1.6} />
      </div>
      <div>
        <div style={{ fontFamily: FONT, fontSize: s(22), fontWeight: 700, color: COLORS.text }}>
          {title}
        </div>
        {desc && (
          <div style={{ fontFamily: FONT, fontSize: s(16), color: COLORS.textSecondary, marginTop: s(2) }}>
            {desc}
          </div>
        )}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  PAIN POINT CARD                                                 */
/* ──────────────────────────────────────────────────────────────── */

export const PainPoint: React.FC<{
  Icon: LucideIcon;
  text: string;
  delay?: number;
  strikeFrame?: number;
}> = ({ Icon, text, delay = 0, strikeFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING.snappy });
  const strike = strikeFrame
    ? interpolate(frame, [strikeFrame, strikeFrame + 15], [0, 100], {
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
        background: `${COLORS.red}06`,
        border: `1px solid ${COLORS.red}12`,
        borderRadius: s(16),
        padding: `${s(20)}px ${s(22)}px`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [s(50), 0])}px)`,
      }}
    >
      <div
        style={{
          width: s(44),
          height: s(44),
          borderRadius: s(12),
          background: `${COLORS.red}10`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={s(22)} color={COLORS.red} strokeWidth={1.6} />
      </div>
      <div style={{ position: "relative" }}>
        <span style={{ fontFamily: FONT, fontSize: s(22), color: COLORS.textSecondary }}>{text}</span>
        {strikeFrame != null && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              width: `${strike}%`,
              height: s(2.5),
              backgroundColor: COLORS.red,
              borderRadius: 2,
            }}
          />
        )}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  STAT DISPLAY                                                    */
/* ──────────────────────────────────────────────────────────────── */

export const StatDisplay: React.FC<{
  value: string;
  label: string;
  delay?: number;
  color?: string;
}> = ({ value, label, delay = 0, color = COLORS.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING.bouncy });

  return (
    <div
      style={{
        textAlign: "center",
        opacity: enter,
        transform: `scale(${enter})`,
        flex: 1,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: s(48),
          fontWeight: 800,
          color,
          letterSpacing: "-0.02em",
          filter: `drop-shadow(0 0 15px ${color}20)`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: s(15),
          color: COLORS.textMuted,
          marginTop: s(4),
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  CTA BUTTON                                                      */
/* ──────────────────────────────────────────────────────────────── */

export const CTAButton: React.FC<{
  text: string;
  delay?: number;
  color?: string;
}> = ({ text, delay = 0, color = COLORS.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING.smooth });
  const pulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [1, 1.03]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s(10),
        background: color,
        borderRadius: s(16),
        padding: `${s(20)}px ${s(48)}px`,
        boxShadow: `0 0 ${s(40)}px ${color}20, 0 ${s(8)}px ${s(24)}px rgba(0,0,0,0.3)`,
        opacity: enter,
        transform: `scale(${enter * pulse})`,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: s(24),
          fontWeight: 700,
          color: COLORS.bg,
          letterSpacing: "-0.01em",
        }}
      >
        {text}
      </span>
      <span style={{ fontSize: s(20), color: COLORS.bg }}>←</span>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  BADGE                                                           */
/* ──────────────────────────────────────────────────────────────── */

export const Badge: React.FC<{
  text: string;
  color?: string;
  delay?: number;
  Icon?: LucideIcon;
}> = ({ text, color = COLORS.green, delay = 0, Icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING.snappy });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s(8),
        background: `${color}12`,
        border: `1px solid ${color}25`,
        borderRadius: s(50),
        padding: `${s(10)}px ${s(22)}px`,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [s(10), 0])}px)`,
      }}
    >
      {Icon && <Icon size={s(16)} color={color} strokeWidth={2} />}
      <span style={{ fontFamily: FONT, fontSize: s(18), fontWeight: 600, color }}>{text}</span>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  FOOTER / BRANDING                                               */
/* ──────────────────────────────────────────────────────────────── */

export const Footer: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING.gentle });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: s(10), opacity: enter * 0.7 }}>
      <Img
        src={staticFile("logo.png")}
        style={{ width: s(28), height: s(28), borderRadius: s(7) }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontSize: s(14),
          color: COLORS.textMuted,
          fontWeight: 500,
          letterSpacing: "0.3px",
        }}
      >
        studioz.co.il
      </span>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  CTA SCENE (reusable final scene)                                */
/* ──────────────────────────────────────────────────────────────── */

export const CTAScene: React.FC<{
  headline: React.ReactNode;
  buttonText?: string;
  badgeText?: string;
  subText?: string;
  variant?: "default" | "warm" | "cool" | "emerald";
}> = ({
  headline,
  buttonText = "פרסם את האולפן שלך עכשיו",
  badgeText = "חינם לתמיד — כל התכונות כלולות",
  subText = "ללא כרטיס אשראי · ללא התחייבות",
  variant = "default",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame, fps, config: SPRING.smooth });

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant={variant} />
      <SafeZone style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: s(20),
            transform: `scale(${enter})`,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{
              width: s(80),
              height: s(80),
              borderRadius: s(18),
              boxShadow: `0 ${s(8)}px ${s(30)}px rgba(0,0,0,0.4)`,
            }}
          />
          <h2
            style={{
              fontFamily: FONT,
              fontSize: s(48),
              fontWeight: 800,
              color: COLORS.text,
              textAlign: "center",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {headline}
          </h2>
          <Badge text={badgeText} color={COLORS.green} delay={15} />
          <Subheadline delay={20} size={20}>{subText}</Subheadline>
          <div style={{ marginTop: s(10) }}>
            <CTAButton text={buttonText} delay={25} />
          </div>
          <div style={{ marginTop: s(15) }}>
            <Footer delay={35} />
          </div>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  DIVIDER LINE                                                    */
/* ──────────────────────────────────────────────────────────────── */

export const GoldLine: React.FC<{ delay?: number; width?: number }> = ({
  delay = 0,
  width = 100,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const expand = spring({ frame: frame - delay, fps, config: SPRING.gentle });

  return (
    <div
      style={{
        width: interpolate(expand, [0, 1], [0, s(width)]),
        height: s(2),
        background: `linear-gradient(90deg, transparent, ${COLORS.accent}80, transparent)`,
        borderRadius: 2,
      }}
    />
  );
};
