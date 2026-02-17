import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import {
  MessageCircle,
  Table2,
  Calculator,
  UserX,
  Rocket,
  BarChart3,
  CreditCard,
  ShieldCheck,
  ArrowDown,
  X,
  Check
} from 'lucide-react';

const GOLD = '#ffd166';
const DARK_BG = '#0a0e14';
const DARK_CARD = '#13171d';
const LIGHT_TEXT = '#e2e8f0';
const SUBTLE_TEXT = '#aab2be';
const RED = '#b55a5a';
const RTL: React.CSSProperties = { direction: 'rtl' };

export const Post6_WhyWeBuilt_V2: React.FC = () => {
  const before = [
    { Icon: MessageCircle, text: 'הזמנות בוואטסאפ' },
    { Icon: Table2, text: 'יומן בגוגל' },
    { Icon: Calculator, text: 'חשבוניות ידניות' },
    { Icon: UserX, text: 'ביטולים בלי פיצוי' }
  ];
  const after = [
    { Icon: Rocket, text: 'הזמנות אוטומטיות 24/7' },
    { Icon: BarChart3, text: 'דשבורד חכם בזמן אמת' },
    { Icon: CreditCard, text: 'סליקה ותשלומים מובנים' },
    { Icon: ShieldCheck, text: 'הגנה אוטומטית מביטולים' }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '60px 55px 50px'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Img src={staticFile('logo.png')} style={{ width: 44, height: 44, borderRadius: 10, marginBottom: 16 }} />
          <h1
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 62,
              fontWeight: 700,
              color: LIGHT_TEXT,
              margin: '0 0 10px',
              lineHeight: 1.3
            }}
          >
            למה בנינו את <span style={{ color: GOLD }}>סטודיוז</span>?
          </h1>
          <p
            style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: SUBTLE_TEXT, margin: 0 }}
          >
            כי ידענו שאפשר טוב יותר.
          </p>
        </div>

        {/* Before vs After — stacked vertically */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          {/* Before */}
          <div
            style={{
              flex: 1,
              backgroundColor: DARK_CARD,
              borderRadius: 20,
              padding: '24px 28px',
              border: `1px solid ${RED}15`
            }}
          >
            <div
              style={{
                fontFamily: "'DM Sans', 'Heebo', sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: RED,
                marginBottom: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <X size={18} color={RED} strokeWidth={3} /> לפני סטודיוז
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {before.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: `${RED}12`,
                      border: `1px solid ${RED}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <item.Icon size={20} color={RED} strokeWidth={1.8} />
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: LIGHT_TEXT }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: GOLD,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 30px ${GOLD}30`
              }}
            >
              <ArrowDown size={26} color={DARK_BG} strokeWidth={2.5} />
            </div>
          </div>

          {/* After */}
          <div
            style={{
              flex: 1,
              backgroundColor: DARK_CARD,
              borderRadius: 20,
              padding: '24px 28px',
              border: `1px solid ${GOLD}20`
            }}
          >
            <div
              style={{
                fontFamily: "'DM Sans', 'Heebo', sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: GOLD,
                marginBottom: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Check size={18} color={GOLD} strokeWidth={3} /> אחרי סטודיוז
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {after.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: `${GOLD}12`,
                      border: `1px solid ${GOLD}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <item.Icon size={20} color={GOLD} strokeWidth={1.8} />
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: LIGHT_TEXT }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom brand */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT }}>
              studioz.co.il
            </span>
            <Img src={staticFile('logo.png')} style={{ width: 32, height: 32, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
