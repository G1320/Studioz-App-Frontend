/**
 * Ad10_FinalCTA_V6 (LIGHT MODE)
 * Theme: Final CTA — bold hook, floating badges around phone, dramatic close
 * Duration: 240 frames (8s) at 30fps, 1080×1920
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { Sparkles } from "lucide-react";
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
  PhoneFrame,
  Badge,
  CTAButton,
  Footer,
  GoldLine,
} from "./shared-light";

/* ─── Scene 1: Bold Hook ─── */
const SceneHook: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(20) }}>
        <Headline delay={5} size={72}>
          {"מוכן\n"}
          <AccentText>להתקדם?</AccentText>
        </Headline>
        <GoldLine delay={18} width={140} />
        <div style={{ marginTop: s(8) }}>
          <Subheadline delay={25}>הצטרף לאולפנים שכבר עובדים חכם</Subheadline>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Phone with Floating Badges ─── */
const ScenePhone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();

  const float1 = Math.sin(frame * 0.04) * s(6);
  const float2 = Math.sin(frame * 0.035 + 1) * s(8);
  const float3 = Math.sin(frame * 0.045 + 2) * s(5);

  const badgeEnter1 = spring({ frame: frame - 20, fps, config: SPRING.snappy });
  const badgeEnter2 = spring({ frame: frame - 30, fps, config: SPRING.snappy });
  const badgeEnter3 = spring({ frame: frame - 40, fps, config: SPRING.snappy });

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="cool" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <PhoneFrame
            src="images/optimized/Dashboard-Predictions-Mobile.png"
            delay={5}
            width={350}
          />
          <div
            style={{
              position: "absolute",
              top: s(10),
              right: s(-20),
              opacity: badgeEnter1,
              transform: `translateY(${interpolate(badgeEnter1, [0, 1], [s(20), 0]) + float1}px)`,
            }}
          >
            <Badge text="חינם לתמיד" color={COLORS.green} delay={0} />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: s(120),
              left: s(-30),
              opacity: badgeEnter2,
              transform: `translateY(${interpolate(badgeEnter2, [0, 1], [s(20), 0]) + float2}px)`,
            }}
          >
            <Badge text="כל התכונות" color={COLORS.blue} delay={0} />
          </div>
          <div
            style={{
              position: "absolute",
              top: s(180),
              left: s(-10),
              opacity: badgeEnter3,
              transform: `translateY(${interpolate(badgeEnter3, [0, 1], [s(20), 0]) + float3}px)`,
            }}
          >
            <Badge text="ללא התחייבות" color={COLORS.accent} delay={0} />
          </div>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: Dramatic Final CTA ─── */
const SceneFinalCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame, fps, config: SPRING.smooth });

  return (
    <AbsoluteFill style={{ ...RTL }}>
      <PremiumBackground variant="warm" />
      {/* Extra radial glow for drama */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: s(600),
          height: s(600),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}15 0%, transparent 70%)`,
          filter: `blur(${s(60)}px)`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
      <SafeZone style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: s(22),
            transform: `scale(${enter})`,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{
              width: s(100),
              height: s(100),
              borderRadius: s(22),
              boxShadow: `0 ${s(10)}px ${s(40)}px rgba(0,0,0,0.5), 0 0 ${s(60)}px ${COLORS.accent}15`,
            }}
          />
          <h2
            style={{
              fontFamily: FONT,
              fontSize: s(56),
              fontWeight: 800,
              color: COLORS.text,
              textAlign: "center",
              margin: 0,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            {"פרסם את האולפן שלך\n"}
            <AccentText>עכשיו</AccentText>
          </h2>
          <Badge
            text="חינם לתמיד — כל התכונות כלולות"
            color={COLORS.green}
            delay={15}
            Icon={Sparkles}
          />
          <div style={{ marginTop: s(10) }}>
            <CTAButton text="התחל עכשיו" delay={25} />
          </div>
          <div style={{ marginTop: s(15) }}>
            <Footer delay={35} />
          </div>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ─── Main Export ─── */
export const Ad10_FinalCTA_V6_Light: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={90}>
      <SceneHook />
    </Sequence>
    <Sequence from={80} durationInFrames={90}>
      <ScenePhone />
    </Sequence>
    <Sequence from={160} durationInFrames={80}>
      <SceneFinalCTA />
    </Sequence>
  </AbsoluteFill>
);
