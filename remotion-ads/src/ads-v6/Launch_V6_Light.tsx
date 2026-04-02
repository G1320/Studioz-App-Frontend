/**
 * Launch_V6_Light — Cinematic product launch video for FB/IG (LIGHT MODE)
 * 1350 frames (45s) at 30fps, 1080×1920
 * Same structure as Launch_V6.tsx — imports from shared-light.
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
  Shield,
  Clock,
  PhoneOff,
  DollarSign,
  Users,
  Zap,
  TrendingUp,
  Globe,
  Sparkles,
  CheckCircle,
  Star,
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
  Badge,
  CTAButton,
  Footer,
  GoldLine,
  LucideIcon,
} from "./shared-light";

/* ═══════════════════════════════════════════════════════════════ */
/*  Helpers                                                        */
/* ═══════════════════════════════════════════════════════════════ */

const CountUp: React.FC<{
  from: number;
  to: number;
  startFrame: number;
  duration: number;
  suffix?: string;
  prefix?: string;
  color?: string;
  size?: number;
}> = ({ from, to, startFrame, duration, suffix = "", prefix = "", color = COLORS.accent, size = 56 }) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = 1 - Math.pow(1 - progress, 3);
  const current = Math.round(from + (to - from) * eased);

  return (
    <span
      style={{
        fontFamily: FONT,
        fontSize: s(size),
        fontWeight: 900,
        color,
        letterSpacing: "-0.03em",
      }}
    >
      {prefix}{current}{suffix}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 1: Cold Open (0–100)                                     */
/* ═══════════════════════════════════════════════════════════════ */
const SceneColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();

  const line1 = spring({ frame: frame - 15, fps, config: SPRING.smooth });
  const line2 = spring({ frame: frame - 30, fps, config: SPRING.smooth });
  const line3 = spring({ frame: frame - 50, fps, config: SPRING.snappy });

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(16) }}>
        <div style={{ opacity: line1, transform: `translateY(${interpolate(line1, [0, 1], [s(50), 0])}px)` }}>
          <span style={{ fontFamily: FONT, fontSize: s(26), fontWeight: 400, color: COLORS.textSecondary, letterSpacing: "0.05em" }}>
            מנהלים אולפן?
          </span>
        </div>
        <div style={{ opacity: line2, transform: `translateY(${interpolate(line2, [0, 1], [s(40), 0])}px)` }}>
          <span style={{ fontFamily: FONT, fontSize: s(48), fontWeight: 800, color: COLORS.text, letterSpacing: "-0.02em" }}>
            הגיע הזמן לשינוי
          </span>
        </div>
        <GoldLine delay={45} width={180} />
        <div style={{ opacity: line3, transform: `scale(${interpolate(line3, [0, 1], [0.8, 1])})` }}>
          <span style={{ fontFamily: FONT, fontSize: s(20), fontWeight: 500, color: COLORS.textMuted }}>
            הפלטפורמה שתשנה את האופן שבו אתם עובדים
          </span>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 2: Brand Reveal (90–210)                                 */
