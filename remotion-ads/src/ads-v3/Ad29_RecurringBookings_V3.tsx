/**
 * Ad29 — Recurring Bookings V3
 * Calendar showing repeated booking pattern
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

/* ─── Calendar Day Cell ─── */
const CalendarDay: React.FC<{
  day: number;
  hasBooking?: boolean;
  isRecurring?: boolean;
  delay: number;
}> = ({ day, hasBooking = false, isRecurring = false, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 100 } });
  const bookingEnter = hasBooking
    ? spring({ frame: frame - delay - 15, fps, config: SPRING_BOUNCY })
    : 0;

  return (
    <div
      style={{
        width: 120,
        height: 110,
        borderRadius: 14,
        backgroundColor: hasBooking ? `${GOLD}10` : `${DARK_CARD}`,
        border: `1px solid ${hasBooking ? `${GOLD}25` : "rgba(255,255,255,0.04)"}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: enter,
        transform: `scale(${enter})`,
        position: "relative",
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 22,
          fontWeight: 600,
          color: hasBooking ? LIGHT_TEXT : SUBTLE_TEXT,
        }}
      >
        {day}
      </span>
      {hasBooking && (
        <div
          style={{
            width: 40,
            height: 6,
            borderRadius: 3,
            backgroundColor: GOLD,
            opacity: bookingEnter,
            transform: `scaleX(${bookingEnter})`,
            boxShadow: `0 0 8px ${GOLD}30`,
          }}
        />
      )}
      {isRecurring && (
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            fontSize: 14,
            opacity: bookingEnter,
          }}
        >
          🔄
        </div>
      )}
    </div>
  );
};

/* ─── Scene 1: Calendar Pattern ─── */
const CalendarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: { damping: 14 } });

  /* Week data: which days have recurring bookings */
  const weeks = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
  ];
  const recurringDays = new Set([2, 5, 9, 12, 16, 19, 23, 26]); // Tue + Fri pattern

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={10} />
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
          🔄 הזמנות חוזרות
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
          הכנסה קבועה{"\n"}
          <GoldText>כל שבוע מחדש</GoldText>
        </h2>
      </div>

      {/* Day labels */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 50,
          right: 50,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 10px",
        }}
      >
        {["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"].map((d, i) => (
          <span
            key={i}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 16,
              color: SUBTLE_TEXT,
              width: 120,
              textAlign: "center",
            }}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
            {week.map((day) => (
              <CalendarDay
                key={day}
                day={day}
                hasBooking={recurringDays.has(day)}
                isRecurring={recurringDays.has(day)}
                delay={10 + wi * 6 + (recurringDays.has(day) ? 5 : 0)}
              />
            ))}
          </div>
        ))}
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
        <EmojiFeature emoji="📅" label="תדירות גמישה" delay={55} />
        <EmojiFeature emoji="💰" label="הכנסה קבועה" delay={63} />
        <EmojiFeature emoji="✅" label="אישור אוטומטי" delay={71} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const RecurringCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        בנה הכנסה{"\n"}
        <GoldText>צפויה וקבועה</GoldText>
      </>
    }
    buttonText="הפעל הזמנות חוזרות"
    freeText="התחל בחינם — ₪0/חודש"
    subText="הגדרה פשוטה · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad29_RecurringBookings_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <CalendarScene />
      </Sequence>
      <Sequence from={150} durationInFrames={90} premountFor={15}>
        <RecurringCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
