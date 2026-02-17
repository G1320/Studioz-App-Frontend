/**
 * Ad20 — Multi Location V2
 * Multi-studio management showcase
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
import { MapPin, Layers, Users, BarChart3 } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  DARK_CARD_HOVER,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  ACCENT_BLUE,
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
  GoldText,
  Headline,
  FeatureCard,
  Badge,
  Footer,
} from "./shared";

interface LocationData {
  city: string;
  bookings: number;
}

const locations: LocationData[] = [
  { city: "תל אביב", bookings: 48 },
  { city: "ירושלים", bookings: 32 },
  { city: "חיפה", bookings: 27 },
  { city: "באר שבע", bookings: 19 },
];

const LocationCard: React.FC<{
  data: LocationData;
  index: number;
  delay: number;
}> = ({ data, index, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });
  const offset = index * 8;

  return (
    <div
      style={{
        backgroundColor: index === 0 ? DARK_CARD_HOVER : DARK_CARD,
        borderRadius: 16,
        padding: "18px 22px",
        border: `1px solid ${index === 0 ? `${GOLD}20` : "rgba(255,209,102,0.07)"}`,
        boxShadow: `0 ${4 + index * 2}px ${16 + index * 4}px rgba(0,0,0,${0.2 + index * 0.05})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [30 + offset, 0])}px)`,
        marginBottom: -6,
        position: "relative",
        zIndex: 4 - index,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor: `${GOLD}10`,
            border: `1px solid ${GOLD}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MapPin size={18} color={GOLD} strokeWidth={1.8} />
        </div>
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 20,
            fontWeight: 600,
            color: LIGHT_TEXT,
          }}
        >
          {data.city}
        </span>
      </div>

      {/* Booking count badge */}
      <div
        style={{
          backgroundColor: `${ACCENT_BLUE}18`,
          border: `1px solid ${ACCENT_BLUE}25`,
          borderRadius: 10,
          padding: "6px 14px",
        }}
      >
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: 14,
            color: ACCENT_BLUE,
            fontWeight: 600,
          }}
        >
          {data.bookings} הזמנות
        </span>
      </div>
    </div>
  );
};

export const Ad20_MultiLocation_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="60%" y="40%" size={600} opacity={0.09} />
      <RadialGlow x="25%" y="70%" size={400} color="#5b8fb9" opacity={0.05} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "60px 44px 42px",
          position: "relative",
        }}
      >
        {/* Headline */}
        <Headline delay={5} size={58} align="center">
          {"כמה סטודיואים?"}
          {"\n"}
          <GoldText>פלטפורמה אחת.</GoldText>
        </Headline>

        {/* Location Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 44,
            gap: 0,
          }}
        >
          {locations.map((loc, i) => (
            <LocationCard
              key={i}
              data={loc}
              index={i}
              delay={30 + i * 15}
            />
          ))}
        </div>

        {/* Feature Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 40,
          }}
        >
          <FeatureCard
            Icon={Layers}
            title="ניהול מרוכז"
            delay={95}
          />
          <FeatureCard
            Icon={Users}
            title="צוות לכל סניף"
            delay={110}
          />
          <FeatureCard
            Icon={BarChart3}
            title="דוחות לפי מיקום"
            delay={125}
          />
        </div>

        {/* Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 32,
          }}
        >
          <Badge text="ללא הגבלת סניפים" color={SUCCESS} delay={145} />
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Footer delay={160} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
