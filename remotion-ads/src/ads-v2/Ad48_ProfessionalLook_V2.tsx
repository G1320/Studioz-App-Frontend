import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Star, CalendarDays, Music, Phone } from "lucide-react";
import {
  GOLD, DARK_BG, DARK_CARD, LIGHT_TEXT, SUBTLE_TEXT, RED, SUCCESS, RTL,
  FONT_HEADING, FONT_BODY, FONT_MONO, SPRING_SMOOTH,
  NoiseOverlay, AmbientParticles, RadialGlow, Footer, Badge, GoldText,
} from "./shared";

export const Ad48_ProfessionalLook_V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={500} opacity={0.08} />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 48px 42px" }}>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 56, fontWeight: 700, color: LIGHT_TEXT, margin: "0 0 10px", lineHeight: 1.18, opacity: headEnter, transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)` }}>
          נראות מקצועית.{"\n"}<GoldText>רושם ראשוני חזק.</GoldText>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 20, color: SUBTLE_TEXT, margin: "0 0 28px", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          הלקוחות שלך ישימו לב
        </p>

        <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
          {/* Without Studioz */}
          <div style={{
            flex: 1, backgroundColor: DARK_CARD, borderRadius: 18, padding: "20px 18px",
            border: `1px solid ${RED}15`, opacity: spring({ frame: frame - 25, fps, config: SPRING_SMOOTH }),
            boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
          }}>
            <div style={{ fontFamily: FONT_HEADING, fontSize: 14, fontWeight: 700, color: RED, marginBottom: 16 }}>בלי סטודיוז</div>
            <div style={{
              backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "18px 14px",
              border: "1px dashed rgba(255,255,255,0.08)",
            }}>
              <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: LIGHT_TEXT, marginBottom: 8 }}>סטודיו הקלטה</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: SUBTLE_TEXT, marginBottom: 12, lineHeight: 1.6 }}>
                התקשרו 054-1234567{"\n"}או שלחו וואטסאפ
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.5 }}>
                <Phone size={12} color={SUBTLE_TEXT} strokeWidth={2} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: SUBTLE_TEXT }}>זמין בשעות 9-17</span>
              </div>
            </div>
          </div>

          {/* With Studioz */}
          <div style={{
            flex: 1, backgroundColor: DARK_CARD, borderRadius: 18, padding: "20px 18px",
            border: `1px solid ${GOLD}20`, opacity: spring({ frame: frame - 40, fps, config: SPRING_SMOOTH }),
            boxShadow: `0 6px 24px rgba(0,0,0,0.25), 0 0 20px ${GOLD}08`,
          }}>
            <div style={{ fontFamily: FONT_HEADING, fontSize: 14, fontWeight: 700, color: GOLD, marginBottom: 16 }}>עם סטודיוז</div>
            <div style={{
              backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "18px 14px",
              border: `1px solid ${GOLD}10`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${GOLD}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Music size={14} color={GOLD} strokeWidth={1.8} />
                </div>
                <div style={{ fontFamily: FONT_HEADING, fontSize: 16, fontWeight: 700, color: LIGHT_TEXT }}>אולפני גולד</div>
              </div>
              <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} color={GOLD} fill={GOLD} strokeWidth={0} />)}
                <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: GOLD, marginRight: 4 }}>4.9</span>
              </div>
              <div style={{
                backgroundColor: GOLD, borderRadius: 8, padding: "8px 14px", textAlign: "center",
              }}>
                <span style={{ fontFamily: FONT_HEADING, fontSize: 13, fontWeight: 700, color: DARK_BG }}>הזמן עכשיו</span>
              </div>
            </div>
          </div>
        </div>

        <Badge text="עמוד מקצועי בדקות" color={SUCCESS} delay={80} Icon={Star} />

        <div style={{ flex: 1 }} />
        <Footer delay={100} />
      </div>
    </AbsoluteFill>
  );
};
