/**
 * Promo_Facebook_V6_Light — Full-length promo for Studioz Facebook page (LIGHT MODE)
 * 900 frames (30s) at 30fps, 1080×1920
 * 7 scenes: Intro → Pain → Solution → Features → Stats → Pricing → CTA
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import {
  Calendar,
  BarChart3,
  CreditCard,
  Clock,
  PhoneOff,
  DollarSign,
  Users,
  Zap,
  TrendingUp,
  Shield,
  Globe,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import {
  COLORS,
  FONT,
  RTL,
  SPRING,
  useScale,
  PremiumBackground,
  SafeZone,
  Headline,
  Subheadline,
  AccentText,
  Label,
  PhoneFrame,
  GlassCard,
  FeatureRow,
  FeaturePill,
  PainPoint,
  StatDisplay,
  GoldLine,
  Badge,
  CTAButton,
  Footer,
} from "./shared-light";

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 1: Brand Intro (0–130)                                  */
/* ═══════════════════════════════════════════════════════════════ */
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const logoEnter = spring({ frame: frame - 10, fps, config: SPRING.bouncy });
  const lineEnter = spring({ frame: frame - 40, fps, config: SPRING.gentle });
  const taglineEnter = spring({ frame: frame - 55, fps, config: SPRING.smooth });

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(20) }}>
        <Img
          src={staticFile("logo.png")}
          style={{
            width: s(110),
            height: s(110),
            borderRadius: s(26),
            boxShadow: `0 ${s(4)}px ${s(20)}px rgba(0,0,0,0.1)`,
            opacity: logoEnter,
            transform: `scale(${interpolate(logoEnter, [0, 1], [0.5, 1])})`,
          }}
        />
        <div style={{ marginTop: s(10) }}>
          <Headline delay={25} size={56}>
            <AccentText>Studioz</AccentText>
          </Headline>
        </div>
        <div
          style={{
            width: interpolate(lineEnter, [0, 1], [0, s(160)]),
            height: s(2),
            background: `linear-gradient(90deg, transparent, ${COLORS.accent}80, transparent)`,
            borderRadius: 2,
          }}
        />
        <p
          style={{
            fontFamily: FONT,
            fontSize: s(28),
            fontWeight: 400,
            color: COLORS.textSecondary,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.5,
            opacity: taglineEnter,
            transform: `translateY(${interpolate(taglineEnter, [0, 1], [s(20), 0])}px)`,
          }}
        >
          הפלטפורמה המובילה לניהול אולפנים
        </p>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={60} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 2: Pain Points (120–280)                                */
/* ═══════════════════════════════════════════════════════════════ */
const ScenePain: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="warm" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(16) }}>
        <Label text="THE PROBLEM" delay={5} color={COLORS.red} />
        <Headline delay={10} size={48}>
          {"מנהלים אולפן?\n"}
          <AccentText color={COLORS.red}>מכירים את זה?</AccentText>
        </Headline>
        <div style={{ display: "flex", flexDirection: "column", gap: s(12), width: "100%", marginTop: s(16) }}>
          <PainPoint Icon={PhoneOff} text='שיחות טלפון שלא נגמרות' delay={20} strikeFrame={120} />
          <PainPoint Icon={Clock} text='ניהול ידני של לוח זמנים' delay={30} strikeFrame={125} />
          <PainPoint Icon={DollarSign} text='אין תמונה ברורה על הכנסות' delay={40} strikeFrame={130} />
          <PainPoint Icon={Users} text='לקוחות שמבטלים ברגע האחרון' delay={50} strikeFrame={135} />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={60} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 3: Solution Reveal (270–420)                            */
/* ═══════════════════════════════════════════════════════════════ */
const SceneSolution: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="emerald" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(14) }}>
        <Label text="THE SOLUTION" delay={5} color={COLORS.green} />
        <Headline delay={10} size={46}>
          {"הכירו את "}
          <AccentText>Studioz</AccentText>
        </Headline>
        <Subheadline delay={18} size={22}>
          מערכת אחת שמנהלת הכל — הזמנות, תשלומים, לקוחות ואנליטיקות
        </Subheadline>
        <div style={{ marginTop: s(12), alignSelf: "center" }}>
          <PhoneFrame
            src="images/optimized/Dashboard-Overview-Mobile.png"
            delay={25}
            width={340}
          />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={50} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 4: Feature Showcase (410–600)                           */
