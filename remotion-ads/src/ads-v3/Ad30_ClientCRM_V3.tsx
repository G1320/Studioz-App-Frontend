/**
 * Ad30 — Client CRM V3
 * Client cards with history and profile animations
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
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldText,
  EmojiFeature,
  CTAScene,
} from "./shared";

/* ─── Client Profile Card ─── */
const ClientCard: React.FC<{
  initials: string;
  name: string;
  bookings: number;
  revenue: string;
  rating: number;
  color: string;
  delay: number;
  expanded?: boolean;
}> = ({ initials, name, bookings, revenue, rating, color, delay, expanded = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });
  const expandAnim = expanded
    ? spring({ frame: frame - delay - 20, fps, config: { damping: 14 } })
    : 0;

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 20,
        padding: expanded ? "28px 24px" : "22px 24px",
        border: `1px solid ${color}${expanded ? "25" : "12"}`,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [60, 0])}px)`,
        boxShadow: expanded
          ? `0 12px 40px rgba(0,0,0,0.4), 0 0 20px ${color}08`
          : "0 6px 28px rgba(0,0,0,0.25)",
        ...RTL,
      }}
    >
      {/* Top row: avatar + name + stats */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: `${color}18`,
            border: `2px solid ${color}35`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color }}>
            {initials}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: LIGHT_TEXT }}>
            {name}
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: SUBTLE_TEXT, marginTop: 2 }}>
            {bookings} הזמנות · {revenue}
          </div>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ fontSize: 16, opacity: i < rating ? 1 : 0.2 }}>
              ⭐
            </span>
          ))}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: `1px solid ${color}12`,
            display: "flex",
            gap: 16,
            opacity: expandAnim,
            transform: `translateY(${interpolate(expandAnim, [0, 1], [10, 0])}px)`,
          }}
        >
          <div
            style={{
              flex: 1,
              backgroundColor: `${color}08`,
              borderRadius: 12,
              padding: "12px 16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT }}>הזמנה אחרונה</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 600, color: LIGHT_TEXT, marginTop: 4 }}>
              15.02.2026
            </div>
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: `${SUCCESS}08`,
              borderRadius: 12,
              padding: "12px 16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT }}>סה״כ שולם</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 600, color: SUCCESS, marginTop: 4 }}>
              {revenue}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: `${ACCENT_BLUE}08`,
              borderRadius: 12,
              padding: "12px 16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT }}>העדפה</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 16, fontWeight: 600, color: ACCENT_BLUE, marginTop: 4 }}>
              חדר A
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Scene 1: Client CRM ─── */
const CRMScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.07} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 20,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 3,
            opacity: headEnter,
          }}
        >
          👤 ניהול לקוחות
        </span>
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "16px 50px 0",
            lineHeight: 1.3,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          הכר את הלקוחות{"\n"}
          <GoldText>שלך לעומק</GoldText>
        </h2>
      </div>

      {/* Client cards */}
      <div
        style={{
          position: "absolute",
          top: 310,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <ClientCard
          initials="נכ"
          name="נועם כהן"
          bookings={24}
          revenue="₪8,640"
          rating={5}
          color={GOLD}
          delay={15}
          expanded
        />
        <ClientCard
          initials="דל"
          name="דנה לוי"
          bookings={12}
          revenue="₪4,320"
          rating={4}
          color={ACCENT_BLUE}
          delay={30}
        />
        <ClientCard
          initials="אב"
          name="אורי ביטון"
          bookings={8}
          revenue="₪2,880"
          rating={5}
          color={SUCCESS}
          delay={45}
        />
      </div>

      {/* Feature pills */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          padding: "0 30px",
          ...RTL,
        }}
      >
        <EmojiFeature emoji="📋" label="היסטוריית הזמנות" delay={55} />
        <EmojiFeature emoji="💬" label="תקשורת" delay={63} />
        <EmojiFeature emoji="⭐" label="העדפות" delay={71} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const CRMCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        בנה קשרי לקוחות{"\n"}
        <GoldText>חזקים ואישיים</GoldText>
      </>
    }
    buttonText="התחל לנהל לקוחות"
    freeText="חינם לתמיד — כל התכונות כלולות"
    subText="CRM מלא · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad30_ClientCRM_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <CRMScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <CRMCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
