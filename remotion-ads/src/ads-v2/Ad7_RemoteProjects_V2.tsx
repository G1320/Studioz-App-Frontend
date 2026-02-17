/**
 * Ad7 — Remote Projects V2
 * Remote collaboration features
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Globe, Upload, MessageSquare, Wallet, Smartphone } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  ACCENT_BLUE,
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
  FeatureCard,
  GoldButton,
  Footer,
  GoldText,
  Badge,
} from "./shared";

const features = [
  { Icon: Globe, title: "גישה מכל מקום", desc: "ניהול אונליין 24/7", delay: 25 },
  { Icon: Upload, title: "העלאת קבצים", desc: "שיתוף פרויקטים", delay: 40 },
  { Icon: MessageSquare, title: "צ׳אט מובנה", desc: "תקשורת ישירה", delay: 55 },
  { Icon: Wallet, title: "תשלום מרחוק", desc: "סליקה מאובטחת", delay: 70 },
];

export const Ad7_RemoteProjects_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });
  const badgeEnter = spring({ frame: frame - 110, fps, config: SPRING_SMOOTH });
  const ctaEnter = spring({ frame: frame - 130, fps, config: SPRING_BOUNCY });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="40%" y="30%" size={550} opacity={0.09} />
      <RadialGlow x="70%" y="65%" size={400} color={ACCENT_BLUE} opacity={0.05} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "70px 44px 52px",
          position: "relative",
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 54,
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
          עבודה מרחוק?
          {"\n"}
          <GoldText>סטודיוז מכסה אותך</GoldText>
        </h1>

        {/* Feature cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, justifyContent: "center" }}>
          {features.map((f, i) => (
            <FeatureCard
              key={i}
              Icon={f.Icon}
              title={f.title}
              desc={f.desc}
              delay={f.delay}
              accentColor={GOLD}
            />
          ))}
        </div>

        {/* Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 30,
          }}
        >
          <div
            style={{
              opacity: badgeEnter,
              transform: `translateY(${interpolate(badgeEnter, [0, 1], [12, 0])}px)`,
            }}
          >
            <Badge text="עובד מכל מכשיר" color={ACCENT_BLUE} delay={0} Icon={Smartphone} />
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 24,
            marginBottom: 20,
          }}
        >
          <div style={{ transform: `scale(${ctaEnter})`, opacity: ctaEnter }}>
            <GoldButton text="נסה בחינם" delay={0} size="md" />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Footer delay={140} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