/* ═══════════════════════════════════════════════════════════════ */
const SceneFeatures: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="cool" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(14) }}>
        <Label text="FEATURES" delay={5} />
        <Headline delay={10} size={42}>
          {"כל מה שצריך —\n"}
          <AccentText>במקום אחד</AccentText>
        </Headline>
        <GlassCard delay={20} style={{ width: "100%", display: "flex", flexDirection: "column" as const, gap: s(20) }}>
          <FeatureRow Icon={Calendar} title="לוח זמנים חכם" desc="סנכרון עם Google Calendar" delay={25} color={COLORS.accent} />
          <FeatureRow Icon={CreditCard} title="תשלומים אוטומטיים" desc="כרטיס אשראי, bit, Google Pay" delay={32} color={COLORS.green} />
          <FeatureRow Icon={BarChart3} title="אנליטיקות מתקדמות" desc="דשבורד בזמן אמת" delay={39} color={COLORS.blue} />
          <FeatureRow Icon={Shield} title="הגנה מביטולים" desc="מדיניות ביטולים אוטומטית" delay={46} color={COLORS.purple} />
          <FeatureRow Icon={Globe} title="דף אולפן מקצועי" desc="נוכחות דיגיטלית מותאמת" delay={53} color={COLORS.accent} />
        </GlassCard>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={60} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 5: Stats & Social Proof (590–720)                       */
/* ═══════════════════════════════════════════════════════════════ */
const SceneStats: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(24) }}>
        <Label text="RESULTS" delay={5} />
        <Headline delay={10} size={44}>
          <AccentText>התוצאות</AccentText>
          {" מדברות"}
        </Headline>
        <GlassCard delay={18} style={{ width: "100%", display: "flex", justifyContent: "space-around", padding: `${s(32)}px ${s(16)}px` }}>
          <StatDisplay value="+30%" label="הזמנות" delay={22} color={COLORS.green} />
          <StatDisplay value="15h" label="חסכון/שבוע" delay={28} />
          <StatDisplay value="98%" label="שביעות רצון" delay={34} color={COLORS.blue} />
        </GlassCard>
        <div style={{ display: "flex", flexWrap: "wrap", gap: s(10), justifyContent: "center", marginTop: s(10) }}>
          <FeaturePill Icon={Zap} text="אוטומציה מלאה" delay={40} color={COLORS.accent} />
          <FeaturePill Icon={TrendingUp} text="צמיחה מוכחת" delay={46} color={COLORS.green} />
          <FeaturePill Icon={Sparkles} text="חוויית משתמש פרימיום" delay={52} color={COLORS.purple} />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={60} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 6: Free Forever Pricing (710–810)                       */
/* ═══════════════════════════════════════════════════════════════ */
const ScenePricing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const priceEnter = spring({ frame: frame - 25, fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="emerald" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(12) }}>
        <Label text="PRICING" delay={5} color={COLORS.green} />
        <Headline delay={10} size={48}>
          {"חינם. "}
          <AccentText>לתמיד.</AccentText>
        </Headline>
        <div
          style={{
            fontFamily: FONT,
            fontSize: s(100),
            fontWeight: 900,
            color: COLORS.accent,
            textAlign: "center",
            letterSpacing: "-0.03em",
            filter: `drop-shadow(0 0 30px ${COLORS.accent}30)`,
            opacity: priceEnter,
            transform: `scale(${interpolate(priceEnter, [0, 1], [0.6, 1])})`,
          }}
        >
          ₪0
        </div>
        <Subheadline delay={30} size={24}>דמי מנוי</Subheadline>
        <div style={{ display: "flex", flexDirection: "column", gap: s(10), marginTop: s(12), alignItems: "center" }}>
          <Badge text="₪0 — כל התכונות כלולות" color={COLORS.green} delay={38} Icon={CheckCircle} />
          <Subheadline delay={44} size={18}>אנחנו מרוויחים רק כשאתה מרוויח</Subheadline>
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={55} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 7: Final CTA (800–900)                                  */
/* ═══════════════════════════════════════════════════════════════ */
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame, fps, config: SPRING.smooth });

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground />
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
              width: s(90),
              height: s(90),
              borderRadius: s(20),
              boxShadow: `0 ${s(4)}px ${s(20)}px rgba(0,0,0,0.08)`,
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
            {"שדרג את "}
            <AccentText>האולפן שלך</AccentText>
            {"\nהיום"}
          </h2>
          <Badge text="חינם לתמיד — כל התכונות כלולות" color={COLORS.green} delay={15} />
          <Subheadline delay={20} size={20}>ללא כרטיס אשראי · ללא התחייבות</Subheadline>
          <div style={{ marginTop: s(10) }}>
            <CTAButton text="התחל עכשיו — בחינם" delay={25} />
          </div>
          <div style={{ marginTop: s(15) }}>
            <Footer delay={35} />
          </div>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Main Export                                                    */
/* ═══════════════════════════════════════════════════════════════ */
export const Promo_Facebook_V6_Light: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={140} premountFor={15}>
      <SceneIntro />
    </Sequence>
    <Sequence from={130} durationInFrames={160} premountFor={15}>
      <ScenePain />
    </Sequence>
    <Sequence from={280} durationInFrames={150} premountFor={15}>
      <SceneSolution />
    </Sequence>
    <Sequence from={420} durationInFrames={180} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={590} durationInFrames={140} premountFor={15}>
      <SceneStats />
    </Sequence>
    <Sequence from={720} durationInFrames={100} premountFor={15}>
      <ScenePricing />
    </Sequence>
    <Sequence from={810} durationInFrames={90} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
