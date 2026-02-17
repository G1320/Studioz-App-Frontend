/**
 * Ad21 — Payment Methods V2
 * Payment options showcase in 2x3 grid
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
import {
  CreditCard,
  Smartphone,
  Wallet,
  Banknote,
  QrCode,
  ShieldCheck,
  Lock,
} from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldText,
  Headline,
  Badge,
  Footer,
} from "./shared";

interface PaymentMethod {
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  name: string;
}

const methods: PaymentMethod[] = [
  { Icon: CreditCard, name: "כרטיס אשראי" },
  { Icon: Smartphone, name: "ביט" },
  { Icon: Wallet, name: "PayPal" },
  { Icon: Banknote, name: "העברה בנקאית" },
  { Icon: QrCode, name: "Apple Pay" },
  { Icon: ShieldCheck, name: "תשלום מאובטח" },
];

const PaymentCard: React.FC<{
  method: PaymentMethod;
  delay: number;
  index: number;
}> = ({ method, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SNAPPY });
  const hover = interpolate(
    Math.sin(frame * 0.03 + index * 1.2),
    [-1, 1],
    [0, 3]
  );

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 18,
        padding: "28px 16px",
        border: `1px solid rgba(255,209,102,0.08)`,
        boxShadow: `0 6px 24px rgba(0,0,0,0.25)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.8, 1])}) translateY(${interpolate(enter, [0, 1], [20, 0]) - hover}px)`,
        flex: 1,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          backgroundColor: `${GOLD}10`,
          border: `1px solid ${GOLD}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <method.Icon size={26} color={GOLD} strokeWidth={1.6} />
      </div>
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 17,
          fontWeight: 600,
          color: LIGHT_TEXT,
          textAlign: "center",
        }}
      >
        {method.name}
      </span>
    </div>
  );
};

export const Ad21_PaymentMethods_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="45%" size={700} opacity={0.09} />
      <RadialGlow x="70%" y="25%" size={400} color="#5b8fb9" opacity={0.04} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "60px 40px 42px",
          position: "relative",
        }}
      >
        {/* Headline */}
        <div style={{ textAlign: "center" }}>
          <Headline delay={5} size={56} align="center">
            {"כל דרכי התשלום."}
            {"\n"}
            <GoldText>במקום אחד.</GoldText>
          </Headline>
        </div>

        {/* 2x3 Grid */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 48,
            flex: 1,
          }}
        >
          {/* Row 1 */}
          <div style={{ display: "flex", gap: 14 }}>
            <PaymentCard method={methods[0]} delay={35} index={0} />
            <PaymentCard method={methods[1]} delay={45} index={1} />
          </div>
          {/* Row 2 */}
          <div style={{ display: "flex", gap: 14 }}>
            <PaymentCard method={methods[2]} delay={55} index={2} />
            <PaymentCard method={methods[3]} delay={65} index={3} />
          </div>
          {/* Row 3 */}
          <div style={{ display: "flex", gap: 14 }}>
            <PaymentCard method={methods[4]} delay={75} index={4} />
            <PaymentCard method={methods[5]} delay={85} index={5} />
          </div>
        </div>

        {/* Security Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 32,
            marginBottom: 24,
          }}
        >
          <Badge
            text="SSL מוצפן ומאובטח"
            color={SUCCESS}
            delay={120}
            Icon={Lock}
          />
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Footer delay={140} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
