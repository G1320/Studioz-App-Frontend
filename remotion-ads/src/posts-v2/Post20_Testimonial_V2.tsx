import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Star } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";

const RTL: React.CSSProperties = { direction: "rtl" };

const testimonials = [
  {
    quote:
      "״מאז שעברתי לסטודיוז, אני לא מרים טלפון בשביל הזמנות. הכל רץ לבד.״",
    name: "יוסי, סטודיו 1320 ירושלים",
  },
  {
    quote:
      "״ההגנה מביטולים לבד שווה את כל המערכת. חוסך לי אלפי שקלים בחודש.״",
    name: "מרדכי, אולפן הקלטות תל אביב",
  },
  {
    quote:
      "״הלקוחות שלי אוהבים את עמוד ההזמנות. מקצועי, נוח, ועובד 24/7.״",
    name: "דנה, סטודיו צילום חיפה",
  },
];

export const Post20_Testimonial_V2: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        ...RTL,
        backgroundColor: DARK_BG,
        fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
        padding: "60px 60px 50px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Headline */}
      <div
        style={{
          fontFamily: "'DM Sans', 'Heebo', sans-serif",
          fontSize: 52,
          fontWeight: 800,
          lineHeight: 1.2,
          color: LIGHT_TEXT,
          marginBottom: 32,
        }}
      >
        מה אומרים
        <br />
        <span style={{ color: GOLD }}>בעלי הסטודיו?</span>
      </div>

      {/* Testimonial cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          flex: 1,
        }}
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            style={{
              backgroundColor: DARK_CARD,
              borderRadius: 16,
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* Stars */}
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={18} color={GOLD} fill={GOLD} />
              ))}
            </div>

            {/* Quote mark + text */}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 48,
                  lineHeight: 0.8,
                  color: GOLD,
                  opacity: 0.6,
                  flexShrink: 0,
                  marginTop: 4,
                }}
              >
                &ldquo;
              </span>
              <span
                style={{
                  color: LIGHT_TEXT,
                  fontSize: 19,
                  lineHeight: 1.5,
                }}
              >
                {t.quote}
              </span>
            </div>

            {/* Name */}
            <div
              style={{
                color: SUBTLE_TEXT,
                fontSize: 16,
                textAlign: "left",
                paddingRight: 58,
              }}
            >
              — {t.name}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 20,
        }}
      >
        <span style={{ color: SUBTLE_TEXT, fontSize: 18 }}>studioz.co.il</span>
        <Img
          src={staticFile("logo.png")}
          style={{ width: 36, height: 36, borderRadius: 8 }}
        />
      </div>
    </AbsoluteFill>
  );
};
