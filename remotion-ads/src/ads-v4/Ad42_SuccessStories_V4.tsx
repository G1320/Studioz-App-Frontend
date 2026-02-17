/**
 * Ad42_SuccessStories_V4
 * Theme: Benefits of using Studioz — NO fabricated success stories or metrics
 * Duration: 240 frames (8s) at 30fps, 1080x1920
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  Clock,
  CreditCard,
  Globe,
  Zap,
  CheckCircle,
  Shield,
  FileText,
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
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  FeatureCard,
  ScreenshotCTAScene,
  type LucideIcon,
} from "./shared";

/* ─── Benefit Card ─── */
const BenefitCard: React.FC<{
  Icon: LucideIcon;
  title: string;
  delay: number;
}> = ({ Icon, title, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 90 } });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: "22px 24px",
        border: `1px solid ${SUCCESS}12`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          backgroundColor: `${SUCCESS}12`,
          border: `1px solid ${SUCCESS}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={24} color={SUCCESS} strokeWidth={1.8} />
      </div>
      <span style={{ fontFamily: FONT_BODY, fontSize: 24, fontWeight: 600, color: LIGHT_TEXT }}>
        {title}
      </span>
    </div>
  );
};

/* ─── Scene 1: Why Studioz ─── */
const SceneBenefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 44px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <SectionLabel text="WHY STUDIOZ" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 40,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
            lineHeight: 1.3,
          }}
        >
          {"למה בעלי אולפנים בוחרים "}
          <GoldText>{"Studioz?"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <BenefitCard Icon={CheckCircle} title="הזמנות אוטומטיות 24/7" delay={12} />
          <BenefitCard Icon={FileText} title="חשבוניות אוטומטיות" delay={22} />
          <BenefitCard Icon={Shield} title="הגנת מקדמה מביטולים" delay={32} />
          <BenefitCard Icon={Globe} title="דף אולפן מקצועי באינטרנט" delay={42} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Feature Cards ─── */
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="45%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 44px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <SectionLabel text="BENEFITS" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"היתרונות "}
          <GoldText>{"שלכם"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <FeatureCard Icon={Clock} title="חיסכון בזמן" desc="אוטומציה של משימות ידניות" delay={10} />
          <FeatureCard Icon={CreditCard} title="תשלומים מהירים" desc="אשראי, Bit, PayPal ועוד" delay={20} />
          <FeatureCard Icon={Globe} title="נוכחות אונליין" desc="SEO, גלריה ודף מקצועי" delay={30} />
          <FeatureCard Icon={Zap} title="אוטומציה מלאה" desc="הזמנות, התראות וחשבוניות" delay={40} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA with Dashboard ─── */
const SceneCTA: React.FC = () => (
  <ScreenshotCTAScene
    screenshotSrc="images/optimized/Studioz-Dashboard-Calendar.webp"
    headline={
      <>
        {"הצטרפו ל-"}
        <span style={{ color: "#ffd166" }}>{"Studioz"}</span>
        {" היום"}
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad42_SuccessStories_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneBenefits />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
