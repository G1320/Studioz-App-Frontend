import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { UserPlus, Settings, Palette, Rocket, Clock } from "lucide-react";

const GOLD = "#ffd166";
const DARK_BG = "#0a0e14";
const DARK_CARD = "#13171d";
const LIGHT_TEXT = "#e2e8f0";
const SUBTLE_TEXT = "#aab2be";
const SUCCESS = "#6b9e82";
const RED = "#b55a5a";

const RTL: React.CSSProperties = { direction: "rtl" };

const steps = [
  {
    num: 1,
    icon: UserPlus,
    title: "צור חשבון",
    subtitle: "רישום חינמי ב-30 שניות",
    isLast: false,
  },
  {
    num: 2,
    icon: Settings,
    title: "הגדר שירותים",
    subtitle: "הוסף שירותים, מחירים וזמנים",
    isLast: false,
  },
  {
    num: 3,
    icon: Palette,
    title: "עצב את העמוד",
    subtitle: "לוגו, צבעים ותמונות",
    isLast: false,
  },
  {
    num: 4,
    icon: Rocket,
    title: "התחל לקבל הזמנות!",
    subtitle: "אתה באוויר",
    isLast: true,
  },
];

export const Post22_QuickSetup_V2: React.FC = () => {
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
          marginBottom: 8,
        }}
      >
        מוכן ב-5 דקות.
        <br />
        <span style={{ color: GOLD }}>באמת.</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 22,
          color: SUBTLE_TEXT,
          marginBottom: 36,
        }}
      >
        4 צעדים פשוטים והסטודיו שלך אונליין
      </div>

      {/* Steps */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          flex: 1,
        }}
      >
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                {/* Gold circle with number */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: step.isLast ? SUCCESS : GOLD,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', 'Heebo', sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      color: DARK_BG,
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Card */}
                <div
                  style={{
                    flex: 1,
                    backgroundColor: DARK_CARD,
                    borderRadius: 14,
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    border: step.isLast ? `2px solid ${SUCCESS}` : "none",
                  }}
                >
                  <Icon
                    size={24}
                    color={step.isLast ? SUCCESS : GOLD}
                    style={{ flexShrink: 0 }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span
                      style={{
                        color: LIGHT_TEXT,
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      {step.title}
                    </span>
                    <span
                      style={{
                        color: SUBTLE_TEXT,
                        fontSize: 16,
                      }}
                    >
                      {step.subtitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dotted connecting line */}
              {i < steps.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingRight: 22,
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 20,
                      backgroundImage: `repeating-linear-gradient(to bottom, ${GOLD} 0px, ${GOLD} 4px, transparent 4px, transparent 8px)`,
                      marginRight: 0,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Time badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginTop: 24,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: DARK_CARD,
            borderRadius: 30,
            padding: "12px 28px",
            border: `1px solid ${GOLD}33`,
          }}
        >
          <Clock size={20} color={GOLD} />
          <span
            style={{
              color: GOLD,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            5:00 דקות ממוצע
          </span>
        </div>
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
