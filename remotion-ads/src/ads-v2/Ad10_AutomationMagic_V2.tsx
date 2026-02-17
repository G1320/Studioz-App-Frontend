/**
 * Ad10 — Automation Magic V2
 * Vertical timeline automation workflow chain
 * 250 frames / ~8.3s @ 30fps
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
  CalendarDays,
  Bell,
  CreditCard,
  FileText,
  CheckCircle2,
  Zap,
} from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
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
  Badge,
  SceneWrapper,
} from "./shared";

/* ─── Timeline Step ─── */
const TimelineStep: React.FC<{
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  delay: number;
  isLast?: boolean;
  accentColor?: string;
}> = ({ Icon, label, delay, isLast = false, accentColor = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SNAPPY });
  const iconPulse = interpolate(
    Math.sin(frame * 0.06 + delay * 0.5),
    [-1, 1],
    [0.95, 1.05]
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)`,
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: `${accentColor}12`,
          border: `1.5px solid ${accentColor}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transform: `scale(${iconPulse})`,
          boxShadow: `0 0 20px ${accentColor}15`,
        }}
      >
        <Icon size={26} color={accentColor} strokeWidth={1.8} />
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 24,
          fontWeight: 600,
          color: LIGHT_TEXT,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ─── Growing Connector Line ─── */
const ConnectorLine: React.FC<{ fromDelay: number; toDelay: number }> = ({
  fromDelay,
  toDelay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({
    frame: frame - fromDelay - 8,
    fps,
    config: SPRING_GENTLE,
  });

  return (
    <div
      style={{
        width: 3,
        height: interpolate(grow, [0, 1], [0, 48]),
        marginRight: 27,
        background: `linear-gradient(180deg, ${GOLD}60, ${GOLD}20)`,
        borderRadius: 2,
        alignSelf: "flex-start",
      }}
    />
  );
};

/* ─── Main Scene ─── */
const MainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { Icon: CalendarDays, label: "הזמנה נכנסת", delay: 30 },
    { Icon: Bell, label: "התראה נשלחת", delay: 50 },
    { Icon: CreditCard, label: "תשלום מתבצע", delay: 70 },
    { Icon: FileText, label: "חשבונית יוצאת", delay: 90 },
    { Icon: CheckCircle2, label: "הכל סגור", delay: 110 },
  ];

  return (
    <SceneWrapper glowX="40%" glowY="50%" glowColor={GOLD}>
      {/* Headline */}
      <div style={{ marginBottom: 40 }}>
        <Headline delay={0} size={58} align="right">
          {"הכל אוטומטי."}
          {"\n"}
          <GoldText>{"הכל עובד."}</GoldText>
        </Headline>
      </div>

      {/* Timeline */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <TimelineStep
              Icon={step.Icon}
              label={step.label}
              delay={step.delay}
              isLast={i === steps.length - 1}
              accentColor={i === steps.length - 1 ? SUCCESS : GOLD}
            />
            {i < steps.length - 1 && (
              <div style={{ display: "flex", paddingRight: 0 }}>
                <ConnectorLine
                  fromDelay={step.delay}
                  toDelay={steps[i + 1].delay}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 32,
          marginBottom: 20,
        }}
      >
        <Badge text="אפס עבודה ידנית" color={SUCCESS} delay={140} Icon={Zap} />
      </div>

      {/* Gold Line */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <GoldLine width={180} delay={155} />
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
        <Footer delay={160} />
      </div>
    </SceneWrapper>
  );
};

/* ─── Main Composition ─── */
export const Ad10_AutomationMagic_V2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={250}>
        <MainScene />
      </Sequence>
    </AbsoluteFill>
  );
};
