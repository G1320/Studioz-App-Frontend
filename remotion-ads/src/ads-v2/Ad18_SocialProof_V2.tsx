/**
 * Ad18 — Social Proof V2
 * Testimonials and social proof showcase
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
import { Quote, Star } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  SPRING_GENTLE,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  SectionLabel,
  Badge,
  Footer,
} from "./shared";

interface TestimonialData {
  text: string;
  name: string;
  studio: string;
}

const testimonials: TestimonialData[] = [
  {
    text: "מאז שעברתי לסטודיוז, ההכנסות עלו ב-40%",
    name: "אורי מ.",
    studio: "אולפני הקלטה",
  },
  {
    text: "הלקוחות מזמינים לבד, אני רק מגיע לעבוד",
    name: "דנה כ.",
    studio: "סטודיו צילום",
  },
  {
    text: "חוסך לי שעות כל שבוע",
    name: "יוסי ל.",
    studio: "חדר חזרות",
  },
];

const StarsRow: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const starEnter = spring({
          frame: frame - delay - i * 3,
          fps,
          config: SPRING_SNAPPY,
        });
        return (
          <div
            key={i}
            style={{
              transform: `scale(${starEnter})`,
              opacity: starEnter,
            }}
          >
            <Star
              size={16}
              color={GOLD}
              fill={GOLD}
              strokeWidth={1.5}
            />
          </div>
        );
      })}
    </div>
  );
};

const TestimonialCard: React.FC<{
  data: TestimonialData;
  delay: number;
  index: number;
}> = ({ data, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });
  const slideDir = index % 2 === 0 ? 50 : -50;

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 20,
        padding: "28px 26px 22px",
        border: `1px solid rgba(255,209,102,0.08)`,
        boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [slideDir, 0])}px)`,
        position: "relative",
      }}
    >
      {/* Gold quote icon */}
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 20,
          opacity: 0.3,
        }}
      >
        <Quote size={28} color={GOLD} strokeWidth={1.5} />
      </div>

      {/* Testimonial text */}
      <p
        style={{
          fontFamily: FONT_BODY,
          fontSize: 21,
          color: LIGHT_TEXT,
          margin: "0 0 18px 0",
          lineHeight: 1.5,
          paddingLeft: 10,
        }}
      >
        {`"${data.text}"`}
      </p>

      {/* Bottom row: name + stars */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 17,
              fontWeight: 700,
              color: GOLD,
            }}
          >
            {data.name}
          </span>
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: 15,
              color: SUBTLE_TEXT,
              marginRight: 8,
            }}
          >
            {" "}
            {data.studio}
          </span>
        </div>
        <StarsRow delay={delay + 12} />
      </div>
    </div>
  );
};

export const Ad18_SocialProof_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={600} opacity={0.08} />
      <RadialGlow x="70%" y="75%" size={400} color="#5b8fb9" opacity={0.04} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "60px 44px 42px",
          position: "relative",
        }}
      >
        {/* Section Label */}
        <div style={{ marginBottom: 40 }}>
          <SectionLabel text="מה אומרים עלינו" delay={5} />
        </div>

        {/* Testimonial Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            flex: 1,
          }}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i}
              data={t}
              delay={25 + i * 25}
              index={i}
            />
          ))}
        </div>

        {/* Rating Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 36,
            marginBottom: 28,
          }}
        >
          <Badge
            text="4.9 דירוג ממוצע"
            color={GOLD}
            delay={110}
            Icon={Star}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Footer delay={130} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
