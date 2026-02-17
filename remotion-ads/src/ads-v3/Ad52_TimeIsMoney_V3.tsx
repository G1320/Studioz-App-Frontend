/**
 * Ad52 — Time Is Money V3
 * Hourly rate calculation: 6 hours × ₪150/hr = ₪900 lost/day
 * Then Studioz saving: 45 min only → ₪27,000 saved/month
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RED,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  CTAScene,
  SectionLabel,
} from "./shared";
import { Calculator, TrendingDown, TrendingUp, ArrowDown } from "lucide-react";

/* ─── Calculation Line ─── */
const CalcLine: React.FC<{
  left: string;
  operator: string;
  right: string;
  result?: string;
  delay: number;
  color: string;
  isResult?: boolean;
}> = ({ left, operator, right, result, delay, color, isResult }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: isResult ? 32 : 26,
          fontWeight: 700,
          color: isResult ? color : LIGHT_TEXT,
        }}
      >
        {left}
      </span>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 22,
          color: SUBTLE_TEXT,
        }}
      >
        {operator}
      </span>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: isResult ? 32 : 26,
          fontWeight: 700,
          color: isResult ? color : LIGHT_TEXT,
        }}
      >
        {right}
      </span>
      {result && (
        <>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 22,
              color: SUBTLE_TEXT,
            }}
          >
            =
          </span>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 32,
              fontWeight: 700,
              color,
              filter: `drop-shadow(0 0 10px ${color}30)`,
            }}
          >
            {result}
          </span>
        </>
      )}
    </div>
  );
};

/* ─── Big Number Card ─── */
const BigNumber: React.FC<{
  value: string;
  label: string;
  color: string;
  delay: number;
  Icon?: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
}> = ({ value, label, color, delay, Icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 22,
        padding: "32px 30px",
        border: `2px solid ${color}25`,
        textAlign: "center",
        transform: `scale(${enter})`,
        opacity: enter,
        boxShadow: `0 8px 40px rgba(0,0,0,0.3), 0 0 30px ${color}08`,
      }}
    >
      {Icon && (
        <div style={{ marginBottom: 12 }}>
          <Icon size={28} color={color} strokeWidth={1.8} />
        </div>
      )}
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 56,
          fontWeight: 700,
          color,
          marginBottom: 8,
          filter: `drop-shadow(0 0 15px ${color}25)`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: 20,
          color: SUBTLE_TEXT,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ─── Scene 1: Cost Calculation ─── */
const CostScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} color={RED} />
      <RadialGlow x="50%" y="30%" size={500} color={RED} opacity={0.05} />

      <div
        style={{
          padding: "70px 42px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <SectionLabel text="חשבון פשוט" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "18px 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          כמה <GoldText>עולה לך</GoldText> הניהול?
        </h2>

        <div style={{ marginBottom: 40 }}>
          <GoldLine width={140} delay={8} />
        </div>

        {/* Calculator card */}
        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 22,
            padding: "32px 30px",
            border: `1px solid ${RED}15`,
            width: "100%",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
            }}
          >
            <Calculator size={22} color={RED} strokeWidth={1.8} />
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 20,
                fontWeight: 600,
                color: RED,
              }}
            >
              ניהול ידני — העלות האמיתית
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <CalcLine
              left="6 שעות"
              operator="×"
              right="₪150/שעה"
              delay={18}
              color={LIGHT_TEXT}
            />
            <div
              style={{
                height: 2,
                backgroundColor: `${RED}20`,
                margin: "4px 40px",
                opacity: interpolate(frame, [30, 40], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            />
            <CalcLine
              left=""
              operator=""
              right="₪900"
              result="אבוד/יום"
              delay={35}
              color={RED}
              isResult
            />
          </div>
        </div>

        {/* Monthly loss */}
        <div style={{ marginTop: 30 }}>
          <BigNumber
            value="₪27,000"
            label="הולך לפח כל חודש 💸"
            color={RED}
            delay={50}
            Icon={TrendingDown}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Savings ─── */
const SavingsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={500} color={SUCCESS} opacity={0.06} />

      <div
        style={{
          padding: "70px 42px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "0 0 10px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          עם <GoldText>Studioz</GoldText>
        </h2>

        <div style={{ marginBottom: 40 }}>
          <GoldLine width={140} delay={5} />
        </div>

        {/* Savings card */}
        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 22,
            padding: "32px 30px",
            border: `1px solid ${SUCCESS}15`,
            width: "100%",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <TrendingUp size={22} color={SUCCESS} strokeWidth={1.8} />
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 20,
                fontWeight: 600,
                color: SUCCESS,
              }}
            >
              ניהול אוטומטי — חיסכון אמיתי
            </span>
          </div>

          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 38,
              fontWeight: 700,
              color: SUCCESS,
              textAlign: "center",
              marginBottom: 10,
              filter: `drop-shadow(0 0 12px ${SUCCESS}30)`,
            }}
          >
            45 דק׳ בלבד
          </div>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 20,
              color: SUBTLE_TEXT,
              textAlign: "center",
            }}
          >
            במקום 6 שעות ביום
          </div>
        </div>

        {/* Monthly savings highlight */}
        <div
          style={{
            backgroundColor: `${GOLD}08`,
            border: `2px solid ${GOLD}25`,
            borderRadius: 22,
            padding: "30px 36px",
            textAlign: "center",
            width: "100%",
            opacity: interpolate(frame, [40, 60], [0, 1], {
              extrapolateRight: "clamp",
            }),
            transform: `scale(${interpolate(frame, [40, 60], [0.85, 1], {
              extrapolateRight: "clamp",
            })})`,
            boxShadow: `0 0 50px ${GOLD}08`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 58,
              fontWeight: 700,
              color: GOLD,
              filter: `drop-shadow(0 0 18px ${GOLD}30)`,
            }}
          >
            ₪27,000
          </div>
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 26,
              fontWeight: 600,
              color: SUCCESS,
              marginTop: 8,
            }}
          >
            חיסכון כל חודש! 🚀
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const MoneyCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        הפסק להפסיד כסף
        {"\n"}
        <GoldText>התחל לחסוך</GoldText>
      </>
    }
    buttonText="חסוך ₪27,000/חודש"
    freeText="התחל בחינם — ₪0/חודש"
    subText="החזר ההשקעה מהיום הראשון"
  />
);

/* ─── Main Composition ─── */
export const Ad52_TimeIsMoney_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={100} premountFor={10}>
        <CostScene />
      </Sequence>
      <Sequence from={100} durationInFrames={80} premountFor={15}>
        <SavingsScene />
      </Sequence>
      <Sequence from={180} durationInFrames={60} premountFor={15}>
        <MoneyCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
