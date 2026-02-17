/**
 * Ad34 — Instant Setup V2
 * Quick 5-minute setup process with vertical timeline
 * 240 frames / 8s @ 30fps · 1080×1920
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
  UserPlus,
  Settings,
  Palette,
  Rocket,
  Clock,
} from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  RTL,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  Footer,
  Headline,
  GoldText,
  GoldButton,
  Badge,
  SceneWrapper,
} from "./shared";

/* ─── Timeline Step ─── */
const TimelineStep: React.FC<{
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  number: number;
  title: string;
  subtitle: string;
  delay: number;
  isLast?: boolean;
  accentColor?: string;
}> = ({ Icon, number, title, subtitle, delay, isLast, accentColor = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });
  const iconPop = spring({ frame: frame - delay - 5, fps, config: SPRING_BOUNCY });
  const lineGrow = spring({ frame: frame - delay + 10, fps, config: SPRING_GENTLE });

  return (
    <div style={{ display: "flex", gap: 20, position: "relative" }}>
      {/* Timeline column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 56,
          flexShrink: 0,
        }}
      >
        {/* Number circle */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 30px ${accentColor}30, 0 4px 16px rgba(0,0,0,0.3)`,
            transform: `scale(${iconPop})`,
            opacity: enter,
          }}
        >
          <span
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 22,
              fontWeight: 700,
              color: DARK_BG,
            }}
          >
            {number}
          </span>
        </div>

        {/* Connecting line */}
        {!isLast && (
          <div
            style={{
              width: 3,
              flex: 1,
              minHeight: 40,
              background: `linear-gradient(180deg, ${accentColor}60, ${accentColor}15)`,
              borderRadius: 2,
              transform: `scaleY(${lineGrow})`,
              transformOrigin: "top",
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          paddingBottom: isLast ? 0 : 28,
          opacity: enter,
          transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 16,
            padding: "20px 22px",
            border: `1px solid ${accentColor}12`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 16,
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
                fontSize: 21,
                fontWeight: 700,
                color: LIGHT_TEXT,
                marginBottom: 3,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: 15,
                color: SUBTLE_TEXT,
              }}
            >
              {subtitle}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Scene ─── */
const MainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { Icon: UserPlus, title: "צור חשבון", subtitle: "רישום חינמי", color: GOLD },
    { Icon: Settings, title: "הגדר שירותים", subtitle: "מחירים וזמנים", color: GOLD },
    { Icon: Palette, title: "עצב את העמוד", subtitle: "לוגו וצבעים", color: GOLD },
    { Icon: Rocket, title: "התחל לקבל הזמנות", subtitle: "אתה באוויר!", color: SUCCESS },
  ];

  // Step 4 glow
  const step4Glow = spring({ frame: frame - 130, fps, config: SPRING_GENTLE });

  return (
    <SceneWrapper glowX="30%" glowY="55%" glowColor={GOLD}>
      {/* Headline */}
      <div style={{ marginBottom: 40 }}>
        <Headline delay={0} size={56} align="right">
          {"מוכן בחמש דקות."}
          {"\n"}
          <GoldText>{"ממש."}</GoldText>
        </Headline>
      </div>

      {/* Timeline */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {steps.map((step, i) => (
          <TimelineStep
            key={i}
            Icon={step.Icon}
            number={i + 1}
            title={step.title}
            subtitle={step.subtitle}
            delay={30 + i * 25}
            isLast={i === steps.length - 1}
            accentColor={step.color}
          />
        ))}

        {/* Success glow on last step */}
        <div
          style={{
            position: "absolute",
            right: 60,
            bottom: 420,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${SUCCESS} 0%, transparent 70%)`,
            opacity: step4Glow * 0.08,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Timer Badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 16,
        }}
      >
        <Badge
          text="5:00 דקות ממוצע"
          color={GOLD}
          delay={140}
          Icon={Clock}
        />
      </div>

      {/* CTA */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <GoldButton text="התחל עכשיו" delay={160} />
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
export const Ad34_InstantSetup_V2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={240}>
        <MainScene />
      </Sequence>
    </AbsoluteFill>
  );
};
