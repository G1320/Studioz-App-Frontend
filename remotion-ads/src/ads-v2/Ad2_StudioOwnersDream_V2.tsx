/**
 * Ad2 — Studio Owners Dream V2
 * Problem → Solution transformation
 * 360 frames / 12s @ 30fps
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
  Phone,
  MessageCircle,
  Calculator,
  UserX,
  Rocket,
  BarChart3,
  CreditCard,
  ShieldCheck,
  CalendarDays,
  Banknote,
} from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  RED,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldButton,
  Footer,
  Headline,
  GoldText,
  FeatureCard,
} from "./shared";

/* ─── Scene 1: Pain Points ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  const painPoints = [
    { Icon: Phone, title: "טלפונים אינסופיים", desc: "כל הזמנה דרך שיחה" },
    { Icon: MessageCircle, title: "הודעות וואטסאפ", desc: "לא מספיקים לענות לכולם" },
    { Icon: Calculator, title: "ניהול ידני", desc: "אקסלים ומחברות" },
    { Icon: UserX, title: "לקוחות אבודים", desc: "שוכחים לחזור ללקוח" },
  ];

  const exitOpacity = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL, opacity: exitOpacity }}>
      <NoiseOverlay />
      <AmbientParticles count={12} color={RED} />
      <RadialGlow x="50%" y="25%" size={500} color={RED} opacity={0.06} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "80px 48px",
          position: "relative",
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 56,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "right",
            margin: 0,
            lineHeight: 1.2,
            marginBottom: 50,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          עדיין מנהל
          {"\n"}
          סטודיו <span style={{ color: RED }}>ככה?</span>
        </h1>

        {/* Pain cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, justifyContent: "center" }}>
          {painPoints.map((p, i) => {
            const enter = spring({ frame: frame - (20 + i * 15), fps, config: SPRING_SNAPPY });
            return (
              <div
                key={i}
                style={{
                  backgroundColor: DARK_CARD,
                  borderRadius: 18,
                  padding: "22px 22px",
                  border: `1px solid ${RED}18`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: enter,
                  transform: `translateX(${interpolate(enter, [0, 1], [60, 0])}px)`,
                  boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: `${RED}12`,
                    border: `1px solid ${RED}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <p.Icon size={24} color={RED} strokeWidth={1.8} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: FONT_HEADING,
                      fontSize: 22,
                      fontWeight: 700,
                      color: LIGHT_TEXT,
                      marginBottom: 3,
                    }}
                  >
                    {p.title}
                  </div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: SUBTLE_TEXT }}>
                    {p.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Solution ─── */
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineEnter = spring({ frame: frame - 5, fps, config: SPRING_GENTLE });
  const headEnter = spring({ frame: frame - 15, fps, config: SPRING_SMOOTH });

  const solutions = [
    { Icon: Rocket, title: "הזמנה אוטומטית", desc: "בלי שיחות, בלי ווטסאפ" },
    { Icon: BarChart3, title: "דשבורד חכם", desc: "כל הנתונים במקום אחד" },
    { Icon: CreditCard, title: "סליקה מובנית", desc: "תשלומים אוטומטיים" },
    { Icon: ShieldCheck, title: "ניהול לקוחות", desc: "CRM מובנה ומסודר" },
  ];

  const exitOpacity = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL, opacity: exitOpacity }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="35%" size={550} opacity={0.1} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "80px 48px",
          position: "relative",
        }}
      >
        {/* Gold transition line */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
          <GoldLine width={250} delay={0} />
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "right",
            margin: 0,
            lineHeight: 1.2,
            marginBottom: 45,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          עם סטודיוז,
          {"\n"}
          <GoldText>הכל משתנה</GoldText>
        </h1>

        {/* Solution cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, justifyContent: "center" }}>
          {solutions.map((s, i) => (
            <FeatureCard
              key={i}
              Icon={s.Icon}
              title={s.title}
              desc={s.desc}
              delay={25 + i * 15}
              accentColor={GOLD}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: Dashboard + CTA ─── */
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardEnter = spring({ frame: frame - 10, fps, config: SPRING_SMOOTH });
  const ctaEnter = spring({ frame: frame - 50, fps, config: SPRING_BOUNCY });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.1} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "60px 48px",
          gap: 36,
          position: "relative",
        }}
      >
        {/* Dashboard mockup card */}
        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 24,
            padding: "36px 32px",
            border: `1px solid ${GOLD}15`,
            width: "100%",
            boxShadow: `0 8px 40px rgba(0,0,0,0.35), 0 0 60px ${GOLD}08`,
            opacity: cardEnter,
            transform: `translateY(${interpolate(cardEnter, [0, 1], [40, 0])}px) scale(${interpolate(cardEnter, [0, 1], [0.95, 1])})`,
          }}
        >
          {/* Dashboard header */}
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 18,
              fontWeight: 600,
              color: SUBTLE_TEXT,
              marginBottom: 28,
              textAlign: "right",
            }}
          >
            סיכום חודשי
          </div>

          {/* Metrics row */}
          <div style={{ display: "flex", gap: 20 }}>
            {/* Bookings */}
            <div
              style={{
                flex: 1,
                backgroundColor: `${GOLD}08`,
                borderRadius: 16,
                padding: "24px 16px",
                textAlign: "center",
                border: `1px solid ${GOLD}12`,
              }}
            >
              <CalendarDays size={22} color={GOLD} strokeWidth={1.8} />
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 42,
                  fontWeight: 700,
                  color: GOLD,
                  marginTop: 8,
                  filter: `drop-shadow(0 0 10px ${GOLD}18)`,
                }}
              >
                127
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: SUBTLE_TEXT, marginTop: 4 }}>
                הזמנות
              </div>
            </div>

            {/* Revenue */}
            <div
              style={{
                flex: 1,
                backgroundColor: `${GOLD}08`,
                borderRadius: 16,
                padding: "24px 16px",
                textAlign: "center",
                border: `1px solid ${GOLD}12`,
              }}
            >
              <Banknote size={22} color={GOLD} strokeWidth={1.8} />
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 38,
                  fontWeight: 700,
                  color: GOLD,
                  marginTop: 8,
                  filter: `drop-shadow(0 0 10px ${GOLD}18)`,
                }}
              >
                ₪18,400
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: SUBTLE_TEXT, marginTop: 4 }}>
                הכנסות
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            transform: `scale(${ctaEnter})`,
            opacity: ctaEnter,
          }}
        >
          <GoldButton text="התחל לנהל חכם" delay={0} size="lg" />
        </div>

        {/* Footer */}
        <div style={{ position: "absolute", bottom: 52, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Footer delay={40} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Main Composition ─── */
export const Ad2_StudioOwnersDream_V2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={120} premountFor={10}>
        <Scene1 />
      </Sequence>
      <Sequence from={120} durationInFrames={120} premountFor={15}>
        <Scene2 />
      </Sequence>
      <Sequence from={240} durationInFrames={120} premountFor={15}>
        <Scene3 />
      </Sequence>
    </AbsoluteFill>
  );
};
