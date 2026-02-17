import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

const GOLD = '#d4a843';
const BG = '#f8f9fb';
const CARD = '#ffffff';
const TEXT = '#141820';
const SUB = '#5a6270';
const RTL: React.CSSProperties = { direction: 'rtl' };
const CARD_SHADOW = '0 1px 4px rgba(0,0,0,0.06)';

export const Post7_FreeTrial_V2_Light: React.FC = () => {
  const benefits = [
    { icon: '📅', text: 'הזמנות אוטומטיות' },
    { icon: '💳', text: 'סליקה מובנית' },
    { icon: '📊', text: 'דשבורד ניהולי' },
    { icon: '🛡️', text: 'הגנה מביטולים' },
    { icon: '🌐', text: 'עמוד סטודיו מקצועי' },
    { icon: '🔔', text: 'התראות חכמות' }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, ...RTL }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '60px 60px 50px'
        }}
      >
        {/* Logo */}
        <Img src={staticFile('logo.png')} style={{ width: 64, height: 64, borderRadius: 14, marginBottom: 28 }} />

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 68,
            fontWeight: 700,
            color: TEXT,
            margin: '0 0 14px',
            lineHeight: 1.25
          }}
        >
          הסטודיו שלך{'\n'}
          <span style={{ color: GOLD }}>מוכן לשדרוג?</span>
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 24,
            color: SUB,
            margin: '0 0 32px',
            lineHeight: 1.6
          }}
        >
          התחל בחינם. בלי כרטיס אשראי.{'\n'}
          בלי התחייבות. פשוט תנסה.
        </p>

        {/* CTA */}
        <div
          style={{
            backgroundColor: GOLD,
            borderRadius: 16,
            padding: '20px 44px',
            display: 'inline-flex',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: 12,
            boxShadow: `0 4px 16px ${GOLD}40`,
            marginBottom: 36
          }}
        >
          <span
            style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 700, color: '#ffffff' }}
          >
            הצטרף עכשיו — בחינם
          </span>
          <span style={{ fontSize: 24, color: '#ffffff' }}>←</span>
        </div>

        {/* Benefits header */}
        <div
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 20,
            fontWeight: 600,
            color: TEXT,
            marginBottom: 14
          }}
        >
          מה מקבלים?
        </div>

        {/* Benefits grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, flex: 1 }}>
          {benefits.map((b, i) => (
            <div
              key={i}
              style={{
                width: 'calc(50% - 6px)',
                backgroundColor: CARD,
                borderRadius: 14,
                padding: '18px 18px',
                boxShadow: CARD_SHADOW,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  backgroundColor: `${GOLD}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <span style={{ fontSize: 20 }}>{b.icon}</span>
              </div>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 18,
                  color: TEXT,
                  fontWeight: 500
                }}
              >
                {b.text}
              </span>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', paddingTop: 16, paddingBottom: 8 }}>
          {[
            { icon: '🔒', text: 'מאובטח' },
            { icon: '⚡', text: 'הקמה ב-5 דקות' },
            { icon: '❤️', text: 'בשימוש עשרות אולפנים' }
          ].map((badge, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>{badge.icon}</span>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUB }}>
                {badge.text}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom brand */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: GOLD, fontWeight: 600 }}>
              studioz.co.il
            </span>
            <Img src={staticFile('logo.png')} style={{ width: 36, height: 36, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
