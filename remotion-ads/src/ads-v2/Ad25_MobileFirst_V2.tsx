/**
 * Ad25 — Mobile First V2
 * Responsive design showcase with 3D phone mockup
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Smartphone, Tablet, Monitor, Calendar, Clock, BarChart3 } from "lucide-react";
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
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  Headline,
  GoldText,
  Badge,
  Footer,
  SceneWrapper,
} from "./shared";

/* ─── Phone Mockup ─── */
const PhoneMockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 10, fps, config: SPRING_BOUNCY });
  const tiltY = interpolate(enter, [0, 1], [-15, 0]);
  const floatY = interpolate(Math.sin(frame * 0.04), [-1, 1], [-6, 6]);

  // Mini UI elements inside the phone
  const uiEnter = spring({ frame: frame - 30, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        perspective: 1200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 320,
          height: 560,
          backgroundColor: DARK_CARD,
          borderRadius: 36,
          border: `2px solid rgba(255,209,102,0.15)`,
          boxShadow: `0 20px 80px rgba(0,0,0,0.6), 0 0 60px ${GOLD}08`,
          overflow: "hidden",
          position: "relative",
          transform: `rotateY(${tiltY}deg) translateY(${floatY}px) scale(${interpolate(enter, [0, 1], [0.7, 1])})`,
          opacity: interpolate(enter, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {/* Notch */}
        <div
          style={{
            width: 140,
            height: 28,
            backgroundColor: DARK_BG,
            borderRadius: "0 0 18px 18px",
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        />

        {/* Status bar area */}
        <div style={{ height: 44, backgroundColor: DARK_BG }} />

        {/* Phone content */}
        <div
          style={{
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            opacity: uiEnter,
            transform: `translateY(${interpolate(uiEnter, [0, 1], [20, 0])}px)`,
          }}
        >
          {/* Mini calendar grid */}
          <div
            style={{
              backgroundColor: DARK_CARD_HOVER,
              borderRadius: 14,
              padding: "12px 10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Calendar size={14} color={GOLD} strokeWidth={2} />
              <span style={{ fontFamily: FONT_HEADING, fontSize: 11, color: LIGHT_TEXT, fontWeight: 600 }}>
                לוח הזמנות
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
              {Array.from({ length: 21 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 28,
                    height: 24,
                    borderRadius: 6,
                    backgroundColor: i === 8 || i === 15 ? GOLD : "rgba(255,255,255,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 9,
                      color: i === 8 || i === 15 ? DARK_BG : SUBTLE_TEXT,
                      fontWeight: i === 8 || i === 15 ? 700 : 400,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini booking card */}
          <div
            style={{
              backgroundColor: DARK_CARD_HOVER,
              borderRadius: 14,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderRight: `3px solid ${GOLD}`,
            }}
          >
            <Clock size={14} color={ACCENT_BLUE} strokeWidth={2} />
            <div>
              <div style={{ fontFamily: FONT_HEADING, fontSize: 11, color: LIGHT_TEXT, fontWeight: 600 }}>
                סטודיו A — 14:00
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 9, color: SUBTLE_TEXT }}>
                אורי כהן · 2 שעות
              </div>
            </div>
          </div>

          {/* Mini stats row */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "הזמנות", val: "24", color: GOLD },
              { label: "הכנסות", val: "₪8.2K", color: SUCCESS },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: DARK_CARD_HOVER,
                  borderRadius: 12,
                  padding: "10px 10px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: FONT_HEADING, fontSize: 16, color: stat.color, fontWeight: 700 }}>
                  {stat.val}
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 9, color: SUBTLE_TEXT }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Mini bar chart */}
          <div
            style={{
              backgroundColor: DARK_CARD_HOVER,
              borderRadius: 14,
              padding: "12px 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <BarChart3 size={14} color={GOLD} strokeWidth={2} />
              <span style={{ fontFamily: FONT_HEADING, fontSize: 11, color: LIGHT_TEXT, fontWeight: 600 }}>
                סטטיסטיקות
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 40 }}>
              {[0.4, 0.6, 0.8, 0.5, 0.9, 0.7, 1.0].map((h, i) => {
                const barEnter = spring({ frame: frame - 40 - i * 3, fps, config: SPRING_SNAPPY });
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: h * 40 * barEnter,
                      borderRadius: 4,
                      background: i === 6 ? GOLD : `${GOLD}30`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Floating Device Icon ─── */
const DeviceIcon: React.FC<{
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  x: number;
  y: number;
  delay: number;
}> = ({ Icon, x, y, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });
  const floatY = interpolate(Math.sin(frame * 0.05 + delay), [-1, 1], [-5, 5]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 56,
        height: 56,
        borderRadius: "50%",
        backgroundColor: DARK_CARD,
        border: `1px solid ${GOLD}20`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 20px ${GOLD}08`,
        transform: `scale(${enter}) translateY(${floatY}px)`,
        opacity: enter,
      }}
    >
      <Icon size={24} color={GOLD} strokeWidth={1.8} />
    </div>
  );
};

/* ─── Main Ad ─── */
export const Ad25_MobileFirst_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneWrapper glowX="50%" glowY="45%" glowColor={GOLD}>
      {/* Headline */}
      <Sequence from={0} durationInFrames={240}>
        <div style={{ marginBottom: 24 }}>
          <Headline delay={5}>
            {"עובד מושלם"}
            {"\n"}
            <GoldText>מכל מכשיר</GoldText>
          </Headline>
        </div>
      </Sequence>

      {/* Gold line */}
      <Sequence from={12} durationInFrames={228}>
        <div style={{ marginBottom: 30, display: "flex", justifyContent: "flex-end" }}>
          <GoldLine delay={12} width={100} />
        </div>
      </Sequence>

      {/* Phone + floating device icons */}
      <Sequence from={8} durationInFrames={232} premountFor={8}>
        <div style={{ flex: 1, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <PhoneMockup />
          <DeviceIcon Icon={Smartphone} x={80} y={120} delay={40} />
          <DeviceIcon Icon={Tablet} x={820} y={200} delay={48} />
          <DeviceIcon Icon={Monitor} x={120} y={600} delay={56} />
        </div>
      </Sequence>

      {/* Badge */}
      <Sequence from={50} durationInFrames={190} premountFor={10}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Badge text="רספונסיבי ב-100%" delay={50} color={SUCCESS} Icon={Smartphone} />
        </div>
      </Sequence>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 10 }}>
        <Footer delay={60} />
      </div>
    </SceneWrapper>
  );
};

export default Ad25_MobileFirst_V2;