/* ═══════════════════════════════════════════════════════════════ */
const SceneBrandReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const logoScale = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 60, mass: 1.2 } });
  const nameEnter = spring({ frame: frame - 35, fps, config: SPRING.smooth });
  const taglineEnter = spring({ frame: frame - 55, fps, config: SPRING.gentle });

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${logoScale * 1.5})`,
          width: s(400),
          height: s(400),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}12 0%, transparent 60%)`,
          filter: `blur(${s(40)}px)`,
        }}
      />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(20) }}>
        <Img
          src={staticFile("logo.png")}
          style={{
            width: s(130),
            height: s(130),
            borderRadius: s(30),
            boxShadow: `0 ${s(6)}px ${s(30)}px rgba(0,0,0,0.1)`,
            transform: `scale(${interpolate(logoScale, [0, 1], [0.3, 1])})`,
            opacity: logoScale,
          }}
        />
        <h1
          style={{
            fontFamily: FONT,
            fontSize: s(72),
            fontWeight: 900,
            color: COLORS.text,
            margin: 0,
            letterSpacing: "-0.03em",
            opacity: nameEnter,
            transform: `translateY(${interpolate(nameEnter, [0, 1], [s(30), 0])}px)`,
          }}
        >
          Studioz
        </h1>
        <p
          style={{
            fontFamily: FONT,
            fontSize: s(24),
            fontWeight: 400,
            color: COLORS.textSecondary,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.5,
            opacity: taglineEnter,
            transform: `translateY(${interpolate(taglineEnter, [0, 1], [s(15), 0])}px)`,
          }}
        >
          נהל. קבל הזמנות. צמח.
        </p>
        <div style={{ marginTop: s(8) }}>
          <Badge text="חינם לתמיד" color={COLORS.green} delay={70} Icon={Sparkles} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 3: Problem Montage (200–340)                             */
/* ═══════════════════════════════════════════════════════════════ */
const SceneProblem: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="warm" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(14) }}>
        <Label text="THE PROBLEM" delay={5} color={COLORS.red} />
        <Headline delay={10} size={44}>
          {"בלי מערכת —\n"}
          <AccentText color={COLORS.red}>זה נראה ככה</AccentText>
        </Headline>
        <div style={{ display: "flex", flexDirection: "column", gap: s(11), width: "100%", marginTop: s(14) }}>
          <PainPoint Icon={PhoneOff} text="הודעות ווטסאפ במקום הזמנות" delay={22} strikeFrame={100} />
          <PainPoint Icon={Clock} text="ניהול ביומן של גוגל" delay={32} strikeFrame={105} />
          <PainPoint Icon={DollarSign} text="אין מעקב אחרי הכנסות" delay={42} strikeFrame={110} />
          <PainPoint Icon={Users} text="ביטולים בלי הודעה מראש" delay={52} strikeFrame={115} />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={60} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 4: Transition Wipe (330–400)                             */
