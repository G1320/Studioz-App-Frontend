import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

const GOLD = '#d4a843';
const BG = '#f8f9fb';
const CARD = '#ffffff';
const TEXT = '#141820';
const SUB = '#5a6270';
const RED = '#dc2626';
const RTL: React.CSSProperties = { direction: 'rtl' };
const CARD_SHADOW = '0 1px 4px rgba(0,0,0,0.06)';

export const Post6_WhyWeBuilt_V2_Light: React.FC = () => {
  const before = [
    { icon: '📱', text: 'הזמנות בוואטסאפ' },
    { icon: '📋', text: 'יומן בגוגל' },
    { icon: '🧮', text: 'חשבוניות ידניות' },
    { icon: '🤷', text: 'ביטולים בלי פיצוי' }
  ];
  const after = [
    { icon: '🚀', text: 'הזמנות אוטומטיות 24/7' },
    { icon: '📊', text: 'דשבורד חכם בזמן אמת' },
    { icon: '💳', text: 'סליקה ותשלומים מובנים' },
    { icon: '🛡️', text: 'הגנה אוטומטית מביטולים' }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, ...RTL }}>
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
              color: TEXT,
              margin: '0 0 10px',
              lineHeight: 1.3
            }}
          >
            למה בנינו את <span style={{ color: GOLD }}>סטודיוז</span>?
          </h1>
          <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: SUB, margin: 0 }}>
            כי ידענו שאפשר טוב יותר.
          </p>
        </div>

        {/* Before vs After — stacked vertically */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          {/* Before */}
          <div
            style={{
              flex: 1,
              backgroundColor: CARD,
              borderRadius: 20,
              padding: '24px 28px',
              boxShadow: CARD_SHADOW
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
              <span style={{ fontSize: 20 }}>❌</span> לפני סטודיוז
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: TEXT }}>
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
              <span style={{ fontSize: 24, transform: 'rotate(90deg) scaleX(-1)' }}>➡️</span>
            </div>
          </div>

          {/* After */}
          <div
            style={{
              flex: 1,
              backgroundColor: CARD,
              borderRadius: 20,
              padding: '24px 28px',
              boxShadow: CARD_SHADOW
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
              <span style={{ fontSize: 20 }}>✅</span> אחרי סטודיוז
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: TEXT }}>
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
            <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 14, color: SUB }}>
              studioz.co.il
            </span>
            <Img src={staticFile('logo.png')} style={{ width: 32, height: 32, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
