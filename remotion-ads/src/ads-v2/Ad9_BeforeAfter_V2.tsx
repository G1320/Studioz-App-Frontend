/**
 * Ad9 — Before/After V2
 * Dramatic comparison: chaos before vs. order after Studioz
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  X,
  Check,
  ArrowDown,
  CalendarX,
  Phone,
  FileX,
  Ban,
  CalendarDays,
  LayoutDashboard,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RED,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  Footer,
  Headline,
  GoldText,
  SceneWrapper,
} from "./shared";

/* ─── Before Item ─── */
const BeforeItem: React.FC<{
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  text: string;
  delay: number;
}> = ({ Icon, text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SNAPPY });
  const shake = interpolate(
    Math.sin(frame * 0.15 + delay),
    [-1, 1],
    [-1.5, 1.5]
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [60, 0]) + shake}px)`,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          backgroundColor: `${RED}18`,
          border: `1px solid ${RED}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={RED} strokeWidth={1.8} />
      </div>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 20,
          color: SUBTLE_TEXT,
          fontWeight: 500,
        }}
      >
        {text}
      </span>
      <div style={{ marginRight: "auto" }}>
        <X size={18} color={RED} strokeWidth={2.5} />
      </div>
    </div>
  );
};

/* ─── After Item ─── */
const AfterItem: React.FC<{
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  text: string;
  delay: number;
}> = ({ Icon, text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [-60, 0])}px)`,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          backgroundColor: `${SUCCESS}18`,
          border: `1px solid ${SUCCESS}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={SUCCESS} strokeWidth={1.8} />
      </div>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 20,
          color: LIGHT_TEXT,
          fontWeight: 500,
        }}
      >
        {text}
      </span>
      <div style={{ marginRight: "auto" }}>
        <Check size={18} color={SUCCESS} strokeWidth={2.5} />
      </div>
    </div>
  );
};

/* ─── Arrow Divider ─── */
const ArrowDivider: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });
  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.92, 1.08]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px 0",
        opacity: enter,
        transform: `scale(${enter * pulse})`,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${GOLD}, #e6b84d)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 40px ${GOLD}30, 0 8px 24px rgba(0,0,0,0.3)`,
        }}
      >
        <ArrowDown size={28} color={DARK_BG} strokeWidth={2.5} />
      </div>
    </div>
  );
};

/* ─── Main Scene ─── */
const MainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beforeItems = [
    { Icon: CalendarX, text: "יומנים מפוזרים" },
    { Icon: Phone, text: "שיחות טלפון אינסופיות" },
    { Icon: FileX, text: "חשבוניות ידניות" },
    { Icon: Ban, text: "הפסדים מביטולים" },
  ];

  const afterItems = [
    { Icon: CalendarDays, text: "הזמנות אוטומטיות" },
    { Icon: LayoutDashboard, text: "דשבורד חכם" },
    { Icon: CreditCard, text: "סליקה מובנית" },
    { Icon: ShieldCheck, text: "הגנה מביטולים" },
  ];

  const headlineEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <SceneWrapper glowX="50%" glowY="45%" glowColor={GOLD}>
      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Headline delay={0} size={56} align="center">
          {"לפני ואחרי"}
          {"\n"}
          <GoldText>סטודיוז</GoldText>
        </Headline>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
        {/* BEFORE Section */}
        <div
          style={{
            backgroundColor: `${RED}08`,
            border: `1px solid ${RED}15`,
            borderRadius: 20,
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 26,
              fontWeight: 700,
              color: RED,
              marginBottom: 18,
              textAlign: "center",
              opacity: spring({ frame: frame - 15, fps, config: SPRING_SMOOTH }),
            }}
          >
            {"לפני"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {beforeItems.map((item, i) => (
              <BeforeItem
                key={i}
                Icon={item.Icon}
                text={item.text}
                delay={20 + i * 12}
              />
            ))}
          </div>
        </div>

        {/* Arrow Divider */}
        <ArrowDivider delay={70} />

        {/* AFTER Section */}
        <div
          style={{
            backgroundColor: `${SUCCESS}08`,
            border: `1px solid ${SUCCESS}15`,
            borderRadius: 20,
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 26,
              fontWeight: 700,
              color: SUCCESS,
              marginBottom: 18,
              textAlign: "center",
              opacity: spring({ frame: frame - 90, fps, config: SPRING_SMOOTH }),
            }}
          >
            {"אחרי"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {afterItems.map((item, i) => (
              <AfterItem
                key={i}
                Icon={item.Icon}
                text={item.text}
                delay={100 + i * 12}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Gold Line */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <GoldLine width={200} delay={160} />
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 42,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Footer delay={170} />
      </div>
    </SceneWrapper>
  );
};

/* ─── Main Composition ─── */
export const Ad9_BeforeAfter_V2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={240}>
        <MainScene />
      </Sequence>
    </AbsoluteFill>
  );
};