/* ═══════════════════════════════════════════════════════════════ */
const SceneTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - 5, fps, config: { damping: 20, stiffness: 50 } });

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="emerald" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: s(16),
            opacity: enter,
            transform: `scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
          }}
        >
          <Zap size={s(48)} color={COLORS.accent} strokeWidth={1.5} />
          <h2
            style={{
              fontFamily: FONT,
              fontSize: s(52),
              fontWeight: 800,
              color: COLORS.text,
              textAlign: "center",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {"יש דרך\n"}
            <AccentText>טובה יותר</AccentText>
          </h2>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 5: Triple Phone Spread (390–570)                         */
/* ═══════════════════════════════════════════════════════════════ */
const SceneTriplePhone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();

  const fan1 = spring({ frame: frame - 15, fps, config: SPRING.smooth });
  const fan2 = spring({ frame: frame - 25, fps, config: SPRING.smooth });
  const fan3 = spring({ frame: frame - 35, fps, config: SPRING.smooth });
  const parallax = Math.sin(frame * 0.012) * s(6);

  const phones: { src: string; rotate: number; x: number; enter: number }[] = [
    { src: "images/optimized/Dashboard-Clients-Mobile.png", rotate: -8, x: -s(160), enter: fan1 },
    { src: "images/optimized/Dashboard-Overview-Mobile.png", rotate: 0, x: 0, enter: fan2 },
    { src: "images/optimized/Dashboard-Analytics-Mobile.png", rotate: 8, x: s(160), enter: fan3 },
  ];

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="cool" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(20) }}>
        <Label text="THE PLATFORM" delay={5} />
        <Headline delay={10} size={42}>
          {"הכל במקום\n"}
          <AccentText>אחד</AccentText>
        </Headline>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: s(480),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {phones.map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                opacity: p.enter,
                transform: `
                  translateX(${interpolate(p.enter, [0, 1], [0, p.x])}px)
                  translateY(${interpolate(p.enter, [0, 1], [s(100), 0]) + parallax * (i === 1 ? -1 : 0.5)}px)
                  rotate(${interpolate(p.enter, [0, 1], [0, p.rotate])}deg)
                  scale(${interpolate(p.enter, [0, 1], [0.7, i === 1 ? 1 : 0.85])})
                `,
                zIndex: i === 1 ? 3 : 1,
                filter: i === 1 ? "none" : "brightness(0.95)",
              }}
            >
              <PhoneFrame src={p.src} delay={0} width={280} shadow />
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={60} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 6: Feature Deep-Dives (560–760)                          */
/* ═══════════════════════════════════════════════════════════════ */
const SceneFeatures: React.FC = () => {
  const s = useScale();

  const features: { Icon: LucideIcon; title: string; desc: string; color: string; delay: number }[] = [
    { Icon: Calendar, title: "לוח זמנים חכם", desc: "סנכרון עם Google Calendar · זמינות בזמן אמת", color: COLORS.accent, delay: 15 },
    { Icon: CreditCard, title: "תשלומים אוטומטיים", desc: "כרטיס אשראי, bit, Google Pay · חשבוניות", color: COLORS.green, delay: 28 },
    { Icon: BarChart3, title: "אנליטיקות מתקדמות", desc: "דשבורד · תחזיות · מגמות הכנסות", color: COLORS.blue, delay: 41 },
    { Icon: Shield, title: "הגנה מביטולים", desc: "מדיניות אוטומטית · דמי ביטול · הודעות", color: COLORS.purple, delay: 54 },
    { Icon: Globe, title: "דף אולפן מקצועי", desc: "פרופיל דיגיטלי · SEO · נוכחות ב-Google", color: COLORS.accent, delay: 67 },
    { Icon: Users, title: "ניהול לקוחות", desc: "CRM מובנה · היסטוריית הזמנות · תקשורת", color: COLORS.green, delay: 80 },
  ];

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(14) }}>
        <Label text="FEATURES" delay={5} />
        <Headline delay={8} size={40}>
          {"כלים שעובדים\n"}
          <AccentText>בשבילך</AccentText>
        </Headline>
        <GlassCard delay={12} style={{ width: "100%", display: "flex", flexDirection: "column" as const, gap: s(16) }}>
          {features.map((f, i) => (
            <FeatureRow key={i} Icon={f.Icon} title={f.title} desc={f.desc} delay={f.delay} color={f.color} />
          ))}
        </GlassCard>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={90} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 7: Dashboard Demo (750–900)                              */
/* ═══════════════════════════════════════════════════════════════ */
const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const float1 = Math.sin(frame * 0.04) * s(5);
  const float2 = Math.sin(frame * 0.035 + 1) * s(6);

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="cool" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(16) }}>
        <Label text="DASHBOARD" delay={5} />
        <Headline delay={10} size={40}>
          {"שליטה מלאה —\n"}
          <AccentText>מכל מקום</AccentText>
        </Headline>
        <div style={{ position: "relative", alignSelf: "center" }}>
          <PhoneFrame src="images/optimized/Dashboard-Overview-Mobile.png" delay={18} width={320} />
          <div style={{ position: "absolute", top: s(30), right: s(-60), transform: `translateY(${float1}px)` }}>
            <GlassCard delay={40} style={{ padding: `${s(14)}px ${s(18)}px`, display: "flex", alignItems: "center", gap: s(10) }}>
              <TrendingUp size={s(20)} color={COLORS.green} strokeWidth={2} />
              <div>
                <div style={{ fontFamily: FONT, fontSize: s(18), fontWeight: 800, color: COLORS.green }}>+30%</div>
                <div style={{ fontFamily: FONT, fontSize: s(11), color: COLORS.textMuted }}>הזמנות</div>
              </div>
            </GlassCard>
          </div>
          <div style={{ position: "absolute", bottom: s(60), left: s(-50), transform: `translateY(${float2}px)` }}>
            <GlassCard delay={55} style={{ padding: `${s(14)}px ${s(18)}px`, display: "flex", alignItems: "center", gap: s(10) }}>
              <Star size={s(20)} color={COLORS.accent} strokeWidth={2} />
              <div>
                <div style={{ fontFamily: FONT, fontSize: s(18), fontWeight: 800, color: COLORS.accent }}>4.9</div>
                <div style={{ fontFamily: FONT, fontSize: s(11), color: COLORS.textMuted }}>דירוג</div>
              </div>
            </GlassCard>
          </div>
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={65} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 8: Social Proof (890–1010)                               */
/* ═══════════════════════════════════════════════════════════════ */
const SceneSocialProof: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(20) }}>
        <Label text="RESULTS" delay={5} />
        <Headline delay={10} size={44}>
          {"מספרים שמדברים\n"}
          <AccentText>בעד עצמם</AccentText>
        </Headline>
        <GlassCard delay={18} style={{ width: "100%", display: "flex", justifyContent: "space-around", padding: `${s(36)}px ${s(16)}px` }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <CountUp from={0} to={30} startFrame={25} duration={40} suffix="%" prefix="+" color={COLORS.green} />
            <div style={{ fontFamily: FONT, fontSize: s(14), color: COLORS.textMuted, marginTop: s(6) }}>גידול בהזמנות</div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <CountUp from={0} to={15} startFrame={35} duration={40} suffix="h" color={COLORS.accent} />
            <div style={{ fontFamily: FONT, fontSize: s(14), color: COLORS.textMuted, marginTop: s(6) }}>חסכון שבועי</div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <CountUp from={0} to={98} startFrame={45} duration={40} suffix="%" color={COLORS.blue} />
            <div style={{ fontFamily: FONT, fontSize: s(14), color: COLORS.textMuted, marginTop: s(6) }}>שביעות רצון</div>
          </div>
        </GlassCard>
        <div style={{ display: "flex", flexWrap: "wrap", gap: s(10), justifyContent: "center", marginTop: s(8) }}>
          <FeaturePill Icon={Zap} text="אוטומציה מלאה" delay={60} color={COLORS.accent} />
          <FeaturePill Icon={TrendingUp} text="צמיחה מוכחת" delay={68} color={COLORS.green} />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={75} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 9: Pricing Reveal (1000–1110)                            */
/* ═══════════════════════════════════════════════════════════════ */
const ScenePricing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const priceDrop = spring({ frame: frame - 20, fps, config: { damping: 8, stiffness: 50, mass: 1.5 } });
  const tierEnter = spring({ frame: frame - 50, fps, config: SPRING.smooth });

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="emerald" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(10) }}>
        <Label text="PRICING" delay={5} color={COLORS.green} />
        <Headline delay={10} size={46}>
          {"חינם. "}
          <AccentText>לתמיד.</AccentText>
        </Headline>
        <div
          style={{
            fontFamily: FONT,
            fontSize: s(120),
            fontWeight: 900,
            color: COLORS.accent,
            textAlign: "center",
            letterSpacing: "-0.04em",
            filter: `drop-shadow(0 0 ${s(30)}px ${COLORS.accent}30)`,
            opacity: priceDrop,
            transform: `translateY(${interpolate(priceDrop, [0, 1], [-s(80), 0])}px) scale(${interpolate(priceDrop, [0, 1], [1.3, 1])})`,
          }}
        >
          ₪0
        </div>
        <div style={{ fontFamily: FONT, fontSize: s(22), fontWeight: 500, color: COLORS.textSecondary, textAlign: "center" }}>
          דמי מנוי
        </div>
        <div
          style={{
            display: "flex",
            gap: s(12),
            marginTop: s(16),
            opacity: tierEnter,
            transform: `translateY(${interpolate(tierEnter, [0, 1], [s(30), 0])}px)`,
          }}
        >
          {[
            { rate: "9%", label: "בהתחלה", color: COLORS.accent },
            { rate: "7%", label: "בצמיחה", color: COLORS.blue },
            { rate: "5%", label: "בשיא", color: COLORS.green },
          ].map((t, i) => (
            <GlassCard key={i} delay={55 + i * 8} style={{ flex: 1, textAlign: "center", padding: `${s(16)}px ${s(12)}px` }}>
              <div style={{ fontFamily: FONT, fontSize: s(32), fontWeight: 900, color: t.color, letterSpacing: "-0.02em" }}>{t.rate}</div>
              <div style={{ fontFamily: FONT, fontSize: s(13), color: COLORS.textMuted, marginTop: s(4) }}>{t.label}</div>
            </GlassCard>
          ))}
        </div>
        <Subheadline delay={75} size={16}>
          אנחנו מרוויחים רק כשאתה מרוויח
        </Subheadline>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Scene 10: Final CTA (1100–1350)                                */
/* ═══════════════════════════════════════════════════════════════ */
const SceneFinalCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame, fps, config: SPRING.smooth });
  const pulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [1, 1.02]);

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground />
      <SafeZone style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: s(18),
            transform: `scale(${enter})`,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{
              width: s(100),
              height: s(100),
              borderRadius: s(24),
              boxShadow: `0 ${s(4)}px ${s(20)}px rgba(0,0,0,0.1)`,
            }}
          />
          <h2
            style={{
              fontFamily: FONT,
              fontSize: s(52),
              fontWeight: 800,
              color: COLORS.text,
              textAlign: "center",
              margin: 0,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            {"שדרג את "}
            <AccentText>האולפן שלך</AccentText>
            {"\nהיום"}
          </h2>
          <GoldLine delay={20} width={140} />
          <Badge text="חינם לתמיד — כל התכונות כלולות" color={COLORS.green} delay={25} Icon={CheckCircle} />
          <Subheadline delay={30} size={19}>ללא כרטיס אשראי · ללא התחייבות</Subheadline>
          <div style={{ marginTop: s(8), transform: `scale(${pulse})` }}>
            <CTAButton text="התחל עכשיו — בחינם" delay={35} />
          </div>
          <div style={{ marginTop: s(6) }}>
            <Subheadline delay={45} size={16}>studioz.co.il</Subheadline>
          </div>
          <div style={{ marginTop: s(10) }}>
            <Footer delay={50} />
          </div>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Main Export — 1350 frames (45s)                                */
/* ═══════════════════════════════════════════════════════════════ */
export const Launch_V6_Light: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={110} premountFor={15}>
      <SceneColdOpen />
    </Sequence>
    <Sequence from={100} durationInFrames={120} premountFor={15}>
      <SceneBrandReveal />
    </Sequence>
    <Sequence from={210} durationInFrames={140} premountFor={15}>
      <SceneProblem />
    </Sequence>
    <Sequence from={340} durationInFrames={70} premountFor={15}>
      <SceneTransition />
    </Sequence>
    <Sequence from={400} durationInFrames={180} premountFor={15}>
      <SceneTriplePhone />
    </Sequence>
    <Sequence from={570} durationInFrames={200} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={760} durationInFrames={150} premountFor={15}>
      <SceneDashboard />
    </Sequence>
    <Sequence from={900} durationInFrames={120} premountFor={15}>
      <SceneSocialProof />
    </Sequence>
    <Sequence from={1010} durationInFrames={110} premountFor={15}>
      <ScenePricing />
    </Sequence>
    <Sequence from={1110} durationInFrames={240} premountFor={15}>
      <SceneFinalCTA />
    </Sequence>
  </AbsoluteFill>
);
