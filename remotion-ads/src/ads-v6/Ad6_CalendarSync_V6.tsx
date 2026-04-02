/**
 * Ad6 — Calendar Sync
 * 240 frames (8s) at 30fps, 1080×1920 (9:16 portrait)
 * V6: Premium glass morphism, safe zone aware, device frames.
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { RefreshCw } from "lucide-react";
import {
  RTL,
  useScale,
  PremiumBackground,
  SafeZone,
  Label,
  Headline,
  Subheadline,
  AccentText,
  PhoneFrame,
  Badge,
  GoldLine,
  Footer,
  CTAScene,
  COLORS,
} from "./shared";

/* ─── Scene 1: Calendar Intro ─── */
const Scene1: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={RTL}>
      <PremiumBackground variant="cool" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(20) }}>
        <Label text="CALENDAR" delay={0} />
        <Headline delay={5}>
          יומן אחד{"\n"}
          <AccentText>מסונכרן תמיד</AccentText>
        </Headline>
        <GoldLine delay={15} width={120} />
        <Subheadline delay={12}>
          סנכרון Google Calendar אוטומטי
        </Subheadline>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={20} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Side-by-side Phones ─── */
const Scene2: React.FC = () => {
  const s = useScale();

  return (
    <AbsoluteFill style={RTL}>
      <PremiumBackground variant="cool" />
      <SafeZone style={{ alignItems: "center", justifyContent: "center", gap: s(16) }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: s(16),
            width: "100%",
          }}
        >
          <PhoneFrame
            src="images/optimized/Dashboard-Calendar.png"
            delay={5}
            width={260}
            shadow={false}
          />
          <PhoneFrame
            src="images/optimized/Dashboard-Activity.png"
            delay={12}
            width={260}
            shadow={false}
          />
        </div>
        <Badge
          text="סנכרון אוטומטי"
          color={COLORS.green}
          delay={20}
          Icon={RefreshCw}
        />
        <div style={{ marginTop: "auto" }}>
          <Footer delay={30} />
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const Scene3: React.FC = () => (
  <CTAScene
    headline={
      <>
        יומן <AccentText>חכם</AccentText> לאולפן שלך
      </>
    }
    variant="cool"
  />
);

/* ─── Main Export ─── */
export const Ad6_CalendarSync_V6: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <Scene1 />
    </Sequence>
    <Sequence from={70} durationInFrames={100} premountFor={15}>
      <Scene2 />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <Scene3 />
    </Sequence>
  </AbsoluteFill>
);
