import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

const GOLD = '#d4a843';
const LIGHT_BG = '#f8f9fb';
const LIGHT_CARD = '#ffffff';
const DARK_TEXT = '#1a1d23';
const SUBTLE_TEXT = '#6b7280';
const RED = '#dc2626';

const RTL: React.CSSProperties = { direction: 'rtl' };

export const Post6_WhyWeBuilt_Light: React.FC = () => {
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
    <AbsoluteFill
      style={{
        backgroundColor: LIGHT_BG,
        display: 'flex',
        flexDirection: 'column',
        padding: '70px 100px',
        ...RTL
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Img src={staticFile('logo.png')} style={{ width: 48, height: 48, borderRadius: 10 }} />
        </div>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 56,
            fontWeight: 700,
            color: DARK_TEXT,
            margin: '0 0 12px',
            lineHeight: 1.3
          }}
        >
          למה בנינו את <span style={{ color: GOLD }}>סטודיוז</span>?
        </h1>
        <p style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 24, color: SUBTLE_TEXT, margin: 0 }}>
          כי ידענו שאפשר טוב יותר.
        </p>
      </div>

      {/* Before vs After */}
      <div style={{ display: 'flex', gap: 40, flex: 1 }}>
        {/* Before */}
        <div
          style={{
            flex: 1,
            backgroundColor: LIGHT_CARD,
            borderRadius: 24,
            padding: '36px 40px',
            border: `1px solid ${RED}15`,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
          }}
        >
          <div
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: RED,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            <span style={{ fontSize: 24 }}>❌</span> לפני סטודיוז
          </div>
          <p
            style={{
              fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
              fontSize: 18,
              color: SUBTLE_TEXT,
              margin: '0 0 28px'
            }}
          >
            ככה ניהלנו את הסטודיו שלנו. ככה רוב בעלי הסטודיואים מנהלים.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {before.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: `${RED}08`,
                    border: `1px solid ${RED}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                </div>
                <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: DARK_TEXT }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80 }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              backgroundColor: GOLD,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 20px ${GOLD}40`
            }}
          >
            <span style={{ fontSize: 32, transform: 'scaleX(-1)' }}>➡️</span>
          </div>
        </div>

        {/* After */}
        <div
          style={{
            flex: 1,
            backgroundColor: LIGHT_CARD,
            borderRadius: 24,
            padding: '36px 40px',
            border: `1px solid ${GOLD}25`,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
          }}
        >
          <div
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: GOLD,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            <span style={{ fontSize: 24 }}>✅</span> אחרי סטודיוז
          </div>
          <p
            style={{
              fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
              fontSize: 18,
              color: SUBTLE_TEXT,
              margin: '0 0 28px'
            }}
          >
            בנינו בדיוק את מה שהיינו צריכים. עכשיו גם לכם.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {after.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: `${GOLD}12`,
                    border: `1px solid ${GOLD}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                </div>
                <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: DARK_TEXT }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
