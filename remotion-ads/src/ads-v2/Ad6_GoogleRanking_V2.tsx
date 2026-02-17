/**
 * Ad6 — Google Ranking V2
 * SEO/Google presence showcase
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
import { Search, Star, ExternalLink, TrendingUp } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  DARK_CARD_HOVER,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  ACCENT_BLUE,
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
  GoldButton,
  Footer,
  GoldText,
  Badge,
} from "./shared";

export const Ad6_GoogleRanking_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });
  const searchBarEnter = spring({ frame: frame - 25, fps, config: SPRING_SNAPPY });

  const results = [
    {
      title: "Studio Beat — אולפן הקלטה תל אביב",
      url: "studioz.co.il/studio-beat",
      desc: "אולפן הקלטה מקצועי בלב תל אביב. הזמן עכשיו!",
      highlighted: true,
      delay: 50,
    },
    {
      title: "אולפן הקלטה — תוצאה רגילה",
      url: "example.com/studio",
      desc: "אתר ישן ללא הזמנה אונליין...",
      highlighted: false,
      delay: 65,
    },
    {
      title: "סטודיו צילום — רשומה נוספת",
      url: "other-site.co.il/studio",
      desc: "ללא ביקורות, ללא דירוג",
      highlighted: false,
      delay: 80,
    },
  ];

  const badgeEnter = spring({ frame: frame - 120, fps, config: SPRING_SMOOTH });
  const ctaEnter = spring({ frame: frame - 145, fps, config: SPRING_BOUNCY });

  // Pulsing gold dot
  const dotPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.6, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={550} opacity={0.09} />

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
            marginBottom: 40,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          הלקוחות שלך
          {"\n"}
          <GoldText>מחפשים אותך</GoldText>
        </h1>

        {/* Google search bar mockup */}
        <div
          style={{
            backgroundColor: "#1a1f28",
            borderRadius: 28,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 24,
            border: `1px solid rgba(255,255,255,0.08)`,
            opacity: searchBarEnter,
            transform: `translateY(${interpolate(searchBarEnter, [0, 1], [20, 0])}px)`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          <Search size={22} color={SUBTLE_TEXT} strokeWidth={1.8} />
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: 19,
              color: LIGHT_TEXT,
              flex: 1,
            }}
          >
            סטודיו הקלטה תל אביב
          </span>
        </div>

        {/* Search results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          {results.map((r, i) => {
            const enter = spring({ frame: frame - r.delay, fps, config: SPRING_SNAPPY });
            return (
              <div
                key={i}
                style={{
                  backgroundColor: r.highlighted ? DARK_CARD : `${DARK_CARD}90`,
                  borderRadius: 16,
                  padding: "20px 20px",
                  border: r.highlighted
                    ? `1.5px solid ${GOLD}40`
                    : `1px solid rgba(255,255,255,0.04)`,
                  opacity: r.highlighted ? enter : enter * 0.5,
                  transform: `translateY(${interpolate(enter, [0, 1], [25, 0])}px)`,
                  boxShadow: r.highlighted
                    ? `0 6px 28px rgba(0,0,0,0.25), 0 0 30px ${GOLD}08`
                    : "0 4px 16px rgba(0,0,0,0.15)",
                  position: "relative",
                }}
              >
                {/* Pulsing gold dot for highlighted */}
                {r.highlighted && (
                  <div
                    style={{
                      position: "absolute",
                      left: 16,
                      top: 16,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: GOLD,
                      opacity: dotPulse,
                      boxShadow: `0 0 12px ${GOLD}60`,
                    }}
                  />
                )}

                {/* URL */}
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    color: r.highlighted ? SUCCESS : SUBTLE_TEXT,
                    marginBottom: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {r.highlighted && <ExternalLink size={12} color={SUCCESS} strokeWidth={2} />}
                  {r.url}
                </div>

                {/* Title */}
                <div
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: r.highlighted ? 22 : 18,
                    fontWeight: 700,
                    color: r.highlighted ? ACCENT_BLUE : `${LIGHT_TEXT}80`,
                    marginBottom: 6,
                  }}
                >
                  {r.title}
                </div>

                {/* Description */}
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 15,
                    color: r.highlighted ? SUBTLE_TEXT : `${SUBTLE_TEXT}70`,
                  }}
                >
                  {r.desc}
                </div>

                {/* Stars for highlighted */}
                {r.highlighted && (
                  <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} color={GOLD} fill={GOLD} strokeWidth={1} />
                    ))}
                    <span
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: 13,
                        color: SUBTLE_TEXT,
                        marginRight: 6,
                      }}
                    >
                      4.9
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          <div
            style={{
              opacity: badgeEnter,
              transform: `translateY(${interpolate(badgeEnter, [0, 1], [12, 0])}px)`,
            }}
          >
            <Badge text="87% מהלקוחות מתחילים בגוגל" color={GOLD} delay={0} Icon={TrendingUp} />
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
            <GoldButton text="קבל נוכחות דיגיטלית" delay={0} size="md" />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Footer delay={150} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
