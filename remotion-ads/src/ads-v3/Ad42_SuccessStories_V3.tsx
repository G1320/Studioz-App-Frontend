/**
 * Ad42 — Success Stories V3
 * Before/after studio transformation with profile card, metrics, and testimonial
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  DARK_CARD_HOVER,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RED,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  Badge,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Metric Card ─── */
const MetricCard: React.FC<{
  label: string;
  before: string;
  after: string;
  delay: number;
}> = ({ label, before, after, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });
  const showAfter = interpolate(frame, [delay + 25, delay + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: "24px 18px",
        textAlign: "center",
        border: `1px solid rgba(255,209,102,0.08)`,
        transform: `scale(${enter})`,
        opacity: enter,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: 15,
          color: SUBTLE_TEXT,
          marginBottom: 12,
        }}
      >
        {label}
      </div>

      {/* Before value (fades out) */}
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 32,
          fontWeight: 700,
          color: SUBTLE_TEXT,
          opacity: 1 - showAfter,
          position: showAfter > 0.01 ? "absolute" : "relative",
          left: 0,
          right: 0,
          textDecoration: showAfter > 0.5 ? "line-through" : "none",
          textDecorationColor: RED,
        }}
      >
        {before}
      </div>

      {/* After value (fades in) */}
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 36,
          fontWeight: 700,
          color: SUCCESS,
          opacity: showAfter,
          filter: `drop-shadow(0 0 10px ${SUCCESS}30)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {after}
        <ArrowUpRight
          size={20}
          color={SUCCESS}
          strokeWidth={2.5}
          style={{ opacity: showAfter }}
        />
      </div>
    </div>
  );
};

/* ─── Scene 1: Studio Profile ─── */
const ProfileScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });
  const cardEnter = spring({ frame: frame - 8, fps, config: SPRING_BOUNCY });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="25%" size={500} opacity={0.08} />

      <div
        style={{
          padding: "80px 44px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <SectionLabel text="SUCCESS STORY" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "14px 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
          }}
        >
          סיפור הצלחה{"\n"}
          <GoldText>אמיתי</GoldText>
        </h2>

        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Studio profile card */}
        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 22,
            padding: "28px 26px",
            border: `1px solid ${GOLD}12`,
            display: "flex",
            alignItems: "center",
            gap: 18,
            transform: `scale(${cardEnter})`,
            opacity: cardEnter,
            boxShadow: `0 8px 36px rgba(0,0,0,0.35)`,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              overflow: "hidden",
              border: `2px solid ${GOLD}30`,
              flexShrink: 0,
            }}
          >
            <Img
              src={staticFile("logo.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <h3
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 26,
                fontWeight: 700,
                color: LIGHT_TEXT,
                margin: "0 0 4px",
              }}
            >
              אולפן הקלטות "צליל"
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: GOLD }}>
                ⭐ 4.9
              </span>
              <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: SUBTLE_TEXT }}>
                📍 תל אביב
              </span>
            </div>
          </div>
        </div>

        {/* Before / After metrics */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <MetricCard
            label="הזמנות / חודש"
            before="52"
            after="127"
            delay={20}
          />
          <MetricCard
            label="הכנסות / חודש"
            before="₪8,200"
            after="₪18,400"
            delay={28}
          />
        </div>

        {/* Growth badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <Badge
            text="+144% צמיחה בהזמנות 📈"
            color={SUCCESS}
            delay={55}
            Icon={TrendingUp}
          />
        </div>

        {/* Testimonial quote */}
        <div
          style={{
            backgroundColor: DARK_CARD_HOVER,
            borderRadius: 18,
            padding: "26px 24px",
            borderRight: `4px solid ${GOLD}`,
            opacity: interpolate(frame, [65, 85], [0, 1], {
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(frame, [65, 85], [20, 0], {
              extrapolateRight: "clamp",
            })}px)`,
          }}
        >
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 22,
              color: LIGHT_TEXT,
              margin: "0 0 12px",
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            "מאז שעברנו ל-Studioz, ההכנסות הוכפלו. הלקוחות מזמינים לבד ואני יכול להתרכז במוזיקה."
          </p>
          <p
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 18,
              color: GOLD,
              margin: 0,
              fontWeight: 600,
            }}
          >
            — יוסי, בעלים
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const SuccessCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        הסיפור הבא{"\n"}
        <GoldText>יכול להיות שלך</GoldText>
      </>
    }
    buttonText="התחל את סיפור ההצלחה"
    freeText="התחל בחינם — ₪0/חודש"
  />
);

/* ─── Main Composition ─── */
export const Ad42_SuccessStories_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160} premountFor={10}>
        <ProfileScene />
      </Sequence>
      <Sequence from={160} durationInFrames={80} premountFor={15}>
        <SuccessCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
