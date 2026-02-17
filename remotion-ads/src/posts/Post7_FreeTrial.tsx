import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

const GOLD = '#ffd166';
const DARK_BG = '#0a0e14';
const DARK_CARD = '#13171d';
const LIGHT_TEXT = '#f1f5f9';
const SUBTLE_TEXT = '#b8c0cc';
const SUCCESS = '#10b981';

const RTL: React.CSSProperties = { direction: 'rtl' };

export const Post7_FreeTrial: React.FC = () => {
  const benefits = [
    { icon: '📅', text: 'הזמנות אוטומטיות' },
    { icon: '💳', text: 'סליקה מובנית' },
    { icon: '📊', text: 'דשבורד ניהולי' },
    { icon: '🛡️', text: 'הגנה מביטולים' },
    { icon: '🌐', text: 'עמוד סטודיו מקצועי' },
    { icon: '🔔', text: 'התראות חכמות' }
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '70px 100px',
        ...RTL
      }}
    >
      {/* Right side - CTA */}
      <div style={{ flex: 1, paddingLeft: 80 }}>
        <Img src={staticFile('logo.png')} style={{ width: 72, height: 72, borderRadius: 16, marginBottom: 30 }} />

        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 62,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: '0 0 16px',
            lineHeight: 1.25
          }}
        >
          הסטודיו שלך{'\n'}
          <span style={{ color: GOLD }}>מוכן לשדרוג?</span>
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 26,
            color: SUBTLE_TEXT,
            margin: '0 0 40px',
            lineHeight: 1.6
          }}
        >
          התחל בחינם. בלי כרטיס אשראי.{'\n'}
          בלי התחייבות. פשוט תנסה.
        </p>

        {/* CTA button */}
        <div
          style={{
            backgroundColor: GOLD,
            borderRadius: 18,
            padding: '22px 52px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: `0 0 50px ${GOLD}25`,
            marginBottom: 20
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 30,
              fontWeight: 700,
              color: DARK_BG
            }}
          >
            הצטרף עכשיו — בחינם
          </span>
          <span style={{ fontSize: 26 }}>←</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <span style={{ fontSize: 16 }}>🔗</span>
          <span
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 20,
              color: SUBTLE_TEXT
            }}
          >
            הלינק בביו
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 20,
              color: GOLD,
              fontWeight: 600,
              marginRight: 8
            }}
          >
            studioz.co.il
          </span>
        </div>
      </div>

      {/* Left side - benefits grid */}
      <div
        style={{
          flex: 0.85,
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        <div
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 22,
            fontWeight: 600,
            color: LIGHT_TEXT,
            marginBottom: 8
          }}
        >
          מה מקבלים?
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {benefits.map((b, i) => (
            <div
              key={i}
              style={{
                width: 'calc(50% - 7px)',
                backgroundColor: DARK_CARD,
                borderRadius: 16,
                padding: '22px 20px',
                border: '1px solid rgba(255,209,102,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 14
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  backgroundColor: `${GOLD}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <span style={{ fontSize: 22 }}>{b.icon}</span>
              </div>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 19,
                  color: LIGHT_TEXT,
                  fontWeight: 500
                }}
              >
                {b.text}
              </span>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            marginTop: 10,
            justifyContent: 'center'
          }}
        >
          {[
            { icon: '🔒', text: 'מאובטח' },
            { icon: '⚡', text: 'הקמה ב-5 דקות' },
            { icon: '❤️', text: 'בשימוש עשרות אולפנים' }
          ].map((badge, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>{badge.icon}</span>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 15,
                  color: SUBTLE_TEXT
                }}
              >
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
